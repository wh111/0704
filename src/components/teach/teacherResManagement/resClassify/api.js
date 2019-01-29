/**   --资源分类管理--   **/
const thisFile = 'resourceType';
const api = {
  //标准课程目录树
  courseTree:{
    path: '/criterionCourseType/tree-by-manager',
    method: 'get'
  },
  courseTreeAdd:{  //左侧树-添加
    path: '/criterionCourseType/add',
    method: 'post'
  },
  courseTreeEdit:{  //左侧树-修改 modify/{id}
    path: '/criterionCourseType/modify',
    method: 'put'
  },
  courseTreeGet:{  //左侧树-查看  modify/{id}
    path: '/criterionCourseType/get/',
    method: 'get'
  },
  courseTreeDel:{  //左侧树删除 remove/{ids}
    path: '/criterionCourseType/remove',
    method: 'delete'
  },
  courseTreelistPage:{  //列表 (点击树，分页查询标准课程列表)
    path: "/criterionCourseType/listPage",
    method: 'get'
  },



  tree: { // 左侧树
    path: thisFile + '/tree-by-manager',
    method: 'get'
  },
  treeListPage:{  //目录树列表
    path: thisFile + '/listPage',
    method: 'get'
  },
  treeGet:{ //查看  get/{id}
    path: thisFile + '/get',
    method: 'get'
  },
  treeRemove:{  //删除  remove/{ids}
    path: thisFile + '/remove',
    method: 'delete'
  },
  treeModify:{  //修改  modify/{id}
    path: thisFile + '/modify',
    method: 'put'
  },
  treeAdd:{  //添加
    path: thisFile + '/add',
    method: 'post'
  },
  moveTreeNode:{  //树节点拖动  parentId/{id}
    path: thisFile + '/modify/parentId',
    method: 'put'
  }
};

export default api
