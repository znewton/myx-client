import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Navbar.css';

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
      // modals & dropdown menus
      authModalOpen: false,
      settingsMenuOpen: false,
      createMixModalOpen: false,
      aboutModalOpen: false,
      helpModalOpen: false,
      // auth
      authType: 'login'
    }
  }
  /**
   * React Life-cycle Functions
   */
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
            <span 
              className="material-icons icon-btn side-menu-button"
              onClick={this.toggleLeftMenu.bind(this)}
              onMouseEnter={() => this.props.partialToggleLeftMenu(true)}
              onMouseLeave={() => this.props.partialToggleLeftMenu(false)}
            >
              {this.props.leftMenuOpen ? 'close' : 'playlist_play'}
            </span>
            <Logo /><sup>Beta</sup>
          </span>
        </div>
        <div className="nav-middle">
          <span className="mix-name">{this.props.currentMixName}</span>
        </div>
        <div className="nav-right">
          {this.props.loggedIn ?
            <span>
              <button className="nav-btn blue hide-mobile" id="create_mix_button" onClick={(e) => this.toggleMenu(e, 'createMixModal')}>
                <span className="material-icons">add</span>
                <span>Create Mix</span>
              </button>
              {this.createMixModal()}
              <button className="icon-btn" id="settings_button" onClick={(e) => this.toggleMenu(e,'settingsMenu')}><span className="material-icons">more_vert</span></button>
              <DropMenu open={this.state.settingsMenuOpen} from={Positioning.TOPRIGHT} bindTo="#settings_button">
                {/* <button onClick={(e) => this.closeMenu(e, 'settingsMenu')}><span className="material-icons">settings</span><span>Settings</span></button> */}
                <button onClick={(e) => this.toggleMenu(e,'createMixModal')} className="hide-desktop"><span className="material-icons">add_circle_outline</span><span>Create Mix</span></button>
                <button onClick={(e) => this.toggleMenu(e, 'aboutModal')}><span className="material-icons">info_outline</span><span>About</span></button>
                <button onClick={(e) => this.toggleMenu(e, 'helpModal')}><span className="material-icons">help_outline</span><span>Help</span></button>
                <span className="separator" />
                <button onClick={this.handleSignOut.bind(this)}><span className="material-icons">lock_open</span><span>Sign Out</span></button>
              </DropMenu>
              {this.aboutModal()}
              {this.helpModal()}
            </span>
            :
            <span id="authopener">
              <button className="nav-btn" onClick={(e) => this.handleAuthClick(e, 'login')}>Log in</button>
              &nbsp;or&nbsp;
              <button className="nav-btn blue" onClick={(e) => this.handleAuthClick(e, 'signup')}>Sign up</button>
              {this.authModal()}
            </span>
          }
          <span 
            className={'material-icons icon-btn side-menu-button' + (this.props.currentMixName ? '' : ' disabled')}
            onClick={this.toggleRightMenu.bind(this)}
            onMouseEnter={() => this.props.partialToggleRightMenu(true)}
            onMouseLeave={() => this.props.partialToggleRightMenu(false)}
          >
            {this.props.rightMenuOpen ? 'close' : 'queue_music'}
          </span>
        </div>
      </nav>
    );
  }
  
  /**
   * Event Handlers
   */
  
  /**
   * Open the login/signup modal.
   * 
   * @param {*} e 
   * @param {string} type 
   */
  handleAuthClick(e, type) {
    e.stopPropagation();
    this.setState({authModalOpen: true, authType: type});
    Events.addOneTimeEvent(window, 'click', () => this.setState({authModalOpen: false}), 'authModalOpenToggle');
  }
  /**
   * Sign out the user through Firebase.
   */
  handleSignOut() {
    this.props.signOut();
  }
  /**
   * Open/close a menu. Does not add window click event for modals.
   * 
   * @param {*} e 
   * @param {*} name 
   */
  toggleMenu(e, name) {
    if (e) e.stopPropagation();
    let open = !this.state[`${name}Open`];
    this.setState({[`${name}Open`]: open});
    if (!name.toLowerCase().includes('modal') && open)
      Events.addOneTimeEvent(window, 'click', () => this.setState({[`${name}Open`]: false}), `${name}OpenToggle`);
  }
  /**
   * Close a menu.
   * 
   * @param {*} e 
   * @param {*} name 
   */
  closeMenu(e, name) {
    if (e) e.stopPropagation();
    this.setState({[`${name}Open`]: false});
    Events.removeOneTimeEvent(`${name}OpenToggle`);
  }

  /**
   * Modals
   */
  authModal = () => this.modal(
    <Auth type={this.state.authType} close={(e) => this.closeMenu(e, 'authModal')} />,
    this.state.authType.charAt(0).toUpperCase() + this.state.authType.slice(1),
    'authModal', '#authOpener'
  );

  createMixModal = () => this.modal(
    <Mixer close={(e) => this.closeMenu(e, 'createMixModal')} />, 
    'Create Mix', 'createMixModal', '#create_mix_button'
  );

  aboutModal = () => this.modal(
    <About />, <h2>Welcome to <Logo />!</h2>, 'aboutModal', '#settings_button'
  );

  helpModal = () => this.modal(
    <Help />, 'Help', 'helpModal', '#settings_button'
  );

  /**
   * Create a modal whose open state is handled by this state
   * 
   * @param {*} contents
   * @param {*} header
   * @param {string} name
   * @param {string} openFromId
   */
  modal = (contents, header, name, openFromId) => 
    <Modal
      header={header}
      handleClose={(e) => this.closeMenu(e, name)}
      open={this.state[`${name}Open`]}
      bindTo={openFromId}
    >
      {contents}
    </Modal>
  
  /**
   * Side Menus
   */
  toggleLeftMenu () {
    this.props.toggleLeftMenu()
  }
  toggleRightMenu () {
    this.props.toggleRightMenu()
  }
}

Navbar.propTypes = {
  loggedIn: PropTypes.bool,
  currentMixName: PropTypes.string,
  signOut: PropTypes.func,
  leftMenuOpen: PropTypes.bool,
  toggleLeftMenu: PropTypes.func,
  partialToggleLeftMenu: PropTypes.func,
  rightMenuOpen: PropTypes.bool,
  toggleRightMenu: PropTypes.func,
  partialToggleRightMenu: PropTypes.func,
}

Navbar.defaultProps = {
  currentMixName: '',
  toggleLeftMenu: () => {},
  partialToggleLeftMenu: () => {},
  toggleRightMenu: () => {},
  partialToggleRightMenu: () => {},
}
