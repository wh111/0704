<template>
  <!-- 房间预约管理 - 设置 -->
  <div>
    <el-form>

      <el-row>
        <el-col>
          <el-form-item label="设备：">
            <div class="modelSetBox">
              <div v-for="(item,index) in formValidate.deviceList" :key="index" class="modelSetItem">
                <el-form :model="item" ref="item" :rules="rules" :inline="true">
                  <el-tooltip class="item" effect="light" placement="bottom-start">
                    <div slot="content" style="max-width:200px;">
                      <p>设备名称：{{ opData[index].deviceTypeName }}</p>
                      <p>设备数量：{{ opData[index].deviceNum || 0 }}</p>
                      <p>设备简介：{{ opData[index].describes || '暂无简介' }}</p>
                    </div>
                    <el-button>{{ item.deviceTypeName }}</el-button>
                  </el-tooltip>
                  <span style="margin-left:10px;">开放预约数量：</span>
                  <el-form-item prop="openNum">
                    <el-input v-model="item.openNum" style="width:200px"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
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

          <el-col v-if="formValidate.timeModel === 'SPECIFIC'">
            <el-form-item label="设置开放时间：">
              <el-checkbox-group v-model="allDayTimeSlot">
                <el-checkbox v-for="(item,index) in timeSlot" :key="item.timeId" :label="index">{{ item.courseTime }}</el-checkbox>
              </el-checkbox-group>
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
        </template>

        <el-col align="center" style="margin-top:10px;">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
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
  import {
    bespeakSetModel as rules
  } from '../../rules';

  import roomView from '../../room/roomManage/roomManage_view'; // 房间查看
  import fullCalendar from 'vue-ambuf-fullcalendar'; // 周历
  //引入日历相关的配置
  import calendarSet from '../room/calendarSet';

  export default {
    props: ['opData'],
    data() {
      return {
        rules,
        self: this,
        todoId: '', // 查看房间id
        // roomIds: [],
        //保存按钮基本信息
        loadBtn: {
          title: '保存设置',
          callParEvent: 'listenSubEvent'
        },
        //form表单bind数据
        formValidate: {
          deviceList: [], // 房间 多个id以逗号分隔 ---> 1,2
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
        this.formValidate.deviceList.length = 0;
        this.opData.map(item => {
          this.formValidate.deviceList.push({
            deviceTypeId: item.deviceTypeId,
            deviceTypeName: item.deviceTypeName,
            openNum: ''
          })
        })
        // this.formValidate.roomIds = this.roomIds.join(',');
        calendarSet.setCalData([]);
        this.getTimeSlotList();
        // 如果设置单个模型
        if (this.opData.length === 1) {
          this.getDataForServer()
        }
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let openTimeList = this.$util._.defaultsDeep({}, this.openTimeList);
        this.$util._.map(openTimeList, item => {
          item.reserveSetType = 'DEVICE';
          delete item.timeSlot;
          this.formValidate.openTimeList.push(item)
        })
        if (!this.checkData()) {
          return
        }
        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true);
        if (this.formValidate.deviceList.length === 1) { // 单个设备
          this.formValidate.openNum = this.formValidate.deviceList[0].openNum
        }
        this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
        this.ajax(this.addMessTitle, isLoadingFun)
        // console.log(this.addMessTitle.ajaxParams.data)
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = this.$util._.defaultsDeep({}, data);
        return myData;
      },
      // 检测数据是否合理
      checkData() {
        for (let list = this.formValidate.deviceList, item, l = list.length, i = 0; i < l; i++) {
          item = list[i];
          if (item.openNum > (this.opData[i].deviceNum || 0)) {
            this.errorMess(`“${this.opData[i].deviceTypeName}”开放预约数量最多只能为 ${(this.opData[i].deviceNum || 0)}`)
            return false
          }
        }
        if (this.formValidate.isOpen === 'YES' && this.formValidate.timeModel === 'SPECIFIC' && !this.formValidate.openTimeList
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

      // 房间查看
      // showRoomInfo(id) {
      //   this.todoId = id;
      //   this.openModel('show')
      // },

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

      // 获取数据
      getDataForServer() {
        this.ajax({
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: api.get.path + this.formValidate.deviceList[0].deviceTypeId,
            method: api.get.method,
            params: {
              deviceTypeId: this.formValidate.deviceList[0].deviceTypeId
            }
          }
        })
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

      // 初始化数据
      getDataSuccess(res) {
        let fData = this.formValidate;
        let rData = res.data.reserveDeviceSet;
        let timeSlotId = {};
        let openTimeList = {};
        fData.isOpen = rData.isOpen;
        fData.timeModel = rData.timeModel;
        fData.deviceList[0].openNum = rData.openNum;
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
          // if (this.oneModTimeSlot.indexOf(timeSlotId[item.timeSetId].courseTime) < 0) {
          //   this.oneModTimeSlot.push(timeSlotId[item.timeSetId].courseTime)
          // }
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
