import _ from 'lodash';
import baseRules from '../../formRules/base'; // 公共规则

// 资金库管理
let capitalLibraryManagement = {
  fundName: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50), baseRules.illegalChar()],
  remarks: [baseRules.inputLen(0, 250), baseRules.illegalChar()],
  fundCode:[baseRules.requiredNoEvent,baseRules.inputLen(0, 64), baseRules.notChinese],
  fundMoney:[baseRules.requiredNoEvent,baseRules.inputLen(0, 10),baseRules.float()],
  isSystem:[baseRules.requiredNoEvent],
  usedScope:[baseRules.requiredNoEvent,baseRules.inputLen(0, 250),],
  regulation:[baseRules.requiredNoEvent,baseRules.inputLen(0, 250),],
};
let fundManagement={
  fundName: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50), baseRules.illegalChar()],
  totalOccurrenceMoney:[baseRules.requiredNoEvent,baseRules.inputLen(0, 10),baseRules.float()],
  accountingMoney:[baseRules.requiredNoEvent,baseRules.inputLen(0, 10),baseRules.float()],
  expenseTime:[baseRules.requiredNoEvent],
};

// 出入账管理
let revealingManagement = {
  accountingName: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50)],
  fundName: [baseRules.requiredNoEvent],
  accountingType: [baseRules.selectText],
  outOrEnter: baseRules.requiredNoEvent,
  expenseTime: [baseRules.requiredNoEvent,baseRules.isDate],
  explains:[baseRules.requiredNoEvent, baseRules.inputLen(0, 250)],
};
let detailRules = {
  "projectName": baseRules.required,  //项目名称
  "money": [baseRules.required,baseRules.floatTwo],    //实报金额
  "occurrenceMoney": [baseRules.required,baseRules.floatTwo],   //发生金额
  "recordType": [baseRules.selectText],     //记录类型
  "invoiceQuantity":[baseRules.required,baseRules.greaterThanZero1],    //单据数量
};


export {
  capitalLibraryManagement,
  revealingManagement,
  fundManagement,
  detailRules
};
