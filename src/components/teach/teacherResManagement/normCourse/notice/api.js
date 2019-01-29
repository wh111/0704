let api = {
  get: { // 查看-公告-列表
    path: '/courseNotices/query',
    method: 'get'
  },
  add: { // 管理-公告-发布
    path: '/courseNotices/add',
    method: 'post'
  }
}

export default api
