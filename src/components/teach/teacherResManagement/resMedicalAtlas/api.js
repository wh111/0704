const api = {
  audit: { // 批量审核
    path:  '/atlas/audit/', //{ids}
    method: 'post',
  },

  get: { // 查看
    path:  '/atlas/get/', //{id}
    method: 'get',
  },

  detail: { // 查看
    path:  '/atlas/info/', //{id}
    method: 'get',
  },

  listPage: { // 列表
    path:  '/atlas/listPage',
    method: 'get',
  },

  remove: { // 删除
    path:  '/atlas/remove', //{ids}
    method: 'delete',
  },

  save: { // 权限设置-提交保存
    path:  '/atlas/permissions/save/', //{ids}
    method: 'post',
  },

  canceled: { // 撤销
    path:  '/atlas/canceled', //{ids}
    method: 'put',
  },

  published: { // 发布
    path:  '/atlas/published', //{ids}
    method: 'put',
  },

  modify: { // 修改
    path:  '/atlas/modify/', //{id}
    method: 'put',
  },

  add: { // 添加
    path:  '/atlas/add', //{id}
    method: 'post',
  },

  // VIDEO 教学视频
  //   2 LITERATURE 文档文献
  //   3 CASES 典型病例
  //   4 ATLAS 医学图谱

  resourceTypeTree:{ // 左侧树
    path:  '/resourceType/tree-by-manager?types=ATLAS',  //{ids}   //
    method: 'delete',
  },






};

export default api
