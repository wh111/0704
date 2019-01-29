let api = {
  // 教学计划审核
  teachplanAudit: {
    path: '/teachActivityPlan/pageListManage', // 活动计划审核
    method: 'get',
  },
  getTeachPlanData: {  // 获取单个活动信息
    path: '/teachActivityPlan/get',
    method: 'get',
  },
  teachplanAudits: {
    path: '/teachActivityPlan/auditActivityPlan',
    method: 'put',
  },

}

export default api
