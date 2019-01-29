/*----- 实习生__实习大纲 --------------------------------------------------------------------------------*/
const dgFile = 'internship/outline';
/*----- 实习生__科室要求 --------------------------------------------------------------------------------*/
const depReFile = 'deprequirement';

const api = {
  /*----- 实习大纲 --------------------------------------------------------------------------------*/

  dgList: { // 实习大纲分页列表
    path: dgFile + '/pagelist',
    method: 'get'
  },
  dgAdd: { // 添加实习大纲
    path: dgFile + '/add',
    method: 'post'
  },
  dgEdit: { // 修改实习大纲 {outlineId}
    path: dgFile + '/modify',
    method: 'post'
  },
  dgDelete: { // 删除大纲 {outlineId}
    path: dgFile + '/delete',
    method: 'delete'
  },
  dgEnable: { // 启用大纲
    path: dgFile + '/modifyEnable',
    method: 'put'
  },
  dgDisable: { // 禁用大纲
    path: dgFile + '/modifyDisable',
    method: 'put'
  },
  dgGet: { // 查看单个实习大纲详情 {depOutlineId}
    path: dgFile + '/get',
    method: 'get'
  },
  dgDepSet: { // 根据学校和专业获取小组设置分类信息(自动安排轮转--分组安排轮转)
    path: dgFile + '/listOutlineDepSet',
    method: 'get'
  },
  dgToChannel: { // 大纲导入excel
    path: dgFile + '/upload',
    method: 'get'
  },
  schools: { //查询学校
    path: "/schools/queryList",
    method: 'get'
  },
  specialty: { //查询专业
    path: "/dictionary/getByCode/TRAINING_DIRECTION_SX",
    method: 'get'
  },
  searhDepAndSpecialty: { //查询所有启用的科室（查询所有启用的科室，不带分页）
    path: "/hospital/dept/queryAll",
    method: 'get'
  },

  /*----- 科室要求 --------------------------------------------------------------------------------*/
  depReList: { // 实习医院各个专业下科室轮转要求列表
    path: depReFile + '/pagelist',
    method: 'get'
  },
  depReAdd: { // 添加或修改科室要求
    path: depReFile + '/addOrModify',
    method: 'post'
  },
  depReDelete: { // 删除大纲 {depOutlineId}
    path: depReFile + '/delete',
    method: 'delete'
  },
  depReEnable: { // 启用科室要求 {depOutlineId}
    path: depReFile + '/modifyEnable',
    method: 'put'
  },
  depReDisable: { // 禁用科室要求 {depOutlineId}
    path: depReFile + '/modifyDisable',
    method: 'put'
  },
  depReGet: { // 根据科室要求主表ID获取所有科室要求 {depOutlineId}
    path: depReFile + '/get',
    method: 'get'
  },
  depReDistype: { // 根据父CODE获取父项，以及子项。(通用)
    path: '/dictionary/getByCode/conf_sx_dep_requires_distype',
    method: 'get'
  },
  depReDegree: { // 获取掌握程度
    path: '/dictionary/getByCode/ROTARY_MASTER_DEGREE',
    method: 'get'
  },
  getJxsModel: { // 获取进修生科室要求  改接口在进修生管理-轮转要求设置使用且跟实习生的轮转要求的修改页面公用
    path: '/deprequirement/getJxsModel',
    method: 'get'
  },
  getByDepth:{  //获取三级科室
    path:"/hospital/dept/getByDepth",
    method:"get"
  },
  etByKey:{
    path:"/rotaryConfig/getByKey/",
    method:"get"
  },


  /*----- 科室要求 --------------------------------------------------------------------------------*/
  // 实习费收费标准、大病历填写设置(大病历设置页面公用住院医)
  modifyConfigId: { // 实习费收费标准  黏贴比例修改  {configId}
    path: '/rotaryConfig/modify/',
    method: 'put'
  },
  chargingStandard: { // 获取实习费收费标准 -SXS -JXS
    path: '/rotaryConfig/getByKey/rotary_charging_standard-',
    method: 'get'
  },
  getByKey:{
    path: '/rotaryConfig/getByKey/',
    method: 'get'
  },

  deposit: { // 获取实习押金 -SXS -JXS
    path: '/rotaryConfig/getByKey/rotary_deposit-',
    method: 'get'
  },
  queryList: { // 获取实习押金 -SXS -JXS
    path: '/schools/queryList',
    method: 'get'
  },
  accommodation: { // 获取实习生住宿费 -SXS -JXS
    path: '/rotaryConfig/getByKey/rotary_accommodation-',
    method: 'get'
  },
  bigcaseIscopy: { // 黏贴查询是否黏贴 -SXS -JXS
    path: '/rotaryConfig/getByKey/rotary_bigcase_iscopy-',
    method: 'get'
  },
  bigcaseCopyscale: { // 黏贴比例查询 -SXS -JXS
    path: '/rotaryConfig/getByKey/rotary_bigcase_copyscale-',
    method: 'get'
  },
  getDepRequirement: { // 根据科室要求ID和科室ID 获取科室下的要求数据
    path: '/deprequirement/getDepRequirement/', // {depOutlineId}-{depId}-{podId}
    method: 'get'
  },





// 这块的内容跟住院医的代码公用
  /*//理论成绩合格分数
  theoryExamPassMark:{
    path: '/rotaryConfig/getByKey/theory_exam_pass_mark-SXS', // {configKey}-{userType}
    method: 'get'
  },
  //技能成绩合格分数
  skillExamPassMark:{
    path: '/rotaryConfig/getByKey/skill_exam_pass_mark-SXS', // {configKey}-{userType}
    method: 'get'
  },

  //出科综合成绩比例(理论、技能、日常)
  rotaryGivenDdepMarkRatio:{
    path: '/rotaryConfig/getByKey/rotary_givenDdep_markRatio-SXS', // {configKey}-{userType}
    method: 'get'
  },*/




};

export default api
