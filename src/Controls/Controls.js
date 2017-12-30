import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Controls.css';

import ClassNameBuilder from '../lib/ClassNameBuilder/ClassNameBuilder';

class Controls extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.currentVideoId !== this.props.currentVideoId
      || nextProps.isFavorite !== this.props.isFavorite;
  }
  render () {
    let classNameBuilder = new ClassNameBuilder('Controls');
    classNameBuilder.add('show', this.props.currentVideoId);
    let title = '';
    let description = '';
    let imgUrl = '';
    if (this.props.currentVideo) {
      title = this.props.currentVideo.title;
      description = this.props.currentVideo.channelTitle;
      imgUrl = this.props.currentVideo.thumbnails.medium.url;
    }
    return (
      <div className={classNameBuilder.className}>
        <div className="control-bar">
          <span className="thumbnail">
            {imgUrl &&
            <img src={imgUrl} alt="video thumbnail" />
            }
          </span>
          <span className="video-info">
            <div className="title">{title}</div>
            <div className="channel">{description}</div>
          </span>
          <span className="separator"></span>
          <span 
            className="material-icons"
            onClick={() => this.props.onPrevious()}
          >
            skip_previous
          </span>
          {/*<span 
            className="material-icons sm"
            onClick={() => this.props.onFavorite(this.props.currentVideoId)}
          >
            favorite{!this.props.isFavorite && '_border'}
          </span>*/}
          <span 
            className="material-icons"
            onClick={() => this.props.onNext()}
          >
            skip_next
          </span>
        </div>
      </div>
    );
  }
}

Controls.propTypes = {
  currentVideo: PropTypes.object,
  currentVideoId: PropTypes.string,
  isFavorite: PropTypes.bool,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  onFavorite: PropTypes.func,
};

Controls.defaultProps = {
  isFavorite: false,
  onNext: () => {},
  onPrevious: () => {},
  onFavorite: () => {},
};

export default Controls;
