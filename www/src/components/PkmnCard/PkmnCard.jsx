import React, { Fragment } from 'react';
import './cards.css';
import dark from '../images/type-icons/Pokémon_Dark_Type_Icon.svg';
import poison from '../images/type-icons/Pokémon_Poison_Type_Icon.svg';
import { typeIcons } from '../images/type-icons';
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
    this.getTypeIcons = this.getTypeIcons.bind(this);
  }

  getTypeIcons = () => {
    let icons = []
    if (!!this.props.type) {
      this.props.type.map((type) => {
        icons.push(
          <img
            src={typeIcons[type]}
            className="type"
            alt={this.props.name + " Artwork"}
          />
        );
      });
    }

    return icons;
  }

  render() {
    return (
      <Fragment>
        <div
          className="pkmn-card"
          onClick={() => { this.setState({ open: !this.state.open }) }}
          aria-controls={"example-collapse-text-" + this.props.name}
          aria-expanded={this.state.open}>
          <div
            className="pkmn-card-container border-gray rounded border mx-2 my-3 d-flex flex-row align-items-center p-0 bg-light"
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
                      {this.props.genus + " Pokémon"}
                    </span>
                    <br />
                    <span className="country-region text-secondary ">
                      {"Height: " + this.props.height + "m"}
                    </span>
                    {"\t"}
                    <span className="country-region text-secondary ">
                      {"Weight: " + this.props.weight + "kg"}
                    </span>
                  </div>
                </Col>
                <Col md="auto">
                  {this.getTypeIcons()}
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