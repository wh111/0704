const thisFile = '/rotationProcess/graduationAppraise';
const api = {
  userGet: { // 登录用户获取自己的结业数据
    path: thisFile + '/userGet',
    method: 'get'
  },
  userAdd: { // 学员修改结业鉴定个人小结
    path: thisFile + '/userAdd/', // {appraisalId}
    method: 'post'
  },
  userSubmit: { // 添加
    path: thisFile + '/userSubmit_', //{appraisalId}
    method: 'post'
  },
};

export default api
