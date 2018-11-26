const webpack = require('webpack')
const merge = require("webpack-merge")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseWebpackConfig = require("./webpack.base.config")
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const path = require("path")

const distPath = path.resolve(__dirname, '../dist')
module.exports = merge(baseWebpackConfig,{
    // webpack 打包输出的配置
    output:{
        path: distPath,
        // js文件提取路径 path.posix 跨平台兼容路径
        // filename: path.posix.join('static','[name]/[name].[chunkhash].js'),
        filename: '[name].[chunkhash].js',
        // 公共文件提取路径
        chunkFilename: path.posix.join('static','[name].[chunkhash].js')
    },
    // webpack打包时的插件配置
    plugins:[
        // 清理dist目录
        new CleanWebpackPlugin([distPath],{root: path.resolve(__dirname, '../')}),
        // css提取成单独的文件
        new MiniCssExtractPlugin({
            // filename: path.posix.join('static','[name]/[name].css')
            filename: '[name].[contenthash].css',
            chunkFilename: path.posix.join('static','[name].[contenthash].css')
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        // 混淆压缩js
        // new UglifyJSPlugin(),
    ]
})
