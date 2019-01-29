const file = '/intern/breaks';//当前模块api前缀
const api = {
    add: {//
        path: file + '/add',
        method: 'post'
    },
    list: {//
        path: file + '/listData',
        method: 'get'
    },
    get: {//
        path: file + '/get?id=',
        method: 'get'
    },
    modify: {//
        path: file + '/modify',
        method: 'put'
    },
    delete: {//
        path: file + '/remove?ids=',
        method: 'delete'
    }
}
export default api
