import _ from 'lodash';
import baseRules from '../../../formRules/base'; // 公共规则

/**
 * 研究生 - 拟录取 -
 */
let ptplanAdmitList = {
  name: [baseRules.inputLen(0, 20), baseRules.illegalChar()], // 姓名
  minScore: [baseRules.inputLen(0, 20), baseRules.float1(0, 1000)], // 最小成绩
  maxScore: [baseRules.inputLen(0, 20), baseRules.float1(0, 1000)], // 最大成绩
};
let ptplanAdmit = {
  score: [baseRules.requiredNoEvent, baseRules.greaterThanZero1, baseRules.inputLen(0, 20)], // 成绩
  ranking: [baseRules.requiredNoEvent, baseRules.greaterThanZero1, baseRules.inputLen(0, 20)], // 成绩
};

/**
 * 研究生 -组织复试-
 */
let ptOrganizationReexamineList = {
  userName: [baseRules.inputLen(0, 20), baseRules.illegalChar()], // 姓名
};
let ptOrganizationReexamine = {
//  majorCode: [baseRules.requiredNoEvent,baseRules.selectText],
  traininType: [baseRules.requiredNoEvent,baseRules.selectText],
  number: [baseRules.requiredNoEvent,baseRules.numbers],
  userIds: [baseRules.requiredNoEvent], // 人员
  require: [baseRules.requiredNoEvent, baseRules.inputLen(0, 50), baseRules.illegalChar()], // 注意事项
  address: [baseRules.requiredNoEvent, baseRules.inputLen(0, 100), baseRules.illegalChar()], // 复试地点
  time: [baseRules.requiredNoEvent, baseRules.isDate],

  receptionUserid: [baseRules.requiredNoEvent], // 复试地点
  receptionObject: [baseRules.requiredNoEvent]
  // fileIds: [baseRules.requiredNoEvent], // 复试附件
};
/**
 * 研究生 -汇总复试-
 */
let ptSummarizingReexamine = {
  userIds: [baseRules.requiredNoEvent], // 人员
  retestTime: [baseRules.requiredNoEvent], // 人员
  retestAddress: [baseRules.inputLen(0, 500), baseRules.illegalChar()], // 复试要求
  // fileIds: [baseRules.requiredNoEvent], // 复试附件
};

// 录取-短信通知
let ptAdmitSendSms = {
  time: [baseRules.requiredNoEvent, baseRules.isDate]
};

export {
  ptplanAdmitList,
  ptplanAdmit,

  ptOrganizationReexamineList,
  ptOrganizationReexamine,

  ptSummarizingReexamine,
  ptAdmitSendSms,

};
