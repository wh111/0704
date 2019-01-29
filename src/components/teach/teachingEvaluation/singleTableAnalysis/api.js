const thisFile = '/activity/query';
const api = {
  list: { // 分页查询分析策略 
    path: thisFile + '/analysiTable',
    method: 'get'
  },
  analysiTableReport: { // 单表分析-查看分析-分析报告
    path: thisFile + '/analysiTableReport',
    method: 'get'
  },
  analysiTableDetail: {
    path: thisFile + '/analysiTableDetail/', // {activityId}
    method: 'get'
  },
  //我的评价表-详情-点击人员头像进行打分或查看
  EvaluatedGet: '/appraiserEvaluated/get',

  //评价打分 POST
  appraiserSubmit: '/appraiserEvaluated/appraiser/submit',

  //详情 GET
  queryByUser: '/appraiserEvaluated/query/byUser',

  /* 删除 */
  delete: thisFile + '/remove', // 删除一条或多条记录
};

export default api
