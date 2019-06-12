import Axios from '@/plugins/axios'

export default {
  'cdcHttpClient.getAccessToken': payload => Axios.get('/api/cdcHttpClient/getAccessToken', payload), // code 获取 access_token
  'cdcHttpClient.getUserinfo': payload => Axios.get('/api/cdcHttpClient/getUserinfo', payload), // token openid 换取 用户信息
  'cdcwechat.add': payload => Axios.post('/api/cdcwechat/add', payload), // 获取 idwechat
  'cdcquestionjson.list': () => Axios.get('/api/cdcquestionjson/list'), // 获取问卷 json
  'cdcqtnaire.update': payload => Axios.post('/api/cdcqtnaire/update', payload), // 答题完成
  'cdcqtnaire.add': payload => Axios.post('/api/cdcqtnaire/add', payload), // 开始答题
  'cdcqtnaire.queryinfo': payload => Axios.get('/api/cdcqtnaire/queryinfo', payload), // 查询详情
  'cdcqtnaire.queryRecords': payload => Axios.get('/api/cdcqtnaire/queryRecords', payload), // 查询答题记录
  'cdcanswer.add': payload => Axios.post('/api/cdcanswer/add', payload), // 保存用户答题信息
  'cdcthreshold.queryinfo': payload => Axios.get('/api/cdcthreshold/queryinfo', payload), // 查询个人风险值
  'description.queryinfos': payload => Axios.get('/api/description/queryinfos', payload), // 查询风险描述
  'cdcsubmission.add': payload => Axios.post('/api/cdcsubmission/add', payload), // 提交个人信息
  'cdcsubmission.update': payload => Axios.post('/api/cdcsubmission/update', payload), // 修改个人信息
  'cdcsubmission.queryinfo': payload => Axios.get('/api/cdcsubmission/queryinfo', payload), // 查询个人信息
  'cdcqtnaireversion.queryLetter': payload => Axios.post('/api/cdcqtnaireversion/queryLetter', payload) // 查询知情通知书
}
