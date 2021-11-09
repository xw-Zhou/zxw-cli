const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ProdConfig = require('./config/webpack.prod.config')
const DevConfig = require('./config/webpack.dev.config')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; 



const NODE_ENV = process.env.NODE_ENV;
const isProd = NODE_ENV === "production";

module.exports = merge({
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash:8].js',
        clean: true, //每次构建清除dist包
    },
    resolve: {
        extensions: [".js", ".jsx", ".less", ".css"], //省略文件后缀
        alias: { //配置别名
            "@": path.resolve(__dirname, "./src"),
        },
    },
    cache: {
        type: 'filesystem',
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                    priority: 10,
                    minChunks: 2,
                    // enforce: true
                }
            }
        },
        minimizer: [
            new TerserWebpackPlugin({
                extractComments: false
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.js|\.jsx/,
                use: ['babel-loader?cacheDirectory'],
                exclude: /node_modules/,
            },
            {
                test: /\.(css|less)$/,
                use: [
                    isProd ? MiniCssExtractPlugin.loader : "style-loader",
                    "css-loader",
                    "less-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: ["autoprefixer"], // 添加兼容前缀
                            },
                        },
                    }
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/source", //生成单独的文件
                generator: {
                    filename: "static/img/[name].[contenthash:6].[ext]",
                },
                // parser: {
                //     dataUrlCondition: {
                //       maxSize: 4 * 1024 // 4kb
                //     }
                // }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                type: "asset/source", //生成单独的文件
                generator: {
                    filename: "static/fonts/[name].[contenthash:6].[ext]",
                }
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html'),
            filename: 'index.html',
            minify: {
                removeAttributeQuotes: true,//删除双引号
                removeComments: true,//删除注释
                collapseWhitespace: true//压缩代码
            }
        }),
        // new BundleAnalyzerPlugin(),
    ]
}, isProd ? ProdConfig : DevConfig)