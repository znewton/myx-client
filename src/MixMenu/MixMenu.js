import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import './MixMenu.css';

import Mix from './Mix/Mix.js';
import ClassNameBuilder from '../lib/ClassNameBuilder/ClassNameBuilder';

export default class MixMenu extends Component {
  constructor () {
    super();
    this.state = {
      mixes: [],
      searchTerm: ''
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
        this.setState({mixes: []});
      }
    });
  }
  render () {
    let classNameBuilder = new ClassNameBuilder('MixMenu');
    classNameBuilder.add('open', this.props.open);
    classNameBuilder.add('part-open', this.props.partialOpen);
    return (
      <div className={classNameBuilder.className}>
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
    });
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
        onEdit={(e) => this.props.onEdit(e, 'edit', mix.id)}
        onDelete={(e) => this.props.onDelete(e, 'delete', mix.id)}
        name={mix.name}
        channels={mix.channels}
        selected={mix.id === this.props.activeMix}
      />
    ));
  } 
}

MixMenu.propTypes = {
  activeMix: PropTypes.string,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  partialOpen: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

MixMenu.defaultProps = {
  onSelect: () => {}
};
