let thisFile = 'service-fee';
let api = {
    list: { // 列表
        path: '/teachFee/listPage',
        method: 'get'
    },
    add: { // 增加
        path: thisFile + '/add',
        method: 'post'
    },
    get: { // 获取
        path: thisFile + '/get', // {id}
        method: 'get'
    },
    modify: { // 修改
        path: thisFile + '/modify/', // {id}
        method: 'post'
    },
    pay: { // 支付
        path: '/teachFee/pay', //
        method: 'post'
    },
    delete: thisFile + 'remove', // 删除
};

export default api;
