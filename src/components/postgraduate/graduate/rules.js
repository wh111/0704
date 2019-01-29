
import baseRules from '../../../formRules/base';

/**
 * 研究生毕业申请
 */
let graduateApplyAudit = {
  paper: [baseRules.requiredNoEvent,baseRules.inputLen(0,500),baseRules.illegalChar()], // 论文发表情况
  leaveDate:[baseRules.requiredNoEvent], // 离院时间
  whereabouts:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()], // 毕业去向
  fileIds:[baseRules.requiredNoEvent], // 附件
  article:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()], // 发表文章
  periodical:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()], // 期刊
  publication:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()], // 刊物名称
  author:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()], // 作者
  signature:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()], // 文章署名单位
  correspondent:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()], // 通讯作者
  included:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()], // SCI收录
  influence:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()], // 影响因子
  creationdate:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()], // 时间
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
export  {
  graduateApplyAudit,

  proposalApplicationAuditList,
  proposalApplicationAudit,
}
