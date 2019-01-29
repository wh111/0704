<!----------------------------------
****--@name     安排
****--@role     ${*}
****--@date     2018/1/19
****--@author   gx
----------------------------------->
<template>
  <div class="workforceManagement">
    <full-calendar v-show="isShow" v-if="changMonth" ref="calendar" class="test-fc" :tpl="calendarSet.tpl"
                   :itemLimit="calendarSet.itemLimit"
                   :events="calendarSet.fcEvents"
                   first-day='1' locale="zh-cn"
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
        isShow: false,
        calendarSet,
        //当前点击行数据
        row: {
          key: '',
          row: '',
          top: 1000,
          left: -1000,
          isSelect: false,
        },
        changMonth: true,
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
        children: [],
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.ajax(this.listMessTitle);
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
        let data = res.data;
        this.isShow = true;
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
            "userId": operailityData.userId,
            "podId": operailityData.podId,
            "roasterDate": date,
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

      cancel() {
        this.$emit('cancel', 'arrange')
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
    /*.event-item{*/
    /*background:rgba(255,255,255,0.4)*/
    /*}*/
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
