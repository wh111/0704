const thisFile = 'medical/case';
const api = {
  list: { // 获取评分表列表（加载评分表列表）
    path: thisFile + '/list',
    method: 'get'
  },
  modify: { // 修改评分表（修改评分表提交时调用）
    path: thisFile + '/modify',
    method: 'put'
  },
  add: { // 添加评分表（新建评分表，复制评分表提交时调用）
    path: thisFile + '/add',
    method: 'post'
  },
  get: { // 获取评分表详情（查看评分表，修改评分表,复制评分表，调用）
    path: thisFile + '/get',
    method: 'get'
  },
  modifyTree: { // 修改评分表所在节点（移动评分表）
    path: thisFile + '/modifyTree',
    method: 'put'
  },
  wordExport: { // 导出评分表到word文档（导出到word调用）
    path: thisFile + '/wordExport',
    method: 'get'
  },
  excelExport: { // 导出评分表到excel（导出到excel调用）
    path: thisFile + '/excelExport',
    method: 'get'
  },
  save: { // 导入病例-数据入库
    path: thisFile + '/excelImport/save',
    method: 'post'
  },
  scriptSave: { // 导入剧本-数据入库
    path: thisFile + '/script/excelImport/save',
    method: 'post'
  },
  scriptWordExport: { // 导入剧本-数据入库
    path: thisFile + '/script/wordExport',
    method: 'get'
  },
  delete: thisFile + '/remove', // 删除一条或多条评分表（删除评分表调用）
};

export default api
