<template>

  <div>
    <el-form :model="formValidate" ref="formValidate"  :rules="rules" class="demo-form-inline" label-width="90px" >
      <baseInfo :peport="peport"  :view="view" :operailityData="getData"></baseInfo>

      <br>
      <el-steps :center="true" :active="0" finish-status="success">
        <el-step title="导师审核"></el-step>
        <el-step title="教研室审核"></el-step>
        <el-step title="教育处审核"></el-step>
      </el-steps>
      <br>
      <el-row>
        <el-col>
          <el-form-item label="审核意见:" prop="dsopinion">
            <el-input v-model="formValidate.dsopinion" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <br>

      <el-row >
        <el-col align="center">
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
  import baseInfo from '../../components/makeOpenReply_base-view'
  import major from '../../../common/major.vue'

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
          ids:this.operailityData.id,
          status:'',
          dsopinion:'',
        },
        getData:{
          "pyobject":"",
          "length":"",
          "mode":"",
          "target":"",
          "requires":"",
          "yqobjective":"",
          "yqrequire":"",
          "yqassessment":"",
          "yqpractice":"",
          "yqpresentation":"",
          "yqactivity":"",
          "paperDefence":"",
          "paperReport":"",
          "paperTopic":"",
          "dissertation":"",
          "degreeAwarding":"",
          "whereabouts":"",
          "bookList":[],
          "curriculumList":[],
          //前端保存的课程设置与考核要求 :
          curriculumLists:[[], [],[],[]],
          "directionList":[]
        },
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
            url:this.url.tutorAudit.path,
            method:this.url.tutorAudit.method,
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
            url:this.url.getPlan.path+this.operailityData.id,
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
        this.formValidate.status = 'DSADOPT';
        this.listenSubEvent(isLoadingFun);
      },

      //驳回
      rejectSubEvent(isLoadingFun){
        this.formValidate.status = 'DSTPASS';
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
        //课程要求
        if(!data.directionList || data.directionList==0){
          data.directionList = [{name:''}]
        }
        //公共基础课A类
        let A =  [{"type":"A", "name":"", "teacher":"", "credit":"", "hour":"",}];
        //专业基础课B类
        let B =  [{"type":"B", "name":"", "teacher":"", "credit":"", "hour":"",}];
        //专业实践课C类
        let C =  [{"type":"C", "name":"", "teacher":"", "credit":"", "hour":"",}];
        //公共选修课程D类(8个专业方向)
        let D =  [{"type":"D", "name":"", "teacher":"", "credit":"", "hour":"",}];
        if(!data.curriculumList || data.curriculumList==0){
          data.curriculumList = [];
          data.curriculumLists=[A,B,C,D];
        }else {
          let obj = {
            A:[],
            B:[],
            C:[],
            D:[],
          }
          for(let i=0;i<data.curriculumList.length;i++){
            let item = data.curriculumList[i];
            obj[item.type].push(item)

          }
          if(obj.A!=0){
            A = obj.A;
          }
          if(obj.B!=0){
            B = obj.B;
          }
          if(obj.C!=0){
            C = obj.C;
          }
          if(obj.D!=0){
            D = obj.D;
          }
          data.curriculumLists=[A,B,C,D];
        }

        //书籍

        if(data.bookList==0||!data.bookList){
          data.bookList=[{
            "name":"",
            "author":""
          }]
        }
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
        }else if (auditStep<4 ){
          this.active = 1
        }else {
          this.active = 2
        }
      },
      changeActive(active){
        let auditStep = this.auditStep(this.getData.status);
        if(auditStep<2){
          return;
        }else if (auditStep<4 && active>1){
          return;
        }
        this.active=active;
      },
      //审核步骤
      auditStep(status){
        let obj = {
          'WSB':'-1',
          'AUDIT':'0',
          'DSTPASS':'1',
          'DSADOPT':'2',
          'KSZRTPASS':'3',
          'KSZRADOPT':'4',
          'JYCTPASS':'5',
          'JYCADOPT':'6',
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

