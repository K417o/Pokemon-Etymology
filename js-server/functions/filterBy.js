const { Connection, query } = require("stardog");
const axios = require("axios");
const config = require("../config.json");
const { colours } = require("./getAll");
const conn = new Connection({
  username: config.username,
  password: config.password,
  endpoint: config.endpointURL,
});

let dataCache = new Map();

/**
 * info about pokemon
 * hasColour
 * hasGenus@de @en
 * hasHeight
 * hasType
 * hasWeight
 * label
 * comment --> ist nur en und mit vielen Zeichenfehlern, weglassen daher
 * origin
 * pic
 * --> am besten einfach hier mitschicken welche Sprache man haben will, weil sonst einfach jeder mit jedem tanzt
 */
module.exports = {
  specificName: function (pkmnName) {
    // Very basic check to prevent injections
    if (/[;\\\,]/.test(pkmnName)) return null;
    pkmnName = pkmnName.toLowerCase();

    const spQuery = `
          PREFIX owl:  <http://www.w3.org/2002/07/owl#>
          PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX foaf: <http://xmlns.com/foaf/0.1/>
          PREFIX poke: <https://pokemonkg.org/ontology#>
          PREFIX dbpedia:	<http://dbpedia.org/resource/>
          PREFIX qudt: <http://qudt.org/schema/qudt/>
          PREFIX pokeetym: <urn:pokeetymology:ontology#>


          SELECT ?name ?type ?colour ?genus ?height ?weight ?origin ?pic ?shape WHERE  {
            ?pkmn rdfs:label ?name ;
                  pokeetym:inspiredBy ?origin;
                  foaf:depiction ?pic;
                  poke:hasGenus ?genus ;
                  poke:hasType ?type ;
                  poke:hasHeight ?qudtH ;
                  poke:hasWeight ?qudtW ;
                  poke:hasShape ?shape ;
                  poke:hasColour ?colour . 
            ?qudtH qudt:quantityValue ?valueH.
            ?valueH qudt:value ?height .
            ?qudtW qudt:quantityValue ?valueW.
            ?valueW qudt:value ?weight .
            
            FILTER (lcase(str(?name)) = "${pkmnName}")
            FILTER(lang(?name)='${config.language}')
            FILTER(lang(?genus)='${config.language}')
        }`;

    return query
      .execute(
        conn,
        config.dbName,
        spQuery,
        "application/sparql-results+json",
        {
          limit: 20000,
          reasoning: true,
          offset: 0,
        }
      )
      .then(async ({ body }) => {
        const data = body.results.bindings;
        let response = {
          name: data[0].name.value,
          genus: data[0].genus.value,
          weight: data[0].weight.value,
          height: data[0].height.value,
          colour: data[0].colour.value,
        };
        let types = new Set();
        let origins = new Set();

        for (let result of data) {
          origins.add(result.origin.value);
          types.add(result.type.value.slice(40));

          if (/pokewiki/.test(result.shape.value)) {
            response.shape = result.shape.value;
          }

          if (/pokewiki/.test(result.pic.value)) {
            response.image = result.pic.value;
          }
        }

        response.types = Array.from(types);
        response.origins = await Promise.all(
          Array.from(origins).map((origin) => {
            const originQuery = `SELECT ?label ?description ?pic
          WHERE
          {
            wd:${origin.slice(32)} rdfs:label ?label .
            OPTIONAL { wd:${origin.slice(
              32
            )} schema:description ?description . }
            OPTIONAL { wd:${origin.slice(32)} wdt:P18 ?pic . }
            FILTER(LANG(?label) = "${
              config.language
            }" && LANG(?description) = "${config.language}")
          }`;

            return axios
              .get(
                `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(
                  originQuery
                )}`
              )
              .then((wikiRes) => ({
                label: wikiRes.data.results.bindings[0].label.value,
                description: wikiRes.data.results.bindings[0].description.value,
                image: wikiRes.data.results.bindings[0].pic.value,
                entity: origin.slice(32),
                entityURI: origin,
              }))
              .catch((_) => ({
                entity: origin.slice(32),
                entityURI: origin,
              }));
          })
        );

        return response;
      })
      .catch((errMessage) => {
        console.error(errMessage);
        return null;
      });
  },
  buildQuery: function (reqTypes, strict, reqColours, category, reqOrigins) {
    let spQuery = `
    PREFIX owl:  <http://www.w3.org/2002/07/owl#>
    PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX poke: <https://pokemonkg.org/ontology#>
    PREFIX dbpedia:	<http://dbpedia.org/resource/>
    PREFIX qudt: <http://qudt.org/schema/qudt/>
    PREFIX pokeetym: <urn:pokeetymology:ontology#>
    PREFIX wd: <https://www.wikidata.org/entity/> 

    SELECT DISTINCT ?name ?type ?colour ?genus ?height ?weight ?origin ?shape ?pic WHERE {`;

    if (Array.isArray(reqColours)) {
      reqColours.forEach((colour, index) => {
        if (index === reqColours.length - 1) {
          spQuery += `
          {
              ?pokemon poke:hasColour dbpedia:${colour} .
          }`;
        } else {
          spQuery += `
          {
              ?pokemon poke:hasColour dbpedia:${colour} .
          } 
          UNION `;
        }
      });
    } else {
      if (!!reqColours) {
        spQuery += `
          {
              ?pokemon poke:hasColour dbpedia:${reqColours} .
          }`;
      }
    }

    if (Array.isArray(reqTypes)) {
      console.log(reqTypes);
      if (strict == null || strict === "false") {
        reqTypes.forEach((type, index) => {
          if (index === reqTypes.length - 1) {
            spQuery += `
          {
              ?pokemon poke:hasType poke:PokeType:${type} .
          }`;
          } else {
            spQuery += `
          {
              ?pokemon poke:hasType poke:PokeType:${type} .
          } 
          UNION `;
          }
        });
      } else if (strict == "true") {
        reqTypes.forEach((type) => {
          spQuery += `
              ?pokemon poke:hasType poke:PokeType:${type} .`;
        });
      } else {
        return null;
      }
    } else {
      if (!!reqTypes) {
        spQuery += `
          {
              ?pokemon poke:hasType poke:PokeType:${reqTypes} .
          }`;
      }
    }

    if (Array.isArray(reqOrigins)) {
      if (strict == null || strict === "false") {
        reqOrigins.map((origin, index) => {
          if (index === reqOrigins.length - 1) {
            spQuery += `
          {
              ?pokemon pokeetym:inspiredBy wd:${origin} .
          }`;
          } else {
            spQuery += `
          {
              ?pokemon pokeetym:inspiredBy wd:${origin} .
          } 
          UNION `;
          }
        });
      } else if (strict == "true") {
        reqOrigins.map((origin) => {
          spQuery += `
              ?pokemon pokeetym:inspiredBy wd:${origin} .`;
        });
      } else {
        return null;
      }
    } else {
      if (!!reqOrigins) {
        spQuery += `
          {
              ?pokemon pokeetym:inspiredBy wd:${reqOrigins} .
          }`;
      }
    }

    if (!!category) {
      spQuery += `?pokemon poke:hasGenus "${category} Pokemon"@${config.language} .`;
    }

    spQuery += `
    ?pokemon a poke:Species;
          rdfs:label ?name ;
          poke:hasGenus ?genus ;
          poke:hasType ?type ;
          poke:hasHeight ?qudtH ;
          pokeetym:inspiredBy ?origin ;
          foaf:depiction ?pic ;
          poke:hasShape ?shape ;
          poke:hasWeight ?qudtW ;
          poke:hasColour ?colour .
    ?qudtH qudt:quantityValue ?valueH.
    ?valueH qudt:value ?height .
    ?qudtW qudt:quantityValue ?valueW.
    ?valueW qudt:value ?weight .
    
    
    FILTER(lang(?name)='${config.language}')
    FILTER(lang(?genus)='${config.language}')
  }`;
    return spQuery;
  },
  getResponse: async function (spQuery) {
    const cachedData = dataCache.get(spQuery);
    if (cachedData != null) {
      return cachedData;
    }

    const responseData = await query
      .execute(
        conn,
        config.dbName,
        spQuery,
        "application/sparql-results+json",
        {
          limit: 100000,
          reasoning: true,
          offset: 0,
        }
      )
      .then(({ body }) => {
        const data = body.results.bindings;
        let reducedData = new Map();

        // Reduce results into map
        data.forEach((dataSet) => {
          const pokeData = reducedData.get(dataSet.name.value);
          if (pokeData == null) {
            reducedData.set(dataSet.name.value, [dataSet]);
          } else {
            pokeData.push(dataSet);
          }
        });

        return Promise.all(
          Array.from(reducedData)
            .map((keyValuePair) => {
              const dataSet = keyValuePair[1];
              return dataSet.reduce(
                (prev, cur, index) => {
                  if (/pokewiki/.test(cur.shape.value)) {
                    prev.shape = cur.shape.value;
                  }
                  if (/pokewiki/.test(cur.pic.value)) {
                    prev.image = cur.pic.value;
                  }

                  prev.origins.add(cur.origin.value);
                  prev.types.add(cur.type.value.slice(40));

                  if (index === dataSet.length - 1) {
                    prev.origins = Array.from(prev.origins);
                    prev.types = Array.from(prev.types);
                  }

                  return prev;
                },
                {
                  name: dataSet[0].name.value,
                  genus: dataSet[0].genus.value,
                  weight: dataSet[0].weight.value,
                  height: dataSet[0].height.value,
                  colour: dataSet[0].colour.value.slice(28),
                  shape: undefined,
                  image: undefined,
                  origins: new Set(),
                  types: new Set(),
                }
              );
            })
            .map(async (pokeData) => {
              const resolvedOrigins = await Promise.all(
                Array.from(pokeData.origins).map((origin) => {
                  const originQuery = `SELECT ?pic ?label ?description
            WHERE
            {
              wd:${origin.slice(32)} wdt:P18 ?pic ;
                         schema:description ?description ;
                         rdfs:label ?label .
              FILTER(LANG(?label) = "${
                config.language
              }" && LANG(?description) = "${config.language}")
            }`;

                  return axios
                    .get(
                      `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(
                        originQuery
                      )}`
                    )
                    .then((wikiRes) => ({
                      label: wikiRes.data.results.bindings[0].label.value,
                      description:
                        wikiRes.data.results.bindings[0].description.value,
                      image: wikiRes.data.results.bindings[0].pic.value,
                      entity: origin.slice(32),
                      entityURI: origin,
                    }))
                    .catch((_) => ({
                      entity: origin.slice(32),
                      entityURI: origin,
                    }));
                })
              );

              return {
                ...pokeData,
                origins: resolvedOrigins,
              };
            })
        );
      });

    dataCache.set(spQuery, responseData);

    return responseData;
  },
};
