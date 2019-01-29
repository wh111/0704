const api = {
  audit: { // 批量审核
    path:  '/literature/audit/', //{ids}
    method: 'post',
  },

  get: { // 查看
    path:  '/literature/get/', //{id}
    method: 'get',
  },

  detail: { // 查看
    path:  '/literature/info/', //{id}
    method: 'get',
  },

  listPage: { // 列表
    path:  '/literature/listPage',
    method: 'get',
  },

  remove: { // 删除
    path:  '/literature/remove', //{ids}
    method: 'delete',
  },

  save: { // 权限设置-提交保存
    path:  '/literature/permissions/save/', //{ids}
    method: 'post',
  },

  canceled: { // 撤销
    path:  '/literature/canceled', //{ids}
    method: 'put',
  },

  published: { // 发布
    path:  '/literature/published', //{ids}
    method: 'put',
  },

  modify: { // 修改
    path:  '/literature/modify/', //{id}
    method: 'put',
  },

  add: { // 添加
    path:  '/literature/add', //{id}
    method: 'post',
  },

  // VIDEO 教学视频
  //   2 LITERATURE 文档文献
  //   3 CASES 典型病例
  //   4 ATLAS 医学图谱

  resourceTypeTree:{ // 左侧树
    path:  '/resourceType/tree-by-manager?types=LITERATURE',  //{ids}   //
    method: 'delete',
  },






};

export default api
