import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Queue.scss';

import QueuedVideo from './QueuedVideo/QueuedVideo.js';
import ClassNameBuilder from '../lib/ClassNameBuilder/ClassNameBuilder';

export default class Queue extends Component {
  constructor () {
    super();
    this.state = {
      searchTerm: ''
    };
  }
  /**
   * Life-cycle functions
   */
  
  componentWillReceiveProps(newProps) {
    if (newProps.selectedId === this.props.selectedId) return;
    let selectedVideo = newProps.selectedId;
    let queueElement = document.getElementById(`queued-${selectedVideo}`);
    if (queueElement) {
      queueElement.scrollIntoView({
        behavior: "smooth"
      });
    }
  }
  render () {
    let videos = this.props.videos;
    if (this.state.searchTerm) {
      videos = videos
      .filter(video =>
        video.title.toLowerCase().includes(this.state.searchTerm) ||
        video.description.toLowerCase().includes(this.state.searchTerm));
    }
    let classNameBuilder = new ClassNameBuilder('Queue');
    classNameBuilder.add('open', this.props.open);
    classNameBuilder.add('part-open', this.props.partialOpen);
    return (
      <div className={classNameBuilder.className}>
        {this.props.videos.length > 0 &&
          <div className="queue-search-wrapper">
            <input
              name="videos-search"
              placeholder="Search queue..."
              type="string"
              className="search"
              value={this.state.searchTerm}
              onChange={this.handleSearchChange.bind(this)} />
            <span className="material-icons searchIcon">search</span>
          </div>
        }
        <div className="wrapper" ref="Queue">
          {videos.map(video => (
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
  /**
   * Update the search term on input.
   * 
   * @param {Object} event 
   */
  handleSearchChange(event) {
    this.setState({searchTerm: event.target.value.toLowerCase()});
  }
}

Queue.propTypes = {
  selectedId: PropTypes.string,
  videos: PropTypes.array,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  partialOpen: PropTypes.bool,
};

Queue.defaultProps = {
  videos: [],
  onSelect: () => {}
};
