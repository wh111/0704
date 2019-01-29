/**
 * 住院医-轮转安排
 * 作者:zyc
 * 日期:2017-7-21
 */
const zyyRouters = {
  path: 'rdyRotationArrangement',
  name: 'rdyRotationArrangement',
  meta: {
    requireAuth: false,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'rdyRotationArrangement');
  },
  redirect: to => {
    return '/manage/rdyRotationArrangement/rdyAutomaticScheduling'
  },
  children: [{
    //自动排班
    path: 'rdyAutomaticScheduling',
    name: 'rdyAutomaticScheduling',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('../../components/zyy/rdyRotationArrangement/rdyAutomaticScheduling/rdyAutomaticScheduling_list.vue'));
      }, 'rdyRotationArrangement');
    }
  }, {
    //手工调整
    path: 'rdyAdjustManually',
    name: 'rdyAdjustManually',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('../../components/zyy/rdyRotationArrangement/rdyAdjustManually/rdyAdjustManually_list.vue'));
      }, 'rdyRotationArrangement');
    }
  },
    {
      //安排乱转-带教秘书
      path: 'rdyArrangeRotation',
      name: 'rdyArrangeRotation',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/zyy/rdyRotationArrangement/rdyArrangeRotation/rdyArrangeRotation_list.vue'));
        }, 'rdyRotationArrangement');
      }
    },
    {
      //微调审核
      path: 'FineTuningReview',
      name: 'FineTuningReview',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/zyy/rdyRotationArrangement/FineTuningReview/FineTuningReview_list.vue'));
        }, 'rdyRotationArrangement');
      }
    },

  ]
}

export default zyyRouters;
