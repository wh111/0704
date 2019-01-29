/*
 * 模块名称:师资档案
 * 日期:2018-10-30
 * */

const examination = {
  path: 'teachingArchives',
  name: 'teachingArchives',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'))
    }, 'teachingArchives')
  },
  redirect: to => {
    return '/manage/teachArchives/teachingBulid'
  },
  children: [
    {
      //教学建设
      path: 'teachingBulid',
      name: 'teachingBulid',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/EvaluationPerformance/teachArchives/teachingConstruction/teachingConstruction_list.vue'))
        }, 'teachingArchives')
      },
    },
    {
      //教学研究
      path: 'teachingResearch',
      name: 'teachingResearch',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/EvaluationPerformance/teachArchives/teachingResearch/teachingResearch_list.vue'))
        }, 'teachingArchives')
      },
    },
    {
      //教学奖励
      path: 'teachingAwards',
      name: 'teachingAwards',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/EvaluationPerformance/teachArchives/teachingAwards/teachingAwards_list.vue'))
        }, 'teachingArchives')
      },
    },
    {
      //个人能力提升
      path: 'PersonalImprovement',
      name: 'PersonalImprovement',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/EvaluationPerformance/teachArchives/personalImprovement/personalImprovement_list.vue'))
        }, 'teachingArchives')
      },
    },
    {
      //公共教学活动
      path: 'PublicTeachingActivities',
      name: 'PublicTeachingActivities',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/EvaluationPerformance/teachArchives/publicTeachingActivities/publicTeachingActivities_list.vue'))
        }, 'teachingArchives')
      },
    },
  ],
}
export default examination

