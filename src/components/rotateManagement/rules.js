import _ from 'lodash';
import baseRules from '../../formRules/base'; // 公共规则

/**
 * 实习生 - 出科技能补考 - 审核
 */
let givenSkillMakeUpAudit = {
  mark: baseRules.numberMust, // 技能成绩 - 必须为数字
};


/**
 * 实习生 - 病种填写 -
 */
let entityWrite = {
  podId: { required: true, message: '此项必填'}, // 轮转科室
  disTitle: { required: true, message: '此项必填'}, // 病种名称
  patientName: [{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
  patienNo: [{ required: true, message: '此项必填'},baseRules.inputLen(0,20),baseRules.illegalChar()], // 病历号
  fillTime: [{ required: true, message: '此项必填'}], // 日期
  mainDiagnosis: [{ required: true, message: '此项必填'},baseRules.inputLen(0,300),baseRules.illegalChar()], // 主要诊断
  secondaryDiagnosis: [{ required: true, message: '此项必填'},baseRules.inputLen(0,300),baseRules.illegalChar()], // 主要诊断
  situation: [{ required: true, message: '此项必填'},baseRules.inputLen(0,300),baseRules.illegalChar()], // 主要诊断
};


let entityWriteList = {
  diseaseName: [baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
  patientName: [baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
  patienNo: [baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
};

/**
 * 实习生 - 技能填写 -
 */
let skillWrite = {
  podId: { required: true, message: '此项必填'}, // 轮转科室
  disTitle: { required: true, message: '此项必填'}, // 病种名称
  patientName: [{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
  patienNo: [{ required: true, message: '此项必填'},baseRules.inputLen(0,20),baseRules.illegalChar()], // 病历号
  fillTime: [{ required: true, message: '此项必填'}], // 日期
  reasonFailure: [{ required: true, message: '此项必填'},baseRules.inputLen(0,1000),baseRules.illegalChar()], // 失败原因
};
let skillWriteList = {
  skillName: [baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
  patientName: [baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
  patienNo: [baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
};


/**
 * 实习生 - 麻醉科 -
 */
let electrocardiogramTemplate = {
  cbedNo:[{ required: true, message: '此项必填'},baseRules.sectionVal(),baseRules.illegalChar()],  //床号
  czyNo:[{ required: true, message: '此项必填'},baseRules.sectionVal(),baseRules.illegalChar()],   //住院号
  cjlDate:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],                      //住院号
  cname:[{ required: true, message: '此项必填'},baseRules.sectionVal(),baseRules.illegalChar()],   //姓名
  cage:[{ required: true, message: '此项必填'}, baseRules.numbers,baseRules.inputLen(0,20),baseRules.illegalChar()],                         //年龄
  acaTz: [{required: true, message: '此项必填'}, baseRules.float(), baseRules.inputLen(0, 20), baseRules.illegalChar()],                        //体重
  acaXgn:[baseRules.inputLen(0,50),baseRules.illegalChar()],                        //体重
  acaSszd:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],



  //手术后诊断
  acaYsss:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],                      //已施手术
  acaMzqyw:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],                     //麻醉前用药
  acaTsqk:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],                      //特殊情况
  acaMzBegintime:[{ required: true, message: '此项必填'}],               //麻醉开始
  acaMzEndtime:[{ required: true, message: '此项必填'}],                 //麻醉终止
  acaSsBegintime:[{ required: true, message: '此项必填'}],                //手术开始
  acaSsEndtime:[{ required: true, message: '此项必填'}],                 //手术终止
  acaCxl: [baseRules.float(), baseRules.inputLen(0, 20), baseRules.illegalChar()],  //出血量
  acaCnl: [baseRules.float(), baseRules.inputLen(0, 20), baseRules.illegalChar()],  //出尿量（ML单位
  acaMzff:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],                       //麻醉方法
  acaShzt:[{ required: true, message: '此项必填'}],                       //术后镇疼方法
  acaYdyw:[{ required: true, message: '此项必填'}],                       //诱导药物名称
  acaShjl:[{ required: true, message: '此项必填'}],                       //病人从进手术室开始到出手术室的过程记录
  acaSstw:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],                       //手术体位
  acaMzjl:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],                       //麻醉剂及剂量(维持):
  acaMzUser:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],                     //麻醉者
  acaSsUser:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],                     //手术者(维持):
  acaXs:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],                        //洗手
  acaXh:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],                        //巡回
  acaQx: [{required: true, message: '此项必填'}, baseRules.float(), baseRules.inputLen(0, 20), baseRules.illegalChar()],                        //全血
  acaCfxl: [{required: true, message: '此项必填'}, baseRules.float(), baseRules.inputLen(0, 20), baseRules.illegalChar()],                      //成分输血
  acaDxj: [{required: true, message: '此项必填'}, baseRules.float(), baseRules.inputLen(0, 20), baseRules.illegalChar()],                      //代 血 浆
  acaZsyl: [{required: true, message: '此项必填'}, baseRules.float(), baseRules.inputLen(0, 20), baseRules.illegalChar()],                      //总输入量
  acaCxlo: [{required: true, message: '此项必填'}, baseRules.float(), baseRules.inputLen(0, 20), baseRules.illegalChar()],                      //出 血 量
  acaNl: [{required: true, message: '此项必填'}, baseRules.float(), baseRules.inputLen(0, 20), baseRules.illegalChar()],                      //尿    量
  acaQt: [{required: true, message: '此项必填'}, baseRules.float(), baseRules.inputLen(0, 20), baseRules.illegalChar()],                      //其 他

};

