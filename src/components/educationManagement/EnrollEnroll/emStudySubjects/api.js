let thisFile = '/studysubject';
let api = {
    subPageList: { // 列表
        path: thisFile + '/pageList',
        method: 'get'
    },
    subAdd: { // 添加进修科目
        path: thisFile + '/add/',
        method: 'post'
    },
    subGet: { // 获取
        path: thisFile + '/get/', // {managementId}
        method: 'get'
    },
    subModify: { // 修改
        path: thisFile + '/modify/', // {managementId}
        method: 'put'
    },
    subModifyState:{ // 进修科目启用、禁用
      path: thisFile + '/modifyState/', // {managementId}
      method: 'put'
    },
};

export default api;
