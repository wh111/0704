let thisFile = 'fund/accounting';
let api = {
  totalList: { // 总账列表
    path: thisFile + '/generalLedger/list',
    method: 'get'
  },
  totalExcelExport: { // 总账列表导出
    path: thisFile + '/generalLedger/excelExport',
    method: 'get'
  },
  partList: { // 分账列表
    path: thisFile + '/detail/list',
    method: 'get'
  },
  partExcelExport: { // 分账列表导出
    path: thisFile + '/detail/excelExport',
    method: 'get'
  },
  getAccountingType:{ // 报销类型
    path: thisFile + '/getAccountingType',
    method: 'get'
  },
  getFundSource:{ // 经费来源
    path: thisFile + '/getFundSource',
    method: 'get'
  },
};

export default api;
