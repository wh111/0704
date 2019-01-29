import baseRules from '../../../formRules/base';

/**
 * 培养计划
 */
let trainingPlan = {
  studentCode: [
    {required: true, type: 'number', message: '请输入学号', trigger: 'blur'}, baseRules.illegalChar(), baseRules.inputLen(0, 20)
  ],
  major: [
    {required: true, message: '请输入专业', trigger: 'blur'}, baseRules.illegalChar(), baseRules.inputLen(0, 20)
  ],
  academy: [
    {required: true, message: '请输入所在学院', trigger: 'blur'}, baseRules.illegalChar(), baseRules.inputLen(0, 20)
  ],
  direction: [
    {required: true, message: '请输入研究方向', trigger: 'blur'}, baseRules.illegalChar(), baseRules.inputLen(0, 20)
  ],
  life: [
    {required: true, type: 'number', message: '请输入学习年限', trigger: 'blur'}, baseRules.numbers, baseRules.illegalChar(), baseRules.numberSection(0, 100)
  ],
  joinData: [
    {type: 'date', required: true, message: '请选择入学日期', trigger: 'change'}
  ]
};
let queryAssessment = {
  name: [
    {message: '请输入查询姓名', trigger: 'blur'}, baseRules.illegalChar(), baseRules.inputLen(0, 20)
  ],
  specialtyName: [
    {message: '请输入查询姓名', trigger: 'blur'}, baseRules.illegalChar(), baseRules.inputLen(0, 20)
  ],
  score: [
    {required: true, message: '请输入考核成绩', trigger: 'blur'}, baseRules.numbers, baseRules.illegalChar(), baseRules.numberSection(0, 100)
  ],
  conclusion: [
    {required: true, message: '请选择考核结果', trigger: 'blur'}
  ]
};

let midtermExaminationNotice = {
  majorCode: [baseRules.requiredNoEvent, baseRules.selectText],
  examStartDate: [baseRules.requiredNoEvent],
  examEndDate: [baseRules.requiredNoEvent],
  content: [baseRules.inputLen(0, 250)]
};

export {
  trainingPlan,
  queryAssessment,
  midtermExaminationNotice
};
