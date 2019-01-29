let thisFile = 'bedside/examination';
let api = {
  list: { // 列表
    path: thisFile + '/mark/list',
    method: 'get'
  },
  excelExport: { // 获取床边考核成绩导出到Excel
    path: '/api/' + thisFile + '/excelExport',
    method: 'get'
  }
};

export default api;
