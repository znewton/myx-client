import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Queue.css';

import QueuedVideo from './QueuedVideo/QueuedVideo.js';

export default class Queue extends Component {
  componentWillReceiveProps(newProps) {
    let selectedVideo = newProps.selectedId;
    let queueElement = document.getElementById(`queued-${selectedVideo}`);
    if (queueElement) {
      let queueRef = this.refs.Queue;
      queueRef.scrollLeft = queueElement.offsetLeft-10;
    }
  }
  render () {
    return (
      <div className="Queue" ref="Queue">
        <div className="wrapper">
          {this.props.videos.map(video => (
            <QueuedVideo
              key={video.id}
              id={video.id}
              isSelected={video.id === this.props.selectedId}
              onClick={() => this.props.onSelect(video.id)}
              thumbnail={video.thumbnail}
              title={video.title}
              description={video.description}
            />
          ))}
        </div>
      </div>
    );
  }
}

Queue.propTypes = {
  selectedId: PropTypes.string,
  videos: PropTypes.array,
  onSelect: PropTypes.func
}

Queue.defaultProps = {
  videos: [],
  onSelect: () => {}
}
