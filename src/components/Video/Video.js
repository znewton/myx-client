import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResizeSensor } from 'css-element-queries';
import YouTubeIframeLoader from 'youtube-iframe';
import './Video.scss';

export default class Video extends Component {
	constructor() {
		super();
		this.state = {
			width: 560,
			height: 315
		};
		this.player = null;
		this.YT = null;
	}
  componentDidMount () {
	  // Load the IFrame Player API code asynchronously.
	  const tag = document.createElement('script');
	  tag.src = "https://www.youtube.com/player_api";
	  const firstScriptTag = document.getElementsByTagName('script')[0];
	  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	  // Replace the 'ytplayer' element with an <iframe> and
	  // YouTube player after the API code downloads.
		YouTubeIframeLoader.load((YT) => {
			console.log()
			this.YT = YT;
			const parent = document.getElementById(this.props.parent);
			let size = parent.offsetWidth;
			this.setState({width: size, height: size*9/16});
	    this.player = new YT.Player(`ytplayer-${this.props.parent}`, {
	      height: size*9/16,
	      width: size,
	      videoId: this.props.id,
				events: {
					'onReady': onPlayerReady,
					'onStateChange': onPlayerStateChange
				}
	    });
			new ResizeSensor(parent, () => {
				size = parent.offsetWidth;
				this.player.getIframe().width = size;
				this.player.getIframe().height = size*9/16;
			});
			const self = this;
			function onPlayerReady(event) {
        event.target.playVideo();
      }
			function onPlayerStateChange(event) {
				switch(event.data) {
					case YT.PlayerState.PLAYING:
	          self.props.onPlay(event);
						break;
					case YT.PlayerState.ENDED:
	          self.props.onEnd(event);
						break;
					case YT.PlayerState.PAUSED:
	          self.props.onPause(event);
						break;
					case YT.PlayerState.BUFFERING:
	          self.props.onBuffer(event);
						break;
					case YT.PlayerState.CUED:
	          self.props.onCued(event);
						break;
					default:
						console.log('state change not handled');
				}
			}
	  });
  }
  render () {
    return (
      <div className="Video">
				<div id={`ytplayer-${this.props.parent}`} />
        {/* <iframe src={`http://www.youtube.com/embed/${this.props.id}`}
            width={this.state.width} height={this.state.height} frameBorder="0" title="current song" ref="video" /> */}
      </div>
    );
  }
}

Video.propTypes = {
  id: PropTypes.string.isRequired,
  parent: PropTypes.string.isRequired,
	onPlay: PropTypes.func,
	onEnd: PropTypes.func,
	onPause: PropTypes.func,
	onBuffer: PropTypes.func,
	onCued: PropTypes.func,
}

Video.defaultProps = {
	onPlay: () => {},
	onEnd: () => {},
	onPause: () => {},
	onBuffer: () => {},
	onCued: () => {},
}
