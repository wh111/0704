import _ from 'lodash';
import baseRules from '../../formRules/base'; // 公共规则
//表单验证
let form ={
  schoolName:baseRules.illegalChar(),
  specialty:baseRules.illegalChar(),

};
/**
 * 本科生 - 课程管理 - 课程安排
 */
let setSyllabus = {
  courseTeachingResearchRoomThird: [{
    required: true,
    message: '此项不能为空'
  }], // 收费标准 - 必须为数字
};
/**
 * 本科生 - 三级科室管理 -
 */
let depSyllabusManagement = {
  courseContent: baseRules.requiredNoEvent,
  teachUserNames: baseRules.requiredNoEvent,
  courseMethod: baseRules.requiredNoEvent,
};
/**
 * 本科生 - 课程审核
 */
let courseExamineApprove = {
  courseContent: baseRules.requiredNoEvent,
  courseType: baseRules.requiredNoEvent,
  teachUserNames: baseRules.requiredNoEvent,
};

/**
 * 实习生 - 报名招录 - 人员管理
 */
let usersManagement = {
  name: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50)],
  codeNumber: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50)],
  mobile: [baseRules.requiredNoEvent, baseRules.mobile],
  internshipNum: [baseRules.requiredNoEvent, baseRules.numberSection(0, 100)],
  startDate: baseRules.isDate,
};

/**
 * 实习生 - 报名招录 - 报名审核
 */
let internAudit = {
  // chargeStandard: baseRules.numberMust, // 收费标准 - 必须为数字
  // sxBeginTime: baseRules.isDate, // 实习开始时间 - 必须为日期时间
  // sxEndTime: baseRules.isDate, // 实习结束时间 - 必须为日期时间
  // zsCost:[baseRules.requiredNoEvent,baseRules.greaterThanZero2,],
  // deposit:[baseRules.requiredNoEvent,baseRules.greaterThanZero2,],
};
/**
 * 缴费登记
 */
let paymentRegistration = {
  invoiceNo: [baseRules.required, baseRules.numberMust,baseRules.inputLen(0, 20)], //发票号
};

/**
 * 收费标准
 */
let chargingStandard = {
  configValue: [baseRules.numberMust,baseRules.inputLen(0, 6)], // 实习费 - 必填\数字
};

/**
 * 出科设置
 */
let givenSet = {
  configValue: [baseRules.required, baseRules.numberMust,baseRules.inputLen(0, 6)], // 实习费 - 必填\数字
};

/**
 * 科室要求
 */
let reqDepVal = {
  name: [baseRules.required],
  "depId": baseRules.required,
  "disType": baseRules.required,
  "disTitle": baseRules.required,
  "disNum": baseRules.numberMust,
  "specialty": [baseRules.required],
  'ts': [baseRules.numberMust, baseRules.notZero],
  "deMasterDegree": baseRules.required,
};

/**
 * 手工调整
 */
let handWork = {
  "depId": [baseRules.required],
  'ts': [baseRules.numberMust, baseRules.notZero],
};

/**
 * 暂停轮转,恢复轮转
 */
let pauseRotate = {
  pauseTime: [{
    required: true,
    message: '此项不能为空'
  }],
  restoreTime: [{
    required: true,
    message: '此项不能为空'
  }],
  stopMess: [baseRules.required],

  terminationOfTime: [baseRules.requiredNoEvent],
  terminationOfMess: [baseRules.requiredNoEvent],
};

/**
 * 大纲添加
 */
let internOutline = {
  'ts': [baseRules.numberMust, baseRules.notZero],
  "greatName": [{
    required: true,
    message: '此项不能为空'
  }],
  "rotaryUserNum": baseRules.greaterThanZero,
};
/**
 * 课程大纲
 */
let curriculumOutline = {
  'courseTime': [baseRules.numberMust, baseRules.notZero],
  'courseType': [baseRules.requiredNoEvent],
  'depId': [baseRules.requiredNoEvent],
  'courseName': [baseRules.requiredNoEvent],
  'outlineName': [baseRules.requiredNoEvent],
  'researchSectionId': [baseRules.requiredNoEvent],
};

//发送短信
let shortNote = {
  content:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()],  //短信内容
}


export {
  setSyllabus,
  internAudit,
  usersManagement,
  chargingStandard,
  reqDepVal,
  internOutline,
  pauseRotate,
  givenSet,
  form,
  shortNote,
  paymentRegistration,
  courseExamineApprove,
  curriculumOutline,
  depSyllabusManagement,
};
