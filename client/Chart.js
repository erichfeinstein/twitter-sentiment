import React from 'react';
import io from 'socket.io-client';
import { PieChart } from 'react-d3-components';

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
      //Ignore true neutral tweets
      if (score === 0) return;

      let scorePhrase = calculatePhrase(score);
      let scores = this.state.scores;
      let oldScoreCount = scores[scorePhrase];
      if (!oldScoreCount) oldScoreCount = 1;
      else oldScoreCount++;

      scores[scorePhrase] = oldScoreCount;
      this.setState({
        scores,
      });
    });
  }

  render() {
    const data = {
      label: 'Chart',
      values: Object.entries(this.state.scores).map(score => {
        return { x: score[0], y: score[1] };
      }),
    };
    return (
      <div>
        <PieChart
          data={data}
          width={1000}
          height={700}
          margin={{ top: 10, bottom: 10, left: 100, right: 100 }}
        />
      </div>
    );
  }
}

function calculatePhrase(score) {
  //Negatives
  if (score <= -10) return 'Overwhelmingly Negative';
  else if (score < -5 && score >= -10) return 'Mostly Negative';
  else if (score < 0 && score >= -5) return 'Negative';
  //Positives
  else if (score > 0 && score <= 5) return 'Positive';
  else if (score > 5 && score <= 10) return 'Mostly Positive';
  else if (score >= 10) return 'Overwhelmingly Positive';
  else return score;
}
