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
	    this.player = new YT.Player(`ytplayer-${this.props.parent}`, {
	      height: size*9/16,
	      width: size,
	      videoId: this.props.id,
				playerVars: {
					color: 'white'
				},
				events: {
					'onReady': this.onPlayerReady,
					'onStateChange': this.onPlayerStateChange
				}
	    });
			new ResizeSensor(parent, () => {
				size = parent.offsetWidth;
				this.player.getIframe().width = size;
				this.player.getIframe().height = size*9/16;
			});
	  });
  }
	componentWillReceiveProps(newProps) {
		const parent = document.getElementById(this.props.parent);
		let size = parent.offsetWidth;
		this.player = new this.YT.Player(`ytplayer-${this.props.parent}`, {
			height: size*9/16,
			width: size,
			videoId: this.props.id,
			playerVars: {
				color: 'white'
			},
			events: {
				'onReady': this.onPlayerReady,
				'onStateChange': this.onPlayerStateChange
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
	onPlayerReady (event) {
		event.target.playVideo();
	}
	onPlayerStateChange (event) {
		switch(event.data) {
			case this.YT.PlayerState.PLAYING:
				this.props.onPlay(event);
				break;
			case this.YT.PlayerState.ENDED:
				this.props.onEnd(event);
				break;
			case this.YT.PlayerState.PAUSED:
				this.props.onPause(event);
				break;
			case this.YT.PlayerState.BUFFERING:
				this.props.onBuffer(event);
				break;
			case this.YT.PlayerState.CUED:
				this.props.onCued(event);
				break;
			default:
				console.log('state change not handled');
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
