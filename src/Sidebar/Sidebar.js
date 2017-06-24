import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css';

export default class Sidebar extends Component {
  constructor () {
    super();
    this.state = {
      searchTerm: ''
    }
  }
  handleSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }
  render () {
    let mixes = this.props.mixes;
    if (this.state.searchTerm) {
      mixes = mixes
        .filter(mix =>
          mix.title.includes(this.state.searchTerm) ||
          mix.channels.filter(channel => channel.includes(this.state.searchTerm)).length);
    }
    return (
      <div className="Sidebar">
        {this.props.mixes.length > 0 &&
          <div className="mix-search-wrapper">
            <input
              name="mixes-search"
              placeholder="Search mixes..."
              type="string"
              className="search"
              value={this.state.searchTerm}
              onChange={this.handleSearchChange} />
          </div>
        }
        <div className="mixes-wrapper">
          {mixes.map(mix => (
            <div className="li" key={mix.id} onClick={() => this.props.onSelect(mix.id)}>
              <div className="title">{mix.title}</div>
              <div className="description">
                {mix.channels && mix.channels.map((channel,i) => <span key={i}>{channel}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  mixes: PropTypes.array,
  onSelect: PropTypes.func
}

Sidebar.defaultProps = {
  mixes: [],
  onSelect: () => {}
}
