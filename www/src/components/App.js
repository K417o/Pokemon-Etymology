import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import './App.css';
import {CountrySelector, LanguageSelector, PkmnCard} from './index';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.countrySelector = React.createRef();
    this.languageSelector = React.createRef();
  }

  getData() {
    const countrySelector = this.countrySelector.current;
    console.log(countrySelector.state.selected);
    const languageSelector = this.languageSelector.current;
    console.log(languageSelector.state.selected);
  };

  createCards = () => {
    let cards = [];
    const pkmn = ["Ditto", "Aquana", "Absol", "Libelldra", "Fukano", "Arkani", "Milotic", "Zoroark", "Arbok", "Lucario", "Luxtra", "Sheinux", "Luxio","Ditto", "Aquana"];

    for (let i in pkmn){
      cards.push(
      <PkmnCard
        name={pkmn[i]}
      />)
    }

    return cards;
  }

  render() {
    return (
      <><div class="spacer layer1">
        <div className="content">
          
          <h1>Pokémon-Origins</h1>
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search for a title"
              className="mr-2"
              aria-label="Search"
            />
            <Button onClick={this.getData.bind(this)} variant="outline-success">Search</Button>
          </Form>
          <br />
          <div>

          </div>
          <CountrySelector ref={this.countrySelector} />
          <br />
          <LanguageSelector ref={this.languageSelector} />
          <br/>
          <div id="Cards" className="flex-container">
            {this.createCards()}
          </div>

          
        </div>
        </div>
      </>
    );
  }
}
export default App;


