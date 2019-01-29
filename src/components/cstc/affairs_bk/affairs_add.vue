<template>
  <!--事项增加-->
  <div class="editForm">
    <el-form :model="formValidate" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="130px">

      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="日期：" prop="registerDate" required>
            <!-- <el-date-picker v-model="formValidate.registerDate" @change="changeDay" :editable="false" :picker-options="pickerOptions"
              type="date" placeholder="选择日期"></el-date-picker> -->
            <el-date-picker v-model="formValidate.registerDate" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="时间段：" prop="timeInterval">
            <el-time-select v-model="formValidate.timeInterval" :editable="false" :picker-options="{start,step: '00:05', end: '22:30' }"
              placeholder="选择时间">
            </el-time-select>
          </el-form-item>
        </el-col>

        <el-col :span="10" :offset="1">
          <el-form-item label="类型：" prop="affairType">
            <el-select placeholder="请选择类型" v-model="formValidate.affairType">
              <el-option v-for="item in typeOption" v-if="item.value" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="课时：" prop="classhour">
            <el-input v-model="formValidate.classhour" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="10" :offset="1">
          <el-form-item label="人次：" prop="peopleNum">
            <el-input v-model="formValidate.peopleNum" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="教师/考官：" prop="teacher">
            <el-input v-model="formValidate.teacher" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="10" :offset="1">
          <el-form-item label="登记人：" prop="creater">
            <el-input v-model="formValidate.creater" :readonly="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="21" :offset="1">
          <el-form-item label="培训地点：" required>
            <span style="display:inline;margin-right:20px;">{{ roomNums.join('，') }}</span>
            <el-button type="info" @click="selectRoom">选择房间</el-button>
          </el-form-item>
        </el-col>

        <el-col :span="21" :offset="1">
          <el-form-item label="培训/考核对象：" required>
            <!-- <span v-for="(item,index) in users" :key="index">{{ item.userName }}</span>
            <el-button type="info" @click="selectUser">选择人员</el-button> -->
            <el-radio-group v-model="formValidate.trainingObject">
              <el-radio v-for="item in userOption" :key="item.label" :label="item.label">{{ item.value }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="使用部门：">
            <!-- <span>{{ formValidate.department }}</span>
            <el-button type="info">选择部门</el-button> -->
            <el-input v-model="formValidate.department" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="22" :offset="1">
          <el-form-item label="培训/考核内容：">
            <el-input type="textarea" v-model="formValidate.trainingContent" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22" :offset="1">
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="formValidate.remark" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="4" class="btnBox">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
      <el-col :span="4" class="btnBox" :offset="2">
        <el-button @click="cancelAdd">取消</el-button>
      </el-col>
    </el-row>
    <!--选择房间-->
    <Modal :mask-closable="false" v-model="selectRoomModal" height="200" class-name="vertical-center-modal" :width="960">
      <modal-header slot="header" :content="headerContent.selectRoomId"></modal-header>
      <select-room v-if="selectRoomModal" @cancel="cancel" @select="selectRoomCallback" :select="roomIds"></select-room>
      <div slot="footer"></div>
    </Modal>
    <!--选择人员-->
    <Modal width="890" v-model="selectUserModal" title="新建教学活动" class-name="vertical-center-modal">
      <modal-header slot="header" :content="headerContent.selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="cancel" @setUsers="setUsers" :initUser="users"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;

  import api from './api';
  import typeOption from './typeOption'; // 事项类型
  import userOption from './userOption'; // 培训对象
  import selectRoom from '../../common/selectRoom'; // 选择房间

  import {
    affairs as rules
  } from '../rules'; // 验证规则
  export default {
    data() {
      return {
        rules,
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        start: '06:00',
        countDate: 0,
        users: [],
        roomIds: [],
        roomNums: [],
        //form表单bind数据
        formValidate: {
          registerDate: "",
          timeInterval: "",
          classhour: "",
          affairType: "",
          trainingObject: "ALL",
          peopleNum: "",
          teacher: "",
          department: "",
          creater: "",
          trainingContent: "",
          remark: "",
          roomList: [ //
            // {
            //   "roomId": "1",
            //   "roomNum": "101"
            // }
          ],
          userList: [ //
            // {
            //   userId: 1,
            //   userName: '666'
            // }
          ]
        },
        userOption,
        typeOption, // 事项类型
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.add.path,
            method: api.add.method
          }
        },
        selectRoomModal: false,
        selectUserModal: false,
        headerContent: {
          selectRoomId: {
            id: "selectRoomId",
            title: "选择房间"
          },
          selectUserId: {
            id: "selectUserId",
            title: "选择人员"
          }
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
      this.formValidate.creater = this.$store.state.userInfo.name;
    },
    methods: {
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!this.roomIds.length) {
            this.errorMess('请选择培训地点')
            return
          }
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          let data = this.addMessTitle.ajaxParams.data;
          data.roomIds = this.roomIds.join(',');
          data.roomNums = this.roomNums.join(',');
          data.registerDate = this.conductDate(data.registerDate, 'yyyy-MM-dd');
          // console.log(this.addMessTitle.ajaxParams.data)
          this.ajax(this.addMessTitle, isLoadingFun)
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
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancelAdd() {
        this.$emit('cancel', this.addMessTitle.type);
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      /*
       * 组件初始化入口
       * */
      init() {
        //this.ajax(this.listMessTitle)
      },
      // 选择日期
      changeDay(day) {
        let selDay = new Date(day).getTime();
        let thisDay = new Date();
        if (selDay > thisDay.getTime()) { // 如果选择日期超过今天，则时间段从06：00开始
          this.start = '06:00';
        } else { // 如果选择的是今天，那么根据当前时间来设置时间段
          let h = thisDay.getHours();
          let m = thisDay.getMinutes();
          m = m < 30 ? '30' : '00';
          h = m === '00' ? h + 1 : h; // 如果当前分钟已经大于30，则下一小时才是起始时间段
          h = h < 10 ? '0' + h : h;
          this.start = h + ':' + m;
        }
        this.formValidate.timeInterval = '';
      },
      /********************************* 按钮事件 *****************************/
      // 选择房间
      selectRoom() {
        this.openModel('selectRoom')
      },
      // 选择人员
      selectUser() {
        this.openModel('selectUser')
      },
      /********************************* 弹窗相关 *****************************/
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
      /********************************* 弹窗回调 *****************************/
      // 选择房间
      selectRoomCallback(res) {
        this.roomIds.length = 0;
        this.roomNums.length = 0;
        res.map(item => {
          this.roomIds.push(item.id);
          this.roomNums.push(item.roomNum)
        });
        this.cancel('selectRoom')
      },
      // 选择人员
      setUsers(res) {
        this.users = res;
        this.cancel('selectUser')
        // let tempArr = [];
        // for (var i = 0, item; i < this.users.length; i++) {
        //   item = this.users[i];
        //   tempArr.push(item.label);
        //   this.formValidate.managerList.push({
        //     id: item.key,
        //     name: item.label,
        //   })
        // }
        // this.userNames = tempArr.join(",");
      },
    },
    components: {
      selectRoom
    }
  }

</script>
<style lang="scss">
  @import '../../../assets/ambuf/css/manage_v1.0/editForm';

</style>
