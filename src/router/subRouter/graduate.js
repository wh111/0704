/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:研究生管理-毕业管理
 * 作者:gx
 * 日期:2017/9/3
 *
 * @date     2017/9/3
 * @author   gx
 */


const graduateRouters = {
  path: 'graduate',
  name: 'graduate',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'graduate');
  },
  redirect: to => {
    return '/manage/graduate/graduateApplyWriting'
  },
  children:[
    {
      //毕业申请填写
      path:'graduateApplyWriting',
      name:'graduateApplyWriting',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/graduate/graduateApplyWriting/graduateApplyWriting_list.vue'));
        }, 'graduate');
      }
    },
    {
      //毕业申请审核
      path:'graduateApplyAudit',
      name:'graduateApplyAudit',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/graduate/graduateApplyAudit/graduateApplyAudit_list.vue'));
        }, 'graduate');
      }
    },
  ]
}

export default graduateRouters;
