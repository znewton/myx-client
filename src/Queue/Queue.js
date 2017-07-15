import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Queue.css';

export default class Queue extends Component {
  componentWillReceiveProps(newProps) {
    let selectedSong = newProps.selectedId;
    let queueElement = document.getElementById(`queued-${selectedSong}`);
    if (queueElement) {
      let queueRef = this.refs.Queue;
      queueRef.scrollLeft = queueElement.offsetLeft-10;
    }
  }
  render () {
    return (
      <div className="Queue" ref="Queue">
        <div className="wrapper">
          {this.props.songs.map(song => (
            <div
              className={'li' + (song.id === this.props.selectedId ? ' selected' : '')}
              key={song.id}
              id={`queued-${song.id}`}
              onClick={() => this.props.onSelect(song.id)}
            >
              <div className="thumbnail">
                {song.thumbnail ?
                <img src={song.thumbnail} alt="video thumbnail" /> :
                <span /> }
                <span className="material-icons play-button">play_arrow</span>
              </div>
              <div className="info">
                <div className="title">{song.title}</div>
                <div className="duration"></div>
                <div className="description">
                  {song.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

Queue.propTypes = {
  selectedId: PropTypes.string,
  songs: PropTypes.array,
  onSelect: PropTypes.func
}

Queue.defaultProps = {
  songs: [],
  onSelect: () => {}
}
