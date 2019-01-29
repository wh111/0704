const file = "rotationProcess/skillMakeUpExam";
const api = {
  list: {//列表
    path: file + '/myList',
    method: 'get'
  },
  get: {//根据轮转ID查看出科鉴定
    path: 'rotationProcess/outDepAppraise/getByPodId/', // {podId}
    method: 'get'
  },
  getPodId: {//根据轮转生以及用户类型获取轮转科室以及状态记录
    path: 'traineeRotary/arrangeRotary/userRotaryDeptlistTreeData/', // {userType}-{userId}
    method: 'get'
  },
  add: {//添加
    path: file + '/add',
    method: 'post'
  },
}
export default api;
