import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import './Navbar.css';

import Logo from '../components/Logo/Logo';

export default class Navbar extends Component {
  render () {
    return (
      <nav className="Navbar">
        <div className="nav-left">
          <span className="brand">
            <Logo />
          </span>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {}

Navbar.defaultProps = {}
