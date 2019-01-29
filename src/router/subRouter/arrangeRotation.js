/**
 * 安排轮转
 * 作者:gx
 * 日期:2017-7-3
 */
const rotateRouters = {
  path: 'arrangeRotation',
  name: 'arrangeRotation',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'arrangeRotation');
  },
  redirect: to => {
    return '/manage/arrangeRotation/arrangeRotaryRotation'
  },
  children: [
    {
      //安排轮转
      path: 'arrangeRotaryRotation',
      name: 'arrangeRotaryRotation',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/arrangeRotation/arrangeRotaryRotation/arrangeRotaryRotation_list.vue'));
        }, 'arrangeRotation');
      }
    },
    {
      //安排轮转审核
      path: 'arrangeRotaryRotationAudit',
      name: 'arrangeRotaryRotationAudit',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/arrangeRotation/arrangeRotaryRotationAudit/arrangeRotaryRotationAudit_list.vue'));
        }, 'arrangeRotation');
      }
    },
    {
      //补轮转（来自轮转查询）
      path: 'makeUpRotate',
      name: 'makeUpRotate',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateQuery/makeUpRotate/makeUpRotate_list.vue'));
        }, 'rotateQuery');
      }
    },
  ]
}

export default rotateRouters;
