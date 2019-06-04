import service from '@/common/service'
import { answer__surveyjs_loadstate } from '@/common/storageName'
import { Model } from 'survey-vue'

export default {
  namespaced: true,
  state: {
    model: new Model()
  },
  mutations: {
    setModel (state, payload) {
      state.model = payload
    }
  },
  actions: {
    loadState ({ state }, { jsonIndex, pageIndex }) {
      // Here should be the code to load the data from your database
      let storageState = window.localStorage.getItem(answer__surveyjs_loadstate + jsonIndex) || ''

      let result = {}
      if (storageState) result = JSON.parse(storageState)
      // else
      // Create the survey state for the demo. This line should be deleted in the real app.

      // Set the loaded data into the survey.
      state.model.currentPageNo = pageIndex - 1
      if (result.data) state.model.data = result.data
    },
    saveState ({ state }, jsonIndex) {
      // Here should be the code to save the data into your database
      window.localStorage.setItem(
        answer__surveyjs_loadstate + jsonIndex,
        JSON.stringify({
          currentPageNo: state.model.currentPageNo,
          data: state.model.data
        })
      )
    },
    async saveServer ({ state, rootGetters }) {
      await service['cdcanswer.add']({
        idwechat: rootGetters['account/userinfo'].idwechat,
        jsonobj: JSON.stringify(state.model.data)
      })
    }
  }
}
