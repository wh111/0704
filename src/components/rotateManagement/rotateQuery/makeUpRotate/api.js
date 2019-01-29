let thisFile = 'rotationProcess/outDepAppraise';
let api = {
    list: { // 获取补轮转信息
        path: thisFile + '/getRepairRotary',
        method: 'get'
    },
    add: { // 设置补轮转周期
        path: thisFile + '/modifyTs-', // { id }
        method: 'put'
    },
};

export default api;
