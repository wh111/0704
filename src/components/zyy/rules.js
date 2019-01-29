import _ from 'lodash';
import baseRules from '../../formRules/base'; // 公共规则

/*
 * 实习生 - 报名招录 - 报名审核
 */
let internAudit = {
  chargeStandard: baseRules.numberMust, // 收费标准 - 必须为数字
  sxBeginTime: baseRules.isDate, // 实习开始时间 - 必须为日期时间
  sxEndTime: baseRules.isDate, // 实习结束时间 - 必须为日期时间
};
//表单验证
let form ={
  schoolName:baseRules.illegalChar(),
  specialty:baseRules.illegalChar(),

};

/**
 * 收费标准
 */
let chargingStandard = {
  configValue: [baseRules.required, baseRules.numberMust], // 实习费 - 必填\数字
};

/**
 * 出科设置
 */
let givenSet = {
  configValue: [baseRules.required, baseRules.numberMust,baseRules.inputLen(0, 3)], // 实习费 - 必填\数字
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
  specialty: [baseRules.required],
  'ts': [baseRules.requiredNoEvent, baseRules.float(), baseRules.notZero, multiple2, baseRules.inputLen(0, 20), baseRules.illegalChar()]
};

/**
 * 手工调整
 */
let handWork = {
  "depId": [baseRules.required],
  'ts': [baseRules.numberMust, baseRules.notZero,],
};

/**
 * 暂停轮转,恢复轮转
 */
let pauseRotate = {
  pauseTime:[{ required: true, message: '此项不能为空'}],
  restoreTime:[{ required: true, message: '此项不能为空'}],
  stopMess:[baseRules.required],
};

/**
 * 大纲添加
 */
let internOutline = {
  "ts": [{
    required: true,
    message: '此项不能为空'
  }, baseRules.notZero,],
  "greatName": [{
    required: true,
    message: '此项不能为空'
  }],
};


function multiple2(rule, value, callback) {
  //检验位的检测
  let val = (value / 0.5) + '';
  if (val != val || /\./g.test(val)) {
    callback(new Error('该项必须是0.5的倍数'));
  }else {
    callback();
  }
}

/**
 * 细则
 */
let rdyTrainingStandardsFirst = {
  "rtName": [baseRules.requiredNoEvent, baseRules.inputLen(0, 50), baseRules.illegalChar()],
  "jdName": [baseRules.requiredNoEvent],
  "rtProclass": [baseRules.requiredNoEvent],//培训方向
  "rtIntroduce": [baseRules.inputLen(0, 500), baseRules.illegalChar()],
  "rtTarget": [baseRules.inputLen(0, 500), baseRules.illegalChar()],
  "rtMethod": [baseRules.inputLen(0, 2000), baseRules.illegalChar()],
  "rtAdmrank": [baseRules.inputLen(0, 500), baseRules.illegalChar()],
  'ts': [baseRules.requiredNoEvent, baseRules.notZero, baseRules.float(), multiple2, baseRules.inputLen(0, 20), baseRules.illegalChar()],
  "optionalNum": [baseRules.requiredNoEvent, baseRules.numbers, baseRules.inputLen(0, 20), baseRules.illegalChar()],
};

let rdyTrainingStandardsSecond = {
  "depsetPurpose": [baseRules.requiredNoEvent, baseRules.inputLen(0, 500), baseRules.illegalChar()],
  "deName": [baseRules.requiredNoEvent, baseRules.inputLen(0, 50), baseRules.illegalChar()],
  "optionalNum": [baseRules.requiredNoEvent, baseRules.numbers, baseRules.inputLen(0, 20), baseRules.illegalChar()],
  "deDetype": [baseRules.requiredNoEvent],
  "deShowtype": [baseRules.requiredNoEvent],
  "deMasterDegree": [baseRules.requiredNoEvent],
  "deCountBasic": [baseRules.requiredNoEvent, baseRules.numbers, baseRules.inputLen(0, 20), baseRules.illegalChar()],
  "deCountBasicSecond": [baseRules.requiredNoEvent, baseRules.numbers, baseRules.inputLen(0, 20), baseRules.illegalChar()],
  "deCountBasicFirst": [baseRules.requiredNoEvent, baseRules.numbers, baseRules.inputLen(0, 20), baseRules.illegalChar()],
};

/**/


/**
 * 住院医管理
 */
let rdyPersonnelManagement = {
  rotaryProclass: baseRules.requiredNoEvent,
  rotaryYear: baseRules.requiredNoEvent,
  rotaryAdmrank: baseRules.requiredNoEvent,
  rotaryZyytype: baseRules.requiredNoEvent,
};

/**
 * 对照表
 */
let rdyDepContrast = {
  "radomNum": baseRules.numbers,
  'ts': [baseRules.requiredNoEvent, baseRules.float(), multiple2, baseRules.inputLen(0, 20), baseRules.illegalChar()],
};

/**
 * 安排轮转-带教秘书
 */
let rdyRotation = {
  "randomNum": baseRules.numbers,
  'ts': [baseRules.requiredNoEvent, baseRules.notZero, baseRules.float(), multiple2, baseRules.inputLen(0, 20), baseRules.illegalChar()],
};

// 安排轮转 - 实习生
let rdyRotationBySXS = {
  "randomNum": baseRules.numbers,
  'ts': [baseRules.requiredNoEvent, baseRules.notZero, baseRules.number, baseRules.inputLen(0, 20)],
};
// 安排轮转 - 其他生源
let rdyRotationByOther = {
  "randomNum": baseRules.numbers,
  'ts': [baseRules.requiredNoEvent, baseRules.notZero, baseRules.float(), multiple2, baseRules.inputLen(0, 20), baseRules.illegalChar()],
};

// 住院医人员追加规则
let zyyUserInfo = {
  rotaryProclass: baseRules.requiredNoEvent, // 培训方向
  rotaryYear: baseRules.requiredNoEvent, // 参培年份
  rotaryAdmrank: baseRules.requiredNoEvent, // 培训年限
  rotaryZyytype: baseRules.requiredNoEvent, // 人员属性
};

// 住院医网上预审
let rdyOnlinePrequalification = {
  mess:[baseRules.inputLen(0,250),baseRules.illegalChar()]
};

let rdyEnrollSet_rst = {
  configValue:baseRules.requiredNoEvent,
};

let rdyEnrollSet_ret = {
  configValue:baseRules.requiredNoEvent,
};

export {
  internAudit,
  chargingStandard,
  reqDepVal,
  internOutline,
  rdyTrainingStandardsFirst,
  rdyTrainingStandardsSecond,
  rdyPersonnelManagement,
  rdyDepContrast,
  pauseRotate,
  givenSet,
  rdyRotation,
  zyyUserInfo,
  rdyRotationBySXS,
  rdyRotationByOther,
  rdyOnlinePrequalification,
  rdyEnrollSet_rst,
  rdyEnrollSet_ret,
  form
};
