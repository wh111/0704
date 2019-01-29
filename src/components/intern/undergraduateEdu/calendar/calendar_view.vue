<!----------------------------------
****--查看周历(calendar_add)
****--@date     2014-04-12
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>

    <div class="newCalendar calendareManagement" v-if="stepMaker=='third'">
      <el-row :gutter="10">
        <el-col :span="3">
          <div class="cal-schoolTit" style="text-align: right;">周历名称:</div>
        </el-col>
        <el-col :span="5">
          <div class="cal-schoolTit"> {{formValidate.weekSetName}}</div>
        </el-col>
        <el-col v-if="whereFrom!=='audit'" :span="13" align="right">
          <el-button @click="progressMonitoring">进度监控</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3">
          <div class="cal-schoolTit" style="text-align: right;">学校名称：</div>
        </el-col>
        <el-col :span="5">
          <div class="cal-schoolTit">{{formValidate.schoolName}}</div>
        </el-col>
        <el-col :span="3">
          <div class="cal-schoolTit" style="text-align: right;">课程大纲:</div>
        </el-col>
        <el-col :span="10">
          <div class="cal-schoolTit"> {{ formValidate.outlineNames}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="20" v-if="formValidate.weekSetStartTime!=''">
          <div class="cal-schoolTit">
            {{formValidate.weekSetStartTime.split('-')[0]}} ~ {{formValidate.weekSetEndTime.split('-')[0]}}学年，{{formValidate.semester == 'ONE' ? '第一学期' : '第二学期'}}教学周历
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="cal-schoolTit">
            学期起止时间：{{formValidate.weekSetStartTime}} 至 {{formValidate.weekSetEndTime}}
            ，年级：{{formValidate.gradeNum}}
          </div>
        </el-col>
        <el-col :span="24">
          <el-col :span="3">
            <div class="cal-schoolTit" style="text-align: right">
            班级：
            </div>
          </el-col>
          <div class="cal-schoolTit">
            {{formValidate.classNumNames}}
          </div>
        </el-col>
      </el-row>
      <full-calendar ref="calendar" class="test-fc" :tpl="calendarSet.tpl" :itemLimit="calendarSet.itemLimit"
                     :events="calendarSet.fcEvents"
                     first-day='1' locale="zh-cn"
                     @changeMonth="changeMonth"
                     @moreClick="moreClick"
                     @goPrev="goPrev"
                     @goNext="goNext">
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
      <el-row :gutter="10">
        <el-col :span="2">
          <div class="cal-schoolTit">说明：</div>
        </el-col>

        <el-col :span="22">
          <el-input
            readonly
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="formValidate.weekSetInstructions">
          </el-input>
        </el-col>
      </el-row>
      <br/>
      <el-row v-if="whereFrom!=='audit'">
        <el-col :span="8" class="textCenter">&nbsp;</el-col>
        <el-col :span="8" class="textCenter">
          <el-button @click="cancel('next','third')">关闭</el-button>
        </el-col>
        <el-col :span="8" class="textCenter">&nbsp;</el-col>
      </el-row>
    </div>

    <!--进度监控-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="progressMonitoringModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="1000">
      <modal-header slot="header" :content="progressMonitoringId"></modal-header>
      <progressMonitoring :weekSetId="operailityData.weekSetId" v-if="progressMonitoringModal"></progressMonitoring>
      <div slot="footer"></div>
    </Modal>


  </div>
</template>
<style>
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
<script>
  /*当前组件必要引入*/
  import fullCalendar from 'vue-ambuf-fullcalendar';
  import setCurriculum from './setCurriculum.vue';

  //引入日历相关的配置
  import calendarSet from './calendarSet.js';

  import progressMonitoring from './progressMonitoring.vue';
  //引入当前组件字典api
  import api from '../api.js';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'whereFrom'],
    data() {
      return {
        //是否显示全日历
        isShowCalendar: false,
        stepMaker: 'third',
        holidayList: [],//获取的当个月的节假日列表
        /*--按钮button--*/
        progressMonitoringId: {
          id: 'progressMonitoringId',
          title: '进度监控'
        },
        //全日历
        calendarSet,
        //学期
        semesterOptions: [
          {
            key: 'ONE',
            value: '一'
          }, {
            key: 'TWO',
            value: '二'
          }],
        semesterVal: '',
        monthTitle: '',
        progressMonitoringModal: false,
        //周历保存后的id
        weekSetId: this.operailityData.weekSetId,
        //form表单bind数据
        formValidate: {
          schoolIds: '',
          schoolNames: '',
          weekSetStartTime: '',
          weekSetEndTime: '',
          semester: '',
          gradeNum: '',
          classNum: '',
          weekSetInstructions: '',
        },

        //当前月
        currMonth: '',

        //获取时间段设置的课程
        courseTimeData: {},
        getCourseTimeTitle: {
          ajaxSuccess: 'getCourseTimeData',
          ajaxParams: {
            url: api.teachCourseTime.path,
          }
        },

        //获取周历设置主表
        getMainTitle: {
          ajaxSuccess: 'getMainData',
          ajaxParams: {
            url: api.get.path + '/' + this.operailityData.weekSetId,
          }
        },

        //根据教学周历ID获取每个月课程设置
        getMonthCourseSet: {
          ajaxSuccess: 'getMonthCourseData',
          ajaxParams: {
            url: api.monthCourseSet.path,
            method: api.monthCourseSet.method,
            params: {}
          }
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //this.ajax(this.getSchoolsTitle);
//        this.ajax(this.getCourseTimeTitle);
        /*  this.weekSetId = this.operailityData.weekSetId;
             let getMainTitle = Util._.defaultsDeep({},this.getMainTitle);
             getMainTitle.ajaxParams.url+= "/"+val;*/
        this.ajax(this.getMainTitle)
      },

      //根据教学周历ID获取每个月课程设置
      /**获取节假日数据成功后再获取
       * */
      setCourseTime() {
        //获取节假日列表
        let holidayListTitle = {
          ajaxSuccess: (res) => {
            let data = res.data || [];
            this.holidayList = data;
            //根据教学周历ID获取每个月课程设置
            this.getMonthCourseSet.ajaxParams.params = {
              weekSetId: this.weekSetId,
              weekSetTime: this.currMonth,
            }
            this.ajax(this.getMonthCourseSet);
          },
          ajaxParams: {
            url: api.holidayList.path,
            params: {queryDate: this.currMonth + '-01',}
          }
        }
        this.ajax(holidayListTitle);

      },

      //活动时间段获取
      getCourseTimeData(responseData) {
        let data = responseData.data;
        for (var i = 0, item; i < data.length; i++) {
          item = data[i];
          this.courseTimeData[item['timeId']] = item;
        }
      },

      //根据教学周历ID获取每个月课程设置--server回调
      getMonthCourseData(responseData) {
        let data = responseData.data;
        if (!this.valDataType(data, 'Array')) return;
        //if(Util.isEmptyObject(data)) return;
        let myData = [];
        let range = [];
        let holidayList = this.holidayList;//节假日
        let currFormate = ['上', '下', '晚'];
        for (var i = 0, item; i < data.length; i++) {
          item = data[i];
          Util._.forEach(item, (v, k) => {
            if (this.findInHoliday(holidayList, k)) return;
            let contentArr = v;
            for (var i = 0; i < contentArr.length; i++) {
//              let num = this.courseTimeData[contentArr[i]["timeId"]].courseIndex;//(i+1);
              let num = i + 1;//(i+1);
              let tempObj = {
                outlineName: contentArr[i]['outlineName'] || '',
                courseName: contentArr[i]['courseName'] || '',
                depName: contentArr[i]['depName'] || '',
                courseType: contentArr[i]['courseType'] || '',
                teacherNames: contentArr[i]['teacherNames'] ? `教师：${ contentArr[i]['teacherNames'] || ''}` : '',
                courseContent: contentArr[i]['courseContent'] ? `内容：${ contentArr[i]['courseContent'] || ''}` : '',
                courseMethod: contentArr[i]['courseContent'] ? `教学方法：${ contentArr[i]['courseMethod'] || ''}` : '',
                courseTeachingRoomThirdName: contentArr[i]['courseTeachingRoomThirdName'] ? `科室：${ contentArr[i]['courseTeachingRoomThirdName'] || ''}` : '',
              }
              myData.unshift({
//                title: currFormate[contentArr[i]["timeType"]]+num+":"+contentArr[i]["depName"]+"   "+contentArr[i]["timeStr"],
                title: `${num}、${tempObj['outlineName']} ${tempObj['courseName']} ${tempObj['courseContent']} 类型：${ tempObj['courseType'] }  教研室：${ tempObj['depName'] }  ${ tempObj['courseTeachingRoomThirdName'] }   ${tempObj['teacherNames'] } ${tempObj['courseMethod'] }  时间：${contentArr[i]['timeInfoBegin']}-${contentArr[i]['timeInfoEnd']}`,
                start: k,
                end: k,
              })
            }

          })
        }

        this.addWeekEnd(myData, range)
        holidayList.map(item => {
          myData.unshift({
            title: item.text,
            start: item.dateTime,
            end: item.dateTime,
            cssClass: ['label', 'kg'],
          })
        })
        calendarSet.setCalData(myData);
      },

      /**循环周历当前时间的前后45天，并处理数据*/
      getDate(fun) {
        let date = this.parseDate(this.currMonth + '-15', 'yyyy-MM-dd').getTime();
        let firstDate = date - 45 * 86400000
        let lastDate = date + 45 * 86400000
        for (let i = firstDate; i < lastDate; i += 86400000) {
          if (![0, 6].includes(new Date(i).getDay())) continue;
          fun(i);
        }
      },
      /**添加周六日颜色*/
      addWeekEnd(myData, range) {
        let holidayList = this.holidayList
//        range = [].concat(this.holidayList,range)
        this.getDate(date => {
          let weekend = this.conductDate(date, 'yyyy-MM-dd')
          if (this.findInHoliday(holidayList, weekend)) return;
          myData.unshift({
            title: '',
            start: weekend,
            end: weekend,
            cssClass: ['label', 'weekEnd'],
          })
        })
//        return  myData
      },

      /**获取的数据是否和节假日日期冲突，如果冲突，则不要*/
      findInHoliday(holidayList, date) {
        for (let i = 0; i < holidayList.length; i++) {
          let holiday = holidayList[i];
          if (date === holiday.dateTime) {
            return true;
          }
        }
      },

      //获取周历信息成功回调
      getMainData(responseData) {
        this.formValidate = responseData.data;

        let date = this.parseDate(responseData.data.weekSetStartTime, 'yyyy-MM-dd');//
        let weekSetStartTime = date.getTime();//
        let weekSetEndTime = this.parseDate(responseData.data.weekSetEndTime, 'yyyy-MM-dd').getTime();//
        let nowDate = new Date().getTime();
        if (weekSetStartTime < nowDate && weekSetEndTime > nowDate) return;//如果是当前月则不用更改月份
        this.currentMonth = this.$refs.calendar.currentMonth;
        this.currentMonth._d = date;//;
        this.$refs.calendar.emitChangeMonth(this.currentMonth);
      },

      goPrev() {
        this.$refs.calendar.goPrev();
      },
      goNext() {
        this.$refs.calendar.goNext();
      },
      changeMonth(start, end, current, foramatData) {
        this.monthTitle = foramatData(current, 'MMMM YYYY');
        this.currMonth = this.conductDate(current, 'yyyy-MM');
        this.setCourseTime();
      },

      //关闭当前组件
      cancel() {
        this.$emit('cancel', 'show');
      },

      progressMonitoring() {
        this.progressMonitoringModal = true;
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

    },
    created() {
      this.init();
    },
    watch: {
      weekSetId(val) {

      }
    },
    mounted() {

    },
    components: {
      fullCalendar,
      setCurriculum,
      progressMonitoring,
    }
  }
</script>
<style lang="scss">
  .calendareManagement {
    height: 100%;
    overflow: auto;
    .handle {
      width: 650px;
      margin: 20px auto 0;
      font-size: 16px;
    }
    .middle {
      width: 600px;
      margin: 0 auto;
    }

    .myAttendance .comp-full-calendar {
      max-width: 100%;
      padding: 10px 0;
    }
    .full-calendar-body .dates .dates-events .events-week .events-day {
      min-height: 99px;
      position: relative;
      .event-box {
        overflow: hidden;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 99px;
        .label {
          height: 99px;
          line-height: 99px;
          text-align: center;
          width: 100%;
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
        .weekEnd {
          background: rgba(134, 134, 134, 0.2);
        }

        .event-item.is-end {
          margin-right: 0;
        }
        .event-item.is-start {
          margin-left: 0;
        }
      }
    }

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
