import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import queryString from 'query-string';
import './Mixer.css';

import Events from '../../lib/Events/Events';

export default class Mixer extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: 'koala kontrol',
      channels: {},
      selectedChannel: null,
      selectedChannelPlaylists: {},
      currentMix: {},
    };
    this.search = Events.debounce(this.search, 250);
  }
  handleSearchInput(value) {
    this.setState({searchTerm: value});
    this.search();
  }
  search() {
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
          this.setState({channels: channels})
        }
      })
      .catch(error => console.log(error));
  }
  getPlaylists(channelId) {

  }
  addPlaylist(id) {

  }
  removePlaylist(id) {

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
                    {this.selectedChannel === key &&
                      <div className="channel-playlists">
                        {playlistKeys.length ?
                          playlistKeys.map(key => {
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
                          : <div className="playlists-loading-state">
                              <span className="material-icons">more_horiz</span>
                            </div>}
                      </div>
                    }
                  </div>
              )})
              : <div className="channel-empty-state">No Results</div>}
          </div>
          {mixKeys.length > 0 &&
            <div className="current-mix">
              {mixKeys.map(key => {
                let playlist = this.state.selectedChannelPlaylists[key];
                return (
                  <div className="playlist-result" key={`mix${key}`}>
                    <div>
                      <div className="playlist-name">{playlist.name}</div>
                      <div className="playlist-action" onClick={() => this.removePlaylist(key)}>
                        <span className="material-icons">remove</span>
                      </div>
                    </div>
                  </div>
                );
              })
              }
            </div>
          }
        </div>
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
