
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

You can find out more about how to use Create React App  [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

# Myx (client)
This is the repository for the front-end of the *myx* app.

Information on the backend can be found in its [repository](https://github.com/znewton/myx-api).

## Purpose
I made this app because I enjoy listening to music curators on [YouTube](https://youtube.com);
however, sometimes I want to listen to three or more of those curator's songs in a random playlist.
Sadly, YouTube doesn't provide this type of feature, and I am too lazy to maintain playlists.

Thus, the idea for *myx* was born! With *myx*, I can listen to songs from my choice of playlists
from however many curators I want in a random order.

## Contributing
Feel free to create issues for anything from bugs to new features you would like to see implemented.
If you see an issue you want to help with, pull requests are welcome! You can email me at
[znewton@iastate.edu](mailTo:znewton@iastate.edu) with `Myx` in the subject line if you have any comments, questions, or concerns.

For pull requests, please follow the guidelines that are detailed in [CONTRIBUTING.md](https://github.com/znewton/myxx-client/blob/master/docs/CONTRIBUTING.md).

## Locally Running Myx
1. Clone the repo
```shell
git clone git@github.com:znewton/myxx-client.git
cd myxx-client
```
2. Install dependencies.
```shell
npm install
```
> Note: Make sure you have [Node](https://nodejs.org/en/) installed (I used v7.1+).
3. Run *myx* hosted at [localhost:8000](localhost:8000). This will hot reload when changes are made.
```shell
npm start
```
> Note: When hot reloading sass, no errors will be thrown if you create a new sass file and it won't compile. It will just stop reading that file. If your styles seem to not be showing up, close and rerun the dev server by hitting Ctrl+C and then the above command. The errors will now appear.
