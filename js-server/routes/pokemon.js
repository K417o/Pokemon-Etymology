const { Router } = require("express");
const router = Router();
const filterBy = require("../functions/filterBy");
const getAll = require("../functions/getAll");

// get all Pokémonnames
router.get("/all", async (req, res) => {
    try {
        const data = await getAll.pokemon();
        res.json(data);
    } catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Details about a specific Pkmn url-example .../pokemon/Bisasam
router.get("/:pkmn", async (req, res, next) => {
  let name = req.params.pkmn;
  if (!name || name === "all") {
    next();
  } else {
    try {
      const pokeData = await filterBy.specificName(name);
      if (pokeData == null) {
        return res.sendStatus(404);
        
      }
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
router.get("/", async (req, res) => {
  const type = req.query.type;
  const origin = req.query.origin;
  const strict = req.query.strict;
  const colour = req.query.colour; // kann nur eine Farbe haben --> UNION
  const category = req.query.category; // kann nur eine Kategorie haben --> UNION

  //let origin = req.query.origin; erstmal eh nicht machbar

  let query = filterBy.buildQuery(type, strict, colour, category, origin);
  
  try {
    const data = await filterBy.getResponse(query);
    res.json(data);
  } catch(err) {
      console.error(err);
      res.sendStatus(500);
  }
});

module.exports = router;
