import React from 'react';
import ReactDOM from 'react-dom';
import PieChartInput from '../dist/react-pie-chart-input'
import './main.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { percents: this.props.percents };

    this.pieCallback = this.pieCallback.bind(this);
  }

  pieCallback(percents) {
    this.setState({ percents: percents });
  }

  render() {
    return (
      <div>
        <PieChartInput
          percents={this.props.percents}
          colors={['red', 'blue', 'yellow']}
          callback={this.pieCallback}
        />
        {this.state.percents.map(x => (x * 100).toFixed(0) + "%").join(" | ")}
      </div>
    )
  }
}

ReactDOM.render(
  <App percents={[.5, .3, .2]} />,
  document.getElementById('root')
);
