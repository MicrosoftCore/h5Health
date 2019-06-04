import service from '@/common/service'
import { account__snsapi_userinfo, account__userinfo } from '@/common/storageName'

export default {
  namespaced: true,
  getters: {
    snsapi_userinfo () {
      return JSON.parse(window.localStorage.getItem(account__snsapi_userinfo) || '')
    },
    userinfo () {
      return JSON.parse(window.localStorage.getItem(account__userinfo) || '')
    }
  },
  mutations: {
    set_snsapi_userinfo (state, payload) {
      window.localStorage.setItem(account__snsapi_userinfo, JSON.stringify(payload))
    },
    set_user_info (state, payload) {
      window.localStorage.setItem(account__userinfo, JSON.stringify(payload))
    }
  },
  actions: {
    async get ({ commit, getters }, payload) {
      if (getters.userinfo['headimgurl']) return
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
        idwechat: cdc_wechat.code,
        ...user_info
      })
    }
  }
}
