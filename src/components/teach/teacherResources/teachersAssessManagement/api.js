let thisFile = 'teach';
let api = {
    list: { // 列表
        path: thisFile + '/queryEvaluates',
        method: 'get'
    },
    get: { // 获取
        path: thisFile + '/getEvaluates',
        method: 'get'
    },
    export: { // 导出
        path: thisFile + '/exportEvaluates',
        method: 'get'
    },
};

export default api;
