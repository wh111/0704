let thisFile = 'inStudy/endStudy';
let api = {
  list: { // 结束进修列表
    path: thisFile + '/pageList',
    method: 'get'
  },
  add: { // 管理员发起结束进修
    path: thisFile + '/add',
    method: 'post'
  },
  userAdd: { // 进修生填写自我鉴定
    path: thisFile + '/userAddReport',
    method: 'post',
  },
  get: { // 查看结束进修申请
    path: thisFile + '/getReport-', // {id}
    method: 'get'
  },
  modify: { // 进修生修改自我鉴定
    path: thisFile + '/userEditReport-', // {id}
    method: 'put'
  },
  delete: thisFile + '/remove', // 删除
};

export default api;
