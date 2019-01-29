<template>

  <div style="padding: 0 10px;">
    <el-form ref="formValidate" :model="formValidate" :rules="rules" class="demo-form-inline" label-width="130px">
      <!--内容-->
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="审核意见：" prop="auditStatus">
            <el-radio-group v-model="formValidate.auditStatus">
              <el-radio label="AUDIT_SUCCESS">通过</el-radio>
              <el-radio label="AUDIT_FAILURE">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="审核意见：" prop="reason">
            <el-input v-model="formValidate.reason"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <br/>
    <el-row>
      <el-col :span="10" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
    <!--选择人员-->

  </div>
</template>

<script>
  import api from './api';
  import {teachersManagementAudit as rules} from '../../rules';

  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData', 'deptId', 'treeObj'],
    data() {
      return {
        rules,
        showUserInfo: {name: ''}, // 选择人员的基本信息
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          types: this.treeObj.types,
          ids: "",
          auditStatus: 'AUDIT_SUCCESS',//审核状态
          reason: ''//审核意见
        },

        //选择人员
        selectUserId: {
          id: "selectUserId",
          title: "选择人员",
          usersData: []
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'audit',
          successTitle: '审核成功!',
          errorTitle: '审核失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.audit.path,
            method: api.audit.method,
            data: {}
          }
        },
      }
    },
    created() {
      let ids = [];
      this.operailityData.map(item => {
        ids.push(item.id)
      })
      this.addMessTitle.ajaxParams.url += ids.join(',');
      //初始化
//      this.init();
    },
    mounted() {

    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据
        if (typeof this.operailityData != "undefined") {
          this.formData = Object.assign(this.formData, this.operailityData);
        }
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
//        let data = this.$refs.OTHER.getInputData();
        this.addMessTitle.ajaxParams.data = this.formValidate;
        this.ajax(this.addMessTitle, isLoadingFun)
      },

      // 选择人员
      selectUser() {
        this.openModel('selectUser');
      },

      /*
      * 获取选择人员的人员信息并赋值
      * @param users [{id:'',name:''},{}]  已选人员信息
      * */
      setUsers(users) {
        this.selectUserId.usersData = users || [];
        this.formData.archivesId = users.length && users[0].key || '';
        if (this.formData.archivesId) {
          this.getUserInfo()
        } else {
          this.showUserInfo = null;
        }
        this.closeUserModal();
      },

      // 获取人员数据
      getUserInfo() {
        let opt = {
          ajaxSuccess: res => this.showUserInfo = res.data,
          ajaxParams: {
            url: api.getUserInfo.path + this.formData.archivesId,
            method: api.getUserInfo.method
          }
        };
        this.ajax(opt)
      },

      //关闭选择人员弹窗
      closeUserModal() {
        this.selectUserModal = false;
      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'audit');
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
    },
    components: {}
  }
</script>
