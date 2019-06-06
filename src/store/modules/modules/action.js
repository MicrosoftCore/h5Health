import * as storage from '@/common/storage'

export default {
  namespaced: true,
  actions: {
    reset ({ commit }) {
      Object.entries(storage).forEach(([ key, value ]) => {
        const ignore = [ 'account__snsapi_userinfo', 'account__userinfo' ]
        !ignore.includes(key) && window.localStorage.removeItem(value)
      })
      commit('answer/get_progress', null, {
        root: true
      })
      commit('question/get_assess', null, {
        root: true
      })
      commit('question/get_visible', null, {
        root: true
      })
    }
  }
}
