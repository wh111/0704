
import baseRules from '../../../formRules/base';

/**
 * 培养计划
 */
let trainingPlan = {
  studentCode: [
    baseRules.requiredNoEvent , baseRules.illegalChar() ,baseRules.inputLen(0,20)
  ],
  major: [
    baseRules.requiredNoEvent, baseRules.illegalChar() ,baseRules.inputLen(0,20)
  ],
  school: [
    baseRules.requiredNoEvent, baseRules.illegalChar() ,baseRules.inputLen(0,20)
  ],
  direction: [
    baseRules.requiredNoEvent , baseRules.illegalChar() ,baseRules.inputLen(0,20)
  ],
  life: [
    baseRules.requiredNoEvent , baseRules.numbers , baseRules.illegalChar(),baseRules.numberSection(0,100)
  ],
  joinData: [
    baseRules.requiredNoEvent
  ],

};


//培养计划
let graduateApplyAudit = {
  target:[baseRules.requiredNoEvent, baseRules.illegalChar()],
  pyobject:[baseRules.requiredNoEvent, baseRules.illegalChar()],
  length:[baseRules.requiredNoEvent, baseRules.illegalChar()],
  mode:[baseRules.requiredNoEvent, baseRules.illegalChar()],
  yqobjective:[baseRules.requiredNoEvent, baseRules.illegalChar()],
  yqrequire:[baseRules.requiredNoEvent, baseRules.illegalChar()],
  yqassessment:[baseRules.requiredNoEvent, baseRules.illegalChar()],
  yqpractice:[baseRules.requiredNoEvent, baseRules.illegalChar()],
  yqpresentation:[baseRules.requiredNoEvent, baseRules.illegalChar()],
  yqactivity:[baseRules.requiredNoEvent, baseRules.illegalChar()],
  dissertation:[baseRules.requiredNoEvent, baseRules.illegalChar()],
  paperTopic:[baseRules.requiredNoEvent, baseRules.illegalChar()],
  paperReport:[baseRules.requiredNoEvent, baseRules.illegalChar()],
  paperDefence:[baseRules.requiredNoEvent, baseRules.illegalChar()],
  degreeAwarding:[baseRules.requiredNoEvent, baseRules.illegalChar()],
  whereabouts:[baseRules.requiredNoEvent, baseRules.illegalChar()],
  //新增
  name: [baseRules.requiredNoEvent,baseRules.inputLen(0,50), baseRules.illegalChar(),],//名称
  author: [baseRules.requiredNoEvent,baseRules.inputLen(0,50), baseRules.illegalChar(),],//名称
  teacher: [baseRules.requiredNoEvent,baseRules.inputLen(0,50), baseRules.illegalChar(),],//老师
  credit: [baseRules.requiredNoEvent,baseRules.inputLen(0,5), baseRules.greaterThanZero1,],//学分
  hour: [baseRules.requiredNoEvent,baseRules.inputLen(0,5),baseRules.greaterThanZero1,],//学分

}
let queryAudit = {
  name:[
     baseRules.illegalChar() ,baseRules.inputLen(0,20)
  ],
  opinion:[
    baseRules.illegalChar() ,baseRules.inputLen(0,500)
  ]
};
let proposalApplicationAudit = {
  dsopinion:[baseRules.illegalChar() ,baseRules.inputLen(0,500)],
  auditOpinion:[baseRules.illegalChar() ,baseRules.inputLen(0,500)],
  ksopinion:[baseRules.illegalChar() ,baseRules.inputLen(0,500)],
  jycopinion:[baseRules.illegalChar() ,baseRules.inputLen(0,500)],
}

export  {
  trainingPlan,
  queryAudit,
  graduateApplyAudit,
  proposalApplicationAudit
}
