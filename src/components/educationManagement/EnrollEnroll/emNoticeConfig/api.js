const api = {
  save: { //部门人员-添加/修改 进修生
    path: '/user/saveJXS',
    method: 'post'
  },
  get: { //部门人员-查看进修生
    path: '/user/getJXS/',
    method: 'get'
  },
  getByFilter: { //部门人员-查看研究生(根据权限进行字段过滤）
    path: '/user/getJXS-by-filter/',
    method: 'get'
  },
  getByKey:{//获取最新模板
    path: '/rotaryConfig/getByKey/jxs_emNotice_config-JXS',
    method: 'get'
  },
  changBykey:{//更改模板
    path: '/rotaryConfig/modifyByJson/',
    method: 'get'
  },
};

export default api
