import _ from 'lodash';
import baseRules from '../../formRules/base'; // 公共规则

/**
 * 教学活动设置
 */
let teachingActivitiesSetList = {
  activityName: [baseRules.inputLen(0, 50), baseRules.illegalChar()], //,
};
let teachingActivitiesSet = {
  activityName: [{required: true, message: '此项不能为空'}, baseRules.inputLen(0, 50), baseRules.illegalChar()], //, // 场次名称 - 必填
  hostUserName: [{required: true, message: '此项不能为空'}, baseRules.inputLen(0, 50), baseRules.illegalChar()], //, // 场次名称 - 必填
  activitySite: [{required: true, message: '此项不能为空'}, baseRules.inputLen(0, 50), baseRules.illegalChar()], //, // 场次名称 - 必填
  activityTime: [{required: true, message: '此项不能为空'}], //, // 场次名称 - 必填
  depId: [{required: true, message: '此项不能为空'}], //, // 场次名称 - 必填
  planDetailId: [{required: true, message: '此项不能为空'}], //, // 场次名称 - 必填
  activityPlan: [{required: true, message: '此项不能为空'}], //, // 场次名称 - 必填
  activityType: [{required: true, message: '此项不能为空'}], //, // 场次名称 - 必填
  participantSubject: [{required: true, message: '此项不能为空'}], //, // 参加主体对象 - 必填
  recordTimes: [{required: true, message: '此项不能为空'}], //, // 场次名称 - 必填
  whetherNeedCases: [{required: true, message: '此项不能为空'}, baseRules.inputLen(0, 50), baseRules.illegalChar()], //, // 场次名称 - 必填
  casesName: [{required: true, message: '此项不能为空'}, baseRules.inputLen(0, 50), baseRules.illegalChar()], //, // 场次名称 - 必填
  activityContent: [baseRules.inputLen(0, 500)],
}
/**
 * 教学经历
 */
let teachingExperienceList = {
  activityName: [baseRules.inputLen(0, 50), baseRules.illegalChar()], //, // 场次名称 - 必填
}
/**
 * 我的活动
 */
let myActivities = {
  activityTips: [{required: true, message: '此项不能为空'}, baseRules.inputLen(0, 500), baseRules.illegalChar()], //, // 场次名称 - 必填
}

//
/**
 * 教学计划
 */
let teachplanAdd = {
  activityPlanYear: [{required: true, message: '此项不能为空'}], //, // 场次名称 - 必填
  activityPlanMonth: [{required: true, message: '此项不能为空'}], //, // 场次名称 - 必填
  activityPlanDep: [{required: true, message: '此项不能为空'}], //, // 场次名称 - 必填
}
let teachplanAddsuborEdit = {
  planActivityTitle: [{required: true, message: '此项不能为空'}, baseRules.inputLen(0, 50), baseRules.illegalChar()], //, //活动名称
  planActivityType: [{required: true, message: '此项不能为空'}], //, // 活动类型
  planActivityHostUserName: [{required: true, message: '此项不能为空'}], //, /主持人姓名
  // planActivityTime: [{required: true, message: '此项不能为空'}], //, /活动时间
  planActivityTimeids: [{required: true, message: '此项不能为空'}], //, /活动时间段iD
  planActivitySite: [{required: true, message: '此项不能为空'}, baseRules.inputLen(0, 50), baseRules.illegalChar()], //, /活动地点
  planActivityContent: [{required: true, message: '此项不能为空'}, baseRules.inputLen(0, 50), baseRules.illegalChar()], //, 活动内容
}
/**
 * 教学评价管理
 */
let evaluationManagementType = {
  name: [baseRules.requiredNoEvent, baseRules.inputLen(0, 50), baseRules.illegalChar()], //,
};
let evaluationManagementList = {
  name: [baseRules.inputLen(0, 50), baseRules.illegalChar()], //,
  appraiser: [baseRules.inputLen(0, 50), baseRules.illegalChar()], //,
  evaluated: [baseRules.inputLen(0, 50), baseRules.illegalChar()], //,
};
let evaluationManagementAdd = {
  name: [baseRules.requiredNoEvent, baseRules.inputLen(0, 50), baseRules.illegalChar()], //,
  remark: [baseRules.inputLen(0, 500), baseRules.illegalChar()], //,
  label: [baseRules.requiredNoEvent, baseRules.inputLen(0, 50), baseRules.illegalChar()], //,
};
let evaluationManagementAddList = {
  remark: [baseRules.inputLen(0, 200), baseRules.illegalChar()], //,
  parentTitle: [baseRules.requiredNoEvent, baseRules.inputLen(0, 200), baseRules.illegalChar()], //,
  titleSub: [baseRules.requiredNoEvent, baseRules.inputLen(0, 200), baseRules.illegalChar()], //,
  // score:[baseRules.requiredNoEvent,baseRules.float,baseRules.inputLen(0,50),baseRules.illegalChar()], //,
};

