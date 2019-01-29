let thisFile = 'teach';
let api = {
    list: { // 列表
        path: thisFile + '/queryWorks',
        method: 'get'
    },
    get: { // 获取
        path: thisFile + '/getWorks',
        method: 'get'
    },
    export: { // 导出
        path: thisFile + '/exportWorks',
        method: 'get'
    },
};

export default api;
