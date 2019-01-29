let thisFile = '/compliance/train';
let api = {
  list: { // 列表
    path: thisFile + '/pageList',
    method: 'get'
  },
  preTrialModifyState: { // 网上预审
    path: thisFile + '/preTrialModifyState/',
    method: 'put'
  },
  get: { // 获取
    path: thisFile + '/get/', // {id}
    method: 'get'
  },
  exportToWord: { // 获取
    path: '/api' + thisFile + '/exportToWord', // {ids}
    method: 'get'
  },
};

export default api;
