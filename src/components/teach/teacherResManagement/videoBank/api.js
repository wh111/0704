const api = {
  videoListPage: { // 列表
    path: '/video/listPage',
    method: 'get',
  },

  get: { // 查看(只查视频详情)
    path: '/video/get/', //{id}
    method: 'get',
  },

  commentListPage: { // 查看-评论-列表
    path: '/comment/listPage', //{id}
    method: 'get',
  },

  commentRemove: { // 查看-评论-删除
    path: '/comment/remove/', //{ids}
    method: 'delete',
  },

  commentAdd: { // 查看-评论-畅言一下
    path: '/comment/add',
    method: 'post',
  },

  audit: { // 批量审核
    path: '/video/audit/', //{ids}
    method: 'put',
  },

  save: { // 权限设置-提交保存
    path: '/video/permissions/save/', //{ids}
    method: 'post',
  },

  canceled: { // 撤销
    path: '/video/canceled', //{ids}
    method: 'put',
  },

  published: { // 发布
    path: '/video/published', //{ids}
    method: 'put',
  },
  modify: { // 修改
    path: '/video/modify/', //{id}
    method: 'put',
  },

  add: { // 添加
    path: '/video/add', //{id}
    method: 'post',
  },

  videoRemove: { // 删除
    path: '/video/remove', //{ids}
    method: 'delete',
  },

  //   1 VIDEO 教学视频
  //   2 LITERATURE 文档文献
  //   3 CASES 典型病例
  //   4 ATLAS 医学图谱

  resourceTypeTree: { // 左侧树
    path: '/resourceType/tree-by-manager?types=VIDEO', //{ids}   //
    method: 'get',
  },






};

export default api
