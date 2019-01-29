/*
 * 模块名称:考务管理
 * 作者:gx
 * 日期:2017-6-19
 * */

const examination = {
  path: 'kaowuguanli',
  name: 'kaowuguanli',
  meta: {
    requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
  },
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'kaowuguanli');
  },
  redirect: to => {
    return '/manage/kaowuguanli/llksmt';
  },
  children: [
    {
      //理论考试命题
      path: 'llksmt',
      name: 'llksmt',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/managementExaminationAffairs/kaoWuGuanLi/llksmt/llksmt_list.vue'));
        }, 'kaowuguanli');
      }
    }, {
      //理论考试组卷
      path: 'llkszj',
      name: 'llkszj',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/managementExaminationAffairs/kaoWuGuanLi/llkszj/llkszj_list.vue'));
        }, 'kaowuguanli');
      }
    }, {
      //理论考试判卷
      path: 'llkspj',
      name: 'llkspj',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/managementExaminationAffairs/kaoWuGuanLi/llkspj/llkspj_list.vue'));
        }, 'kaowuguanli');
      }
    }, {
      //理论考试监考
      path: 'llksjk',
      name: 'llksjk',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/managementExaminationAffairs/kaoWuGuanLi/llksjk/llksjk_list.vue'));
        }, 'kaowuguanli');
      }
    }, {
      //理论考试试卷分析
      path: 'llsjfx',
      name: 'llsjfx',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/managementExaminationAffairs/kaoWuGuanLi/llsjfx/llsjfx_list.vue'));
        }, 'kaowuguanli');
      }
    }, {
      //理论考试讲评
      path: 'llsjjp',
      name: 'llsjjp',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/managementExaminationAffairs/kaoWuGuanLi/llsjjp/llsjjp_list.vue'));
        }, 'kaowuguanli');
      }
    }, {
      //技能考核命题
      path: 'jnkhmt',
      name: 'jnkhmt',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/managementExaminationAffairs/kaoWuGuanLi/jnkhmt/jnkhmt_list.vue'));
        }, 'kaowuguanli');
      }
    }, {
      //技能考核监考
      path: 'jnkhjk',
      name: 'jnkhjk',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/managementExaminationAffairs/kaoWuGuanLi/jnkhjk/jnkhjk_list.vue'));
        }, 'kaowuguanli');
      }
    }, {
      //技能考核讲评
      path: 'jnkhjp',
      name: 'jnkhjp',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/managementExaminationAffairs/kaoWuGuanLi/jnkhjp/jnkhjp_list.vue'));
        }, 'kaowuguanli');
      }
    }
  ]
};

export default examination;

