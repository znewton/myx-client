import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import './Sidebar.css';

export default class Sidebar extends Component {
  render () {
    return (
      <div className="Sidebar">
        {this.props.mixes.map(mix => (
          <div className="li" key={mix.id} onClick={() => this.props.onSelect(mix.id)}>
            <div className="title">{mix.title}</div>
            <div className="description">
              channels here
            </div>
          </div>
        ))}
      </div>
    );
  }
}

Sidebar.propTypes = {
  mixes: PropTypes.array
  onSelect: PropTypes.func
}

Sidebar.defaultProps = {
  mixes: [],
  onSelect: () => {}
}
