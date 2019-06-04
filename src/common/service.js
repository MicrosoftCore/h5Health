import Axios from '@/plugins/axios'

export default {
  'cdcquestionjson.list': () => Axios.get('/api/cdcquestionjson/list'), // 获取问卷 json
  'cdcqtnaire.update': payload => Axios.post('/api/cdcqtnaire/update', payload), // 答题完成
  'cdcqtnaire.add': payload => Axios.post('/api/cdcqtnaire/add', payload), // 开始答题
  'cdcqtnaire.queryinfo': payload => Axios.get('/api/cdcqtnaire/queryinfo', payload), // 查询详情
  'cdcanswer.add': payload => Axios.post('/api/cdcanswer/add', payload), // 保存用户答题信息
  'cdcthreshold.queryinfo': payload => Axios.get('/api/cdcthreshold/queryinfo', payload), // 保存用户答题信息
  'description.queryinfos': payload => Axios.get('/api/description/queryinfos', payload) // 保存用户答题信息
}
