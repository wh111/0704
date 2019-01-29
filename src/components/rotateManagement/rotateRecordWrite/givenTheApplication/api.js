const thisFile = '/rotationProcess/outDepAppraise';
const api = {
  pagelist: { // 轮转生查看出科鉴定列表
    path: thisFile + '/pagelist',
    method: 'get'
  },
  userAddComment: { // 学员添加个人小结
    path: thisFile + '/userAddComment/', // {depExaminationId}
    method: 'put'
  },
  get: { // 查看出科鉴定
    path: thisFile + '/get/', // {depExaminationId}
    method: 'get'
  },
  getByPodId: { // 查看出科鉴定
    path: thisFile + '/getByPodId/', // {podId}
    method: 'get'
  },
  getUserRotaryInfo: { // 出科鉴定-根据轮转ID获取考勤信息以及轮转成绩、病种填写信息
    path: thisFile + '/getUserRotaryInfo/', // {podId}
    method: 'get'
  },
  getDepartment: { // 根据轮转生以及用户类型获取轮转科室以及状态记录
    path: '/traineeRotary/arrangeRotary/userRotaryDeptlist/', // {userType}-{userId}
    method: 'get'
  },
  getDepartmentTree: { // 根据轮转生以及用户类型获取轮转科室以及状态记录
    path: '/traineeRotary/arrangeRotary/userRotaryDeptlistTreeData/', // {userType}-{userId}
    method: 'get'
  },
  getDepRequirementBySXS: { // 根据细则ID和标准科室周期主键ID获取科室要求（实习生）
    path: '/deprequirement/getDepRequirement/', // {depOutlineId}_{depId}_{podId}
    method: 'get'
  },
  getDepRequirement: { // 根据细则ID和标准科室周期主键ID获取科室要求（非实习生）
    path: '/rotaryBasis/rulesTraining/getDepRequirement/', // {rdId}_{depId}_{podId}
    method: 'get'
  },
  skillMakeUpExamAdd: { // 技能补考添加--出科鉴定 技能补考页面保存时调用
    path: '/rotationProcess/skillMakeUpExam/add',
    method: 'post'
  },
  getRotaryRequirStatic:{ // 轮转要求统计
    path: thisFile + '/getRotaryRequirStatic-', // {podId}
    method: 'get'
  },
  outDepAppraiseGet:{ // 通过轮转id获取出科详情
    path: thisFile + '/getDetail/', // {podId}
    method: 'get'
  },
  markGet: { // 考试成绩列表查询
    path: '/rotaryOutdepHistoryMark/get/', //{id}
    method: 'get'
  },
  queryOldRotaryDept: { // 学员添加出科鉴定时 判断之前的出科鉴定是否已填写以及延期申请是否已填写。
    path: '/rotationProcess/outDepAppraise/queryOldRotaryDept/', //{podId}
    method: 'get'
  },
};

export default api
