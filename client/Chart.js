import React from 'react';
import io from 'socket.io-client';
import { scaleOrdinal } from 'd3-scale';

//Components
import { PieChart } from 'react-d3-components';

//D3 color scale
const domain = [
  'Overwhelmingly Negative',
  'Mostly Negative',
  'Negative',
  'Positive',
  'Mostly Positive',
  'Overwhelmingly Positive',
];
const colorScale = scaleOrdinal()
  .domain(domain)
  .range(['#ff0000', '#ff9933', '#ffff00', '#66ff66', '#33ccff', '#3366ff']);

console.log(colorScale);

//Socket config
const IP =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://twit-viz.herokuapp.com';

export default class Chart extends React.Component {
  constructor() {
    super();
    this.state = {
      scores: {},
      width: 0,
      height: 0,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.socket = io(IP);
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

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

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render() {
    const data = {
      label: 'Chart',
      values: Object.entries(this.state.scores).map(score => {
        return { x: score[0], y: score[1] };
      }),
    };
    return (
      <div align="center">
        <PieChart
          colorScale={colorScale}
          data={data}
          width={this.state.width * 0.8}
          height={this.state.height * 0.8}
          hideLabels={this.state.width < 1000}
          margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
        />
        <div id="color-key">
          {domain.map((score, i) => {
            return (
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: 10,
                }}
                key={i}
              >
                <h3>
                  {this.state.scores[score] || 0}: {score}
                </h3>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: colorScale(score),
                  }}
                />
              </span>
            );
          })}
        </div>
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
