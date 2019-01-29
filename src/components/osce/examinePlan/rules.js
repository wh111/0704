import _ from 'lodash';
import baseRules from '../../../formRules/base'; // 公共规则

/**
 * 树菜单
 */
let tree = {
  treeName: baseRules.required, // 名称 - 必填
};

/**
 * 考核内容管理 - 评分
 */
let login = {
  userName:baseRules.required,
  idCard:[baseRules.required, baseRules.idNumber],
};




export {
  login
};
