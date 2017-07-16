import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import './Sidebar.css';

export default class Sidebar extends Component {
  constructor () {
    super();
    this.state = {
      mixes: [],
      searchTerm: ''
    }
  }
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
  setUpList() {
    let mixesRef = firebase.database().ref(`/mixes/${firebase.auth().currentUser.uid}`);
    mixesRef.on('child_added', data => {
      let mixes = this.state.mixes;
      let mix = data.val();
      mix.id = data.key;
      mixes.unshift(mix);
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
  handleSearchChange(event) {
    this.setState({searchTerm: event.target.value.toLowerCase()});
  }
  render () {
    let mixes = this.state.mixes;
    if (this.state.searchTerm) {
      mixes = mixes
        .filter(mix =>
          mix.name.toLowerCase().includes(this.state.searchTerm) ||
          mix.channels.filter(channel => channel.toLowerCase().includes(this.state.searchTerm)).length);
    }
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
          {mixes.map(mix => (
            <div className="li" key={mix.id} onClick={() => this.props.onSelect(mix.id)}>
              <div className="title">{mix.name}</div>
              <div className="description">
                {mix.channels && mix.channels.map((channel,i) => <span key={i}>{channel}{i < mix.channels.length-1 && ', '}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  onSelect: PropTypes.func
}

Sidebar.defaultProps = {
  onSelect: () => {}
}
