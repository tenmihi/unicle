const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, "./src/handler.ts"),
  externals: ['aws-sdk'],
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: [
      '.ts',
      '.js',
      '.tsx',
      '.jsx',
    ]
  }
}