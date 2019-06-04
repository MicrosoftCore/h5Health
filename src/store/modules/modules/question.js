import service from '@/common/service'

export default {
  namespaced: true,
  state: {
    questions: []
  },
  getters: {
    idqtnaire () {
      return window.localStorage.getItem('SurveyJS_Idqtnaire')
    },
    visible () {
      let storageVisible = window.localStorage.getItem('SurveyJS_LoadVisible') || ''
      if (storageVisible) return JSON.parse(storageVisible)
    }
  },
  mutations: {
    set (state, payload) {
      state.questions = payload
    },
    setVisible (state, { jsonIndex, title }) {
      let jsonGroup = state.visible[jsonIndex]
      if (jsonGroup && title && !jsonGroup.includes(title)) {
        state.visible[jsonIndex].push(title)
      } else {
        state.visible[jsonIndex] = [ title && title ]
      }
      window.localStorage.setItem('SurveyJS_LoadVisible', JSON.stringify(state.visible))
    }
  },
  actions: {
    async get ({ commit }) {
      commit('set', await service['cdcquestionjson.list']())
    },
    async post ({ commit }, payload) {
      try {
        let result = await service['cdcqtnaire.add'](payload)
        window.localStorage.setItem('SurveyJS_Idqtnaire', result.msg)
      } catch (error) {}
    },
    async put ({ commit }, payload) {
      await service['cdcqtnaire.update'](payload)
    }
  }
}
