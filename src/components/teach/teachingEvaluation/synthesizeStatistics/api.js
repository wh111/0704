const thisFile = '/strategy';
const api = {
  list: { // 分页查询分析策略 
    path: thisFile + '/listPage',
    method: 'get'
  },
  add: { // 添加 分析策略
    path: thisFile + '/add',
    method: 'post'
  },
  modify: { // 修改分析策略
    path: thisFile + '/modify/', // id 综合分析主键ID
    method: 'put'
  },
  get: { // 分页查询分析策略 
    path: thisFile + '/get/', // id 综合分析主键ID
    method: 'get'
  },
  strategyTableDetail: { // 综合分析---查看分析
    path: thisFile + '/query/strategyTableDetail/', // strategyId 综合分析主键ID
    method: 'get'
  },
  strategyTableReport: { // 综合分析-查看分析-分析报告
    path: thisFile + '/query/strategyTableReport',
    method: 'get'
  },
  getActivity: { // 根据评价活动名称获取单个活动信息
    path: '/activity/get/',
    method: 'get'
  },
  queryByAppraiserType: { // 根据被评人类型查询评价活动
    path: '/activity/query/byAppraiserType',
    method: 'get'
  },
  /* 删除 */
  delete: thisFile + '/remove', // 删除一条或多条记录
};

export default api
