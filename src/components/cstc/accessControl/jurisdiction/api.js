const thisFile = 'access/door/jurisdiction';
const api = {
  list: { // 列表数据
    path: thisFile + '/list',
    method: 'get'
  },
  modify: { // 修改权限信息（修改权限提交时调用）
    path: thisFile + '/modify/', // {id}
    method: 'put'
  },
  get: { // 获取权限详情（查看权限信息时调用、加载修改权限时调用）
    path: thisFile + '/get/', // {id}
    method: 'get'
  },
  add: { // 添加权限信息（授权提交时调用）
    path: thisFile + '/add',
    method: 'post'
  },
  addList: { // 批量添加权限信息（授权提交时调用）
    path: thisFile + '/addList',
    method: 'post'
  },
  depList: { // 部门列表
    path: '/dept/tree',
    method: 'get'
  },
  doorList: { // 获取门禁设备选择列表
    path: 'access/door/select/list',
    method: 'get'
  },
  userList: { // 获取人员对应卡号选择列表
    path: 'access/door/user/card/select/list',
    method: 'get'
  },
  delete: thisFile + '/remove', // 删除权限（删除权限时调用）
};

export default api