/**
 * 实习生 - 大病历 -
 */
let largeCaseTemplate = {
  cname:[{ required: true, message: '此项必填'},baseRules.sectionVal(),baseRules.illegalChar()],  //姓名
  cage:[{ required: true, message: '此项必填'}, baseRules.numbers,baseRules.inputLen(0,20),baseRules.illegalChar()],  //年龄
  czhiye:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],  //职业
  caddress:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],  //住址
  cbirthPlace:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],  //出生地
  cbedNo:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],  //床号
  czyNo:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],  //住院号
  clesion:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],  //病区
  cruyuanDate:[{ required: true, message: '此项必填'}],  //入院日期
  cjlDate:[{ required: true, message: '此项必填'}],  //记录日期
  cbscsz:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],  //病史陈述者
  chuanzheUser:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],  //与患者关系
  czs:[{ required: true, message: '此项必填'},baseRules.inputLen(0,500),baseRules.illegalChar()],  //主诉
  cxbs:[{ required: true, message: '此项必填'},baseRules.inputLen(0,1000),baseRules.illegalChar()],  //现病史
  cjbs:[{ required: true, message: '此项必填'},baseRules.inputLen(0,1000),baseRules.illegalChar()],  //现病史

  cnation:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],
  workAddress:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],
  reliability:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()],
  phone:[{ required: true, message: '此项必填'},baseRules.mobile],

  cjwsYbjkqk:[baseRules.inputLen(0,1000),baseRules.illegalChar()],  //平时一般健康情况
  cjwsCrbs:[baseRules.inputLen(0,1000),baseRules.illegalChar()],  //传染病史
  cjwsSswss:[baseRules.inputLen(0,1000),baseRules.illegalChar()],  //手术外伤史
  cjwsYwgms:[baseRules.inputLen(0,1000),baseRules.illegalChar()],  //药物过敏史
  cxthgHxxt:[baseRules.inputLen(0,1000),baseRules.illegalChar()],  //呼吸系统
  cxthgXuhxt:[baseRules.inputLen(0,1000),baseRules.illegalChar()],  //循环系统
  cxthgXihxt:[baseRules.inputLen(0,1000),baseRules.illegalChar()],  //消化系统
  cxthgMlxt:[baseRules.inputLen(0,1000),baseRules.illegalChar()],  //泌尿系统
  cxthgXyxt:[baseRules.inputLen(0,1000),baseRules.illegalChar()],  //血液系统
  cxthgNfmxt:[baseRules.inputLen(0,1000),baseRules.illegalChar()],  //内分泌系统
  cxthgSjxt1:[baseRules.inputLen(0,1000),baseRules.illegalChar()],  //神经系统
  cxthgSzxt:[baseRules.inputLen(0,1000),baseRules.illegalChar()],  //生殖系统
  cxthgGgjxt:[baseRules.inputLen(0,1000),baseRules.illegalChar()],  //肌肉骨关节系统
  cxthgGrs:[baseRules.inputLen(0,1000),baseRules.illegalChar()],  //个人史
  cxthgYjhys:[baseRules.inputLen(0,1000),baseRules.illegalChar()],  //月经婚育史
  cxthgJts:[baseRules.inputLen(0,1000),baseRules.illegalChar()],  //家庭史

  ctgjcSmtzT:[baseRules.inputLen(0,50),baseRules.illegalChar()],  //T
  ctgjcSmtzC:[baseRules.inputLen(0,50),baseRules.illegalChar()],  //C
  ctgjcSmtzP:[baseRules.inputLen(0,50),baseRules.illegalChar()],  //P
  ctgjcSmtzCf1:[baseRules.inputLen(0,50),baseRules.illegalChar()],//次/分
  ctgjcSmtzR:[baseRules.inputLen(0,50),baseRules.illegalChar()],//R
  ctgjcSmtzCf2:[baseRules.inputLen(0,50),baseRules.illegalChar()],//次/分
  ctgjcSmtzBp:[baseRules.inputLen(0,50),baseRules.illegalChar()],//BP

  ctgjcYbqk1:[baseRules.inputLen(0,1000),baseRules.illegalChar()],//一般情况
  ctgjcPfnm:[baseRules.inputLen(0,1000),baseRules.illegalChar()],//皮肤粘膜
  ctgjcQblbj:[baseRules.inputLen(0,1000),baseRules.illegalChar()],//浅表淋巴结
  ctgjcTbqg:[baseRules.inputLen(0,1000),baseRules.illegalChar()],//头部及其器官
  ctgjcJb:[baseRules.inputLen(0,1000),baseRules.illegalChar()],//颈部
  ctgjcXb:[baseRules.inputLen(0,1000),baseRules.illegalChar()],//胸部
  ctgjcRx:[baseRules.inputLen(0,1000),baseRules.illegalChar()],//乳腺
  ctgjcFei:[baseRules.inputLen(0,1000),baseRules.illegalChar()],//肺
  ctgjcSz1:[baseRules.inputLen(0,1000),baseRules.illegalChar()],//视诊
  ctgjcCz1:[baseRules.inputLen(0,1000),baseRules.illegalChar()],//触诊
  ctgjcKz1:[baseRules.inputLen(0,1000),baseRules.illegalChar()],//叩诊
  ctgjcTz1:[baseRules.inputLen(0,1000),baseRules.illegalChar()],//听诊
  ctgjcXz:[baseRules.inputLen(0,1000),baseRules.illegalChar()],//心脏
  ctgjcSz2:[baseRules.inputLen(0,1000),baseRules.illegalChar()],//视诊
  ctgjcCz2:[baseRules.inputLen(0,1000),baseRules.illegalChar()],//触诊

  ctgjcKzy1:[baseRules.inputLen(0,50),baseRules.illegalChar()],
  ctgjcKzz1:[baseRules.inputLen(0,50),baseRules.illegalChar()],
  ctgjcKzy2:[baseRules.inputLen(0,50),baseRules.illegalChar()],
  ctgjcKzz2:[baseRules.inputLen(0,50),baseRules.illegalChar()],
  ctgjcKzy3:[baseRules.inputLen(0,50),baseRules.illegalChar()],
  ctgjcKzz3:[baseRules.inputLen(0,50),baseRules.illegalChar()],
  ctgjcKzy4:[baseRules.inputLen(0,50),baseRules.illegalChar()],
  ctgjcKzz4:[baseRules.inputLen(0,50),baseRules.illegalChar()],

  ctgjcTz2:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //听诊
  ctgjcRdm:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //桡动脉
  ctgjcZwxg:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //周围血管征
  ctgjcFb:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //腹部
  ctgjcSz3:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //视诊
  ctgjcCz3:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //触诊
  ctgjcYbqk2:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //一般情况
  ctgjcGz:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //肝脏
  ctgjcPz:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //脾脏
  ctgjcSz:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //肾脏
  ctgjcQt:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //其他
  ctgjcKz3:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //叩诊
  ctgjcTz3:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //听诊
  ctgjcGzc:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //肛门、直肠
  ctgjcWszq:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //外生殖器
  ctgjcJz:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //脊柱
  ctgjcShiz:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //四肢
  ctgjcSjxt2:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //神经系统
  ctgjcZkqk:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //专科情况
  ctgjcSysjc:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //实验室及特殊检查
  cblzy:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //病例摘要
  ccbzd:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //初步诊断
  cysqm1:[baseRules.inputLen(0,50),baseRules.illegalChar()], //医师签名
  cryzd:[baseRules.inputLen(0,1000),baseRules.illegalChar()], //入院诊断
  cysqm2:[baseRules.inputLen(0,50),baseRules.illegalChar()], //医师签名



};

