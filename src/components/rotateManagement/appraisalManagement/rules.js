import _ from 'lodash';
import baseRules from '../../../formRules/base'; // 公共规则

/**
 *  - 结业考核 -
 */

let completionOfTheInspectionList = {
  name: [baseRules.inputLen(0,20),baseRules.illegalChar()], // 姓名
  major: [baseRules.inputLen(0,20),baseRules.illegalChar()], // 专业
  minScore: [baseRules.greaterThanZero2,baseRules.inputLen(0,10)], // 最小成绩
  maxScore: [baseRules.greaterThanZero1,baseRules.inputLen(0,10)], // 最大成绩
  // editTime: [{ required: true, message: '此项必填'}], // 时间
  // fid: [{ required: true, message: '此项必填'}], // 附件
}
let completionOfTheInspection = {
  mess: [baseRules.inputLen(0,500),baseRules.illegalChar()], // 姓名
}


export {
  completionOfTheInspectionList,
  completionOfTheInspection,
};
