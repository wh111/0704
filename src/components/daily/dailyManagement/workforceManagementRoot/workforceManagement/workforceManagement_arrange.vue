<!----------------------------------
****--@name     安排
****--@role     ${*}
****--@date     2018/1/19
****--@author   gx
----------------------------------->
<template>
  <div @click="selectHide" class="workforceManagement" style="position:relative;  ">
    <full-calendar v-show="isShow" v-if="changMonth" ref="calendar" class="test-fc" :tpl="calendarSet.tpl"
                   :itemLimit="calendarSet.itemLimit"
                   :events="calendarSet.fcEvents"
                   first-day='1' locale="zh-cn"
                   @eventClick="eventClick"
                   @dayClick="selectHide"
                   @changeMonth="changeMonth"
                   @goPrev="goPrev"
                   @goNext="goNext">
      <template slot="fc-header-center" scope="p">
        <span style="font-size: 16px;color:#4DB0FA">{{monthTitle}}</span>
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
    <div id="prop-up-div" class="daily el-select-dropdown " :style="{top:row.top,left:row.left}" v-show="row.isSelect"
         style="position:absolute;  transform-origin: center top 0px; z-index: 2019;"
         x-placement="bottom-start">
      <div class="el-scrollbar">
        <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -17px; margin-right: -12px;">
          <ul class="el-scrollbar__view el-select-dropdown__list" ref="codeOptions">
            <li v-for="(item,index) in codeOptions" class="el-select-dropdown__item" @click="valuationCell(item.value)">
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
        <div class="el-scrollbar__bar is-horizontal">
          <div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
        </div>
        <div class="el-scrollbar__bar is-vertical">
          <div class="el-scrollbar__thumb" style="transform: translateY(0%);"></div>
        </div>
      </div>
    </div>

    <el-row>
      <el-col :span="9" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import fullCalendar from 'vue-ambuf-fullcalendar';
  //引入日历相关的配置
  import calendarSet from './calendarSet.js';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'url'],
    data() {
      return {
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        currentMonth: '',
        calendarSet,
        isShow: false,
        changMonth: true,
        //当前点击行数据
        row: {
          key: '',
          row: '',
          top: 1000,
          left: -1000,
          isSelect: false,
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'arrange',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: this.url.roasterAdd.path,
            method: 'post',
            jsonString: true,
          }
        },
        tableData: [],
        monthTitle: '',
        //当前组件默认请求(get)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.url.queryRoaster.path,
            params: {
              beginTime: this.operailityData.beginTime,
              endTime: this.operailityData.endTime,
              userId: this.operailityData.userId,
            }
          }
        },
        codeOptions: [],
        //根据父CODE获取父项，以及子项。(通用)
        getByCodeMessTitle: {  //ROTARY_DEPT_TYPE
          ajaxSuccess: 'getByCodeSuccess',
          ajaxParams: {
            url: this.url.getByCode.path + 'ROTARY_DEPT_TYPE',
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.ajax(this.listMessTitle);
        this.ajax(this.getByCodeMessTitle);
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        if (!isLoadingFun) isLoadingFun = function () {

        };

        if (this.tableData == 0) {
          this.cancel();
          return;
        }
        let formValidate = this.$util._.defaultsDeep([], this.tableData);
        for (let i = 0; i < formValidate.length; i++) {
          let item = formValidate[i];
          if (!item.roasterType) {
            formValidate.splice(i, 1);
            i--;
          }
        }
        isLoadingFun(true);
        this.addMessTitle.ajaxParams.data = formValidate;
        this.ajax(this.addMessTitle, isLoadingFun)
      },

      //根据父CODE获取父项，以及子项。(通用)
      getByCodeSuccess(res) {
        let data = res.data;
        if (!data) return;
        data = data.child;
        this.codeOptions = data;
      },
      //获取get成功
      updateListData(res) {
        this.isShow = true;
        let data = res.data;
        if (!data) {
          calendarSet.setCalData([]);
          return;
        }
        let beginTime = this.parseTimestamp(this.operailityData.beginTime);
        let endTime = this.parseTimestamp(this.operailityData.endTime);
        let dateArr = []; // 时间数组，给日历用
        let temObj = {};//时间为索引的对象
        let time = (endTime - beginTime) / (60 * 60 * 24 * 1000) + 1; //时间次数
        let operailityData = this.operailityData;
        for (let i = 0; i < time; i++) {
          //          let css = this.converter(item.type);
          let date = this.conductDate(beginTime + (60 * 60 * 24 * 1000) * (i), 'yyyy-MM-dd');
          let dateObj = {
            title: '',
            'userId': operailityData.userId,
            'podId': operailityData.podId,
            'roasterDate': date,
            roasterType: '',
            start: date,
            end: date,
            cssClass: ['label'],
          };
          dateArr.push(dateObj);
          temObj[date] = dateObj;

        }
        data.map(item => {
          let day = temObj[item.roasterDate]
          if (day) {
            day.roasterType = item.roasterType;
            day.title = item.roasterType;
            day.id = item.id;
          }
        })

        this.tableData = dateArr;
        calendarSet.setCalData(dateArr);
        this.changMonth = false;
        this.addColor()
      },

      //添加颜色
      addColor() {
        this.$nextTick(() => {
          this.changMonth = true;
          this.$nextTick(() => {
            this.$refs.calendar.emitChangeMonth(this.currentMonth);
            this.$nextTick(() => {
              let lableArr = this.$refs.calendar.$children;
              lableArr.map((item, index) => {
                if (index > 0) {
                  item.$el.parentElement.style.backgroundColor = 'inherit';
                }

              })
            })
          })
        })
      },

      goPrev() {
        this.$refs.calendar.goPrev();
        this.currentMonth = this.$refs.calendar.currentMonth;
        this.changMonth = false;
        this.addColor()
      },
      goNext() {
        this.$refs.calendar.goNext();
        this.currentMonth = this.$refs.calendar.currentMonth;
        this.changMonth = false;
        this.addColor()
      },

      changeMonth(start, end, current, foramatData) {
        this.monthTitle = foramatData(current, 'YYYY年MM月');
      },

      /**
       *
       * @param day
       * @param jsEvent
       */

      eventClick(day, jsEvent) {
        //判断当前选择的时间是否在设定的时间范围内
        this.row.row = day;
        this.cell(jsEvent)
      },

      /**
       *
       * @param day
       * @param events
       * @param jsEvent
       */
      moreClick(day, events, jsEvent) {
        //console.log('moreCLick', day, events, jsEvent)
      },

      cancel() {
        this.$emit('cancel', 'arrange')
      },

      /*
       * 单元格点击事件
       * @params   row   obj   当前点击行数据
       * @params   column   obj   列数据
       * @params   cell   obj   当前单元格dom对象
       *
       * */
      cell(event) {
        let codeOptions = this.$refs.codeOptions
        let target = event.target.parentElement.parentElement;
        if (target.offsetTop > 490 || target.offsetTop == 490) {
          this.row.top = target.offsetTop - (codeOptions.offsetHeight / 2 || 114) + target.offsetHeight / 2 + 'px';
        } else {
          this.row.top = target.offsetTop + target.offsetHeight + 10 + 'px';
        }
        if (target.offsetLeft > 780 || target.offsetLeft == 780) {
          this.row.left = target.offsetLeft - target.offsetWidth / 3 + 'px';
        } else {
          this.row.left = target.offsetLeft + target.offsetWidth + 'px';
        }

        this.row.isSelect = true;
        return false;
      },

      /*
       * 为单元格赋值，并隐藏
       *
       * */
      valuationCell(value) {
        let row = this.row.row;
        row.roasterType = value;
        row.title = value;
        this.row.isSelect = false;
      },

      //      点击非单元格是列表隐藏
      selectHide() {
        this.row.isSelect = false;
      },
    },
    created() {
      this.init();
    },
    mounted() {
      this.currentMonth = this.$refs.calendar.currentMonth;
      this.currentMonth._d = this.parseDate(this.operailityData.beginTime, 'yyyy-MM-dd');
      this.$refs.calendar.emitChangeMonth(this.currentMonth);
    },
    components: {
      fullCalendar,
    }
  }
