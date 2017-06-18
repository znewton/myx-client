import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Video.scss';

export default Video extends Component {
  render () {
    return (
      <div className="Video">
        <iframe />
      </div>
    );
  }
}

Video.propTypes = {
  id: PropTypes.string.isRequired
}

Video.defaultProps = {}
