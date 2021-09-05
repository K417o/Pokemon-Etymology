const filterBy = require('./functions/filterBy');
const getAll = require('./functions/getAll');
const pokeRouter = require("./routes/pokemon");

const express = require('express')
const app = express()
const port = 3000;
const cors = require('cors');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/pokemon", pokeRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
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