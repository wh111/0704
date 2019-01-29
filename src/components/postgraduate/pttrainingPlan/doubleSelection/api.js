let thisFile = '/mutual/selection/teacher';
let api = {
    list: { // 列表
        path: thisFile + '/list',
        method: 'get'
    },
    confirm: { // 选择老师
        path: thisFile + '/confirm/',
        method: 'put'
    },
    selected:{ // 已选老师
        path:'/mutual/selection/selected/list',
        method:'get'
    },
  otherGet: {
    path: '/archives/get/basic/',
    method: 'get'
  },
  archivesGet: {
    path: '/archives/get/teach/',
    method: 'get'
  },
};

export default api;
