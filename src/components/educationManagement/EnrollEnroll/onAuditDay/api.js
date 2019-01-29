let thisFile = '/inStudy/confirmation';//进修确定
let api = {
  list: { // 列表
    path: thisFile + '/pageList',
    method: 'get'
  },
  exportExcel: { // 导出表格
    path: thisFile + '/exportExcel?', // {id}
    method: 'get'
  },
  modify: { // 进修确定
    path: thisFile + '/modify-', // {id}
    method: 'put'
  }
};

export default api;
