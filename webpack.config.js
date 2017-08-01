const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WriteFilePlugin = require('write-file-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const webpack = require('webpack');


const config = {
  entry: {
    content: './app/content.js',
    popup: './app/pages/popup/popup.js',
    options: './app/pages/options/options.js'
  },
  output: {
    path: path.resolve(__dirname, './chrome-extension/'),
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
      //allows us to import our css. But, we need style loader so the css created in our js bundle is added to a <style> tag in our html doc
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
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
    new webpack.NamedModulesPlugin(),
    //enable hot module
    new webpack.HotModuleReplacementPlugin(),

    /*
    webpack-dev-server serves content, watches for changes & serves the changes
    from memory without writing changes to the file system. Usually, you'd need to
    run webpack --watch and run webpack-dev-server on a seperate tab,but this
    plugin solves that problem.
    */
    new WriteFilePlugin({
      //dont include hot files.
      test: /^(?!.*(hot)).*/
    }),

    //This plugin will generate an HTML5 file for you that includes all your webpack bundles in the body using script tags
    new HtmlWebpackPlugin({
      title: 'My App',
      template: './app/pages/popup/popup.html',
      filename: 'popup.html',
      excludeAssets: [/content.js/, /options.js/, /background.css/, /options.css/]
    }),
    new HtmlWebpackPlugin({
      title: 'My App - Options',
      template: './app/pages/options/options.html',
      filename: 'options.html',
      excludeAssets: [/content.js/, /background.css/]
    }),
    new HtmlWebpackExcludeAssetsPlugin(),

    /*Create bundle.css & output it to the `dist` folder.
     File destination is determined by the output property above
     */
    new ExtractTextPlugin({
      filename: '[name].css'
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    hot: true,
    stats: 'errors-only',
    open: true
  }
};


module.exports = config;
