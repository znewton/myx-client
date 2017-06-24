import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Player.css';

import Video from '../components/Video/Video';

export default class Player extends Component {
  render () {
    return (
      <div className="Player" id="Player">
        {this.props.id ?
          <Video
            id={this.props.id}
            parent="Player"
            onEnd={() => this.props.onEnd()} />
        : <div className="emptyMessage">{this.props.emptyMessage}</div>
        }
      </div>
    );
  }
}

Player.propTypes = {
  onEnd: PropTypes.func,
  id: PropTypes.string,
  emptyMessage: PropTypes.oneOf([
    PropTypes.element,
    PropTypes.string
  ])
}

Player.defaultProps = {
  onEnd: () => {},
  id: null,
  emptyMessage: <h1>Select or Create a Mix</h1>
}
