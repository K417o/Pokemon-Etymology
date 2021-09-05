const { Router } = require("express");
const router = Router();
const filterBy = require("../functions/filterBy");
const getAll = require("../functions/getAll");

// get all Pokémonnames
router.get("/all", (req, res) => {
  return getAll.pokemon(res);
});

// Details about a specific Pkmn url-example .../pokemon/Bisasam
router.get("/:pkmn", async (req, res, next) => {
  let name = req.params.pkmn;
  if (!name || name === "all") {
    next();
  } else {
    try {
      const pokeData = await filterBy.specificName(name);
      res.json(pokeData);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
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
router.get("/", (req, res) => {
  let type = req.query.type;
  let strict = req.query.strict;
  let colour = req.query.colour; // kann nur eine Farbe haben --> UNION
  let category = req.query.category; // kann nur eine Kategorie haben --> UNION
  //let origin = req.query.origin; erstmal eh nicht machbar

  let query = filterBy.buildQuery(type, strict, colour, category, res);
  console.log(query);
  return filterBy.getResponse(query, res);
});

module.exports = router;
