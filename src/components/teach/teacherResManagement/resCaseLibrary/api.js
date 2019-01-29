const api = {
  audit: { // 批量审核
    path:  '/cases/audit/', //{ids}
    method: 'post',
  },

  get: { // 查看
    path:  '/cases/get/', //{id}
    method: 'get',
  },

  detail: { // 查看
    path:  '/cases/info/', //{id}
    method: 'get',
  },

  listPage: { // 列表
    path:  '/cases/listPage',
    method: 'get',
  },

  remove: { // 删除
    path:  '/cases/remove', //{ids}
    method: 'delete',
  },

  save: { // 权限设置-提交保存
    path:  '/cases/permissions/save/', //{ids}
    method: 'post',
  },

  canceled: { // 撤销
    path:  '/cases/canceled', //{ids}
    method: 'put',
  },

  published: { // 发布
    path:  '/cases/published', //{ids}
    method: 'put',
  },

  modify: { // 修改
    path:  '/cases/modify/', //{id}
    method: 'put',
  },

  add: { // 添加
    path:  '/cases/add', //{id}
    method: 'post',
  },

  // VIDEO 教学视频
  //   2 LITERATURE 文档文献
  //   3 CASES 典型病例
  //   4 cases 医学图谱

  resourceTypeTree:{ // 左侧树
    path:  '/resourceType/tree-by-manager?types=CASES',  //{ids}   //
    method: 'delete',
  },






};

export default api
