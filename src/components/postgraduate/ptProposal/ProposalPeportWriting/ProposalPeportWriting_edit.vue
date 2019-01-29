<template>

  <div>
    <el-form  :model="formValidate" :rules="rules" ref="formValidate"   class="demo-form-inline" label-width="90px" >
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="研究生姓名:"  >
            {{getData.name}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="汉语拼音:"  >
            <el-input v-model="formValidate.pinyin" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="性别:" >
            {{getData.sex |typeText}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="出生年月:">
            {{getData.birthDate}}
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="入学年月:" >
            <el-date-picker
              v-model="formValidate.entranceDate"
              type="date"
              :editable="false"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="学科专业:" >
            {{getData.specialtyName}}
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
          <el-form-item label="课题名称:" prop="topicName" >
            <el-input v-model="formValidate.topicName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

      </el-row >

      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="导师姓名:" prop="tutorName" >
            <el-input v-model="formValidate.tutorName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="职称:" prop="positionalTitle" >
            <el-input v-model="formValidate.positionalTitle" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="18" :offset="2">
          <el-form-item label="指导小组成员:" prop="groupMembers" >
            <el-tag
              style="margin: 5px"
              :key="tag"
              v-for="tag in formValidate.groupMember"
              :closable="true"
              :close-transition="false"
              @close="handleClose(tag)"
              type="primary">
              {{tag}}
            </el-tag>
            <el-input
              style="width: 100px;"
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="mini"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else  size="small" @click="showInput('type')" icon="plus"  type="info"></el-button>
          </el-form-item>
        </el-col>
      </el-row >
<el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="开题报告日期:" prop="reportDate" >
            <el-date-picker
              v-model="formValidate.reportDate"
              type="date"
              :editable="false"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="出席人数:" prop="attendance" >
            <el-input v-model="formValidate.attendance" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="18" :offset="2">
          <el-form-item label="主持人:" prop="moderator" >
            <el-input v-model="formValidate.moderator" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="18" :offset="2">
          <el-form-item label="记录员:" prop="recorder" >
            <el-input v-model="formValidate.recorder" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="18" :offset="2">
          <el-form-item  prop="evaluationOpinion"  label="出席人员评价:">
            <el-input type="textarea" v-model="formValidate.evaluationOpinion" placeholder="出席人员对课题的评价，提出的主要问题记录"></el-input>
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
      <select-notice v-if="noticeId" @cancel="selectNoticeModal=false" @selectTemp="selectNotice" :url="url" :tempId="noticeId" ></select-notice>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import {proposalApplicationWrite as rules} from '../rules'
  //当前组件引入全局的util
  import selectNotice from "./selectNotice.vue"
  let Util=null;
  export default {
    props:['operailityData','url'],
    data (){
      return{
        rules,
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          pinyin:'',  //拼音
          entranceDate:'',  //入学年月
          researchDirection:'',  //研究方向
          topicName:'',  //课题名称
          tutorName:'',  //导师姓名
          positionalTitle:'',  //职称
          groupMembers:'',  //指导小组成员
          reportDate:'',  //开题报告日期
          moderator:'',  //主持人
          recorder:'',  //记录员
          attendance:'',  //出席人数
          evaluationOpinion:'',  //出席人员对课题的评价
          status:'WSB',  //状态
          noticeName:'',
          groupMember:[],  /// 小组成员
        },
        inputVisible:false,
        inputValue:'',
        getData:{},
        userData:[],
        selectNoticeModal:false,
        selectNoticeId:{
          id:"selectNoticeId",
          title:"选择研究生",
          usersData:''
        },
        graduateName:[],
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功',
          errorTitle:'修改失败',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:this.url.applicationModify.path+this.operailityData.id,
            method:this.url.applicationModify.method,
            data:{},
          }
        },
        selectType:'',
        noticeId:'',
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.applicationGet.path+this.operailityData.id,
          }
        },
        uesrMessTitle:{
          ajaxSuccess:'SuccessGetuesrData',
          ajaxParams:{
            url:'open/topic/report/getUserInfo',
          }
        },
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

      //获取当前登录人的信息
      SuccessGetuesrData(res){
        let data = res.data;
        if(!data) {
          this.errorMess('获取信息失败');
          return;
        }
        console.log(data);
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
          let formValidate =this.formDate(this.getFormData(this.formValidate),['entranceDate','reportDate'],'yyyy-MM-dd') ;
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
        if(data.groupMembers){
          data.groupMember = data.groupMembers.split(',');
        }else {
          data.groupMember = [];
        }
        this.formValidate = this.getFormValidate(this.formValidate,data);
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','edit');
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
        //默认请求加载数据
        this.ajax(this.listMessTitle);
        this.ajax(this.uesrMessTitle);
      },

      handleClose(tag) {
        this.formValidate.groupMember.splice(this.formValidate.groupMember.indexOf(tag), 1);
        this.formValidate.groupMembers = this.formValidate.groupMember.join(',')
      },

      /**
       * 显示组员输入框
       * */
      showInput(type) {
        this.selectType = type;
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.formValidate.groupMember.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
        this.formValidate.groupMembers = this.formValidate.groupMember.join(',')
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
      selectNotice(item){
        this.formValidate.noticeId = item.id;
        this.formValidate.noticeName = item.title;
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

