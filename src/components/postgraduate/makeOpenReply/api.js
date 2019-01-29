//答辩管理
const api = {
  //答辩申请
  defenseAppGet: {  //获取答辩申请(修改时调用)
    path: '/defense/application/getByUser',
    method: 'get'
  },
  defenseAppAdd: {  //答辩申请添加
    path: '/defense/application/add',
    method: 'post'
  },
  defenseAppModify: {    //答辩申请修改  /{id}
    path: '/defense/application/modify/',
    method: 'post'
  },
  defenseAppReport: {    //答辩申请上报（修改未上报的答辩申请状态为DSH待审核）  /{id}
    path: '/defense/application/report/',
    method: 'put'
  },

  getDefenseData: { // 研究生答辩数据填写情况
    path: '/defense/application/getDefenseData',
    method: 'get'
  },

  //答辩审核
  defenseAppAuditGet: {    //获取答辩申请(审批时调用)  /{id}
    path: '/defense/application/audit/get/',
    method: 'get'
  },
  defenseAppList: {    //答辩申请列表（审核时调用）
    path: '/defense/application/list',
    method: 'get'
  },
  defenseAppAudit: {    //答辩申请审批  /{id}
    path: '/defense/application/audit/',
    method: 'put'
  },

  //答辩汇总
  defenseSummaryReport: {    //答辩汇总上报  /{id}
    path: '/defense/summary/report',
    method: 'put'
  },
  defenseSummaryList: {    //答辩汇总列表
    path: '/defense/summary/list',
    method: 'get'
  },
  defenseSummaryAdd: {   //答辩汇总添加(保存,上报时调用)
    path: '/defense/summary/add',
    method: 'post'
  },
  defenseSummaryModify: {   //答辩汇总添加(保存,上报时调用)
    path: 'defense/summary/modify/',//{id}
    method: 'put'
  },
  defenseSummaryUserList: {    //答辩汇总选择人员（选择人员调用）
    path: '/defense/application/user/list',
    method: 'get'
  },

  //答辩汇总审核
  defenseSummaryGet: {    //获取答辩汇总(审批时调用)  /{id}
    path: '/defense/summary/get/',
    method: 'get'
  },
  defenseSummaryAuditList: {    //答辩汇总审核列表（审核时调用）
    path: '/defense/summary/auditList',
    method: 'get'
  },
  defenseSummaryAudit: {    //答辩汇总审批  /{id}
    path: '/defense/summary/audit/',
    method: 'put'
  },

  //答辩结果记录
  defenseAppResGet: {    //查看答辩申请(答辩结果记录/查询 时查看)  /{id}
    path: '/defense/application/result/get/',
    method: 'get'
  },
  defenseAppResGetList: {    //答辩结果列表（答辩结果记录列表）
    path: '/defense/application/result/list',
    method: 'get'
  },
  defenseAppResAudit: {    //答辩结果（）  /{id}
    path: '/defense/application/result/record',
    method: 'put'
  },

  //答辩结果查询
  defenseAppResQueryList: {    //答辩结果查询（答辩结果记录列表）
    path: '/defense/application/result/queryList',
    method: 'get'
  },

  //答辩状态查询
  defenseAppStatusQueryList: {    //答辩结果查询（答辩结果记录列表）
    path: '/defense/application/status/list',
    method: 'get'
  }
};

export default api;
