import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import './Navbar.css';
import firebase from 'firebase/app';
import 'firebase/auth';

import Logo from '../components/Logo/Logo';
import Auth from './auth/Auth';

import Modal from '../components/Modal/Modal';
import Events from '../lib/Events/Events';

export default class Navbar extends Component {
  constructor () {
    super();
    this.state = {
      authModalOpen: true,
      authType: 'login',
    }
  }

  handleAuthClick(e, type) {
    e.stopPropagation();
    this.setState({authModalOpen: true, authType: type});
    Events.addOneTimeEvent(window, 'click', () => this.setState({authModalOpen: false}), 'authModal');
  }
  componentWillUnmount() {
    Events.removeOneTimeEvent('authModal');
  }
  render () {
    return (
      <nav className="Navbar">
        <div className="nav-left">
          <span className="brand">
            <Logo />
          </span>
        </div>
        <div className="nav-right">
          {firebase.auth().currentUser ?
            <button className="nav-btn blue"><span className="material-icons">plus</span> create mix</button>
            :
            <span id="authopener">
              <button className="nav-btn" onClick={(e) => this.handleAuthClick(e, 'login')}>Log in</button>
              &nbsp;or&nbsp;
              <button className="nav-btn blue" onClick={(e) => this.handleAuthClick(e, 'signup')}>Sign up</button>
              <Modal
                header={this.state.authType.charAt(0).toUpperCase() + this.state.authType.slice(1)}
                handleClose={() => this.setState({authModalOpen: false})}
                open={this.state.authModalOpen}
                bindTo="#authopener"
              >
                <Auth type={this.state.authType} close={() => this.setState({authModalOpen: false})} />
              </Modal>
            </span>
          }
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {}

Navbar.defaultProps = {}
