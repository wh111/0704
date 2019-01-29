const thisFile = '/rotationProcess/graduationAppraise';
const api = {
  list: { // 管理员查看结业鉴定列表
    path: thisFile + '/pagelist',
    method: 'get'
  },
  get: { // 管理员查看个人结业鉴定
    path: thisFile + '/get/', // {appraisalId}
    method: 'get'
  },
  manageAdd: { // 实习单位添加意见
    path: thisFile + '/manageAdd/', // {appraisalId}
    method: 'post'
  },
  exportQualifiedUser: { // 导出合格人员
    path: thisFile + '/exportQualifiedUser',
    method: 'get'
  },
  exportNoQualifiedUser: { // 导出不合格人员
    path: thisFile + '/exportNoQualifiedUser',
    method: 'get'
  },
  uploadMark: { // 管理员导入成绩
    path: thisFile + '/uploadMark',
    method: 'post'
  },
  convertToYjs: { // 管理员导入成绩
    path:'/signupRecruit/trialSxUser/convertToYjs/',
    method: 'post'
  },
  getListByUserId: { // 查询出科鉴定个人出科小结 参数 userId
    path:'/rotationProcess/outDepAppraise/getListByUserId',
    method: 'post'
  }
};

export default api
