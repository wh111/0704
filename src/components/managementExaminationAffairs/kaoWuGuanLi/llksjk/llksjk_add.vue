<!--
****--@file     llksjk_add
****--@date     2018/9/26 14:44
****--@author   ZWT
****--@describe 理论考试监考
-->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="130px">
      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="监考任务：" prop="name">
            <el-input v-model="formValidate.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="监考人:" prop="userList">
            <el-tag v-for="(item,index) in formValidate.userList" :key="item.id" type="success">
              {{item.userName}}
            </el-tag>
            <el-button type="primary" size="mini" @click="selectUser" icon="plus"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="监考要求:" prop="invigilateRequirement">
            <el-input type="textarea" resize="none" :rows="8" v-model="formValidate.invigilateRequirement"></el-input>
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
      </el-row>

      <el-row>
        <el-col :span="9" :offset="2" v-if="formValidate.teachType == '本科教学'">
          <el-form-item label="课程名称:" prop="className">
            <el-select v-model="formValidate.className" placeholder="请选择" @change="classNameificationchange">
              <el-option
                v-for="item in classnameList"
                :key="item.outlineId"
                :label="item.outlineName"
                :value="item.outlineName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9" v-if="formValidate.teachType == '本科教学'">
          <el-form-item label="试卷名称:" prop="examName">
            <el-select v-model="formValidate.examName" placeholder="请选择" @change="examNameificationchange">
              <el-option
                v-for="(item,index) in ExameInfoList"
                :key="item.exameId"
                :label="item.exameNameList"
                :value="item.exameId">
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
  import { lljkamination as rules } from '../rules';
  import api from '../api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'llksjk_add',
    props: ['type', 'operailityData'],
    data () {
      return {
        rules,
        initUser: [],
        selectUserId: {
          id: 'selectUserId',
          title: '选择老师'
        },
        formValidate: {
          name: '',
          userList: [],
          invigilateRequirement: '',
          teachType: '',
          className: '',
          examId: '',
          examName: '',
          createTime: '',
          remark: ''
        },
        teachingclassification: [],
        classnameList: [],
        ExameInfoList: [],
        usernames: [],
        userids: [],
        //编辑数据
        listMessTitle: '',
        //编辑保存
        editsaveTitle: '',
        treeDefaults: {
          getTreeUrl: 'teacherType/tree?rootId=-101',
          getDataUrl: '',
          isShowMenus: true
        },
        //获取考务教学分类下拉框选项
        teachingclassificationTitle: {
          ajaxSuccess: 'SuccessGetClasData',
          ajaxParams: {
            url: api.teachingclassification.path + 'KAOWUGUANLI_TEACH_TYPE',
            method: api.teachingclassification.method
          }
        },
        //保存
        llKsjkAddTitle: {
          ajaxSuccess: 'Successeditsave',
          ajaxParams: {
            jsonString: true,
            url: api.llKsjkAdd.path,
            method: api.llKsjkAdd.method,
            data: {}
          }
        },
        classnameTitle: {
          ajaxSuccess: 'SuccessGetclassnameData',
          ajaxParams: {
            url: api.classname.path,
            method: api.classname.method
          }
        },
        pickerOptions0: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        //搜索option
        selectOption: {
          url: '/archives/query/teachNoPage?typeId='
        },
        //保存按钮基本信息
        loadBtn: {title: '保存', callParEvent: 'listenSubEvent'}
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        if (this.type == 'edit') {
          if (this.operailityData[0].teachType == '本科教学') {
            let className1 = this.operailityData[0].className;
            this.assemblyGetexamName(className1);
          }
          this.editsaveTitle = {
            successTitle: '修改成功',
            ajaxSuccess: 'SuccesseditTitlesave',
            ajaxParams: {
              jsonString: true,
              url: api.editllKsjk.path + this.operailityData[0].id,
              method: api.editllKsjk.method,
              data: {}
            }
          },
            this.listMessTitle = {
              ajaxSuccess: 'SuccessGetCurrData',
              ajaxParams: {
                url: api.llKsjkedit.path + this.operailityData[0].id
              }
            };
          this.ajax(this.listMessTitle);
        }

      },
      // 选择人员
      setUsers (res) {

        this.userids.length = 0;
        this.usernames.length = 0;
        res.map(item => {
          if (!this.userids.includes(item.key)) {
            this.usernames.push(item.label);
            this.userids.push(item.key);
          }
          item.userName = item.label;
          item.userId = item.key;
          delete item.label;
          delete item.key;
        });
        this.formValidate.userList = res;
        this.closeSltUser();
      },
      selectUser () {
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
            });
          });
          this.initUser = initUser;
        }
        this.selectUserModal = true;
      },
      SuccessGetCurrData (res) {
        this.formValidate = res.data;
        res.data.userList.map(item => {
          this.usernames.push(item.userName);
          this.userids.push(item.userId);
        });
      },
      // 取消选择带教老师
      closeSltUser () {
        this.selectUserModal = false;
      },
      // 编辑保存成功回调
      Successeditsave (res) {
        this.$emit('add', 'add', '保存成功');
      },
      SuccesseditTitlesave (res) {
        this.$emit('edit', 'edit', '修改成功');
      },
      listenSubEvent (isLoadingFun) {
        if (this.formValidate.userList.length === 0) {
          this.errorMess('请至少选择一位任务接收人');
          return;
        }
        let saveTitle = '';
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          let formValidate = this.formDate(this.$util._.defaultsDeep({}, this.formValidate),
            ['createTime'], 'yyyy-MM-dd');
          formValidate.examName = null;
          if (formValidate.teachType != '本科教学') {
            formValidate.examId = null;
            formValidate.className = null;
          }
          ;
          if (this.type == 'add') {
            saveTitle = this.llKsjkAddTitle;
          } else {
            saveTitle = this.editsaveTitle;
          }
          saveTitle.ajaxParams.data = formValidate;
          this.ajax(saveTitle, isLoadingFun);
        }
      },
      // 请求教学分类选项
      SuccessGetClasData (res) {
        this.teachingclassification = res.data.child;
      },

      classificationchange (value) {
        if (value == '本科教学') {
          this.ajax(this.classnameTitle);
        }
      },
      classNameificationchange (value) {
        if (value) {
          let classNames = value;
          if (this.typeof == 'edit') {
            if (value != this.operailityData[0].className) {
              this.formValidate.examName = null;
            }
          } else {
            this.formValidate.examName = null;
            this.assemblyGetexamName(classNames);
          }
        }
      },
      assemblyGetexamName (data) {
        let opt = {
          ajaxSuccess: (res) => {
            this.ExameInfoList = res.data;
          },
          ajaxParams: {
            url: api.getExameInfo.path,
            params: {
              name: data
            }
          }
        };
        this.ajax(opt);
      },
      SuccessGetclassnameData (res) {
        this.classnameList = res.data;
      },
      examNameificationchange (res) {
        this.formValidate.examId = res;
      },
      submitForm (formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      cancel (res) {
        this.$emit('cancel', this.type);
      }
    },
    created () {
      this.init();
      this.ajax(this.teachingclassificationTitle);
    },
    mounted () {
    },
    components: {}
  };

</script>
