const thisFile = '/rotationProcess/outBigDepAppraise';
const api = {
  pagelist: { // 轮转生查看出科鉴定列表
    path: thisFile + '/pagelist',
    method: 'get'
  },
  managePagelist: { // 非轮转生查看出科鉴定列表
    path: thisFile + '/managePagelist',
    method: 'get'
  },
  depAddComment: { // 添加科室评语
    path: thisFile + '/depAddComment/', // {examinationId}
    method: 'put'
  },
  addUserComment: { // 学员添加个人小结
    path: thisFile + '/addUserComment/', // {examinationId}
    method: 'post'
  },
  addManageComment: { // 根据大科室出科鉴定ID添加教育处评语
    path: thisFile + '/addManageComment/', // {examinationId}
    method: 'get'
  },
  teacherAddComment: { // 添加带教老师评语
    path: thisFile + '/teacherAddComment/', // {examinationId}
    method: 'put'
  },
  skillMakeUpExamAdd: { // 技能补考添加--出科鉴定 技能补考页面保存时调用
    path: '/rotationProcess/skillMakeUpExam/add',
    method: 'post'
  },
  get: { // 查看出科鉴定
    path: thisFile + '/get/_', // {examinationId}
    method: 'get'
  },
};

export default api
