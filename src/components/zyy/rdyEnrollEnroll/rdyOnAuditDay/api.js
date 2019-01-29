let thisFile = '/compliance/train';
let api = {
  list: { // 列表
    path: thisFile + '/pageList',
    method: 'get'
  },
  preTrialModifyXCState: { // 现场审核
    path: thisFile + '/preTrialModifyXCState/',
    method: 'put'
  },
  get: { // 获取
    path: thisFile + '/get/', // {id}
    method: 'get'
  },
};

export default api;
