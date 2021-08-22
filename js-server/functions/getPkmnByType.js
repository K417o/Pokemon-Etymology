const { Connection, query } = require('stardog');
const conn = new Connection({
  username: 'admin',
  password: 'admin',
  endpoint: 'https://webengineering.ins.hs-anhalt.de:40159/',
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
  byType: function (res, pkmnName) {
    const spQuery = `
          PREFIX owl:  <http://www.w3.org/2002/07/owl#>
          PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX foaf: <http://xmlns.com/foaf/0.1/>
          PREFIX poke: <https://pokemonkg.org/ontology#>
          PREFIX dbpedia:	<http://dbpedia.org/resource/>
          PREFIX qudt: <http://qudt.org/schema/qudt/>

          SELECT ?name ?type ?colour ?genus ?height ?weight where  {
              ?pkmn rdfs:label "` + pkmnName + `"@de ;
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
    
              FILTER(lang(?colour)='de')
              FILTER(lang(?name)='de')
              FILTER(lang(?genus)='de')
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
