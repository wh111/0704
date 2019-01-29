let thisFile = 'appraising/sellOneself';
let api = {
  list: { // 列表
    path: thisFile + '/score/list',
    method: 'get'
  },
  submit: { // 自我评价页上报接口
    path: thisFile + '/score/submit',
    method: 'post'
  },
  myscoreList: { // 我的自荐评分列表
    path: thisFile + '/myscore/list',
    method: 'get'
  },
  approval: { // 审核评优自荐（审核评优自荐时调用）
    path: thisFile + 'modifyExamineStatus/approval/', // {id}
    method: 'put'
  },
};

export default api;
