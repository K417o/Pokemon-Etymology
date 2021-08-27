const filterBy = require('./functions/filterBy');
const getAll = require('./functions/getAll');

const express = require('express')
const app = express()
const port = 3000;
const cors = require('cors');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

// Details about a specific Pkmn url-example .../pokemon/Bisasam
app.get("/pokemon/:pkmn", (req, res, next) => {
  let name = req.params.pkmn;
  if (!name || name === "all") {
    next();
  } else {
    filterBy.specificName(res, name);
  }
});

// get all the Pokémontypes
app.get("/types", (req, res) => {
  getAll.types(res);
});

// get all the Pokémon-Categories
app.get("/categories", (req, res) => {
  getAll.categories(res);
});

// get all the Colours in which Pokémon appear
app.get("/colours", (req, res) => {
  getAll.colours(res);
});

// get all Pokémonnames
app.get("/pokemon/all", (req, res) => {
  getAll.pokemon(res);
});

// get Pokémon by their Types .../pokemon/?lang=de&type=Grass&type=Dark
/**
 * query-params: 
 * type = [] or ""
 * strict boolean
 * colour = [] or ""
 * category = ""
 * origin = ""
 */
app.get("/pokemon", (req, res) => {
  let type = req.query.type;
  let strict = req.query.strict;
  let colour = req.query.colour; // kann nur eine Farbe haben --> UNION
  let category = req.query.category; // kann nur eine Kategorie haben --> UNION
  //let origin = req.query.origin; erstmal eh nicht machbar

  let query = filterBy.buildQuery(type, strict, colour, category, res);
  console.log(query);
  filterBy.getResponse(query, res);
});
