import _ from 'lodash';
import baseRules from '../../../formRules/base'; // 公共规则

/**
 * 栏目管理
 */
let columnManagementList = {
  name: [baseRules.inputLen(0,50),baseRules.illegalChar()],  //栏目名称
  parentName: [baseRules.inputLen(0,50),baseRules.illegalChar()],  //父栏目名称
  moduleUrl: [baseRules.inputLen(0,50),baseRules.illegalChar()],  //url
  moduleOrder: [baseRules.greaterThanZero1,baseRules.inputLen(0,20),baseRules.illegalChar()],  //栏目顺序
};

let columnManagement = {
  name: [baseRules.requiredNoEvent, baseRules.inputLen(0,6),baseRules.illegalChar()],  //栏目名称
  moduleOrder: [baseRules.greaterThanZero1,baseRules.inputLen(0,20),baseRules.illegalChar()],  //栏目顺序
  moduleUrl: [baseRules.inputLen(0,300),baseRules.illegalChar()],  //url
  remark: [baseRules.inputLen(0,100),baseRules.illegalChar()],  //栏目简介
};


/**
 * 内容管理
 */
let contentManagementList = {
  title: [baseRules.inputLen(0,50),baseRules.illegalChar()],  //栏目名称
  newsOrder: [baseRules.greaterThanZero1,baseRules.inputLen(0,20),baseRules.illegalChar()],  //置顶顺序
};

let contentManagement = {
  moduleId: [baseRules.requiredNoEvent],  //栏目id
  title: [baseRules.requiredNoEvent, baseRules.inputLen(0,50),baseRules.illegalChar()],  //栏目名称
  authorName: [ baseRules.inputLen(0,50),baseRules.illegalChar()],  //作者
  url: [ baseRules.inputLen(0,50),baseRules.illegalChar()],  //url
  newsOrder: [baseRules.greaterThanZero1,baseRules.inputLen(0,20),baseRules.illegalChar()],  //置顶顺序
};
/**
 * 站内通知
 */
let releaseManagementList = {
  title: [baseRules.inputLen(0,50),baseRules.illegalChar()],  //栏目名称
  publisher: [baseRules.inputLen(0,50),baseRules.illegalChar()],  //栏目名称
};

let releaseManagement = {
  title: [baseRules.requiredNoEvent, baseRules.inputLen(0,50),baseRules.illegalChar()],  //标题
  publisher: [ baseRules.inputLen(0,50),baseRules.illegalChar()],  //发布人
};

export {
  columnManagement,
  columnManagementList,
  contentManagementList,
  contentManagement,
  releaseManagementList,
  releaseManagement,
};
