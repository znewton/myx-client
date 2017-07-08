import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import axios from 'axios';
import 'firebase/auth';
import 'firebase/database';
import queryString from 'query-string';
import './Mixer.css';

import Events from '../../lib/Events/Events';

export default class Mixer extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: '',
      channels: {},
      selectedChannel: null,
      selectedChannelPlaylists: {},
      currentMix: {},
      mixName: 'Mix_' + Math.random().toString(36).substring(7)
    };
    this.search = Events.debounce(this.search, 250);
  }
  handleSearchInput(value) {
    this.setState({searchTerm: value});
    this.search();
  }
  search() {
    this.setState({selectedChannel: null, selectedChannelPlaylists: {}})
    if (this.state.searchTerm === '') {
      this.setState({channels: {}});
      return;
    }
    let params = queryString.stringify({q: this.state.searchTerm});
    axios.get(`http://myxx.herokuapp.com/channels?${params}`)
      .then(response => {
        if (response.data && response.data.length) {
          let channels = {};
          for (let i = 0; i < response.data.length; i++) {
            let channel = response.data[i];
            channels[channel.channelId] = {
              title: channel.channelTitle,
              description: channel.description,
              thumbnail: channel.thumbnails.default.url
            }
          }
          this.setState({channels: channels});
        }
      })
      .catch(error => console.log(error));
  }
  getPlaylists(channelId) {
    if (this.state.selectedChannel === channelId && this.state.selectedChannelPlaylists !== {}) {
      this.setState({selectedChannel: null, selectedChannelPlaylists: {}});
      return;
    }
    this.setState({selectedChannel: channelId});
    axios.get(`http://myxx.herokuapp.com/playlists/${channelId}`)
      .then(response => {
        if (response.data && response.data.length) {
          let playlists = {};
          for (let i = 0; i < response.data.length; i++) {
            let playlist = response.data[i];
            playlists[playlist.id] = {
              name: playlist.snippet.title
            }
          }
          this.setState({selectedChannelPlaylists: playlists});
        }
      })
      .catch(error => console.log(error));
  }
  addPlaylist(id) {
    let mix = this.state.currentMix;
    mix[id] = {
      name: this.state.selectedChannelPlaylists[id].name,
      channel: this.state.channels[this.state.selectedChannel].title
    }
    this.setState({currentMix: mix});
  }
  removePlaylist(id) {
    let mix = this.state.currentMix;
    delete mix[id];
    this.setState({currentMix: mix});
  }
  createMix() {
    let newMixRef = firebase.database().ref(`/mixes/${firebase.auth().currentUser.uid}`).push();
    let mixPlayListKeys = Object.keys(this.state.currentMix);
    let channels = [];
    for (let key in this.state.currentMix) {
      let channelName = this.state.currentMix[key].channel;
      if (!channels.includes(channelName)) channels.push(channelName);
    }
    newMixRef.set({
      name: this.state.mixName,
      playlists: mixPlayListKeys,
      channels: channels
    });
    this.resetState();
    this.props.close();
  }
  resetState() {
    this.setState({
      searchTerm: '',
      channels: {},
      selectedChannel: null,
      selectedChannelPlaylists: {},
      currentMix: {},
      mixName: 'Mix_' + Math.random().toString(36).substring(7)
    });
  }
  render () {
    const channelKeys = Object.keys(this.state.channels);
    const playlistKeys = Object.keys(this.state.selectedChannelPlaylists);
    const mixKeys = Object.keys(this.state.currentMix);
    return (
      <div className="Mixer">
        <div className="channel-search">
          <div>
            <span className="material-icons searchIcon">search</span>
            <input
              placeholder="Search channels..."
              name="search"
              onChange={(e) => this.handleSearchInput(e.target.value)}
              value={this.state.searchTerm} />
          </div>
          <div className="channels">
            {channelKeys.length ?
              channelKeys.map(key => {
                let channel = this.state.channels[key];
                return (
                  <div className="channel-result" key={key}>
                    <div className="channel">
                      <div className="thumbnail">
                        <img src={channel.thumbnail} alt="thumbnail" />
                      </div>
                      <div className="info">
                        <div className="channel-title">{channel.title}</div>
                        <div className="channel-description">{channel.description}</div>
                      </div>
                      <div className="channel-playlist-toggle" onClick={() => this.getPlaylists(key)}>
                        <span className="material-icons">keyboard_arrow_down</span>
                      </div>
                    </div>
                    {this.state.selectedChannel === key &&
                      <div className="channel-playlists">
                        {playlistKeys.length ?
                          playlistKeys.filter(key => !this.state.currentMix[key]).map(key => {
                            let playlist = this.state.selectedChannelPlaylists[key];

                            return (
                              <div className="playlist-result" key={key}>
                                <div className="playlist-name">{playlist.name}</div>
                                <div className="playlist-action" onClick={() => this.addPlaylist(key)}>
                                  <span className="material-icons">add</span>
                                </div>
                              </div>
                            );
                          })
                          : <div className="playlists-loading-state"></div>
                        }
                      </div>
                    }
                  </div>
              )})
              : <div className="channel-empty-state">No Results</div>}
          </div>
        </div>
        {mixKeys.length > 0 &&
          <div className="current-mix">
            {mixKeys.map(key => {
              let playlist = this.state.currentMix[key];
              return (
                <div className="playlist-result" key={`mix${key}`}>
                  <div className="playlist-name"><strong>{playlist.name}</strong> ({playlist.channel})</div>
                  <div className="playlist-action" onClick={() => this.removePlaylist(key)}>
                    <span className="material-icons">remove</span>
                  </div>
                </div>
              );
            })
            }
          </div>
        }
        {mixKeys.length > 1 &&
          <div className="mix-footer">
            <div className="footer-left">
              <input
                name="mix-name"
                onChange={(e) => this.setState({mixName: e.target.value})}
                value={this.state.mixName}
              />
            </div>
            <div className="footer-right">
              <button className="btn blue" onClick={() => this.createMix()}>Create</button>
            </div>
          </div>
        }
      </div>
    );
  }
}

Mixer.propTypes = {
  close: PropTypes.func
}

Mixer.defaultProps = {
  close: () => {}
}
