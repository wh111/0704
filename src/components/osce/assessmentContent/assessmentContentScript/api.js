const thisFile = 'medical/case/script';
const api = {
  getByCase: { // 获取剧本列表（考站根据病例来获取）
    path: thisFile + '/list',
    method: 'get'
  },
  get: { // 获取剧本详情（查看剧本时，修改剧本加载时调用）
    path: thisFile + '/get',
    method: 'get'
  },
  add: { // 添加剧本（添加剧本提交时调用）
    path: thisFile + '/add',
    method: 'post'
  },
  modify: { // 修改剧本（修改剧本提交时调用）
    path: thisFile + '/modify',
    method: 'put'
  },
  save: { // 导入剧本-数据入库（导入剧本数据入库时调用）
    path: thisFile + '/excelImport/save',
    method: 'post'
  },
  wordExport: { // 导出剧本到word（导出剧本到word时调用）
    path: thisFile + '/wordExport',
    method: 'get'
  },
  delete: thisFile + '/remove', // 删除剧本（删除剧本时调用）
};

export default api
