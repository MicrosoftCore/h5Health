import service from '@/common/service'
import { answer__view_report, question__surveyjs_idqtnaire, question__surveyjs_loadvisible } from '@/common/storage'

export default {
  namespaced: true,
  state: {
    idqtnaire: null,
    questions: [],
    viewreport: false,
    visible: {}
  },
  mutations: {
    set (state, payload) {
      state.questions = payload
    },
    set_assess (state) {
      state.viewreport = true
      window.localStorage.setItem(answer__view_report, true)
    },
    get_assess (state) {
      state.viewreport = window.localStorage.getItem(answer__view_report) || false
    },
    set_idqtnaire (state, payload) {
      state.idqtnaire = payload
      window.localStorage.setItem(question__surveyjs_idqtnaire, payload)
    },
    get_idqtnaire (state) {
      state.idqtnaire = window.localStorage.getItem(question__surveyjs_idqtnaire)
    },
    set_visible (state, { jsonIndex, title }) {
      let jsonGroup = state.visible[jsonIndex]
      if (jsonGroup && title && !jsonGroup.includes(title)) {
        state.visible[jsonIndex].push(title)
      } else {
        !jsonGroup && (state.visible[jsonIndex] = [ title && title ])
      }
      window.localStorage.setItem(question__surveyjs_loadvisible, JSON.stringify(state.visible))
    },
    get_visible (state) {
      let visible = window.localStorage.getItem(question__surveyjs_loadvisible) || ''
      state.visible = visible ? JSON.parse(visible) : {}
    }
  },
  actions: {
    async get ({ commit }) {
      commit('set', await service['cdcquestionjson.list']())
    },
    async post ({ commit }, payload) {
      let { msg } = await service['cdcqtnaire.add'](payload)
      commit('set_idqtnaire', msg)
    },
    async put ({ commit, rootState }) {
      await service['cdcqtnaire.update']({
        idqtnaire: rootState.question.idqtnaire
      })
      commit('set_assess')
    },
    load ({ commit }) {
      commit('get_assess')
      commit('get_idqtnaire')
      commit('get_visible')
    }
  }
}
