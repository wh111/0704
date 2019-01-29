/**
 * Created by Administrator on 2017/7/24.
 */

const api = {
  rulesgetGet: {//细则-查看-第一步 科室周期设置
    path: '/rotaryBasis/rulesTraining/rulesget/',//{rtId}
    method: 'get'
  },

  rulesDepRequirementAddOrEdit: {//第二步-添加或修改科室指标
    path: '/rotaryBasis/rulesTraining/rulesDepRequirementAddOrEdit/',//{rtId}-{rdId}
    method: 'post'
  },

  rulesAddOrEdit: {//添加-第一步-设置周期
    path: '/rotaryBasis/rulesTraining/rulesAddOrEdit',//
    method: 'post'
  },
  rulesgetPageList: {//细则分页列表
    path: '/rotaryBasis/rulesTraining/rulesget/pageList',//
    method: 'get'
  },
  rulesgetList: {//细则集合
    path: '/rotaryBasis/rulesTraining/rulesget/list',//
    method: 'get'
  },
  modifyRulesState: {//细则启用禁用
    path: '/rotaryBasis/rulesTraining/modifyRulesState',//{rtId}
    method: 'put'
  },
  removeRules: {//细则删除
    path: '/rotaryBasis/rulesTraining/removeRules',//{rtId}
    method: 'delete'
  },
  getRulesDepRequirement: {//第二步-查看科室指标
    path: '/rotaryBasis/rulesTraining/getRulesDepRequirement/',//{rtId}-{rdId}
    method: 'get'
  },
  getRulesDep: {//第二步-查看科室指标
    path: '/rotaryBasis/rulesTraining/getRulesDep/',//{rtId}
    method: 'get'
  },
  // searhDepAndSpecialty: { //查询所有启用的科室（查询所有启用的科室，不带分页）
  //   path: "/hospital/dept/queryAll",
  //   method: 'get'
  // },
  searhDepAndSpecialty: { //查询标准科室科室（查询所有启用的科室，不带分页）
    path: "/criterion/dept/list",
    method: 'get'
  },
  disType: { //第二部分类
    path: "/dictionary/getByCode/conf_sx_dep_requires_distype",
    method: 'get'
  },

  uploadExcel: { //导入
    path: "/rotaryBasis/rulesTraining/rulesget/uploadExcel",
    method: 'post'
  },

  BaseManageGetList: { //基地集合
    path: "/rotaryBasis/BaseManage/getList",
    method: 'get'
  },
  //大病历设置
  modifyConfigId: { // 住院医黏贴比例修改  {configId}
    path: '/rotaryConfig/modify/',
    method: 'put'
  },
  bigcaseIscopy: { // 黏贴查询是否黏贴 -ZYY -YJS -JXS
    path: '/rotaryConfig/getByKey/rotary_bigcase_iscopy-',
    method: 'get'
  },
  bigcaseCopyscale: { // 黏贴比例查询 -ZYY -YJS -JXS
    path: '/rotaryConfig/getByKey/rotary_bigcase_copyscale-',
    method: 'get'
  },

  //科室对照表

  getRulesDepContrastTable: { // 配置-查看标准科室对照关系列表  {rtId}
    path: '/rotaryBasis/rulesTraining/getRulesDepContrastTable/',
    method: 'get'
  },

  getRulesDepHgGroup: { // 配置-查看标准科室对照关系列表  {rtId}_{rdId}
    path: '/rotaryBasis/rulesTraining/getRulesDepHgGroup/',
    method: 'get'
  },

  rulesDepHgGroupAddOrEdit: { // 配置-添加或修改分组-保存数据
    path: '/rotaryBasis/rulesTraining/rulesDepHgGroupAddOrEdit',
    method: 'post',
  },

  removeRulesDepHgGroup: {   //配置-分组列表-删除单个分组 {hgId}
    path: '/rotaryBasis/rulesTraining/removeRulesDepHgGroup/',
    method: 'delete',
  },

  getDepTree: {  //获取所有院内科室  此接口可能暂时不用了更换为getByDepth
    path: "/hospital/dept/tree",
    method: "get",
  },

  getByDepth: {  //获取三级科室
    path: "/hospital/dept/getByDepth",
    method: "get"
  },

  getRulesDepHgGroupByHgId: {  //配置-修改-查看单个分组详情 {hgId}
    path: "/rotaryBasis/rulesTraining/getRulesDepHgGroupByHgId/",
    method: "get",
  },

  //理论成绩合格分数
  theoryExamPassMark: {  //-ZYY -YJS -JXS
    path: '/rotaryConfig/getByKey/theory_exam_pass_mark-', // {configKey}-{userType}
    method: 'get'
  },
  //技能成绩合格分数
  skillExamPassMark: {  //-ZYY -YJS -JXS
    path: '/rotaryConfig/getByKey/skill_exam_pass_mark-', // {configKey}-{userType}
    method: 'get'
  },

  //出科综合成绩比例(理论、技能、日常)
  rotaryGivenDdepMarkRatio: {
    path: '/rotaryConfig/getByKey/rotary_givenDdep_markRatio-', // {configKey}-{userType}
    method: 'get'
  },

  /**住院医短信模板*/
  //住院医短信模板-修改
  smsTemplateModify: {
    path: '/smsTemplate/modify/', // {id}
    method: 'put'
  },
  //住院医短信模板-查看
  smsTemplateGet: {
    path: '/smsTemplate/get/', // {id}
    method: 'get'
  },
  //住院医短信模板分页列表
  smsTemplatePageList: {
    path: '/smsTemplate/pageList',
    method: 'get'
  },

};

export default api

