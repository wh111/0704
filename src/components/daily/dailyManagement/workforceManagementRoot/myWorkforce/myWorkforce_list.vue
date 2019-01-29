<!----------------------------------
****--@name    我的排班表
****--@role     ${*}
****--@date     2018/1/24
****--@author   gx
----------------------------------->
<template>
  <div class="myWorkforce">
    <full-calendar ref="calendar" class="test-fc" :tpl="calendarSet.tpl"
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
  import calendarSet from '../workforceManagement/calendarSet.js';
  import url from '../workforceManagement/api.js'
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      let userInfo = this.$store.getters.getUserInfo;
      return {
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        currentMonth: '',
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
        tableData: [],
        monthTitle: '',
        //当前组件默认请求(get)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: url.queryRoaster.path,
            params: {
              beginTime: '',
              endTime: '',
              userId: userInfo.id,
            }
          }
        },
        codeOptions: [],
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
        if (!data) {
          calendarSet.setCalData([]);
          return;
        }
        let dateArr = []
        data.map(item => {
          dateArr.push(
            {
              title: item.roasterType,
              start: item.roasterDate,
              end: item.roasterDate,
              cssClass: ['label'],
            }
          )
        })

        this.tableData = dateArr;
        calendarSet.setCalData(dateArr);
      },

      goPrev() {
        this.$refs.calendar.goPrev();
      },
      goNext() {
        this.$refs.calendar.goNext();
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
      this.currentMonth._d = new Date();
      this.$refs.calendar.emitChangeMonth(this.currentMonth);
    },
    components: {
      fullCalendar,
    }
  }
</script>
<style lang="scss">
  .myWorkforce {
    height: 100%;
    overflow: auto;
  }

  .myWorkforce .handle {
    width: 650px;
    margin: 20px auto 0;
    font-size: 16px;
  }

  .myWorkforce .middle {
    width: 600px;
    margin: 0 auto;
  }

  .myAttendance .comp-full-calendar {
    max-width: 95%;
    padding: 10px 0;
  }

  .myWorkforce .full-calendar-body .dates .dates-events .events-week .events-day {
    min-height: 99px;
    position: relative;
  }

  .myWorkforce .full-calendar-body .dates .dates-events .events-week .events-day .event-box {
    overflow: hidden;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 99px;
  }

  .myWorkforce .full-calendar-body .dates .dates-events .events-week .events-day .event-box {
    /*.event-item{*/
    /*background:rgba(255,255,255,0.4)*/
    /*}*/
    .label {
      height: 99px;
      line-height: 99px;
      text-align: center;
      background-color: rgba(26, 158, 216, 0.3);
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

  .myWorkforce {
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
