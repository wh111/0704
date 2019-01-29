<template>

  <div>
    <el-form  :model="formValidate" :rules="rules" ref="formValidate"   class="demo-form-inline" label-width="90px" >
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="申请人:"  >
            {{getData.name}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="学号:"  >
            {{getData.studentId}}
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="年级:"  >
            {{getData.boundary}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="手机号:">
            {{getData.phone}}
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="专业方向:" >
            {{getData.specialtyName}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="专业代码:" >
            {{getData.specialtyCode}}
          </el-form-item>
        </el-col>
      </el-row >

<!--     -->
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="研究方向:" prop="researchDirection" >
            <el-input v-model="formValidate.researchDirection" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="论文题目:" prop="thesisTitle" >
            <el-input v-model="formValidate.thesisTitle" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="18" :offset="2">
          <el-form-item label="开题申请:" prop="oldId" >
            <el-input v-model="formValidate.title" readonly @focus="selectNoticeModal=true" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row v-if="!again">
        <el-col :span="18" :offset="2">
          <el-form-item label="更改开题原因描述:" prop="modifyDescribe" >
            <el-input v-model="formValidate.modifyDescribe" type="textarea" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row v-else>
        <el-col :span="18" :offset="2">
          <el-form-item label="再次开题原因描述:" prop="againDescribe" >
            <el-input v-model="formValidate.againDescribe" type="textarea" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="18" :offset="2">
          <el-form-item label="附件:" prop="attachmentId">
            <upload-file :length="1"  @setUploadFiles="expenseFileEvent"></upload-file>
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>

    <el-row >
      <el-col :span="24" style="text-align: center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button  @click="cancel">取消</el-button>
      </el-col>
    </el-row >
    <!--选择通知-->
    <Modal
      close-on-click-modal="false"
      width="890"
      v-model="selectNoticeModal"
      title="新建教学活动"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectNoticeId"></modal-header>
      <select-notice @cancel="selectNoticeModal=false" @selectTemp="selectApplication" :url="url"  ></select-notice>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import {proposalApplicationWrite as rules} from '../rules'
  //当前组件引入全局的util
  import selectNotice from "./selectApplication.vue"
  let Util=null;
  export default {
      props:['operailityData','url','again'],
    data (){
      return{
        rules,
        getData:{},
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          oldId:'',//原开题申请
          researchDirection:'',  //研究方向
          thesisTitle:'',  //论文题目
          attachmentId:'',  //附件id
          status:'WSB',  //状态
          title:'',
          againDescribe:'',  //再次开题原因描述
          noticeId:'',  //开题通知id
          modifyDescribe:'', //更改开题原因描述
          applicantType:'CHANGE',  //申请类型  ORDINARY普通申请,CHANGE更改申请,AGAIN再次开题申请'
        },
        userData:[],
        selectNoticeModal:false,
        selectNoticeId:{
          id:"selectNoticeId",
          title:"选择研究生",
          usersData:''
        },
        graduateName:[],
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:this.url.changeAdd.path,
            method:this.url.changeAdd.method,
            data:{},
          }
        },
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'open/topic/application/getGraduateUser',
          }
        },
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      if(this.again){
        this.formValidate.applicantType = 'AGAIN';
      }
      this.init()
    },
    mounted(){
      //暂时没有初始化,预留初始化入口
    },
    methods:{

      //获取当前登录人的信息
      SuccessGetCurrData(res){
        let data = res.data;
        if(!data) {
          this.errorMess('获取信息失败');
          return;
        }
        this.getData = data;
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
          let formValidate =this.formDate(this.getFormData(this.formValidate),['openTime','closingDate'],'yyyy-MM-dd') ;
          this.addMessTitle.ajaxParams.data=formValidate;
          this.ajax(this.addMessTitle,isLoadingFun)
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
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel',this.addMessTitle.type);
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },


      //点击研究生
      graduateClick(){
        this.personModal = true;
      },
      /*
       * 组件初始化入口
       * */
      init(){
        this.ajax(this.listMessTitle)
      },

      selectHostCallback(data){
          this.userData = data;
          let ids = [];
          let names = []
          for(let i=0;i<data.length;i++){
              let item = data[i]
              ids.push(item.key);
              names.push(item.label);
          }
        this.graduateName = names;
        this.formValidate.graduateId = ids.join(',');
        this.formValidate.graduateName = names.join(',');
        this.personModal = false;
      },


      //选中的通知id
      selectApplication(item){
          this.formValidate.oldId = item.id;
          this.formValidate.noticeId = item.noticeId;
          this.formValidate.title = item.thesisTitle;
          this.selectNoticeModal=false
      },

      expenseFileEvent(ids){
          this.formValidate.attachmentId = ids;
      },


    },


    components:{
      selectNotice
    }
  }
</script>

