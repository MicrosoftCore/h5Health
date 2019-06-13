import * as storage from '@/common/storage'
import AlertModule from 'vux/src/plugins/alert/module'

export default {
  namespaced: true,
  actions: {
    reload ({ dispatch }) {
      dispatch('answer/load', null, {
        root: true
      })
      dispatch('question/load', null, {
        root: true
      })
    },
    reset ({ dispatch }) {
      const ignore = [ 'account__snsapi_userinfo', 'account__userinfo' ]

      Object.entries(storage).forEach(([ key, value ]) => {
        !ignore.includes(key) && window.localStorage.removeItem(value)
      })
      dispatch('reload')
    },
    clear ({ dispatch }) {
      window.localStorage.clear()
      dispatch('reload')
      AlertModule.show({
        title: '提示',
        content: '已成功清除全部缓存',
        hideOnBlur: true,
        onHide () {
          window.location.reload()
        }
      })
    }
  }
}
