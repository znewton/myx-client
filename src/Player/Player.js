import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import './Player.css';

import Video from '../components/Video/Video';

export default class Player extends Component {
  render () {
    return (
      <div className="Player" id="Player">
        <Video
          id="C0DPdy98e4c"
          parent="Player"
          onPlay={(state) => console.log(state)} />
      </div>
    );
  }
}

Player.propTypes = {}

Player.defaultProps = {}
