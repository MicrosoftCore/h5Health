import service from '@/common/service'
import { Model } from 'survey-vue'

export default {
  namespaced: true,
  state: {
    model: new Model(),
    storageName: 'SurveyJS_LoadState'
  },
  actions: {
    loadState ({ state }) {
      //Here should be the code to load the data from your database
      let storageState = window.localStorage.getItem(state.storageName) || ''

      let result = {}
      if (storageState) result = JSON.parse(storageState)
      else
        //Create the survey state for the demo. This line should be deleted in the real app.
        result = {
          currentPageNo: 0
        }

      //Set the loaded data into the survey.
      if (result.currentPageNo) state.model.currentPageNo = result.currentPageNo
      if (result.data) state.model.data = result.data
    },
    saveState ({ state }) {
      //Here should be the code to save the data into your database
      window.localStorage.setItem(
        state.storageName,
        JSON.stringify({
          currentPageNo: state.model.currentPageNo,
          data: state.model.data
        })
      )
    },
    async saveServer ({ state }) {
      await service['cdcanswer.add']({
        idwechat: 1,
        jsonobj: JSON.stringify(state.model.data)
      })
    },
    async updateServer ({ commit }) {
      await service['cdcqtnaire.update']({
        idwechat: 1
      })
    }
  },
  mutations: {
    setModel (state, payload) {
      state.model = payload
    }
  }
}
