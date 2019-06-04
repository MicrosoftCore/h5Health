import service from '@/common/service'
import { question__surveyjs_idqtnaire, question__surveyjs_loadvisible } from '@/common/storageName'

export default {
  namespaced: true,
  state: {
    questions: []
  },
  getters: {
    idqtnaire () {
      return window.localStorage.getItem(question__surveyjs_idqtnaire)
    },
    visible () {
      let storageVisible = window.localStorage.getItem(question__surveyjs_loadvisible) || ''
      if (storageVisible) return JSON.parse(storageVisible)
    }
  },
  mutations: {
    set (state, payload) {
      state.questions = payload
    },
    setVisible (state, { jsonIndex, title }) {
      let visible = this.getters['question/visible']
      let jsonGroup = visible[jsonIndex]
      if (jsonGroup && title && !jsonGroup.includes(title)) {
        visible[jsonIndex].push(title)
      } else {
        visible[jsonIndex] = [ title && title ]
      }
      window.localStorage.setItem(question__surveyjs_loadvisible, JSON.stringify(visible))
    }
  },
  actions: {
    async get ({ commit }) {
      commit('set', await service['cdcquestionjson.list']())
    },
    async post ({ commit }, payload) {
      try {
        let result = await service['cdcqtnaire.add'](payload)
        window.localStorage.setItem(question__surveyjs_idqtnaire, result.msg)
      } catch (error) {}
    },
    async put ({ rootGetters }) {
      await service['cdcqtnaire.update']({
        idwechat: rootGetters['account/userinfo'].idwechat
      })
    }
  }
}
