<!----------------------------------
****--修改周历(calendar_add)
****--@date     2014-04-12
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <div class="newCalendar " v-if="stepMaker=='first'">
      <el-row :gutter="10" v-if="schoolData.length>0">
        <el-col v-for="(item,index) in schoolData" :key="index" :span="6">
          <div class="cal-schools">
            <el-row>
              <el-col :span="20">
                <el-tooltip :content="item.name" effect="light" placement="top">
                  <el-button class="overflow-txt" :type="item.checked?'success':''"
                             @click="handleCheckSchool(index,item)" style="width: 100%" v-text="item.name"></el-button>
                </el-tooltip>
              </el-col>
              <el-col :span="4">
                <div v-show="item.checked" class="cal-check"><i class="el-icon-check"></i></div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <br/>
      <el-row>
        <el-col :span="24" class="textCenter">
          <el-button @click="gotoNext('next','second')" type="primary">下一步</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="newCalendar" v-show="stepMaker=='second'">
      <el-form ref="formValidate" :rules="this.$store.state.rules.calendar" :model="formValidate"
               class="demo-form-inline" label-width="120px">
        <br/>
        <el-row :gutter="10">
          <el-col :span="3">
            <div class="cal-schoolTit" style="text-align: right;">学校名称:</div>
          </el-col>
          <el-col :span="20">
            <div class="cal-schoolTit">{{formValidate.schoolName}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="3">&nbsp;</el-col>
          <el-col :span="4" v-if="formValidate.weekSetStartTime!=''">
            <div class="cal-schoolTit">
              {{studyYearStart}} ~ {{studyYearEnd}}学年,
            </div>
          </el-col>
          <el-col :span="1">
            <div class="cal-schoolTit"><!--学年,-->&nbsp;&nbsp;第</div>
          </el-col>
          <el-col :span="3">
            <el-select v-model="formValidate.semester" placeholder="请选择">
              <el-option
                v-for="item in semesterOptions"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <div class="cal-schoolTit">学期教学周历</div>
          </el-col>
        </el-row>
        <br/>
        <el-row :gutter="10">
          <el-col :span="3">
            <div class="cal-schoolTit" style="text-align: right;">学期起止时间:</div>
          </el-col>
          <el-col :span="8">
            <date-group :index="0" :dateGroup="{'type':'date','text':'至'}" :s-date="formValidate.weekSetStartTime"
                        :e-date="formValidate.weekSetEndTime" @setDateGroupVal="setDateGroupVal"></date-group>
          </el-col>
          <el-col :span="4">
            <el-date-picker
              :editable="false"
              style="width: 100px"
              v-model="formValidate.gradeNum"
              align="right"
              type="year"
              placeholder="选择年">
            </el-date-picker>
            <span class="cal-schoolTit">级</span>
          </el-col>
          <el-col :span="3">
            <el-input v-model="formValidate.classNum"></el-input>
          </el-col>
          <el-col :span="4">
            <span style="float: left" class="cal-schoolTit">班</span>
          </el-col>
        </el-row>
        <br/>
        <el-row :gutter="10">
          <el-col :span="3">
            <div class="cal-schoolTit" style="text-align: right;">说明:</div>
          </el-col>
          <el-col :span="20">
            <!--<el-form-item label="说明：" prop="weekSetInstructions" >-->
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="formValidate.weekSetInstructions">
            </el-input>
            <!--</el-form-item>-->
          </el-col>
        </el-row>
        <br/>
      </el-form>
      <el-row>
        <el-col :span="8" class="textCenter">&nbsp;</el-col>
        <el-col :span="8" class="textCenter">
          <el-button @click="gotoNext('next','third')" type="primary">下一步</el-button>
        </el-col>
        <el-col :span="8" class="textCenter">&nbsp;</el-col>
      </el-row>
    </div>
    <div class="newCalendar calendareManagement" v-show="stepMaker=='third'">
      <el-row :gutter="10">
        <el-col :span="3">
          <div class="cal-schoolTit" style="text-align: right;">学校名称：</div>
        </el-col>
        <el-col :span="20">
          <div class="cal-schoolTit">{{formValidate.schoolName}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="16" v-if="formValidate.weekSetStartTime!=''">
          <div class="cal-schoolTit">
            {{studyYearStart}} ~ {{studyYearEnd}}学年，{{formValidate.semester == 'ONE' ? '第一学期' : '第二学期'}}教学周历
          </div>
        </el-col>
        <el-col :span="5" align="right">
          <el-button type="primary" @click="confirm">批量添加课程</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="cal-schoolTit">
            学期起止时间：{{formValidate.weekSetStartTime}} 至 {{formValidate.weekSetEndTime}}
            ，{{conductDate(formValidate.gradeNum, 'yyyy')}}级，{{formValidate.classNum}}班
          </div>
        </el-col>
      </el-row>
      <full-calendar ref="calendar" class="test-fc" :tpl="calendarSet.tpl" :itemLimit="calendarSet.itemLimit"
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
      <el-row>
        <el-col :span="24" align="center">
          <el-button @click="gotoNext('up','second')" type="primary">上一步</el-button>
          <el-button @click="$emit('cancel','edit')" type="primary">确定</el-button>
          <el-button @click="saveMess" type="primary">发送</el-button>
        </el-col>
      </el-row>
    </div>
    <Modal
      :mask-closable="false"
      v-model="addModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="1000">
      <modal-header slot="header" :content="addId"></modal-header>
      <set-curriculum v-if="addModal" @cancel="cancel" @add="subCallback"
                      :operailityData="operailityData"></set-curriculum>
      <div slot="footer"></div>
    </Modal>

    <!--批量添加-->
    <Modal
      :mask-closable="false"
      v-model="batchAddModal"
      height="460"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="1000">
      <modal-header slot="header" :content="batchAddId"></modal-header>
      <batchAdd v-if="batchAddModal" @cancel="cancel" @batchAdd="subCallback"
                :operailityData="formValidate" :weekSetId="weekSetId"></batchAdd>
      <div slot="footer"></div>
    </Modal>
    <!--批量添加提示-->
    <Modal
      :mask-closable="false"
      v-model="confirmModal"
      height="460"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="600">
      <modal-header slot="header" :content="confirmId"></modal-header>
      <div class="remove">已经课程微调，批量添加课程更改后，会对微调结果产生影响</div>
      <el-row>
        <el-col :span="10" :offset="14">
          <el-button @click="batchAdd('batchAdd')">确认</el-button>
          <el-button class="but-col" @click="cancel('confirm')" type="danger">取消</el-button>
        </el-col>
      </el-row>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<!--<style>
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
</style>-->
<script>
  /*当前组件必要引入*/
  import fullCalendar from 'vue-ambuf-fullcalendar';
  import setCurriculum from './setCurriculum.vue';

  //引入日历相关的配置
  import calendarSet from './calendarSet.js';
  import batchAdd from './calendar_batchAdd.vue';

  //引入当前组件字典api
  import api from '../api.js';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['editOperailityData'],
    data () {
      return {
        //是否显示全日历
        isShowCalendar: false,
        batchAddModal: false,
        confirmModal: false,
        stepMaker: 'second',
        holidayList: [],//获取的当个月的节假日列表
        //选择的学校
        schoolData: [],
        schoolSaveMess: {},
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

        //学期枚举类型
        semesterType: {},

        //周历保存后的id
        weekSetId: '',
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

        /*--按钮button--*/
        addId: {
          id: 'add',
          title: '添加'
        },
        /*--按钮button--*/
        batchAddId: {
          id: 'batchAddId',
          title: '批量添加'
        },
        /*--按钮button--*/
        confirmId: {
          id: 'confirmId',
          title: '批量添加'
        },

        //当前操作存储的数据
        operailityData: '',

        //请求学校数据
        getSchoolsTitle: {
          ajaxSuccess: 'getSchoolsData',
          ajaxParams: {
            url: api.schools.path,
            params: {}
          }
        },

        //获取周历设置主表
        getMainTitle: {
          ajaxSuccess: 'getMainData',
          ajaxParams: {
            url: api.get.path,
          }
        },

        //保存周历设置主表
        saveMainTitle: {
          ajaxSuccess: 'saveMainData',
          ajaxParams: {
            url: api.add.path,
            method: api.add.method,
            params: {}
          }
        },

        //修改周历设置主表
        editMainTitle: {
          ajaxSuccess: 'editMainData',
          ajaxParams: {
            url: api.modify.path,
            method: api.modify.method,
            params: {}
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

        //获取时间段设置的课程
        courseTimeData: {},
        getCourseTimeTitle: {
          ajaxSuccess: 'getCourseTimeData',
          ajaxParams: {
            url: api.teachCourseTime.path,
          }
        },

        //上报教学周历设置
        submitCalendarTitle: {
          type: 'edit',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.modifySubmit.path,
            method: api.modifySubmit.method,
            params: {}
          }
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        calendarSet.setCalData([]);
        this.weekSetId = this.editOperailityData.weekSetId;

        //活动时间段获取
//        this.ajax(this.getCourseTimeTitle);
      },

      //活动时间段获取
      getCourseTimeData (responseData) {
        let data = responseData.data;
        for (var i = 0, item; i < data.length; i++) {
          item = data[i];
          this.courseTimeData[item['timeId']] = item;
        }
      },

      //根据教学周历ID获取每个月课程设置
      /**获取节假日数据成功后再获取
       * */
      setCourseTime () {
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

      //根据教学周历ID获取每个月课程设置--server回调
      getMonthCourseData (responseData) {
        let data = responseData.data;
        if (!this.valDataType(data, 'Array')) return;
        let myData = [];
        let range = [];//限定时间范围，目前没有使用，作用：工作日如果存在数据，则不显示灰色
        let holidayList = this.holidayList;//节假日
        let currFormate = ['上', '下', '晚'];
        for (var i = 0, item; i < data.length; i++) {
          item = data[i];
          Util._.forEach(item, (v, k) => {
            if (this.findInHoliday(holidayList, k)) return;
            let contentArr = v;
            for (var i = 0; i < contentArr.length; i++) {
//              range.push({dateTime:k})
//              let num = this.courseTimeData[contentArr[i]["timeId"]].courseIndex;//(i+1);
              let num = i + 1;//(i+1);
              myData.unshift({
//                title: currFormate[contentArr[i]["timeType"]]+num+":"+contentArr[i]["depName"]+"   "+contentArr[i]["timeInfo"],
                title: num + ':' + contentArr[i]['depName'] + '   ' + contentArr[i]['timeInfo'],
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
      getDate (fun) {
        let date = this.parseDate(this.currMonth + '-15', 'yyyy-MM-dd').getTime();
        let firstDate = date - 45 * 86400000
        let lastDate = date + 45 * 86400000
        for (let i = firstDate; i < lastDate; i += 86400000) {
          if (![0, 6].includes(new Date(i).getDay())) continue;
          fun(i);
        }
      },
      /**添加周六日颜色*/
      addWeekEnd (myData, range) {
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
      findInHoliday (holidayList, date) {
        for (let i = 0; i < holidayList.length; i++) {
          let holiday = holidayList[i];
          if (date === holiday.dateTime) {
            return true;
          }
        }
      },

      //获取学校list
      getSchoolsData (responseData) {
        let data = responseData.data;

        for (var i = 0, item; i < data.length; i++) {
          item = data[i];
          item.checked = false;
        }
        this.schoolData = data;
      },

      /*
       * 日期组改变值后赋值
       * @param index number   当前数据数组的索引
       * @param key   string   当前数据需要设置的对象的key 例如:startDate
       * @param val   string   当前选中的日期已格式化好的值
       * */
      setDateGroupVal (index, key, val) {
        if (key == 'startDate') {
          this.formValidate['weekSetStartTime'] = val;
        }
        if (key == 'endDate') {
          this.formValidate['weekSetEndTime'] = val;
        }
      },

      /**
       * 选择学校
       * @param {number} idx 当前选择的学校的索引
       */
      handleCheckSchool (idx, item) {
        item.checked = !item.checked;
        if (item.checked) {
          this.schoolSaveMess[this.schoolData[idx].id] = this.schoolData[idx];
        } else {
          delete this.schoolSaveMess[this.schoolData[idx].id];
        }
      },

      setSchoolMess (obj) {
        let schoolIds = [];
        let schoolNames = [];
        Util._.forEach(obj, function (n, k) {
          schoolIds.push(n.id);
          schoolNames.push(n.name);
        })
        this.formValidate.schoolIds = schoolIds.join(',');
        this.formValidate.schoolNames = schoolNames.join(',');
      },

      //上报
      saveMess () {
        let submitCalendarTitle = Util._.defaultsDeep({}, this.submitCalendarTitle);
        submitCalendarTitle.ajaxParams.url += '/' + this.weekSetId;
        this.ajax(submitCalendarTitle);
      },

      /**
       * 去到哪一步
       * @param type {string} 上一步,下一步的类型  next or up
       * @param step {string} 去到哪一步:first second third
       */
      gotoNext (type, step) {
        if (this.stepMaker == 'first') {
          //隐藏已选择的学校
          this.setSchoolMess(this.schoolSaveMess);
          if (this.formValidate.schoolIds == '') {
            this.showMess('请选择学校!');
            return
          }
          this.stepMaker = step;
        } else {
          if (this.stepMaker == 'second') {
            if (this.formValidate.semester == '') {
              this.showMess('请选第几学期教学周历!');
              return
            }
            if (this.formValidate.weekSetStartTime == '' || this.formValidate.weekSetEndTime == '') {
              this.showMess('请填写学期起止时间!');
              return
            }
            if (this.formValidate.gradeNum == '') {
              this.showMess('请选择级!');
              return
            }
            if (!/^\+?[1-9]\d*$/.test(this.formValidate.classNum)) {
              this.showMess('班级必须正整数且大于零!');
              return
            }
            if (this.formValidate.classNum == '') {
              this.showMess('请填写班级!');
              return
            }
            if (this.formValidate.weekSetInstructions == '') {
              this.showMess('请填写说明!');
              return
            }
            /*let val = this.submitForm("formValidate");
          if(!val){
            return;
          }*/
            if (this.weekSetId == '') {
              this.saveMainTitle.ajaxParams.data = this.getFormData(this.formValidate);
              this.ajax(this.saveMainTitle);
            } else {
              let editMainTitle = Util._.defaultsDeep({}, this.editMainTitle);
              editMainTitle.ajaxParams.url += '/' + this.weekSetId;
              editMainTitle.ajaxParams.data = this.getFormData(this.formValidate);
              this.ajax(editMainTitle);
            }

            //根据当前选择的时间来决定周历跳转的月份
            this.$nextTick(() => {
              let date = this.parseDate(this.formValidate.weekSetStartTime, 'yyyy-MM-dd');//
              let weekSetStartTime = date.getTime();//
              let weekSetEndTime = this.parseDate(this.formValidate.weekSetEndTime, 'yyyy-MM-dd').getTime();//
              let nowDate = new Date().getTime();
              if (weekSetStartTime < nowDate && weekSetEndTime > nowDate) return;//如果是当前月则不用更改月份
              this.currentMonth = this.$refs.calendar.currentMonth;
              this.currentMonth._d = date;//;
              this.$refs.calendar.emitChangeMonth(this.currentMonth);
            })
          } else {
            this.stepMaker = step;
          }

        }
      },

      //周历设置主表信息保存成功回调
      saveMainData (responseData) {
        this.stepMaker = 'third';
        this.weekSetId = responseData.data;
        this.$emit('edit');
      },

      //周历设置主表信息修改成功回调
      editMainData (responseData) {
        this.stepMaker = 'third';
        this.$emit('edit');
      },

      submitForm (formName) {
        let val = false;
        this.$refs[formName].validate((valid) => {
          val = valid;
        });
        return val;
      },

      //获取周历信息成功回调
      getMainData (responseData) {
        this.formValidate = responseData.data;
        this.formValidate.schoolNames = responseData.data.schoolName;

      },

      goPrev () {
        this.$refs.calendar.goPrev();
      },
      goNext () {
        this.$refs.calendar.goNext();
      },
      changeMonth (start, end, current, foramatData) {
        this.monthTitle = foramatData(current, 'MMMM YYYY');
        this.currMonth = this.conductDate(current, 'yyyy-MM');
        this.setCourseTime();
      },

      /**
       * 日期格式化内容被点击时触发
       * @param event      {}  当前被点击内容对象
       * @param jsEvent    {}  被点击的鼠标事件对象
       * @param pos        {}  当前位置对象
       */
      eventClick (event, jsEvent, pos) {
        if (this.findInHoliday(this.holidayList, event.start)) return;
        let weekSetStartTime = this.parseTimestamp(this.formValidate.weekSetStartTime);
        let weekSetEndTime = this.parseTimestamp(this.formValidate.weekSetEndTime);
        let currDate = this.parseTimestamp(this.conductDate(event.start, 'yyyy-MM-dd'));
        //判断当前选择的时间是否在设定的时间范围内
        if (weekSetStartTime <= currDate && currDate <= weekSetEndTime) {
          let yearMonth = this.conductDate(this.conductDate(event.start, 'yyyy-MM-dd'), 'yyyy-MM');
          this.currMonth = yearMonth;
          this.operailityData = {weekSetId: this.weekSetId, date: event.start, yearMonth: yearMonth};
          this.openModel('add');
        } else {
          this.showMess('您选择的时间不在当前学期设置的时间范围' + this.formValidate.weekSetStartTime + '至' + this.formValidate.weekSetEndTime + '之内!');
        }
      },

      /**
       *
       * @param day
       * @param jsEvent
       */

      dayClick (day, jsEvent) {
        if (this.findInHoliday(this.holidayList, day)) return;
        let weekSetStartTime = this.parseTimestamp(this.formValidate.weekSetStartTime);
        let weekSetEndTime = this.parseTimestamp(this.formValidate.weekSetEndTime);
        let currDate = this.parseTimestamp(this.conductDate(day, 'yyyy-MM-dd'));
        //判断当前选择的时间是否在设定的时间范围内
        if (weekSetStartTime <= currDate && currDate <= weekSetEndTime) {
          let date = this.conductDate(day, 'yyyy-MM-dd');
          let yearMonth = this.conductDate(day, 'yyyy-MM');
          this.currMonth = yearMonth;
          this.operailityData = {weekSetId: this.weekSetId, date: date, yearMonth: yearMonth};
          this.openModel('add');
        } else {
          this.showMess('您选择的时间不在当前学期设置的时间范围' + this.formValidate.weekSetStartTime + '至' + this.formValidate.weekSetEndTime + '之内!');
        }
      },
      /**
       *
       * @param day
       * @param events
       * @param jsEvent
       */
      moreClick (day, events, jsEvent) {
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
      subCallback (target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setCourseTime();
        }
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },

      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data);
        if (typeof myData['gradeNum'] != 'string') {
          myData = this.formDate(myData, ['gradeNum'], 'yyyy');
        }
        this.formDate(myData, ['weekSetEndTime', 'weekSetStartTime'], this.yearMonthData);
        return myData;
      },

      /**批量添加课程-打开确认弹窗*/
      confirm () {
        this.openModel('confirm')
      },

      /**批量添加课程*/
      batchAdd () {
        this.cancel('confirm')
        this.openModel('batchAdd')
      },
    },
    computed: {
      //学年起止日
      studyYearStart () {
        return this.conductDate(this.formValidate.weekSetStartTime, 'yyyy');
      },
      studyYearEnd () {
        return this.conductDate(this.formValidate.weekSetEndTime, 'yyyy');
      },
    },
    created () {
      this.init();
    },
    watch: {
      weekSetId (val) {
        if (val != '') {
          let getMainTitle = Util._.defaultsDeep({}, this.getMainTitle);
          getMainTitle.ajaxParams.url += '/' + val;
          this.ajax(getMainTitle)
        }
      }
    },
    mounted () {

    },
    components: {
      fullCalendar,
      setCurriculum,
      batchAdd,
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
