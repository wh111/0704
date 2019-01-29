let thisFile = '/compliance/train';
let api = {
  list: { // 列表
    path: thisFile + '/entranceAdmission/pageList',
    method: 'get'
  },
  get: { // 获取
    path: thisFile + '/get/', // {id}
    method: 'get'
  },
  whetherAdmission: { // 录取操作
    path: thisFile + '/whetherAdmission/', // {ids}
    method: 'put'
  },
  exportToWord: thisFile + '/exportToWord/', // 导出到Excel
  importFromExcelValidate: thisFile + '/importFromExcel', // 导入Excel
};

export default api;
