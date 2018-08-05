const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  devtool: "source-map",
  module: {
    rules: [
        {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/
        },
        {
            test: /\.scss$/,
            use: [
                'style-loader', 
                'css-loader', 
                'sass-loader'
            ]
        },
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    devtoolModuleFilenameTemplate (info) {
        const rel = path.relative(__dirname, info.absoluteResourcePath);
        return `webpack:///${rel}`;
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: "./index.ejs"
    })
  ]
};