const _config = require('./webpack.config.base')
const webpack = require('webpack')
const cleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path')
const config = Object.assign({
    mode: 'production'
}, _config)

const plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new cleanWebpackPlugin([path.resolve(__dirname, '../dist/')], {
        root: path.resolve(__dirname, '../')
    })
]

config.plugins.push(...plugins)

module.exports = config