import React, { Component } from 'react';
import './sass/App.css';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import axios from 'axios';
import queryString from 'query-string';

import Navbar from './Navbar/Navbar';
import Sidebar from './Sidebar/Sidebar';
import Player from './Player/Player';
import Queue from './Queue/Queue';

export default class App extends Component {
  constructor () {
    super();
    this.initialState = {
      selectedMixId: null,
      selectedMixName: '',
      selectedMixOrderedVideos: [],
      selectedMixVideoMap: {},
      selectedVideo: null,
      currentVideoId: null,
      loggedIn: false,
    }
    this.state = this.initialState;
    this.currentMix = null;
    this.queue = [];
  }
  /**
   * Life-cycle functions
   */

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({loggedIn: true});
      } else {
        this.setState(this.initialState);
      }
    });
  }
  render () {
    if ((!this.state.loading && !this.queue.length) || (this.currentMix !== this.state.selectedMixId && this.state.selectedMixOrderedVideos.length)) {
      this.queue = this.state.selectedMixOrderedVideos.map(id => {
        let video = this.state.selectedMixVideoMap[id];
        return {
          id: id,
          title: video.title,
          description: video.channelTitle,
          thumbnail: video.thumbnails ? video.thumbnails.medium.url : null,
        }
      });
      this.currentMix = this.state.selectedMixId;
    } else if (this.state.loading) {
        this.queue = [];
    }
    let playerPlaceholder = <h1>Select or Create a Mix</h1>;
    if (this.state.loggedIn) {
      if (this.state.loading) {
        playerPlaceholder = <h1 className="loading-dots">Generating mix</h1>
      }
    } else {
      playerPlaceholder = <h1>Login or Signup to Get Started</h1>;
    }
    return (
      <div className="App">
        <Navbar currentMixName={this.state.selectedMixName} />
        <Sidebar onSelect={this.handleMixSelect.bind(this)} activeMix={this.state.selectedMixId} />
        <Player
          id={this.state.currentVideoId}
          onEnd={this.handleNextVideo.bind(this)}
          emptyMessage={playerPlaceholder}
        />
        <Queue videos={this.queue} onSelect={this.handleVideoSelect.bind(this)} selectedId={this.state.selectedVideo} />
      </div>
    );
  }
  /**
   * Event Handlers
   */

  /**
   * Update selected mix info from firebase.
   * 
   * @param {string} mixId
   */
  handleMixSelect (mixId) {
    let mixRef = firebase.database().ref(`/mixes/${firebase.auth().currentUser.uid}/${mixId}`);
    mixRef.once('value').then(snapshot => {
      if (snapshot.val()) {
        let name = snapshot.val().name;
        let playlists = snapshot.val().playlists;
        this.setState({selectedMixId: mixId, selectedMixName: name});
        this.getMixSongs(playlists);
      }
    }).catch(error => console.log(error));
  }
  /**
   * Generate a mix via the myx-api.
   * 
   * @param {Object[]} playlists 
   */
  getMixSongs (playlists) {
    this.setState({loading: true, currentVideoId: null})
    let params = queryString.stringify({playlists: playlists});
    axios.get(`https://myxx.herokuapp.com/mix?${params}`)
      .then(response => {
        if (response.data && response.data.videoMap && response.data.orderedVideoIds) {
          let videoMap = response.data.videoMap;
          let orderedVideos = response.data.orderedVideoIds;
          let firstVideo = videoMap[orderedVideos[0]].resourceId.videoId;
          let firstSelectedVideo = orderedVideos[0];
          this.setState({loading: false, selectedMixVideoMap: videoMap, selectedMixOrderedVideos: orderedVideos, selectedVideo: firstSelectedVideo, currentVideoId: firstVideo});
          document.title = videoMap[orderedVideos[0]].title;
        }
      }).catch(error => console.log(error));
  }
  /**
   * Update the selected video into the player and the document title.
   * 
   * @param {string} videoId 
   */
  handleVideoSelect (videoId) {
    this.setState({selectedVideo: videoId, currentVideoId: this.state.selectedMixVideoMap[videoId].resourceId.videoId});
    document.title = this.state.selectedMixVideoMap[videoId].title;
  }
  /**
   * Update the selected video to be the next video in the queue.
   */
  handleNextVideo () {
    let orderedVideos = this.state.selectedMixOrderedVideos;
    let currentVideo = this.state.selectedVideo;
    let nextVideo = orderedVideos[orderedVideos.indexOf(currentVideo) + 1];
    this.handleVideoSelect(nextVideo);
  }
}
