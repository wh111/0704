<template>

  <div >
    <el-form :model="formValidate" :rules="rules" ref="formValidate"   class="demo-form-inline"  label-width="100px" >

      <el-row >
        <el-col :span="13" :offset="1">
          <el-form-item label="姓名:" prop="userName" >
            <el-input @focus="selectUser" readonly v-model="formValidate.userName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="科室:"   prop="school">
            <el-select v-model="formValidate.depId" placeholder="请选择">
              <select-option type="byUserType" :unAll="true"></select-option>
            </el-select>
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="13" :offset="1">
          <el-form-item label="发生时间:"  prop="occurrenceTime">
            <el-date-picker
              v-model="formValidate.occurrenceTime"
              type="date"
              :editable="false"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9" >
          <el-form-item label="奖惩类型:">
            <el-radio-group v-model="formValidate.rewardAndPunishmentType">
              <el-radio label="0">奖励</el-radio>
              <el-radio label="1">惩罚</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row >
      <el-row>
        <el-col :span="11" :offset="1"
                v-if="formValidate.rewardAndPunishmentType=='0'">
          <el-form-item label="奖励类型:" prop="punishmentType">
            <el-select v-model="formValidate.punishmentType" placeholder="请选择">
              <el-option label="表扬信" value="表扬信"></el-option>
              <el-option label="优秀住院医师" value="优秀住院医师"></el-option>
              <el-option label="优秀实习生" value="优秀实习生"></el-option>
              <el-option label="优秀实习组长" value="优秀实习组长"></el-option>
              <el-option label="竞赛获奖" value="竞赛获奖"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1" v-else>
          <el-form-item label="惩罚类型:" prop="punishmentType">
            <el-select v-model="formValidate.punishmentType" placeholder="请选择">
              <el-option label="乙级病历" value="乙级病历"></el-option>
              <el-option label="丙级病例" value="丙级病例"></el-option>
              <el-option label=" 行风、宿舍纪律有效投诉" value=" 行风、宿舍纪律有效投诉"></el-option>
              <el-option label="违反实验室及科室相关规定" value="违反实验室及科室相关规定"></el-option>
              <el-option label="未按照计划轮转" value="未按照计划轮转"></el-option>
              <el-option label="未及时完成APP填写" value="未及时完成APP填写"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="22" :offset="1">
          <el-form-item label="事项描述:"   prop="rewardAndPunishmentDescribe">
            <el-input v-model="formValidate.rewardAndPunishmentDescribe" type="textarea"  resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
        <el-row >
          <el-col :span="22" :offset="1">
            <el-form-item label="教育处意见:"  prop="opinion" >
              <el-input v-model="formValidate.opinion" type="textarea"  resize="none" :rows="8"></el-input>
            </el-form-item>
          </el-col>
        </el-row >
        <el-row >
          <el-col :span="22" :offset="1">
            <el-form-item label="审核意见:"  prop="approvalOpinion" >
              <el-input v-model="formValidate.approvalOpinion" type="textarea"  resize="none" :rows="8"></el-input>
            </el-form-item>
          </el-col>
        </el-row >
        <el-row >
          <el-col :span="22" :offset="1">
            <el-form-item label="处理办法:"  prop="treatmentMethod" >
              <el-input v-model="formValidate.treatmentMethod" type="textarea"  resize="none" :rows="8"></el-input>
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

    <!--选择人员弹窗-->
    <Modal
      width="1000"
      v-model="selectUserModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectUserId"></modal-header>
        <select-user v-if="selectUserModal" @cancel="selecrUserCancel" @setUsers="subCallback" :operaility-data="operailityData" :isOnlyOne="true"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  //当前组件引入全局的util
  import {practiceRecords as rules} from '../rules'

  let Util=null;
  export default {
    props: ['operailityData','type'],
    data (){
      return{
        rules,
        initUser:[],
        /*--按钮button--*/
        selectUserId:{id:'selectUserId',title:'选择人员'},
        selectUserModal:false,

        formValidate:{
          userName:'',
          userId:'',                        //用户id
          depId:'',                       //科室ID
          occurrenceTime:'',                //发生时间（格式:yyyy-MM-dd）
          rewardAndPunishmentType:'0',     //奖惩类型(0.奖励, 1惩罚)
          rewardAndPunishmentDescribe:'',     //事项描述
          opinion:'',                     //opinion
          approvalOpinion:'',              //审核意见
          treatmentMethod:'',                     //处理办法
          rewardAndPunishmentStatus:'TG',      //wsb.未上报、dsh.审核中(待审)...
          fileIds:'',                           //附件id字符串
          punishmentType: '',
        },
        name:'',
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        countDate:0,

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'rewardAndPunishment/add',
            method:'post'
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: 'rewardAndPunishment/get/' + this.operailityData.id,
          },
        },
      }
    },

      created(){
        //给当前组件注入全局util
        Util = this.$util;
      },
      mounted(){
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
            this.addMessTitle.ajaxParams.data=this.formDate(this.getFormData(this.formValidate),['occurrenceTime'],this.yearMonthData);
            this.addMessTitle.ajaxParams.data.rewardAndPunishmentType = this.addMessTitle.ajaxParams.data.rewardAndPunishmentType+'';
            this.addMessTitle.ajaxParams.data.rewardAndPunishmentStatus =  'TG';
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


        /*
         * 组件初始化入口
         * */
        init(){
          //this.ajax(this.listMessTitle)
        },


        selecrUserCancel(){
          this.selectUserModal = false;
        },
        //点击选择人员输入时调用
        selectUser(){
            this.selectUserModal = true;
        },
        //确定选择人员调用
        subCallback(list){
          let item = list[0]
          this.formValidate.userName = item.label;
          this.formValidate.userId = item.key;
          this.selecrUserCancel();
        },


      }

  }
</script>
