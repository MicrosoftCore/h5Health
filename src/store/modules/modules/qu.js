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
    m4sa (state, payload = true) {
      state.showAssess = payload
      window.localStorage.setItem(question__show_assess, payload)
    },
    m4ga (state) {
      let showAssess = false
      let storage = window.localStorage.getItem(question__show_assess)
      if (storage === 'true') showAssess = true
      if (storage === 'false') showAssess = false
      state.showAssess = showAssess
    },
    m4sad (state, payload = true) {
      state.showAssessDot = payload
      window.localStorage.setItem(question__show_assess_dot, payload)
    },
    m4gad (state) {
      let showAssessDot = false
      let storage = window.localStorage.getItem(question__show_assess_dot)
      if (storage === 'true') showAssessDot = true
      if (storage === 'false') showAssessDot = false
      state.showAssessDot = showAssessDot
    },
    m4si (state, payload) {
      state.idqtnaire = payload
      window.localStorage.setItem(question__surveyjs_idqtnaire, payload)
    },
    m4gi (state) {
      state.idqtnaire = window.localStorage.getItem(question__surveyjs_idqtnaire)
    },
    m4sif (state, payload) {
      state.idqtnaireFinished.push(payload)
      window.localStorage.setItem(question__surveyjs_idqtnaireFinished, JSON.stringify(state.idqtnaireFinished))
    },
    m4gif (state) {
      let idqtnaireFinished = window.localStorage.getItem(question__surveyjs_idqtnaireFinished) || ''
      state.idqtnaireFinished = idqtnaireFinished ? JSON.parse(idqtnaireFinished) : []
    },
    m4sv (state, { jsonIndex, title, type = '', visible = true }) {
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
    m4gv (state) {
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
      commit('m4si', msg)
    },
    async put ({ commit, dispatch, state }, payload) {
      await dispatch('an/m3ssr', null, {
        root: true
      })
      await service['cdcqtnaire.update']({
        idqtnaire: state.idqtnaire
      })
      commit('m4sif', state.idqtnaire)
      commit('m4sa')
      commit('m4sad')
      payload.push({
        name: 'assess'
      })
    },
    load ({ commit }) {
      commit('m4ga')
      commit('m4gad')
      commit('m4gi')
      commit('m4gif')
      commit('m4gv')
    }
  }
}
