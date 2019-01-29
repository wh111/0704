/*
* 模块名称:教学活动
* 作者:zyc
* 日期:2017-3-31
* */

//课程表
const syllabus = '@/components/teach/teachingActivities/syllabus';
//教学活动设置
const activitiesSet = '@/components/teach/teachingActivities/teachingActivitiesSet/teachingActivitiesSet_list.vue';
//我的活动 教学经历  活动设置
const jxhdRouters = {
  path: 'jxhd',
  name: 'jxhd',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'jxhd');
  },
  redirect: to => {
    return '/manage/jxhd/kcb'
  },
  children:[{
    //课程表
    path:'syllabus',
    name:'syllabus',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingActivities/syllabus/syllabus_list.vue'));
      }, 'jxhd');
    }
  },{
    //教学活动设置
    path:'teachingActivitiesSet',
    name:'teachingActivitiesSet',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingActivities/teachingActivitiesSet/teachingActivitiesSet_list.vue'));
      }, 'jxhd');
    }
  },{
      //科内教学
      path:'conezTeaching',
      name:'conezTeaching',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/teach/teachingActivities/conezTeaching/conezTeaching_list.vue'));
        }, 'jxhd');
      }
    },
    {
    //我的活动
    path:'myActivities',
    name:'myActivities',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingActivities/myActivities/myActivities_list.vue'));
      }, 'jxhd');
    }
  },{
    //教学经历
    path:'teachingExperience',
    name:'teachingExperience',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingActivities/teachingExperience/teachingExperience_list.vue'));
      }, 'jxhd');
    }
  },{
    //活动设置
    path:'myRating',
    name:'myRating',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingActivities/myRating/myRating_list.vue'));
      }, 'jxhd');
    }
  },
  {
    //我的课程表
    path:'usersyllabus',
    name:'usersyllabus',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingActivities/usersyllabus/usersyllabus_list.vue'));
      }, 'jxhd');
    }
  },
  {
    //授课安排
    path:'hostUsersyllabus',
    name:'hostUsersyllabus',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingActivities/hostUsersyllabus/hostUsersyllabus_list.vue'));
      }, 'jxhd');
    }
  },
  {
    //课程安排
    path:'manageUsersyllabus',
    name:'manageUsersyllabus',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingActivities/manageUsersyllabus/manageUsersyllabus_list.vue'));
      }, 'jxhd');
    }
  },
  {
    //教学计划
    path:'teachplan',
    name:'teachplan',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingActivities/teachplan/teachplan_list.vue'));
      }, 'jxhd');
    }
  },
  {
    //教学计划查看
    path:'teachplanlook',
    name:'teachplanlook',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingActivities/teachplanlook/teachplanlook_list.vue'));
      }, 'jxhd');
    }
  },
  {
    //教学计划执行情况
    path:'teachplanPerformcase',
    name:'teachplanPerformcase',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingActivities/teachplanPerformcase/teachplanPerformcase_list.vue'));
      }, 'jxhd');
    }
  },
    {
      //教学计划审核
      path: 'teachplanAudit',
      name: 'teachplanAudit',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/teach/teachingActivities/teachplanAudit/teachplanAudit_list.vue'))
        }, 'jxhd')
      },
    },
    {
      //周任务计划
      path: 'monthlyTaskPlan',
      name: 'monthlyTaskPlan',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/teach/teachingActivities/monthlyTaskPlan/monthlyTaskPlan_list.vue'));
        }, 'jxhd');
      },
    },
  ]
}

export default jxhdRouters;
