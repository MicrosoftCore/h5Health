module.exports = {
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  },
  configureWebpack: config => {
    config.externals = {
      vue: 'Vue',
      survey: 'Survey',
      echarts: 'echarts'
    }
    require('vux-loader').merge(config, {
      plugins: [
        'vux-ui',
        {
          name: 'less-theme',
          path: 'src/assets/style/less/variable.less'
        }
      ]
    })
  },
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api': {
        // target: 'http://10.70.180.51:8089', // 本地环境
        target: 'http://popu.chgc.sh.cn:8089', // 生产环境
        changeOrigin: true
      }
    }
  },
  // productionSourceMap: false,
  publicPath: '/health'
}
