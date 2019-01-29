import _ from 'lodash';
import baseRules from '../../../formRules/base'; // 公共规则

//验证性别
function sex(value, callback, message) {
  if (value == '' || value == null) {
    callback(false);
    return;
  }
  value = value.trim();
  if (value != '男' && value != '女'&& value != '性别') {
    callback(false)
  } else {
    callback(true);
  }
}
//验证必填
function _require(value, callback, message) {
  if (value !== '' && value != null) {
    callback(true)
  } else {
    callback(false);
  }
}
//住院医实施验证
let implementationManagement = [
  {data: '0', validator: _require, allowInvalid: true},
  {data: '1', validator: _require, allowInvalid: true},
  // {data: '2', validator: sex, allowInvalid: true,editor: 'select', selectOptions: ['男', '女']}, //选择
  {data: '2', validator: _require, allowInvalid: true},
  {data: '3', validator: _require, allowInvalid: true},
]

export {
  implementationManagement,
};
