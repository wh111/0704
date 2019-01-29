
import baseRules from '../../../formRules/base';

/**
 * 毕业答辩
 */
let respondentReply = {
  "researchDirection":baseRules.required, // 研究方向 - 必填,
  "thesisTitle":baseRules.required, // 论文题目 - 必填,
  "status":baseRules.required, // 审核状态 - 必填,
  "defenseTime":{required: true, message: '请输入答辩时间'}, // 答辩时间 - 必填,
  "defensePlace": [baseRules.inputLen(0, 50), baseRules.illegalChar()], // 答辩地点 - 必填,
  "isPreDefense":baseRules.numberMust, // 是否预答辩 - 必填,
  "attachmentId":baseRules.required, // 附件id - 必填,
  summaryUserList:baseRules.requiredNoEvent, //
  defenseSpecialist:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()], //答辩专科
  tutorNameme:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()], //导师
  name:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()], //名称
  positionalTitle:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()], //职称
  company:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()], //单位
  jycAuditOpinion:[baseRules.inputLen(0,500),baseRules.illegalChar()], //单位
  phoneNumber: [baseRules.requiredNoEvent,baseRules.mobile]
};


/**
 * 答辩汇总
 */
let respondentSum = {
  "defenseTime":{required: true, message: '请输入答辩时间'}, // 答辩时间 - 必填,
  "defensePlace":baseRules.required, // 答辩地点 - 必填,
  "summaryUserList":baseRules.numberMust, // 是否预答辩 - 必填,
};

/**
 * 答辩汇总-审核
 */
let respondentAudit = {
  "auditOpinion":baseRules.required, // 审批意见 - 必填,
};

export  {
  respondentReply,
  respondentSum,
  respondentAudit,
}
