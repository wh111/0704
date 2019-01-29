const thisFile = '/signupRecruit/trialSxUser';
const api = {
  list: { // 列表数据
    path: thisFile + '/paymentSlipPagelist',
    method: 'get'
  },
  paymentSliplistByUsers: { // 单个或者批量用户打印缴费单
    path: thisFile + '/paymentSliplistByUsers',
    method: 'get'
  },
  paymentSliplistBySchool: { // 按学校打印学员缴费单
    path: thisFile + '/paymentSliplistBySchool',
    method: 'get'
  },
  paymentSliplistByMajor: { // 按专业打印学员缴费单
    path: thisFile + '/paymentSliplistByMajor',
    method: 'get'
  },
  paymentMergeByUserIds: { // 合并打印学员缴费详情
    path: thisFile + '/paymentMergeByUserIds',
    method: 'get'
  },
  paymentZslistByUsers: { // 单个或者批量用户打印住宿单
    path: thisFile + '/paymentZslistByUsers',
    method: 'get'
  },
  modifyPrint: { // 更新用户缴费单打印状态
    path: thisFile + '/modifyPrint/', // {userIds}
    method: 'put'
  },
  /************************* 收费标准 *********************************/
  getByKey: {
    path: '/rotaryConfig/getByKey/',
    method: 'get'
  },
};

export default api
