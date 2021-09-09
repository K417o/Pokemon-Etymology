const filterBy = require("./functions/filterBy");
const getAll = require("./functions/getAll");
const pokeRouter = require("./routes/pokemon");

const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/pokemon", pokeRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// get all the Pokémontypes
app.get("/types", async (req, res) => {
  try {
    const data = await getAll.types();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// get all the Pokémon-Categories
app.get("/categories", async (req, res) => {
  try {
    const data = await getAll.categories();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// get all the Colours in which Pokémon appear
app.get("/colours", async (req, res) => {
  try {
    const data = await getAll.colours();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});
