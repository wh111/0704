let thisFile = 'organize/retest';
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
    path: thisFile + '/get/', // {id}
    method: 'get'
  },
  edit: { // 修改
    path: thisFile + '/modify/', // {id}
    method: 'put'
  },
  down: { // 资源下载
    path: '/api/file/download/', // { fileId }
    method: 'get'
  },
  listPage: { // 批次列表
    path: '/retest/batch/list',
    method: 'get'
  },
  personList: 'enroll/person/list', // 人员列表
  majorList: 'dictionary/getByCode/YJS_ZYDM', // 研究生专业代码
  // getByDepth: '/hospital/dept/getByDepth', // 根据深度获取科室(2)
  getByDepth: '/hospital/dept/getByDepthManager', // 根据深度获取科室(2)
  excelExport: thisFile + '/excelExport', // 导出
  delete: thisFile + '/removes', // 删除
};

export default api;
