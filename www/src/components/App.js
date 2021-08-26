import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Container, Form } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css';
import { MultipleSelect, SingleSelect, PkmnCard } from './index';
import { getAll } from '../services/selectData';
import { filterData } from '../services/filterData';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.typeSelector = React.createRef();
    this.colourSelector = React.createRef();
    this.pokemonSelector = React.createRef();
    this.categorySelector = React.createRef();

    this.state = {
      types: [],
      categories: [],
      pokemon: [],
      colours: [],
      results: null
    }

    this.createCards = this.createCards.bind(this);
  }

  async getData() {
    let types = this.typeSelector.current;
    let colours = this.colourSelector.current;
    let pokemon = this.pokemonSelector.current;
    let categories = this.categorySelector.current;
    let strict = document.getElementById("checkbox").checked;

    let result = await filterData.getResults(types.state.selected, strict, colours.state.selected, categories.state.selected);
    this.setState({ results: result})
  };

  async componentDidMount() {
    this.setState({
      types: await getAll.types(),
      categories: await getAll.categories(),
      pokemon: await getAll.pokemon(),
      colours: await getAll.colours()
    })
  }

  createCards = () => {
    let cards = [];
    let pkmn;

    if (this.state.results != null) {
      pkmn = this.state.results;
    }

    for (let i in pkmn) {
      cards.push(
        <PkmnCard
          name={pkmn[i].name}
          type={pkmn[i].type}
          height={pkmn[i].height}
          weight={pkmn[i].weight}
          genus={pkmn[i].genus}
          key={i}

        />)
    }

    return cards;
  }

  render() {


    return (
      <>
        <div className="content">

          <h1>Pokémon-Origins</h1>

          <br />
          <Container>
            <Row className="Selects">
              <Col><MultipleSelect ref={this.typeSelector} options={this.state.types} name={"Types"} />
              </Col>
              <Col md="auto">
                <Form.Check
                  type={"checkbox"}
                  id={"checkbox"}
                  label={"and"}
                />
              </Col>
              <Col><MultipleSelect ref={this.colourSelector} options={this.state.colours} name={"Colours"} /></Col>
            </Row>
            <Row className="Selects">
              <Col><SingleSelect ref={this.pokemonSelector} options={this.state.pokemon} name={"Pokémon"} /></Col>
              <Col><SingleSelect ref={this.categorySelector} options={this.state.categories} name={"Category"} /></Col>
              <Col>reservier für Origin Select</Col>
            </Row>
          </Container>

          <br />


          <button
            className="glow-on-hover"
            type="button"
            onClick={this.getData.bind(this)}>
            Search for matches
          </button>


          <div id="Cards" className="flex-container">
            {this.createCards()}
          </div>


        </div>
        <div class="spacer layer1">
        </div>
      </>
    );
  }
}
export default App;


