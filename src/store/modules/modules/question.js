import service from '@/common/service'
import {
  question__show_assess,
  question__show_assess_dot,
  question__surveyjs_idqtnaire,
  question__surveyjs_idqtnaireFinished,
  question__surveyjs_loadvisible
} from '@/common/storage'

export default {
  namespaced: true,
  state: {
    idqtnaire: null,
    idqtnaireFinished: [],
    questions: [],
    showAssess: false,
    showAssessDot: false,
    visible: {}
  },
  mutations: {
    set (state, payload) {
      state.questions = payload
    },
    set_assess (state, payload = true) {
      state.showAssess = payload
      window.localStorage.setItem(question__show_assess, payload)
    },
    get_assess (state) {
      let showAssess = false
      let storage = window.localStorage.getItem(question__show_assess)
      if (storage === 'true') showAssess = true
      if (storage === 'false') showAssess = false
      state.showAssess = showAssess
    },
    set_assess_dot (state, payload = true) {
      state.showAssessDot = payload
      window.localStorage.setItem(question__show_assess_dot, payload)
    },
    get_assess_dot (state) {
      let showAssessDot = false
      let storage = window.localStorage.getItem(question__show_assess_dot)
      if (storage === 'true') showAssessDot = true
      if (storage === 'false') showAssessDot = false
      state.showAssessDot = showAssessDot
    },
    set_idqtnaire (state, payload) {
      state.idqtnaire = payload
      window.localStorage.setItem(question__surveyjs_idqtnaire, payload)
    },
    get_idqtnaire (state) {
      state.idqtnaire = window.localStorage.getItem(question__surveyjs_idqtnaire)
    },
    set_idqtnaire_finished (state, payload) {
      state.idqtnaireFinished.push(payload)
      window.localStorage.setItem(question__surveyjs_idqtnaireFinished, JSON.stringify(state.idqtnaireFinished))
    },
    get_idqtnaire_finished (state) {
      let idqtnaireFinished = window.localStorage.getItem(question__surveyjs_idqtnaireFinished) || ''
      state.idqtnaireFinished = idqtnaireFinished ? JSON.parse(idqtnaireFinished) : []
    },
    set_visible (state, { jsonIndex, title, type = '', visible = true }) {
      let jsonGroup = state.visible[jsonIndex]
      if (jsonGroup && title && !jsonGroup.includes(title)) {
        state.visible[jsonIndex].push(title)
      } else {
        !jsonGroup && (state.visible[jsonIndex] = [ title && title ])
      }
      if (type === 'onPageVisibleChanged') {
        if (visible) {
          title && state.visible[jsonIndex].push(title)
        } else {
          let lists = state.visible[jsonIndex]
          state.visible[jsonIndex] = lists.filter(item => item && item !== title)
        }
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
    async put ({ commit, dispatch, state }, payload) {
      await dispatch('answer/save_server', null, {
        root: true
      })
      await service['cdcqtnaire.update']({
        idqtnaire: state.idqtnaire
      })
      commit('set_idqtnaire_finished', state.idqtnaire)
      commit('set_assess')
      commit('set_assess_dot')
      payload.push({
        name: 'assess'
      })
    },
    load ({ commit }) {
      commit('get_assess')
      commit('get_assess_dot')
      commit('get_idqtnaire')
      commit('get_idqtnaire_finished')
      commit('get_visible')
    }
  }
}
