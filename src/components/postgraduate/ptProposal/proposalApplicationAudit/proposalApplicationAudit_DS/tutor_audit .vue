<template>

  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="90px">
      <baseInfo :peport="peport" :view="view" :operailityData="getData"></baseInfo>
      <br>

      <el-steps :center="true" :active="0" finish-status="success">
        <el-step title="导师审核"></el-step>
        <el-step title="教研室审核"></el-step>
        <el-step title="教育处审核"></el-step>
      </el-steps>
      <br>

      <el-row>
        <el-col>
          <el-form-item label="审核意见:" prop="auditOpinion">
            <el-input v-model="formValidate.auditOpinion" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col align="center">
          <load-btn @listenSubEvent="passSubEvent" :btnData="loadBtn"></load-btn>
          <load-btn @listenSubEvent="rejectSubEvent" :btnData="noBtn"></load-btn>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;
  import { proposalApplicationAudit as rules } from '../../rules';
  import baseInfo                              from '../proposalApplicationAudit_auditBase.vue';
  import major                                 from '../../../common/major.vue';

  export default {
    props: ['operailityData', 'url', 'view', 'peport'],
    data () {
      return {
        rules,
        active: '0',
        //保存按钮基本信息
        loadBtn: {title: '通过', callParEvent: 'listenSubEvent'},
        noBtn: {title: '不通过', callParEvent: 'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          ids: this.operailityData.id,
          status: '',
          auditOpinion: ''
        },
        getData: {
          applicationDate: '', // 时间
          place: '',//地点
          researchDirection: '',  //研究方向
          thesisTitle: '',  //论文题目
          projectSummary: '',  //课题摘要
//          attachmentId:'',  //附件id
          status: '',  //状态
          noticeName: '',
//          noticeId:'',  //开题通知id
          applicantType: '',  //申请类型  ORDINARY普通申请,CHANGE更改申请,AGAIN再次开题申请'
          memberList: []
        },
        userData: [],
        selectNoticeModal: false,
        selectNoticeId: {
          id: 'selectNoticeId',
          title: '选择研究生',
          usersData: ''
        },

        editMessTitle: {
          type: 'audit',
          successTitle: '审核成功',
          errorTitle: '审核失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: this.url.tutorAudit.path,
            method: this.url.tutorAudit.method,
            data: {}
          }
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
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted () {
      //初始化
      this.init();
    },
    methods: {

      //通过
      passSubEvent (isLoadingFun) {
        if (this.peport) {
          this.formValidate.status = 'JYCDSH';
        } else {
          this.formValidate.status = 'JYSDSH';
        }
        this.listenSubEvent(isLoadingFun);
      },

      //驳回
      rejectSubEvent (isLoadingFun) {
        this.formValidate.status = 'DSBH';
        this.listenSubEvent(isLoadingFun);

      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          let formValidate = this.formValidate;
          this.editMessTitle.ajaxParams.data = formValidate;
          this.ajax(this.editMessTitle, isLoadingFun);
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData (responseData) {
        let data = responseData.data;
        this.getData = data;
        this.initActive(data.status);
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
        if (auditStep < 1) {
          this.active = 0;
        } else if (auditStep < 4) {
          this.active = 1;
        } else {
          this.active = 2;
        }
      },
      changeActive (active) {
        let auditStep = this.auditStep(this.getData.status);
        if (auditStep < 1) {
          return;
        } else if (auditStep < 4 && active > 1) {
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
          'JYSDSH': '2',
          'JYSBH': '3',
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
      //当前组件引入的子组件
      baseInfo
    }

  };
</script>