/**
 * 实习生 - 心电图 -
 */
let imageTemplate = {
  czyNo:[{ required: true, message: '此项必填'},baseRules.sectionVal(),baseRules.illegalChar()],  //床号
  cname:[{ required: true, message: '此项必填'},baseRules.sectionVal(),baseRules.illegalChar()],  //姓名
  cage:[{ required: true, message: '此项必填'}, baseRules.numbers,baseRules.inputLen(0,20),baseRules.illegalChar()],  //年龄
  cbyVar:[{ required: true, message: '此项必填'},baseRules.inputLen(0,1000),baseRules.illegalChar()],  //样本的描述
  ctgjcZkqk:[{ required: true, message: '此项必填'},baseRules.inputLen(0,1000),baseRules.illegalChar()],  //分析报告

};

let largeCaseWriteList = {
  cname: [baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
  czyNo: [baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
}



/**
 *  - 临床操作记录 -
 */


let clinicalOperationWriteList = {
  name: [baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
}

let clinicalOperationWrite = {
  clinicalName: [{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
  podId: [{ required: true, message: '此项必填'}], // 病人名称
  clinicalTime: [{ required: true, message: '此项必填'}], // 病人名称
  clinicalType: [{ required: true, message: '此项必填'}], // 病人名称
  teacherName: [{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
  note: [baseRules.inputLen(0,500),baseRules.illegalChar()], // 病人名称
}


/**
 *  - 抢救记录 -
 */

let saveRecordWrite = {
  diseaseName: [{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
  podId: [{ required: true, message: '此项必填'}], // 病人名称
  tubeTime: [{ required: true, message: '此项必填'}], // 病人名称
  caseNumber: [{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
  teacherName: [{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
  note: [baseRules.inputLen(0,500),baseRules.illegalChar()], // 病人名称
}
/**
 *  - 管床记录 -
 */

let tubeBedRecordWrite = {
  diseaseName: [{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
  podId: [{ required: true, message: '此项必填'}], // 病人名称
  tubeTime: [{ required: true, message: '此项必填'}], // 病人名称
  caseNumber: [{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
  teacherName: [{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
  note: [baseRules.inputLen(0,500),baseRules.illegalChar()], // 病人名称
}

/**
 *  - 手术操作 -
 */

let operation = {
  podId: [{ required: true, message: '此项必填'}], // 科室名称
  surgeryName:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50)],  // 手术名称
  surgeryTime: [{ required: true, message: '此项必填'},baseRules.inputLen(0,50)], // 手术日期
  patientName: [{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()], // 病人名称
  recordNo:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50)],  // 病历号
  intraoperativePosition:[{ required: true, message: '此项必填'},baseRules.inputLen(0,50)],  // 术中职务
  note:[baseRules.inputLen(0,300)]
}


/**
 *  - 延期出科申请 -
 */

let delayGiven = {
  podId: [{ required: true, message: '此项必填'}], // 科室名称
  rtStartTime:[{ required: true, message: '此项必填'}],  // 轮转开始时间
  rtEndTime: [{ required: true, message: '此项必填'}], // 轮转结束时间
  note: [{ required: true, message: '此项必填'},baseRules.inputLen(0,500),baseRules.illegalChar()], // 轮转结束时间
}

let makeUpRotate = {
  ts: [baseRules.requiredNoEvent,baseRules.numberSection(1,100)]
}
/**
 *  - 科研日志 -
 */

let scientificResearchLogList = {
  logTitle: [baseRules.inputLen(0,20),baseRules.illegalChar()], // 科室名称
}
let scientificResearchLog = {
  logTitle: [{ required: true, message: '此项必填'},baseRules.inputLen(0,50),baseRules.illegalChar()], // 标题
  editTime: [{ required: true, message: '此项必填'}], // 时间
  fid: [{ required: true, message: '此项必填'}], // 附件
}

/**
 *  - 结业鉴定 -
 */

let applicationOfCompletion = {
  selfComment:[baseRules.requiredNoEvent,baseRules.inputLen(0,500),baseRules.illegalChar()]
}

export {
  givenSkillMakeUpAudit,
  entityWrite,
  entityWriteList,
  skillWrite,
  skillWriteList,
  electrocardiogramTemplate,
  largeCaseTemplate,
  imageTemplate,
  largeCaseWriteList,
  clinicalOperationWriteList,
  clinicalOperationWrite,
  saveRecordWrite,
  tubeBedRecordWrite,
  operation,
  delayGiven,
  // largeCaseWrite,
  makeUpRotate,

  scientificResearchLogList,
  scientificResearchLog,
  applicationOfCompletion,
};
