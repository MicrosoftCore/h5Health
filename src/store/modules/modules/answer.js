import service from '@/common/service'
import { answer__surveyjs_loadstate } from '@/common/storage'
import { Model } from 'survey'

export default {
  namespaced: true,
  state: {
    model: new Model()
  },
  mutations: {
    set_model (state, payload) {
      state.model = payload
    }
  },
  actions: {
    get_state ({ state }, { jsonIndex, pageIndex }) {
      let item = window.localStorage.getItem(answer__surveyjs_loadstate) || ''
      let model = (item && JSON.parse(item)[jsonIndex]) || {}

      state.model.currentPageNo = pageIndex - 1
      if (model.data) state.model.data = model.data
    },
    set_state ({ state }, jsonIndex) {
      let item = window.localStorage.getItem(answer__surveyjs_loadstate) || ''
      let model = (item && JSON.parse(item)) || {}

      model[jsonIndex] = {
        currentPageNo: state.model.currentPageNo,
        data: state.model.data
      }
      window.localStorage.setItem(answer__surveyjs_loadstate, JSON.stringify(model))
    },
    async save_server ({ state, rootState }) {
      await service['cdcanswer.add']({
        idqtnaire: rootState.question.idqtnaire,
        jsonobj: JSON.stringify(state.model.data)
      })
    }
  }
}
