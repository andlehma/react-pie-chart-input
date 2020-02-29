import React from 'react';
import ReactDOM from 'react-dom';
import PieChartInput from './components/PieChartInput';
import './main.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      percents: this.props.percents
    }

    this.callbackFunction = this.callbackFunction.bind(this);
  }

  callbackFunction(percents) {
    this.setState({ percents: percents });
  }

  render() {
    return (
      <div id="app-container">
        <PieChartInput
          callback={this.callbackFunction}
          percents={this.props.percents}
          colors={['red', 'blue', 'yellow']} />
        {this.state.percents.map(x => (x * 100).toFixed(0) + "%").join(" | ")}
      </div>
    )
  }
}

ReactDOM.render(
  <App percents={[.5, .3, .2]} />,
  document.getElementById('root')
);
