const thisFile = '/tree';
const api = {
  baseUrl: {
    path: thisFile,
  },
  get: { // 获取节点详情（修改树节点加载时调用）
    path: thisFile + '/get',
    method: 'get'
  },
  add: { // 添加节点（新建节点时调用）
    path: thisFile + '/add',
    method: 'post'
  },
  structure: { // 获取树结构（加载技能考核内容树结构时调用）
    path: thisFile + '/structure',
    method: 'get'
  },
  modify: { // 修改节点（修改节点提交是调用）
    path: thisFile + '/modify',
    method: 'put'
  },
  delete: thisFile + '/remove', // 删除节点（删除节点时调用）
};

export default api
