<template>
  <!-- 房间预约管理 - 查看 -->
  <div>
    <el-form>

      <el-row>
        <el-col :span="24">
          <el-form-item label="房间号：">
              <el-tooltip v-if="hoverRoomId===opData.roomId" effect="light" placement="left" :open-delay="600">
                <template slot="content">
                  <room-view style="width: 500px;" isShowLoading="true" :id="opData.roomId" :that="self"></room-view>
                </template>
                <span style="cursor: pointer;">{{ opData.roomNum }}</span>
              </el-tooltip>
              <span style="cursor: pointer;" v-else @mouseleave="roomMouseleave()" @mouseenter="roomMouseenter()">{{ opData.roomNum }}</span>
            <!--<el-button type="text" @click="showRoomInfo(opData.roomId)">{{ opData.roomNum }}</el-button>-->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否开放预约：">{{ formValidate.isOpen | typeText }}</el-form-item>
        </el-col>
        <template v-if="formValidate.isOpen === 'YES'">
          <el-col :span="12">
            <el-form-item label="开放日期：">{{ formValidate.timeModel | typeText }}
            </el-form-item>
          </el-col>

          <el-col v-if="formValidate.timeModel === 'ALL'">
            <el-form-item label="开放时间：">
              {{ time }}
            </el-form-item>
          </el-col>

          <div style="clear:both;" class="newCalendar" v-if="formValidate.timeModel === 'SPECIFIC'">
            <full-calendar class="test-fc" ref="newCalendar" :tpl="calendarSet.tpl" :itemLimit="calendarSet.itemLimit"
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
              <template v-if="roomDevice.length">
                <el-tag class="brsdItem" :key="item.id" v-for="(item,index) in roomDevice">
                  {{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}
                </el-tag>
              </template>
              <span v-else>暂无设备</span>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="设备库：">
              <template v-if="otherDevice.length">
                <el-tag class="brsdItem" :key="item.id" v-for="(item,index) in otherDevice">
                  {{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}
                </el-tag>
              </template>
              <span v-else>暂无设备</span>
            </el-form-item>
          </el-col>
        </template>

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
  </div>
</template>

<script>
  import api from './api';

  import roomView from '../../room/roomManage/roomManage_view'; // 房间查看
  import fullCalendar from 'vue-ambuf-fullcalendar'; // 周历
  //引入日历相关的配置
  import calendarSet from './calendarSet';

  export default {
    props: ['opData'],
    data() {
      return {
        self: this,
        oneModTimeSlot: [],
        todoId: '', // 查看房间id
        hoverRoomId: '',
        roomIds: [],

        //form表单bind数据
        formValidate: {
          roomIds: '', // 房间 多个id以逗号分隔 ---> 1,2
          isOpen: 'YES', // 是否开放预约
          timeModel: 'SPECIFIC', // 选择开放日期
          openTimeList: [ // 开放时间列表
            // {
            //   "reserveSetType": "ROOM", // 预约设置类型
            //   "date": "2017-01-02", // 日期
            //   "timeSetIds": "1,2,3" // 时间段id字符串
            // },
          ]
        },
        time:'',
        roomDeviceId: [],
        otherDeviceId: [],
        roomDevice: [], // 房间内的设备
        otherDevice: [], // 房间外的设备

        oneRoomTimeSlot: [], // 单个房间时间段
        openTimeList: {}, // 开放日期
        allDayTimeSlot: [], // 全天开放时间段(只记录索引)
        timeSlot: [], // 时间段
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
        monthTitle: "",
        //是否显示全日历
        isShowCalendar: false,
        operailityData: {},
      }
    },
    methods: {
      // 初始化
      init() {
        this.roomIds[0] = this.opData.roomId;
        this.formValidate.roomIds = this.opData.roomId;
        calendarSet.setCalData([]);
//        this.getTimeSlotList()
        this.getDataForServer();
      },
      // 房间划入事件
      roomMouseenter () {
        this.hoverRoomId = this.opData.roomId;
      },
      // 房间滑出事件
      roomMouseleave () {
        this.hoverRoomId = '';
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
        return
        this.dayClick(event.start, jsEvent)
      },
      /**
       * @param day
       * @param jsEvent
       */
      dayClick(day, jsEvent) {
        return
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

      // 获取时间段
      getTimeSlotList() {
        this.ajax({
          ajaxSuccess: res => {
            this.timeSlot = res.data || [];

            this.getDataForServer();
          },
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
        let timeSlotId = {};
        let openTimeList = {};
        fData.isOpen = rData.isOpen;
        fData.timeModel = rData.timeModel;

        // 房间设备
        (res.data.deviceList || []).map(item => {
          if (item.inRoom) {
            this.roomDeviceId.push(item.deviceId)
            this.roomDevice.push(item)
          } else {
            this.otherDeviceId.push(item.deviceId);
            this.otherDevice.push(item)
          }
        });

        // 时间段数组转换为对象存储
        this.timeSlot.map(item => timeSlotId[item.timeId] = item);
        // 根据日期设置对应的时间段
        if(rData.timeModel==='ALL'){
          let time = [];
          rData.openTimeList.map(item=>{
            time.push( item.startTime + '-' + item.endTime);
          })
          this.time = time.join(',');

        }else {
          rData.openTimeList.map(item => {
            if (!openTimeList[item.date]) {
              openTimeList[item.date] = {
                date: item.date,
                timeSlot: [item.startTime + '-' + item.endTime]
              };
            } else {
              openTimeList[item.date].timeSlot.push(item.startTime + '-' + item.endTime)
            }
          })
        }

        this.openTimeList = openTimeList;
        this.setAllDayTimeSlot()
      },
    },
    components: {
      fullCalendar,
      roomView
    },
    created() {
      this.init()
    }
  }

</script>

<style>
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

</style>
