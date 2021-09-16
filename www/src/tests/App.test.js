import React from 'react';
import userEvent from '@testing-library/user-event';
import { AverageConsumption, LoginPage, RoomDetailsPage, RoomOverview, Fallback } from '../components/';
import { screen, waitFor } from '@testing-library/react';
import renderer from 'react-test-renderer';
import ReactDom from 'react-dom';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';

import App from '../components/App';
import { MultipleLabelKey, MultipleSelect, NameTable, PkmnCard, SingleSelect } from '../components/index';

let container;

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null
})

const nameTableDummie = { "deu": [{ "title": "Abrakadabra", "description": "https://de.wikipedia.org/wiki/Abrakadabra#", "positionInName": "0", "language": "https://iso639-3.sil.org/code/deu" }], "eng": [{ "title": "Abrakadabra", "description": "https://de.wikipedia.org/wiki/Abrakadabra#", "positionInName": "0", "language": "https://iso639-3.sil.org/code/eng" }], "jpn": [{ "title": "Edgar Cayce", "description": "https://de.wikipedia.org/wiki/Edgar_Cayce#", "positionInName": "0", "language": "https://iso639-3.sil.org/code/jpn" }], "fra": [{ "title": "Abrakadabra", "description": "https://de.wikipedia.org/wiki/Abrakadabra#", "positionInName": "0", "language": "https://iso639-3.sil.org/code/fra" }], "kor": [{ "title": "Aus dem Japanischen übernommen.", "description": null, "positionInName": "0", "language": "https://iso639-3.sil.org/code/kor" }], "zho": [{ "title": "Phonetische Übersetzung aus dem Japanischen.", "description": null, "positionInName": "0", "language": "https://iso639-3.sil.org/code/zho" }] };

test('SnapshotTest App', () => {
  const tree = renderer.create(<App />).toJSON()
  expect(tree).toMatchSnapshot()
})

test('SnapshotTest MultipleSelect', () => {
  const tree = renderer.create(<MultipleSelect options={["Abra", "Kadabra", "Simsala"]} name={"Pokémon"} />).toJSON()
  expect(tree).toMatchSnapshot()
})

test('SnapshotTest SingleSelect', () => {
  const tree = renderer.create(<SingleSelect options={["Abra", "Kadabra", "Simsala"]} name={"Pokémon"} />).toJSON()
  expect(tree).toMatchSnapshot()
})

test('SnapshotTest MultipleLabelKey', () => {
  const tree = renderer.create(<MultipleLabelKey options={["Abra", "Kadabra", "Simsala"]} name={"Pokémon"} />).toJSON()
  expect(tree).toMatchSnapshot()
})

test('SnapshotTest PkmnCard', () => {
  const tree = renderer.create(
    <PkmnCard
      name={"Abra"}
      types={[
        "Psychic"
      ]}
      height={"0.9"}
      weight={"19.5"}
      genus={"Psi Pokémon"}
      image={"https://www.pokewiki.de/images/thumb/4/44/Sugimori_063.png/250px-Sugimori_063.png"}
      colour={"http://dbpedia.org/resource/Brown"}
      shape={"https://www.pokewiki.de/images/thumb/0/07/Silhouette_6_HOME.png/24px-Silhouette_6_HOME.png"}
      click={true}
      key={"Abra"}
    />).toJSON()
  expect(tree).toMatchSnapshot()
})

test('SnapshotTest NameTable', () => {
  const tree = renderer.create(<NameTable nameParts={nameTableDummie} />).toJSON()
  expect(tree).toMatchSnapshot()
})
