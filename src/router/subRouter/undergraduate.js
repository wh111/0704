/**
 * 本科教育
 * 作者:zyc
 * 日期:2017-5-18
 */
const underRouters = {
  path: 'undergraduate',
  name: 'undergraduate',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'undergraduate');
  },
  redirect: to => {
    return '/manage/undergraduate/calendar'
  },
  children: [{
    //周历
    path: 'calendar',
    name: 'calendar',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('../../components/intern/undergraduateEdu/calendar/calendar_list.vue'));
      }, 'undergraduate');
    }
  },
    {
      //课程表管理
      path: 'syllabusManagement',
      name: 'syllabusManagement',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/undergraduateEdu/syllabusManagement/syllabusManagement_list.vue'));
        }, 'undergraduate');
      }
    },
    {
      //我的课程表  学员
      path: 'mySyllabus',
      name: 'mySyllabus',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/undergraduateEdu/mySyllabus/mySyllabus_list.vue'));
        }, 'undergraduate');
      }
    },
    {
      //授课安排 老师
      path: 'teachingSchedule',
      name: 'teachingSchedule',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/undergraduateEdu/teachingSchedule/teachingSchedule_list.vue'));
        }, 'undergraduate');
      }
    },
    {
      //课程安排  教育处
      path: 'courseArrangement',
      name: 'courseArrangement',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/undergraduateEdu/courseArrangement/courseArrangement_list.vue'));
        }, 'undergraduate');
      }
    },
    {
      //专家评老师
      path: 'specialist',
      name: 'specialist',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/undergraduateEdu/specialist/specialist_list.vue'));
        }, 'undergraduate');
      }
    },
    {
      //课程资料
      path: 'syllabusData',
      name: 'syllabusData',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/undergraduateEdu/syllabusData/syllabusData_list.vue'));
        }, 'undergraduate');
      }
    },
    {
      //签到记录
      path: 'signInRecord',
      name: 'signInRecord',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/undergraduateEdu/signInRecord/signInRecord_list.vue'));
        }, 'undergraduate');
      }
    },
    {
      //人员管理
      path: 'bkusersManagement',
      name: 'bkusersManagement',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/undergraduateEdu/bkusersManagement/bkusersManagement_list.vue'));
        }, 'undergraduate');
      }
    },
    {
      //课程审核
      path: 'courseExamineApprove',
      name: 'courseExamineApprove',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/undergraduateEdu/courseExamineApprove/courseExamineApprove_list.vue'));
        }, 'undergraduate');
      }
    },
    {
      //科室课程表
      path: 'depCourseArrangement',
      name: 'depCourseArrangement',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/undergraduateEdu/depCourseArrangement/depCourseArrangement_list.vue'));
        }, 'undergraduate');
      }
    },
    {
      //教研室课程审核
      path: 'staffRoomFineTuningReview',
      name: 'staffRoomFineTuningReview',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/undergraduateEdu/staffRoomFineTuningReview/staffRoomFineTuningReview_list.vue'));
        }, 'undergraduate');
      }
    },
    {
      //三级科室管理
      path: 'depSyllabusManagement',
      name: 'depSyllabusManagement',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/undergraduateEdu/depSyllabusManagement/depSyllabusManagement_list.vue'));
        }, 'undergraduate');
      }
    },
    {
      //课程统计
      path: 'depCourseStatic',
      name: 'depCourseStatic',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/undergraduateEdu/depCourseStatistics/depCourseStatistics_list.vue'));
        }, 'undergraduate');
      }
    },
    {
      //课程大纲
      path: 'curriculumOutline',
      name: 'curriculumOutline',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/undergraduateEdu/curriculumOutline/curriculumOutline_list.vue'));
        }, 'undergraduate');
      }
    },
  ]
};

export default underRouters;
