import _ from 'lodash';
import baseRules from '../../../formRules/base'; // 公共规则

/**
 * 住院医 - 专业基地
 **/
let jdManagement = {
  jdName: baseRules.required,        //基地名称
  jdProclass: baseRules.required,    //基地专业
  jdZrUsername: baseRules.requiredNoEvent,  //基地主任
  jdDep: [                           //基地科室,
    {
    type: 'array', required: true, message: '请至少添加一个科室',
  }],
};

// 档案完善时基本信息追加必填项
let basicAddRules = {
  sex:baseRules.requiredNoEvent,
  nation:baseRules.requiredNoEvent,
  birth:baseRules.requiredNoEvent,
  grade:baseRules.requiredNoEvent,
  origin:baseRules.requiredNoEvent,
  political:baseRules.requiredNoEvent,
  highestEdu:baseRules.requiredNoEvent,
  specialty:baseRules.requiredNoEvent,
  // school:baseRules.requiredNoEvent,
  idNumber:baseRules.requiredNoEvent,
  mobile:[baseRules.requiredNoEvent,baseRules.mobile],
  email:[baseRules.requiredNoEvent,baseRules.email],
  emgContact:baseRules.requiredNoEvent,
  emgContactMobile:[baseRules.requiredNoEvent,baseRules.mobile],
};

// 菜单树
let tree = {
  name:[baseRules.requiredNoEvent,baseRules.inputLen(1,50)],
  remark: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50)],
};

/**
 *  系统设置- 科室管理
 **/
let nosocomialList = {
  name:[baseRules.inputLen(0,20),baseRules.illegalChar()],   //科室名称
  code:[baseRules.inputLen(0,20),baseRules.illegalChar()],   //编号
  director:[baseRules.inputLen(0,20),baseRules.illegalChar()],   //科室主任
  secretary:[baseRules.inputLen(0,20),baseRules.illegalChar()],   //教学秘书
  nurse:[baseRules.inputLen(0,20),baseRules.illegalChar()],   //护士长
  capacity:[baseRules.inputLen(0,20),baseRules.illegalChar()],   //承载量

}
let nosocomial = {
  name:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()],   //科室名称
  //code:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()],   //编号
  //director:[baseRules.requiredNoEvent],   //科室主任
  //secretary:[baseRules.requiredNoEvent,],   //教学秘书
  //nurse:[baseRules.requiredNoEvent],   //护士长
  //ssyCapacity:[baseRules.requiredNoEvent,baseRules.greaterThanZero2,baseRules.inputLen(0,20)],   //实习生承载量
  //yjsCapacity:[baseRules.requiredNoEvent,baseRules.greaterThanZero2,baseRules.inputLen(0,20)],   //研究生承载量
  //zyyCapacity:[baseRules.requiredNoEvent,baseRules.greaterThanZero2,baseRules.inputLen(0,20)],   //住院医承载量
  //jxsCapacity:[baseRules.requiredNoEvent,baseRules.greaterThanZero2,baseRules.inputLen(0,20)],   //进修生承载量

}

/**
 *  系统设置- 分组管理
 **/
let groupList = {
  name:[baseRules.inputLen(0,20),baseRules.illegalChar()],   //组名称

}
let group = {
  name:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()],   //科室名称
  remark:[baseRules.inputLen(0,50),baseRules.illegalChar()],   //科室名称

}
/**
 *  系统设置- 来源单位
 **/
let sourceUnitList = {
  name:[baseRules.inputLen(0,20),baseRules.illegalChar()],   //名称
  contacts:[baseRules.inputLen(0,20),baseRules.illegalChar()],   //联系人
}
let sourceUnit = {
  name:[baseRules.requiredNoEvent,baseRules.inputLen(0,50),baseRules.illegalChar()],   //单位名称
  contacts:[baseRules.inputLen(0,50),baseRules.illegalChar()],   //联系人
  phone:[baseRules.mobile],   //联系电话
  remark:[baseRules.inputLen(0,500),baseRules.illegalChar()],   //备注
}
let systemLog = {
  account:[baseRules.inputLen(0,20),baseRules.illegalChar()],  //操作账号
  userName:[baseRules.inputLen(0,20),baseRules.illegalChar()],  //操作人
  ip:[baseRules.ip], //操作ip
}

//部门调动
let depMoveUser = {
  originalName:[{ required: true, message: '原科室不能为空'}],
  targetDepName:[{ required: true, message: '目标科室不能为空'}],
  userIds:[{ required: true, message: '未选被调人员,请选择左侧原科室并选择相应的被调人员'}],
}

export {
  jdManagement,
  basicAddRules,
  tree,
  systemLog,
  nosocomialList,
  nosocomial,

  groupList,
  group,

  sourceUnitList,
  sourceUnit,
  depMoveUser,
};