/**
 * 教学活动设置
 */
//第一步  基础信息
let evaluationActivitySetBaseInfo = {
  name: [baseRules.requiredNoEvent, baseRules.inputLen(0, 50), baseRules.illegalChar()], //,
  type: [baseRules.requiredNoEvent, baseRules.inputLen(0, 50), baseRules.illegalChar()], //,
  tempName: [baseRules.requiredNoEvent, baseRules.inputLen(0, 50), baseRules.illegalChar()], //,
  remark: [baseRules.inputLen(0, 500), baseRules.illegalChar()], //,

}

function week(rule, value, callback) {
  //检验位的检测
  if (/[^1-7?]/m.test(value)) {
    callback(new Error('该项必须是1-7的数字'));
  }
  if (value > 7 || value < 1) {
    callback(new Error('该项必须是1-7的数字'));
  }
  callback();
}

function month(rule, value, callback) {
  //检验位的检测
  if (/[^0-9?]/m.test(value)) {
    callback(new Error('该项必须是数字'));
  }
  if (value > 31 || value < 1) {
    callback(new Error('该项必须是1-31的数字'));
  }
  callback();
}

function float(rule, value, callback) {
  //检验位的检测
  if (value == '') callback();
  if (!/^\+?[0-9]\d*$/.test(value)) {
    callback(new Error('必须正整数且大于等于零'));
  }
  callback();
}

//第四步  时间
let evaluationActivitySetDate = {
  startDay: [baseRules.requiredNoEvent, baseRules.float, baseRules.inputLen(0, 2), baseRules.illegalChar()], //,
  endDay: [baseRules.requiredNoEvent, baseRules.float, baseRules.inputLen(0, 2), baseRules.illegalChar()], //,
  startWeek: [baseRules.requiredNoEvent, week, baseRules.inputLen(0, 1), baseRules.illegalChar()], //,
  endWeek: [baseRules.requiredNoEvent, week, baseRules.inputLen(0, 1), baseRules.illegalChar()], //,
  startMonth: [baseRules.requiredNoEvent, month, baseRules.inputLen(0, 2), baseRules.illegalChar()], //,
  endMonth: [baseRules.requiredNoEvent, month, baseRules.inputLen(0, 2), baseRules.illegalChar()], //,
  startDate: [baseRules.requiredNoEvent], //,
  endDate: [baseRules.requiredNoEvent], //,

}

/**
 * 统计分析
 */
let singleTableAnalysisList = {
  title: [baseRules.inputLen(0, 50), baseRules.illegalChar()], //,
  name: [baseRules.inputLen(0, 50), baseRules.illegalChar()], //,
  evaluatedName: [baseRules.inputLen(0, 50), baseRules.illegalChar()], //,
};

/**
 * 必须正整数字且>0
 */
function greaterThanZero1(rule, value, callback) {
  //检验位的检测
  if (value == '' || value == null) callback();
  if (!/^\+?[1-9]\d*$/.test(value)) {
    callback(new Error('1-100之间的数字'));
  }
  if (value > 100) {
    callback(new Error('1-100之间的数字'));
  }
  callback();
}

//综合统计
let synthesizeStatistics = {
  title: [baseRules.requiredNoEvent, baseRules.inputLen(0, 50), baseRules.illegalChar()],
  activityId: [baseRules.requiredNoEvent],  //活动id必填
  weight: [baseRules.requiredNoEvent, greaterThanZero1, baseRules.inputLen(0, 3)],  //权重

}

/**
 * 我的评价
 */
let myEvaluation = {
  gold: [baseRules.requiredNoEvent, baseRules.greaterThanZero3(0, 100), baseRules.inputLen(0, 3), baseRules.illegalChar()]
}

// 劳务费管理
let laborManagement = {
  userName: baseRules.requiredNoEvent,
  cardNo: baseRules.notChinese,
  jbrName: baseRules.requiredNoEvent,
  money: [baseRules.requiredNoEvent, baseRules.floatTwo],
}

// 劳务费管理修改支付时间
let laborManagementPayTime = {
  payTime: baseRules.requiredNoEvent,
}

// 师资管理树
let teachersManagementTree = {
  name: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50)],
};
// 师资管理树审核
let teachersManagementAudit = {
  reason: [baseRules.inputLen(0, 50), baseRules.illegalChar()],
};

export default {
  teachingActivitiesSetList,
  teachingActivitiesSet,
  teachingExperienceList,
  myActivities,
  teachplanAdd,
  teachplanAddsuborEdit
};

export {
  evaluationManagementType,
  evaluationManagementList,
  evaluationManagementAdd,
  evaluationManagementAddList,
  singleTableAnalysisList,

  evaluationActivitySetBaseInfo,
  evaluationActivitySetDate,

  synthesizeStatistics,

  myEvaluation,

  laborManagement,
  laborManagementPayTime,
  teachersManagementTree,
  teachersManagementAudit
};
