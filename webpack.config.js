const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new Dotenv(),
    new CopyPlugin([
      {
        from: './src/assets/icons/favicon/apple-touch-icon.png',
        to: './assets/icons/favicon/apple-touch-icon.png',
      },
      {
        from: './src/assets/icons/favicon/favicon-32x32.png',
        to: './assets/icons/favicon/favicon-32x32.png',
      },
      {
        from: './src/assets/icons/favicon/favicon-16x16.png',
        to: './assets/icons/favicon/favicon-16x16.png',
      },
      {
        from: './src/assets/icons/favicon/site.webmanifest',
        to: './assets/icons/favicon/site.webmanifest',
      },
    ]),
  ],
};
