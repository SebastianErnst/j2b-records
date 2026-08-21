const path = require('path'),
    webpack = require('webpack');

module.exports = {
    mode: 'development',
    watch: true,
    recordsPath: path.resolve(__dirname, './records.json'),
    entry: {
        main: './src/scripts/main.js'
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js',
        libraryTarget: 'umd',
        publicPath: '/project/frontend/build/'
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                common: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'common',
                    chunks: 'all',
                    enforce: true
                },
                vendors: {
                    name: 'vendor',
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    performance: {},
    resolve: {
        symlinks: false,
        modules: [
            path.resolve('./node_modules/'),
        ],
    }
};