import baseRules from '../../../formRules/base'; // 公共规则

/**
 * 短信模板设置
 */
let rdySMSTemplate = {
  name: [baseRules.required,], // 实习费 - 必填\数字
  code: [baseRules.required,], // 实习费 - 必填\数字
  value: [baseRules.required,], // 实习费 - 必填\数字
};

export {
  rdySMSTemplate,
};
