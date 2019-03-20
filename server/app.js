//Express setup
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

//Socket.io setup
const socketio = require('socket.io');

//Sentiment setup
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

//Twit setup
var Twit = require('twit');
const auth = require('./auth.json');
const T = new Twit(auth);

//Twit stream
const usa = [-122, 27, -61, 47];
var stream = T.stream('statuses/filter', {
  locations: usa,
});

//Receive tweets, analyze, emit on socket
stream.on('tweet', function(tweet) {
  //Handle short tweets vs longer tweets
  const text = tweet.extended_tweet
    ? tweet.extended_tweet.full_text
    : tweet.text;
  const score = sentiment.analyze(text).score;
  io.emit('tweet', score);
});

//Express logic
app.use(express.static('public'));
app.get('*', function(req, res) {
  res.sendfile(path.join(__dirname, '..', '/public/index.html'));
});
const server = app.listen(port, () =>
  console.log(`App listening on port ${port}!`)
);

//Socket logic
const io = socketio.listen(server);
