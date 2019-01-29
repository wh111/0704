const api = {
  getDiplomaConfig: { // 获取结业证书数据
    path: '/rotaryConfig/getByKey/jx_three_month_long_mes-JXS',
    method: 'get'
  },
  saveDiplomaConfig: { // 保存结业证书配置数据
    path: "/rotaryConfig/modify/",
    method: "put"
  },
  getStudentInfo:{ // 获取学生信息
    path:"/inStudy/eduStudySubjects/get/",
    method:"get",
  },
};

export default api
