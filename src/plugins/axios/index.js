import axios from 'axios'

axios.interceptors.response.use(response => {
  let { data, status } = response
  if (status === 200) {
    return data
  }
})

export default {
  install (Vue) {
    Vue.prototype.$axios = axios
  }
}
