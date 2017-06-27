import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Mixer.css';

export default class Mixer extends Component {
  render () {
    return (
      <div className="Mixer">
        Mix it Up!
      </div>
    );
  }
}

Mixer.propTypes = {
  close: PropTypes.func
}

Mixer.defaultProps = {
  close: () => {}
}
