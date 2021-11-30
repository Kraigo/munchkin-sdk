//webpack.config.js
const path = require('path');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    main: "./src/main.ts",
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "[name]-sdk.js",
    library: 'MunchSDK',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  }
};