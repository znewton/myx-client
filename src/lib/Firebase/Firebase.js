
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

/**
 * Return a future promise of a mix.
 * 
 * @param {string} id 
 */
function getMix(id) {
  let mixRef = firebase.database().ref(`/mixes/${firebase.auth().currentUser.uid}/${id}`);
  return new Promise((resolve, reject) => {
    mixRef.once('value', snapshot => {
      let mix = snapshot.val();
      mix.id = snapshot.key;
      resolve(mix);
    });
  });
}

/**
 * Write a new mix for a user in Firebase.
 * 
 * @param {string} name 
 * @param {string[]} playlists 
 * @param {string[]} channels 
 */
function createMix(name, playlists, channels) {
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

export default {
  getMix, createMix, editMix, deleteMix
}