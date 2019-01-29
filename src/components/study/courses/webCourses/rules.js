import _ from 'lodash';
import baseRules from '../../../../formRules/base'; // 公共规则

/**
 * 实习生 - 出科技能补考 - 审核
 */
let webCoursesList = {
  title:[baseRules.inputLen(0,50),baseRules.illegalChar()],
};


export {
  webCoursesList
};
