import _ from 'lodash';
import baseRules from '../../../formRules/base'; // 公共规则

/**
 * 研究生 - 基础设置 - 专业设置
 */
let ptMajor = {
  major: baseRules.required,        //基地名称
  majorCode: baseRules.required,    //基地专业
};

/**
 * 研究生 - 基础设置 - 专业设置
 */
let ptTimeSetList = {
  configValue: [baseRules.required, baseRules.greaterThanZero2, baseRules.inputLen(0, 20)],        //基地名称
};

let postgraduateChargingStandard = {
  configValue: [baseRules.requiredNoEvent, baseRules.float(), baseRules.inputLen(0, 6)]
};

export {
  ptMajor,
  ptTimeSetList,
  postgraduateChargingStandard
};
