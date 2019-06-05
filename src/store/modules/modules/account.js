import service from '@/common/service'
import { account__snsapi_userinfo, account__userinfo } from '@/common/storageName'

export default {
  namespaced: true,
  state: {
    snsapi_userinfo: null,
    userinfo: null
  },
  mutations: {
    set_snsapi_userinfo (state, payload) {
      state.snsapi_userinfo = payload
      window.localStorage.setItem(account__snsapi_userinfo, JSON.stringify(payload))
    },
    set_user_info (state, payload) {
      state.userinfo = payload
      window.localStorage.setItem(account__userinfo, JSON.stringify(payload))
    },
    get_snsapi_userinfo (state) {
      const snsapi_userinfo = window.localStorage.getItem(account__snsapi_userinfo) || ''
      state.snsapi_userinfo = snsapi_userinfo ? JSON.parse(snsapi_userinfo) : {}
    },
    get_userinfo (state) {
      const userinfo = window.localStorage.getItem(account__userinfo) || ''
      state.userinfo = userinfo ? JSON.parse(userinfo) : {}
    }
  },
  actions: {
    async load ({ commit, state }, payload) {
      commit('get_snsapi_userinfo')
      commit('get_userinfo')

      if (state.userinfo && state.userinfo['openid']) return

      let snsapi_userinfo = await service['cdcHttpClient.getAccessToken'](payload)
      let user_info = await service['cdcHttpClient.getUserinfo']({
        params: {
          openid: snsapi_userinfo.openid,
          accessToken: snsapi_userinfo.access_token
        }
      })
      let cdc_wechat = await service['cdcwechat.add'](user_info)

      commit('set_snsapi_userinfo', snsapi_userinfo)
      commit('set_user_info', {
        idwechat: cdc_wechat.msg,
        ...user_info
      })
    }
  }
}
