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
		this.setupPlayer(this.props.id)
  }
	componentWillReceiveProps(newProps) {
		if (newProps.id !== this.props.id) {
			this.player.loadVideoById(newProps.id);
		}
	}
	setupPlayer(id) {
		YouTubeIframeLoader.load((YT) => {
			this.YT = YT;
			const parent = document.getElementById(this.props.parent);
			let dimensions = this.getRatioDimensions(parent.offsetWidth, parent.offsetHeight);
	    this.player = new YT.Player(`ytplayer-${this.props.parent}`, {
	      height: dimensions.height,
	      width: dimensions.width,
	      videoId: id,
				playerVars: {
					color: 'white'
				},
				events: {
					'onReady': this.onPlayerReady.bind(this),
					'onStateChange': this.onPlayerStateChange.bind(this),
					'onError': this.onPlayerError.bind(this)
				}
	    });
			new ResizeSensor(parent, () => {
				let dimensions = this.getRatioDimensions(parent.offsetWidth, parent.offsetHeight);
				this.player.getIframe().width = dimensions.width;
				this.player.getIframe().height = dimensions.height;
			});
	  });
	}
  render () {
    return (
      <div className="Video">
				<div id={`ytplayer-${this.props.parent}`} />
      </div>
    );
  }
	onPlayerReady (event) {
		event.target.playVideo();
	}
	onPlayerStateChange (event) {
		let self = this;
		switch(event.data) {
			case self.YT.PlayerState.PLAYING:
				self.props.onPlay(event);
				break;
			case self.YT.PlayerState.ENDED:
				self.props.onEnd(event);
				break;
			case self.YT.PlayerState.PAUSED:
				self.props.onPause(event);
				break;
			case self.YT.PlayerState.BUFFERING:
				self.props.onBuffer(event);
				break;
			case self.YT.PlayerState.CUED:
				self.props.onCued(event);
				break;
			default:
		}
	}
	onPlayerError(event) {
		let self = this;
		switch (event.data) {
			case 2:
			case 100:
			case 101:
			case 150:
				self.props.onEnd(event);
				break;
			default:
		}
	}
	getRatioDimensions(width, height) {
		var ratio = 9/16;
		if (width * ratio > height) {
			return {
				width: height/ratio,
				height: height
			}
		}
		return {
			width:  width,
			height: width*ratio
		}
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
