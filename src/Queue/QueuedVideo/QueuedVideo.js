import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './QueuedVideo.scss';

export default class QueuedVideo extends Component {
  render () {
    return (
      <div
        className={'QueuedVideo' + (this.props.isSelected ? ' selected' : '')}
        id={`queued-${this.props.id}`}
        onClick={() => this.props.onClick()}
      >
        <div className="thumbnail">
          {this.props.thumbnail ?
          <img src={this.props.thumbnail} alt="video thumbnail" /> :
          <span /> }
          <span className="material-icons play-button">play_arrow</span>
          <div className="duration"></div>
        </div>
        <div className="info">
          <div 
            className="title" 
            title={this.props.title}
          >
            {this.props.title}
          </div>
          <div 
            className="description" 
            title={this.props.description}
          >
            {this.props.description}
          </div>
        </div>
      </div>
    );
  }
}

QueuedVideo.propTypes = {
  id: PropTypes.string,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
  thumbnail: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string
}

QueuedVideo.defaultProps = {}
