import React, { Fragment } from 'react';
import './cards.css';
import { typeIcons } from '../images/type-icons';
import Collapse from 'react-bootstrap/Collapse';
import { Container } from 'react-bootstrap';
import { NameTable } from '..';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import { filterData } from '../../services/filterData';
import missingno from '../images/MissingNo.webp';

class PkmnCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      infos: {},
      click: this.props.click
    }
    this.getTypeIcons = this.getTypeIcons.bind(this);
    this.createOriginCards = this.createOriginCards.bind(this);
  }

  async componentDidMount() {
    this.setState({
      infos: await filterData.getPkmn(this.props.name)
    });
  }

  getTypeIcons = () => {
    let icons = []
    if (!!this.props.types) {
      this.props.types.map((type) => {
        icons.push(
          <img
            src={typeIcons[type]}
            className="type"
            alt={type + " Icon"}
          />
        );
      });
    }

    return icons;
  }


  createOriginCards = () => {
    let originsCards = [];

    let origin = this.state.infos?.origins;
    if (!!origin) {
      for (let i = 0; i < origin.length; i++) {
        let refs = [];
        if (!origin[i].image && !origin[i].label && !origin[i].description) {
          //this.setState({ click: false });
        } else {
          for (let r of origin[i].externalRefs) {
            refs.push(<><small className="text-muted"><a href={r.externalURI} target="_blank" rel="noreferrer"> {r.externalURI.match(/https?:\/\/([\w\.-]*)\//)?.[1]} </a></small><br /></>)
          }
          originsCards.push(
            <Card>
              <a href={origin[i].entityURI} target="_blank" rel="noreferrer">
                <Card.Img variant="top" src={!!origin[i].image ? origin[i].image : missingno} className="origin-pic" />
              </a>
              <Card.Body>
                <Card.Title>{origin[i].label}</Card.Title>
                <Card.Text>
                  {origin[i].description}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted"><strong>get more information:</strong></small> <br />
                {refs}
              </Card.Footer>
            </Card>
          )
        }
      }
    }
    return originsCards;
  }

  render() {
    let nameTable;

    return (
      <Fragment>
        <div
          className={"pkmn-card clickable_" + this.state.click}
          onClick={() => {
            this.setState({
              open: !this.state.open,
              click: !this.state.click
            })
          }}
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
                      {this.props.name}&nbsp;&nbsp;{this.state.infos?.pokedexId}
                    </h4>
                    <span className="country-region text-secondary">
                      {this.props.genus}
                    </span>
                    <br />
                    <span className="country-region text-secondary ">
                      {"Height: " + this.props.height + "m"}
                    </span>
                    &nbsp;&nbsp;
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
                  <div>
                    <NameTable
                      nameParts={this.state.infos?.nameParts}
                    ></NameTable>
                    <CardGroup>
                      {this.createOriginCards()}
                    </CardGroup>
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