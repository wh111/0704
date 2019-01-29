<!--
****--@name   出科会议填写
****--@role     未知
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-row class="editForm">
      <!-- 表单 -->
      <el-form :model="formValidate" ref="formValidate" :rules="rules" label-width="130px">
        <el-col :span="12">
          <el-form-item label="会议名称：" prop="name">
            <el-input v-model="formValidate.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请单位：" prop="hosdeptName">
            <el-input v-model="formValidate.hosdeptName"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="参加人员：" prop="participantName" class="mrwUserBox">
            <el-tag type="gray" v-for="(item,index) in users" :key="index">{{ item.label }}</el-tag>
            <el-tag type="success" style="cursor:pointer;" @click.native="addUser">+添加人员</el-tag>
          </el-form-item>
        </el-col>
        <date-group :dateGroup="{text:'',startDate:formValidate.startTime,endDate:formValidate.endTime}">
          <el-col :span="12" name="start">
            <el-form-item label="会议开始时间：" prop="startTime">
              <el-date-picker v-model="formValidate.startTime" type="datetime" :editable="false" placeholder="选择日期时间"  :picker-options="pickerOptions0"
                              @change="handleStartTime"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12" name="end">
            <el-form-item label="会议结束时间：" prop="endTime">
              <el-date-picker v-model="formValidate.endTime" type="datetime" :editable="false" placeholder="选择日期时间" :picker-options="pickerOptions1"
                              @change="handleEndTime"></el-date-picker>
            </el-form-item>
          </el-col>
        </date-group>
        <el-col :span="12">
          <el-form-item label="会议地点：" prop="address">
            <el-input v-model="formValidate.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="劳务费：" prop="conferenceFee">
            <el-input v-model="formValidate.conferenceFee">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="会议内容：" prop="content">
            <el-input v-model="formValidate.content" type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6}"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="formValidate.remark" type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请人：" prop="applicantName">
            {{ formValidate.applicantName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请时间：" prop="applicantTime">
            {{ formValidate.applicantTime }}
          </el-form-item>
        </el-col>
      </el-form>
      <!-- 操作按钮 -->
      <el-col :span="6" :offset="6" align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
      <el-col :span="6" align="center">
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
    <!--选择人员-->
    <Modal width="890" v-model="selectUserModal" class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="closeUserModal" @setUsers="setUsers" :initUser="users"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import {meetingReportWrite as rules} from '../../rules';
  import selectUser from '../../../common/selectUser.vue'
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      operailityData: {
        type:Object,
        default: () => ({id:''})
      }
    },
    data() {
      return {
        rules,
        users: [],
        // 表单数据
        formValidate: {
          id: '',
          name: '', // 会议名称
          hosdeptId: '', // 申请单位ID
          hosdeptName: '', // 申请单位名称
          participantId: '', // 参加人员ID（多个，隔开）
          participantName: '', // 参加人员名称（多个，隔开）
          startTime: '', // 会议开始时间
          endTime: '', // 会议结束时间
          address: '', // 会议地点
          conferenceFee: '', // 劳务费
          content: '', // 会议内容
          remark: '', // 备注
          applicantName: '', // 申请人
          applicantTime: '', // 申请时间
          status: 'NOT_SUBMIT', // 状态 NOT_SUBMIT未上报（保存草稿）| NOT_AUDIT未审核（上报审核）
        },
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        messTitle: {
          type: this.operailityData.id ? 'edit' : 'add',
          successTitle: this.operailityData.id ? '修改成功!' : '添加成功!',
          errorTitle: this.operailityData.id ? '修改失败!' : '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.add.path,
            method: api.add.method
          }
        },
        selectUserModal: false,
        //选择人员
        selectUserId: {
          id: "selectUserId",
          title: "选择人员",
          usersData: ''
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        //给当前组件注入全局util
        Util = this.$util;

        if (this.operailityData.id) {
          this.getEditData()
        }else {
          // 当前申请人
          this.formValidate.applicantName = this.$store.getters.getUserInfo.name;
          this.formValidate.applicantTime = this.conductDate(new Date(), 'yyyy-MM-dd');
        }
      },
      // 获取编辑数据
      getEditData(){
        let opt = {
          ajaxSuccess: "getEditDataSuccess",
          ajaxParams:{
            url: api.get.path + this.operailityData.id,
            method:api.get.method
          }
        };
        this.ajax(opt)
      },
      // 初始化编辑数据
      getEditDataSuccess(res){
        if(!res.data || !res.data.id){
          return
        }

        for(let key in this.formValidate){
          if(res.data[key]){
            this.formValidate[key] = res.data[key]
          }
        }

        let userIds = res.data.participantId && res.data.participantId.split(',') || [];
        let userNames = res.data.participantName && res.data.participantName.split(',') || [];

        for(let i=0,l=userIds.length;i<l;i++){
          this.users.push({
            key:userIds[i],
            label:userNames[i],
            disabled: false,
          })
        }
      },
      /*
     * 点击提交按钮 监听是否提交数据
     * @param isLoadingFun boolean  form表单验证是否通过
     * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          this.messTitle.ajaxParams.data = this.getFormData(this.formValidate);
          let data = this.messTitle.ajaxParams.data;
          data.startTime = this.conductDate(data.startTime, 'yyyy-MM-dd HH:mm:ss') || '';
          data.endTime = this.conductDate(data.endTime, 'yyyy-MM-dd HH:mm:ss') || '';
          this.ajax(this.messTitle, isLoadingFun)
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      //添加人员
      addUser() {
        this.openModel('selectUser');
      },
      // 取消
      cancel() {
        this.$emit('cancel', this.messTitle.type)
      },
      //关闭选择人员弹窗
      closeUserModal() {
        this.selectUserModal = false;
      },
      /*
       * 获取选择人员的人员信息并赋值
       * @param users [{id:'',name:''},{}]  已选人员信息
       * */
      setUsers(users) {
        this.users = users;
        let userId = [];
        let userName = [];
        users.map(item => {
          userId.push(item.key);
          userName.push(item.label);
        })
        this.formValidate.participantId = userId.join(',');
        this.formValidate.participantName = userName.join(',');
        this.closeUserModal();
      },
      /*
      * 打开指定的模态窗体
      * @param options string 当前指定的模态:"add"、"edit"
      * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      selectUser,
    }
  }

</script>
<style lang="scss">
  .mrwUserBox {
    .el-tag {
      margin-right: 10px;
    }
  }
</style>
