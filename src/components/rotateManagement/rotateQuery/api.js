/*----- 实习生__轮转查询 --------------------------------------------------------------------------------*/
const rotateQuery = 'rotationProcess/rotaryTable';
const api = {
  getRotaryInfos: {
    path: rotateQuery + '/getRotaryInfos',
    method: 'get',
  },
  myRotaryInfo: {
    path: rotateQuery + '/myRotaryInfo',
    method: 'get',
  },

  /** 轮转手册（实习生，进修生）*/
  rotaryManulList: { //pagelist
    path: '/rotaryManul/pagelist',
    method: 'get',
  },
  rotaryManulGet: { //轮转手册查看
    path: '/rotaryManul/get/', //{userId}
    method: 'get',
  },
  rotaryManulExport: { //导出轮转手册 （Word）
    path: '/rotaryManul/exportWord/', //{userId}
    method: 'get',
  },

  /** 培训档案（实习生，住院医）*/
  archivesList: { //培训档案列表
    path: '/traineeRotary/archives/pageList',
    method: 'get',
  },
  archivesGet: { //培训档案查看
    path: '/traineeRotary/archives/get/', //{userId}-{userType}
    method: 'get',
  },
  archivesExport: { //导出培训档案（Word）
    path: '/traineeRotary/archives/exportWord-', //{userType}-{userId}
    method: 'get',
  },

  /**轮转表查询*/
  rotaryListByUser: { //人员列表（Word）
    path: '/traineeRotary/arrangeRotary/userRotaryInfo', //{userType}
    method: 'get',
  },

  userRotaryInfoExportExcel: {//导出（人员）
    path: '/traineeRotary/arrangeRotary/userRotaryInfoExportExcel', //{userType}
    method: 'get',
  },
  rotaryListByDep: {//科室列表(科室)
    path: '/traineeRotary/arrangeRotary/userRotaryDeptInfo', //{userType}
    method: 'get',
  },
  userRotaryDeptInfoExportExcel: {//导出(科室)
    path: '/traineeRotary/arrangeRotary/userRotaryDeptInfoExportExcel', //{userType}
    method: 'get',
  },
  //选择基地(培训方向)
  getJdList: {  //获取基地列表
    path: '/rotaryBasis/BaseManage/getList',
    method: 'get'
  },
  /**轮转统计情况*/
  queryRotaryAndOutDepConditionDtoList: { //轮转统计列表
    path: '/rotationProcess/rotaryTable/queryRotaryAndOutDepConditionDtoList',
    method: 'get',
  },
  getByPodId: { //根据podId获得轮转要求完成情况
    path: '/rotationProcess/rotaryTable/getByPodId/', //{podId}
    method: 'get',
  },
}

export default api
