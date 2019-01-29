<!----------------------------------
****--@name     中心日历
****--@role     ${*}
****--@date     2018/3/24
****--@author   gx
----------------------------------->
<template>
  <div style="height: 100%;overflow: auto;">
    <fullcalendar @setFull="setFullcalendar"></fullcalendar>
    <!--查看弹窗-->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="960">
      <modal-header slot="header" :content="headerContent.showId"></modal-header>
      <show v-if="showModal" @cancel="showModal=false" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api.js'
  import fullcalendar from '../../../components/common/fullcalendar.vue';
  import show from '../affairs/affairs_view' // 编辑

  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        operailityData: '',
        showModal: false,
        headerContent: {
          showId: {
            id: 'show',
            title: '查看事务'
          },
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init () {

      },
      setFullcalendar (jqDom) {
        let self = this;
        jqDom.fullCalendar({
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
          },
          buttonText: {
            today: '今天',
            month: '月',
            week: '周',
            day: '日'
          },
          allDaySlot: false, //是否允许有一整天的课程
          slotMinutes: 15, //时间单位
          contentHeight: 'auto',
          //firstHour: 8,//日程中的起始时间，但是可以滚动到之前的时间。
          minTime: 6, //强制不准选择6点之前的时间，同理最迟时间为maxTime:22
          eventClick (calEvent, jsEvent, view) {
            self.operailityData = calEvent;
            self.showModal = true;
          },
          windowResize: function (view) {
          },
          loading: function (isLoading, view) {

          },
          events: (start, end, timezone, callback) => { //读取数据
            this.ajax(
              {
                ajaxParams: {
                  url: 'affair/calendar/list',
                  params: {
                    startTimeBegin: this.conductDate(start._d, 'yyyy-MM-dd'),
                    startTimeEnd: this.conductDate(end._d, 'yyyy-MM-dd'),
                  }
                },
                ajaxSuccess: res => {
                  let data = res.data;
                  let events = [];
                  let today = this.conductDate(new Date(), 'yyyy-MM-dd')
                  let arr = []  //存储所有的时间对象
                  for (let k in data) { //分离
                    data[k].map((item) => {
                      item.startTime = this.conductDate(item.startTime, 'yyyy-MM-dd HH:mm:ss')
                      item.endTime = this.conductDate(item.endTime, 'yyyy-MM-dd HH:mm:ss')
                    })
                    arr = arr.concat(data[k]);
                  }
                  arr.map(function (item, index) {
                    if (item.id && item.startTime && item.endTime) {
                      item.title = '\n事物名称：' + item.affairName + '\n时间：' + item.startTime + '\n 　　- ' + item.endTime + '\n类型：' + item.affairType + '\n接待对象：' + item.receptionObject + '\n人数：' + item.peopleNum;
                      item.start = item.startTime;
                      item.end = item.startTime;
                      item.color = today === item.courseTime ? 'red' : '#4E86C5',
                        events.push(item);
                    }
                  })
                  callback(events);
                },
              })
          }

        })
      },

    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      fullcalendar, show
    }
  }
</script>
