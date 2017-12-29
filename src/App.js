import React, { Component } from 'react';
import './sass/App.css';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import axios from 'axios';
import queryString from 'query-string';

import FbHelpers from './lib/Firebase/Firebase';
import { endpoint } from './lib/constants';

import Navbar from './Navbar/Navbar';
import MixMenu from './MixMenu/MixMenu';
import Player from './Player/Player';
import Queue from './Queue/Queue';
import Mixer from './Navbar/mixing/Mixer';
import Modal from './components/Modal/Modal';
import Events from './lib/Events/Events';

export default class App extends Component {
  constructor () {
    super();
    this.initialState = {
      // video selection
      selectedMixId: null,
      selectedMixName: '',
      selectedMixOrderedVideos: [],
      selectedMixVideoMap: {},
      selectedVideo: null,
      currentVideoId: null,
      // auth
      loggedIn: false,
      // side menus
      mixMenuOpen: true,
      queueOpen: false,
      partialMixMenuOpen: false,
      partialQueueOpen: false,
      // modals
      editMixModalOpen: null,
      deleteMixModalOpen: null,
    };
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
    // ping heroku server to wake up dormant dyno
    axios.get(`${endpoint}/ping`)
      .then(response => {
        if (response.data && response.data.message) {
          console.log(response.data.message);
        }
      }).catch(error => console.error(error));
  }
  componentWillUnmount() {
    const events = ['editMixModal', 'deleteMixModal'];
    for (let i = 0; i < events.length; i++) {
      Events.removeOneTimeEvent(`${events[i]}OpenToggle`);
    }
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
        };
      });
      this.currentMix = this.state.selectedMixId;
    } else if (this.state.loading) {
        this.queue = [];
    }
    let playerPlaceholder = <h1>Select or Create a Mix</h1>;
    if (this.state.loggedIn) {
      if (this.state.loading) {
        playerPlaceholder = <h1 className="loading-dots">Generating mix</h1>;
      }
    } else {
      playerPlaceholder = <h1>Login or Signup to Get Started</h1>;
    }
    return (
      <div className="App">
        {this.editMixModal()}
        {this.deleteMixModal()}
        <Navbar 
          loggedIn={this.state.loggedIn} 
          currentMixName={this.state.selectedMixName} 
          signOut={this.handleSignOut}
          leftMenuOpen={this.state.mixMenuOpen}
          toggleLeftMenu={this.toggleMixMenu.bind(this)}
          partialToggleLeftMenu={this.partialToggleMixMenu.bind(this)}
          rightMenuOpen={this.state.queueOpen}
          toggleRightMenu={this.toggleQueue.bind(this)}
          partialToggleRightMenu={this.partialToggleQueue.bind(this)}
        />
        <Queue 
          videos={this.queue} 
          onSelect={this.handleVideoSelect.bind(this)} 
          selectedId={this.state.selectedVideo} 
          open={this.state.queueOpen}
          partialOpen={this.state.partialQueueOpen}
        />
        <MixMenu 
          onSelect={this.handleMixSelect.bind(this)} 
          activeMix={this.state.selectedMixId} 
          open={this.state.mixMenuOpen}
          partialOpen={this.state.partialMixMenuOpen}
          onEdit={this.handleMixEditDelete.bind(this)}
          onDelete={this.handleMixEditDelete.bind(this)}
        />
        <Player
          id={this.state.currentVideoId}
          onEnd={this.handleNextVideo.bind(this)}
          emptyMessage={playerPlaceholder}
        />
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
        this.toggleMixMenu();
        this.partialToggleMixMenu(false);
        setTimeout(() => {
          this.toggleQueue();
        }, 200);
      }
    }).catch(error => console.error(error));
  }
  /**
   * Generate a mix via the myx-api.
   * 
   * @param {Object[]} playlists 
   */
  getMixSongs (playlists) {
    this.setState({loading: true, currentVideoId: null});
    let params = queryString.stringify({playlists: playlists});
    axios.get(`${endpoint}/mix?${params}`)
      .then(response => {
        if (response.data && response.data.videoMap && response.data.orderedVideoIds) {
          let videoMap = response.data.videoMap;
          let orderedVideos = response.data.orderedVideoIds;
          let firstVideo = videoMap[orderedVideos[0]].resourceId.videoId;
          let firstSelectedVideo = orderedVideos[0];
          this.setState({loading: false, selectedMixVideoMap: videoMap, selectedMixOrderedVideos: orderedVideos, selectedVideo: firstSelectedVideo, currentVideoId: firstVideo});
          document.title = videoMap[orderedVideos[0]].title;
        }
      }).catch(error => console.error(error));
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

  handleSignOut () {
    firebase.auth().signOut();
  }

  toggleMixMenu () {
    let mixMenuOpen = !this.state.mixMenuOpen;
    this.setState({
      mixMenuOpen: mixMenuOpen
    });
  }

  toggleQueue () {
    let queueOpen = !this.state.queueOpen;
    this.setState({
      queueOpen: queueOpen
    });
  }

  partialToggleMixMenu (enter) {
    if (this.state.mixMenuOpen) return;
    this.setState({partialMixMenuOpen: enter});
  }

  partialToggleQueue (enter) {
    if (this.state.queueOpen) return;
    this.setState({partialQueueOpen: enter});
  }

  
  /**
   * Mix action functions.
   */

  handleMixEditDelete(e, name, id) {
    this.toggleMixEditDeleteMenu(e, `${name}MixModal`, id);
  }
  
  /**
   * Open/close a menu. Does not add window click event for modals.
   * 
   * @param {*} e 
   * @param {*} name 
   */
  toggleMixEditDeleteMenu(e, name, param) {
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
  closeMixEditDeleteMenu(e, name) {
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
      handleClose={(e) => this.closeMixEditDeleteMenu(e, name)}
      open={this.state[`${name}Open`] !== null}
      bindTo={openFromId}
    >
      {contents}
    </Modal>

  editMixModal = () => this.modal(
    <Mixer close={(e) => this.closeMixEditDeleteMenu(e, 'editMixModal')} id={this.state.editMixModalOpen} />, 
    'Edit Mix', 'editMixModal', `Mix_${this.state.editMixModalOpen}`
  );

  deleteMixModal = () => this.modal(
    this.deleteMixModalContents(), 'Delete Mix', 'deleteMixModal', `Mix_${this.state.deleteMixModalOpen}`
  );

  deleteMixModalContents = () => (
    <div className="delete-modal-content">
      <div>Are you sure you want to delete this mix?</div>
      <div className="delete-button-bar">
        <button className="btn" onClick={(e) => this.closeMixEditDeleteMenu(e, 'deleteMixModal')}>Cancel</button>
        <button className="btn blue" onClick={(e) => {
          this.closeMenu(e, 'deleteMixModal');
          FbHelpers.deleteMix(this.state.deleteMixModalOpen);
        }}>Delete</button>
      </div>
    </div>);
}
