/**
 * OSCE考核
 * 作者:zyc
 * 日期:2017-4-19
 */
const osceRouters = {
  path: 'osce',
  name: 'osce',
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'osce');
  },
  redirect: to => {
    return '/manage/osce/assessmentContent';
  },
  children: [{
    //考核内容
    path: 'assessmentContent',
    name: 'assessmentContent',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('../../components/osce/assessmentContent/assessmentContent_list.vue'));
      }, 'osce');
    }
  }, {
    //考核场次
    path: 'examineInterval',
    name: 'examineInterval',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('../../components/osce/examineInterval/examineInterval_list.vue'));
      }, 'osce');
    }
  }, {
    //考核监控
    path: 'examineMonitor',
    name: 'examineMonitor',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('../../components/osce/examineMonitor/examineMonitor_list.vue'));
      }, 'osce');
    }
  }, {
    //考核安排
    path: 'examinePlan',
    name: 'examinePlan',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('../../components/osce/examinePlan/examinePlan_list.vue'));
      }, 'osce');
    }
  },
    /***************************************** 老师角色使用 start ***********************************************/
    // {
    //   //考核安排 - 老师
    //   path: 'examinePlan_teacher',
    //   name: 'examinePlan_teacher',
    //   component: resolve => {
    //     require.ensure([], () => {
    //       resolve(require('../../components/osce/examinePlan/examinePlan_list_teacher'));
    //     }, 'osceTeacher');
    //   }
    // },
    {
      //考核评分
      path: 'examineScore',
      name: 'examineScore',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/osce/examineScore/examineScore'));
        }, 'osceTeacher');
      }
    },
    /****************************************** 老师角色使用 end *************************************************/
    {
      //成绩查询
      path: 'scoreQuery',
      name: 'scoreQuery',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/osce/scoreQuery/scoreQuery_list.vue'));
        }, 'osce');
      }
    }, {
      //统计系统
      path: 'statisticsAnalysis',
      name: 'statisticsAnalysis',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/osce/statisticsAnalysis/statisticsAnalysis_list.vue'));
        }, 'osce');
      }
    },
    {
      //成绩管理
      path: 'attendanceMaintenance',
      name: 'attendanceMaintenance',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/osce/attendanceMaintenance/attendanceMaintenance_list.vue'));
        }, 'osce');
      }
    },
    {
      //床边考核
      path: 'bedsideExamine',
      name: 'bedsideExamine',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/osce/bedsideExamine/bedsideExamine_list.vue'));
        }, 'osce');
      }
    },
    {
      //床边考核成绩管理
      path: 'bedsideExamineMarkManage',
      name: 'bedsideExamineMarkManage',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/osce/bedsideExamineMarkManage/bedsideExamineMarkManage_list.vue'));
        }, 'osce');
      }
    },
    {
      //我的考核
      path: 'myExamine',
      name: 'myExamine',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/osce/myExamine/myExamine_list.vue'));
        }, 'osce');
      }
    },
    {
      //候考信息
      path: 'waitingExamination',
      name: 'waitingExamination',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/osce/waitingExamination/waitingExamination_list.vue'));
        }, 'osce');
      }
    },
    {
      //一阶段考核
      path: 'stageExam',
      name: 'stageExam',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/osce/stageExam/stageExam_list.vue'));
        }, 'osce');
      }
    }
  ]
};

export default osceRouters;
