const api = {

  /*----- 手工调整 --------------------------------------------------------------------------------*/

  rtuserPagelist: {  //手工调整--轮转微调人员列表
    path: '/traineeRotary/groupRotary/queryDeptList',
    method: 'get'
  },
  regUserMicrCtrol: {  //手工调整--轮转微调  保存微调的数据
    path: '/traineeRotary/groupRotary/regGroupMicrCtrol',
    method: 'post'
  },
  getRotaryDepIndo: {  //分组微调--根据组ID查询轮转表
    path: '/traineeRotary/groupRotary/queryUser',
    method: 'get'
  },
  schools: { //查询学校
    path: '/schools/queryList',
    method: 'get'
  },

};

export default api

