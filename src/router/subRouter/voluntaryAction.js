/**
 * 模块名称:日常管理-志愿者活动
 * 作者:zyc
 * 日期:2017-4-6
 *
 * @date     2017-06-26
 * @author   zyc<332533011@qq.com>
 */
const actionRouters = {
  path: 'voluntaryAction',
  name: 'voluntaryAction',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'voluntaryAction');
  },
  redirect: to => {
    return '/manage/voluntaryAction/volunteerActivity'
  },
  children:[
    {
      //志愿者活动
      path:'volunteerActivity',
      name:'volunteerActivity',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/daily/dailyManagement/volunteerActivity/volunteerActivity_list.vue'));
        }, 'voluntaryAction');
      }
    },
    {
      //参加志愿者活动
      path:'joinVoluntaryAction',
      name:'joinVoluntaryAction',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/daily/dailyManagement/joinVoluntaryAction/joinVoluntaryAction_list.vue'));
        }, 'voluntaryAction');
      }
    }
  ]
}

export default actionRouters;
