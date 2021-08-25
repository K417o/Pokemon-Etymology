import React, { Fragment } from 'react';
import './cards.css';
import dark from '../images/type-icons/Pokémon_Dark_Type_Icon.svg';
import poison from '../images/type-icons/Pokémon_Poison_Type_Icon.svg';
import Collapse from 'react-bootstrap/Collapse';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class PkmnCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }
  }
  //"https://www.pokewiki.de/images/4/46/Sugimori_487a.png"

  /**
   * 
   * <div 
          className="pkmn-card" 
          onClick={() => {this.setState({open: !this.state.open})}}
          aria-controls={"example-collapse-text-" + this.props.name}
          aria-expanded={this.state.open}>
            <div
              className="country-card-container border-gray rounded border mx-2 my-3 d-flex flex-row align-items-center p-0 bg-light"
            >
              <div className=" position-relative border-gray border-right px-2 bg-white rounded-left">
                <img
                  src="https://www.pokewiki.de/images/4/46/Sugimori_487a.png"
                  className="d-block h-100"
                  alt={this.props.name + " Artwork"}
                />
              </div>
              
              <div className="px-3 details">
                <span className="country-name text-dark d-block font-weight-bold">
                  {this.props.name}
                </span>
                <span className="country-region text-secondary">
                  Wandler - Pokémon
                </span>
                <br/>
                <span className="country-region text-secondary ">
                  {"Größe: 1m"}
                </span>
                {"\t"}
                <span className="country-region text-secondary ">
                  {"Gewicht: 1kg"}
                </span>
              </div>
              <div className="border-gray border-right px-2 ">
                <img
                  src={dark}
                  className="d-block type"
                  alt={this.props.name + " Artwork"}
                />
              </div>
              <div className="border-gray border-right px-2 ">
                <img
                  src={poison}
                  className="d-block type"
                  alt={this.props.name + " Artwork"}
                />
              </div>
            </div>
          </div>
   * 
   */
  render() {
    return (
      <Fragment>
        <div
          className="pkmn-card"
          onClick={() => { this.setState({ open: !this.state.open }) }}
          aria-controls={"example-collapse-text-" + this.props.name}
          aria-expanded={this.state.open}>
          <div
            className="country-card-container border-gray rounded border mx-2 my-3 d-flex flex-row align-items-center p-0 bg-light"
          >
            <Container>
              <Row>
                <Col md="auto">
                  <img
                    src="https://www.pokewiki.de/images/4/46/Sugimori_487a.png"
                    className="d-block h-100"
                    alt={this.props.name + " Artwork"}
                  />
                </Col>
                <Col>
                  <div className="px-3 details">
                    <h4>
                      {this.props.name}
                    </h4>
                    <span className="country-region text-secondary">
                      Wandler - Pokémon
                    </span>
                    <br />
                    <span className="country-region text-secondary ">
                      {"Größe: 1m"}
                    </span>
                    {"\t"}
                    <span className="country-region text-secondary ">
                      {"Gewicht: 1kg"}
                    </span>
                  </div>
                </Col>
                <Col md="auto">
                  <img
                    src={dark}
                    className="type"
                    alt={this.props.name + " Artwork"}
                  />
                  <img
                    src={poison}
                    className="type"
                    alt={this.props.name + " Artwork"}
                  />
                </Col>
              </Row>
              <Row>
                <Collapse in={this.state.open}>
                  <div id={"example-collapse-text-" + this.props.name}>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                    terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                    labore wes anderson cred nesciunt sapiente ea proident.
                  </div>
                </Collapse>

              </Row>
            </Container>

          </div>

        </div>

      </Fragment>

    );
  }
}
export default PkmnCard;