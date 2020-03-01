var path = require('path');

module.exports = {
  mode: 'production',
  entry: './PieChartInput.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'react-pie-chart-input.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
    ]
  },
  watch: true
}
