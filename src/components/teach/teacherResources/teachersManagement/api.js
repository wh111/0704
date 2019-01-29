let thisFile = 'archives';
let api = {
  list: { // 列表
    path: thisFile + '/query/teach',
    method: 'get'
  },
  add: { // 增加
    path: thisFile + '/add/teach/',
    method: 'post'
  },
  get: { // 列表
    path: thisFile + '/get/teach/', // {archivesId}
    method: 'get'
  },
  modify: { // 修改
    path: thisFile + '/modify/teach/', // {archivesId}
    method: 'post'
  },
  audit: { // 修改
    path: thisFile + '/audit/teach/', // {archivesId}
    method: 'post'
  },
  getUserInfo: { // 获取用户基本信息
    path: thisFile + '/get/basic/',
    method: 'get'
  },
  delete: thisFile + '/remove/teach', // 删除
  revoke: thisFile + '/rescind/teach', //撤销

};

export default api;
