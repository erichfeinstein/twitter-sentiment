//Open a socket room when a client chooses a city
//When a socket room opens, open a Twit stream from that city
//Process the tweets and emit them to the socket room
const vader = require('vader-sentiment');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
var Twit = require('twit');

const auth = require('./auth.json');
const T = new Twit(auth);

const newYork = [-74.01, 40.704, -73.936, 40.817];
var stream = T.stream('statuses/filter', { locations: newYork });

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
  //   const intensity1 = vader.SentimentIntensityAnalyzer.polarity_scores(text);
  const score = sentiment.analyze(text).score;
  if (score < -4) sentimentsMap.veryNeg++;
  if (score > 4) sentimentsMap.veryPos++;
  if (score < 0 && score >= -4) sentimentsMap.neg++;
  if (score > 0 && score <= 4) sentimentsMap.pos++;
  else sentimentsMap.neutral++;
  //   console.log(intensity1);
  //   console.log(intensity2.);
});

setInterval(() => {
  console.log(sentimentsMap);
}, 1000);
