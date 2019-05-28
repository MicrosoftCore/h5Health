import axios from 'axios'
import qs from 'qs'

axios.defaults.transformRequest = [ data => qs.stringify(data) ]

axios.interceptors.response.use(({ data, status }) => {
  if (status === 200) {
    return data
  }
})

export default axios
