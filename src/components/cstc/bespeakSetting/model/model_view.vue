<template>
  <!-- 房间预约管理 - 设置 -->
  <div>
    <el-form>

      <el-row>
        <el-col>
          <el-form-item label="设备：">
            {{ resData.deviceTypeName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备总数：">{{ resData.deviceNum || 0 }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开放预约数量：">{{ resData.openNum || 0}}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="设备简介：">{{ resData.describes || '暂无设备简介'}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否开放预约：">{{ formValidate.isOpen | typeText }}
          </el-form-item>
        </el-col>
        <template v-if="formValidate.isOpen === 'YES'">
          <el-col :span="12">
            <el-form-item label="开放日期：">
              {{ formValidate.timeModel | typeText }}
            </el-form-item>
          </el-col>

          <el-col v-if="formValidate.timeModel === 'SPECIFIC'">
            <el-form-item label="开放时间：">{{ oneModTimeSlot.join('，') }}
            </el-form-item>
          </el-col>

          <div style="clear:both;" class="newCalendar" v-if="formValidate.timeModel === 'SPECIFIC'">
            <full-calendar class="test-fc" :tpl="calendarSet.tpl" :itemLimit="calendarSet.itemLimit" :events="calendarSet.fcEvents" first-day='1'
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
    <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal" :loading="true"
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
  import calendarSet from '../room/calendarSet';

  export default {
    props: ['opData'],
    data() {
      return {
        self: this,
        resData: {
          reserveDeviceSet: {
            deviceNum: '',
            deviceTypeName: '',
            describe: '',
            openNum: ''
          }
        },
        //form表单bind数据
        formValidate: {
          device: {}, // 房间 多个id以逗号分隔 ---> 1,2    
          isOpen: 'NO', // 是否开放预约
          timeModel: 'SPECIFIC', // 选择开放日期
          openNum: '', // 单个预约数量
          openTimeList: [ // 开放时间列表
            // {
            //   "reserveSetType": "ROOM", // 预约设置类型
            //   "date": "2017-01-02", // 日期
            //   "timeSetIds": "1,2,3" // 时间段id字符串
            // },
          ]
        },

        oneModTimeSlot: [],
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
        calendarSet.setCalData([]);
        this.getTimeSlotList()
      },
      /*********************************************************** 周历 ***********************************************/
      goPrev() {
        try {
          this.$children[0].$children[0].$children[7].goPrev()
        } catch (error) {
          this.$children[0].$children[0].$children[8].goPrev()
        }
      },
      goNext() {
        try {
          this.$children[0].$children[0].$children[7].goNext()
        } catch (error) {
          this.$children[0].$children[0].$children[8].goNext()
        }
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
        return;
        this.dayClick(event.start, jsEvent)
      },
      /**
       * @param day
       * @param jsEvent
       */
      dayClick(day, jsEvent) {
        return;
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
          for (var i in allDayTimeSlot) {
            item = this.timeSlot[i];
            tempAllDayTimeSlotObj.id.push(item.timeId); // 选中的时间段id
            tempAllDayTimeSlotObj.title.push(item.courseTime); // 选中的时间段文本描述
          }
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
            this.getDataForServer()
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
            url: api.get.path + this.opData.deviceTypeId,
            method: api.get.method,
            params: {
              deviceTypeId: this.opData.deviceTypeId
            }
          }
        })
      },

      // 初始化数据
      getDataSuccess(res) {
        let fData = this.formValidate;
        let rData = res.data.reserveDeviceSet;
        let timeSlotId = {};
        let openTimeList = {};
        this.resData = rData;
        fData.isOpen = rData.isOpen;
        fData.openNum = rData.openNum;
        fData.timeModel = rData.timeModel;
        fData.device = res.data.device;
        this.oneModTimeSlot.length = 0;
        this.timeSlot.map(item => timeSlotId[item.timeId] = item);
        rData.openTimeList.map(item => {
          if (!openTimeList[item.date]) {
            openTimeList[item.date] = {
              date: item.date,
              timeSetIds: [],
              timeSlot: []
            };
          }
          openTimeList[item.date].timeSetIds.push(item.timeSetId);
          openTimeList[item.date].timeSlot.push(timeSlotId[item.timeSetId].courseTime);
          // 所有日期对应的时间段
          if (this.oneModTimeSlot.indexOf(timeSlotId[item.timeSetId].courseTime) < 0) {
            this.oneModTimeSlot.push(timeSlotId[item.timeSetId].courseTime)
          }
        })
        // 通过时间段处理对应的时间段id
        for (let item in openTimeList) {
          openTimeList[item].timeSetIds = openTimeList[item].timeSetIds.join(',')
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

  .modelSetBox {
    display: inline-block;
    .modelSetItem {
      &~.modelSetItem {
        margin-top: 10px;
      }
    }
  }

</style>
