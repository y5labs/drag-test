const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  entry: ['./index.js'],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      { test: /\.vue$/, loader: 'vue-loader' },
      {
        test: /\.styl$/,
        use: [ 'style-loader', 'css-loader', 'stylus-loader' ]
      }
    ]
  },
  plugins: [
    new HtmlPlugin({ template: './index.html', chunksSortMode: 'dependency' }),
    new VueLoaderPlugin()
  ]
}
