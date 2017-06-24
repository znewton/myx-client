import React, { Component } from 'react';
import './sass/App.css';

import Navbar from './Navbar/Navbar';
import Sidebar from './Sidebar/Sidebar';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Sidebar />
        {/* <Player /> */}
        {/* <Queue /> */}
      </div>
    );
  }
}

export default App;
