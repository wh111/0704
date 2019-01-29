const api = {
  /*---------获取人员信息-----------*/
  getSXS: { // 实习生
    path: 'user/getSXS/',
    method: 'get'
  },
  getBKS: { // 本科生
    path: 'user/getBKS/',
    method: 'get'
  },
  getYJS: { // 研究生
    path: 'user/getYJS/',
    method: 'get'
  },
  getZYY: { // 住院医
    path: 'user/getZYY/',
    method: 'get'
  },
  getJXS: { // 进修生
    path: 'user/getJXS/',
    method: 'get'
  },
  basic: { // 其他
    path: 'archives/get/basic/',
    method: 'get'
  },
  /*查科室名字  --根据轮转生以及用户类型获取轮转科室以及状态记录*/
  userRotaryDeptlistTree:'/traineeRotary/arrangeRotary/userRotaryDeptlistTreeData/',//{userType}-{userId}

};

export default api
