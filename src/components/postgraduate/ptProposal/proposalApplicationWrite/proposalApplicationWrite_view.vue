<template>

  <div>
    <el-form :model="formValidate" ref="formValidate" class="demo-form-inline" label-width="90px">
      <fieldset class="layui-elem-field ">
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请人:">
              {{formValidate.name}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学号:">
              {{formValidate.studentId}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <!--<el-col :span="12">-->
          <!--<el-form-item label="年级:"  >-->
          <!--{{formValidate.boundary}}-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="12">
            <el-form-item label="手机号:">
              {{formValidate.phone}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="专业方向:">
              {{formValidate.specialtyName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业代码:">
              {{formValidate.specialtyCode}}
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="12">
            <el-form-item label="时间:" prop="applicationDate">
              {{formValidate.applicationDate}}
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="地点:" prop="place">
              {{formValidate.place}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="研究方向:" prop="researchDirection">
              {{formValidate.researchDirection}}
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="论文题目:" prop="thesisTitle">
              {{formValidate.thesisTitle}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="课题摘要:" prop="projectSummary">
              {{formValidate.projectSummary}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="22" :offset="1">
            <div style="text-align: center;margin: 10px;font-size: 18px">
              <strong>组员</strong>
            </div>
          </el-col>
          <el-col :span="22" :offset="1">
            <el-table
              align="center"
              :data="formValidate.memberList"
              tooltip-effect="dark"
              highlight-current-row
              style="width: 100%;height: 100%">
              <el-table-column
                align="center"
                label="序号"
                type="index"
                width="75">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="name"
                align="center"
                label="姓名">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="sex"
                align="center"
                label="性别">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                align="center"
                prop="positionalTitle"
                label="职称">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="professionalDirection"
                align="center"
                label="专业方向">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="company"
                label="单位"
                align="center">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

        <br>

        <el-row>
          <el-col :span="12">
            <el-form-item label="状态:">
              {{formValidate.status | typeText}}
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
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
            <div class="cell">{{formValidate.auditTime }}</div>
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
            <div class="cell">{{formValidate.jysAuditTime }}</div>
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
            <div class="cell">{{formValidate.jycAuditTime }}</div>
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

      <!--<el-steps v-if="auditStep(formValidate.status)>-1" :center="true" :active="active">-->
      <!--<el-step><span slot="title" style="cursor: pointer" @click="changeActive(0)">导师审核</span><span slot="icon" style="cursor: pointer"-->
      <!--@click="changeActive(0)">1</span></el-step>-->
      <!--<el-step title="进行中"><span slot="title" style="cursor: pointer" @click="changeActive(1)">教研室审核</span><span slot="icon" style="cursor: pointer"-->
      <!--@click="changeActive(1)">2</span></el-step>-->
      <!--<el-step title="步骤 3"><span slot="title" style="cursor: pointer" @click="changeActive(2)">教育处审核</span><span style="cursor: pointer" slot="icon"-->
      <!--@click="changeActive(2)">3</span></el-step>-->
      <!--</el-steps>-->
      <!--<div v-if="auditStep(formValidate.status)!=-1">-->
      <!--&lt;!&ndash;导师审核&ndash;&gt;-->
      <!--<div v-if="active==0">-->
      <!--<el-row v-if="auditStep(formValidate.status)>0">-->
      <!--<el-col :span="12">-->
      <!--<el-form-item label="审核人:">-->
      <!--{{formValidate.auditName}}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="12">-->
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
      <!--<el-col style="font-size:18px; text-align: center;line-height: 100px;">-->
      <!--<strong>导师审核中</strong>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <!--</div>-->
      <!--&lt;!&ndash;教研室审核&ndash;&gt;-->
      <!--<div v-if="active==1">-->
      <!--<el-row v-if="auditStep(formValidate.status)>2">-->
      <!--<el-col :span="12">-->
      <!--<el-form-item label="审核人:">-->
      <!--{{formValidate.jysAuditName}}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="12">-->
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
      <!--<el-col style="font-size:18px; text-align: center;line-height: 100px;">-->
      <!--<strong>教研室审核中</strong>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <!--</div>-->
      <!--&lt;!&ndash;教育处审核&ndash;&gt;-->
      <!--<div v-if="active==2">-->
      <!--<el-row v-if="auditStep(formValidate.status)>4">-->
      <!--<el-col :span="12">-->
      <!--<el-form-item label="审核人:">-->
      <!--{{formValidate.jycAuditName}}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="12">-->
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
      <!--<el-col style="font-size:18px; text-align: center;line-height: 100px;">-->
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
  export default {
    props: ['operailityData', 'url', 'peport'],
    data () {
      return {
        active: 0,
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          applicationDate: '', // 时间
          place: '',//地点
          researchDirection: '',  //研究方向
          thesisTitle: '',  //论文题目
          projectSummary: '',  //课题摘要
//          attachmentId:'',  //附件id
          status: 'WSB',  //状态
          noticeName: '',
//          noticeId:'',  //开题通知id
          applicantType: 'ORDINARY',  //申请类型  ORDINARY普通申请,CHANGE更改申请,AGAIN再次开题申请'
          memberList: []
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
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted () {
      //初始化
      this.init();
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
        if (!data.memberList) {
          data.memberList = [];
        }
        this.formValidate = data;
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
          'DSH': '0',
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
    }
  };
</script>

