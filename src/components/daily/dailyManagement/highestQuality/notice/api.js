let thisFile = 'appraising/notice';
let api = {
  list: { // 列表
    path: thisFile + '/list',
    method: 'get'
  },
  add: { // 增加
    path: thisFile + '/publish',
    method: 'post'
  },
  excelExport: {
    path: 'appraising/sellOneself/excelExport?ids=',
    method: 'get'
  }
  // get: { // 获取
  //     path: thisFile + '/get/', // {id}
  //     method: 'get'
  // },
  // modify: { // 修改
  //     path: thisFile + '/modify/', // {id}
  //     method: 'put'
  // },
  // delete: thisFile + '/remove', // 删除
};

export default api;
