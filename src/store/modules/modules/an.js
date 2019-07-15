import service from '@/common/service'
import { answer__progress, answer__validate, answer__surveyjs_loadstate } from '@/common/storage'
import { Model } from 'survey'

export default {
  namespaced: true,
  state: {
    model: new Model(),
    progress: {},
    validate: {}
  },
  mutations: {
    m3sm (state, payload) {
      state.model = payload
    },
    m3sp (state, payload) {
      let { jsonIndex, name, visible } = payload

      let data = state.model.data
      let questions = state.model.getPageByName(name).questions.filter(item => item.visible)
      let answered = questions.filter(question => data[question.name] || data[question.valueName])

      if (visible || visible === undefined) {
        state.progress[jsonIndex] = {
          ...state.progress[jsonIndex],
          [name]: Math.round(answered.length / questions.length * 10000) / 100 || 0
        }
      } else {
        delete state.progress[jsonIndex][name]
      }

      window.localStorage.setItem(answer__progress, JSON.stringify(state.progress))
    },
    m3gp (state) {
      let item = window.localStorage.getItem(answer__progress) || ''
      state.progress = (item && JSON.parse(item)) || {}
    },
    m3sv (state, payload) {
      let { jsonIndex, options } = payload
      state.validate[jsonIndex] = options

      window.localStorage.setItem(answer__validate, JSON.stringify(state.validate))
    },
    m3gv (state) {
      let item = window.localStorage.getItem(answer__validate) || ''
      state.validate = (item && JSON.parse(item)) || {}
    }
  },
  actions: {
    m3gs ({ state }, { jsonIndex, pageIndex }) {
      let item = window.localStorage.getItem(answer__surveyjs_loadstate) || ''
      let storage = (item && JSON.parse(item)[jsonIndex]) || {}

      if (storage.data) state.model.data = storage.data
      state.model.currentPageNo = pageIndex - 1
    },
    m3ss ({ state }, jsonIndex) {
      let item = window.localStorage.getItem(answer__surveyjs_loadstate) || ''
      let storage = (item && JSON.parse(item)) || {}

      storage[jsonIndex] = {
        currentPageNo: state.model.currentPageNo,
        data: state.model.data
      }

      window.localStorage.setItem(answer__surveyjs_loadstate, JSON.stringify(storage))
    },
    async m3ssr ({ rootState }) {
      let item = window.localStorage.getItem(answer__surveyjs_loadstate) || ''
      let storage = (item && JSON.parse(item)) || {}

      let jsonobj = Object.values(storage).reduce((iter, item) => Object.assign(iter, item.data), {})

      await service['cdcanswer.add']({
        idqtnaire: rootState.qu.idqtnaire,
        jsonobj: JSON.stringify(jsonobj)
      })
    },
    load ({ commit }) {
      commit('m3gp')
      commit('m3gv')
    }
  }
}
