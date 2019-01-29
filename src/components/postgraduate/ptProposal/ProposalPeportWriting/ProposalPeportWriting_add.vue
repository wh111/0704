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
          <el-form-item label="入学年月:" prop="entranceDate">
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

    <!--选择人员-->
    <Modal
      close-on-click-modal="false"
      width="890"
      v-model="selectUserModal"
      title="新建教学活动"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="selectUserModal=false" @setUsers="selectUserCallback" :initUser="selectUser"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import {proposalApplicationWrite as rules} from '../rules'
  //当前组件引入全局的util
  let Util=null;
  export default {
      props:['operailityData','url'],
    data (){
      return{
        rules,
        getData:{},
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
        selectType:'',
        selectUser:[],  // 选择的人员（小组成员，主持人 ，记录员）
        userData:[],
        selectUserModal:false,
        selectNoticeModal:false,
        selectNoticeId:{
          id:"selectNoticeId",
          title:"选择研究生",
          usersData:''
        },
        graduateName:[],

        selectUserId:{id:'selectUserId',title:'选择人员'},

        //标签
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',


        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:this.url.applicationAdd.path,
            method:this.url.applicationAdd.method,
            data:{},
          }
        },
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'open/topic/report/getUserInfo',
          }
        },
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
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
          let formValidate =this.formDate(this.getFormData(this.formValidate),['entranceDate','reportDate'],'yyyy-MM-dd') ;
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


      handleClose(tag) {
        this.formValidate.groupMember.splice(this.formValidate.groupMember.indexOf(tag), 1);
        this.formValidate.groupMembers = this.formValidate.groupMember.join(',')

      },

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


      //选择人员回调
      selectUserCallback(){


      }
    },


    components:{
    }
  }
</script>

