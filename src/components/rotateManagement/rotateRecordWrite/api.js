/**
 * Created by Administrator on 2017/7/3.
 */
export default {
  /*病种分页列表*/
  diseaseRecordPagelist:'/rotationProcess/diseaseRecord/pagelist',

  /*添加病种*/
  diseaseRecordAdd:'/rotationProcess/diseaseRecord/add',

  /*修改病种*/
  diseaseRecordModify:'/rotationProcess/diseaseRecord/modify/',//{diseaseId}

  /*修改上报病种*/
  diseaseRecordModifyRelease: '/rotationProcess/diseaseRecord/modifySubmit/',//{diseaseId}

  /*添加上报病种*/
  diseaseRecordAddRelease:'/rotationProcess/diseaseRecord/addRelease',//

  /*查看病种*/
  diseaseRecordGet:'/rotationProcess/diseaseRecord/get/',//{diseaseId}

  /*上报病种*/
  diseaseModifyRelease:'/rotationProcess/diseaseRecord/modifyRelease',//{diseaseId}

  /*删除病种*/
  diseaseRemove:'/rotationProcess/diseaseRecord/remove',//{diseaseId}

  /*实习生  根据科室要求ID和科室获取需完成数量、已完成数量、未完成数量*/
  getMyRotaryRequirements:'/deprequirement/getMyRotaryRequirements/',//{type}-{podId}


  /* 住院医  根据科室要求ID和科室获取需完成数量、已完成数量、未完成数量*/
  ZYYgetMyRotaryRequirements:'/rotaryBasis/rulesTraining/getMyRotaryRequirements/',//{type}-{podId}



  /*查科室名字  --根据轮转生以及用户类型获取轮转科室以及状态记录*/
  userRotaryDeptlist:'/traineeRotary/arrangeRotary/userRotaryDeptlist/',//{userType}-{userId}
  userRotaryDeptlistTree:'/traineeRotary/arrangeRotary/userRotaryDeptlistTreeData/',//{userType}-{userId}

/*技能填写*/
  /*修改上报技能*/
  modifySubmit: '/rotationProcess/skillRecord/modifySubmit/',//{skillId}

  /*添加上报技能*/
  skillRecordAddRelease:'/rotationProcess/skillRecord/addRelease',//{skillId}

  /*添加技能*/
  skillRecordAdd:'/rotationProcess/skillRecord/add',//

  /*修改技能*/
  skillRecordModify:'/rotationProcess/skillRecord/modify/',//{skillId}

  /*查看技能*/
  skillRecordGet:'/rotationProcess/skillRecord/get/',//{skillId}

  /*上报技能*/
  skillRecordModifyRelease: '/rotationProcess/skillRecord/modifyRelease',//{skillId}

  /*删除技能*/
  skillRecordRemove:'/rotationProcess/skillRecord/remove/',//{diseaseId}

  /*技能分页列表*/
  skillRecordPagelist:'/rotationProcess/skillRecord/pagelist',//{diseaseId}


  /** 大病历*/

  //*麻醉记录模板*/

  /*麻醉记录查看*/
  caseRecordAnesthesiaGet:'/rotationProcess/caseRecord/anesthesiaGet/',//{caseId}

  /*麻醉记录添加*/
  caseRecordAnesthesiaAdd:'/rotationProcess/caseRecord/anesthesiaAdd',//

  /*麻醉记录添加上报*/
  caseRecordAnesthesiaAddRelease:'/rotationProcess/caseRecord/anesthesiaAddRelease',//

  /*麻醉记录修改*/
  caseRecordAnesthesiaModify:'/rotationProcess/caseRecord/anesthesiaModify/',//{caseId}

  /*麻醉记录修改上报*/
  caseRecordAnesthesiaModifyRelease:'/rotationProcess/caseRecord/anesthesiaModifyRelease/',//{caseId}

  //*影像资料模板*/

  /*影像资料查看*/
  caseRecordImageDataGet:'/rotationProcess/caseRecord/imageDataGet/',//{caseId}

  /*影像资料添加*/
  caseRecordImageDataAdd:'/rotationProcess/caseRecord/imageDataAdd',//

  /*影像资料添加上报*/
  caseRecordImageDataAddRelease:'/rotationProcess/caseRecord/imageDataAddRelease',//

  /*影像资料修改*/
  caseRecordImageDataModify:'/rotationProcess/caseRecord/imageDataModify/',//{caseId}

  /*影像资料修改上报*/
  caseRecordImageDataModifyRelease:'/rotationProcess/caseRecord/imageDataModifyRelease/',//{caseId}


  //*大病例模板*/
//根据模块获取对应的评分表
  configurationGet:'/rotaryevaluation/configuration/get/',

  //根据评分表打分
  configurationAddMark:'/rotaryevaluation/configuration/addMark',

  //查分数
  getMark:'/rotaryevaluation/configuration/getMark/',//{businessId}_{model}

  /*大病例查看*/
  caseRecordGet:'/rotationProcess/caseRecord/get/',//{caseId}

  /*大病例分页列表*/
  caseRecordPagelist:'/rotationProcess/caseRecord/pagelist',//{caseId}

  /*大病例添加*/
  caseRecordBigCasesAdd:'/rotationProcess/caseRecord/bigCasesAdd',//

  /*大病例添加上报*/
  caseRecordBigCasesAddRelease:'/rotationProcess/caseRecord/bigCasesAddRelease',//

  /*大病例修改*/
  caseRecordBigCasesModify:'/rotationProcess/caseRecord/bigCasesModify/',//{casesId}

  /*大病例修改上报*/
  caseRecordBigCasesModifyRelease:'/rotationProcess/caseRecord/bigCasesModifyRelease/',//{casesId}

  /*导出word大病例*/
  caseRecordExportToWord:'/rotationProcess/caseRecord/exportToWord/',//{casesId}

  /*大病例上报*/
  caseRecordBigCasesRelease:'/rotationProcess/caseRecord/bigCasesRelease',//{casesId}

  /*大病例删除*/
  caseRecordBigCasesDelete:'/rotationProcess/caseRecord/bigCasesDelete',//{casesId}

  // 黏贴查询是否黏贴
  bigcaseIscopy: '/rotaryConfig/getByKey/rotary_bigcase_iscopy-',

  // 大病例模板添加
  bigCasesAddTemplate: '/rotationProcess/caseRecord/bigCasesAddTemplate',

  // 大病例模板list
  templateList: '/rotationProcess/caseRecord/template/list',

  // bigCases   DeleteTemplate 删除
  bigCasesDeleteTemplate: '/rotationProcess/caseRecord/bigCasesDeleteTemplate',//{casesId}

  // bigCases   getTemplate 查看
  getTemplate: '/rotationProcess/caseRecord/getTemplate/',//{casesId}

  // bigCases   修改为经典病例
  modifyClassicCase: '/rotationProcess/caseRecord/modifyClassicCase',//{casesId}


  //  根据轮转ID获取科室要求明细(研究生和住院医 2017-11-10 新增)
  getRulesDepRequirementByPodId: '/rotaryBasis/rulesTraining/getRulesDepRequirementByPodId/',//{{podId}}
  //科室要求需要（因为工作台引用的是这个api文件）(研究生和住院医 2017-11-10 新增)
  disType: "/dictionary/getByCode/conf_sx_dep_requires_distype",

  //根据大病历ID获取评价详情
  evaluateList:'/rotationProcess/caseRecord/evaluateList/',//{casesId}
  /**
   * 临床技能操作
   * */

  /*临床操作记录添加上报 post*/
  clinicalRecordAddSubmit:'/traineeRotary/clinicalRecord/addSubmit',


  /*临床操作记录添加 post*/
  clinicalRecordAdd:'/traineeRotary/clinicalRecord/add',

  /* 临床操作记录列表(轮转生查看) get*/
  clinicalRecordPageList:'/traineeRotary/clinicalRecord/pageList',

  /* 临床操作记录删除 delete*/
  clinicalRecordDelete:'/traineeRotary/clinicalRecord/delete',//ids

  /*临床操作记录查看 get*/
  clinicalRecordGet:'/traineeRotary/clinicalRecord/get/',//{id}

  /*临床操作记录修改 put*/
  clinicalRecordModify:'/traineeRotary/clinicalRecord/modify/',//{id}

  /*临床操作记录上报 put*/
  clinicalRecordModifySubmit:'/traineeRotary/clinicalRecord/modifySubmit',//{ids}



  /**
   * 临床技能操作
   * */

  /*参加抢救危重病人记录查看 get*/
  rescuePatientRecordGet:'/traineeRotary/rescuePatientRecord/get/',//{id}

  /*参加抢救危重病人记录修改 put*/
  rescuePatientRecordModify:'/traineeRotary/rescuePatientRecord/modify/',//{id}

  /*参加抢救危重病人记录上报 post*/
  rescuePatientRecordAddSubmit:'/traineeRotary/rescuePatientRecord/addSubmit',//

  /*参加抢救危重病人记录添加 post*/
  rescuePatientRecordAdd:'/traineeRotary/rescuePatientRecord/add',//

  /*参加抢救危重病人记录列表(轮转生查看)get*/
  rescuePatientRecordPageList:'/traineeRotary/rescuePatientRecord/pageList',//

  /*参加抢救危重病人记录删除 delete*/
  rescuePatientRecordDelete:'/traineeRotary/rescuePatientRecord/delete/',//{ids}

  /*参加抢救危重病人记录上报 put*/
  rescuePatientRecordModifySubmit:'/traineeRotary/rescuePatientRecord/modifySubmit',//{ids}

  /**
   * 管床记录
   * */

  /*管床记录查看 get*/
  tubeBedRecordingGet:'/traineeRotary/tubeBedRecording/get/',//{id}



  /*管床记录列表(轮转生查看) get*/
  tubeBedRecordingPageList:'/traineeRotary/tubeBedRecording/pageList',

  /*管床记录删除 delete*/
  tubeBedRecordingDelete:'/traineeRotary/tubeBedRecording/delete', //{ids}

  /*管床记录上报 put*/
  tubeBedRecordingModifySubmit:'/traineeRotary/tubeBedRecording/modifySubmit', //{ids}

  /*管床记录修改 put*/
  tubeBedRecordingModify:'/traineeRotary/tubeBedRecording/modify/', //{id}

  /*管床记录添加上报 post*/
  tubeBedRecordingAddSubmit:'/traineeRotary/tubeBedRecording/addSubmit', //{id}

  /*管床记录添加 post*/
  tubeBedRecordingAdd:'/traineeRotary/tubeBedRecording/add', //{id}



  /**
   * 专题概述
   * */

  /*专题概述查看(轮转生本人查看) get*/
  thematicReviewGet:'/traineeRotary/thematicReview/get',

  /*专题概述修改 post*/
  thematicReviewModify:'/traineeRotary/thematicReview/modify/',//{id}

  /*专题概述上报 put*/
  thematicReviewModifySubmit:'/traineeRotary/thematicReview/modifySubmit',//{id}

  /*专题概述添加上报 post*/
  thematicReviewAddSubmit:'/traineeRotary/thematicReview/addSubmit',//{id}

  /*专题概述添加 post*/
  thematicReviewAdd:'/traineeRotary/thematicReview/add',//{id}


  /**
   * 调查报告
   * */


  /*调查报告或经验总结查看() post*/
  medicalEthicsGet:'/traineeRotary/medicalEthics/get',


  /*调查报告或经验总结修改 post*/
  medicalEthicsModify:'/traineeRotary/medicalEthics/modify/',//{id}


  /*调查报告或经验总结上报 post*/
  medicalEthicsModifySubmit:'/traineeRotary/medicalEthics/modifySubmit',//{id}

  /*调查报告或经验总结添加上报 post*/
  medicalEthicsAddSubmit:'/traineeRotary/medicalEthics/addSubmit',//{id}

  /*调查报告或经验总结添加 post*/
  medicalEthicsAdd:'/traineeRotary/medicalEthics/add',//{id}


  /**
   * 手术操作
   * */
  operationList:{  //手术操作列表(轮转生)
    path:"/surgeryOperation/pageList",
    method:"get",
  },
  operationModifySubmit:{  //手术操作修改上报 /{id}
    path:"/surgeryOperation/modifySubmit/",
    method:"put",
  },
  operationAddSubmit:{  //手术操作添加上报
    path:"/surgeryOperation/addSubmit",
    method:"post",
  },
  operationModify:{  //手术操作修改 /{id}
    path:"/surgeryOperation/modify/",
    method:"put",
  },
  operationAdd:{  //手术操作添加
    path:"/surgeryOperation/add",
    method:"post",
  },
  operationGet:{  //手术操作详情查看 /{id}
    path:"/surgeryOperation/get/",
    method:"get",
  },
  operationRemove:{  //手术操作删除 /{ids}
    path:"/surgeryOperation/remove/",
    method:"delete",
  },
  onlySubmit:{  //手术操作上报 /{id}
    path:"/surgeryOperation/submit/",
    method:"put",
  },

  /**
   * 延期出科申请
   * */
  userRotaryByUserId:{ //根据人员ID和人员类型查看轮转表(自动排班--查看轮转表)  {userType}-{userId}
    path:"/traineeRotary/arrangeRotary/userRotaryByUserId/",
    method:"get",
  },
  delayGivenList:{  //延期出科申请列表(轮转生)
    path:"/rotationProcess/delayGiven/pageList",
    method:"get",
  },
  delayGivenModifySubmit:{  //延期出科申请修改上报 /{id}
    path:"/rotationProcess/delayGiven/modifySubmit/",
    method:"put",
  },
  delayGivenAddSubmit:{  //延期出科申请添加上报
    path:"/rotationProcess/delayGiven/addSubmit",
    method:"post",
  },
  delayGivenModify:{  //延期出科申请修改 /{id}
    path:"/rotationProcess/delayGiven/modify/",
    method:"put",
  },
  delayGivenAdd:{  //延期出科申请添加
    path:"/rotationProcess/delayGiven/add",
    method:"post",
  },
  delayGivenGet:{  //延期出科申请查看 /get-{id}
    path:"/rotationProcess/delayGiven/get-",
    method:"get",
  },
  delayGivenRemove:{  //延期出科申请删除 /{ids}
    path:"/rotationProcess/delayGiven/remove/",
    method:"delete",
  },
  delayGivenSubmit:{  //延期出科申请上报 /{id}
    path:"/rotationProcess/delayGiven/submit/",
    method:"put",
  },



  /**
   * 科研日志
   * */
  scientificResearchLogExportWord:{  //导出word科研日志
    path:"/rotationProcess/scientificResearchLog/exportWord/",//{ids}
    method:"get",
  },
  scientificResearchLogGet:{  //查看科研日志
    path:"/rotationProcess/scientificResearchLog/get/",//{ids}
    method:"get",
  },
  scientificResearchLogRemove:{  //批量删除科研日志
    path:"/rotationProcess/scientificResearchLog/remove",//{ids}
    method:"delete",
  },
  scientificResearchLogSubmit:{  //上报科研日志
    path:"/rotationProcess/scientificResearchLog/submit/",//{id}
    method:"put",
  },
  scientificResearchLogModifySubmit:{  //修改上报科研日志
    path:"/rotationProcess/scientificResearchLog/modifySubmit/",//{id}
    method:"put",
  },

  scientificResearchLogModify:{  //修改科研日志
    path:"/rotationProcess/scientificResearchLog/modify/",//{id}
    method:"put",
  },
  scientificResearchLogAddSubmit:{  //科研日志添加上报
    path:"/rotationProcess/scientificResearchLog/addSubmit",//{id}
    method:"post",
  },
  scientificResearchLogAdd:{  //科研日志添加
    path:"/rotationProcess/scientificResearchLog/add",//{id}
    method:"post",
  },
  scientificResearchLogPageList:{  //科研日志分页列表-本人填写的科研日志
    path:"/rotationProcess/scientificResearchLog/pageList",//{id}
    method:"post",
  },

  /** == 经典病例*/
  classicCaseRecordGet:{  //经典病历查看
    path:"/rotationProcess/classicCaseRecord/get/",//{caseId}
    method:"get",
  },
  classicCasesModifyRelease:{  //经典病历修改上报
    path:"/rotationProcess/classicCaseRecord/classicCasesModifyRelease/",//{caseId}
    method:"put",
  },
  classicCasesModify:{  //经典病历修改
    path:"/rotationProcess/classicCaseRecord/classicCasesModify/",//{caseId}
    method:"put",
  },
  classicCaseRecordList:{  //经典病历分页列表
    path:"/rotationProcess/classicCaseRecord/pagelist",//{caseId}
    method:"get",
  },
  classicCaseExportToWord:{  //导出word经典病历
    path:"/rotationProcess/classicCaseRecord/exportToWord/",//{caseId}
    method:"get",
  },
  classicCasesRelease:{  //经典病历上报
    path:"/rotationProcess/classicCaseRecord/classicCasesRelease",//{caseId}
    method:"put",
  },
  classicCasesDelete:{  //经典病历删除
    path:"/rotationProcess/classicCaseRecord/classicCasesDelete",//{caseId}
    method:"delete",
  },
  classicCaseAdd:{  //经典病历添加
    path:"/rotationProcess/classicCaseRecord/classicCaseAdd/",//{caseId}
    method:"delete",
  },

}
