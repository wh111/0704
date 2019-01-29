const thisFile = '/rotationProcess/skillMakeUpExam';
const api = {
  list: { // 管理员查看结业鉴定列表
    path: thisFile + '/pageList',
    method: 'get'
  },
  get: { // 技能补考查看
    path: thisFile + '/get/', // {id}
    method: 'get'
  },
  add: { // 技能补考添加--出科鉴定 技能补考页面保存时调用
    path: thisFile + '/manageAdd/',
    method: 'post'
  },
  modifyExamMark: { // 设置技能补考成绩
    path: thisFile + '/modifyExamMark/', // {id}
    method: 'put'
  },
};

export default api
