import * as storageName from '@/common/storageName'

export default {
  namespaced: true,
  actions: {
    reset ({ commit }) {
      Object.entries(storageName).forEach(([ key, value ]) => {
        const ignore = [ 'account__snsapi_userinfo', 'account__userinfo' ]
        !ignore.includes(key) && window.localStorage.removeItem(value)
      })
      commit('question/loadVisible', null, {
        root: true
      })
    }
  }
}
