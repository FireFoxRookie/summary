// 自定义配置项
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    configureWebpack: {
        plugins: [
            new BundleAnalyzerPlugin()
        ]
    }
};
