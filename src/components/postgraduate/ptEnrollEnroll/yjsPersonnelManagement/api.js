const api = {
  save: { //部门人员-添加/修改 研究生
    path: '/user/saveYJS',
    method: 'post'
  },
  get: { //部门人员-查看研究生
    path: '/user/getYJS/',
    method: 'get'
  },
  getByFilter: { //部门人员-查看研究生(根据权限进行字段过滤）
    path: '/user/getYJS-by-filter/',
    method: 'get'
  },
  import: { //部门人员-导入研究生
    path: '/user/importYJS/', // {deptId}
    method: 'post'
  },
    major: '/hospital/dept/getByDepth',  //专业
};

export default api
