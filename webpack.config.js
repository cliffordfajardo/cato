const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default
const cssNano = require('cssnano')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production'

const config = {
  entry: {
    popup: './app/pages/popup/popup.js',
    options: './app/pages/options/options.js'
  },
  output: {
    path: path.resolve(__dirname, './extension'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?name=[name].[ext]&outputPath=images/&publicPath=images/'
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    //Generate an HTML5 file that includes all webpack bundles(includes css & js) in the body using script tags
    new HtmlWebpackPlugin({
      title: 'Cato - App',
      template: './app/pages/popup/popup.html',
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      title: 'Cato - Options',
      template: './app/pages/options/options.html',
      filename: 'options.html',
      chunks: ['options']
    }),
    //Create our CSS bundles by our entry points names (Ex: popup.css, options.css)
    new ExtractTextPlugin({
      filename: '[name].css'
    }),
    new CopyWebpackPlugin([
      {from: 'app/images', to: 'images'},
      {from: 'app/manifest.json'}
    ]),
    new ImageminPlugin({test: /\.(jpe?g|png|gif|svg)$/i})
  ]
}

if(isProduction) {
  config.plugins.push(
    new UglifyJSPlugin({
      sourceMap: false,
      uglifyOptions: {
        mangle: true,
        compress: {
          dead_code: true,
          drop_console: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true
        }
      }
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/,
      cssProcessor: cssNano,
      cssProcessorOptions: {discardComments: {removeAll: true}}, canPrint: true
    })
  )
}

module.exports = config
