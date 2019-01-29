import _ from 'lodash';
import baseRules from '../../../../formRules/base'; // 公共规则

/**
 * 课程计划
 */
let plan = {
  duration: [baseRules.requiredNoEvent, baseRules.numbers, baseRules.numberSection(1, 24)],
  content: baseRules.requiredNoEvent,
};


export {
  plan
};
