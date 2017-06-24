import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import fapp from 'firebase/app';
import registerServiceWorker from './registerServiceWorker';
import './sass/index.css';

const config = {
  apiKey: "AIzaSyCcCJOhAOAXQIUR17x2Uy_Gbo5W1kWHrWk",
  authDomain: "myxx-6b351.firebaseapp.com",
  databaseURL: "https://myxx-6b351.firebaseio.com",
  projectId: "myxx-6b351",
  storageBucket: "myxx-6b351.appspot.com",
  messagingSenderId: "587045094258"
};
fapp.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
