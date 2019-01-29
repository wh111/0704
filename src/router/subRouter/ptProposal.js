/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:研究生管理-开题管理
 * 作者:gx
 * 日期:2017/9/3
 *
 * @date     2017/9/3
 * @author   gx
 */


const ptProposalRouters = {
  path: 'ptProposal',
  name: 'ptProposal',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'ptProposal');
  },
  redirect: to => {
    return '/manage/ptProposal/proposalNotificationManager'
  },
  children:[
    {
      //开题通知管理
      path:'proposalNotificationManager',
      name:'proposalNotificationManager',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptProposal/proposalNotificationManager/proposalNotificationManager_list.vue'));
        }, 'ptProposal');
      }
    },
    {
      //开题通知查看
      path:'proposalNotificationExamine',
      name:'proposalNotificationExamine',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptProposal/proposalNotificationExamine/proposalNotificationExamine_list.vue'));
        }, 'ptProposal');
      }
    },
    {
      //开题申请填写
      path:'proposalApplicationWrite',
      name:'proposalApplicationWrite',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptProposal/proposalApplicationWrite/proposalApplicationWrite_list.vue'));
        }, 'ptProposal');
      }
    },
    {
      //更改开题申请
      path:'changeProposalApplication',
      name:'changeProposalApplication',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptProposal/changeProposalApplication/changeProposalApplication_list.vue'));
        }, 'ptProposal');
      }
    },
    {
      //再次开题申请
      path:'applyAgainProposal',
      name:'applyAgainProposal',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptProposal/applyAgainProposal/applyAgainProposal_list.vue'));
        }, 'ptProposal');
      }
    },
    {
      //开题申请审核
      path:'proposalApplicationAudit',
      name:'proposalApplicationAudit',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptProposal/proposalApplicationAudit/proposalApplicationAudit_list.vue'));
        }, 'ptProposal');
      }
    },
    {
      //更改开题审核
      path:'changeProposalAudit',
      name:'changeProposalAudit',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptProposal/changeProposalAudit/changeProposalAudit_list.vue'));
        }, 'ptProposal');
      }
    },
    {
      //再次开题审核
      path:'applyAgainAudit',
      name:'applyAgainAudit',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptProposal/applyAgainAudit/applyAgainAudit_list.vue'));
        }, 'ptProposal');
      }
    },
    {
      //开题报告填写
      path:'ProposalPeportWriting',
      name:'ProposalPeportWriting',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptProposal/ProposalPeportWriting/proposalPeportWriting_list.vue'));
        }, 'ptProposal');
      }
    },
    {
      //开题报告审核
      path:'ProposalPeportAudit',
      name:'ProposalPeportAudit',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptProposal/ProposalPeportAudit/ProposalPeportAudit_list.vue'));
        }, 'ptProposal');
      }
    },
  ]
}

export default ptProposalRouters;
