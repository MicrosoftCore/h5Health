module.exports = {
  configureWebpack: config => {
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
    proxy: {
      '/api': {
        target: 'http://10.71.88.52:8089',
        changeOrigin: true
      }
    }
  },
  publicPath: '/health'
}
