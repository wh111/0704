const thisFile = '/signupRecruit/trialSxUser';
const api = {
  list: { // 列表数据
    path: thisFile + '/payCostPagelist',
    method: 'get'
  },
  payCostExportExcel: { // 缴费登记导出excel
    path: thisFile + '/paymentSliplistByUsers',
    method: 'get'
  },
  payConfirm: { // 缴费确认
    path: thisFile + '/payConfirm',
    method: 'put'
  },
  paymentSliplistByUsers: { // 单个或者批量用户打印缴费单
    path: thisFile + '/paymentSliplistByUsers',
    method: 'get'
  }
};

export default api
