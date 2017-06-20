import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Video.scss';

export default class Video extends Component {
  render () {
    return (
      <div className="Video">
        <iframe src={`http://www.youtube.com/embed/${this.props.id}`}
            width="560" height="315" frameborder="0" allowfullscreen title="current song" />
      </div>
    );
  }
}

Video.propTypes = {
  id: PropTypes.string.isRequired
}

Video.defaultProps = {}
