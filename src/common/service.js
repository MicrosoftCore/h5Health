import Axios from '@/plugins/axios'

export default {
  'cdcquestionjson.list': () => Axios.get('/api/cdcquestionjson/list')
}
