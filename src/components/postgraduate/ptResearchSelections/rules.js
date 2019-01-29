import baseRules from '../../../formRules/base';
// 新建开放导师
let arrangeInterviews = {
  interviewTime: [baseRules.requiredNoEvent],
  address: [
    {required: true, trigger: 'blur', message: '请选择面试地点'},
    baseRules.illegalChar()
  ],
  remarks: [{required: true, trigger: 'blur', message: '请填写备注'}, baseRules.illegalChar()]
};
// 确认招生发送短信
let confirmSend = {
  content: [baseRules.requiredNoEvent]
};

export {
  arrangeInterviews,
  confirmSend
};
