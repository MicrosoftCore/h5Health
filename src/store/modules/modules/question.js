import service from '@/common/service'

export default {
  namespaced: true,
  state: {
    question: []
  },
  actions: {
    async get ({ commit }) {
      commit('set', await service['cdcquestionjson.list']())
    }
  },
  mutations: {
    set (state, result) {
      state.question = result
    }
  }
}
