let thisFile = 'mutual/selection';
let api = {
    dslist: { //老师列表
        path: thisFile + '/student/list',
        method: 'get'
    },
    kslist: { //科室查看报名学生列表
        path: thisFile + '/student/ksList',
        method: 'get'
    },
    jyclist: { //教育处查看报名学生列表
        path: thisFile + '/student/jyc/confirm/list',
        method: 'get'
    },
    dsconfirm: { // 老师确认招生
        path: thisFile + '/student/confirm/',
        method: 'put'
    },
    ksconfirm: { // 科室确认
        path: thisFile + '/student/ksConfirm/',
        method: 'put'
    },
    jycconfirm: { // 科室确认
        path: thisFile + '/student/jycConfirm/',
        method: 'put'
    },
    get: { // 获取
        path: thisFile + '/get/', // {id}
        method: 'get'
    },
    modify: { // 修改
        path: thisFile + '/modify/', // {id}
        method: 'put'
    },
    delete: thisFile + '/remove', // 删除
    send:{
      path:'/sms/send/signContent',//发送短信
      method:'post'
    }
};

export default api;
