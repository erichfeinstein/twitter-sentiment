import React from 'react';

//Components
import Chart from './Chart';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <h1 align="center">Twitter Sentiment</h1>
        <p align="center">
          This chart visualizes the sentiment of Tweets coming from the United
          States in real time
        </p>
        <Chart />
        <div style={{ height: 30 }} />
        <p align="center">Created by Eric Feinstein</p>
      </div>
    );
  }
}
