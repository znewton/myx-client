import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fauth from 'firebase/auth';
import GoogleButton from '../GoogleButton/GoogleButton';

export default class Login extends Component {
  constructor () {
    super();
    this.state = {
      email: '',
      password: ''
    }
  }
  onChange (name, value) {
    this.setState({[name]: value});
  }
  login(custom) {
    if (custom) {
      fauth.signInWithEmailAndPassword(this.state.email, this.state.password)
        .catch(error => this.setState({error: error.message}))
        .then(() => {
          this.props.close();
        });
    } else {
      let provider = new fauth.GoogleAuthProvider();
      fauth.signInWithRedirect(provider);
      fauth.getRedirectResult().then(result => {
        this.props.close();
      }).catch(error => this.setState({error: error.message}))
    }
  }
  render () {
    return (
      <div className="Login">
        <div>
          <div className="error">{this.state.error}</div>
          <div>
            <input type="email"
              name="email"
              value={this.state.email}
              onChange={(e) => this.onChange('email', e.target.value)}
              placeholder="Email"
            />
          </div>
          <div>
            <input type="password"
              name="password"
              value={this.state.password}
              onChange={(e) => this.onChange('password', e.target.value)}
              placeholder="Password"
            />
          </div>
          <div>
            <button
              className="btn"
              disabled={!this.state.email || !this.state.password}
              onClick={() => this.login(true)}
            >Login</button>
          </div>
        </div>
        <div className="or">or</div>
        <div>
          <GoogleButton type="in" onClick={() => this.login(false)} />
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  close: PropTypes.func.isRequired
}

Login.defaultProps = {}
