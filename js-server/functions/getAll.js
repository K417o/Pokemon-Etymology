const { Connection, query } = require("stardog");
const axios = require("axios");
const config = require("../config.json");
const conn = new Connection({
  username: config.username,
  password: config.password,
  endpoint: config.endpointURL,
});

let dataCache = new Map();

module.exports = {
  types: async function () {
    const cachedData = dataCache.get("types");
    if (cachedData != null) {
      return cachedData;
    }

    const spQuery = `
            PREFIX poke: <https://pokemonkg.org/ontology#>

            SELECT DISTINCT ?type where  {
                ?x poke:hasType ?type .
            }`;
    const responseData = await query
      .execute(
        conn,
        config.dbName,
        spQuery,
        "application/sparql-results+json",
        {
          limit: 30,
          reasoning: true,
          offset: 0,
        }
      )
      .then(({ body }) => {
        let response = [];
        for (i in body.results.bindings) {
          let type = body.results.bindings[i].type.value;
          response.push(type.slice(40));
        }
        return response;
      });

    dataCache.set("types", responseData);

    return responseData;
  },
  categories: async function () {
    const cachedData = dataCache.get("categories");
    if (cachedData != null) {
      return cachedData;
    }

    const spQuery = `
            PREFIX poke: <https://pokemonkg.org/ontology#>

            SELECT DISTINCT ?genus where  {
                ?pkmn a poke:Species ;
                      poke:hasGenus ?genus .
                  
                FILTER(lang(?genus)='${config.language}')
            }
        `;
    const responseData = await query
      .execute(
        conn,
        config.dbName,
        spQuery,
        "application/sparql-results+json",
        {
          limit: 1000,
          reasoning: true,
          offset: 0,
        }
      )
      .then(({ body }) => {
        let response = [];
        for (i in body.results.bindings) {
          let category = body.results.bindings[i].genus.value;
          response.push(category.slice(0, category.length - 9));
        }
        return response;
      });

    dataCache.set("categories", responseData);

    return responseData;
  },
  pokemon: async function () {
    const cachedData = dataCache.get("pokemon");
    if (cachedData != null) {
      return cachedData;
    }

    const spQuery = `
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX poke: <https://pokemonkg.org/ontology#>

            SELECT DISTINCT ?name where  {
                ?pkmn a poke:Species ;    
                      rdfs:label ?name .
                FILTER(lang(?name)='${config.language}')
            }
        `;
    const responseData = await query
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
      .then(({ body }) => {
        let response = [];
        for (i in body.results.bindings) {
          let pkmn = body.results.bindings[i].name.value;
          response.push(pkmn);
        }
        return response;
      });

    dataCache.set("pokemon", responseData);

    return responseData;
  },
  colours: async function () {
    const cachedData = dataCache.get("colours");
    if (cachedData != null) {
      return cachedData;
    }

    const spQuery = `
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX poke: <https://pokemonkg.org/ontology#>

            SELECT ?colour where  {
                ?pkmn poke:hasColour ?colourDbp .     
                SERVICE <http://dbpedia.org/sparql>{
                    ?colourDbp rdfs:label ?colour .  
                }
                FILTER(lang(?colour)='${config.language}')
            }
        `;
    const responseData = await query
      .execute(
        conn,
        config.dbName,
        spQuery,
        "application/sparql-results+json",
        {
          limit: 30,
          reasoning: true,
          offset: 0,
        }
      )
      .then(({ body }) => {
        let response = [];
        for (i in body.results.bindings) {
          let colour = body.results.bindings[i].colour.value;
          response.push(colour);
        }
        return response;
      });

    dataCache.set("colours", responseData);

    return responseData;
  },
  origins: async function () {
    const cachedData = dataCache.get("origins");
    if (cachedData != null) {
      return cachedData;
    }

    const spQuery = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX poke: <https://pokemonkg.org/ontology#>
    PREFIX pokeetym: <urn:pokeetymology:ontology#>
    
    SELECT DISTINCT ?origin where  {
        ?pkmn a poke:Species ;    
        pokeetym:inspiredBy ?origin .
    }`;

    const responseData = await query
      .execute(
        conn,
        config.dbName,
        spQuery,
        "application/sparql-results+json",
        {
          limit: 10000,
          reasoning: true,
          offset: 0,
        }
      )
      .then(({ body }) => {
        const data = body.results.bindings;

        return Promise.all(
          data.map(async (pokeData) => {
            const origin = pokeData.origin.value;
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
      });

    dataCache.set("origins", responseData);

    return responseData;
  },
};
