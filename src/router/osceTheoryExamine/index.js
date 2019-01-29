/**
 * 技能中心理论考核
 * 作者:yc
 * 日期:2018/2/28 11:26
 */

const osceTheoryExamine = {
  path: '/osceTheoryExamine',
  name: 'osceTheoryExamine',
  meta: {
    requiresAuth: false  // 添加该字段，表示进入这个路由是普通页面，不需要登录
  },
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/osceTheoryExamine/layout.vue'));
    }, 'osceTheoryExamine');
  },
  redirect: to => {
    return '/osceTheoryExamine/login'
  },
  children: [
    {
      //理论考核登录
      path: 'login',
      name: 'login',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/osceTheoryExamine/login.vue'));
        }, 'osceTheoryExamine');
      }
    },
    {
      //理论考核设置
      path: 'set',
      name: 'set',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/osceTheoryExamine/set.vue'));
        }, 'osceTheoryExamine');
      }
    },
    {
      //理论考核
      path: 'examine',
      name: 'examine',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/osceTheoryExamine/examine.vue'));
        }, 'osceTheoryExamine');
      }
    }
  ]
}

export default osceTheoryExamine;
