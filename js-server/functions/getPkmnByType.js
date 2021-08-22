const { Connection, query } = require('stardog');
const conn = new Connection({
    username: 'admin',
    password: 'admin',
    endpoint: 'https://webengineering.ins.hs-anhalt.de:40159/',
  });

module.exports = {
    byType: function (res) {
          const spQuery = `
          PREFIX owl:  <http://www.w3.org/2002/07/owl#>
          PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX foaf: <http://xmlns.com/foaf/0.1/>
          PREFIX poke: <https://pokemonkg.org/ontology#>
          PREFIX dbpedia:	<http://dbpedia.org/resource/>
          
          SELECT * WHERE {
              ?pokemon a poke:Species.
              ?pokemon poke:hasType poke:Pok��Type:Dark
          }`

          query.execute(conn, 'Test', spQuery, 'application/sparql-results+json', {
            limit: 1000,
            reasoning: true,
            offset: 0,
          }).then(({ body }) => {
            return res.json(body.results.bindings);
          }).catch(err => {
              res.sendStatus(404)
          });

        
    },
    byName: function () {
      // whatever
    }
  };
  