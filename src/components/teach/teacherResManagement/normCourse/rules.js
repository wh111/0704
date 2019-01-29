import _ from 'lodash';
import baseRules from '../../../../formRules/base'; // 公共规则

/**
 * 基本信息
 */
let basic = {
  title: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50)],
  typeName: baseRules.requiredNoEvent,
  direction: baseRules.inputLen(0, 250),
  // direction: baseRules.illegalChar,
};
/**
 * 教学计划
 */
let teach = {
  title: baseRules.required,
};

/**
 * 课程计划
 */
let plan = {
  duration: [baseRules.requiredNoEvent, baseRules.numbers, baseRules.numberSection(1, 24)],
  content: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50)],
  remark: baseRules.inputLen(0, 250),
  realia: baseRules.inputLen(0, 250),
};

/**
 * 评测与作业
 */
let eq = {
  score: [baseRules.requiredNoEvent, baseRules.numbers, baseRules.inputLen(1, 3)]
};

/**
 * 教学质量评价表
 */
let evaluateRules = {
  studentWeight: baseRules.numbers,
  peersWeight: baseRules.numbers,
  superiorsWeight: baseRules.numbers,
};

export {
  eq,
  evaluateRules,
  teach,
  plan,
  basic
};
