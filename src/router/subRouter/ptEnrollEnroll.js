/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:研究生管理-报名招录
 * 作者:gx
 * 日期:2017/9/3
 *
 * @date     2017/9/3
 * @author   gx
 */


const ptEnrollEnrollRouters = {
  path: 'ptEnrollEnroll',
  name: 'ptEnrollEnroll',
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'ptEnrollEnroll');
  },
  redirect: to => {
    return '/manage/ptEnrollEnroll/ptEnroll'
  },
  children: [
    {
      //报名表
      path: 'ptEnroll',
      name: 'ptEnroll',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptEnrollEnroll/ptEnroll/ptEnroll_list.vue'));
        }, 'ptEnrollEnroll');
      }
    },
    {
      //报名审核
      path: 'ptApplyAudit',
      name: 'ptApplyAudit',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptEnrollEnroll/ptApplyAudit/ptApplyAudit_list.vue'));
        }, 'ptEnrollEnroll');
      }
    },
    {
      //组织复试
      path: 'ptOrganizationReexamine',
      name: 'ptOrganizationReexamine',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptEnrollEnroll/ptOrganizationReexamine/ptOrganizationReexamine_list.vue'));
        }, 'ptEnrollEnroll');
      }
    },
    {
      //汇总复试
      path: 'ptSummarizingReexamine',
      name: 'ptSummarizingReexamine',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptEnrollEnroll/ptSummarizingReexamine/ptSummarizingReexamine_list.vue'));
        }, 'ptEnrollEnroll');
      }
    },
    {
      //拟录取
      path: 'ptplanAdmit',
      name: 'ptplanAdmit',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptEnrollEnroll/ptplanAdmit/ptplanAdmit_list.vue'));
        }, 'ptEnrollEnroll');
      }
    },
    {
      //录取
      path: 'ptAdmit',
      name: 'ptAdmit',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptEnrollEnroll/ptAdmit/ptAdmit_list.vue'));
        }, 'ptEnrollEnroll');
      }
    },
    {
      //回执查询
      path: 'ptReceiptQuery',
      name: 'ptReceiptQuery',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptEnrollEnroll/ptReceiptQuery/ptReceiptQuery_list.vue'));
        }, 'ptEnrollEnroll');
      }
    },
    {
      //打印交费单(移到研导双选)
      path: 'ptPrintReceipts',
      name: 'ptPrintReceipts',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptEnrollEnroll/ptPrintReceipts/ptPrintReceipts_list.vue'));
        }, 'ptEnrollEnroll');
      }
    },
    {
      //复试通知
      path: 'ptReexamineNotice',
      name: 'ptReexamineNotice',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptEnrollEnroll/ptReexamineNotice/ptReexamineNotice_list.vue'));
        }, 'ptEnrollEnroll');
      }
    },
  ]
}

export default ptEnrollEnrollRouters;
