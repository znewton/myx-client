import React from 'react';
import './GoogleButton.css';
import logo from '../../../assets/Google_-G-_Logo.svg.png';

const GoogleButton = (props) => (
  <button className="GoogleButton" onClick={props.onClick}>
    <span className="logo"><img src={logo} title="google" alt="G" /></span> <span>
      Sign {props.type} with Google
    </span>
  </button>
);

export default GoogleButton;
