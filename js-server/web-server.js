const getPkmn = require('./functions/getPkmn');
const getAll = require('./functions/getAllTypes');

const express = require('express')
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

// Details about a specific Pkmn url-example .../pokemon/Bisasam?lang=de
app.get("/pokemon/:pkmn", (req, res) => {
  let name = req.params.pkmn;
  if (!name) {
    next();
  } else {
    const query = req.query;
    if (!query.lang) {
      res.status(418).send({ message: "Please specify a language." });
    } else {
      langs = ["de", "en"];
      if (langs.includes(query.lang)) {
        getPkmn.getDetailsAboutOneSpecific(res, name, query.lang);
      } else
        res.status(418).send({ message: "Please specify a correct language." })
    }
  }
});

// get Pokémon by their Types .../pokemon/?lang=de&type=Grass&type=Dark
app.get("/pokemon", (req, res) => {
  let type = req.query.type;
  console.log(req.query);
  langs = ["de", "en"];
  if (!req.query.lang || !langs.includes(req.query.lang)) {
    res.status(418).send({ message: "Please specify a language." });
  } else {
    if (Array.isArray(type)) {
      if (req.query.strict == "true") {
        getPkmn.withTypesStrict(res, type);
      } else {
        getPkmn.withTypesNotStrict(res, type);
      }
    } else {
      getPkmn.bySingleType(res, type);
    }

  }
});

app.get("/types", (req, res) => {
  getAll.getAllTypes(res);
});