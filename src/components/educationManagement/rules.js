import _ from 'lodash';
import baseRules from '../../formRules/base'; // 公共规则

// 会议申请
let meetingReportWrite = {
    name: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50)],
    // hosdeptName:[baseRules.requiredNoEvent,baseRules.inputLen(1,50)],
    // participantName: [baseRules.requiredNoEvent],
    startTime: [baseRules.requiredNoEvent, baseRules.isDate],
    endTime: [baseRules.requiredNoEvent, baseRules.isDate],
    address: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50)],
    // conferenceFee:[baseRules.requiredNoEvent,baseRules.inputLen(1,5),baseRules.numbers],
    content: baseRules.inputLen(0, 250),
    remark: baseRules.inputLen(0, 250),
    jobTitle: [ baseRules.inputLen(1, 50)],
};

// 会议审核
let meetingReportAudit = {
    status: baseRules.requiredNoEvent,
    content: baseRules.inputLen(0, 250)
};
// 网上预审
let OnlinePrequalification = {
  checkInTime: baseRules.requiredNoEvent,
};

// 会议费用
let meetingRegistrationFee = {
  conferenceFee: [
    baseRules.requiredNoEvent,
    baseRules.numbers,
    baseRules.inputLen(1, 5)],
    travelFee: [baseRules.requiredNoEvent, baseRules.inputLen(1, 5), baseRules.numbers],
    hotelFee: [baseRules.requiredNoEvent, baseRules.inputLen(1, 5), baseRules.numbers],
};

// 外出进修审核
let outEducationAntragAudit = {
    remark: [baseRules.inputLen(0, 250), baseRules.illegalChar()],
};
// 外出进修填写
let outEducationAntragInput = {
    workDate: [baseRules.requiredNoEvent],  //来院工作时间</
    entryDate: [baseRules.requiredNoEvent],  //定职时间</
    titles: [baseRules.requiredNoEvent, baseRules.inputLen(0, 50), baseRules.illegalChar()],  //专业技术职称</
    domesticEdu: [baseRules.requiredNoEvent, baseRules.inputLen(0, 50), baseRules.illegalChar()],  //国内</
    foreignEdu: [baseRules.inputLen(0, 50), baseRules.illegalChar()],  //国外</
    direction: [baseRules.requiredNoEvent, baseRules.inputLen(0, 50), baseRules.illegalChar()],  //主要研究方向</
    hospital: [baseRules.requiredNoEvent, baseRules.inputLen(0, 50), baseRules.illegalChar()],  //申请进修医院</
    deptName: [baseRules.requiredNoEvent, baseRules.inputLen(0, 50), baseRules.illegalChar()],  //申请进修医院</
    startTime: [baseRules.requiredNoEvent],  //进修时间 开始</
    endTime: [baseRules.requiredNoEvent],  //进修时间 结束</
    email: [baseRules.email, baseRules.inputLen(0, 50), baseRules.illegalChar()],  //Email地址</
    mobile: [baseRules.requiredNoEvent, baseRules.mobile],  //手机号</

  studyFee: [
    baseRules.float2(0, 10000000),
    baseRules.inputLen(0, 20),
    baseRules.floatTwo],  //进修费</
  hotelFee: [
    baseRules.float2(0, 10000000),
    baseRules.inputLen(0, 20),
    baseRules.floatTwo],   //住宿费
  trafficFee: [
    baseRules.float2(0, 10000000),
    baseRules.inputLen(0, 20),
    baseRules.floatTwo]   //会议补贴费
};

// 外出进修汇报
let outEducationReportWrite = {
    summed: [baseRules.inputLen(0, 250), baseRules.illegalChar()],
    suggest: [baseRules.inputLen(0, 250), baseRules.illegalChar()],
};

// 外出进修汇报审核
let outEducationReportAudit = {
    remark: [baseRules.inputLen(0, 250), baseRules.illegalChar()],
};

