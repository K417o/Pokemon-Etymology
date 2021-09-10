const puppeteer = require("puppeteer");
const fs = require("fs");
const extendedEtymologies = require("../assets/extended-etymologies.json");

async function getPokeImage(name) {
  const baseUrl = "https://www.pokewiki.de/";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(baseUrl + name);
  const imageContainer = await page.$x(
    "/html/body/div[3]/div/div[4]/div/div[3]/div[4]/div/table[2]/tbody/tr[2]/td/div"
  );
  const pokeImage =
    baseUrl +
    (await imageContainer[0].$eval("img", (img) => img.getAttribute("src")));

  await page.close();
  await browser.close();

  return pokeImage;
}

async function getNameEtymology(name) {
  const baseUrl = "https://www.pokewiki.de";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`${baseUrl}/${name}`);

  const description = (
    await page.$$eval("div.mw-parser-output > *", (nodes) =>
      nodes
        .filter(
          (el) => el.querySelector("#Herkunft_und_Namensbedeutung") != null
        )
        .map((el) => el.nextElementSibling.innerHTML)
    )
  )[0];

  const germanName = await (
    await page.$x('//*[@id="firstHeading"]')
  )[0].evaluate((el) => el.textContent);

  const refs = description
    .match(/href="([^\"]*)"/g)
    .map((href) => href.match(/"([^\"]*)"/)[1]);

  const imageContainer = await page.$x(
    "/html/body/div[3]/div/div[4]/div/div[3]/div[4]/div/table[2]/tbody/tr[2]/td/div"
  );
  const pokeImage =
    baseUrl +
    (await imageContainer[0].$eval("img", (img) => img.getAttribute("src")));

  await page.close();
  await browser.close();

  return {
    "name@de": germanName,
    "name@en": name,
    image: pokeImage,
    refs,
  };
}

async function getFurtherDetails(name) {
  const baseUrl = "https://www.pokewiki.de";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.goto(`${baseUrl}/${name}`);

  const table = (
    await page.$x(
      "/html/body/div[3]/div/div[4]/div/div[3]/div[4]/div/table[2]/tbody"
    )
  )[0];

  let properties = new Map();

  const trs = await table.$$("tr");

  for (let tr of trs) {
    const keyCell =
      (await tr.$("td > a")) != null ? await tr.$("td > a") : await tr.$("td");
    const valueCell = await tr.$("td + td");

    if (keyCell == null || valueCell == null) continue;

    const key = await keyCell.evaluate((cell) => cell.textContent);

    const value =
      key === "Silhouette"
        ? baseUrl +
          (await (
            await valueCell.$("img")
          ).evaluate(async (el) => el.getAttribute("src")))
        : await valueCell.evaluate((td) => td.textContent);

    if (await tr.evaluate((el) => el.children.length === 2)) {
      properties.set(key, value);
    }
  }

  const types = await Promise.all(
    (
      await (
        await page.$x(
          "/html/body/div[3]/div/div[4]/div/div[3]/div[4]/div/table[2]/tbody/tr[4]/td[2]"
        )
      )[0].$$("a")
    ).map(
      async (a) =>
        a.evaluate((el) => el.getAttribute("title"))
    )
  );

  const category = properties.get("Kategorie").match(/([^\n]*)\n/)[1];

  const height = properties.get("Größe").match(/(^[^m]*?m)/)[1];

  const weight = properties.get("Gewicht").match(/(^[^kg]*?kg)/)[1];

  const colour = properties.get("Farbe").match(/([^\n]*)\n/)[1];

  const silhouette = properties.get("Silhouette");

  await table.dispose();
  await Promise.all(trs.map((tr) => tr.dispose()));
  await page.goto("about:blank");
  await page.close();
  await browser.close();

  return {
    types,
    category,
    height,
    weight,
    colour,
    silhouette,
  };
}

async function main() {
  let testEtym = [];

  for (let etym of extendedEtymologies) {
    let retries = 5;
    while (retries > 0) {
      try {
        const furtherDetails = await getFurtherDetails(
          etym["name@de"]        );
        testEtym.push({
          ...etym,
          ...furtherDetails,
        });
        /*console.log(`Successfully got info for ${etym["name@de"]}`, {
          etymology: {
            ...etym,
            ...furtherDetails,
          },
        });*/
        break;
      } catch (errorMessage) {
        retries--;
        console.error({
          errorMessage,
          etymology: etym["name@de"],
        });
      }
    }
  }

  const stream = fs.createWriteStream("../assets/test-etymologies.json");
  stream.write(JSON.stringify(testEtym));
  stream.close();
}

main();
//getFurtherDetails("Blastoise").then(console.log);
