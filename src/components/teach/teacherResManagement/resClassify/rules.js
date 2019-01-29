import _ from 'lodash';
import baseRules from '../../../../formRules/base'; // 公共规则

/**
 * 标准课程、教学视频、文档文献、典型病例、医学图谱
 */
let studyTree = {
  name: [baseRules.required,baseRules.inputLen(0,50),baseRules.illegalChar()],
};


export {
  studyTree
};
