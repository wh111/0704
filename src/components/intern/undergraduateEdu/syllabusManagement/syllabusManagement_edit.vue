<!----------------------------------
****--课程表管理-修改(syllabusManagement_edit)
****--@date     2017/6/17
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>

    <div class="newCalendar syllabusManagement" v-if="stepMaker=='third'">
      <el-row :gutter="10">
        <el-col :span="3">
          <div class="cal-schoolTit" style="text-align: right;">周历名称:</div>
        </el-col>
        <el-col :span="5">
          <div class="cal-schoolTit"> {{formValidate.weekSetName}}</div>
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
        <el-col :span="10" v-if="formValidate.weekSetStartTime!=''">
          <div class="cal-schoolTit">
            {{formValidate.weekSetStartTime.split('-')[0]}} ~ {{formValidate.weekSetEndTime.split('-')[0]}}学年，{{formValidate.semester == 'ONE' ? '第一学期' : '第二学期'}}教学周历
          </div>
        </el-col>
        <el-col :span="8" :offset="2" v-if="showData.depName">
          <div class="cal-schoolTit">
            教研室 ： {{showData.depName}}
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3">
          <div class="cal-schoolTit" style="text-align: right;">学期起止时间：</div>
        </el-col>
        <el-col :span="21">
          <div class="cal-schoolTit">
            {{formValidate.weekSetStartTime}} 至 {{formValidate.weekSetEndTime}}
            ，年级：{{formValidate.gradeNum}}
          </div>
        </el-col>
        <!-- <el-col :span="8" :offset="2" >
           <div class="cal-schoolTit">
             需安排课程数量：  {{ courseStatic.noSave}} &nbsp;  &nbsp;已安排数量：{{courseStatic.noSubmit}}
           </div>
         </el-col>-->
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3">
          <div class="cal-schoolTit" style="text-align: right;">班级:</div>
        </el-col>
        <el-col :span="21">
          <div class="cal-schoolTit">
            {{formValidate.classNumNames}}
          </div>
        </el-col>
      </el-row>
      <courseList ref="courseList"></courseList>
      <el-tabs v-model="activeName" v-if="whereFrom==='jysAudit'">
        <el-tab-pane label="日历" name="calendar"></el-tab-pane>
        <el-tab-pane label="列表" name="list"></el-tab-pane>
      </el-tabs>
      <audit-list :editOperailityData="editOperailityData" v-show="activeName==='list'" type="jyc"></audit-list>
      <full-calendar v-show="activeName=='calendar'" ref="calendar" class="test-fc" :tpl="calendarSet.tpl"
                     :itemLimit="calendarSet.itemLimit"
                     :events="calendarSet.fcEvents"
                     first-day='1' locale="zh-cn"
                     @changeMonth="changeMonth"
                     @eventClick="eventClick"
                     @dayClick="dayClick"
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
      <!--审核历史列表-->
      <el-table
        v-if="reviewMessList!=0"
        align="center"
        :max-height="200"
        :data="reviewMessList"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%;height: 100%">
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="80">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createUserName"
          label="审核人"
          width="200">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="审核时间"
          width="120">
          <template scope="scope">
            {{scope.row.createTime | formatDate('yyyy-MM-dd')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="reviewMess"
          label="审核意见"
          align="center">
        </el-table-column>
        <el-table-column
          prop="spState"
          width="120"
          label="审核状态">
          <template scope="scope">
            {{ scope.row.spState | typeText}}
          </template>
        </el-table-column>
      </el-table>
      <br/>
      <el-row v-if="whereFrom!=='jysAudit'">
        <el-col :span="8" class="textCenter">&nbsp;</el-col>
        <el-col :span="8" class="textCenter">
          <el-button @click="cancelMyWin">关闭</el-button>
        </el-col>
        <el-col :span="8" class="textCenter">&nbsp;</el-col>
      </el-row>

    </div>
    <Modal

      :mask-closable="false"
      v-model="addModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="1100">
      <modal-header slot="header" :content="addId"></modal-header>
      <set-curriculum v-if="addModal" @cancel="cancel" @add="subCallback"
                      :outlineId="editOperailityData.outlineId" :operailityData="operailityData"
                      :editOperailityData="editOperailityData"></set-curriculum>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<!--<style>
  .newCalendar .comp-full-calendar{
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
</style>-->
<script>
  /*当前组件必要引入*/
  import fullCalendar from 'vue-ambuf-fullcalendar';
  import setCurriculum from './setCurriculum.vue';
  import auditList from '../staffRoomFineTuningReview/staffRoomFineTuningReview_audtiList.vue'
  //引入日历相关的配置
  import calendarSet from '../calendar/calendarSet.js';

  import courseList from './courseList.vue'
  //引入当前组件字典api
  import api from '../api.js';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['editOperailityData', 'whereFrom'],
    data() {
      return {
        //是否显示全日历
        activeName: 'calendar',
        isShowCalendar: false,
        stepMaker: 'third',
        holidayList: [],//获取的当个月的节假日列表
        reviewMessList: [],//获取的审核意见

        //全日历
        calendarSet,
        showData: {depName: '', count: ''},

        courseStatic: {},
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

        /*--按钮button--*/
        addId: {
          id: 'add',
          title: '添加'
        },

        //周历保存后的id
        weekSetId: '',
        //form表单bind数据
        formValidate: {
          schoolIds: '',
          schoolNames: '',
          weekSetStartTime: '2017-01-02',
          weekSetEndTime: '2017-01-05',
          semester: '',
          gradeNum: '',
          classNum: '',
          weekSetInstructions: '',
        },

        //当前月
        currMonth: '',

        //获取周历设置主表
        getMainTitle: {
          ajaxSuccess: 'getMainData',
          ajaxParams: {
            url: api.get.path,
          }
        },

        //获取时间段设置的课程
        courseTimeData: {},
        getCourseTimeTitle: {
          ajaxSuccess: 'getCourseTimeData',
          ajaxParams: {
            url: api.teachCourseTime.path,
          }
        },

        //根据教学周历ID获取每个月课程设置
        getMonthCourseSet: {
          ajaxSuccess: 'getMonthCourseData',
          ajaxParams: {
            url: this.whereFrom === 'jysAudit' ? api.getCourseSet.path : (api.monthCourseSetResearchRoomList.path + '/' + this.editOperailityData.weekSetId),
            method: api.monthCourseSetResearchRoomList.method,
          }
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        calendarSet.setCalData([]);
//        this.ajax(this.getCourseTimeTitle);
        this.weekSetId = this.editOperailityData.weekSetId;
        this.getAuditMsg()//获取审核意见
      },

      //获取审核意见
      getAuditMsg() {
        let holidayListTitle = {
          ajaxSuccess: (res) => {
            console.log(res);
            let data = res.data;
            this.reviewMessList = data || [];
          },
          ajaxParams: {
            url: api.getReviewMess.path,
            params: {stateId: this.editOperailityData.stateId}
          }
        }
        this.ajax(holidayListTitle);
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
              type: 'two',
              outlineId: this.editOperailityData.outlineId,
              depId: this.editOperailityData.courseTeachingResearchRoom
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
        let data = responseData.data && responseData.data.courseData;
        this.courseStatic = responseData.data && responseData.data.courseStatic;
        if (!this.valDataType(data, 'Array')) return;
        let myData = [];
        let range = [];
        let holidayList = this.holidayList;//节假日
        let currFormate = ['上', '下', '晚'];
        let depName = this.showData.depName;
//        let count = 0;
        for (var i = 0, item; i < data.length; i++) {
          item = data[i];
          Util._.forEach(item, (v, k) => {
            if (this.findInHoliday(holidayList, k)) return;
            let contentArr = v;
            for (var i = 0; i < contentArr.length; i++) {
//              let num = this.courseTimeData[contentArr[i]["timeId"]].courseIndex;//(i+1);
              let num = i + 1;//(i+1);
              depName = depName || contentArr[i].depName;//获取教研室
//              if (!contentArr[i].courseTeachingResearchRoomThird) count++;//记录没有安排课程
              let tempObj = {
                outlineName: contentArr[i]['outlineName'] || '',
                courseName: contentArr[i]['courseName'] || '',
                depName: contentArr[i]['depName'] || '',
                courseTeachingResearchRoomThirdName: contentArr[i]['courseTeachingResearchRoomThirdName'] ? `科室：${ contentArr[i]['courseTeachingResearchRoomThirdName'] || ''}` : '',
                courseType: contentArr[i]['courseType'] || '',
                teacherNames: contentArr[i]['teacherNames'] ? `教师：${ contentArr[i]['teacherNames'] || ''}` : '',
                courseContent: contentArr[i]['courseContent'] ? `内容：${ contentArr[i]['courseContent'] || ''}` : '',
                courseMethod: contentArr[i]['courseContent'] ? `教学方法：${ contentArr[i]['courseMethod'] || ''}` : '',

              }
              myData.unshift({
//                title: currFormate[contentArr[i]["timeType"]]+num+":"+contentArr[i]["depName"]+"   "+contentArr[i]["timeInfo"],
                title: `${num}、${tempObj['depName'] }   ${tempObj['courseTeachingResearchRoomThirdName'] }   课程：${tempObj['courseName'] }  类型：${tempObj['courseType'] }   内容:${tempObj['courseContent'] }   ${tempObj.teacherNames }   ${tempObj.courseMethod } 类型：${tempObj.courseType || '—'} 时间：${contentArr[i]['timeInfoBegin'] || ''}-${contentArr[i]['timeInfoEnd'] || '—'}`,
                start: k,
                end: k,
                cssClass: contentArr[i].courseTeachingResearchRoomThird ? 'PASS' : 'NO_SUBMIT'
              })
            }
          })
        }

        this.addWeekEnd(myData, range)

        this.showData = {
          depName: depName,
        };
        holidayList.map(item => {
          myData.unshift({
            title: item.text,
            start: item.dateTime,
            end: item.dateTime,
            cssClass: ['label', 'kg'],
          })
        })
        calendarSet.setCalData(myData);
        this.getCourseStatistics()//获取未排课列表
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
      cancelMyWin() {
        this.$emit('cancel', 'edit');
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },

      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },

      /**
       * 日期格式化内容被点击时触发
       * @param event      {}  当前被点击内容对象
       * @param jsEvent    {}  被点击的鼠标事件对象
       * @param pos        {}  当前位置对象
       */
      eventClick(event, jsEvent, pos) {
        if (['show', 'jysAudit'].includes(this.whereFrom)) return;
        if (this.findInHoliday(this.holidayList, event.start)) return;
        let target = jsEvent.target || jsEvent.srcElement
        if (target.innerText.length < 4) {
          this.errorMess('没有课程课时设置!')
          return;
        }

        let yearMonth = this.conductDate(this.conductDate(event.start, 'yyyy-MM-dd'), 'yyyy-MM');
        this.currMonth = yearMonth;
        this.operailityData = {weekSetId: this.weekSetId, date: event.start, yearMonth: yearMonth};
        this.openModel('add');
      },

      /**
       *
       * @param day
       * @param jsEvent
       */

      dayClick(day, jsEvent) {
        if (['show', 'jysAudit'].includes(this.whereFrom)) return;
        if (this.findInHoliday(this.holidayList, day)) return;
        let target = jsEvent.target || jsEvent.srcElement
        if (target.innerText.length < 4) {
          this.errorMess('没有课程课时设置!')
          return;
        }
        let date = this.conductDate(day, 'yyyy-MM-dd');
        let yearMonth = this.conductDate(day, 'yyyy-MM');
        this.currMonth = yearMonth;
        this.operailityData = {weekSetId: this.weekSetId, date: date, yearMonth: yearMonth};
        this.openModel('add');
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

      /*
       * 监听子组件通讯的方法
       * 作用:ajax请求成功回调,该监听方法在libs/util 中的混合模式下定义回调
       * @param targer string example:"add"、"edit"
       * @param targer string 提示返回的ajax回调返回的信息改信息在对应的子组件中定义
       * 例如:errorTitle、errorTitle
       *addMessTitle:{
       *    type:'add',
       *    successTitle:'添加成功!',
       *    errorTitle:'添加失败!',
       *    ajaxSuccess:'ajaxSuccess',
       *    ajaxError:'ajaxError',
       *    ajaxParams:{
       *      url:'/role/add',
       *      method:'post'
       *    }
       *    }
       * @param udata boolean 默认false  是否不需要刷新当前表格数据
       * */
      subCallback(target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setCourseTime();
        }
      },

      //获取子组件课程未安排列表
      getCourseStatistics() {
        this.$refs.courseList.getCourseStatistics(this.editOperailityData);//每次刷新的时候调用获取未排课列表列表
      },

    },
    created() {
      this.init();
    },
    watch: {
      weekSetId(val) {
        if (val != '') {
          let getMainTitle = Util._.defaultsDeep({}, this.getMainTitle);
          getMainTitle.ajaxParams.url += '/' + val;
          this.ajax(getMainTitle)
        }
      }
    },
    mounted() {

    },
    components: {
      fullCalendar,
      setCurriculum,
      courseList,
      auditList
    }
  }
</script>
<style lang="scss">
  .syllabusManagement {
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
        .NO_SUBMIT {
          background: rgba(199, 230, 253, 1);
        }
        .NO_PASS {
          background: rgba(255, 255, 0, 0.7);
        }
        .JYC_NO_PASS {
          background: rgba(255, 177, 28, 0.7);
        }
        .REJECT {
          background: rgba(253, 36, 255, 0.7);
        }
        .PASS {
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
    .box {
      width: 20px;
      height: 20px;
    }
    .NO_SUBMIT {
      @extend .box;
      background: rgba(199, 230, 253, 1);
    }
    .NO_PASS {
      @extend .box;
      background: rgba(255, 255, 0, 0.7);
    }
    .REJECT {
      @extend .box;
      background: rgba(253, 36, 255, 0.7);
    }
    .PASS {
      @extend .box;
      background: rgba(4, 253, 2, 0.7);
    }
    .kg {
      @extend .box;
      background: rgba(250, 54, 0, 0.7);
    }
    .events-week {
      margin-top: 0px !important;
      height: 99px;

    }

  }

</style>
