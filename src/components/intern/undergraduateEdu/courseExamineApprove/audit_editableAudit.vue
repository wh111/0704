<!----------------------------------
****--@name     可编辑的审核
****--@role     ${*}
****--@date     2018/5/28
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="课时:">
            {{formValidate.timeInfo }}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="课程内容:" prop="courseContent">
            <el-input v-model.trim="formValidate.courseContent"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="课程类型:" prop="courseType">
            <el-select v-if="optionData.length>0" v-model="formValidate.courseType" :filterable="true"
                       placeholder="选择类型"
                       @change="change">
              <el-option v-for="item in optionData" :key="item.name" :label="item.name" :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="授课老师:" prop="teachUserNames">
            <el-input readonly v-model="formValidate.teachUserNames" @focus="addUser(formValidate)"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="授课课时:">
            {{formValidate.courseTimeCount }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="授课地点:">
            {{ formValidate.courseAddress}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="审核结果">
            <el-radio-group v-model="formValidate.courseArrangeState">
              <el-radio label="PASS">通过</el-radio>
              <el-radio label="REJECT">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="审核意见">
            <el-input type="textarea" v-model="formValidate.reviewMess" :rows="6"
                      resize="none"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24" style="text-align: center;">
        <el-button type="success" @click="listenSubEvent">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
    <!--选择人员-->
    <Modal
      width="890"
      v-model="selectUserModal"
      title="新建教学活动"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="closeUserModal" @setUsers="setUsers"
                   :initUser="initUser"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入当前组件字典api
  import api from "../api.js";
  //引入--验证--组件
  import {courseExamineApprove as rules} from "../../rules";
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ["operailityData", 'type'],
    data() {
      return {
        rules,
        //保存按钮基本信息
        optionData: [{}],
        currSltUserName: "",
        course: [],
        formValidate: {
          id: this.operailityData.arrangeId,
          "courseArrangeId": '',
          "courseContent": "",
          "courseType": "",
          "courseAddress": "",
          "teachUserIds": "",
          "teachUserNames": "",
          "timeInfo": "",
          "weekSetId": this.operailityData.weekSetId,
          "courseArrangeState": "PASS",
          "reviewMess": "",
          type: this.type
        },
        range: [],//时间范围
        //请求课程类型
        getDepTitle: {
          ajaxSuccess: 'CourseType',
          ajaxParams: {
            url: api.getCourseTypeByCode.path,
            params: {}
          }
        },
        //教研室设置时间添加
        saveCourseTitle: {
          type: 'audit',
          successTitle: '审核成功!',
          errorTitle: '审核失败!',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.modifyReview.path,
            method: api.modifyReview.method,
            jsonString: true,
          }
        },

        //选择人员
        selectUserId: {
          id: "selectUserId",
          title: "选择人员",
          usersData: ''
        },

        //给选择人员框传递的已选人员信息
        initUser: [],
        disabled: {
          report: false,
          revoke: false,
        },
        //获取课程
        weekCourseGetTitle: {
          ajaxSuccess: 'weekCourseGetSuccess',
          ajaxParams: {
            url: api.weekCourseGet.path + this.operailityData.arrangeId,
            method: api.weekCourseGet.method,
          }
        },

        //教研室设置时间添加
        saveRoomCourseTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.weekCourseModify.path,
            method: api.weekCourseModify.method,
            jsonString: true,
          }
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //获取科室option数据
        this.ajax(this.getDepTitle);
      },

      //获取server端课程信息
      weekCourseGetSuccess(responseData) {
        let data = responseData.data;
        Object.assign(this.formValidate, data);
      },

      //获取server端返回的科室
      CourseType(responseData) {
        let data = responseData.data;
        if (!Util.isEmptyObject(data)) {
          this.optionData = data.child;
        }
        this.ajax(this.weekCourseGetTitle);
      },

      //添加人员
      addUser(itmeName) {
        this.initUser = [];
        if (this.formValidate.teachUserIds != "") {
          let teachUserNames = this.formValidate["teachUserNames"] + "";
          let teachUserIds = this.formValidate["teachUserIds"];
          if (teachUserNames.indexOf(",") > -1) {
            let names = teachUserNames.split(",");
            let ids = teachUserIds.split(",");

            for (var i = 0; i < names.length; i++) {
              if (names[i] != "") {
                this.initUser.push({
                  key: ids[i],
                  label: names[i],
                  description: '人员id---' + ids[i] + '的描述信息',
                  disabled: false
                })
              }
            }
          } else {
            this.initUser.push({
              key: teachUserIds,
              label: teachUserNames,
              description: '人员id---' + teachUserIds + '的描述信息',
              disabled: false
            })
          }
        } else {
          this.initUser = [];
        }
        this.openModel('selectUser');
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
        let namesArr = [];
        let idsArr = [];
        for (var i = 0; i < users.length; i++) {
          namesArr.push(users[i].label);
          idsArr.push(users[i].key);
        }
        this.formValidate["teachUserIds"] = idsArr.join(",");
        this.formValidate["teachUserNames"] = namesArr.join(",");
        this.closeUserModal();
      },

      /**保存或者上报*/
      listenSubEvent() {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          let formValidate = this.$util._.defaultsDeep({}, this.formValidate);
          formValidate.timeInfo = formValidate.time;
          this.saveCourseTitle.ajaxParams.data = formValidate;
          this.ajax(this.saveCourseTitle);
        }
      },

      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = true;
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            flag = false;
          }
        });
        return flag;
      },

      //选中值发生变化时触发
      change(val) {

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

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep([], data);
        return myData;
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {}
  }
</script>

