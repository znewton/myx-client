import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import './Help.css';

export default class Help extends Component {
  render () {
    return (
      <div className="Help">
        <p>
          Sorry if the UI/UX is a little confusing at the moment. I'm a software engineer by trade, and while I enjoy web design, I'm aiming for funcionality first with this project. After the app is fully functional I'll return to the UI/UX for further polish.
          In the mean time, hopefully this window can give you help with navigating the site.
        </p>
        <p>
          Any questions, comments, concerns, or suggestions are very welcome and can be addressed to <a href="mailTo:znewton13@gmail.com">znewton13@gmail.com</a>. Please prefix the email subject with 'MYXX: ' to help me see it in my inbox.
        </p>
        <h2>Creating a Mix</h2>
        <p>
          The first step is creating a mix of YouTube playlists.
        </p>
        <ol>
          <li>Click `Create Mix` in the top right of the nav bar</li>
          <li>Search for a channel (ie. Koala Kontrol)</li>
          <li>Click the dropdown to the right of a channel to show playlists</li>
          <li>Add a playlist using the <span className="material-icons">add</span> icon to the right of its name</li>
          <li>Repeat until you have at least 2 playlists in the mix</li>
          <li>Name the playlist (the default is randomly generated)</li>
          <li>You're good to go! Hit `Create`!</li>
        </ol>
        <h2>Using a mix</h2>
        <p>
          After creating a mix, it will appear in the left sidebar. You can also search through your mixes if you end up creating a lot of them.
        </p>
        <ol>
          <li>Select a Mix from the left sidebar by clicking it</li>
          <li>The mix will autoplay from here so you can skip the rest if you want</li>
          <li>Pausing, playing, scrubbing, etc. is all the same as a YouTube video</li>
          <li>To go to the next song, click the first song in the left of the Queue at the bottom of the screen</li>
          <li>That's all there is to it! Happy mixing!</li>
        </ol>
      </div>
    );
  }
}

Help.propTypes = {}

Help.defaultProps = {}
