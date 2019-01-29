export default {
  /**课时费设置*/
  /*** 费用设置文本框 */
  allList: { //查询所有费用设置文本框
    path: '/feeSet/allList',
    method: 'get',
  },
  modifyBatch: { //批量修改所有费用设置文本框
    path: '/feeSet/modifyBatch',
    method: 'put',
  },

  /*** 补助设置 */
  allowanceConfigAllList: { //查询所有补助设置
    path: '/allowanceConfig/allList',
    method: 'get',
  },
  allowanceConfigGet: { //查询单个补助设置
    path: '/allowanceConfig/get/',//{id}
    method: 'get',
  },

  allowanceConfigAddList: { //批量添加补助设置
    path: '/allowanceConfig/addList',
    method: 'post',
  },
  allowanceConfigAdd: { //单个添加补助设置（有批量，可不用
    path: '/allowanceConfig/add',
    method: 'post',
  },

  allowanceConfigModify: { //修改 补助设置
    path: '/allowanceConfig/modify/',//{id}
    method: 'put',
  },

  allowanceConfigRemove: { //删除补助设置
    path: '/allowanceConfig/remove',//{ids}
    method: 'delete',
  },

  /*** 月度设置 */
  monthlyConfigAllList: { //查询所有月度设置
    path: '/monthlyConfig/allList',
    method: 'get',
  },
  monthlyConfigGet: { //获得单个月度设置
    path: '/monthlyConfig/get/',//{id}
    method: 'get',
  },
  monthlyConfigAddList: { //批量添加月度设置
    path: '/monthlyConfig/addList',
    method: 'post',
  },
  monthlyConfigAdd: { //单个添加月度设置（有批量，可不用）
    path: '/monthlyConfig/add',
    method: 'post',
  },
  monthlyConfigModify: { //修改月度设置
    path: '/monthlyConfig/modify/',//{id}
    method: 'put',
  },
  monthlyConfigRemove: { //删除月度设置
    path: '/monthlyConfig/remove',
    method: 'delete',
  },

  /*** 所有月度考核综合成绩设置 */
  totalScoreConfigAllList: { //查询所有月度考核综合成绩设置
    path: '/monthlyExamineTotalScoreConfig/allList',
    method: 'get',
  },

  totalScoreConfigGet: { //获得单个月度考核综合成绩设置
    path: '/monthlyExamineTotalScoreConfig/get/',//{id}
    method: 'get',
  },
  totalScoreConfigAddList: { //批量添加月度考核综合成绩设置
    path: '/monthlyExamineTotalScoreConfig/addList',
    method: 'post',
  },
  totalScoreConfigAdd: { //单个添加月度考核综合成绩设置（有批量，可不用）
    path: '/monthlyExamineTotalScoreConfig/add',
    method: 'post',
  },
  totalScoreConfigModify: { //修改 月度考核综合成绩设置
    path: '/monthlyExamineTotalScoreConfig/modify/',//{id}
    method: 'put',
  },
  totalScoreConfigRemove: { //删除月度考核综合成绩设置
    path: '/monthlyExamineTotalScoreConfig/remove',//{ids}
    method: 'delete',
  },

  /*** 轮转统计 */
  rotaryTeachStatistics: { //轮转统计---按带教老师查询
    path: '/rotationProcess/rotaryTable/rotaryTeachStatistics',
    method: 'get',
  },
  rotaryDeptStatistics: { //轮转统计---按科室查询
    path: '/rotationProcess/rotaryTable/rotaryDeptStatistics',
    method: 'get',
  },
  /*** 学员薪资统计 */
  salaryStatisticsList: { //学员薪资统计列表
    path: '/salaryStatistics/list',
    method: 'get',
  },
  salaryStatisticsGet: { //学员薪资统计列表
    path: '/salaryStatistics/get/',//{userId}
    method: 'get',
  },
  exportStuSalary: { //学员薪资导出
    path: '/salaryStatistics/exportStuSalary',//
    method: 'get',
  },
  /*** 师资劳务统计 */
  teacherLaborStatisticsList: { //师资劳务统计
    path: '/rotationProcess/rotaryTable/teacherLaborStatistics',
    method: 'get',
  },
  teacherLaborStatisticsGet: { //师资劳务统计获取单个
    path: '/rotationProcess/rotaryTable/teacherLaborStatistics/get',
    method: 'get',
  },
  exportTeachSalary: { //教师薪资导出
    path: '/rotationProcess/rotaryTable/exportTeachSalary',
    method: 'get',
  },

}
