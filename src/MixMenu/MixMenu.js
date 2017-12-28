import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import './MixMenu.css';

import FbHelpers from '../lib/Firebase/Firebase';
import Mix from './Mix/Mix.js';
import Mixer from '../Navbar/mixing/Mixer';
import Modal from '../components/Modal/Modal';
import Events from '../lib/Events/Events';

export default class MixMenu extends Component {
  constructor () {
    super();
    this.state = {
      mixes: [],
      searchTerm: '',
      editModalOpen: null,
      deleteModalOpen: null,
    };
  }
  /**
   * Life-cycle functions
   */
  
  componentDidMount() {
    if (firebase.auth().currentUser) {
      this.setUpList();
    }
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setUpList();
      } else {
        this.setState({mixes: []})
      }
    });
  }
  componentWillUnmount() {
    const events = ['editModal', 'deleteModal'];
    for (let i = 0; i < events.length; i++) {
      Events.removeOneTimeEvent(`${events[i]}OpenToggle`);
    }
  }
  render () {
    let className = 'MixMenu';
    if (this.props.open) className += ' open';
    if (this.props.partialOpen) className += ' part-open';
    return (
      <div className={className}>
        {this.state.mixes.length > 0 &&
          <div className="mix-search-wrapper">
            <input
              name="mixes-search"
              placeholder="Search mixes..."
              type="string"
              className="search"
              value={this.state.searchTerm}
              onChange={this.handleSearchChange.bind(this)} />
            <span className="material-icons searchIcon">search</span>
          </div>
        }
        <div className="mixes-wrapper">
          {this.mixes()}
        </div>
        {this.editModal()}
        {this.deleteModal()}
      </div>
    );
  }
  /**
   * Miscellaneous Functions
   */

  mixComparator(a,b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  }
  /**
   * Build the list of user mixes.
   */
  setUpList() {
    let mixesRef = firebase.database().ref(`/mixes/${firebase.auth().currentUser.uid}`);
    mixesRef.on('child_added', data => {
      let mixes = this.state.mixes;
      let mix = data.val();
      mix.id = data.key;
      mixes.unshift(mix);
      mixes.sort(this.mixComparator);
      this.setState({mixes});
    });
    mixesRef.on('child_changed', data => {
      let mixes = this.state.mixes;
      let mix = data.val();
      mix.id = data.key;
      let index = mixes.findIndex((m) => m.id === data.key);
      mixes.splice(index, 1);
      mixes.unshift(mix);
      mixes.sort(this.mixComparator);
      this.setState({mixes});
    });
    mixesRef.on('child_removed', data => {
      let mixes = this.state.mixes;
      let index = mixes.findIndex((m) => m.id === data.key);
      mixes.splice(index, 1);
      this.setState({mixes});
    });
    mixesRef.orderByChild('name').once('value', snapshot => {
      let mixes = [];
      snapshot.forEach(childSnapshot => {
        let mix = childSnapshot.val();
        mix.id = childSnapshot.key;
        mixes.unshift(mix);
      });
      mixes.sort(this.mixComparator);
      this.setState({mixes});
    })
  }
  /**
   * Update the search term on input.
   * 
   * @param {Object} event 
   */
  handleSearchChange(event) {
    this.setState({searchTerm: event.target.value.toLowerCase()});
  }
  /**
   * Build the mix react elements, filtering by serach term.
   * 
   * @return {Object[]}
   */
  mixes() {
    let mixes = this.state.searchTerm ? 
      this.state.mixes : this.state.mixes
      .filter(mix =>
        mix.name.toLowerCase().includes(this.state.searchTerm) ||
        mix.channels.filter(channel => channel.toLowerCase().includes(this.state.searchTerm)).length);
    return mixes.map(mix => (
      <Mix
        key={mix.id}
        id={mix.id}
        onClick={() => this.props.onSelect(mix.id)}
        onEdit={(e) => this.toggleMenu(e, 'editModal', mix.id)}
        onDelete={(e) => this.toggleMenu(e, 'deleteModal', mix.id)}
        name={mix.name}
        channels={mix.channels}
        selected={mix.id === this.props.activeMix}
      />
    ));
  } 

  /**
   * Mix action functions.
   */
  
  /**
   * Open/close a menu. Does not add window click event for modals.
   * 
   * @param {*} e 
   * @param {*} name 
   */
  toggleMenu(e, name, param) {
    if (e) e.stopPropagation();
    let open = this.state[`${name}Open`] ? null : param;
    this.setState({[`${name}Open`]: open});
    if (!name.toLowerCase().includes('modal') && open)
      Events.addOneTimeEvent(window, 'click', () => this.setState({[`${name}Open`]: null}), `${name}OpenToggle`);
  }
  /**
   * Close a menu.
   * 
   * @param {*} e 
   * @param {*} name 
   */
  closeMenu(e, name) {
    if (e) e.stopPropagation();
    this.setState({[`${name}Open`]: null});
    Events.removeOneTimeEvent(`${name}OpenToggle`);
  }

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
      open={this.state[`${name}Open`] !== null}
      bindTo={openFromId}
    >
      {contents}
    </Modal>

  editModal = () => this.modal(
    <Mixer close={(e) => this.closeMenu(e, 'editModal')} id={this.state.editModalOpen} />, 
    'Edit Mix', 'editModal', `Mix_${this.state.editModalOpen}`
  );

  deleteModal = () => this.modal(
    this.deleteModalContents(), 'Delete Mix', 'deleteModal', `Mix_${this.state.deleteModalOpen}`
  );

  deleteModalContents = () => (
    <div>
      <div>Are you sure you want to delete this mix?</div>
      <div className="delete-button-bar">
        <button className="btn" onClick={(e) => this.closeMenu(e, 'deleteModal')}>Cancel</button>
        <button className="btn blue" onClick={(e) => {
          this.closeMenu(e, 'deleteModal');
          FbHelpers.deleteMix(this.state.deleteModalOpen);
        }}>Delete</button>
      </div>
    </div>);
}

MixMenu.propTypes = {
  activeMix: PropTypes.string,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  partialOpen: PropTypes.bool,
}

MixMenu.defaultProps = {
  onSelect: () => {}
}
