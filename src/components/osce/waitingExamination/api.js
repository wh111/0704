const file = 'scene';
const api = {
  list: {//列表
    path: file + '/arrangement/waiting/list',
    method: 'get'
  },
  basic: {//获取考站考核状态
    path: file + '/get/default/basic',
    method: 'get'
  }
}
export default api;
