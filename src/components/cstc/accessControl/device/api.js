const thisFile = 'access/door';
const api = {
  list: { // 列表数据
    path: thisFile + '/list',
    method: 'get'
  },
  selectList: { // 获取门禁设备选择列表
    path: thisFile + '/select/list',
    method: 'get'
  },
  modify: { // 修改门禁设备（修改门禁设备提交时调用）
    path: thisFile + '/modify/', // {id}
    method: 'put'
  },
  get: { // 获取门禁设备详情（修改门禁设备加载时调用）
    path: thisFile + '/get/', // {id}
    method: 'get'
  },
  add: { // 添加门禁设备（添加门禁设备提交时调用）
    path: thisFile + '/add',
    method: 'post'
  },
  roomList: { // 获取选择房间列表
    path: 'room/select/list',
    method: 'get'
  },
  delete: thisFile + '/remove', // 删除一条或多条门禁设备数据（删除门禁设备时调用）
};

export default api
