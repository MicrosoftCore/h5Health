module.exports = {
  configureWebpack: config => {
    config.externals = {
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
        target: 'http://10.71.88.194:8089',
        changeOrigin: true
      }
    }
  },
  publicPath: '/health'
}
