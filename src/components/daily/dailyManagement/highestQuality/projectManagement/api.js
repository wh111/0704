let thisFile = 'appraising/project';
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
  edit: { // 修改
    path: thisFile + '/modify/', // {id}
    method: 'put'
  },
  selectList: { // 选择评优项目列表（选择评优项目列表加载时调用 【评优投票项目添加，修改】）
    path: thisFile + '/select/list', // {id}
    method: 'get'
  },
  sellOneselfList: {
    path: thisFile + '/sellOneself/list', // {id}
    method: 'get'
  },
  relusList: { // 角色
    path: 'role/list', // {id}
    method: 'get'
  },
  delete: thisFile + '/remove', // 删除
};

export default api;
