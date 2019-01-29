let thisFile = 'archivesRoleAttr';
let api = {
    list: { // 角色列表
        path: '/role/list',
        method: 'get'
    },
    add: { // 增加
        path: thisFile + '/add/',
        method: 'post'
    },
    get: { // 获取
        path: thisFile + '/get/', // {id}
        method: 'get'
    },
    // modify: { // 修改
    //     path: thisFile + '/modify/', // {id}
    //     method: 'post'
    // },
    // delete: thisFile + 'remove', // 删除
};

export default api;
