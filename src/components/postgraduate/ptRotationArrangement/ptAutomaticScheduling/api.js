/*----- 住院医__轮转安排 --------------------------------------------------------------------------------*/
/*----- 轮转安排__自动排班 --------------------------------------------------------------------------------*/
const rotateSet ="/traineeRotary/arrangeRotary";
/*----- 轮转安排__手工调整 --------------------------------------------------------------------------------*/
const handWork ="/traineeRotary/arrangeRotary";

const api = {
  /*----- 轮转安排 --------------------------------------------------------------------------------*/
  //默认列表展示视图切换、导出
  rotaryListInit: { // 轮转人员列表展示  _ZYY  _YJS  _JXS
    path: '/traineeRotary/arrangeRotary/userMonthPagelist_',
    method: 'get'
  },
  rotaryListByUser: { // 轮转人员列表展示-按人员展示  _ZYY  _YJS  _JXS
    path: rotateSet + '/userRotaryPagelist_',
    method: 'get'
  },
  rotaryListByDep: { // 轮转人员列表展示-按科室展示  _ZYY  _YJS  _JXS
    path: rotateSet + '/userRotaryDepPagelist_',
    method: 'get'
  },

  //第一步选择基地
  getJdList:{  //获取基地列表
    path: '/rotaryBasis/BaseManage/getList',
    method: 'get'
  },

  //获取学校
  getSchoolList:{  //获取学校
    path: '/schools/queryList',
    method: 'get'
  },

  //第二步选择人员
  getUsersList:{  //根据专业获取所有未安排轮转的住院医 ZYY YJS JXS
    path: '/traineeRotary/arrangeRotary/getRotaryUser/',
    method: 'get'
  },

  //第三步选择培训标准
  getRulesList:{  //细则集合
    path: '/rotaryBasis/rulesTraining/rulesget/list',
    method: 'get'
  },

  //第五步确认预览
  rotaryDeptUser:{  //自动安排-按人员排班预览 _ZYY _YJS _JXS
    path: "/traineeRotary/arrangeRotary/rotaryDeptMonthUser_",
    method: 'post'
  },


  setRotaryViewData:{  //保存轮转数据  _ZYY _YJS _JXS   //todo 好像这个接口没有用到(全局没有搜索到)
    path: '/traineeRotary/arrangeRotary/rotaryDeptMonthUser_',
    method: 'post'
  },

  //第五步选择基地

  //第六步选择基地

  //第七步选择基地

  //保存轮转表
  regrotaryDept:{  //自动安排-过程中安排轮转(按组或人 预览轮转表后点击确定按钮时调用此接口)   _ZYY _YJS _JXS
    path: rotateSet + '/regrotaryDept_',
    method: 'post'
  },
  userRotaryExportExcel:{   //人员轮转表导出excel   _ZYY _YJS _JXS
    path: rotateSet + '/userRotaryExportExcel_',
    method: 'get'
  },
  userRotaryDepExportExcel:{  //轮转人员按科室展示导出excel   _ZYY _YJS _JXS
    path: rotateSet + '/userRotaryDepExportExcel_',
    method: 'get'
  },
  userRotaryByUserId:{  //根据人员ID和人员类型查看轮转表(自动排班--查看轮转表)  {userType}-{userId} 例如:SXS-100
    path: rotateSet + '/userRotaryByUserId',
    method: 'get'
  },


  /*----- 手工调整 --------------------------------------------------------------------------------*/

  restoreRotary:{ // 恢复轮转  {userId}
    path: handWork + '/restoreRotary',
    method: 'post'
  },
  pauseRotary:{ // 暂停轮转  {userId}
    path: handWork + '/pauseRotary',
    method: 'post'
  },
  deleteRotary:{ // 删除轮转 _ZYY _YJS _JSX
    path: handWork + '/deleteRotary_',
    method: 'delete'
  },
  getRotaryDepIndo:{  //微调-查看用户轮转表  {userId}_ZYY {userId}_YJS {userId}_JSX
    path: handWork + '/getRotaryDepIndo',
    method: 'get'
  },
  regUserMicrCtrol:{  //手工调整--轮转微调  保存微调的数据
    path: handWork + '/regUserMicrCtrol',
    method: 'post'
  },
  rtuserPagelist:{  //手工调整--轮转微调人员列表 _ZYY _YJS _JSX
    path: handWork + '/rtuserPagelist_',
    method: 'get'
  },
  getDepPagelist:{  //手工调整--获取微调的科室 {rtId}
    path: '/rotaryBasis/rulesTraining/getRulesDepInfoList',
    method: 'get'
  },

  /*----- 带教秘书安排轮转 --------------------------------------------------------------------------------*/
  getDepTree:{  //获取所有院内科室
    path:"/hospital/dept/getQueryTreeByManager",
    method:"get",
  },
  getDepRotaryUser:{  //科室轮转人员(带教秘书管理的科室)
    path: '/traineeRotary/arrangeRotary/getDepRotaryUser',
    method: 'get'
  },
  modifyDepRotaryData:{  //三级科室分配设置轮转科室
    path: '/rotationProcess/rotaryTable/modifyDepRotaryData',
    method: 'post'
  },
  queryDepRotaryDeptByPrePodId:{  //根据轮转id获取三级科室下轮转的数据 -{podId}
    path: '/traineeRotary/arrangeRotary/queryDepRotaryDeptByPrePodId-',
    method: 'get'
  },
};

export default api

