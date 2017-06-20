import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MixBuilder.css';

export default class MixBuilder extends Component {
  render () {
    return (
      <div className="MixBuilder" style={{display: this.props.open ? 'block' : 'none'}}>
        MixBuilder
      </div>
    );
  }
}

MixBuilder.propTypes = {
  open: PropTypes.bool
}

MixBuilder.defaultProps = {
  open: false
}
