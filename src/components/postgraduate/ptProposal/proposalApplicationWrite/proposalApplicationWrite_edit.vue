<template>

  <div>
    <el-form :model="formValidate" :rules="rules" ref="formValidate" class="demo-form-inline" label-width="90px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="申请人:">
            {{operailityData.name}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编号:">
            {{operailityData.studentId}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <!--<el-col :span="12">-->
        <!--<el-form-item label="年级:"  >-->
        <!--{{operailityData.boundary}}-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="12">
          <el-form-item label="手机号:">
            {{operailityData.phone}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="专业方向:">
            {{operailityData.specialtyName}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="专业代码:">
            {{operailityData.specialtyCode}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="时间:" prop="applicationDate">
            <el-date-picker
              style="width: 100%;"
              v-model="formValidate.applicationDate"
              type="date"
              :editable="false"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="地点:" prop="place">
            <el-input v-model="formValidate.place" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="研究方向:" prop="researchDirection">
            <el-input v-model="formValidate.researchDirection" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="论文题目:" prop="thesisTitle">
            <el-input v-model="formValidate.thesisTitle" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="课题摘要:" prop="projectSummary">
            <el-input v-model="formValidate.projectSummary" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <div style="text-align: center;margin: 10px;font-size: 18px">
            <strong>组员</strong>
            <el-button type="primary" icon="plus" @click="add" style="float: right;margin: 0 0 10px;"></el-button>
          </div>
        </el-col>
        <el-col>
          <el-table
            align="center"
            :data="formValidate.memberList"
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%;height: 100%">
            <el-table-column
              align="center"
              label="序号"
              type="index"
              width="75">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="thesnameisTitle"
              align="center"
              label="姓名">
              <template scope="scope">
                <el-input v-model="scope.row.name"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="sex"
              align="center"
              label="性别">
              <template scope="scope">
                <el-radio-group v-model="scope.row.sex">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="positionalTitle"
              prop="name"
              label="职称">
              <template scope="scope">
                <el-input v-model="scope.row.positionalTitle"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="professionalDirection"
              align="center"
              label="专业方向">
              <template scope="scope">
                <el-input v-model="scope.row.professionalDirection"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="company"
              label="单位"
              align="center">
              <template scope="scope">
                <el-input v-model="scope.row.company"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="boundary"
              label="操作"
              width="80"
              align="center">
              <template scope="scope">
                <el-button type="danger" size="small" @click="remove">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <br>


      <!--<el-row >-->
      <!--<el-col :span="18" :offset="2">-->
      <!--<el-form-item label="开题通知:" prop="noticeId" >-->
      <!--<el-input v-model="formValidate.noticeName" readonly @focus="selectNoticeModal=true" placeholder="请输入"></el-input>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--</el-row >-->

      <!--<el-row >-->
      <!--<el-col :span="18" :offset="2">-->
      <!--<el-form-item label="附件:" prop="attachmentId">-->
      <!--<upload-file :length="1" :uploadFiles="formValidate.fileList"  @setUploadFiles="expenseFileEvent"></upload-file>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--</el-row >-->
    </el-form>

    <el-row>
      <el-col align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
    <!--选择通知-->
    <!--<Modal-->
    <!--close-on-click-modal="false"-->
    <!--width="890"-->
    <!--v-model="selectNoticeModal"-->
    <!--title="新建教学活动"-->
    <!--class-name="vertical-center-modal">-->
    <!--<modal-header slot="header" :content="selectNoticeId"></modal-header>-->
    <!--<select-notice v-if="noticeId" @cancel="selectNoticeModal=false" @selectTemp="selectNotice" :url="url" :tempId="noticeId" ></select-notice>-->
    <!--<div slot="footer"></div>-->
    <!--</Modal>-->
  </div>
</template>
<script>
  import { proposalApplicationWrite as rules } from '../rules';
  //当前组件引入全局的util
  //  import selectNotice from "./selectNotice.vue"
  let Util = null;
  export default {
    props: ['operailityData', 'url'],
    data () {
      return {
        rules,
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          applicationDate: '', // 时间
          place: '',//地点
          researchDirection: '',  //研究方向
          thesisTitle: '',  //论文题目
          projectSummary: '',  //课题摘要
//          attachmentId:'',  //附件id
          status: 'WSB',  //状态
          noticeName: '',
//          noticeId:'',  //开题通知id
          applicantType: 'ORDINARY',  //申请类型  ORDINARY普通申请,CHANGE更改申请,AGAIN再次开题申请'
          memberList: []
        },
        userData: [],
        selectNoticeModal: false,
        selectNoticeId: {
          id: 'selectNoticeId',
          title: '选择研究生',
          usersData: ''
        },
        graduateName: [],
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功',
          errorTitle: '修改失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: this.url.applicationModify.path + this.operailityData.id,
            method: this.url.applicationModify.method,
            data: {}
          }
        },
        noticeId: '',
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: this.url.applicationGet.path + this.operailityData.id
          }
        }
      };
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted () {
      //初始化
      this.init();
    },
    methods: {
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        let _this = this;
        let flag = true;
        this.formValidate.memberList.forEach(function (value) {
          if (value.name != '' && value.positionalTitle != '' && value.professionalDirection != '' && flag) {
            return flag = true;
          }
          _this.errorMess('请将信息填写完整');
          return flag = false;
        });
        if (isSubmit && flag) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          let formValidate = this.formDate(this.getFormData(this.formValidate), ['applicationDate'], 'yyyy-MM-dd');
          this.editMessTitle.ajaxParams.data = formValidate;
          this.ajax(this.editMessTitle, isLoadingFun);
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
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData (responseData) {
        let data = responseData.data;
        this.noticeId = data.noticeId;
        data.noticeName = data.title;
        if (!data.memberList) {
          data.memberList = [];
        }
        this.formValidate = this.getFormValidate(this.formValidate, data);
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel () {
        this.$emit('cancel', 'edit');
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },

      //点击研究生
      graduateClick () {
        this.personModal = true;
      },

      /*
       * 组件初始化入口
       * */
      init () {
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },

      selectHostCallback (data) {
        this.userData = data;
        let ids = [];
        let names = [];
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          ids.push(item.key);
          names.push(item.label);
        }
        this.graduateName = names;
        this.formValidate.graduateId = ids.join(',');
        this.formValidate.graduateName = names.join(',');
        this.personModal = false;
      },

      //选中的通知id
      selectNotice (item) {
        this.formValidate.noticeId = item.id;
        this.formValidate.noticeName = item.title;
        this.selectNoticeModal = false;
      },

      expenseFileEvent (ids) {
        this.formValidate.attachmentId = ids;
      },

      //添加成员
      add () {
        let tableData = this.formValidate.memberList;
        tableData.push({
          'name': '',
          'sex': '男',
          'positionalTitle': '',
          'professionalDirection': '',
          'company': ''

        });

      },
      //移除组员
      remove (index) {
        let tableData = this.formValidate.memberList;
        if (tableData.length < 2) {
          this.showMess('不能移除');
          return;
        }
        tableData.splice(index, 1);
      }

    },

    components: {
//      selectNotice
    }
  };
</script>

