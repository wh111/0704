<template>

  <div>
    <el-form :model="formValidate" :rules="rules" ref="formValidate"  class="demo-form-inline" label-width="90px" >

      <el-row >
        <el-col :span="18" :offset="2">
          <el-form-item label="标题:" prop="title" >
            <el-input v-model="formValidate.title" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
          <el-col :span="18" :offset="2">
            <el-form-item label="研究生:" prop="graduateName" >
              <el-tag
                v-for="(tag,index) in graduateName"
                :key="index"
                style="margin: 0 5px"
                type="success">
                {{tag}}
              </el-tag>
              <el-button  size="small" type="primary" icon="plus" @click="graduateClick"></el-button>
            </el-form-item>
          </el-col>
      </el-row >

      <!--<el-row >-->
        <!--<el-col :span="8"  :offset="2">-->
          <!--<el-form-item label="开题时间" prop="openTime" >-->
            <!--<el-date-picker-->
              <!--v-model="formValidate.openTime"-->
              <!--type="date"-->
              <!--:editable="false"-->
              <!--placeholder="选择日期"-->
              <!--:picker-options="pickerOptions0"-->
              <!--@change="handleStartTime">-->
            <!--</el-date-picker>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="8"  :offset="3">-->
          <!--<el-form-item label="截止时间" prop="closingDate" >-->
            <!--<el-date-picker-->
              <!--v-model="formValidate.closingDate"-->
              <!--align="right"-->
              <!--:clearable="false"-->
              <!--type="date"-->
              <!--:editable="false"-->
              <!--placeholder="选择日期"-->
              <!--:picker-options="pickerOptions1"-->
              <!--@change="handleEndTime">-->
            <!--</el-date-picker>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->

      <el-row >
        <el-col :span="18" :offset="2">
          <el-form-item label="开题要求:" prop="requirement">
            <el-input v-model="formValidate.requirement" type="textarea" resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="18" :offset="2">
          <el-form-item label="开题须知:" prop="notice">
            <el-input v-model="formValidate.notice" type="textarea" resize="none" :rows="8"></el-input>
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
    <!--选择人员-->
    <Modal
      close-on-click-modal="false"
      width="890"
      v-model="personModal"
      title="新建教学活动"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="personId"></modal-header>
      <select-user v-if="personModal" @cancel="personModal=false"  url="/dept/tree-by-YJS" @setUsers="selectHostCallback" :initUser="userData" ></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  //当前组件引入全局的util
  import {proposalNotificationManager as rules} from '../rules'
  import selectUser from "../../../common/selectUser.vue"
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
          title:'',     //标题
          noticeType:'OPENTOPIC',        //通知类型 OPENTOPIC开题通知 REPORT开题报告通知 MIDSEMESTER中期考核通知 DEFENSE答辩通知
          graduateName:'',      //研究生名字
          graduateId:'',      //研究生id
//          openTime:'',      //开题时间
          requirement:'',      //开题要求
          notice:'',      //开题须知
          publishStatus:'UNPUBLISH',      //发布状态
//          closingDate:'',      //截止时间
        },
        userData:[],
        personModal:false,
        personId:{
          id:"personId",
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
            url:this.url.noticeAdd.path,
            method:this.url.noticeAdd.method,
            data:{},
          }
        },
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //暂时没有初始化,预留初始化入口
    },
    methods:{
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit){
          if(!isLoadingFun) isLoadingFun=function(){};
          isLoadingFun(true);
//          let formValidate =this.formDate(this.getFormData(this.formValidate),['openTime','closingDate'],'yyyy-MM-dd') ;
          let formValidate =this.getFormData(this.formValidate);
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
        //this.ajax(this.listMessTitle)
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

    },
    watch:{
      starTimes(val){
        let  date =  +val+(31*86400000);
         date = this.conductDate(date,'yyyy-MM-dd');
        if(!this.endTimes) {
          this.formValidate.closingDate = date;
        }
      },
    },

    components:{
      selectUser
    }
  }
</script>

