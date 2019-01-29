/**
 * Created by Administrator on 2017/9/3.
 */

import api from './ptOrganizationReexamine/api.js'


export default {
  /**-------专业-----*/
  //专业列表
  majorList: 'dictionary/getByCode/YJS_ZYDM', // 研究生专业代码
  // majorList:{
  //   path:'major/list',
  //   method: 'get'
  // },
  /**-------组织复试-----*/
  //根据人员专业查询未组织复试人员
  queryByPersonType: {
    path: 'enroll/person/queryByPersonType',
    method: 'get'
  },

  //添加组织复试信息
  retestAdd: {
    path: 'organize/retest/add',
    method: 'post'
  },
  //查看组织复试信息
  retestGet: {
    path: 'organize/retest/get/',//{id}
    method: 'get'
  },
  //组织复试列表   // 汇总复试添加和修改时调用此列表
  retestList: {
    path: 'organize/retest/list',//{id}
    method: 'get'
  },
  //修改组织复试
  retestModify: {
    path: 'organize/retest/modify/',//{id}
    method: 'put'
  },
  //删除复试信息
  retestRemoves: {
    path: 'organize/retest/removes',//{ids}
    method: 'delete'
  },

  /**-------汇总复试-----*/

  //添加汇总复试
  collectAdd: {
    path: 'collect/add',
    method: 'post'
  },
  //查看汇总复试信息
  collectGet: {
    path: 'collect/get/',//{id}
    method: 'get'
  },
  //汇总复试列表
  collectList: {
    path: 'collect/list',//{id}
    method: 'get'
  },
  //修改汇总复试
  collectModify: {
    path: 'collect/modify/modify/',//{id}
    method: 'put'
  },
  //删除汇总信息
  collectRemoves: {
    path: 'collect/removes/removes',//{ids}
    method: 'delete'
  },

  /**-------拟录取-----*/
  //拟录取列表
  quasiadmissionList: {
    path: 'enroll/person/quasiadmission/list',
    method: 'get'
  },
  //不拟录取
  nonadmission: {
    path: 'enroll/person/nonadmission',//{ids}
    method: 'put'
  },
  //拟录取
  quasiadmission: {
    path: 'enroll/person/quasiadmission',//{ids}
    method: 'put'
  },
  //放弃录取
  giveup: {
    path: 'enroll/person/giveup',//{ids}
    method: 'put'
  },
  //导出录取信息
  exportQuasiadmission: {
    path: '/api/enroll/person/excelExport',//{ids}
    method: 'get'
  },

  //导出报名报信息
  excelExport:{
    path:'/enroll/person/excelExport',
    method: 'get'
  },

  //设置综合排名
  ranking: {
    path: 'enroll/person/ranking/',//{id}
    method: 'put'
  },
  //成绩录入
  resultInput: {
    path: 'enroll/person/resultInput/',//{id}
    method: 'put'
  },
  //导入Excel成绩
  excelImportScore: {
    path: 'enroll/person/excelImport/score',//{ids}
    method: 'post'
  },

  /**-------录取-----*/

//不录取
  noEnroll: {
    path: 'enroll/person/noEnroll',//{ids}
    method: 'put'
  },
  //录取列表
  enrollList: {
    path: 'enroll/person/enroll/list',//{ids}
    method: 'get'
  },

  //导出录取信息
  excelExportEnterPerson: {
    path: '/api/enroll/person/excelExport/enterPerson',//
    method: 'get'
  },
  //正式录取
  personEnroll: {
    path: 'enroll/person/enroll',//
    method: 'put'
  },
  //从Excel导入录取人员
  excelImportEnroll: {
    path: 'enroll/person/excelImport/enroll',//
    method: 'post'
  },
  // 录取短信通知
  enrollMessage: {
    path: 'enroll/person/message',//
    method: 'put'
  },

  /**复试通知*/

  personList: api.personList,
  getByDepth: api.getByDepth,
  getDepth: '/hospital/dept/getByDepth',
  modifyReception: {//通知
    path: '/enroll/person/modifyReception/',//{ids}
    method: 'put'
  },
}
