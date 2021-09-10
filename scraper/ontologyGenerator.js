const fs = require("fs");
const entitiesFile = "../assets/entities.ttl";
const etymologyDataFile = require("../assets/complete-etymologies-with-resolved-refs.json");

function generateEntity(etymologyData) {
  const pokemon = `pokespecies:${etymologyData["name@en"]
    .replace(/ |'/, "-")
    .replace(/\|.:/, "")
    .toLowerCase()}`;
  const inspiredBy = "pokeetym:inspiredBy";
  const refs = etymologyData.refs.map((ref) => `wd:${ref}`);
  const hasShape = "poke:hasShape";
  const silhouette = "<" + etymologyData.silhouette + ">";
  const depiction = "foaf:depiction";
  const image = "<" + etymologyData.image + ">";
  const pokemonPadding = " ".repeat(pokemon.length);

  return `${pokemon} ${inspiredBy} ${refs.reduce((prev, cur, index) => {
    let pokeInspiredByPadding = pokemonPadding + " ".repeat(inspiredBy.length + 2);
    let separator = " ,\n";

    if (index === 0) pokeInspiredByPadding = "";
    if (index === refs.length - 1) separator = " ;";

    return prev + pokeInspiredByPadding + cur + separator;
  }, "")}
${pokemonPadding} ${hasShape} ${silhouette} ;
${pokemonPadding} ${depiction} ${image} .\n`;
}

const owlEntities = etymologyDataFile.map(generateEntity);

const stream = fs.createWriteStream(entitiesFile);
stream.write(owlEntities.join("\n\n"));
stream.close();