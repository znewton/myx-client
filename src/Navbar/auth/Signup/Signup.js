import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Signup.scss';

export default class Signup extends Component {
  constructor () {
    super();
    this.state = {
      email: '',
      password: '',
      password_confirmation: ''
    }
  }
  onChange (name, value) {
    this.setState({[name]: value});
  }
  render () {
    return (
      <div className="Signup">
        <input type="email"
          name="email"
          value={this.state.email}
          onChange={(e) => this.onChange('email', e.target.value)}
          placeholder="Email"
        />
        <input type="password"
          name="password"
          value={this.state.password}
          onChange={(e) => this.onChange('password', e.target.value)}
          placeholder="Password"
        />
        <input type="password"
          name="password_confirmation"
          value={this.state.password_confirmation}
          onChange={(e) => this.onChange('password_confirmation', e.target.value)}
          placeholder="Confirm Password"
        />
        <button></button>
      </div>
    );
  }
}

Signup.propTypes = {}

Signup.defaultProps = {}
