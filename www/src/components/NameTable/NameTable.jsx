import React, { Fragment } from 'react';
import Table from 'react-bootstrap/Table';
import Tooltip from '@material-ui/core/Tooltip';
import './nametable.css';

class NameTable extends React.Component {
  constructor(props) {
    super(props);


    this.createTable = this.createTable.bind(this);
  }

  createTable = () => {
    let tbody = [];
    for (let lang in this.props.nameParts) {
      let language = "";
      switch (lang) {
        case "deu": language = "German";
          break;
        case "eng": language = "English";
          break;
        case "fra": language = "French";
          break;
        case "jpn": language = "Japanese";
          break;
        case "kor": language = "Korean";
          break;
        case "zho": language = "Chinese";
          break;
        default: language = "Unown";
          break;
      }


      let nameParts = [];
      let index = 1;
      for (let part of this.props.nameParts[lang]) {

        if (part.description == null) {
          nameParts.push(
            <span>{part.title}</span>);

          if (index < this.props.nameParts[lang].length && this.props.nameParts[lang].length > 1) {
            nameParts.push(<span>&nbsp;+&nbsp;</span>);
          }
        } else {
          if (part.description.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)?.[1]) {
            nameParts.push(
              <Tooltip title={<Fragment><a href={part.description} className="tooltip-link" target="_blank" rel="noreferrer">{part.description}</a></Fragment>} interactive>
                <span>{part.title}</span>
              </Tooltip>);
          } else {
            nameParts.push(
              <Tooltip title={part.description}>
                <span>{part.title}</span>
              </Tooltip>);
          }
          

          if (index < this.props.nameParts[lang].length && this.props.nameParts[lang].length > 1) {
            nameParts.push(<span>&nbsp;+&nbsp;</span>);
          }

        }
        index++;
      }


      tbody.push(
        <tr>
          <td>{language}</td>
          <td>{nameParts}</td>
        </tr>)

    }
    return tbody;
  }


  render() {
    return (
      <Fragment>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Language</th>
              <th>Name and Explanation</th>
            </tr>
          </thead>
          <tbody>
            {this.createTable()}
          </tbody>
        </Table>
      </Fragment>

    );
  }
}
export default NameTable;