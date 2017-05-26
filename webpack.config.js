const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const glob_entries = require('webpack-glob-entries');
const values = require('object.values');

let entryPaths = values(glob_entries('utils/scss/*.scss'));

entryPaths = entryPaths.concat(['babel-polyfill', './index.jsx']);

module.exports = {
    entry: entryPaths,
    devServer: {
        port: 8082,
        historyApiFallback: true,
    },
    output: {
        filename: 'bundle.js',
        publicPath: '',
    },
    module: {
        loaders: [
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoader: 1,
                                camelCase: true,
                                localIdentName: '[local]',
                            },
                        },
                        { loader: 'sass-loader' },
                    ],
                }),
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                include: __dirname,
            },
        ],
    },
    plugins: [new ExtractTextPlugin('bundle.css'), new Dotenv({ safe: true })],
    resolve: {
        alias: {
            lib: 'lib',
            utils: 'utils',
        },
        extensions: ['.js', '.jsx'],
        modules: [path.join(__dirname, './'), 'node_modules'],
    },
};
