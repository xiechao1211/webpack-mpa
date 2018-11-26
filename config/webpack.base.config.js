const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require("path")
const glob = require('glob')
// 通过 html-webpack-plugin 生成的 HTML 集合
let htmlPlugins = [];
function resolve(dir) {
    return path.join(__dirname, "..", dir);
}
// 获取入口文件
function getEntry(globPath) {
    let entries = {}
    let basename = ''
    glob.sync(globPath).forEach((entry) => {
        basename = path.basename(entry, path.extname(entry))
        let dir = path.dirname(entry)
        let moduleName = dir.split('views/')[1] || ''
        basename = basename === 'index' ? 'index' : `${moduleName}/${basename}`
        entries[basename] = entry
    });
    return entries;
}
let entries = getEntry('./src/views/**/*.js')
Object.keys(entries).forEach(entry => {
    let dir = path.dirname(entries[entry])
    let baseName = path.basename(entries[entry], path.extname(entries[entry]))
    let moduleName = dir.split('views/')[1] || ''
    let htmlPath = path.join(dir, `/${entry}.html`)
    let htmlConf = {
        // filename: entry === 'index'? `index.html` : `${moduleName}/${entry}.html`,
        // template: path.resolve(__dirname,'..',path.join(dir,`/${entry}.html`)),
        filename: entry + '.html',
        template: path.resolve(__dirname, '..', path.join(dir, `/${baseName}.html`)),
        chunks: [entry, 'vendor', 'common','styles'],
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
    }
    htmlPlugins.push(new HtmlWebpackPlugin(htmlConf))
})

let webpackConfig = {
    context: path.resolve(__dirname, "../"),
    // webpack入口
    entry: entries,
    // webpack输出
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "[name].[hash].js",
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'libs': resolve('src/libs'),
            'components': resolve('src/components'),
            'assets': resolve('src/assets'),
            'less': resolve('src/less'),
            '@': resolve('src')
        }
    },
    module: {
        // 配置webpack各种loader
        rules: [
            {
                test: /\.html/,
                use: {
                    loader: 'html-loader'
                }
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: [resolve("src")]
            },
            {
                test: /\.less$/,
                use: [
                    // "style-loader",
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader", options: { sourceMap: true, importLoaders: 1 } },
                    "postcss-loader",
                    "less-loader"
                ]
            },
            {
                test: /\.css$/,
                use: [
                    // "style-loader",
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader", options: { sourceMap: true, importLoaders: 1 } },
                    "postcss-loader"
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: path.posix.join('static', 'img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: path.posix.join('static', 'fonts/[name].[hash:7].[ext]')
                }
            }

        ]
    },
    optimization: {
        minimize: false,
        splitChunks: {
            cacheGroups: {
                // 从node_modules提取公用包
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                },
                common: {
                    test: /[\\/]src[\\/]\/(.*)\.js/,
                    chunks: "initial",
                    name: "common",
                    priority: 10,
                    enforce: true
                },
                styles: {
                    name: 'styles',
                    test: /\.(less|css)$/,
                    chunks: 'all',
                    minChunks: 1,
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        ...htmlPlugins
    ],


}
// webpackConfig.plugins = webpackConfig.plugins.concat(htmlPlugins)
module.exports = webpackConfig
