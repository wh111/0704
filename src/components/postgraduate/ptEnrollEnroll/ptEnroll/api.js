let thisFile = 'enroll/person';
let api = {
  list: { // 列表
    path: thisFile + '/list',
    method: 'get'
  },
  add: { // 增加
    path: thisFile + '/add',
    method: 'post'
  },
  get: { // 获取
    path: thisFile + '/get', // {id}
    method: 'get'
  },
  modify: { // 修改
    path: thisFile + '/modify/', // {id}
    method: 'post'
  },
  excelExport: '/api/' + thisFile + '/excelExport', // 导出人员
  majorList: 'dictionary/getByCode/YJS_ZYDM', // 研究生专业代码
  getByDepth: '/hospital/dept/getByDepth', // 根据深度获取科室(2)
  delete: thisFile + '/removes', // 删除
};

export default api;
