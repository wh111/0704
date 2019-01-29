/*
 * 模块名称:绩效指标统计
 * 日期:2018-10-15
 * */

const perstatistion = {
  path: 'perstatistics',
  name: 'perstatistics',
  meta: {
    requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
  },
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'perstatistics');
  },
  redirect: to => {
    return '/manage/jiXiaoPingGu/teaperstatistic';
  },
  children: [
    {
      //绩效指标统计-教师
      path: 'teaperstatistic',
      name: 'teaperstatistic',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/EvaluationPerformance/jiXiaoPingGu/teaperstatistic/teaperstatistic_list.vue'));
        }, 'perstatistics');
      }
    }, {
      //绩效指标统计-学生
      path: 'stuperstatistic',
      name: 'stuperstatistic',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/EvaluationPerformance/jiXiaoPingGu/stuperstatistic/stuperstatistic_list.vue'));
        }, 'perstatistics');
      }
    }, {
      //绩效指标统计-教研室
      path: 'jysperstatistic',
      name: 'jysperstatistic',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/EvaluationPerformance/jiXiaoPingGu/jysperstatistic/jysperstatistic_list.vue'));
        }, 'perstatistics');
      }
    }
  ]
};
export default perstatistion;

