import _ from 'lodash';
import baseRules from '../../../formRules/base'; // 公共规则

/**
 * 请假管理
 */
let leaveManagementList = {
  userName: [baseRules.inputLen(0, 50), baseRules.illegalChar()] // 名称 - 必填
};

let leaveManagement = {
  status: [{required: true, message: '此项为必填项'}, baseRules.inputLen(0, 50), baseRules.illegalChar()],
  content: [baseRules.inputLen(0, 500), baseRules.illegalChar()] //
};

/**
 * 我的请假
 */
let myLeaveList = {
  userName: [baseRules.inputLen(0, 50), baseRules.illegalChar()] // 名称 - 必填
};

let myLeave = {
  podId: [{required: true, message: '此项不能为空'}],//所在科室 - 必填
  depId: [{required: true, message: '此项不能为空'}], // 名称 - 必填
  beginDate: [{required: true, message: '此项不能为空'}], // 名称 - 必填
  endDate: [{required: true, message: '此项不能为空'}],// 名称 - 必填
  explains: [baseRules.inputLen(0, 200)]// 名称 - 必填
};

// 评优管理
let projectManagement = {
  title: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50)],
  roleId: [baseRules.requiredNoEvent, baseRules.selectId],
  scoreTableName: [baseRules.requiredNoEvent, baseRules.selectText],
  explains: [baseRules.inputLen(0, 250)],
  startDate: [baseRules.requiredNoEvent],
  endDate: [baseRules.requiredNoEvent]

};
// 参加评优
let projectParticipate = {
  grossIncome: [baseRules.requiredNoEvent, baseRules.greaterThanZero],
  averageIncome: [baseRules.requiredNoEvent, baseRules.greaterThanZero],
  sourceIncome: [baseRules.requiredNoEvent],
  registerType: [baseRules.requiredNoEvent],
  peopleNum: [baseRules.requiredNoEvent],
  address: [baseRules.requiredNoEvent],
  postCode: [baseRules.requiredNoEvent]
};

//投票
let organizationaVotingRditNew = {
  title: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50)],
  startDate: [baseRules.requiredNoEvent],
  endDate: [baseRules.requiredNoEvent],
  voterScope: [baseRules.requiredNoEvent],
  voteRule: [baseRules.inputLen(0, 250)],
  votePower: [baseRules.requiredNoEvent, baseRules.greaterThanZero, baseRules.inputLen(0, 5)]
  // userIds:[baseRules.requiredNoEvent],
};

/**
 * 津贴
 */
let allowanceSetting = {
  minScore: [baseRules.requiredNoEvent, baseRules.greaterThanZero2, baseRules.inputLen(0, 20)],
  maxScore: [baseRules.requiredNoEvent, baseRules.greaterThanZero2, baseRules.inputLen(0, 20)],
  master: [baseRules.requiredNoEvent, baseRules.greaterThanZero2, baseRules.inputLen(0, 20)],
  doctor: [baseRules.requiredNoEvent, baseRules.greaterThanZero2, baseRules.inputLen(0, 20)],
  amount: [baseRules.requiredNoEvent, baseRules.greaterThanZero2, baseRules.inputLen(0, 20)],
  absence: [baseRules.requiredNoEvent, baseRules.greaterThanZero2, baseRules.inputLen(0, 20)],
  leave: [baseRules.requiredNoEvent, baseRules.greaterThanZero2, baseRules.inputLen(0, 20)],
  good: [baseRules.requiredNoEvent, baseRules.greaterThanZero2, baseRules.inputLen(0, 20)],
  well: [baseRules.requiredNoEvent, baseRules.greaterThanZero2, baseRules.inputLen(0, 20)],
  bad: [baseRules.requiredNoEvent, baseRules.greaterThanZero2, baseRules.inputLen(0, 20)],
  provideAmount: [baseRules.requiredNoEvent, baseRules.greaterThanZero2, baseRules.inputLen(0, 20)]
};

/**
 * 志愿者活动
 */
let volunteerActivity = {
  volunteSubject: [baseRules.requiredNoEvent, baseRules.inputLen(0, 50)], //活动主题
  beginTime: [baseRules.requiredNoEvent],
  endTime: [baseRules.requiredNoEvent],
  place: [baseRules.requiredNoEvent, baseRules.inputLen(0, 50)],
  slogan: [baseRules.requiredNoEvent, baseRules.inputLen(0, 50)],
  aim: [baseRules.requiredNoEvent, baseRules.inputLen(0, 50)],
  substance: [baseRules.requiredNoEvent, baseRules.inputLen(0, 50)]
};
/**
 * 职业暴露
 */
let occupationalExposure = {
  depId: [baseRules.requiredNoEvent], //活动主题
  occurrenceTime: [baseRules.requiredNoEvent], //活动主题
  amountMoney: [baseRules.requiredNoEvent, baseRules.greaterThanZero2, baseRules.inputLen(0, 20)], //活动主题
  hyfileIds: [baseRules.requiredNoEvent] //活动主题
};
/**
 * 惩奖记录
 */
let practiceRecords = {
  depId: [baseRules.requiredNoEvent],
  occurrenceTime: [baseRules.requiredNoEvent],
  rewardAndPunishmentDescribe: [baseRules.requiredNoEvent, baseRules.inputLen(0, 500)],
  userName: [baseRules.requiredNoEvent],
  opinion: [baseRules.inputLen(0, 500)],
  treatmentMethod: [baseRules.inputLen(0, 500)],
  approvalOpinion: [baseRules.inputLen(0, 500)]
};

let basicManagement = { // 评优管理-基础管理
  conditionDetail: [baseRules.mustHasOneNoEvent]
};
/**
 * 获奖管理
 */
let award = { // 评优管理-基础管理
  userType: [baseRules.requiredNoEvent],
  awardDesc: [baseRules.requiredNoEvent],
  awardType: [baseRules.requiredNoEvent],
  userId: [baseRules.requiredNoEvent],
  awardInfluenceFactor: [baseRules.float1(0, 99999999999999)],
  awardLevel: [baseRules.requiredNoEvent],
  createTime: [baseRules.requiredNoEvent],
};
export default {
  leaveManagement,
  leaveManagementList,
  myLeaveList,
  myLeave
};

export {
  projectManagement,
  projectParticipate,
  organizationaVotingRditNew,
  allowanceSetting,
  volunteerActivity,
  occupationalExposure,
  practiceRecords,
  basicManagement,
  award,
};
