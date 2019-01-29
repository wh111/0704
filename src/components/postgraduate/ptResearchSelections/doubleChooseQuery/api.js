let thisFile = 'mutual/selection';
let api = {
    listxs: { // 学生查询老师
        path: thisFile + '/listxs',
        method: 'get'
    },
    listls: { // 老师查询学生
        path: thisFile + '/listls',
        method: 'get'
    }
};

export default api;
