import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Mix.css';

export default class Mix extends Component {
  render () {
    return (
      <div
        className={'Mix' + (this.props.selected ? ' selected' : '')}
        onClick={() => this.props.onClick()}>
          <div className="title">{this.props.name}</div>
          <div className="description">
            {this.props.channels && this.props.channels.map((channel,i) =>
              <span key={i}>{channel}{i < this.props.channels.length-1 && ', '}</span>
            )}
          </div>
          <button className="settings-button" title="settings">
            <span className="material-icons">settings</span>
          </button>
          <button className="delete-button" title="delete">
            <span className="material-icons">delete</span>
          </button>
      </div>
    );
  }
}

Mix.propTypes = {
  onClick: PropTypes.func,
  name: PropTypes.string,
  channels: PropTypes.arrayOf(PropTypes.string),
  selected: PropTypes.bool
}

Mix.defaultProps = {
  selected: false
}
