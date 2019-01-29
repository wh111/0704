<!--
****--@file     award_add
****--@date     2018/11/15 17:23
****--@author   ZWT
****--@describe 添加
-->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules"
             class="demo-form-inline" label-width="130px">
      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="获得者:" prop="userId">
            <el-input @focus="selectUser" readonly
                      v-model="formValidate.userName"
                      placeholder="请输入"></el-input>
            <!--<el-button type="primary" size="mini" @click="selectUser"  icon="plus"></el-button>-->
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="获得时间:" prop="createTime">
            <el-date-picker v-model="formValidate.createTime" type="date"
                            placeholder="请选择时间"
                            style="width:130px;">
            </el-date-picker>
            <!--<el-input v-model="formValidate.createTime"></el-input>-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="所属生源:" prop="userType">
            <el-select v-model="formValidate.userType" placeholder="请选择">
              <el-option label="住院医师" value="ZYY"></el-option>
              <el-option label="进修生" value="JXS"></el-option>
              <el-option label="研究生(专业学位)" value="YJSZY"></el-option>
              <el-option label="研究生(科学学位)" value="YJSKX"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="成果描述:" prop="awardDesc">
            <el-input v-model="formValidate.awardDesc" type="textarea"
                      resize="none" :rows="8" placeholder="请输成果描述"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="成果类型:" prop="awardType">
            <el-select v-model="formValidate.awardType" placeholder="请选择"
                       @change="trigger">
              <el-option
                v-for="item in semesterOptions"
                :key="item.key"
                :label="item.key"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="影响因子:" prop="awardInfluenceFactor">
            <el-input v-model="formValidate.awardInfluenceFactor"
                      placeholder="请输入影响因子"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="等级:" prop="awardLevel"
                        v-if="(formValidate.userType=='YJSZY'||formValidate.userType=='YJSKX')&&formValidate.awardType!=='成果'">
            <el-select v-model="formValidate.awardLevel" placeholder="请选择"
                       v-if="formValidate.awardType=='课题'">
              <el-option label="国家级" value="国家级"></el-option>
              <el-option label="省级" value="省级"></el-option>
              <el-option label="市级" value="市级"></el-option>
            </el-select>
            <el-select v-model="formValidate.awardLevel" placeholder="请选择"
                       v-if="formValidate.awardType=='论文'">
              <el-option label="SCI" value="SCI"></el-option>
              <el-option label="中华系列" value="中华系列"></el-option>
              <el-option label="统计源" value="统计源"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9"
                v-if="(formValidate.userType=='YJSZY'||formValidate.userType=='YJSKX')&&formValidate.awardType!=='成果'">
          <el-form-item label="排名:" prop="awardSort">
            <el-select v-model="formValidate.awardSort" placeholder="请选择">
              <el-option label="第一名" :value="1"></el-option>
              <el-option label="第二名" :value="2"></el-option>
              <el-option label="第三名" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2" v-else>
          <el-form-item label="排名:" prop="awardSort">
            <el-select v-model="formValidate.awardSort" placeholder="请选择">
              <el-option label="第一名" :value="1"></el-option>
              <el-option label="第二名" :value="2"></el-option>
              <el-option label="第三名" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24" style="text-align: center">
        <load-btn @listenSubEvent="listenSubEvent"
                  :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
    <!--选择人员弹窗-->
    <Modal
      width="1000"
      v-model="selectUserModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="selecrUserCancel"
                   @setUsers="subCallback" :operaility-data="operailityData"
                   :isOnlyOne="true"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api'
  import { award as rules } from '../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'award_add',
    props: ['operailityData', 'type'],
    data () {
      return {
        rules,
        initUser: [],
        selectUserId: {
          id: 'selectUserId',
          title: '选择人员',
        },
        semesterOptions: [
          {
            key: '论文',
          },
          {
            key: '成果',
          },
          {
            key: '课题',
          },
        ],
        formValidate: {
          userName: '',
          depId: '',
          userId: '',
          awardType: '论文',
          awardName: '',
          awardLevel: '',
          awardDesc: '',
          awardInfluenceFactor: '',
          awardSort: 1,
          userType: 'ZYY',
          createTime: '',
        },
        // 新增保存
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            jsonString: true,
            url: api.addList.path,
            method: api.addList.method,
            data: {},
          },
        },
        loadBtn: {title: '保存', callParEvent: 'listenSubEvent'},
        usernames: [],
        userids: [],
        teachingclassification: [],
        classname: [],
        canEdit: true,
        selectUserModal: false,
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        if (this.type == 'edit') {
          this.editsaveTitle = {
            type: 'edit',
            successTitle: '修改成功!',
            errorTitle: '修改失败!',
            ajaxSuccess: 'ajaxSuccess',
            ajaxParams: {
              jsonString: true,
              url: api.editsave.path + this.operailityData.id,
              method: api.editsave.method,
              data: {},
            },
          },
            this.listMessTitle = {
              ajaxSuccess: 'SuccessGetCurrData',
              ajaxParams: {
                url: api.editList.path + this.operailityData.id,
              },
            }
          this.ajax(this.listMessTitle);
        }

      },
      SuccessGetCurrData (responseData) {
        let data = responseData.data
        this.formValidate = data;
        this.initUser = [
          {
            description: '人员id---12864的描述信息',
            key: data.userId,
            label: data.userName,
            disabled: false,
            specialty: '',
          }];
        this.formValidate.userName = data.userName;

      },
      selecrUserCancel () {
        this.selectUserModal = false;
      },
      // 选择人员
      //点击选择人员输入时调用
      selectUser () {
        this.selectUserModal = true;
      },
      //确定选择人员调用
      subCallback (list) {
        let item = list[0]
        this.formValidate.userName = item.label;
        this.formValidate.userId = item.key;
        this.selecrUserCancel();
      },
      trigger () {
        this.formValidate.awardLevel = '';
      },
      // 请求回显数据
      // SuccessGetCurrData(res) {
      //   this.formValidate = res.data;
      //   res.data.userList.map(item => {
      //     this.usernames.push(item.userName);
      //     this.userids.push(item.userId);
      //   });
      // },
      listenSubEvent (isLoadingFun) {
        // if(this.formValidate.userList.length === 0){
        //   this.errorMess("请至少选择一位任务接收人");
        //   return;
        // }
        let saveTitle = '';
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          let formValidate = this.formDate(
            this.$util._.defaultsDeep({}, this.formValidate),
            ['createTime'], 'yyyy-MM-dd');
          if (this.type == 'edit') {
            saveTitle = this.editsaveTitle
          } else {
            saveTitle = this.addMessTitle
          }
          saveTitle.ajaxParams.data = formValidate;
          this.ajax(saveTitle, isLoadingFun);
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      cancel () {
        this.$emit('cancel', this.type);
      },
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {},
  }

</script>
