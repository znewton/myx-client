import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import './Sidebar.css';

import Mix from './Mix/Mix.js';

export default class Sidebar extends Component {
  constructor () {
    super();
    this.state = {
      mixes: [],
      searchTerm: ''
    }
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
  render () {
    return (
      <div className="Sidebar">
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
      this.setState({mixes});
    });
    mixesRef.on('child_changed', data => {
      let mixes = this.state.mixes;
      let mix = data.val();
      mix.id = data.key;
      let index = mixes.findIndex((m) => m.id === data.key);
      mixes.splice(index, 1);
      mixes.unshift(mix);
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
        onClick={() => this.props.onSelect(mix.id)}
        name={mix.name}
        channels={mix.channels}
        selected={mix.id === this.props.activeMix}
      />
    ));
  } 
}

Sidebar.propTypes = {
  activeMix: PropTypes.string,
  onSelect: PropTypes.func
}

Sidebar.defaultProps = {
  onSelect: () => {}
}
