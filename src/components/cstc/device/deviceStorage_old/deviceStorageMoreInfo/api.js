const thisFile = 'device';
const api = {
  // list: { // 列表数据
  //   path: thisFile + '/list',
  //   method: 'get'
  // },
  get: { // 获取
    path: thisFile + '/get/',
    method: 'get'
  },
  modify: { // 修改
    path: thisFile + '/modify/',
    method: 'put'
  },
  add: { // 增加
    path: thisFile + '/add',
    method: 'post'
  },
  delete: thisFile + '/remove', // 删除设备信息  
};

export default api
