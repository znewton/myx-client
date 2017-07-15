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

class App extends Component {
  constructor () {
    super();
    this.state = {
      selectedMixId: null,
      selectedMixName: '',
      selectedMixOrderedVideos: [],
      selectedMixVideoMap: {},
      selectedVideo: null,
      currentVideoId: null,
    };
  }
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
  getMixSongs (playlists) {
    let params = queryString.stringify({playlists: playlists});
    axios.get(`http://myxx.herokuapp.com/mix?${params}`)
      .then(response => {
        if (response.data && response.data.videoMap && response.data.orderedVideoIds) {
          let videoMap = response.data.videoMap;
          let orderedVideos = response.data.orderedVideoIds;
          let firstVideo = videoMap[orderedVideos[0]].resourceId.videoId;
          let firstSelectedVideo = orderedVideos[0];
          this.setState({selectedMixVideoMap: videoMap, selectedMixOrderedVideos: orderedVideos, selectedVideo: firstSelectedVideo, currentVideoId: firstVideo});
        }
      }).catch(error => console.log(error));
  }
  handleVideoSelect (videoId) {
    this.setState({selectedVideo: videoId, currentVideoId: this.state.selectedMixVideoMap[videoId].resourceId.videoId});
  }
  handleNextVideo () {
    let orderedVideos = this.state.selectedMixOrderedVideos;
    let currentVideo = this.state.selectedVideo;
    let nextVideo = orderedVideos[orderedVideos.indexOf(currentVideo) + 1];
    this.setState({selectedVideo: nextVideo, currentVideoId: this.state.selectedMixVideoMap[nextVideo].resourceId.videoId});
  }
  render () {
    let queue = this.state.selectedMixOrderedVideos.map(id => {
      let video = this.state.selectedMixVideoMap[id];
      return {
        id: id,
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnails ? video.thumbnails.medium.url : null,
      }
    })
    return (
      <div className="App">
        <Navbar currentMixName={this.state.selectedMixName} />
        <Sidebar onSelect={this.handleMixSelect.bind(this)} />
        <Player id={this.state.currentVideoId} onEnd={this.handleNextVideo.bind(this)} />
        <Queue songs={queue} onSelect={this.handleVideoSelect.bind(this)} selectedId={this.state.selectedVideo} />
      </div>
    );
  }
}

export default App;
