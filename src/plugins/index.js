import axios from 'axios'
import store from '@/store'
import router from '@/router'
import OAuth2 from './OAuth2'
import { appid } from '@/common/config'

export default {
  install (Vue) {
    Vue.prototype.$axios = axios

    store.dispatch('answer/load')
    store.dispatch('question/load')

    if (process.env.NODE_ENV === 'production') {
      Vue.use(OAuth2, {
        router,
        appid,
        responseType: 'code',
        scope: 'snsapi_userinfo',
        getCodeCallback (code, next) {
          store.dispatch('account/load', {
            params: {
              code
            }
          })

          try {
            next(store.state.account.snsapi_userinfo.access_token, { name: 'home' })
            console.log('access_token>>>>>>', store.state.account.snsapi_userinfo.access_token)
          } catch (error) {
            next({ name: 'home' })
          }
        }
      })
    } else {
      store.dispatch('account/load', {
        params: {
          code: '021VFuHa2itP5M0t3SKa2xjIHa2VFuHq'
        }
      })
    }
  }
}
