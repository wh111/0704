/*
 * 模块名称:绩效评估
 * 日期:2018-10-15
 * */

const examination = {
  path: 'permaintenance',
  name: 'permaintenance',
  meta: {
    requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
  },
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'permaintenance');
  },
  redirect: to => {
    return '/manage/jiXiaoPingGu/perteach';
  },
  children: [
    {
      //绩效指标维护-教师
      path: 'perteach',
      name: 'perteach',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/EvaluationPerformance/jiXiaoPingGu/perteach/perteach_list.vue'));
        }, 'permaintenance');
      }
    }, {
      //绩效指标维护-学生
      path: 'perstudent',
      name: 'perstudent',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/EvaluationPerformance/jiXiaoPingGu/perstudent/perstudent_list.vue'));
        }, 'permaintenance');
      }
    }, {
      //绩效指标维护-教研室
      path: 'perstaff',
      name: 'perstaff',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/EvaluationPerformance/jiXiaoPingGu/perstaff/perstaff_list.vue'));
        }, 'permaintenance');
      }
    }
  ]
};
export default examination;

