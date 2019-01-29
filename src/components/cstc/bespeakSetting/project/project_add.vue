<template>
  <!-- 预约项目管理 - 增加 -->
  <div>
    <el-form label-width="120px" :model="formValidate" ref="formValidate" :rules="rules">
      <el-row>
        <el-col>
          <el-form-item label="名称：" prop="name">
            <el-input v-model="formValidate.name" style="width:400px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="选择房间：">
            <div class="bpProjectSelectRoom" v-for="(item,index) in roomList" :key="item.id">
              <el-button @click="showRoomInfo(item.id)">{{ item.roomNum }}</el-button>
              <span>承载量：</span>
              <el-input v-model="item.bearingCapacity"></el-input>
            </div>
            <el-button type="primary" @click="selectRoom">选择房间</el-button>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="选择模型：">
            <el-tooltip class="item" effect="light" placement="bottom-start" v-for="(item,index) in deviceList" :key="index">
              <div slot="content" style="max-width:200px;">
                <p>设备名称：{{ item.deviceTypeName }}</p>
                <p>设备数量：{{ item.deviceNum || 0 }}</p>
                <p>设备简介：{{ item.describe || '暂无简介' }}</p>
              </div>
              <el-button>{{ item.deviceTypeName }}</el-button>
            </el-tooltip>
            <el-button type="primary" @click="selectDevice">选择模型</el-button>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="预约简介：">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" v-model="formValidate.summary">
            </el-input>
          </el-form-item>
        </el-col>


        <!-- <el-col :span="12">
          <el-form-item label="是否开放预约：">
            <el-radio v-model="formValidate.isOpen" label="YES">开放</el-radio>
            <el-radio v-model="formValidate.isOpen" label="NO">关闭</el-radio>
          </el-form-item>
        </el-col> -->
        <!-- <template v-if="formValidate.isOpen === 'YES'"> -->
        <el-col :span="12">
          <el-form-item label="选择开放日期：">
            <el-radio v-model="formValidate.timeModel" label="ALL">全天候</el-radio>
            <el-radio v-model="formValidate.timeModel" label="SPECIFIC">特定日期</el-radio>
          </el-form-item>
        </el-col>

        <el-col v-if="formValidate.timeModel === 'SPECIFIC'">
          <el-form-item label="设置开放时间：">
            <el-checkbox-group v-model="allDayTimeSlot">
              <el-checkbox v-for="(item,index) in timeSlot" :key="item.timeId" :label="index">{{ item.courseTime }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="开放预约对象：">
            <el-radio-group v-model="formValidate.userType">
              <div class="bpProjectBox">
                <div class="bpProjectItem">
                  <el-radio label="ALL">全体人员</el-radio>
                </div>
                <div class="bpProjectItem">
                  <el-radio label="ZYY">住院医</el-radio>
                  <el-radio label="JXS">进修生</el-radio>
                  <el-radio label="SXS">实习生</el-radio>
                  <el-radio label="YJS">研究生</el-radio>
                </div>
                <div class="bpProjectItem">
                  <el-radio label="SPECIFIC">特定人员</el-radio>
                  <template v-if="formValidate.userType === 'SPECIFIC'">
                    <el-tag type="success" class="bpUserItem" :closable="true" v-for="(item,index) in formValidate.userList" @close="removeUser(index)"
                      :key="item.userId">{{ item.userName }}</el-tag>
                    <el-button type="info" size="small" style="margin-left:10px;" @click="selectUser">选择人员</el-button>
                  </template>
                </div>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <div style="clear:both;" class="newCalendar" v-if="formValidate.timeModel === 'SPECIFIC'">
          <full-calendar ref="newCalendar" class="test-fc" :tpl="calendarSet.tpl" :itemLimit="calendarSet.itemLimit" :events="calendarSet.fcEvents" first-day='1'
            locale="zh-cn" @changeMonth="changeMonth" @eventClick="eventClick" @dayClick="dayClick" @moreClick="moreClick"
            @goPrev="goPrev" @goNext="goNext">
            <template slot="fc-header-left" scope="p">
              <span style="font-size: 16px;">{{monthTitle}}</span>
            </template>
            <template slot="fc-header-center" scope="p">
              <span v-if="false">周-历</span>
            </template>
            <template slot="fc-header-right" scope="p">
              <div style="float: right">
                <el-button-group>
                  <el-button type="primary" icon="arrow-left" @click="goPrev"></el-button>
                  <el-button type="primary" icon="arrow-right" @click="goNext"></el-button>
                </el-button-group>
              </div>
            </template>
            <template slot="fc-event-card" scope="p">
              <p>{{ p.event.title }}</p>
            </template>
          </full-calendar>
        </div>
        <!--</template>-->

        <el-col align="center" style="margin-top:10px;">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
      </el-row>

    </el-form>

    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" class-name="vertical-center-modal" :loading="true" :width="800">
      <modal-header slot="header" :parent="self" :content="contentHeader.showId"></modal-header>
      <room-view v-if="showModal" @cancel="cancel" :operaility-data="operailityData" :id="todoId"></room-view>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 选择房间 -->
    <Modal :mask-closable="false" v-model="selectRoomModal" class-name="vertical-center-modal" :loading="true" :width="800">
      <modal-header slot="header" :parent="self" :content="contentHeader.selectRoomId"></modal-header>
      <select-room v-if="selectRoomModal" :select="selectRoomId" @cancel="cancel" @select="selectRoomCall"></select-room>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 选择设备 -->
    <Modal :mask-closable="false" v-model="selectDeviceModal" class-name="vertical-center-modal" :loading="true" :width="900">
      <modal-header slot="header" :parent="self" :content="contentHeader.selectDeviceId"></modal-header>
      <select-device v-if="selectDeviceModal" :select="selectDeviceId" @cancel="cancel" @select="selectDeviceCall"></select-device>
      <div slot="footer"></div>
    </Modal>
    <!--选择人员-->
    <Modal :mask-closable="false" width="890" v-model="selectUserModal" title="添加人员" class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="cancel" @setUsers="selectUserCall" :initUser="initUser"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import api from './api';

  import roomView from '../../room/roomManage/roomManage_view'; // 房间查看
  import selectRoom from '../../../common/selectRoom'; // 选择房间
  import selectUser from '../../../common/selectUser'; // 选择人员
  import selectDevice from '../../device/deviceStorage/deviceStorage_select'; // 选择设备
  import fullCalendar from 'vue-ambuf-fullcalendar'; // 周历
  //引入日历相关的配置
  import calendarSet from './calendarSet';
  // 验证规则
  import {
    bespeakSetProject as rules
  } from '../../rules';
  export default {
    props: ['opData'],
    data() {
      return {
        rules,
        self: this,
        todoId: '', // 查看房间id
        //保存按钮基本信息
        loadBtn: {
          title: '保存设置',
          callParEvent: 'listenSubEvent'
        },
        initUser: [],
        selectRoomId: [],
        roomList: [], // 已选房间
        selectDeviceId: [],
        deviceList: [], // 已选房间
        //form表单bind数据
        formValidate: {
          name: '', // 预约项目名称
          summary: '', // 预约简介
          userType: 'ALL', // 开放预约对象类型
          roleId: '', // 可预约角色id
          userIds: '', // 可预约人id字符串，多个id以逗号分隔
          deviceTypeIds: '', // 设备ids字符串，多个id以逗号分隔
          isCourse: 'NO', // 是否课程
          status: 'ADOPT', // 预约项目状态
          // isOpen: 'YES', // 是否开放预约
          timeModel: 'SPECIFIC', // 选择开放日期
          userList: [ // 人员列表
            // {
            //   userId:'',
            //   userName:''
            // }
          ],
          openTimeList: [ // 开放时间列表
            // {
            //   "reserveSetType": "ROOM", // 预约设置类型
            //   "date": "2017-01-02", // 日期
            //   "timeSetIds": "1,2,3" // 时间段id字符串
            // },
          ],
          roomList: [ // 房间列表
            // {
            //   "roomId": "1", // 房间id
            //   "bearingCapacity": "5" // 承载量
            // }
          ],
        },

        openTimeList: {}, // 开放日期
        allDayTimeSlot: [], // 全天开放时间段(只记录索引)
        timeSlot: [], // 时间段
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '增加成功!',
          errorTitle: '增加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: api.add.path,
            method: api.add.method
          }
        },

        // 模态窗
        selectDeviceModal: false,
        selectRoomModal: false,
        selectUserModal: false,
        contentHeader: {
          showId: {
            id: "showId",
            title: "查看房间"
          },
          selectRoomId: {
            id: "selectRoomId",
            title: "选择房间"
          },
          selectDeviceId: {
            id: 'selectDeviceId',
            title: '选择模型'
          },
          selectUserId: {
            id: "selectUserId",
            title: "选择人员"
          }
        },

        // 周历
        calendarSet,
        monthTitle: "",
        //是否显示全日历
        isShowCalendar: false,
        operailityData: {},
      }
    },
    methods: {
      // 初始化
      init() {
        calendarSet.setCalData([]);
        this.getTimeSlotList();
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        if (!this.submitForm('formValidate')) {
          return false
        }

        this.formValidate.deviceTypeIds = this.selectDeviceId.join(','); // 设备

        let roomList = [];
        this.roomList.map(item => {
          roomList.push({
            roomId: item.id,
            bearingCapacity: item.bearingCapacity
          })
        })
        this.formValidate.roomList = roomList;

        let userIdArr = [];
        this.formValidate.userList.map(item => {
          userIdArr.push(item.userId)
        });
        this.formValidate.userIds = userIdArr.join(',');

        let openTimeListArr = [];
        let openTimeList = this.$util._.defaultsDeep({}, this.openTimeList);
        this.$util._.map(openTimeList, item => {
          item.reserveSetType = 'PROJECT';
          delete item.timeSlot;
          openTimeListArr.push(item)
        })
        this.formValidate.openTimeList = openTimeListArr;

        if (!this.checkData()) {
          return
        }

        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true);

        this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
        // console.log(this.addMessTitle.ajaxParams.data);
        // isLoadingFun();
        this.ajax(this.addMessTitle, isLoadingFun)
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = this.$util._.defaultsDeep({}, data);
        return myData;
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

      // 检测数据是否合理
      checkData() {
        if (!this.formValidate.roomList.length) {
          this.errorMess('至少选择一个房间')
          return false
        }
        if (!this.selectDeviceId.length) {
          this.errorMess('至少选择一台设备')
          return false
        }
        for (let list = this.formValidate.roomList, item, l = list.length, i = 0; i < l; i++) {
          item = list[i];
          if (isNaN(item.bearingCapacity) || item.bearingCapacity > 10000 || item.bearingCapacity < 1) {
            this.errorMess(`房间号“${this.roomList[i].roomNum}”承载量 1-10000 之间`)
            return false
          }
        }
        if (this.formValidate.userType === 'SPECIFIC' && !this.formValidate.userList.length) {
          this.errorMess('至少选择一个人员')
          return false
        }
        if (this.formValidate.timeModel === 'SPECIFIC' && !this.formValidate.openTimeList
          .length) {
          this.errorMess('开放日期至少要有一天')
          return false
        }
        return true
      },
      /*********************************************************** 周历 ***********************************************/
      goPrev() {
        this.$refs['newCalendar'].goPrev()
      },
      goNext() {
        this.$refs['newCalendar'].goNext()
      },
      changeMonth(start, end, current, foramatData) {
        this.monthTitle = foramatData(current, 'MMMM YYYY');
        this.currMonth = this.conductDate(current, "yyyy-MM");
      },
      /**
       * 日期格式化内容被点击时触发
       * @param event      {}  当前被点击内容对象
       * @param jsEvent    {}  被点击的鼠标事件对象
       * @param pos        {}  当前位置对象
       */
      eventClick(event, jsEvent, pos) {
        this.dayClick(event.start, jsEvent)
      },
      /**
       * @param day
       * @param jsEvent
       */
      dayClick(day, jsEvent) {
        let date = (this.conductDate(day, "yyyy-MM-dd")).toString();
        let allDayTimeSlot = this.allDayTimeSlot;
        if (this.openTimeList[date] && !this.allDayTimeSlot.length) {
          delete this.openTimeList[date] // 如果当前日期没有选择时间段则删除此日期
        } else if (this.allDayTimeSlot.length) {
          let item;
          let tempAllDayTimeSlotObj = {
            id: [],
            title: []
          };
          allDayTimeSlot.map(i => {
            item = this.timeSlot[i];
            tempAllDayTimeSlotObj.id.push(item.timeId); // 选中的时间段id
            tempAllDayTimeSlotObj.title.push(item.courseTime); // 选中的时间段文本描述
          })
          this.openTimeList[date] = {
            date,
            timeSetIds: tempAllDayTimeSlotObj.id.join(','),
            timeSlot: tempAllDayTimeSlotObj.title,
          }
        }
        this.setAllDayTimeSlot()
      },
      // 设置日期对应的时间段
      setAllDayTimeSlot() {
        let data = this.openTimeList;
        let showData = [];
        this.$util._.map(data, (item, key) => {
          if (item.timeSlot.length) {
            item.timeSlot.map(tItem => {
              showData.push({
                title: tItem,
                start: item.date,
                end: item.date,
              })
            })
          } else {
            delete data[key]
          }
        })
        calendarSet.setCalData(showData);
      },
      /**
       * @param day
       * @param events
       * @param jsEvent
       */
      moreClick(day, events, jsEvent) {
        //console.log('moreCLick', day, events, jsEvent)
      },

      // 选择房间
      selectRoom() {
        this.openModel('selectRoom');
      },

      // 选择房间
      selectRoomCall(res) {
        this.selectRoomId.length = 0;
        for (let index in res) {
          this.selectRoomId.push(res[index].id);
          res[index].bearingCapacity = ''
        }
        this.roomList = res;
        this.cancel('selectRoom')
      },

      // 选择设备模型
      selectDevice() {
        this.openModel('selectDevice')
      },

      // 选择设备模型
      selectDeviceCall(res) {
        this.selectDeviceId.length = 0;
        for (let index in res) {
          this.selectDeviceId.push(res[index].id);
        }
        this.deviceList = res;
        this.cancel('selectDevice')
      },

      // 选择人员
      selectUser() {
        let userList = this.formValidate.userList;
        this.initUser.length = 0;
        if (userList.length > 0) {
          for (var i = 0, item; i < userList.length; i++) {
            item = userList[i];
            this.initUser.push({
              key: item.userId,
              label: item.userName,
              description: '人员id---' + item.userId + '的描述信息',
              disabled: false
            })
          }
        }
        this.openModel('selectUser');
      },

      // 选择人员回调
      selectUserCall(res) {
        this.formValidate.userList.length = 0;
        this.$util._.forEach(res, val => {
          this.formValidate.userList.push({
            userId: val.key,
            userName: val.label,
          })
        })
        this.cancel('selectUser');
      },

      // 删除人员
      removeUser(index) {
        this.formValidate.userList.splice(index, 1)
      },

      // 房间查看
      showRoomInfo(id) {
        this.todoId = id;
        this.openModel('show')
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
      // 模态窗关闭
      cancel(options) {
        this[options + 'Modal'] = false;
      },

      // 获取周历标题
      getDataTitle(obj) {
        return obj.name + '（' + obj.startTime + ' - ' + obj.endTime + '）'
      },

      // 获取时间段
      getTimeSlotList() {
        this.ajax({
          ajaxSuccess: res => this.timeSlot = res.data || [],
          ajaxParams: {
            url: api.teachCourseTime.path,
            method: api.teachCourseTime.method
          }
        })
      },

      // 获取数据
      getDataForServer() {
        this.ajax({
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: api.get.path + this.roomIds[0],
            method: api.get.method
          }
        })
      },

      // 初始化数据
      getDataSuccess(res) {
        let fData = this.formValidate;
        let rData = res.data.roomReserveSet;
        let timeSlotId = [];
        let index;
        fData.isOpen = rData.isOpen;
        fData.timeModel = rData.timeModel;
        this.timeSlot.map(item => timeSlotId.push(item.id));
        rData.openTimeList.map(item => {
          let timeSlot = [];
          item.timeSetId.split(',').map(id => {
            index = timeSlotId.indexOf(id);
            if (index > -1) {
              timeSlot.push(this.getDataTitle(this.timeSlot[index]))
            }
          });
          this.openTimeList[item.date] = {
            date: item.date,
            timeSetIds: item.timeSetId,
            timeSlot,
          }
        })
        this.setAllDayTimeSlot()
      },
    },
    components: {
      fullCalendar,
      roomView,
      selectUser,
      selectRoom,
      selectDevice
    },
    created() {
      this.init()
    }
  }

</script>

<style lang="scss">
  /* 预约项目管理 - 增加 */

  .newCalendar .comp-full-calendar {
    max-width: 1280px;
    padding: 10px 0;
  }

  .newCalendar .full-calendar-body .dates .dates-events .events-week .events-day {
    min-height: 90px;
  }

  .newCalendar .full-calendar-body .dates .dates-events .events-week .events-day .event-box {
    overflow: hidden;
    width: 95%;
    position: relative;
    top: -18px;
  }

  .bpProjectBox {
    display: inline-block; // padding-top: 10px;
    .bpProjectItem {
      height: 36px;
      line-height: 36px;
      .el-input {
        width: 250px;
        margin-left: 20px;
        display: inline-block;
      }
      &~.bpProjectItem {
        margin-top: 16px;
      }
    }
    .bpUserItem {
      margin-left: 6px;
      margin-top: -9px;
    }
  }

  .bpProjectSelectRoom {
    margin-bottom: 10px;
    .el-input {
      width: 80px;
    }
  }

</style>
