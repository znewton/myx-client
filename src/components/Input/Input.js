import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Input.scss';

export default class Input extends Component {
  handleChange(e) {
    const target = e.target;
    const value = this.props.type === 'checkbox' ? target.checked : target.value;
    this.props.onChange(value);
  }
  render() {
    return (
      <div className="Input">
        <div className="form-label">
          {this.props.label}
        </div>
        <div className="form-input">
          <input
            type={this.props.type}
            id={this.props.name+'-input'}
            name={this.props.name}
            onChange={this.handleChange.bind(this)}
            value={this.props.value}
            checked={this.props.value}
            placeholder={this.props.placeholder}
          />
          <label htmlFor={this.props.name+'-input'} className="input-helper" />
        </div>
      </div>
    );
  }
}

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
  placeholder: PropTypes.string,
  label: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
  name: Math.floor(Math.random()*100)+'input',
  onChange: ((val) => null),
  value: null,
  label: 'Input',
  placeholder: null,
}
