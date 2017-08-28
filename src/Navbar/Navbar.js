import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Navbar.css';
import firebase from 'firebase/app';
import 'firebase/auth';

import Logo from '../components/Logo/Logo';
import Auth from './auth/Auth';
import Mixer from './mixing/Mixer';
import Help from './help/Help';
import About from './about/About';

import Modal from '../components/Modal/Modal';
import DropMenu from '../components/DropMenu/DropMenu';
import Events from '../lib/Events/Events';
import Positioning from '../lib/Positioning/Positioning';

export default class Navbar extends Component {
  constructor () {
    super();
    this.state = {
      authModalOpen: false,
      settingsMenuOpen: false,
      createMixModalOpen: false,
      aboutModalOpen: false,
      helpModalOpen: false,
      authType: 'login',
      loggedIn: false,
    }
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({loggedIn: true});
      } else {
        this.setState({loggedIn: false});
      }
    })
  }
  handleAuthClick(e, type) {
    e.stopPropagation();
    this.setState({authModalOpen: true, authType: type});
    Events.addOneTimeEvent(window, 'click', () => this.setState({authModalOpen: false}), 'authModalOpenToggle');
  }
  handleSignOut() {
    firebase.auth().signOut();
  }
  toggleMenu(e, name) {
    if (e) e.stopPropagation();
    let open = !this.state[`${name}Open`];
    this.setState({[`${name}Open`]: open});
    if (!name.toLowerCase().includes('modal'))
      Events.addOneTimeEvent(window, 'click', () => this.setState({[`${name}Open`]: false}), `${name}OpenToggle`);
  }
  closeMenu(e, name) {
    if (e) e.stopPropagation();
    this.setState({[`${name}Open`]: false});
    Events.removeOneTimeEvent(`${name}OpenToggle`);
  }
  componentWillUnmount() {
    const events = ['authModal', 'settingsMenu', 'createMix'];
    for (let i = 0; i < events.length; i++) {
      Events.removeOneTimeEvent(`${events[i]}OpenToggle`);
    }
  }
  render () {
    return (
      <nav className="Navbar">
        <div className="nav-left">
          <span className="brand" title="My Mix (Beta)">
            <Logo /><sup>Beta</sup>
          </span>
        </div>
        <div className="nav-middle">
          <span className="mix-name">{this.props.currentMixName}</span>
        </div>
        <div className="nav-right">
          {firebase.auth().currentUser ?
            <span>
              <button className="nav-btn blue" id="create_mix_button" onClick={(e) => this.toggleMenu(e, 'createMixModal')}>
                <span className="material-icons">add</span>
                <span>Create Mix</span>
              </button>
              <Modal
                header={'Create Mix'}
                handleClose={(e) => this.closeMenu(e, 'createMixModal')}
                open={this.state.createMixModalOpen}
                bindTo="#create_mix_button"
              >
                <Mixer close={e => this.closeMenu(e, 'createMixModal')} />
              </Modal>
              <button className="icon-btn" id="settings_button" onClick={(e) => this.toggleMenu(e,'settingsMenu')}><span className="material-icons">more_vert</span></button>
              <DropMenu open={this.state.settingsMenuOpen} from={Positioning.TOPRIGHT} bindTo="#settings_button">
                {/* <button onClick={(e) => this.closeMenu(e, 'settingsMenu')}><span className="material-icons">settings</span><span>Settings</span></button> */}
                <button onClick={(e) => this.toggleMenu(e, 'aboutModal')}><span className="material-icons">info_outline</span><span>About</span></button>
                <button onClick={(e) => this.toggleMenu(e, 'helpModal')}><span className="material-icons">help_outline</span><span>Help</span></button>
                <span className="separator" />
                <button onClick={this.handleSignOut.bind(this)}><span className="material-icons">lock_open</span><span>Sign Out</span></button>
              </DropMenu>
              <Modal
                header={'Help'}
                handleClose={(e) => this.closeMenu(e, 'helpModal')}
                open={this.state.helpModalOpen}
                bindTo="#settings_button"
              >
                <Help />
              </Modal>
              <Modal
                header={<h2>Welcome to <Logo />!</h2>}
                handleClose={(e) => this.closeMenu(e, 'aboutModal')}
                open={this.state.aboutModalOpen}
                bindTo="#settings_button"
              >
                <About />
              </Modal>
            </span>
            :
            <span id="authopener">
              <button className="nav-btn" onClick={(e) => this.handleAuthClick(e, 'login')}>Log in</button>
              &nbsp;or&nbsp;
              <button className="nav-btn blue" onClick={(e) => this.handleAuthClick(e, 'signup')}>Sign up</button>
              <Modal
                header={this.state.authType.charAt(0).toUpperCase() + this.state.authType.slice(1)}
                handleClose={(e) => this.closeMenu(e, 'authModal')}
                open={this.state.authModalOpen}
                bindTo="#authopener"
              >
                <Auth type={this.state.authType} close={(e) => this.closeMenu(e, 'authModal')} />
              </Modal>
            </span>
          }
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  currentMixName: PropTypes.string
}

Navbar.defaultProps = {
  currentMixName: ''
}
