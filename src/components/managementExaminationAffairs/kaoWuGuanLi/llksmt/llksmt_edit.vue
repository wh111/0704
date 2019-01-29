<!--
****--@file     llksmt_edit
****--@date     2018/9/29 11:27
****--@author   YYL
****--@describe 修改理论考试命题
-->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="130px">

      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="命题任务:" prop="name">
            <el-input placeholder="请输入命题任务" v-model="formValidate.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="任务接收人:" prop="userList">
            <!--<span v-model="usernames" class="deptReported">{{ usernames.join('，') }}</span>-->
            <el-tag v-for="(item,index) in formValidate.userList" :key="item.id" type="success" @close="handleMClose(index)">
              {{item.userName}}
            </el-tag>
            <!--<span v-for="item in formValidate.userList">{{item.userName}}</span>-->
            <el-button type="primary" size="mini" @click="selectUser"  icon="plus"></el-button>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="命题数量:" prop="number">
            <el-input placeholder="请输入命题数量" v-model="formValidate.number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="命题要求:" prop="request">
            <el-input type="textarea" resize="none" :rows="8" placeholder="请输入命题要求" v-model="formValidate.request"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="教学分类:" prop="teachType">
            <el-select v-model="formValidate.teachType" placeholder="请选择" @change="classificationchange">
              <el-option
                v-for="item in teachingclassification"
                :key="item.sequence"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9" v-if="formValidate.teachType == '本科教学'">
          <el-form-item label="课程名称:" prop="className">
            <el-select v-model="formValidate.className" placeholder="请选择">
              <el-option
                v-for="item in classname"
                :key="item.outlineId"
                :label="item.outlineName"
                :value="item.outlineName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="任务下放时间：" prop="createTime">
            <el-date-picker v-model="formValidate.createTime" type="date" :editable="false" placeholder="请选择时间"
                            style="width:130px;" :picker-options="pickerOptions0">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="备注:">
            <el-input type="textarea" resize="none" :rows="8" v-model="formValidate.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24" style="text-align: center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
    <!--选择任务接收人-->
    <Modal :mask-closable="false" width="890" v-model="selectUserModal" class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <!-- 此处人员还未对应 -->
      <select-user v-if="selectUserModal" @cancel="closeSltUser" @setUsers="setUsers" :initUser="initUser"
                   :treeOptions="treeDefaults" :selectOption="selectOption"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import selectUser from '../../../common/selectUser';
  import { llstatement as rules } from '../rules';
  import api from '../api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props:['type','operailityData'],
    data () {
      return {
        initUser:[],
        tselecUserModal: false,
        selectUserId: {
          id: 'selectUserId',
          title: '选择老师'
        },
        treeDefaults: {
          getTreeUrl: 'teacherType/tree?rootId=-101',
          getDataUrl: '',
          isShowMenus: true
        },
        //搜索option
        selectOption: {
          url: '/archives/query/teachNoPage?typeId='
        },
        formValidate: {
          name: '',
          userList: [],
          request: '',
          teachType: '',
          className: '',
          createTime: '',
          createTimeBegin: '',
          createTimeEnd: '',
          updateTime: '',
          updateTimeBegin: '',
          updateTimeEnd: '',
          remark: ''
        },
        usernames: [],
        userids: [],
        teachingclassification: [],
        classname: [],
        canEdit: true,
        rules,
        // 获取数据的回显
        listMessTitle: '',
        //获取考务教学分类下拉框选项
        teachingclassificationTitle: {
          ajaxSuccess: 'SuccessGetClasData',
          ajaxParams: {
            url: api.teachingclassification.path + 'KAOWUGUANLI_TEACH_TYPE',
            method: api.teachingclassification.method,
          },
        },
        classnameTitle: {
          ajaxSuccess: 'SuccessGetclassnameData',
          ajaxParams: {
            url: api.classname.path,
            method: api.teachingclassification.method,
          },
        },
        //编辑保存
        editsaveTitle: '',
        // 新增保存
        addsaveTitle: {
          successTitle: '保存成功',
          ajaxSuccess: 'Successeditsave',
          ajaxParams: {
            jsonString: true,
            url: api.addsaveTitle.path ,
            method: api.addsaveTitle.method,
            data: {}
          },
        },
        pickerOptions0: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        //保存按钮基本信息
        loadBtn: {title: '保存', callParEvent: 'listenSubEvent'}
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        //给当前组件注入全局util
        Util = this.$util;
        if(this.type == 'edit'){
          this.editsaveTitle= {
            successTitle: '修改成功',
            ajaxSuccess: 'SuccesseditTitlesave',
            ajaxParams: {
              jsonString: true,
              url: api.editsave.path + this.operailityData[0].id,
              method: api.editsave.method,
              data: {}
            },
          },
            this.listMessTitle= {
              ajaxSuccess: 'SuccessGetCurrData',
              ajaxParams: {
                url: api.llksmtedit.path + this.operailityData[0].id,
              },
            }
          this.ajax(this.listMessTitle);
        }

      },
      // 选择人员
      setUsers(res) {
        this.userids.length = 0;
        this.usernames.length = 0;
        res.map(item => {
          if (!this.userids.includes(item.key)) {
            this.usernames.push(item.label);
            this.userids.push(item.key)
          }
          item.userName = item.label;
          item.userId = item.key;
          delete item.label;
          delete item.key;
        })

        this.formValidate.userList = res;
        this.closeSltUser()
      },
      selectUser() {
        this.selectUserModal = true;
        let userids = this.userids;
        let usernames = this.usernames;
        this.initUser.length = 0;
        if (userids.length) {
          let initUser = [];
          Util._.forEach(userids, function (key, index) {
            initUser.push({
              key: userids[index],
              label: usernames[index],
              description: '人员id---' + key + '的描述信息',
              disabled: false
            })
          })
          this.initUser = initUser;
        }
        this.selectUserModal = true;
      },
      // 请求回显数据
      SuccessGetCurrData(res) {
        this.formValidate = res.data;
        res.data.userList.map(item => {
          this.usernames.push(item.userName);
          this.userids.push(item.userId);
        });
      },
      // 请求教学分类选项
      SuccessGetClasData(res){
        this.teachingclassification = res.data.child;
      },
      //当教学分类的值是本科教学是请求课程名称的下拉选项
      classificationchange(value){
        if(value == '本科教学'){
          this.ajax(this.classnameTitle);
        }
      },
      //获取课程名称选项
      SuccessGetclassnameData(res){
        this.classname = res.data;
      },
      // 保存成功回调
      Successeditsave(res){
        this.$emit('add', 'add', '保存成功');
      },
      // 保存成功回调
      SuccesseditTitlesave (res) {
        this.$emit('edit', 'edit', '修改成功');
      },
      listenSubEvent (isLoadingFun) {
        if(this.formValidate.userList.length === 0){
          this.errorMess("请至少选择一位任务接收人");
          return;
        }
        let saveTitle = '';
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          let formValidate =this.formDate(this.$util._.defaultsDeep({}, this.formValidate),
            ['createTime'],'yyyy-MM-dd') ;
          // this.type == 'edit'? saveTitle = this.editsaveTitle : this.addsaveTitle;
          if(this.type == 'edit'){
            saveTitle = this.editsaveTitle
          } else {
            saveTitle = this.addsaveTitle
          }
          saveTitle.ajaxParams.data = formValidate;
          this.ajax(saveTitle, isLoadingFun);
        }
      },
      cancel () {
        this.$emit('cancel', this.type);
      },
      // 取消选择带教老师
      closeSltUser() {
        this.selectUserModal = false
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
    },
    created () {
      this.init();
      this.ajax(this.teachingclassificationTitle)
    },
    mounted () {
    },
    components: {
      selectUser
    }
  };

</script>

<style lang="scss">
  .oeawInputTable {
    margin-top: 20px;
    overflow: auto;
    border: none;
    &:before, &:after {
      height: 0;
    }
    tr, td {
      border: 1px solid #bfcbd9;
    }
    .el-input__inner, .el-textarea__inner {
      border: none;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
    .jxTimeInput.el-date-editor.el-input {
      width: 130px;
    }
    .upFileBox {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
</style>

