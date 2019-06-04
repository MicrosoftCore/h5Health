import service from '@/common/service'

export default {
  namespaced: true,
  state: {
    questions: [],
    visible: {}
  },
  getters: {
    idqtnaire () {
      return window.localStorage.getItem('SurveyJS_Idqtnaire')
    }
  },
  mutations: {
    set (state, payload) {
      state.questions = payload
    },
    setVisible (state, { jsonIndex, title }) {
      if (state.visible[jsonIndex]) {
        let jsonGroup = state.visible[jsonIndex]
        !jsonGroup.includes(title) && jsonGroup.push(title)
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
    },
    getVisible ({ commit, state }) {
      let storageVisible = window.localStorage.getItem('SurveyJS_LoadVisible') || ''
      if (storageVisible) state.visible = JSON.parse(storageVisible)
    }
  }
}
