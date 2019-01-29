let thisFile = '/inStudy/eduStudySubjectsSelection';
let api = {
    list: { // 列表
        path: thisFile + '/pageList',
        method: 'get'
    },
    modifyWehterSelection: { // 遴选人员
        path: thisFile + '/modifyWehterSelection',
        method: 'get'
    },
    modifyUserCheckInTime: { // 修改报道时间
      path: thisFile + '/modifyUserCheckInTime/', // ｛subjectsId｝
      method: 'put'
    },
    get: { // 获取
        path: thisFile + '/get/', // {id}
        method: 'get'
    },
    modify: { // 修改
        path: thisFile + '/modify/', // {id}
        method: 'put'
    },
    getQueryTreeByManager:{ // 获取当前登录人员管理的三级以及三级以下的科室集合
      path:"/hospital/dept/getQueryTreeByManager",
      method:'get',
    },
    delete: thisFile + '/remove', // 删除
};

export default api;
