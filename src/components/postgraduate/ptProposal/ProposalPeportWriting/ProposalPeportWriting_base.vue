<template>
  <div>
    <slot></slot>
    <el-form :model="formValidate" ref="formValidate" label-width="90px">
      <!--<base-view :operailityData="formValidate">-->
      <!--<slot></slot>-->
      <!--</base-view>-->
      <el-row>
        <el-col>
          <el-form-item label="状态:">
            {{formValidate.status | typeText}}
          </el-form-item>
        </el-col>
      </el-row>
      <br/>
      <el-steps v-if="auditStep(formValidate.status)>-1" :center="true" :active="active" finish-status="success">
        <el-step title="导师审核"></el-step>
        <el-step title="教研室审核"></el-step>
        <el-step title="教育处审核"></el-step>
      </el-steps>

      <table v-if="auditStep(formValidate.status)!=-1" class="el-table el-table--border">
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

        <tr v-if="auditStep(formValidate.status)>0">
          <td>
            <div class="cell">{{formValidate.auditName}}</div>
          </td>
          <td>
            <div class="cell">{{(formValidate.auditTime || '') | formatDate('yyyy-MM-dd HH:mm')}}</div>
          </td>
          <td>
            <div class="cell">{{formValidate.auditOpinion}}</div>
          </td>
        </tr>
        <tr align="center" v-else>
          <td colspan="3">
            <div class="cell">导师审核中</div>
          </td>
        </tr>

        <tr v-if="auditStep(formValidate.status)>2">
          <td>
            <div class="cell">{{formValidate.jysAuditName}}</div>
          </td>
          <td>
            <div class="cell">{{(formValidate.jysAuditTime || '') | formatDate('yyyy-MM-dd HH:mm')}}</div>
          </td>
          <td>
            <div class="cell">{{formValidate.jysAuditOpinion}}</div>
          </td>
        </tr>
        <tr align="center" v-else-if="auditStep(formValidate.status)>0">
          <td colspan="3">
            <div class="cell">教研室审核中</div>
          </td>
        </tr>

        <tr v-if="auditStep(formValidate.status)>4">
          <td>
            <div class="cell">{{formValidate.jycAuditName}}</div>
          </td>
          <td>
            <div class="cell">{{(formValidate.jycAuditTime || '') | formatDate('yyyy-MM-dd HH:mm')}}</div>
          </td>
          <td>
            <div class="cell">{{formValidate.jycAuditOpinion}}</div>
          </td>
        </tr>
        <tr align="center" v-else-if="auditStep(formValidate.status)>2">
          <td colspan="3">
            <div class="cell">教育处审核中</div>
          </td>
        </tr>
      </table>

      <!--<el-row>-->
      <!--<el-col :span="22" :offset="1">-->
      <!--<el-steps :center="true" v-if="auditStep(formValidate.status)>-1" :active="active">-->
      <!--<el-step><span slot="title" style="cursor: pointer" @click="changeActive(0)">导师审核</span><span slot="icon" style="cursor: pointer"-->
      <!--@click="changeActive(0)">1</span></el-step>-->
      <!--<el-step title="进行中"><span slot="title" style="cursor: pointer" @click="changeActive(1)">教研室审核</span><span slot="icon" style="cursor: pointer"-->
      <!--@click="changeActive(1)">2</span>-->
      <!--</el-step>-->
      <!--<el-step title="步骤 3"><span slot="title" style="cursor: pointer" @click="changeActive(2)">教育处审核</span><span style="cursor: pointer" slot="icon"-->
      <!--@click="changeActive(2)">3</span>-->
      <!--</el-step>-->
      <!--</el-steps>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <!--<div v-if="auditStep(formValidate.status)!=-1">-->
      <!--&lt;!&ndash;导师审核&ndash;&gt;-->
      <!--<div v-if="active==0">-->
      <!--<el-row v-if="auditStep(formValidate.status)>0">-->
      <!--<el-col :span="8" :offset="2">-->
      <!--<el-form-item label="审核人:">-->
      <!--{{formValidate.auditName}}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="8" :offset="2">-->
      <!--<el-form-item label="审核时间:">-->
      <!--{{formValidate.auditTime }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="20" :offset="2">-->
      <!--<el-form-item label="审核意见:">-->
      <!--<el-input v-model="formValidate.auditOpinion" type="textarea" autosize readonly resize="none"></el-input>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <!--<el-row v-if="auditStep(formValidate.status)==0">-->
      <!--<el-col :span="24" style="font-size:18px; text-align: center;line-height: 100px;">-->
      <!--<strong>导师审核中</strong>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <!--</div>-->
      <!--&lt;!&ndash;教研室审核&ndash;&gt;-->
      <!--<div v-if="active==1">-->
      <!--<el-row v-if="auditStep(formValidate.status)>2">-->
      <!--<el-col :span="8" :offset="2">-->
      <!--<el-form-item label="审核人:">-->
      <!--{{formValidate.jysAuditName}}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="8" :offset="2">-->
      <!--<el-form-item label="审核时间:">-->
      <!--{{formValidate.jysAuditTime }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="20" :offset="2">-->
      <!--<el-form-item label="审核意见:">-->
      <!--<el-input v-model="formValidate.jysAuditOpinion" type="textarea" autosize readonly resize="none"></el-input>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <!--<el-row v-if="auditStep(formValidate.status)==2">-->
      <!--<el-col :span="24" style="font-size:18px; text-align: center;line-height: 100px;">-->
      <!--<strong>教研室审核中</strong>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <!--</div>-->
      <!--&lt;!&ndash;教育处审核&ndash;&gt;-->
      <!--<div v-if="active==2">-->
      <!--<el-row v-if="auditStep(formValidate.status)>4">-->
      <!--<el-col :span="8" :offset="2">-->
      <!--<el-form-item label="审核人:">-->
      <!--{{formValidate.jycAuditName}}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="8" :offset="2">-->
      <!--<el-form-item label="审核时间:">-->
      <!--{{formValidate.jycAuditTime }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="20" :offset="2">-->
      <!--<el-form-item label="审核意见:">-->
      <!--<el-input v-model="formValidate.jycAuditOpinion" type="textarea" autosize readonly resize="none"></el-input>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <!--<el-row v-if="auditStep(formValidate.status)==4">-->
      <!--<el-col :span="24" style="font-size:18px; text-align: center;line-height: 100px;">-->
      <!--<strong>教育处审核中</strong>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <!--</div>-->
      <!--</div>-->

    </el-form>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;
  //  import baseView from './ProposalPeportWriting_base-view.vue';

  export default {
    props: ['operailityData', 'url', 'peport'],
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
    },
    mounted () {
      //初始化
//      this.init();
    },
    methods: {
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData (responseData) {
        let data = responseData.data;
        this.noticeId = data.noticeId;
        data.noticeName = data.title;
        this.formValidate = data;
        this.initActive(data.status);
      },

      /*
       * 组件初始化入口
       * */
      init () {
        //默认请求加载数据
//        this.ajax(this.listMessTitle);
      },

      //初始化Active
      initActive (status) {
        let auditStep = this.auditStep(status);
        if (auditStep < 2) {
          this.active = 1;
        } else if (auditStep < 4) {
          this.active = 2;
        } else {
          this.active = 3;
        }
      },
      changeActive (active) {
        let auditStep = this.auditStep(this.formValidate.status);
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
//      baseView
    },
    watch: {
      operailityData (val) {
        this.formValidate = val;
        this.initActive(val.status);
      }
    }

  };
</script>

