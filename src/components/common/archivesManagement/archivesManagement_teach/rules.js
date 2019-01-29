import _ from 'lodash';
import baseRules from '../../../../formRules/base'; // 公共规则

let teach = {
  teachTitle:[baseRules.inputLen(0,50)],
  graduatedTraineeNumber:baseRules.greaterThanZero2,
  graduatedResidencyNumber:baseRules.greaterThanZero2,
  trainingTraineeNumber:baseRules.greaterThanZero2,
  trainingResidencyNumber:baseRules.greaterThanZero2,
  teachContent:baseRules.inputLen(0,250),
  specialtyCode:baseRules.inputLen(0,50),
  specialtyName:baseRules.inputLen(0,50),
  trainCompany:baseRules.inputLen(0,50),
  hiredSchool:baseRules.inputLen(0,50),
};

export {
  teach,
};
