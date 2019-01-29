import _ from 'lodash';
import baseRules from '../../../formRules/base'; // 公共规则

/**
 * 系统设置--节假日设置
 **/
let holidays = {
  holidayName: baseRules.requiredNoEvent,
  startDate: baseRules.requiredNoEvent,
  endDate: baseRules.requiredNoEvent,
};

// 科室报到扫描二维码时效设置
let rotaryBasisSet_qr = {
  configValue: [baseRules.requiredNoEvent, baseRules.numbers, baseRules.inputLen(1, 10)]
};
// 补轮转比例
let rotaryBasisSet_blz = {
  configValue: [baseRules.requiredNoEvent, baseRules.numbers, baseRules.numberSection(0, 100)]
};

let noteTemplate_time = {
  configValue: [baseRules.requiredNoEvent, baseRules.isDate]
};

let noteTemplate_str = {
  configValue: [baseRules.requiredNoEvent, baseRules.inputLen(1, 250)]
};
//app管理
let appManager = {
  filePath: [baseRules.requiredNoEvent],
  remark: [ baseRules.inputLen(0, 500)]
};
//考勤位置设置
let checkLocation = {
  longitude: [baseRules.requiredNoEvent, baseRules.float(10)],
  latitude: [baseRules.requiredNoEvent, baseRules.float(10)],
  placeName: [baseRules.requiredNoEvent],
  scope: [baseRules.requiredNoEvent],
  startToWorkTime: [baseRules.requiredNoEvent],
  endOffWorkTime: [baseRules.requiredNoEvent],
  remark: [ baseRules.inputLen(0, 500)]
};


export {
  holidays,
  rotaryBasisSet_qr,
  rotaryBasisSet_blz,
  noteTemplate_time,
  noteTemplate_str,
  appManager,
  checkLocation,
};
