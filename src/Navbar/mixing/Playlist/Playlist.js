import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Playlist.scss';

export default class Playlist extends Component {
  render () {
    return (
      <div className="Playlist">
        <div className="playlist-name">{this.props.name}</div>
        <div className="playlist-action" onClick={() => this.props.action()}>
          <span className="material-icons">{this.props.actionIcon}</span>
        </div>
      </div>
    );
  }
}

Playlist.propTypes = {
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  action: PropTypes.func,
  actionIcon: PropTypes.string,
}

Playlist.defaultProps = {
  name: '',
  action () {},
  actionIcon: 'add'
}
