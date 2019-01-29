const thisFile = 'consumables/storage';
const api = {
  get: { // 获取
    path: thisFile + '/get',
    method: 'get'
  },
  modify: { // 修改
    path: thisFile + '/modify',
    method: 'put'
  },
  add: { // 添加
    path: thisFile + '/add',
    method: 'post'
  },
  delete: thisFile + '/remove', // 删除一条或多条耗材类型
};

export default api
