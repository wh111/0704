let thisFile = 'fund';
let api = {
  list: { // 列表
    path: thisFile + '/list',
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
  select: thisFile + '/select/list', // 删除
  delete: thisFile + '/remove', // 删除
};

export default api;
