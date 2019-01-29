/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:研究生管理-轮转安排
 * 作者:gx
 * 日期:2017/9/3
 *
 * @date     2017/9/3
 * @author   gx
 */


const ptRotationArrangementRouters = {
  path: 'ptRotationArrangement',
  name: 'ptRotationArrangement',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'ptRotationArrangement');
  },
  redirect: to => {
    return '/manage/ptRotationArrangement/ptAutomaticScheduling'
  },
  children:[
    {
      //自动排班
      path:'ptAutomaticScheduling',
      name:'ptAutomaticScheduling',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptRotationArrangement/ptAutomaticScheduling/ptAutomaticScheduling_list.vue'));
        }, 'ptRotationArrangement');
      }
    },
    {
      //手工调整
      path:'ptAdjustManually',
      name:'ptAdjustManually',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptRotationArrangement/ptAdjustManually/ptAdjustManually_list.vue'));
        }, 'ptRotationArrangement');
      }
    },
    {
      //安排乱转-带教秘书
      path:'ptArrangeRotation',
      name:'ptArrangeRotation',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptRotationArrangement/ptArrangeRotation/ptArrangeRotation_list.vue'));
        }, 'ptRotationArrangement');
      }
    },
  ]
}

export default ptRotationArrangementRouters;
