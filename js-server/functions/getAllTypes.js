const config = require('../config.json');
const { Connection, query } = require('stardog');
const conn = new Connection({
    username: config.username,
    password: config.password,
    endpoint: config.endpointURL,
});

module.exports = {
    getAllTypes: function (res) {
        const spQuery = `
            PREFIX poke: <https://pokemonkg.org/ontology#>

            SELECT DISTINCT ?type where  {
                ?x poke:hasType ?type .
            }`
        query.execute(conn, config.dbName, spQuery, 'application/sparql-results+json', {
            limit: 30,
            reasoning: true,
            offset: 0,
        }).then(({ body }) => {
            let response = [];
            for (i in body.results.bindings){
                let type = body.results.bindings[i].type.value;
                response.push(type.substr(41));
            }
            return res.json(response);
        }).catch(err => {
            res.sendStatus(404);
        });
    }
};
