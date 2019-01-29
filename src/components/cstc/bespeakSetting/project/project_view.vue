<template>
  <!-- 预约项目管理 - 增加 -->
  <div>
    <el-form label-width="130px">
      <el-row>
        <el-col>
          <el-form-item label="项目名称：">
            {{ showData.name }}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="所在房间：">
            <!--<el-button style="margin-bottom: 10px" v-for="(item,index) in roomList" :key="item.id"-->
                       <!--@click="showRoomInfo(item.id)">-->
              <!--{{ item.roomNum }}（承载量：{{ item.bearingCapacity }}）-->
            <!--</el-button>-->
            <template v-for="item in roomList">
              <el-tooltip :key="item.id" v-if="hoverRoomId===item.id" effect="light" placement="left" :open-delay="600">
                <template slot="content">
                  <room-view style="width: 500px;" isShowLoading="true" :id="item.id" :that="self"></room-view>
                </template>
                <span style="cursor: pointer;">{{ item.roomNum }}（承载量：{{ item.bearingCapacity }}）</span>
              </el-tooltip>
              <span style="cursor: pointer;" :key="item.id" v-else @mouseleave="roomMouseleave()" @mouseenter="roomMouseenter(item)">{{ item.roomNum }}（承载量：{{ item.bearingCapacity }}）</span>
            </template>
          </el-form-item>
        </el-col>

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

        <el-col>
          <el-form-item label="预约简介：">
            {{ showData.summary || '暂无简介' }}
          </el-form-item>
        </el-col>

        <template>
          <el-col :span="12">
            <el-form-item label="开放日期：">
              {{ showData.timeModel | typeText }}
            </el-form-item>
          </el-col>

          <el-col v-if="showData.timeModel === 'ALL'">
            <el-form-item label="开放时间：">
              {{ time }}
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="预约对象：">
              {{ showData.userType | showUserType }}
              <div v-if="showData.userType === 'SPECIFIC'" class="bpUserList">
                <el-tag type="success" v-for="item in showData.userList" :key="item.id">{{ item.name }}</el-tag>
              </div>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="预约人数：">
              {{ showData.applicantsNum || '0' }}
            </el-form-item>
          </el-col>

          <div style="clear:both;" class="newCalendar" v-if="showData.timeModel === 'SPECIFIC'">
            <full-calendar class="test-fc" ref="newCalendar" :tpl="calendarSet.tpl" :itemLimit="calendarSet.itemLimit" :events="calendarSet.fcEvents" first-day='1'
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
        </template>
      </el-row>

    </el-form>

    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" class-name="vertical-center-modal" :loading="true" :width="800">
      <modal-header slot="header" :parent="self" :content="contentHeader.showId"></modal-header>
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
        todoId: '', // 查看房间id
        hoverRoomId: '',

        roomList: [], // 已选房间
        showData: {},
        time:'',

        contentHeader: {
          showId: {
            id: "showId",
            title: "查看房间"
          },
        },

        roomDeviceId: [],
        otherDeviceId: [],
        roomDevice: [], // 房间内的设备
        otherDevice: [], // 房间外的设备

        oneModTimeSlot: [],
        openTimeList: {}, // 开放日期
        allDayTimeSlot: [], // 全天开放时间段(只记录索引)
        timeSlot: [], // 时间段

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
        this.getDataForServer()
//        this.getTimeSlotList();
      },
      // 房间划入事件
      roomMouseenter (item) {
        this.hoverRoomId = item.id;
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

      },
      /**
       * @param day
       * @param jsEvent
       */
      dayClick(day, jsEvent) {

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
        this.openModel('show');
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
            url: api.get.path + this.opData.id,
            method: api.get.method
          }
        })
      },

      // 初始化数据
      getDataSuccess(res) {
        let rData = res.data;
        let openTimeList = {};
        this.showData = res.data;

        // 房间数据
        rData.roomList.map(item => {
          this.roomList.push({
            id: item.roomId,
            roomNum: item.roomNum,
            bearingCapacity: item.bearingCapacity
          })
        })

        // 设备数据
        rData.deviceList.map(item => {
          if (item.inRoom) {
            this.roomDevice.push(item)
          } else {
            this.otherDevice.push(item)
          }
        });

        // 日期时间处理

        if(rData.timeModel=='SPECIFIC'){
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
        }else {
          let time = [];
          rData.openTimeList.map(item=>{
            time.push( item.startTime + '-' + item.endTime);
          })
          this.time = time.join(',');
        }


        this.openTimeList = openTimeList;
        this.setAllDayTimeSlot()
      },
    },
    components: {
      fullCalendar,
      roomView,
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

  .bpUserList {
    .el-tag {
      margin-right: 10px;
    }
  }

</style>
