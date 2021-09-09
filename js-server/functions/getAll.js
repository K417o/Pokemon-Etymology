const config = require("../config.json");
const { Connection, query } = require("stardog");
const conn = new Connection({
  username: config.username,
  password: config.password,
  endpoint: config.endpointURL,
});

module.exports = {
  types: function () {
    const spQuery = `
            PREFIX poke: <https://pokemonkg.org/ontology#>

            SELECT DISTINCT ?type where  {
                ?x poke:hasType ?type .
            }`;
    return query
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
          response.push(type.substr(40));
        }
        return response;
      });
  },
  categories: function () {
    const spQuery = `
            PREFIX poke: <https://pokemonkg.org/ontology#>

            SELECT DISTINCT ?genus where  {
                ?pkmn a poke:Species ;
                      poke:hasGenus ?genus .
                  
                FILTER(lang(?genus)='${config.language}')
            }
        `;
    return query
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
          response.push(category.substr(0, category.length - 9));
        }
        return response;
      });
  },
  pokemon: function () {
    const spQuery = `
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX poke: <https://pokemonkg.org/ontology#>

            SELECT DISTINCT ?name where  {
                ?pkmn a poke:Species ;    
                      rdfs:label ?name .
                FILTER(lang(?name)='${config.language}')
            }
        `;
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
      .then(({ body }) => {
        let response = [];
        for (i in body.results.bindings) {
          let pkmn = body.results.bindings[i].name.value;
          response.push(pkmn);
        }
        return response;
      });
  },
  colours: function () {
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
    return query
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
  },
};
