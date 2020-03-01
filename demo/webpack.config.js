module.exports = {
  entry: './app.js',
  mode: 'development',
  output: {
    filename: 'build.js'
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
      {
        test: /\.css$/,
        use: {
          loader: "css-loader"
        }
      }
    ]
  },
  watch: true
}
