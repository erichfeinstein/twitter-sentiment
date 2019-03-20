import React from 'react';

//Components
import Chart from './Chart';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Twitter Sentiment</h1>
        <Chart />
      </div>
    );
  }
}
