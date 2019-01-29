<template>
  <pbase :operailityData="formValidate">
    <base-viev class="view" :operailityData="formValidate"></base-viev>
  </pbase>
</template>
<script>
  import pbase    from './ProposalPeportWriting_base.vue';
  import baseViev from './ProposalPeportWriting_base-view.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'url', 'peport'],
    data () {
      return {
        active: '0',
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          pinyin: '',  //拼音
          entranceDate: '',  //入学年月
          researchDirection: '',  //研究方向
          topicName: '',  //课题名称
          tutorName: '',  //导师姓名
          positionalTitle: '',  //职称
          groupMembers: '',  //指导小组成员
          reportDate: '',  //开题报告日期
          moderator: '',  //主持人
          recorder: '',  //记录员
          attendance: '',  //出席人数
          evaluationOpinion: '',  //出席人员对课题的评价
          status: 'WSB',  //状态
          noticeName: '',
          groupMember: []  /// 小组成员
        },
        userData: [],
        selectNoticeModal: false,
        selectNoticeId: {
          id: 'selectNoticeId',
          title: '选择研究生',
          usersData: ''
        },
        graduateName: [],
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        noticeId: '',
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: this.url.auditGet.path + this.operailityData.id
          }
        }
      };
    },
    created () {
      this.init();
      //给当前组件注入全局util
    },
    mounted () {
      //初始化
    },
    methods: {
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData (responseData) {
        let data = responseData.data;
//        if (data.groupMembers) {
//          data.groupMember = data.groupMembers.split(',');
//        } else {
//          data.groupMember = [];
//        }
        this.formValidate = data;
      },

      /*
       * 组件初始化入口
       * */
      init () {
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },

      //初始化Active
      initActive (status) {
        let auditStep = this.auditStep(status);
        if (auditStep < 2) {
          this.active = 0;
        } else {
          this.active = 1;
        }
      },
      changeActive (active) {
        let auditStep = this.auditStep(this.formValidate.status);
        if (auditStep < 1) {
          return;
        }
        this.active = active;
      },
      //审核步骤
      auditStep (status) {
        let obj = {
          'WSB': '-1',
          'DSDSH': '0',
          'DSBH': '1',
          'JYCDSH': '4',
          'JYCBH': '5',
          'TG': '6',
          'MODIFY_END': '-1',
          'AGAIN_END': '-1'
        };
        return obj[status];

      }

    },

    components: {
      pbase, baseViev
    }

  };
</script>

