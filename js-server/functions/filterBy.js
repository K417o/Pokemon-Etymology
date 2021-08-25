const config = require('../config.json');
const { Connection, query } = require('stardog');
const { colours } = require('./getAll');
const conn = new Connection({
  username: config.username,
  password: config.password,
  endpoint: config.endpointURL,
});

/**
 * info about pokemon
 * hasColour
 * hasGenus@de @en
 * hasHeight
 * hasTYpe
 * hasWeight
 * label
 * comment --> ist nur en und mit vielen Zeichenfehlern, weglassen daher
 * (origin, Bild)
 * --> am besten einfach hier mitschicken welche Sprache man haben will, weil sonst einfach jeder mit jedem tanzt
 */

module.exports = {
  specificName: function (res, pkmnName) {
    const spQuery = `
          PREFIX owl:  <http://www.w3.org/2002/07/owl#>
          PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX foaf: <http://xmlns.com/foaf/0.1/>
          PREFIX poke: <https://pokemonkg.org/ontology#>
          PREFIX dbpedia:	<http://dbpedia.org/resource/>
          PREFIX qudt: <http://qudt.org/schema/qudt/>

          SELECT ?name ?type ?colour ?genus ?height ?weight where  {
              ?pkmn rdfs:label "` + pkmnName + `"@` + config.language + ` ;
                    rdfs:label ?name ;
                    poke:hasGenus ?genus ;
                    poke:hasType ?type ;
                    poke:hasHeight ?qudtH ;
                    poke:hasWeight ?qudtW ;
                    poke:hasColour ?colourDbp .     
                    SERVICE <http://dbpedia.org/sparql>{
                          ?colourDbp rdfs:label ?colour    
                    }
              ?qudtH qudt:quantityValue ?valueH.
              ?valueH qudt:value ?height .
              ?qudtW qudt:quantityValue ?valueW.
              ?valueW qudt:value ?weight .
    
              FILTER(lang(?colour)='` + config.language + `')
              FILTER(lang(?name)='` + config.language + `')
              FILTER(lang(?genus)='` + config.language + `')
          }`

    query.execute(conn, config.dbName, spQuery, 'application/sparql-results+json', {
      limit: 1000,
      reasoning: true,
      offset: 0,
    }).then(({ body }) => {
      let data = body.results.bindings;
      let response = { name: data[0].name.value };
      let types = [];
      for (let i in data) {
        for (let j in data[i]) {
          response[j] = data[i][j].value;
          if (j === "type") {
            types.push(data[i][j].value.substr(41));
            response[j] = types;
          }
        }
      }
      return res.json(response);
    }).catch(err => {
      res.sendStatus(404)
    });


  },
  typesStrict: function (res, type) {
    console.log(type);
    const spQuery = `
    PREFIX poke: <https://pokemonkg.org/ontology#>

    SELECT DISTINCT * WHERE {
        {
            ?pokemon a poke:Species.
            ?pokemon poke:hasType poke:Pok��Type:` + type[0] + ` ,
                                  poke:Pok��Type:` + type[1] + ` .
        }
  
    }`;
    query.execute(conn, config.dbName, spQuery, 'application/sparql-results+json', {
      limit: 1000,
      reasoning: true,
      offset: 0,
    }).then(({ body }) => {
      let data = body.results.bindings;
      let response = [];
      for (let i in data) {
        response.push(data[i].pokemon.value);
      }
      return res.json(response);
    });
  },
  typesNotStrict: function (res, typeArray) {
    console.log(typeArray);

    let spQuery = `
    PREFIX poke: <https://pokemonkg.org/ontology#>
    SELECT DISTINCT * WHERE {`;

    typeArray.map((type, index) => {
      if (index === typeArray.length - 1) {
        spQuery += `
        {
            ?pokemon a poke:Species.
            ?pokemon poke:hasType poke:Pok��Type:` + type + ` .
        }`;
      } else {
        spQuery += `
        {
            ?pokemon a poke:Species.
            ?pokemon poke:hasType poke:Pok��Type:` + type + ` .
        } 
        UNION `;
      }
    });
    spQuery += '}';

    query.execute(conn, config.dbName, spQuery, 'application/sparql-results+json', {
      limit: 1000,
      reasoning: true,
      offset: 0,
    }).then(({ body }) => {
      let data = body.results.bindings;
      let response = [];
      for (let i in data) {
        response.push(data[i].pokemon.value);
      }
      return res.json(response);
    });
  },
  singleType: function (res, type) {
    const spQuery = `
    PREFIX poke: <https://pokemonkg.org/ontology#>

    SELECT DISTINCT * WHERE {
            ?pokemon a poke:Species.
            ?pokemon poke:hasType poke:Pok��Type:` + type + `.
    }`;

    query.execute(conn, config.dbName, spQuery, 'application/sparql-results+json', {
      limit: 1000,
      reasoning: true,
      offset: 0,
    }).then(({ body }) => {
      let data = body.results.bindings;
      let response = [];
      for (let i in data) {
        response.push(data[i].pokemon.value);
      }
      return res.json(response);
    });
  },
  buildQuery: function (reqTypes, strict, reqColours, category, res) {
    let spQuery = `
    PREFIX owl:  <http://www.w3.org/2002/07/owl#>
    PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX poke: <https://pokemonkg.org/ontology#>
    PREFIX dbpedia:	<http://dbpedia.org/resource/>
    PREFIX qudt: <http://qudt.org/schema/qudt/>

    SELECT DISTINCT ?name ?type ?colour ?genus ?height ?weight WHERE {`;

    let part = `?pokemon a poke:Species.`;


    if (Array.isArray(reqColours)) {
      part += `?pokemon poke:hasColour dbpedia:Green.`;
      reqColours.map((colour, index) => {
        if (index === reqColours.length - 1) {
          spQuery += `
          {
              ?pokemon poke:hasColour dbpedia:` + colour + ` .
          }`;
        } else {
          spQuery += `
          {
              ?pokemon poke:hasColour dbpedia:` + colour + ` .
          } 
          UNION `;
        }
      });
    } else {
      if (!!reqColours) {
        spQuery += `
          {
              ?pokemon poke:hasColour dbpedia:` + reqColours + ` .
          }`;
      }
    }

    if (Array.isArray(reqTypes)) {
      if (strict == "false") {
        reqTypes.map((type, index) => {
          if (index === reqTypes.length - 1) {
            spQuery += `
          {
              ?pokemon poke:hasType poke:Pok��Type:` + type + ` .
          }`;
          } else {
            spQuery += `
          {
              ?pokemon poke:hasType poke:Pok��Type:` + type + ` .
          } 
          UNION `;
          }
        });
      } else if (strict == "true"){
        reqTypes.map((type, index) => {
          spQuery += `
              ?pokemon poke:hasType poke:Pok��Type:` + type + ` .`;
        });
      } else {
        return res.sendStatus(403);
      }
    } else {
      if (!!reqTypes) {
        spQuery += `
          {
              ?pokemon poke:hasType poke:Pok��Type:` + reqTypes + ` .
          }`;
      }

    }
    if (!!category) {
      spQuery += `?pokemon poke:hasGenus "` + category + ` Pok��mon"@` + config.language + ` .`
    }


    spQuery += `
    ?pokemon a poke:Species;
          rdfs:label ?name ;
          poke:hasGenus ?genus ;
          poke:hasType ?type ;
          poke:hasHeight ?qudtH ;
          poke:hasWeight ?qudtW .
    ?qudtH qudt:quantityValue ?valueH.
    ?valueH qudt:value ?height .
    ?qudtW qudt:quantityValue ?valueW.
    ?valueW qudt:value ?weight .
    
    
    FILTER(lang(?name)='` + config.language + `')
    FILTER(lang(?genus)='` + config.language + `')
  }`;
    return spQuery;
  },
  getResponse: function (spQuery, res) {
    query.execute(conn, config.dbName, spQuery, 'application/sparql-results+json', {
      limit: 1000,
      reasoning: true,
      offset: 0,
    }).then(({ body }) => {
      let data = body.results.bindings;

      return res.json(data);
    }).catch((err) => {
      res.send(err);
    });
  }
};
