const getPkmn = require('./functions/getPkmnByType')

const express = require('express')
const app = express()
const port = 3000

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get("/url", (req, res, next) => {
  let name = req.body.pokemon;
  getPkmn.byType(res, name);
 });