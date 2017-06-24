import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import './Sidebar.css';

export default class Sidebar extends Component {
  render () {
    return (
      <div className="Sidebar">
        {[1,2,3,4,5,6,7,8,9,10].map(i => (
          <div className="li" key={i}>
            <div className="title">Mix {i}</div>
            <div className="description">
              &nbsp;&nbsp;&nbsp;
              lisjkhfd, losjh fglsd, isurghi, slirgh hdkdf
            </div>
          </div>
        ))}
      </div>
    );
  }
}

Sidebar.propTypes = {}

Sidebar.defaultProps = {}
