let thisFile = '/inStudy/payCost';
let api = {
  list: { // 进修生缴费管理列表
    path: thisFile + '/pageList',
    method: 'get'
  },
  add: { // 增加
    path: thisFile + '/addPaymentRegistration-',
    method: 'post'
  },
  get: {
    path: thisFile + '/getPaymentRegistration-',
    method: 'get'
  },
  exportExcel: { // 获取
    path: thisFile + '/exportExcel?', // {id}
    method: 'get'
  },
  modify: { // 修改
    path: thisFile + '/modify/', // {id}
    method: 'put'
  },
  getPaySingle:{
    path: thisFile + '/getPaySingle-', // {id}
    method: 'get'
  },
  getPayZs:{ //打印住宿费
    path:thisFile + '/getPayZs-',
    method:'get'
  },
  payConfirm:{ // 确认缴费
    path: thisFile + '/payConfirm',
    method: 'post'
  },
  inStudyBack:{ // 进修回退
    path: thisFile + '/inStudyBack',//subjectsIds
    method: 'post'
  },
  delete: thisFile + '/remove', // 删除
};

export default api;
