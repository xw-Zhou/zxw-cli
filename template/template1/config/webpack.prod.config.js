const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const WebpackBar = require('webpackbar');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; 

// 生产环境配置
module.exports ={
    mode:'production',
    // devtool: 'eval-cheap-module-source-map',
    plugins:[
        new MiniCssExtractPlugin({ // 拆分css文件
            filename:'static/css/[name].[contenthash:6].css'
        }), 
        new CssMinimizerPlugin(), // 压缩css文件
        new WebpackBar(),
        // new BundleAnalyzerPlugin(), // 依赖分析
    ]
}