// 费用报销填写
let expenseReimbursement = {
    studyCost: [baseRules.requiredNoEvent, baseRules.number, baseRules.inputLen(1, 6)],
    hotelCost: [baseRules.requiredNoEvent, baseRules.number, baseRules.inputLen(1, 6)],
    trafficCost: [baseRules.requiredNoEvent, baseRules.number, baseRules.inputLen(1, 6)],
};

// 科室要求
let educationPlanWrite = {
    depId: baseRules.requiredNoEvent,
    disType: baseRules.requiredNoEvent,
    disTitle: baseRules.requiredNoEvent,
    disNum: [baseRules.requiredNoEvent, baseRules.numberMust],
    specialty: [baseRules.requiredNoEvent],
    ts: [baseRules.requiredNoEvent, baseRules.numberMust],
    deMasterDegree: baseRules.requiredNoEvent,
};

// 进修结束调查报告
let surveyReport = {
    // selfAssessment:[baseRules.inputLen(0,250),baseRules.illegalChar],
    minerDays: [baseRules.requiredNoEvent, baseRules.number, baseRules.inputLen(1, 6)],
    sickDays: [baseRules.requiredNoEvent, baseRules.number, baseRules.inputLen(1, 6)],
    personalDays: [baseRules.requiredNoEvent, baseRules.number, baseRules.inputLen(1, 6)],
    rewardNum: [baseRules.requiredNoEvent, baseRules.number, baseRules.inputLen(1, 6)],
    penaltyNum: [baseRules.requiredNoEvent, baseRules.number, baseRules.inputLen(1, 6)],
};

// 进修结束调查报告审核
let endEducation = {
    // eduExpertOpinion:[baseRules.inputLen(0,250),baseRules.illegalChar],
    minerDays: [baseRules.requiredNoEvent, baseRules.number, baseRules.inputLen(1, 6)],
    sickDays: [baseRules.requiredNoEvent, baseRules.number, baseRules.inputLen(1, 6)],
    personalDays: [baseRules.requiredNoEvent, baseRules.number, baseRules.inputLen(1, 6)],
    rewardNum: [baseRules.requiredNoEvent, baseRules.number, baseRules.inputLen(1, 6)],
    penaltyNum: [baseRules.requiredNoEvent, baseRules.number, baseRules.inputLen(1, 6)],
};

// 遴选人员
let selectionEducation = {
    depId: baseRules.requiredNoEvent,
};

//科目管理
let subject = {
    courseName: [baseRules.requiredNoEvent],
    organizer: [baseRules.requiredNoEvent],
    enrolmentNumbers: [baseRules.requiredNoEvent],
    learningPeriod: [baseRules.requiredNoEvent, baseRules.number],
    schoolTime: [baseRules.requiredNoEvent],
    conditionsEnrolment: [baseRules.requiredNoEvent],
    furtherArrangement: [baseRules.requiredNoEvent],
    depNames: [baseRules.requiredNoEvent],
};

// 交款条
let feeManagement_payment = {
    invoiceNo: [baseRules.requiredNoEvent, baseRules.number],
    parymentMethods: [baseRules.requiredNoEvent],
    paymentTime: [baseRules.selectText],
};

// 进修回执填写
let EducationReceiptWrite = {};

// 各职称参会次数设置
let meetSetNum = {
    participantsNum: [baseRules.number, baseRules.inputLen(0, 5)]
};

//收费参数设置
let chargeParameterSet = {
    configValue: [baseRules.requiredNoEvent, baseRules.number, baseRules.inputLen(0, 50)]
};
export {
    meetingReportWrite,
    meetingReportAudit,
    meetingRegistrationFee,
    outEducationAntragAudit,
    outEducationAntragInput,
    outEducationReportWrite,
    outEducationReportAudit,
    expenseReimbursement,
    educationPlanWrite,
    surveyReport,
    endEducation,
    selectionEducation,
    subject,
    feeManagement_payment,
    EducationReceiptWrite,
    meetSetNum,
    chargeParameterSet,
  OnlinePrequalification,
};
