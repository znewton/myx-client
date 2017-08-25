import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Mix.css';

export default class Mix extends Component {
  render () {
    return (
      <div className="Mix" onClick={() => this.props.onClick()}>
          <div className="title">{this.props.name}</div>
          <div className="description">
            {this.props.channels && this.props.channels.map((channel,i) => <span key={i}>{channel}{i < this.props.channels.length-1 && ', '}</span>)}
          </div>
      </div>
    );
  }
}

Mix.propTypes = {
  onClick: PropTypes.func,
  name: PropTypes.string,
  channels: PropTypes.arrayOf(PropTypes.string)
}

Mix.defaultProps = {}
