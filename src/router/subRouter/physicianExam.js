/**
 * 国家医师考核
 * 作者:yc
 * 日期:2018-05-21
 */
const physicianExamRouters = {
  path: 'physicianExam',
  name: 'physicianExam',
  meta: {
    requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
  },
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'physicianExam');
  },
  redirect: to => {
    return '/manage/physicianExam/physicianExamineInterval'
  },
  children: [{
      //考核管理
      path: 'physicianExamineInterval',
      name: 'physicianExamineInterval',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/physicianExam/physicianExamineInterval/physicianExamineInterval_list'));
        }, 'physicianExamineInterval');
      }
    },
    {
      //考核监控
      path: 'physicianExamineMonitor',
      name: 'physicianExamineMonitor',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/physicianExam/physicianExamineMonitor/physicianExamineMonitor_list'));
        }, 'physicianExamineInterval');
      }
    },
    {
      //候考信息
      path: 'physicianWaitingExamination',
      name: 'physicianWaitingExamination',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/physicianExam/physicianWaitingExamination/physicianWaitingExamination_list'));
        }, 'physicianExamineInterval');
      }
    },
    {
      //倒计时
      path: 'physicianAssessmentTime',
      name: 'physicianAssessmentTime',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/physicianExam/physicianAssessmentTime/physicianAssessmentTime_list'));
        }, 'physicianExamineInterval');
      }
    },
  ]
}

export default physicianExamRouters;
