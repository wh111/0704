import _ from 'lodash';
import baseRules from '../../../formRules/base'; // 公共规则

/**
 * 实习生 - 出科技能补考 - 审核
 */
let givenSkillMakeUpAudit = {
  mark: baseRules.numberMust, // 技能成绩 - 必须为数字
};


/**
 * 实习生 - 病种审核 -
 */
let entityWriteList = {
  createUserName: [baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
};
let entityAudit = {
  reviewMess: [baseRules.inputLen(0,500),baseRules.illegalChar()], // 病人名称
  mark:[{ required: true, message: '此项不能为空', },baseRules.float2(0,100),baseRules.inputLen(0,6),baseRules.illegalChar()]
};

/**
 * 实习生 - 技能审核 -
 */
let skillWriteList = {
  createUserName: [baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
};


let skillAudit = {
  createUserName: [baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
};

/**
 * 大病历审核
 * */
let largeCaseWriteList = {
  cname: [baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
  czyNo: [baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
};
let largeCaseAudit = {
  cname: [baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
  czyNo: [baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
}

/**
 *   临床操作记录审核
 * */
let clinicalOperationWriteList = {
  name: [baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
}
/**
 *  - 科研日志 -
 */

let scientificResearchLog = {
  logTitle: [baseRules.inputLen(0,20),baseRules.illegalChar()], // 科室名称
}

export {
  givenSkillMakeUpAudit,
  entityWriteList,
  skillWriteList,
  largeCaseWriteList,
  clinicalOperationWriteList,
  entityAudit,
  skillAudit,
  // largeCaseWrite,

  scientificResearchLog
};
