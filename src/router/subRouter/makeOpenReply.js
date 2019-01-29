/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:研究生管理-答辩管理
 * 作者:gx
 * 日期:2017/9/3
 *
 * @date     2017/9/3
 * @author   gx
 */


const makeOpenReplyRouters = {
  path: 'makeOpenReply',
  name: 'makeOpenReply',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'makeOpenReply');
  },
  redirect: to => {
    return '/manage/makeOpenReply/respondentReply'
  },
  children:[
    {
      //答辩申请
      path:'respondentReply',
      name:'respondentReply',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/makeOpenReply/respondentReply/respondentReply_list.vue'));
        }, 'makeOpenReply');
      }
    },
    {
      //答辩审核
      path:'respondentAudit',
      name:'respondentAudit',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/makeOpenReply/respondentAudit/respondentAudit_list.vue'));
        }, 'makeOpenReply');
      }
    },
    {
      //答辩汇总
      path:'respondentSummarizing',
      name:'respondentSummarizing',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/makeOpenReply/respondentSummarizing/respondentSummarizing_list.vue'));
        }, 'makeOpenReply');
      }
    },
    {
      //答辩汇总审核
      path:'respondentSumAudit',
      name:'respondentSumAudit',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/makeOpenReply/respondentSumAudit/respondentSumAudit_list.vue'));
        }, 'makeOpenReply');
      }
    },
    {
      //答辩结果记录
      path:'respondentResultRecord',
      name:'respondentResultRecord',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/makeOpenReply/respondentResultRecord/respondentResultRecord_list.vue'));
        }, 'makeOpenReply');
      }
    },
    {
      //答辩结果查询
      path:'respondentResultQuery',
      name:'respondentResultQuery',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/makeOpenReply/respondentResultQuery/respondentResultQuery_list.vue'));
        }, 'makeOpenReply');
      }
    },
    {
      //答辩状态查询
      path:'respondentStatusQuery',
      name:'respondentStatusQuery',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/makeOpenReply/respondentStatusQuery/respondentStatusQuery_list.vue'));
        }, 'makeOpenReply');
      }
    },
  ]
}

export default makeOpenReplyRouters;
