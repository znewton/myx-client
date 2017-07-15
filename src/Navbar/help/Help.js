import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import './Help.css';

export default class Help extends Component {
  render () {
    return (
      <div className="Help">
        <h2>Creating a Mix</h2>
        <ol>
          <li>Click `Create Mix` in the top right of the nav bar.</li>
          <li>Search for a channel (ie. Koala Kontrol)</li>
        </ol>
      </div>
    );
  }
}

Help.propTypes = {}

Help.defaultProps = {}
