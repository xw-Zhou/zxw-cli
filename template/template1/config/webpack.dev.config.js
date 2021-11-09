
// 开发环境配置
module.exports ={
    mode:'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        port: 8080,
        open: true,
        compress: true,
    },
}