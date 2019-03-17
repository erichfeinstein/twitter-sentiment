//Open a socket room when a client chooses a city
//When a socket room opens, open a Twit stream from that city
//Process the tweets and emit them to the socket room

//Express setup
const express = require('express');
const app = express();
const port = 3000;

//Sentiment setup
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

//Twit setup
var Twit = require('twit');
const auth = require('./auth.json');
const T = new Twit(auth);

const newYork = [-74.01, 40.704, -73.936, 40.817];
var stream = T.stream('statuses/filter', { locations: newYork });

//Move to client side
let sentimentsMap = {
  veryNeg: 0,
  neg: 0,
  neutral: 0,
  pos: 0,
  veryPos: 0,
};

stream.on('tweet', function(tweet) {
  //Handle short tweets vs longer tweets
  const text = tweet.extended_tweet
    ? tweet.extended_tweet.full_text
    : tweet.text;
  console.log('-----------Tweet received. Analyzing...-----------');
  console.log(text);
  console.log('-----------Result-----------');
  const score = sentiment.analyze(text).score;
  if (score < -4) sentimentsMap.veryNeg++;
  if (score > 4) sentimentsMap.veryPos++;
  if (score < 0 && score >= -4) sentimentsMap.neg++;
  if (score > 0 && score <= 4) sentimentsMap.pos++;
  else sentimentsMap.neutral++;
});

setInterval(() => {
  console.log(sentimentsMap);
}, 1000);

app.get('/', (req, res) => {
  res.json(sentimentsMap);
});
app.listen(port, () => console.log(`App listening on port ${port}!`));
