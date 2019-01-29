const file = '/inStudy/notice';//当前模块api前缀
const api = {
    list: {//
        path: file + '/pageList',
        method: 'get'
    },
    batchSendNotice: {//根据当前用户的id，发送当前用户的进修通知
        path: file + '/batchSendNotice/',
        method: 'put'
    },
    
    get: {//
        path: file + '/get/',
        method: 'get'
    },
    getMySubjectNotice: {//
      path: file + '/getMySubjectNotice',
      method: 'get'
    },
    modify:{
      path: file + '/modify',
      method: 'put'
    },
    delete: {//
        path: file + '/remove?ids=',
        method: 'delete'
    }
}
export default api
