import React, { Fragment } from 'react';
import './cards.css';
import { typeIcons } from '../images/type-icons';
import Collapse from 'react-bootstrap/Collapse';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

class PkmnCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }
    this.getTypeIcons = this.getTypeIcons.bind(this);
    this.createOriginCards = this.createOriginCards.bind(this);
  }

  getTypeIcons = () => {
    let icons = []
    if (!!this.props.types) {
      this.props.types.map((type) => {
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

  createOriginCards = () => {
    let origins = [];
    if (!!this.props.origins) {
      for (let i = 0; i < this.props.origins.length; i++) {
        if (!this.props.origins[i].image && !this.props.origins[i].label && !this.props.origins[i].description) {
          
        } else {
          origins.push(
            <Card>
              <Card.Img variant="top" src={this.props.origins[i].image} className="origin-pic" />
              <Card.Body>
                <Card.Title>{this.props.origins[i].label}</Card.Title>
                <Card.Text>
                  {this.props.origins[i].description}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted"><a href={this.props.origins[i].entityURI} target="_blank" rel="noreferrer"> get more information... </a></small>
              </Card.Footer>
            </Card>
          )
        }
      }
    }
    return origins;
  }

  render() {
    return (
      <Fragment>
        <div
          className={"pkmn-card clickable_"+this.props.click}
          onClick={() => { this.setState({ open: !this.state.open }) }}
          aria-controls={"example-collapse-text-" + this.props.name}
          aria-expanded={this.state.open}>
          <div
            className="pkmn-card-container border-gray rounded border mx-2 my-3 d-flex flex-row align-items-center p-0 bg-light"
          >
            <Container>
              <Row className="main-Info-row">
                <Col md="auto">
                  <img
                    src={this.props.image}
                    className="d-block original-pic"
                    alt={this.props.name + " Artwork"}
                  />
                </Col>
                <Col>
                  <div className="px-3 details">
                    <h4>
                      {this.props.name}
                    </h4>
                    <span className="country-region text-secondary">
                      {this.props.genus}
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
                <Col md="auto" className="pkmn-icons">
                  <div>
                    {this.getTypeIcons()}
                  </div>
                  <div>
                    <img
                      src={this.props.shape}
                      className="shape"
                      alt={this.props.name + "-shape"}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Collapse in={this.state.open}>
                  <CardGroup>
                    {this.createOriginCards()}
                  </CardGroup>
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