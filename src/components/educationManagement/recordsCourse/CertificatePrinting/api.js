let thisFile = 'inStudy/inThreeMonthLong';
let api = {
    list: { // 列表
        path: thisFile + '/pageList',
        method: 'get'
    },
    get: { // 结业证信息
        path: thisFile + '/get-', // {subjectsId}
        method: 'get'
    },
    modify: { // 修改
        path: thisFile + '/modify-', // {subjectsId}
        method: 'put'
    },
};

export default api;
