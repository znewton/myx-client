import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Modal.scss';
import { addEndEventListener, removeEndEventListener } from '../../lib/Events/Events';
import Positioning from '../../lib/Positioning/Positioning';

export default class Modal extends Component {
  constructor() {
    super();
    this.state = {
      origin: null,
    };
    this.name = 'Modal_' + Math.random().toString(36).substring(7)
  }
  componentDidMount() {
    this.setState({
      origin: Positioning.updateOriginFromCoordinates(document.querySelector(this.props.bindTo))
    });
    addEndEventListener(window, 'resize', () => this.setState({
      origin: Positioning.updateOriginFromCoordinates(document.querySelector(this.props.bindTo))
    }), 100, this.name);
  }
  componentWillUnmount() {
    removeEndEventListener(this.name);
  }
  render() {
    if(this.props.open) {
      document.body.style.overflow = "hidden";
    } else {
      delete document.body.style.overflow;
    }
    return (
      <div
        className={'Modal' + (this.props.open ? ' open' : '' )}
        style={{
          transformOrigin: this.state.origin,
        }}
        onClick={(e) => this.props.handleClose(e)}
      >
        <div
          className="modal"
          onClick={(e) => e.stopPropagation()}
        >
          {this.props.header &&
            <div className="header">{this.props.header}</div>
          }
          <div className="content">{this.props.children}</div>
          {this.props.footer &&
            <div className="footer">{this.props.footer}</div>
          }
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  open: PropTypes.bool,
  bindTo: PropTypes.string.isRequired,
  header: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  footer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  handleClose: PropTypes.func.isRequired,
}

Modal.defaultProps = {
  open: false,
};
