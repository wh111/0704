let thisFile = 'fund/accounting';
let api = {
  statisticalList: { // 经费统计列表
    path: thisFile + '/statistical/list',
    method: 'get'
  },
  ststExcelExport: { // 经费统计导出
    path: thisFile + '/statistical/excelExport',
    method: 'get'
  },
  analysisList: { // 经费分析查询
    path: thisFile + '/analysis/list',
    method: 'get'
  },
  fundStatisticsAnalysisList: { // 经费分析查询
    path: thisFile+'/fundStatistics/list',
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
  getRecordType:{  // 记录类型
    path: thisFile + '/getRecordType',
    method: 'get'
  }
};

export default api;
