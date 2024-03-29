//webpack.config.js
const path = require('path');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    main: "./src/main.ts",
    client: "./public/client.ts"
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist',
    filename: "[name]-sdk.js",
    library: 'MunchSDK',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devServer: {
    port: 3000,
    static: {
        directory: path.join(__dirname, 'public'),
        serveIndex: true,
    },
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