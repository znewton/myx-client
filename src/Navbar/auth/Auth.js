import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Auth.css';

import Login from './Login/Login';
import Signup from './Signup/Signup';

export default class Auth extends Component {
  render () {
    return (
      <div className="Auth">
        {
          this.props.type === 'login' ?
          <Login close={this.props.close} /> :
          <Signup close={this.props.close} />
        }
      </div>
    );
  }
}

Auth.propTypes = {
  type: PropTypes.oneOf(['login','signup']),
  close: PropTypes.func
}

Auth.defaultProps = {}
