import _ from 'lodash';
import baseRules from '../../../formRules/base'; // 公共规则

/**
 * 研究生 - 开题通知管理 -
 */
let proposalNotificationManagerList = {
  title: [baseRules.inputLen(0,20),baseRules.illegalChar()], // 技能成绩 - 必须为数字
};
let proposalNotificationManager = {
  title: [baseRules.requiredNoEvent, baseRules.inputLen(0,50),baseRules.illegalChar()], // 标题
  graduateName: [baseRules.requiredNoEvent], // 研究生
  openTime: [baseRules.requiredNoEvent], // 开题时间
  requirement: [baseRules.inputLen(0,500),baseRules.illegalChar()], // 开题要求
  notice: [baseRules.inputLen(0,500),baseRules.illegalChar()], // 开题须知
};
/**
 * 研究生 - 开题申请 -
 */
let proposalApplicationWriteList = {
  thesisTitle: [baseRules.inputLen(0,20),baseRules.illegalChar()], // 论文题目
  researchDirection: [baseRules.inputLen(0,20),baseRules.illegalChar()], // 研究方向
};
let proposalApplicationWrite = {
  researchDirection: [baseRules.requiredNoEvent, baseRules.inputLen(0,50),baseRules.illegalChar()], // 研究方向
  thesisTitle: [baseRules.requiredNoEvent, baseRules.inputLen(0,50),baseRules.illegalChar()], // 论文题目
  noticeId: [baseRules.requiredNoEvent], // 开题通知
  applicationDate: [baseRules.requiredNoEvent], // 开题通知
  attachmentId: [baseRules.requiredNoEvent], // 附件
  projectSummary:[baseRules.requiredNoEvent, baseRules.inputLen(0,200),baseRules.illegalChar()],//课题摘要
  thesnameisTitle:[baseRules.requiredNoEvent,baseRules.illegalChar()],//姓名
  name:[baseRules.requiredNoEvent,baseRules.illegalChar()],//职称
  topicName:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()],//课题名称
  professionalDirection:[baseRules.requiredNoEvent,baseRules.illegalChar()],//专业方向
  entranceDate:[baseRules.requiredNoEvent,baseRules.illegalChar()],//入学时间
  reportDate:[baseRules.requiredNoEvent,baseRules.illegalChar()],//开题报告日期
  tutorName:[baseRules.requiredNoEvent,baseRules.illegalChar()],//导师姓名
  attendance:[baseRules.requiredNoEvent,baseRules.illegalChar(),baseRules.numbers],//出席人数
  moderator:[baseRules.requiredNoEvent,baseRules.illegalChar()],//主持人
  recorder:[baseRules.requiredNoEvent,baseRules.illegalChar()],//记录员
  positionalTitle:[baseRules.requiredNoEvent,baseRules.illegalChar()],//职称
  modifyDescribe: [baseRules.requiredNoEvent, baseRules.inputLen(0,500),baseRules.illegalChar()], // 更改开题原因描述
  againDescribe: [baseRules.requiredNoEvent, baseRules.inputLen(0,500),baseRules.illegalChar()], // 再次开题原因描述
  place: [baseRules.requiredNoEvent, baseRules.inputLen(0,50),baseRules.illegalChar()], // 再次开题原因描述
  groupMembers: [baseRules.requiredNoEvent, baseRules.inputLen(0,50),baseRules.illegalChar()], // 成员
};
/**
 * 研究生 - 开题审核 -
 */
let proposalApplicationAuditList = {
  name: [baseRules.inputLen(0,20),baseRules.illegalChar()], // 姓名
};
let proposalApplicationAudit = {
  auditOpinion: [baseRules.inputLen(0,500),baseRules.illegalChar()], // 导师审核意见
  jsyAuditOpinion: [baseRules.inputLen(0,500),baseRules.illegalChar()], // 教研室审核意见
  jycAuditOpinion: [baseRules.inputLen(0,500),baseRules.illegalChar()], // 教育处审核意见
};


export {
  proposalNotificationManagerList,
  proposalNotificationManager,

  proposalApplicationWriteList,
  proposalApplicationWrite,

  proposalApplicationAuditList,
  proposalApplicationAudit
};
