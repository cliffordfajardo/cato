const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WriteFilePlugin = require('write-file-webpack-plugin');
const webpack = require('webpack');

//our npm script defines the env.
const isProduction = process.env.NODE_ENV === "production";

const cssDevelopment = ['style-loader', 'css-loader', 'sass-loader'];
const cssProduction = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: ['css-loader', 'sass-loader']
});

var cssConfig = isProduction ? cssProduction : cssDevelopment;
// console.log('cssConfig -->', cssConfig)


var config = {
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
      //allows us to import our css. But, we need style loader so the css created in our js bundle is added to a <style> tag in our html doc
        test: /\.scss$/,
        use: cssConfig
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
          test: /^(?!.*(hot)).*/,
        }),

        //This plugin will generate an HTML5 file for you that includes all your webpack bundles in the body using script tags
        new HtmlWebpackPlugin({
          title: 'My App',
          template: './app/popup.html',
          filename: 'popup.html'
          // minify: { collapseWhitespace:true},
          // hash: true
        }),

        /*Create bundle.css & output it to the `dist` folder.
         File destination is determined by the output property above
         NOTE: the bundle.css will only be outputted if we run production mode.
         */
        new ExtractTextPlugin({
          filename: 'bundle.css',
          disable: !isProduction
        }),
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

let backgroundScriptsConfig = Object.assign({}, {
  name: 'background-script',
  entry: './app/background-script.js',
  output: {
    path: path.resolve(__dirname, './chrome-extension/'),
    filename: 'app.background-script.js',
  },
  module: config.module,
  plugins: config.plugins
});

module.exports = [
  backgroundScriptsConfig
]
