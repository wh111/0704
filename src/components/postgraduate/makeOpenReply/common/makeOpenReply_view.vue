<template>
  <div>
    <el-form :model="operailityData" ref="formValidate" label-width="90px">
      <base-view :operailityData="operailityData">
        <slot></slot>
      </base-view>
      <el-row class="table-back-one-d">
        <el-col :span="8">
          <el-form-item label="审核状态:">
            {{operailityData.status | typeText}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="table-back-one-d" v-if="operailityData.status=='TG'">
        <el-col :span="8">
          <el-form-item label="答辩结果:">
            {{operailityData.resultStatus | dsresultRecord}}
          </el-form-item>
        </el-col>
      </el-row>
      <br/>

      <el-steps v-if="auditStep>-1" :center="true" :active="active" finish-status="success">
        <el-step title="导师审核"></el-step>
        <el-step title="教研室审核"></el-step>
        <el-step title="教育处审核"></el-step>
      </el-steps>

      <table v-if="auditStep!=-1" class="el-table el-table--border">
        <tr>
          <th>
            <div class="cell">审核人</div>
          </th>
          <th>
            <div class="cell">审核时间</div>
          </th>
          <th>
            <div class="cell">审核意见</div>
          </th>
        </tr>

        <tr v-if="auditStep>0">
          <td>
            <div class="cell">{{operailityData.auditName}}</div>
          </td>
          <td>
            <div class="cell">{{operailityData.auditTime }}</div>
          </td>
          <td>
            <div class="cell">{{operailityData.auditOpinion}}</div>
          </td>
        </tr>
        <tr align="center" v-else>
          <td colspan="3">
            <div class="cell">导师审核中</div>
          </td>
        </tr>

        <tr v-if="auditStep>2">
          <td>
            <div class="cell">{{operailityData.jysAuditName}}</div>
          </td>
          <td>
            <div class="cell">{{operailityData.jysAuditTime }}</div>
          </td>
          <td>
            <div class="cell">{{operailityData.jysAuditOpinion}}</div>
          </td>
        </tr>
        <tr align="center" v-else-if="auditStep>0">
          <td colspan="3">
            <div class="cell">教研室审核中</div>
          </td>
        </tr>

        <tr v-if="auditStep>4">
          <td>
            <div class="cell">{{operailityData.jycAuditName}}</div>
          </td>
          <td>
            <div class="cell">{{operailityData.jycAuditTime }}</div>
          </td>
          <td>
            <div class="cell">{{operailityData.jycAuditOpinion}}</div>
          </td>
        </tr>
        <tr align="center" v-else-if="auditStep>2">
          <td colspan="3">
            <div class="cell">教育处审核中</div>
          </td>
        </tr>
      </table>
    </el-form>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;
  import baseView from './makeOpenReply_base-view.vue';

  export default {
    props: ['operailityData', 'url', 'peport', 'auditStep'],
    data () {
      return {
        active: 0,
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        //form表单bind数据
        formValidate: this.operailityData,
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
            //url:this.url.auditGet.path+this.operailityData.id,
          }
        }
      };
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util;
      this.initActive();
    },
    mounted () {
    },
    methods: {
      //初始化Active
      initActive () {
        let auditStep = this.auditStep || 0;
        if (auditStep < 2) {
          this.active = 1;
        } else if (auditStep < 4) {
          this.active = 2;
        } else {
          this.active = 3;
        }
      }
    },
    watch: {
      auditStep () {
        this.initActive();
      }
    },
    components: {
      baseView
    }
  };
</script>

