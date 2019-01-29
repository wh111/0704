const todoTypes = {
  /*DEPEXAMINATION_SELF_PUSH_MODEL: "出科鉴定", //finished  学员添加个人小结需要老师审核 success src/components/rotateManagement/rotateRecordAudit/manageClassicCase/manageClassicCase_audit.vue
  DEPEXAMINATION_PUSH_MODEL: "出科鉴定",   //finished  提醒学员填写出科鉴定 success
  DEPEXAMINATION_TEACHCER_PUSH_MODEL: "出科鉴定",//finished  老师审核完 需要科室主任审核success
  // BIG_DEPEXAMINATION_DEP_PUSH_MODEL: "科室主任大出科鉴定",

  DAILY_OCCUPATIONALEXPOSURE: "职业暴露审核", // 0
  DAILY_OCCUPATIONALEXPOSURE_REIMBURSEMENT: "职业暴露报销审核", // 0
  DAILY_OCCUPATIONALEXPOSURE_REPORT: "职业暴露体检报告审核", // 0

  SURGERY_OPERATION_PUSH_MODEL: "手术操作", // 0
  OUTSTUDY_PUSH_APPLY_MODEL: "外出进修申请", // 0  discard
  OUTSTUDY_PUSH_REPORT_MODEL: "外出进修汇报", // 0 discard
  ROTARY_CLASSIC_BIGCASES_PUSH_MODEL: "经典病例", //finished 0   请求不到数据

  TEACHACTIVITY_PUSH_MODEL: "教学活动",  //
  CONFERENCE_PUSH_MODEL: "学术会议",
  LEAVE_PUSH_MODEL: "请假",             //finished    src/components/daily/dailyManagement/leaveManagement/leaveManagement_audit.vue
  ROTARYBIGCASES_PUSH_MODEL: "大病历",  //finished
  CLOCK_REMIND: "考勤",

  REWARD: "奖惩记录",  //finished   src/components/daily/dailyManagement/practiceRecords/practiceRecords_audit.vue
  RESERVE: "预约",    //finished    src/components/cstc/bespeakAudit/bespeakAudit_add.vue
  TRAINING: "培养计划", // 0
  GRADUATION: "毕业", // 0
  DEFENSE_APPLICATION: "答辩申请", // 0
  OPEN_TOPI_APPLICATION: "开题申请", // 0
  BURSARY: "奖学金", //finished 0   src/components/daily/dailyManagement/highestQuality/scholarship/scholarship_audit.vue
  APPRAISING_SELLONESELF: "评优自荐", //finished 0   src/components/daily/dailyManagement/highestQuality/recommend/recommend_audit.vue
  ROTARY_SURVEYEMPIRICAL_MODEL: "调查报告", //finished 0  src/components/rotateManagement/rotateRecordAudit/surveyReportAudit/surveyReportAudit_audit.vue
  ROTARY_SCIENTIFIC_RESEARCH_MODEL: "科研日志", //finished 0   src/components/rotateManagement/rotateRecordAudit/scientificResearchLogAudit/scientificResearchLogAudit_audit.vue
  ROTARY_GRADUATION_APPRSISE_MODEL: "结业鉴定", // 0
  ROTARY_BIGDEP_EXAM_MODEL: "阶段考核", //finished 0   src/components/rotateManagement/rotateRecordAudit/givenAuditOfLarge/givenAuditOfLarge_rotary.vue
  DISEASERECORD_PUSH_MODEL: "病种审核", // 0
  ROTARY_THEMATIC_REVIEW_MODEL: "专题概述", // 0
  SKILLRECORD_PUSH_MODEL: "技能操作",//

  OPEN_TOPIC_REPORT: '开题报告',//开题报告
  OPEN_TOPIC_APPLICATION: '开题申请',//
  BIG_DEPEXAMINATION_DEP_PUSH_MODEL: '科室主任大出科鉴定',//finished  科室主任大出科鉴定推送类型
  DISEASE_RECORD_PUSHTOUSER_MODEL: '病种审核',//病种审核消息推送至申请人类型  src/components/rotateManagement/rotateRecordAudit/entityAudit/entityWrite_audit.vue
  SKILLRECORD_PUSHTOUSER_MODEL: '技能审核',//finished  技能审核消息推送至申请人类型  src/components/rotateManagement/rotateRecordAudit/skillAudit/skillAudit_audit.vue
  BIG_CASE_PUSHTOUSER_MODEL: '大病历审核',//finished 大病历审核消息推送至申请人类型   src/components/rotateManagement/rotateRecordAudit/largeCaseAudit/largeCaseWrite_audit.vue
  PATIENT_RECORD_PUSHTOUSER_MODEL: '抢救记录审核',//finished  抢救记录审核消息推送至申请人类型  src/components/rotateManagement/rotateRecordAudit/saveRecordAudit/saveRecordAudit_audit.vue
  THEMATIC_REVIEW_PUSHTOUSER_MODEL: '专题综述记录审核',//finished 专题综述记录审核消息推送至申请人类型  src/components/rotateManagement/rotateRecordAudit/monographReviewAudit/monographReviewAudit_audit.vue
  MEDICAL_ETHICS_PUSHTOUSER_MODEL: '调查报告记录审核',//调查报告记录审核消息推送至申请人类型  src/components/rotateManagement/rotateRecordAudit/surveyReportAudit/surveyReportAudit_audit.vue
  // SCIENTIFIC_RESEARCH_PUSHTOUSER_MODEL("SCIENTIFIC_RESEARCH_PUSHTOUSER_MODEL"),//科研日志记录审核消息推送至申请人类型
  ROTARY_SSCZ_PUSHTOUSER_MODEL: "手术操作记录审核",//finished  手术操作记录审核类型消息推送至申请人类型  src/components/rotateManagement/rotateRecordAudit/operationAudit/operationAudit_audit.vue
  DELAY_GIVEN_PUSHTOUSER_MODEL: '延期出科申请审核',//finished 延期出科申请审核类型消息推送至申请人类型,  src/components/rotateManagement/rotateRecordAudit/extensionRequestAudit/extensionRequestAudit_audit.vue
  PERSONAL_APPRAISAL_PUSHTOUSER_MODEL: '结业申请审核',//finished 结业申请审核类型消息推送至申请人类型  src/components/rotateManagement/rotateRecordAudit/graduationAppraisal/graduationAppraisal_add.vue
  DEP_COMMENT_PUSHTOUSER_MODEL: '出科申请审核',//出科申请审核消息推送至申请人类型
  BIG_DEP_COMMENT_PUSHTOUSER_MODEL: '阶段考核申请审核',//阶段考核申请审核消息推送至申请人类型
  ROTARY_CLINICALRECORD_PUSH_MODEL: '临床操作',//临床操作推送类型
  ROTARY_TUBEBED_RECORD_PUSH_MODEL: '管床记录',//管床记录推送类型
  ROTARY_RESCUE_PATIENT_RECORD_PUSH_MODEL: '参加抢救危重病人记录',//参加抢救危重病人记录推送类型
  OUTSTUDY_PUSH_MODEL: '外出进修',//外出进修*/

  //答辩申请 DEFENSE_APPLICATION    defenseApplicationDo  defenseApplicationView
  DEFENSE_APPLICATION: "答辩申请",

  //开题报告 OPEN_TOPI_REPORT   openTopiReportDo  openTopiReportView
  OPEN_TOPI_REPORT: "开题报告",

  //开题申请 OPEN_TOPI_APPLICATION  openTopiApplicationDo  openTopiApplicationView
  OPEN_TOPI_APPLICATION: "开题申请",

  //奖学金 BURSARY   bursaryDo  bursaryView
  BURSARY: "奖学金",

  //评优自荐 APPRAISING_SELLONESELF    appraisingSelloneselfDo  appraisingSelloneselfView
  APPRAISING_SELLONESELF: "评优自荐",

  //出科鉴定学生推送类型	DEPEXAMINATION_SELF_PUSH_MODEL    depexaminationSelfPushModelDo  depexaminationSelfPushModelView
  DEPEXAMINATION_SELF_PUSH_MODEL: "出科鉴定",

  //出科鉴定推送类型	 DEPEXAMINATION_PUSH_MODEL        depexaminationPushModelDo   depexaminationPushModelView
  DEPEXAMINATION_PUSH_MODEL: "出科鉴定",

  //出科鉴定老师推送类型	DEPEXAMINATION_TEACHCER_PUSH_MODEL   depexaminationTeachcerPushModelDo   depexaminationTeachcerPushModelView
  DEPEXAMINATION_TEACHCER_PUSH_MODEL: "出科鉴定",

  //奖惩记录 REWARD   rewardDo   rewardView
  REWARD: "奖惩记录",

  //预约代办事宜	RESERVE  reserveDo   reserveView
  RESERVE: "预约",

  //培养计划	TRAINING   trainingDo    trainingView
  TRAINING: "培养计划",

  //毕业	GRADUATION     graduationDo    graduationView
  GRADUATION: "毕业",

  //科室主任大出科鉴定推送类型	BIG_DEPEXAMINATION_DEP_PUSH_MODEL    bigDepexaminationDepPushModelDo  bigDepexaminationDepPushModelView
  BIG_DEPEXAMINATION_DEP_PUSH_MODEL: "科室主任大出科鉴定",

  //病种推送类型	DISEASERECORD_PUSH_MODEL    diseaserecordPushModelDo   diseaserecordPushModelView
  DISEASERECORD_PUSH_MODEL: "病种审核",

  //技能推送类型	SKILLRECORD_PUSH_MODEL    skillrecordPushModelDo    skillrecordPushModelView
  SKILLRECORD_PUSH_MODEL: "技能操作",

  //病种审核消息推送至申请人类型	DISEASE_RECORD_PUSHTOUSER_MODEL   diseaseRecordPushtouserModelDo   diseaseRecordPushtouserModelView
  DISEASE_RECORD_PUSHTOUSER_MODEL: "病种审核",

  //技能审核消息推送至申请人类型 	SKILLRECORD_PUSHTOUSER_MODEL    skillrecordPushtouserModelDo   skillrecordPushtouserModelView
  SKILLRECORD_PUSHTOUSER_MODEL: "技能审核",

  //大病历审核消息推送至申请人类型	BIG_CASE_PUSHTOUSER_MODEL    bigCasePushtouserModelDo    bigCasePushtouserModelView
  BIG_CASE_PUSHTOUSER_MODEL: "大病历审核",

  //抢救记录审核消息推送至申请人类型	PATIENT_RECORD_PUSHTOUSER_MODEL   patientRecordPushtouserModelDo   patientRecordPushtouserModelView
  PATIENT_RECORD_PUSHTOUSER_MODEL: "抢救记录审核",

  //专题综述记录审核消息推送至申请人类型	THEMATIC_REVIEW_PUSHTOUSER_MODEL   thematicReviewPushtouserModelDo   thematicReviewPushtouserModelView
  THEMATIC_REVIEW_PUSHTOUSER_MODEL: "专题综述记录审核",

  //调查报告记录审核消息推送至申请人类型	MEDICAL_ETHICS_PUSHTOUSER_MODEL   medicalEthicsPushtouserModelDo    medicalEthicsPushtouserModelView
  MEDICAL_ETHICS_PUSHTOUSER_MODEL: "调查报告记录审核",

  //科研日志记录审核消息推送至申请人类型	SCIENTIFIC_RESEARCH_PUSHTOUSER_MODEL   scientificResearchPushtouserModelDo   scientificResearchPushtouserModelView
  SCIENTIFIC_RESEARCH_PUSHTOUSER_MODEL: "科研日志记录审",

  //手术操作记录审核类型消息推送至申请人类型	ROTARY_SSCZ_PUSHTOUSER_MODEL   rotarySsczPushtouserModelDo   rotarySsczPushtouserModelView
  ROTARY_SSCZ_PUSHTOUSER_MODEL: "手术操作记录审核",

  //延期出科申请审核类型消息推送至申请人类型	DELAY_GIVEN_PUSHTOUSER_MODEL   delayGivenPushtouserModelDo   delayGivenPushtouserModelView
  DELAY_GIVEN_PUSHTOUSER_MODEL: "延期出科申请审核",

  //结业申请审核类型消息推送至申请人类型	PERSONAL_APPRAISAL_PUSHTOUSER_MODEL   personalAppraisalPushtouserModelDo   personalAppraisalPushtouserModelView
  PERSONAL_APPRAISAL_PUSHTOUSER_MODEL: "结业申请审核",

  //出科申请审核消息推送至申请人类型	DEP_COMMENT_PUSHTOUSER_MODEL   depCommentPushtouserModelDo   depCommentPushtouserModelView
  DEP_COMMENT_PUSHTOUSER_MODEL: "",

  //阶段考核申请审核消息推送至申请人类型	BIG_DEP_COMMENT_PUSHTOUSER_MODEL    bigDepCommentPushtouserModelDo   bigDepCommentPushtouserModelView
  BIG_DEP_COMMENT_PUSHTOUSER_MODEL: "阶段考核申请审核",

  //手术操作推送类型	SURGERY_OPERATION_PUSH_MODEL    surgeryOperationPushModelDo   surgeryOperationPushModelView
  SURGERY_OPERATION_PUSH_MODEL: "手术操作",

  //临床操作推送类型	ROTARY_CLINICALRECORD_PUSH_MODEL    rotaryClinicalrecordPushModelDo   rotaryClinicalrecordPushModelView
  ROTARY_CLINICALRECORD_PUSH_MODEL: "临床操作",

  //管床记录推送类型	ROTARY_TUBEBED_RECORD_PUSH_MODEL    rotaryTubebedRecordPushModelDo   rotaryTubebedRecordPushModelView
  ROTARY_TUBEBED_RECORD_PUSH_MODEL: "管床记录",

  //参加抢救危重病人记录推送类型 	ROTARY_RESCUE_PATIENT_RECORD_PUSH_MODEL    rotaryRescuePatientRecordPushModelDo    rotaryRescuePatientRecordPushModelView
  ROTARY_RESCUE_PATIENT_RECORD_PUSH_MODEL: "参加抢救危重病人记录",

  //教学活动推送类型	TEACHACTIVITY_PUSH_MODEL   teachactivityPushModelDo   teachactivityPushModelView
  TEACHACTIVITY_PUSH_MODEL: "教学活动",

  //请假推送类型	LEAVE_PUSH_MODEL    leavePushModelDo  leavePushModelView
  LEAVE_PUSH_MODEL: "请假",

  //考情推送类型	CLOCK_REMIND    clockRemindDo   clockRemindView
  CLOCK_REMIND: "考勤",

  //学术会议	CONFERENCE_PUSH_MODEL    conferencePushModelDo   conferencePushModelView
  CONFERENCE_PUSH_MODEL: "学术会议",

  //外出进修	OUTSTUDY_PUSH_MODEL   outstudyPushModelDo   outstudyPushModelView
  OUTSTUDY_PUSH_MODEL: "外出进修",

  //外出进修申请	OUTSTUDY_PUSH_APPLY_MODEL    outstudyPushApplyModelDo    outstudyPushApplyModelView
  OUTSTUDY_PUSH_APPLY_MODEL: "外出进修申请",

  //外出进修汇报	OUTSTUDY_PUSH_REPORT_MODEL    outstudyPushReportModelDo   outstudyPushReportModelView
  OUTSTUDY_PUSH_REPORT_MODEL: "外出进修汇报",

  //专题概述推送类型	 ROTARY_THEMATIC_REVIEW_MODEL    rotaryThematicReviewModelDo   rotaryThematicReviewModelView
  ROTARY_THEMATIC_REVIEW_MODEL: "专题概述",

  //阶段考核申请个人小结类型	ROTARY_BIGDEP_EXAM_MODEL    rotaryBigdepExamModelDo   rotaryBigdepExamModelView
  ROTARY_BIGDEP_EXAM_MODEL: "阶段考核",

  //结业鉴定个人小结推送类型	ROTARY_GRADUATION_APPRSISE_MODEL    rotaryGraduationApprsiseModelDo   rotaryGraduationApprsiseModelView
  ROTARY_GRADUATION_APPRSISE_MODEL: "结业鉴定",

  //科研日志推送类型	 ROTARY_SCIENTIFIC_RESEARCH_MODEL    rotaryScientificResearchModelDo   rotaryScientificResearchModelView
  ROTARY_SCIENTIFIC_RESEARCH_MODEL: "科研日志",

  //调查报告推送类型 	ROTARY_SURVEYEMPIRICAL_MODEL    rotarySurveyempiricalModelDo   rotarySurveyempiricalModelView
  ROTARY_SURVEYEMPIRICAL_MODEL: "调查报告",

  //大病历推送类型	 ROTARYBIGCASES_PUSH_MODEL    rotarybigcasesPushModelDo   rotarybigcasesPushModelView
  ROTARYBIGCASES_PUSH_MODEL: "大病历",

  //经典病历推送类型	 ROTARY_CLASSIC_BIGCASES_PUSH_MODEL    rotaryClassicBigcasesPushModelDo   rotaryClassicBigcasesPushModelView
  ROTARY_CLASSIC_BIGCASES_PUSH_MODEL: "经典病例",

  //职业暴露 DAILY_OCCUPATIONALEXPOSURE   dailyOccupationalexposureDo   dailyOccupationalexposureView
  DAILY_OCCUPATIONALEXPOSURE: "职业暴露",
  // dailyOccupationalexposureReimbursementDo dailyOccupationalexposureReimbursementView
  DAILY_OCCUPATIONALEXPOSURE_REIMBURSEMENT: "职业暴露报销审核",
  // dailyOccupationalexposureReportDo dailyOccupationalexposureReportView
  DAILY_OCCUPATIONALEXPOSURE_REPORT: "职业暴露体检报告审核",

  OPENTOPIC: "研究生开题通知"
};

export default todoTypes;
