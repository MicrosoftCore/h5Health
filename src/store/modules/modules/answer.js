import service from '@/common/service'
import { answer__progress, answer__surveyjs_loadstate } from '@/common/storage'
import { Model } from 'survey'

export default {
  namespaced: true,
  state: {
    model: new Model(),
    progress: {}
  },
  mutations: {
    set_model (state, payload) {
      state.model = payload
    },
    set_progress (state, { jsonIndex, name }) {
      let questions = state.model.getPageByName(name).questions.filter(item => item.visible)

      let answered = questions.filter(question => state.model.data[question.name])

      state.progress[jsonIndex] = {
        ...state.progress[jsonIndex],
        [name]: Math.round(answered.length / questions.length * 10000) / 100 || 0
      }

      window.localStorage.setItem(answer__progress, JSON.stringify(state.progress))
    },
    get_progress (state) {
      let item = window.localStorage.getItem(answer__progress) || ''
      state.progress = (item && JSON.parse(item)) || {}
    }
  },
  actions: {
    get_state ({ state }, { jsonIndex, pageIndex }) {
      let item = window.localStorage.getItem(answer__surveyjs_loadstate) || ''
      let storage = (item && JSON.parse(item)[jsonIndex]) || {}

      state.model.currentPageNo = pageIndex - 1
      if (storage.data) state.model.data = storage.data
    },
    set_state ({ state }, jsonIndex) {
      let item = window.localStorage.getItem(answer__surveyjs_loadstate) || ''
      let storage = (item && JSON.parse(item)) || {}

      storage[jsonIndex] = {
        currentPageNo: state.model.currentPageNo,
        data: state.model.data
      }

      window.localStorage.setItem(answer__surveyjs_loadstate, JSON.stringify(storage))
    },
    async save_server ({ state, rootState }) {
      await service['cdcanswer.add']({
        idqtnaire: rootState.question.idqtnaire,
        jsonobj: JSON.stringify(state.model.data)
      })
    },
    load ({ commit }) {
      commit('get_progress')
    }
  }
}
