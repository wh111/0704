let thisFile = '/compliance/train';
let api = {
  list: { // 列表
    path: thisFile + '/entranceExam/pageList',
    method: 'get'
  },
  preTrialModifyXZsksState: { // 招生考生
    path: thisFile + '/preTrialModifyXZsksState/',
    method: 'put'
  },
  get: { // 获取
    path: thisFile + '/get/', // {id}
    method: 'get'
  },
};

export default api;
