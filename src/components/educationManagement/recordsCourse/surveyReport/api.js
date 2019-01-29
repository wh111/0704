let thisFile = 'inStudy/endStudy';
let api = {
  list: { // 列表
    path: thisFile + '/list',
    method: 'get'
  },
  add: { // 管理员发起结束进修
    path: thisFile + '/add',
    method: 'post'
  },
  get: { // 获取
    path: thisFile + '/getReport-', // {userId}
    method: 'get'
  },
  userAddReport:{ // 进修生填写自我鉴定
    path: thisFile + '/userAddReport-', // {reportId}
    method: 'post'
  },
  userEditReport: { // 管理员填写意见
    path: thisFile + '/userEditReport-', // {reportId}
    method: 'put'
  },
  userRotaryStatic: { // 查看进修生轮转详情
    path: thisFile + '/userRotaryStatic-', // {userId}
    method: 'get'
  },
  delete: thisFile + '/remove', // 删除
};

export default api;
