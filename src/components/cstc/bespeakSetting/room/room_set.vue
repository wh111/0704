<template>
  <!-- 房间预约管理 - 设置 -->
  <div>
    <el-form>

      <el-row>
        <el-col :span="24">
          <el-form-item label="房间号：">
            <!--<el-button type="text" v-for="(item,index) in opData" :key="index" @click="showRoomInfo(item.id)">-->
              <!--{{ item.roomNum }}-->
            <!--</el-button>-->
            <template v-for="item in opData">
              <el-tooltip :key="item.id" v-if="hoverRoomId===item.id" effect="light" placement="left" :open-delay="600">
                <template slot="content">
                  <room-view style="width: 500px;" isShowLoading="true" :id="item.id" :that="self"></room-view>
                </template>
                <span style="cursor: pointer;">{{ item.roomNum }}</span>
              </el-tooltip>
              <span style="cursor: pointer;" :key="item.id" v-else @mouseleave="roomMouseleave()" @mouseenter="roomMouseenter(item)">{{ item.roomNum }}</span>
            </template>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="是否开放预约：">
            <el-radio v-model="formValidate.isOpen" label="YES">开放</el-radio>
            <el-radio v-model="formValidate.isOpen" label="NO">关闭</el-radio>
          </el-form-item>
        </el-col>

        <template v-if="formValidate.isOpen === 'YES'">
          <el-col :span="12">
            <el-form-item label="选择开放日期：">
              <el-radio v-model="formValidate.timeModel" label="ALL">全天候</el-radio>
              <el-radio v-model="formValidate.timeModel" label="SPECIFIC">特定日期</el-radio>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="设置开放时间：">
              <el-checkbox-group v-model="allDayTimeSlot" style="display: inline;">
                <el-checkbox v-for="(item,index) in timeSlot" :key="item.timeId" :label="index" class="roomTimeSlot">
                  <timeQuantum :index="index" :range="range" :data="item"></timeQuantum>
                </el-checkbox>
              </el-checkbox-group>
              <el-button class="roomTimeSlotAddBtn" type="text" @click="addTimeSlot">添加时间段</el-button>
            </el-form-item>
          </el-col>

          <div style="clear:both;" class="newCalendar" v-if="formValidate.timeModel === 'SPECIFIC'">
            <full-calendar ref="newCalendar" class="test-fc" :tpl="calendarSet.tpl" :itemLimit="calendarSet.itemLimit"
                           :events="calendarSet.fcEvents" first-day='1'
                           locale="zh-cn" @changeMonth="changeMonth" @eventClick="eventClick" @dayClick="dayClick"
                           @moreClick="moreClick"
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

          <el-col>
            <el-form-item label="本房间中的设备：">
              <el-tag class="brsdItem" :key="item.id" v-for="(item,index) in roomDevice"
                      :closable="true"
                      :close-transition="false"
                      @close="handleClose('room',index)"
              >{{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}
              </el-tag>
              <el-tag class="brsdSelBtn brsdItem" type="primary" @click.native="selectDevice('room')">+选择设备</el-tag>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="设备库：">
              <el-tag class="brsdItem" :key="item.id" v-for="(item,index) in otherDevice"
                      :closable="true"
                      :close-transition="false"
                      @close="handleClose('other',index)"
              >{{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}
              </el-tag>
              <el-tag class="brsdSelBtn brsdItem" type="primary" @click.native="selectDevice('other')">+选择设备</el-tag>
            </el-form-item>
          </el-col>
        </template>

        <el-col align="center" style="margin-top:10px;">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
      </el-row>

    </el-form>

    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal"
           :loading="true"
           :width="800">
      <modal-header slot="header" :parent="self" content="查看房间"></modal-header>
      <room-view v-if="showModal" @cancel="cancel" :operaility-data="operailityData" :id="todoId"></room-view>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 选择设备 -->
    <Modal :mask-closable="false" v-model="selectDeviceModal" height="200" title="对话框标题"
           class-name="vertical-center-modal" :loading="true"
           :width="900">
      <modal-header slot="header" :parent="self" :content="selectDeviceId"></modal-header>
      <select-device v-if="selectDeviceModal" @select="selectDeviceCall" @cancel="cancel"
                     :select="selectDeviceType == 'room' ? roomDeviceId : otherDeviceId "
                     :url="selectDeviceUrl" :selectDeviceType="selectDeviceType"></select-device>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import api from './api';

  import roomView from '../../room/roomManage/roomManage_view'; // 房间查看
  import selectDevice from './device_select.vue';
  import fullCalendar from 'vue-ambuf-fullcalendar'; // 周历
  //引入日历相关的配置
  import calendarSet from './calendarSet';
  // 时间段插件
  import timeQuantum from '../../../common/timeQuantum.vue';

  export default {
    props: ['opData'],
    data () {
      return {
        self: this,

        range: [],
        item: [{
          start: '',
          end: '',
          time: ''
        }],

        todoId: '', // 查看房间id
        hoverRoomId: '',
        roomIds: [],
        roomDeviceId: [],
        otherDeviceId: [],
        roomDevice: [], // 房间内的设备
        otherDevice: [], // 房间外的设备
        selectDeviceUrl: '',
        selectDeviceType: '', // room|other
        selectDeviceModal: false,
        selectDeviceId: {
          id: 'selectDeviceId',
          title: '选择设备'
        },
        //保存按钮基本信息
        loadBtn: {
          title: '保存设置',
          callParEvent: 'listenSubEvent'
        },
        //form表单bind数据
        formValidate: {
          roomIds: '', // 房间 多个id以逗号分隔 ---> 1,2
          isOpen: 'YES', // 是否开放预约
          timeModel: 'ALL', // 选择开放日期
          openTimeList: [ // 开放时间列表
            // {
            //   "reserveSetType": "ROOM", // 预约设置类型
            //   "date": "2017-01-02", // 日期
            //   "timeSetIds": "1,2,3" // 时间段id字符串
            // },
          ],
          deviceList: [
//            {
//              deviceId:"",
//              inRoom:"", // 0|1
//            }
          ]
        },

        openTimeList: {}, // 开放日期
        allDayTimeSlot: [], // 全天开放时间段(只记录索引)
        timeSlot: [ // 开放时间段
          // {
          //   "timeId": "1",
          //   "courseTime": "08:00-08:50",
          //   "courseIndex": "1",
          //   "courseType": "0"
          // }

        ], // 时间段
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'set',
          successTitle: '保存成功!',
          errorTitle: '保存失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: api.set.path,
            method: api.set.method
          }
        },

        // 周历
        calendarSet,
        monthTitle: '',
        //是否显示全日历
        isShowCalendar: false,
        operailityData: {}
      };
    },
    methods: {
      // 初始化
      init () {
        this.roomIds.length = 0;
        this.opData.map(item => {
          this.roomIds.push(item.roomId);
        });
        this.formValidate.roomIds = this.roomIds.join(',');
        calendarSet.setCalData([]);
//        this.getTimeSlotList();
        // 如果设置单个房间
        if (this.opData.length === 1) {
          this.getDataForServer();
        }
      },
      // 房间划入事件
      roomMouseenter (item) {
        this.hoverRoomId = item.id;
      },
      // 房间滑出事件
      roomMouseleave () {
        this.hoverRoomId = '';
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let openTimeList = this.$util._.defaultsDeep({}, this.openTimeList);
        let openTimeListArr = [];

        this.$util._.map(openTimeList, item => {
          item.timeSlot.map(time => {
            let t = time.split('-');
            openTimeListArr.push({
              'reserveSetType': 'ROOM',
              'date': item.date,
              'startTime': t[0],
              'endTime': t[1]
            });
          });
        });

        //当设置的时间为全天候的时候
        if (this.formValidate.timeModel === 'ALL') {
          openTimeListArr = [];
          openTimeListArr = this.setOpenTimeList();
        }

        this.formValidate.openTimeList = openTimeListArr;

        if (!this.checkData()) {
          return;
        }

        if (!isLoadingFun) isLoadingFun = function () {
        };
        isLoadingFun(true);

        this.formValidate.deviceList = [];
        this.roomDeviceId.map(deviceId => {
          this.formValidate.deviceList.push({
            deviceId,
            inRoom: 1
          });
        });

        this.otherDeviceId.map(deviceId => {
          this.formValidate.deviceList.push({
            deviceId,
            inRoom: 0
          });
        });

        this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
        this.ajax(this.addMessTitle, isLoadingFun);
        // console.log(this.addMessTitle.ajaxParams.data)
        // isLoadingFun();
      },

      //当设置的时间为全天候的时候调用此函数设置时间       timeModel ALL
      setOpenTimeList () {
        let tempArr = [];
        let allDayTimeSlot = this.$util._.defaultsDeep([], this.allDayTimeSlot);
        if (!this.allDayTimeSlot.length) {
          return tempArr;
        } else if (this.allDayTimeSlot.length) {
          let item;
          let timeSlot = [];
          allDayTimeSlot.sort((a, b) => a < b).map(i => {
            item = this.timeSlot[i];
            // 只有开始和结束时间都设置了才能设置对应的日期
            item._start && item._end && tempArr.push({
              'reserveSetType': 'ROOM',
              'date': '',
              'startTime': item._start,
              'endTime': item._end
            }); // 选中的时间段
          });
        }
        return tempArr;
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = this.$util._.defaultsDeep({}, data);
        return myData;
      },

      // 检测数据是否合理
      checkData () {
        if (this.formValidate.isOpen === 'YES' && !this.formValidate.openTimeList.length) {
          if (this.formValidate.timeModel === 'SPECIFIC') {
            this.errorMess('开放日期至少要有一天');
          } else {
            this.errorMess('开放时间不能为空');
          }
          return false;
        }
        return true;
      },
      /*********************************************************** 周历 ***********************************************/
      goPrev () {
        this.$refs['newCalendar'].goPrev();
      },
      goNext () {
        this.$refs['newCalendar'].goPrev();
      },
      changeMonth (start, end, current, foramatData) {
        this.monthTitle = foramatData(current, 'MMMM YYYY');
        this.currMonth = this.conductDate(current, 'yyyy-MM');
      },
      /**
       * 日期格式化内容被点击时触发
       * @param event      {}  当前被点击内容对象
       * @param jsEvent    {}  被点击的鼠标事件对象
       * @param pos        {}  当前位置对象
       */
      eventClick (event, jsEvent, pos) {
        this.dayClick(event.start, jsEvent);
      },
      /**
       * @param day
       * @param jsEvent
       */
      dayClick (day, jsEvent) {
        let date = (this.conductDate(day, 'yyyy-MM-dd')).toString();
        let allDayTimeSlot = this.$util._.defaultsDeep([], this.allDayTimeSlot);
        if (this.openTimeList[date] && !this.allDayTimeSlot.length) {
          delete this.openTimeList[date]; // 如果当前日期没有选择时间段则删除此日期
        } else if (this.allDayTimeSlot.length) {
          let item;
          let timeSlot = [];
          allDayTimeSlot.sort((a, b) => a < b).map(i => {
            item = this.timeSlot[i];
            // 只有开始和结束时间都设置了才能设置对应的日期
            item._start && item._end && timeSlot.push(item._time); // 选中的时间段
          });
          this.openTimeList[date] = {
            date,
            timeSlot
          };
        }
        this.setAllDayTimeSlot();
      },
      // 设置日期对应的时间段
      setAllDayTimeSlot () {
        let data = this.openTimeList;
        let showData = [];
        this.$util._.map(data, (item, key) => {
          if (item.timeSlot.length) {
            item.timeSlot.map(tItem => {
              showData.push({
                title: tItem,
                start: item.date,
                end: item.date
              });
            });
          } else {
            delete data[key];
          }
        });
        calendarSet.setCalData(showData);
      },
      /**
       * @param day
       * @param events
       * @param jsEvent
       */
      moreClick (day, events, jsEvent) {
        //console.log('moreCLick', day, events, jsEvent)
      },

      // 添加时间段
      addTimeSlot () {
        this.timeSlot.push( // 开放时间段
          {
            start: '',
            end: '',
            time: ''
          });
      },

      // 房间查看
      showRoomInfo (id) {
        this.todoId = id;
        this.openModel('show');
      },

      // 选择设备
      selectDevice (type) {
        this.selectDeviceUrl = api[type].path + this.roomIds.join(',');
        this.selectDeviceType = type;
        this.openModel('selectDevice');
      },

      // 选择设备回调
      selectDeviceCall (arr) {
        (arr || []).map(item => {
          if (this.selectDeviceType == 'room') {
//            this.roomDevice[item.id] = item;
//            roomDeviceId:[],
//              otherDeviceId:[],
            if (this.roomDeviceId.indexOf(item.id) == -1) {
              this.roomDeviceId.push(item.id);
              this.roomDevice.push(item);
            }
          } else {
//            this.otherDevice[item.id] = item;
            if (this.otherDeviceId.indexOf(item.id) == -1) {
              this.otherDeviceId.push(item.id);
              this.otherDevice.push(item);
            }
          }
        });
        this.cancel('selectDevice');
      },

      // 删除选择的数据
      handleClose (type, index) {
//        let obj = {};
        if (type == 'room') {
//          obj = this.$util._.defaultsDeep({}, this.roomDevice);
//          delete (obj[id]);
//          this.roomDevice = obj;
          this.roomDevice.splice(index, 1);
          this.roomDeviceId.splice(index, 1);
        } else {
//          obj = this.$util._.defaultsDeep({}, this.otherDevice);
//          delete (obj[id]);
//          this.otherDevice = obj;
          this.otherDevice.splice(index, 1);
          this.otherDeviceId.splice(index, 1);
        }
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      // 模态窗关闭
      cancel (options) {
        this[options + 'Modal'] = false;
      },

      // 获取数据
      getDataForServer () {
        this.ajax({
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: api.get.path + this.roomIds[0],
            method: api.get.method
          }
        });
      },

      // 获取时间段
      getTimeSlotList () {
        this.ajax({
          ajaxSuccess: res => this.timeSlot = res.data || [],
          ajaxParams: {
            url: api.teachCourseTime.path,
            method: api.teachCourseTime.method
          }
        });
      },

      // 初始化数据
      getDataSuccess (res) {
        let fData = this.formValidate;
        let rData = res.data.roomReserveSet;
        let openTimeList = {};
        fData.isOpen = rData.isOpen;
        fData.timeModel = rData.timeModel && rData.timeModel.toUpperCase() || 'ALL';

        // 房间设备
        (res.data.deviceList || []).map(item => {
          if (item.inRoom) {
            this.roomDeviceId.push(item.deviceId);
            this.roomDevice.push(item);
          } else {
            this.otherDeviceId.push(item.deviceId);
            this.otherDevice.push(item);
          }
        });

        // 根据日期设置对应的时间段
        if (rData.timeModel == 'ALL') {
          let timeSlot = [];
          let index = [];
          rData.openTimeList.map((item, i) => {
            timeSlot.push({
              start: '',
              end: '',
              time: item.startTime + '-' + item.endTime
            });
            index.push(i);
          });
          this.timeSlot = timeSlot;
          if (timeSlot != 0) {
            this.timeSlot = timeSlot;
          } else {
            this.timeSlot = [{
              start: '',
              end: '',
              time: ''
            }];
          }
          this.allDayTimeSlot = index;
        } else {
          rData.openTimeList.map(item => {
            if (!openTimeList[item.date]) {
              openTimeList[item.date] = {
                date: item.date,
                timeSlot: [item.startTime + '-' + item.endTime]
              };
            } else {
              openTimeList[item.date].timeSlot.push(item.startTime + '-' + item.endTime);
            }
          });
          this.timeSlot = [{
            start: '',
            end: '',
            time: ''
          }];
        }

        this.openTimeList = openTimeList;
        this.setAllDayTimeSlot();
      }
    },
    components: {
      fullCalendar,
      roomView,
      selectDevice,
      timeQuantum
    },
    created () {
      this.init();
    }
  };

</script>

<style lang="scss">
  /* 房间预约管理 - 设置 */

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

  .brsdItem {
    margin-bottom: 10px;
    margin-right: 10px;
  }

  .brsdSelBtn {
    cursor: pointer;
  }

  .roomTimeSlot {
    margin-bottom: 10px;
  }

  .roomTimeSlotAddBtn {
    margin-left: 10px;
  }

</style>
