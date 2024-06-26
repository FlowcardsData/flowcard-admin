const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
  publicPath: '/admin/',
  outputDir: '../Service_admin/public/admin',
  // 跳过检查host
  devServer: {
    host: 'localhost',
    disableHostCheck: true
  },
  productionSourceMap: false,
  transpileDependencies: ['element-ui', 'ele-admin', 'vue-i18n'],
  chainWebpack: (config) => {
    config.plugins.delete('prefetch');
    if (process.env.NODE_ENV !== 'development') {
      // 对超过10kb的文件gzip压缩
      config.plugin('compressionPlugin').use(new CompressionWebpackPlugin({
        test: /\.(js|css|html)$/,
        threshold: 10240
      }));
    }
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          outputStyle: 'expanded'
        }
      }
    }
  }
}
