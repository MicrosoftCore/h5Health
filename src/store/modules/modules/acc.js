import service from '@/common/service'
import { account__snsapi_userinfo, account__userinfo } from '@/common/storage'
import { EmojiRegExp } from '@/utils/regexp'

export default {
  namespaced: true,
  state: {
    snsapi_userinfo: null,
    userinfo: null
  },
  mutations: {
    m1ssu (state, payload) {
      state.snsapi_userinfo = payload
      window.localStorage.setItem(account__snsapi_userinfo, JSON.stringify(payload))
    },
    m1sui (state, payload) {
      state.userinfo = payload
      window.localStorage.setItem(account__userinfo, JSON.stringify(payload))
    },
    m1gsu (state) {
      const snsapi_userinfo = window.localStorage.getItem(account__snsapi_userinfo) || ''
      state.snsapi_userinfo = snsapi_userinfo ? JSON.parse(snsapi_userinfo) : {}
    },
    m1gu (state) {
      const userinfo = window.localStorage.getItem(account__userinfo) || ''
      state.userinfo = userinfo ? JSON.parse(userinfo) : {}
    }
  },
  actions: {
    async load ({ commit, state }, payload) {
      commit('m1gsu')
      commit('m1gu')

      if ((state.userinfo && state.userinfo['openid']) || !payload) return

      window.localStorage.clear()

      let snsapi_userinfo = await service['cdcHttpClient.getAccessToken'](payload)
      let user_info = await service['cdcHttpClient.getUserinfo']({
        params: {
          openid: snsapi_userinfo.openid,
          accessToken: snsapi_userinfo.access_token
        }
      })
      let cdc_wechat = await service['cdcwechat.add']({
        ...user_info,
        nickname: user_info.nickname ? user_info.nickname.replace(EmojiRegExp, '').trim() : ''
      })

      commit('m1ssu', snsapi_userinfo)
      commit('m1sui', {
        idwechat: cdc_wechat.msg,
        ...user_info
      })
    }
  }
}
