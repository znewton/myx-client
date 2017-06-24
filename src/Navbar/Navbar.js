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
        <div className="nav-right">
          <span>
            <button>Log in</button>
            &nbsp;or&nbsp;
            <button className="blue">Sign up</button>
          </span>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {}

Navbar.defaultProps = {}
