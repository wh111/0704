<!--
****--@file     llkszj_add
****--@date     2018/9/26 14:06
****--@author   ZWT
****--@describe 理论考试组卷-新增
-->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="130px">

      <!--<el-row>-->
      <!--<el-col :span="18" :offset="2">-->
      <!--<el-form-item label="*命题任务:" prop="title">-->
      <!--<el-input  placeholder="请输入"></el-input>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="试卷名称:" prop="name">
            <el-input v-model="formValidate.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="组卷人:" prop="userList">
            <el-tag v-for="(item,index) in formValidate.userList" :key="item.id" type="success" @close="handleMClose(index)">
              {{item.userName}}
            </el-tag>
            <el-button type="primary" size="mini" @click="selectUser"  icon="plus"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="组卷描述:" prop="describes">
            <el-input type="textarea" resize="none" :rows="8" v-model="formValidate.describes"></el-input>
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
          <el-form-item label="备注:" prop="remark">
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
  import { llexamination as rules } from '../rules';
  import api from '../api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props:['type','operailityData'],
    name: 'llkszj_add',
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
        rules,
        teachingclassification: [],
        classname: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        //保存按钮基本信息
        loadBtn: {title: '保存', callParEvent: 'listenSubEvent'},
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
        // 编辑回显请求
        llkszjedit: '',
        // 新增保存考试组卷
        kszjaddsaveTitle: {
          ajaxSuccess: 'Successeditsave',
          ajaxParams: {
            jsonString: true,
            url: api.kszjaddsaveTitle.path,
            method: api.kszjaddsaveTitle.method,
            data: {},
          },
        },
        // 编辑保存考试组卷
        kszjeditsave: '',
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        if(this.type == 'edit'){
          this.kszjeditsave = {
            ajaxSuccess: 'SuccesseditTitlesave',
            ajaxParams: {
              jsonString: true,
              url: api.kszjeditsave.path + this.operailityData[0].id,
              method: api.kszjeditsave.method,
              data: {},
            },
          },
          this.llkszjedit = {
            ajaxSuccess: 'SuccessGetCurrData',
            ajaxParams: {
              url: api.llkszjedit.path + this.operailityData[0].id,
            },
          },
            this.ajax(this.llkszjedit);
        }
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
      // 编辑保存成功回调
      Successeditsave(res){
        this.$emit('add', 'add', '保存成功');
      },
      SuccesseditTitlesave (res) {
        this.$emit('edit', 'edit', '修改成功');
      },
      // 如果点击编辑,请求回显数据
      SuccessGetCurrData(res) {
        this.formValidate = res.data;
        res.data.userList.map(item => {
          this.usernames.push(item.userName);
          this.userids.push(item.userId);
        });
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
          if (formValidate.teachType != '本科教学') {
            formValidate.className = null;
          }
          // let saveTitle= this.type == 'add'? this.kszjaddsaveTitle : this.kszjeditsave;
          if(this.type == 'edit'){
            saveTitle = this.kszjeditsave
          } else {
            saveTitle = this.kszjaddsaveTitle
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
      this.ajax(this.teachingclassificationTitle);
      this.init();

    },
    mounted () {
    },
    components: {}
  };

</script>
