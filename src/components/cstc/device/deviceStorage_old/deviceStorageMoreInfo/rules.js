import _ from 'lodash';
import baseRules from '../../../../../formRules/base'; // 公共规则

// 输入框限制长度
let rules = {
    title: [baseRules.inputLen(0, 24)]
}

export default rules;
