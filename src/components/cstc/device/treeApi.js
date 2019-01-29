const thisFile = 'device/type/dept';
const api = {
  tree: { // 获取部门结构（加载设备部门结构时调用）
    path: thisFile + '/tree',
    method: 'get'
  },
  add: { // 添加部门
    path: thisFile + '/add',
    method: 'post'
  },
  modify: { // 修改
    path: thisFile + '/modify/', // {id}
    method: 'put'
  },
  baseUrl: thisFile,
  delete: thisFile + '/remove', // 删除
};

export default api
