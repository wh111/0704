import _ from 'lodash';
import baseRules from '../../../formRules/base'; // 公共规则

// 教学建设
let teachingConstruction = {
  teachPropertyOne: baseRules.requiredNoEvent,
  teachPropertyTwo: baseRules.requiredNoEvent,
  createTime: [baseRules.requiredNoEvent, baseRules.isDate],
};
export default {
  teachingConstruction,
}

export {
  teachingConstruction,
};
