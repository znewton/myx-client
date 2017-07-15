import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import './About.css';

import Logo from '../../components/Logo/Logo'

export default class About extends Component {
  render () {
    return (
      <div className="About">
        <p>
          My name is Zach Newton, and <Logo /> is a personal project of mine.
        </p>
        <h2>Why Make It?</h2>
        <p>
          When I open up Chrome to listen to music,
          I either go to <a href="https://app.napster.com/">Napster</a>, or I go
          to <a href="https://www.youtube.com/">Youtube</a>.
          When I choose the latter, I almost always navigate to one of my favorite music
          curator channels (<a href="https://www.youtube.com/user/koalakontrol">Koala Kontrol</a>
          , <a href="https://www.youtube.com/user/TheMistifyMusic">Mistify</a>
          , <a href="https://www.youtube.com/user/MrSuicideSheep">MrSuicideSheep</a>
          , <a href="https://www.youtube.com/user/WaveOfGoodNoise">Wave of Good Noise</a>, etc.).
          This worked for a while, but then I wanted to listen to both Koala
          Kontrol and Mistify at the same time!
        </p>
        <p>
          My goal when creating <Logo /> was to enable anyone (including myself) to
          listen to any number of channels videos in succession without the hastle
          of creating a one time playlist on YouTube that requires constant updating.
          Even though this was started for primarily personal use, I set it up to be
          usable by anyone and everyone because I have some friends that wanted a
          similar product.
        </p>
        <p>
          No, I did not make this app to generate revenue. If you have a go to market
          idea for <Logo /> though, please email me
          at <a href="mailTo:znewton13@gmail.com">znewton13@gmail.com</a> with suggestions.
        </p>
        <h2>Technologies Used</h2>
        <p>
          You can <a href="https://github.com/znewton">see the code on my GitHub</a>.
          There are 2 repositories
          , <a href="https://github.com/znewton/myxx-client">one for the front end</a> and <a href="https://github.com/znewton/myxx-api">one for the backend</a>.
        </p>
        <h3>Front End</h3>
        <p>
          The front end is built
          with <a href="https://facebook.github.io/react/">ReactJS</a> and <a href="http://sass-lang.com/">Sass</a> using <a href="https://webpack.js.org/">Webpack</a> to
          compile it. It is worth mentioning that the app was bootstrapped
          with <a href="https://github.com/facebookincubator/create-react-app">create-react-app</a>.
          Other libraries used are <a href="https://www.npmjs.com/package/axios">axios</a> for http
          requests, <a href="https://www.npmjs.com/package/query-string">query-string</a> for parameter encoding
          , <a href="https://www.npmjs.com/package/css-element-queries">css-element-queries</a> for resizing the youtube player,
          and <a href="https://www.npmjs.com/package/youtube-iframe">youtube-iframe</a> for abstracting the YouTube player api.
        </p>
        <p>
          All of the styling is either custom or from my previous (incomplete)
          project <a href="https://github.com/znewton/social-app">Social</a>.
          I like SCSS. I'm weird like that.
        </p>
        <h3>Back End</h3>
        <p>
          Documentation for the <Logo /> api endpoints can be found at <a href="https://myxx.herokuapp.com/">myxx.herokuapp.com/</a>.
        </p>
        <p>
          The back end is 2 parts: <a href="https://firebase.google.com/">Firebase</a> and <a href="https://nodejs.org/en/">NodeJS</a>.
        </p>
        <p>
          The Firebase part handles user authentication and information storage.
          That's about it. It's Firebase after all. It just works.
        </p>
        <p>
          The NodeJS part is a lot more interesting. At the time of writing this,
          it is actually just an abstraction of
          the <a href="https://developers.google.com/youtube/v3/getting-started">YouTube API</a> that
          serves my needs for <Logo />. It is hosted
          on <a href="https://www.heroku.com/home">Heroku</a> with <a href="http://expressjs.com/">ExpressJS</a> being
          the main library used. Other libraries used
          are <a href="https://www.npmjs.com/package/body-parser">body-parser</a> and <a href="https://www.npmjs.com/package/query-string">query-string</a>.
        </p>
        <h2>Feedback</h2>
        <p>
          As with any application, I'm sure there are bugs to be squashed and
          improvements to be made! Please feel free to reach out to me via email
          at <a href="mailTo:znewton13@gmail.com">znewton13@gmail.com</a> with
          any questions, comments, concerns, and/or suggestions! Happy mixing!
        </p>
      </div>
    );
  }
}

About.propTypes = {}

About.defaultProps = {}
