/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:进修管理-轮转安排
 * 作者:gx
 * 日期:2017/9/3
 *
 * @date     2017/9/3
 * @author   gx
 */


const emRotationArrangementRouters = {
  path: 'emRotationArrangement',
  name: 'emRotationArrangement',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'emRotationArrangement');
  },
  redirect: to => {
    return '/manage/emRotationArrangement/emAutomaticScheduling'
  },
  children:[
    {
      //自动排班
      path:'emAutomaticScheduling',
      name:'emAutomaticScheduling',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/emRotationArrangement/emAutomaticScheduling/emAutomaticScheduling_list.vue'));
        }, 'emRotationArrangement');
      }
    },
    {
      //手工调整
      path:'emAdjustManually',
      name:'emAdjustManually',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/emRotationArrangement/emAdjustManually/emAdjustManually_list.vue'));
        }, 'emRotationArrangement');
      }
    },
    {
      //安排轮转-带教秘书
      path:'emArrangeRotation',
      name:'emArrangeRotation',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/emRotationArrangement/emArrangeRotation/emArrangeRotation_list.vue'));
        }, 'emRotationArrangement');
      }
    },
  ]
}

export default emRotationArrangementRouters;
