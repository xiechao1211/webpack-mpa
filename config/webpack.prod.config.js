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
    cache: true,
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
        new UglifyJSPlugin(),
    ],
    optimization: {
        minimize: true,
        splitChunks: {
            // 最大初始化请求数 如果不手动设置会导致production模式下打包不正常
            maxInitialRequests: Infinity,
            // vendor-公共第三方组件 common-项目内的的公共js styles-公共的样式
            cacheGroups: {
                // 从node_modules提取公用包
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "initial",
                    name: "vendor",
                    minChunks: 1,
                },
                styles: {
                    test: /[\\/]src[\\/]styles[\\/]/,
                    chunks: "initial",
                    name: "styles",
                    // 最小文件大小
                    minSize: 0,
                    // 最小引用数量，必须大于1
                    minChunks: 1,
                },
                common: {
                    test: /[\\/]src[\\/]common[\\/].*\.js/,
                    chunks: "initial",
                    name: "common",
                    minSize: 0,
                    minChunks: 1,
                }
            }
        }
    },

})
