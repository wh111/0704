const api = {
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
};

export default api
