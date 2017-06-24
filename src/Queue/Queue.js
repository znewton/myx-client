import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import './Queue.css';

export default class Queue extends Component {
  render () {
    return (
      <div className="Queue">
        <div className="wrapper">
          {[1,2,3,4,5,6,7,8,9,10].map(i => (
            <div className="li" key={i}>
              <div className="thumbnail"><span /></div>
              <div className="info">
                <div className="title">Song {i}</div>
                <div className="duration">{i}:00:00</div>
                <div className="description">
                  lisjkhfd losjh fglsd isurghi slirgh hdkdf isjkdfhgsldjfh lksjdfghlskdfgh sdkjfhgkj
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

Queue.propTypes = {}

Queue.defaultProps = {}
