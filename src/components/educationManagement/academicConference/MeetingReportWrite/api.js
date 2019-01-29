let thisFile = 'conference';
let api = {
    list: { // 列表
        path: thisFile + '/list',
        method: 'get'
    },
    jsxList: { // 进修生查看列表
        path: thisFile + '/list-JXS',
        method: 'get',
    },
    add: { // 增加/修改
        path: thisFile + '/save',
        method: 'post'
    },
    get: { // 获取
        path: thisFile + '/get/', // {id}
        method: 'get'
    },
    submit: { // 上报
        path: thisFile + '/submit', // {id}
        method: 'post'
    },
    searhDepAndSpecialty: { //查询所有启用的科室（查询所有启用的科室，不带分页）
        path: "/hospital/dept/queryAll",
        method: 'get'
    },
    uploadFile: "/file/upload/static", // 文件上传
    getDictionary: '/dictionary/getByCode/', // 获取字典
    delete: thisFile + '/remove', // 删除
};

export default api;
