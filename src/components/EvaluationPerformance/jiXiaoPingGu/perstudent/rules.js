import _ from 'lodash';
import baseRules from '../../../../formRules/base'; // 公共规则

// 指标维护 视图
let perteachtion = {
  score: [
    baseRules.requiredNoEvent,
    baseRules.float(2),
    baseRules.numberSection(0, 100)],
  evaCriteria: baseRules.requiredNoEvent
};
export {
  perteachtion
};
