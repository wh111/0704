const thisFile = 'scene';
const api = {
  list: { // 获取场次列表（考核场次加载场次列表，考核安排加载场次列表，成绩查询加载考核列表，场次维护加载考核列表时调用）
    path: thisFile + '/list',
    method: 'get'
  },
  modifyStatus: { // 修改场次状态（发布场次或撤销发布时，开始考核或结束考核时调用）
    path: thisFile + '/modifyStatus/',
    method: 'put'
  },
  /***************** 生成时间表 ****************************/
  arrangementAdd: { // 生成考核安排表（生成考核安排时调用）
    path: thisFile + '/arrangement/add',
    method: 'post'
  },
  /************** 导出Excel ********************/
  spExcelExport: { // 导出SP时间表（导出SP时间表时调用）
    path: thisFile + '/arrangement/sp/excelExport',
    method: 'get'
  },
  teacherExcelExport: { // 导出监考老师时间表（导出监考老师时间表时调用）
    path: thisFile + '/arrangement/teacher/excelExport',
    method: 'get'
  },
  examUserExcelExport: { // 导出考生时间表到Excel(导出考生时间表时调用)
    path: thisFile + '/arrangement/examUser/excelExport',
    method: 'get'
  },
  examWaitingExcelExport: { // 导出考生候考时间表到Excel
    path: thisFile + '/arrangement/waiting/excelExport',
    method: 'get'
  },
  /**************** 查看时间表 ************************/
  spList: { // 获取SP时间表（查看SP时间表加载时调用）
    path: thisFile + '/arrangement/sp/list',
    method: 'get'
  },
  teacherList: { // 获取监考老师时间表（查看监考老师时间表加载时调用）
    path: thisFile + '/arrangement/teacher/list',
    method: 'get'
  },
  studentList: { // 获取考生考核列表（查看考生时间表加载时调用）
    path: thisFile + '/arrangement/examUser/list',
    method: 'get'
  }
};

export default api
