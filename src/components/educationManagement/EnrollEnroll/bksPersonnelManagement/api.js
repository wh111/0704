const api = {
  save: { //部门人员-添加/修改 本科生
    path: '/user/saveBKS',
    method: 'post'
  },
  get: { //部门人员-查看本科生
    path: '/user/getBKS/',
    method: 'get'
  },
  getByFilter: { //部门人员-查看本科生(根据权限进行字段过滤）
    path: '/user/getBKS-by-filter/',
    method: 'get'
  },
  import: { //部门人员-导入本科生
    path: '/user/importBKS/', // {deptId}
    method: 'post'
  },
};

export default api
