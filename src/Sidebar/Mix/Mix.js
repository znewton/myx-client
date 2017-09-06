import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Mix.css';

export default class Mix extends Component {
  render () {
    return (
      <div
        id={`Mix_${this.props.id}`}
        className={'Mix' + (this.props.selected ? ' selected' : '')}
        onClick={(e) => this.props.onClick(e)}
      >
          <div className="title">{this.props.name}</div>
          <div className="description">
            {this.props.channels && this.props.channels.map((channel,i) =>
              <span key={i}>{channel}{i < this.props.channels.length-1 && ', '}</span>
            )}
          </div>
          {/*<button className="settings-button" title="edit" onClick={(e) => this.props.onEdit(e)}>
            <span className="material-icons">settings</span>
          </button>*/}
          <button className="delete-button" title="delete" onClick={(e) => this.props.onDelete(e)}>
            <span className="material-icons">delete</span>
          </button>

      </div>
    );
  }
}

Mix.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  channels: PropTypes.arrayOf(PropTypes.string),
  selected: PropTypes.bool,
  onEdit: PropTypes.func,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
}

Mix.defaultProps = {
  selected: false,
  id: Math.floor(Math.random() * 1000)
}