</script>
<style lang="scss">
  .workforceManagement {
    height: 100%;
    overflow: auto;
  }

  .workforceManagement .handle {
    width: 650px;
    margin: 20px auto 0;
    font-size: 16px;
  }

  .workforceManagement .middle {
    width: 600px;
    margin: 0 auto;
  }

  .myAttendance .comp-full-calendar {
    max-width: 95%;
    padding: 10px 0;
  }

  .workforceManagement .full-calendar-body .dates .dates-events .events-week .events-day {
    min-height: 99px;
    position: relative;
  }

  .workforceManagement .full-calendar-body .dates .dates-events .events-week .events-day .event-box {
    overflow: hidden;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 99px;
  }

  .workforceManagement .full-calendar-body .dates .dates-events .events-week .events-day .event-box {
    background: rgba(153, 153, 153, 0.7);
  }

  .workforceManagement .full-calendar-body .dates .dates-events .events-week .events-day .event-box {
    .event-item {
      background: rgba(255, 255, 255, 0.4)
    }
    .label {
      height: 99px;
      line-height: 99px;
      text-align: center;
    }
    .cq {
      background: rgba(26, 158, 216, 0.7);
    }
    .bj {
      background: rgba(255, 255, 0, 0.7);
    }
    .hj {
      background: rgba(253, 36, 255, 0.7);
    }
    .qt {
      background: rgba(4, 253, 2, 0.7);
    }
    .kg {
      background: rgba(250, 54, 0, 0.7);
    }

    .event-item.is-end {
      margin-right: 0;
    }
    .event-item.is-start {
      margin-left: 0;
    }
  }

  .workforceManagement {
    .mark {
      width: 50px;
      height: 40px;
    }
    .cq {
      background: rgba(26, 158, 216, 0.7);
    }
    .bj {
      background: rgba(255, 255, 0, 0.7);
    }
    .hj {
      background: rgba(253, 36, 255, 0.7);
    }
    .qt {
      background: rgba(4, 253, 2, 0.7);
    }
    .kg {
      background: rgba(250, 54, 0, 0.7);
    }
    .events-week {
      margin-top: 0px !important;
      height: 99px;

    }
  }
</style>
