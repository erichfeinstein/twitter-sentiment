import React from 'react';
import io from 'socket.io-client';

//Socket config
const IP = 'http://localhost:3000';
//   window.location.hostname === 'localhost'
//     ? 'http://localhost:3000'
//     : 'https://twit-viz.herokuapp.com';

export default class Chart extends React.Component {
  constructor() {
    super();
    this.state = {
      scores: {},
    };
    this.socket = io(IP);
  }
  componentDidMount() {
    this.socket.on('tweet', score => {
      let scores = this.state.scores;
      let oldScoreCount = scores[score];
      if (!oldScoreCount) oldScoreCount = 1;
      else oldScoreCount++;
      scores[score] = oldScoreCount;
      this.setState({
        scores,
      });
    });
  }

  render() {
    return (
      <div>
        {Object.keys(this.state.scores).map((score, i) => {
          return <div key={i}>{score}</div>;
        })}
      </div>
    );
  }
}
