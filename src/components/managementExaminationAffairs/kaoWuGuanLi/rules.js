import _ from 'lodash';
import baseRules from '../../../formRules/base'; // 公共规则

// 理论考试命题增加和修改
let llstatement = {
  name: baseRules.requiredNoEvent,
  // userName: baseRules.requiredNoEvent,
  request: baseRules.requiredNoEvent,
  teachType: baseRules.requiredNoEvent,
  className: baseRules.requiredNoEvent,
  number: [baseRules.requiredNoEvent, baseRules.greaterThanZero2],
  createTime: [baseRules.requiredNoEvent,baseRules.isDate],
};
// 理论考试组卷增加和修改
let llexamination = {
  name: baseRules.requiredNoEvent,
  // userName: baseRules.requiredNoEvent,
  describes: baseRules.requiredNoEvent,
  teachType: baseRules.requiredNoEvent,
  className: baseRules.requiredNoEvent,
  // number: [baseRules.requiredNoEvent, baseRules.greaterThanZero2],
  createTime: [baseRules.requiredNoEvent,baseRules.isDate],
};
// 理论考试判卷-新增和修改
let llpjamination = {
  name: baseRules.requiredNoEvent,
  requirement: baseRules.requiredNoEvent,
  teachType: baseRules.requiredNoEvent,
  className: baseRules.requiredNoEvent,
  examName: baseRules.requiredNoEvent,
  createTime: [baseRules.requiredNoEvent, baseRules.isDate]
};
// 理论考试监考-新增和修改
let lljkamination = {
  name: baseRules.requiredNoEvent,
  invigilateRequirement: baseRules.requiredNoEvent,
  teachType: baseRules.requiredNoEvent,
  className: baseRules.requiredNoEvent,
  examName: baseRules.requiredNoEvent,
  createTime: [baseRules.requiredNoEvent, baseRules.isDate]
};

// 理论考试试卷分析-新增和修改
let llsjfxamination = {
  name: baseRules.requiredNoEvent,
  anRequirement: baseRules.requiredNoEvent,
  teachType: baseRules.requiredNoEvent,
  className: baseRules.requiredNoEvent,
  examName: baseRules.requiredNoEvent,
  createTime: [baseRules.requiredNoEvent, baseRules.isDate]
};
// 理论考试讲评-新增和修改
let llKsjpamination = {
  name: baseRules.requiredNoEvent,
  commentRequirement: baseRules.requiredNoEvent,
  teachType: baseRules.requiredNoEvent,
  className: baseRules.requiredNoEvent,
  examName: baseRules.requiredNoEvent,
  createTime: [baseRules.requiredNoEvent, baseRules.isDate]
};

// 技能考核命题-新增和修改
let jnKhmtamination = {
  name: baseRules.requiredNoEvent,
  number: [baseRules.requiredNoEvent, baseRules.greaterThanZero2],
  teachType: baseRules.requiredNoEvent,
  proRequirement: baseRules.requiredNoEvent,
  createTime: [baseRules.requiredNoEvent, baseRules.isDate]
};
// 技能考核命题-新增和修改
let jnKjktamination = {
  name: baseRules.requiredNoEvent,
  invigilateRequirement: baseRules.requiredNoEvent,
  teachType: baseRules.requiredNoEvent,
  createTime: [baseRules.requiredNoEvent, baseRules.isDate]
};
// 技能考核讲评-新增和修改
let jnKhjptamination = {
  name: baseRules.requiredNoEvent,
  commentRequirement: baseRules.requiredNoEvent,
  teachType: baseRules.requiredNoEvent,
  createTime: [baseRules.requiredNoEvent, baseRules.isDate]
};
export {
  llstatement,
  llexamination,
  llpjamination,
  lljkamination,
  llsjfxamination,
  llKsjpamination,
  jnKhmtamination,
  jnKjktamination,
  jnKhjptamination
};
