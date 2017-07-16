import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Channel.css';

export default class Channel extends Component {
  render () {
    return (
      <div className="Channel">
        <div className="thumbnail">
          <img src={this.props.thumbnail} alt="channel thumbnail" />
        </div>
        <div className="info">
          <div className="channel-title">{this.props.title}</div>
          <div className="channel-description">{this.props.description}</div>
        </div>
        <div className="channel-playlist-toggle" onClick={() => this.props.onPlaylistToggle()}>
          <span className="material-icons">keyboard_arrow_down</span>
        </div>
      </div>
    );
  }
}

Channel.propTypes = {
  thumbnail: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  onPlaylistToggle: PropTypes.func,
}

Channel.defaultProps = {
  thumbnail: '',
  title: '',
  description: '',
  onPlaylistToggle () {}
}
