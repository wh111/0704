let thisFile = 'appraising/sellOneself';
let api = {
  list: { // 列表
    path: thisFile + '/list',
    method: 'get'
  },
  get: { // 获取
    path: thisFile + '/get/', // {id}
    method: 'get'
  },
  approval: { // 审核评优自荐（审核评优自荐时调用）
    path: thisFile + '/modifyExamineStatus/approval/', // {id}
    method: 'put'
  },
};

export default api;
