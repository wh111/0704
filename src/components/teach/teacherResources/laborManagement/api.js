let thisFile = 'fee';
let api = {
  list: { // 列表
    path: thisFile + '/query',
    method: 'get'
  },
  add: { // 增加
    path: thisFile + '/add',
    method: 'post'
  },
  get: { // 获取
    path: thisFile + '/get/', // {id}
    method: 'get'
  },
  modify: { // 修改
    path: thisFile + '/modify/', // {id}
    method: 'put'
  },
  pay: thisFile + '/pay', // 支付
  delete: thisFile + '/remove', // 删除
};

export default api;
