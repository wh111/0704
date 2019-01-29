<template>

  <div>
    <el-form :model="formValidate" :rules="rules" ref="formValidate"    class="demo-form-inline" label-width="90px" >
      <baseInfo :peport="peport"  :view="view"  :operailityData="getData"></baseInfo>
      <br>
      <el-steps v-if="auditStep(getData.status)>-1" :space="400" :active="active" style="margin-left: 80px">
        <el-step  > <span slot="title" style="cursor: pointer" @click="changeActive(0)">导师审核</span><span slot="icon" style="cursor: pointer"  @click="changeActive(0)" >1</span></el-step>
        <el-step title="步骤 3"><span slot="title" style="cursor: pointer" @click="changeActive(1)">教育处审核</span><span style="cursor: pointer" slot="icon"  @click="changeActive(1)" >2</span></el-step>
      </el-steps>
      <br>
      <div  v-show="auditStep(getData.status)!=-1">
        <!--导师审核-->
        <div v-show="active==0">
          <el-row v-show="auditStep(getData.status)>0">
            <el-col :span="8" :offset="2">
              <el-form-item label="审核人:" >
                {{getData.auditName}}
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item label="审核时间:" >
                {{getData.auditTime }}
              </el-form-item>
            </el-col>
            <el-col :span="20" :offset="2">
              <el-form-item label="审核意见:" >
                <el-input v-model="getData.auditOpinion"  type="textarea" autosize readonly resize="none"></el-input>
              </el-form-item>
            </el-col>
          </el-row >
          <el-row v-show="auditStep(getData.status)==0" >
            <el-col :span="24"  style="font-size:18px; text-align: center;line-height: 100px;">
              <strong>导师审核中</strong>
            </el-col>
          </el-row >
        </div>
        <!--教育处审核-->
        <div v-show="active==1">
          <el-row v-show="auditStep(getData.status)>4">
            <el-col :span="8" :offset="2">
              <el-form-item label="审核人:" >
                {{getData.jycAuditName}}
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item label="审核时间:" >
                {{getData.jycAuditTime }}
              </el-form-item>
            </el-col>
            <el-col :span="20" :offset="2">
              <el-form-item label="审核意见:" >
                <el-input v-model="getData.jycAuditOpinion"  type="textarea" autosize readonly resize="none"></el-input>
              </el-form-item>
            </el-col>
          </el-row >
          <el-row v-show="auditStep(getData.status)==4">
            <el-col :span="20" :offset="2">
              <el-form-item label="审核意见:"  prop="jycAuditOpinion">
                <el-input v-model="formValidate.jycAuditOpinion"  type="textarea"   ></el-input>
              </el-form-item>
            </el-col>
          </el-row >
        </div>
      </div>

      <el-row >
        <el-col :span="24" style="text-align: center">
          <load-btn @listenSubEvent="passSubEvent" :btnData="loadBtn"></load-btn>
          <load-btn @listenSubEvent="rejectSubEvent" :btnData="noBtn"></load-btn>
        </el-col>
      </el-row >

    </el-form>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  import {proposalApplicationAudit as rules} from '../../rules'
  import baseInfo from '../ProposalPeportAudit_auditBase.vue'
  export default {
    props:['operailityData','url','view','peport'],
    data (){
      return{
        rules,
        active:'0',
        //保存按钮基本信息
        loadBtn:{title:'通过',callParEvent:'listenSubEvent'},
        noBtn:{title:'不通过',callParEvent:'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          id:this.operailityData.id,
          status:'',
          jycAuditOpinion:'',
        },
        getData:{},
        userData:[],
        selectNoticeModal:false,
        selectNoticeId:{
          id:"selectNoticeId",
          title:"选择研究生",
          usersData:''
        },

        editMessTitle:{
          type:'audit',
          successTitle:'审核成功',
          errorTitle:'审核失败',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:this.url.jycAudit.path+this.operailityData.id,
            method:this.url.jycAudit.method,
            data:{},
          }
        },

        graduateName:[],
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        noticeId:'',
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.auditGet.path+this.operailityData.id,
          }
        }
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化
      this.init();
    },
    methods:{

      //通过
      passSubEvent(isLoadingFun){
        this.formValidate.status = 'TG';
        this.listenSubEvent(isLoadingFun);
      },

      //驳回
      rejectSubEvent(isLoadingFun){
        this.formValidate.status = 'JYCBH';
        this.listenSubEvent(isLoadingFun);

      },


      /*
      * 点击提交按钮 监听是否提交数据
      * @param isLoadingFun boolean  form表单验证是否通过
      * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit){
          if(!isLoadingFun) isLoadingFun=function(){};
          isLoadingFun(true);
          let formValidate =this.formValidate
          this.editMessTitle.ajaxParams.data= formValidate;
          this.ajax(this.editMessTitle,isLoadingFun)
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag= true;
          }
        });
        return flag;
      },
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        this.getData = data;
        this.initActive(data.status);
      },

      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },


      //初始化Active
      initActive(status){
        let auditStep = this.auditStep(status);
        if(auditStep<1){
          this.active = 0
        }else {
          this.active = 1
        }
      },
      changeActive(active){
        let auditStep = this.auditStep(this.getData.status);
        if(auditStep<1){
          return;
        }else
        this.active=active;
      },
      //审核步骤
      auditStep(status){
        let obj = {
          'WSB':'-1',
          'DSDSH':'0',
          'DSBH':'1',
          'JYSDSH':'2',
          'JYSBH':'3',
          'JYCDSH':'4',
          'JYCBH':'5',
          'TG':'6',
          'MODIFY_END':'-1',
          'AGAIN_END':'-1',
        }
        return obj[status];

      },

    },
    components:{
      //当前组件引入的子组件
      baseInfo
    }


  }
</script>

