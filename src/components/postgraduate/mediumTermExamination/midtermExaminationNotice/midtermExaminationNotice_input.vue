<!--
****--@file     midtermExaminationNotice_input
****--@date     2018/8/9 20:15
****--@author   YC
****--@describe 中期考核通知-编辑
-->
<template>
  <div>
    <el-row>
      <el-form :model="formInline" :rules="rules" ref="formInline">
        <el-row>
          <!--<el-col>-->
          <!--<el-form-item label="专业方向：" label-width="100px" prop="majorCode">-->
          <!--<el-select v-model="formInline.majorCode" placeholder="请选择">-->
          <!--<major @successMajor="createMajor" :unAll="true"></major>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col>
            <el-form-item label="导师：" label-width="100px" class="is-required">
              <el-button @click="openModel('selectTeacher')" size="small" type="info">选择导师</el-button>
              <div v-if="selectTeacher.length>0">{{ selectTeacher | getArrText('label') }}</div>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="学员：" label-width="100px" class="is-required">
              <el-button @click="openModel('selectStudent')" size="small" type="info">选择学员</el-button>
              <div v-if="selectStudent.length>0">{{ selectStudent | getArrText('label') }}
              </div>
            </el-form-item>
          </el-col>
          <el-col class="el-form--inline">
            <date-group :dateGroup="{text:'',startDate:formInline.examStartDate,endDate:formInline.examEndDate}">
              <el-form-item label="开放时间：" style="margin-left: 8px;" prop="examStartDate">
                <el-date-picker name="start" v-model="formInline.examStartDate" :editable="false" type="date"
                                placeholder="选择起始时间"
                                :picker-options="pickerOptions0"
                                @change="handleStartTime"></el-date-picker>
              </el-form-item>
              <el-form-item label="-" prop="examEndDate" class="disabledRequired">
                <el-date-picker name="end" v-model="formInline.examEndDate" :editable="false" type="date"
                                placeholder="选择截止时间"
                                :picker-options="pickerOptions1"
                                @change="handleEndTime"></el-date-picker>
              </el-form-item>
            </date-group>
          </el-col>
          <el-col>
            <el-form-item label="通知内容：" prop="content" label-width="100px">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入" v-model="formInline.content">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <el-col align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancelEdit">取消</el-button>
      </el-col>
    </el-row>

    <!--选择人员-->
    <Modal :mask-closable="false" width="890" v-model="selectTeacherModal" class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectTeacherId"></modal-header>
      <selectU @cancel="cancel('selectTeacher')" :url="treeUrl" :isOnlyOne="false" :ajaxData="{rootId:-102}"
               @setUsers="selectHostCallback" :initUser="selectTeacher"></selectU>
      <div slot="footer"></div>
    </Modal>
    <!--选择学生-->
    <Modal :mask-closable="false" width="890" v-model="selectStudentModal" class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectStudentId"></modal-header>
      <select-user @cancel="cancel('selectStudent')" :url="url" :isOnlyOne="false" @setUsers="selectHostCallback1"
                   :initUser="selectStudent"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<style lang="scss">
  .disabledRequired {
    .el-form-item__label:before {
      display: none;
    }
  }
</style>
<script>
  /*当前组件必要引入*/
  import api                                   from './api';
  import { midtermExaminationNotice as rules } from '../rules';
  import selectU                               from '../../ptResearchSelections/openingMentor/setMentor_base/selectUser.vue';  //选择主持人
  import major                                 from '../../common/major.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'midtermExaminationNoticeInput',
    props: ['operailityData'],
    data () {
      return {
        rules,
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        selectTeacherModal: false,
        selectStudentModal: false,
        url: '/dept/tree-by-YJS',
        treeUrl: '/teacherType/tree/', //目录树结构请求地址

        selectTeacher: [],//当前选中导师的数据
        selectStudent: [],//当前选中的学生的数据
        selectTeacherId: {id: 'selectTeacherId', title: '选择导师'},
        selectStudentId: {id: 'selectStudentId', title: '选择学员'},

        major: {}, // 专业
        //form表单bind数据
        formInline: {
//          majorName: '', // 专业名称
//          majorCode: '', // 专业代码
          teacherIds: '', // 导师id字符串
          teacherNames: '', // 导师姓名字符串
          userIds: '', // 学生id字符串
          userNames: '', // 学生姓名字符串
          examStartDate: '', // 结束时间
          examEndDate: '', // 开始时间
          content: '' // 通知内容
        },
        editType: 'add'
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        if (this.operailityData) {
          this.editType = 'edit';
          this.getViewData();
        }
      },
      // 获取查看数据
      getViewData () {
        let opt = {
          ajaxSuccess: 'getViewDataSuccess',
          ajaxParams: {
            url: api.get.path + this.operailityData.id
          }
        };
        this.ajax(opt);
      },
      getViewDataSuccess (res) {
        let data = res.data;
        let selectTeacher = [];
        let selectStudent = [];
        let teacherIds = res.data.teacherIds.split(',');
        let teacherNames = res.data.teacherNames.split(',');
        let userIds = res.data.userIds.split(',');
        let userNames = res.data.userNames.split(',');
        teacherIds.map((key, index) => selectTeacher.push({key, label: teacherNames[index]}));
        userIds.map((key, index) => selectStudent.push({key, label: userNames[index]}));
        console.log(selectTeacher);
        this.selectTeacher = selectTeacher;
        this.selectStudent = selectStudent;
        this.formInline = data;
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        if (!this.submitForm('formInline')) {
          return false;
        }
        let opt = {
          type: this.editType,
          successTitle: '提交成功!',
          errorTitle: '提交失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: api[this.editType].path + (this.editType === 'add' ? '' : this.operailityData.id),
            method: api[this.editType].method,
            data: this.getSaveData()
          }
        };
        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true);
        this.ajax(opt, isLoadingFun);
      },
      // 获取保存数据
      getSaveData () {
        let data = this.getFormData(this.formInline);
        let teachers = [[], []];
        let students = [[], []];
//        data.majorName = this.major[data.majorCode].major;
        data.examStartDate = this.conductDate(data.examStartDate, 'yyyy-MM-dd');
        data.examEndDate = this.conductDate(data.examEndDate, 'yyyy-MM-dd');
        this.selectTeacher.map(item => {
          teachers[0].push(item.key); // id
          teachers[1].push(item.label); // name
        });
        this.selectStudent.map(item => {
          students[0].push(item.key);
          students[1].push(item.label);
        });
        data.userIds = students[0].join(',');
        data.userNames = students[1].join(',');
        data.teacherIds = teachers[0].join(',');
        data.teacherNames = teachers[1].join(',');
        return data;
      },
      //选择人员的回调函数
      selectHostCallback (data) {
        this.selectTeacherModal = false;
        this.selectTeacher = data;
      },
      selectHostCallback1 (data) {
        this.selectStudentModal = false;
        this.selectStudent = data;
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
        if (flag && (!this.selectTeacher.length || !this.selectStudent.length)) {
          this.errorMess((!this.selectTeacher.length ? '导师' : '学员') + '至少选择一个！');
          flag = false;
        }
        return flag;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancelEdit () {
        this.$emit('cancel', this.editType);
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        return Util._.defaultsDeep({}, data);
      },
      /**
       * 专业数据初始化
       * */
      createMajor (majorArr) {
        let major = {};
        majorArr.map(item => major[item.majorCode] = item);
        this.major = major;
      },
      /********************************* 弹窗相关 *****************************/
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {selectU, major}
  };

</script>
