/**
 * 技能中心 中心反馈
 * auth  jhd
 * time 2018-03-06
 *
 */

const thisFile = '/centralFeedback';
const api = {
    //中心反馈列表
    list : {
        path: thisFile + '/list',
        method: 'get'
    },
    //获取中心反馈详情
    get :{
        path: thisFile + '/get/',
        method: 'get'
    }
}
export default api
