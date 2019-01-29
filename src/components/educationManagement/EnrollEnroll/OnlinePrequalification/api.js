let thisFile = '/inStudy/preTrial';
let api = {
    list: { // 列表
        path: thisFile + '/pageList',
        method: 'get'
    },
    modifyState: { // 增加
        path: thisFile + '/modifyState/',
        method: 'get'
    },
    exportExcel: { // 获取
        path: thisFile + '/exportExcel?', // {id}
        method: 'get'
    },
    modify: { // 修改
        path: thisFile + '/modify/', // {id}
        method: 'put'
    },
    getUserInfo:{ // 根据用户ID查询 进修生申请书
      path: '/inStudy/eduStudySubjects/get/', // {id}
      method: 'get'
    },
    delete: thisFile + '/remove', // 删除
};

export default api;
