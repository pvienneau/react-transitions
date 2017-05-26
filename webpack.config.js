const path = require('path');

module.exports = {
    entry: ['./index.jsx', 'babel-polyfill'],
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
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                include: __dirname,
            },
        ],
    },
    resolve: {
        alias: {
            lib: 'lib',
            utils: 'utils',
        },
        extensions: ['.js', '.jsx'],
        modules: [path.join(__dirname, './'), 'node_modules'],
    },
};
