const thisFile = 'access/door/user/card';
const api = {
  list: { // 列表数据
    path: thisFile + '/list',
    method: 'get'
  },
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
  readCard: { // 读卡
    path: 'access/door/readCard',
    method: 'get'
  },
};

export default api
