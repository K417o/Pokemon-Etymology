import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';
import React from 'react';
import "./styles.css";


class SingleSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: []
    }
  }

  render() {
    return (
      <>
        <Form.Group>
          <Typeahead
            id={this.props.name + "Select"}
            labelKey="name"
            onChange={(selected) => {
              this.setState({selected});
            }}
            options={this.props.options}
            placeholder={"Choose one " + this.props.name}
            selected={this.state.selected}
          />
        </Form.Group>
      </>)
  };
}

export default SingleSelect


