
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

/**
 * Write a new mix for a user in Firebase.
 * 
 * @param {string} name 
 * @param {string[]} playlists 
 * @param {string[]} channels 
 */
function editMix(name, playlists, channels) {
  let newMixRef = firebase.database().ref(`/mixes/${firebase.auth().currentUser.uid}`).push();
  newMixRef.set({
    name: name,
    playlists: playlists,
    channels: channels
  });
}

/**
 * Overwrite an existing mix.
 * 
 * @param {string} id 
 * @param {string} name 
 * @param {string[]} playlists 
 * @param {string} channels 
 */
function editMix(id, name, playlists, channels) {
  let mixRef = firebase.database().ref(`/mixes/${firebase.auth().currentUser.uid}/${id}`);
  mixRef.set({
    name: name,
    playlists: playlists,
    channels: channels
  })
}

/**
 * Delete a mix by id.
 * 
 * @param {string} id 
 */
function deleteMix(id) {
  let mixRef = firebase.database().ref(`/mixes/${firebase.auth().currentUser.uid}/${id}`);
  mixRef.remove();
}