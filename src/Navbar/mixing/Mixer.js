import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import axios from 'axios';
import 'firebase/auth';
import 'firebase/database';
import queryString from 'query-string';
import './Mixer.css';

import Events from '../../lib/Events/Events';
import Channel from './Channel/Channel';
import Playlist from './Playlist/Playlist';

export default class Mixer extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: '',
      searching: false,
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
    this.setState({searching: true, selectedChannel: null, selectedChannelPlaylists: {}})
    if (this.state.searchTerm === '') {
      this.setState({searching: false, channels: {}});
      return;
    }
    let params = queryString.stringify({q: this.state.searchTerm});
    axios.get(`https://myxx.herokuapp.com/channels?${params}`)
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
          this.setState({searching: false, channels: channels});
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
    axios.get(`https://myxx.herokuapp.com/playlists/${channelId}`)
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
          <div className="search-bar">
            <input
              placeholder="Search channels..."
              name="search"
              onChange={(e) => this.handleSearchInput(e.target.value)}
              value={this.state.searchTerm} />
            <span className="material-icons searchIcon">search</span>
          </div>
          <div className="channels">
            {channelKeys.length ?
              channelKeys.map(key => {
                let channel = this.state.channels[key];
                return (
                  <div className="channel-result" key={key}>
                    <Channel
                      thumbnail={channel.thumbnail}
                      title={channel.title}
                      description={channel.description}
                      onPlaylistToggle={() => this.getPlaylists(key)}
                    />
                    {this.state.selectedChannel === key &&
                      <div className="channel-playlists">
                        {playlistKeys.length ?
                          playlistKeys.filter(key => !this.state.currentMix[key]).map(key => {
                            let playlist = this.state.selectedChannelPlaylists[key];

                            return (
                              <Playlist
                                key={key}
                                name={playlist.name}
                                action={() => this.addPlaylist(key)}
                                actionIcon="add"
                              />
                            );
                          })
                          : <div className="playlists-loading-state"></div>
                        }
                      </div>
                    }
                  </div>
              )})
              : (this.state.searching ?
                <div className="channel-empty-state loading-dots">Searching</div>
                : <div className="channel-empty-state">No Results</div>)}
          </div>
        </div>
        {mixKeys.length > 0 &&
          <div className="current-mix">
            {mixKeys.map(key => {
              let playlist = this.state.currentMix[key];
              return (
                <Playlist
                  key={`mix${key}`}
                  name={<span><strong>{playlist.name}</strong> ({playlist.channel})</span>}
                  action={() => this.removePlaylist(key)}
                  actionIcon="remove"
                />
              );
            })
            }
          </div>
        }
        {mixKeys.length > 1 &&
          <div className="mix-footer">
            <div className="footer-left">
              <div><label>Mix Name</label></div>
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
