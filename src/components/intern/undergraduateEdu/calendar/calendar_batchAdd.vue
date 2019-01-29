<!----------------------------------
****--@name     批量添加课程
****--@role     ${*}
****--@date     2018/6/13
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-button @click="addCourse" type="primary">批量添加课程</el-button>
    <el-form inline labelWidth="90px">
      <div v-if="course.length>0" style="margin: 8px 0;" v-for="(item,index) in course" :key="index"
           class="form-fieldset-wrapper">
        <div class="form-fieldset-del">
          <el-tooltip :content="'点击删除第'+(index + 1)+'个课程'" placement="top" effect="light">
            <el-button style="float: right;" type="danger" size="mini" @click="removeCourse(index)"
                       icon="close"></el-button>
          </el-tooltip>
        </div>
        <fieldset style="min-height:90px;">
          <legend style="font-size:16px">&nbsp;&nbsp;第{{index + 1}}个课程&nbsp;&nbsp;</legend>
          <el-row>
            <el-col :span="8">
              <el-form-item label="大纲名称：">
                <el-select
                  v-model="item.outlineId"
                  :filterable="true"
                  style="width:150px"
                  placeholder="选择课程类型"
                  @change="outlineChange(item)">
                  <el-option
                    v-for="(item,index) in CourseTimeArr"
                    :key="index"
                    :label="item.outlineName"
                    :value="item.outlineId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="课程类型：">
                <el-select
                  v-model="item.courseType"
                  :filterable="true"
                  style="width:150px"
                  placeholder="选择课程类型"
                  @change="change">
                  <el-option
                    v-for="(item,index) in item.courseTypes"
                    :key="index"
                    :label="item.courseType"
                    :value="item.courseType">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="课时总数：">
                {{item.courseTime[item.courseType] && item.courseTime[item.courseType].shouldCourseTime}}
              </el-form-item>
              <el-form-item labelWidth="110px" label="剩余课时总数：">
                {{item.courseTime[item.courseType] && (item.courseTime[item.courseType].shouldCourseTime - item.courseTime[item.courseType].nowCourseTime)}}
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-col :span="11">
                <el-form-item label="时间范围：">
                  <dateGroup :index="index" :sDate="item.beginTime" :eDate="item.endTime"
                             :dateGroup="{startDate:item.beginTime,endDate:item.endTime}"
                             @setDateGroupVal="setDateGroupVal"></dateGroup>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="每周：" labelWidth="60px">
                  <el-select
                    style="width:90px"
                    v-model="item.weekNum"
                    @change="change">
                    <el-option
                      v-for="item in weekOption"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <timeQuantum :index="0" :range="[]" :data="item"></timeQuantum>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="6">
                <el-form-item style="width: 210px;" label="授课地点：">
                  <el-input style="width: 120px;" v-model="item.courseAddress"></el-input>
                </el-form-item>
              </el-col>
              <el-col :offset="1" :span="4">
                <el-form-item style="width: 140px" label="授课课时：">
                  <el-input style="width: 40px;" v-model="item.courseTimeCount"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="节次：">
                  <el-select style="width: 70px;" v-model="item.classOrder" placeholder="请选择">
                    <el-option
                      v-for="subItem in classOrderOption"
                      :key="subItem.value"
                      :label="subItem.label"
                      :value="subItem.value">
                    </el-option>
                  </el-select>
                  到
                  <el-select style="width:70px;" v-model="item.classOrderEnd" placeholder="请选择">
                    <el-option
                      v-for="subItem in classOrderOption"
                      :key="subItem.value"
                      :label="subItem.label"
                      :value="subItem.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
        </fieldset>
      </div>

    </el-form>

    <br/>
    <el-row>
      <el-col :span="24" style="text-align: center;">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入当前组件字典api
  import api from '../api.js';
  import timeQuantum from '../../../common/timeQuantum.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['weekSetId', 'operailityData'],
    data () {
      return {
        weekOption: ['一', '二', '三', '四', '五'],
        classOrderOption: [
          {value: 1, label: 1}, {value: 2, label: 2}, {value: 3, label: 3}, {value: 4, label: 4},
          {value: 5, label: 5}, {value: 6, label: 6}, {value: 7, label: 7}, {value: 8, label: 8},
          {value: 9, label: 9}, {value: 10, label: 10}, {value: 11, label: 11}, {value: 12, label: 12}
        ],
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        optionData: [{}],

        range: [],
        formValidate: {
          weekSetId: this.weekSetId, //周历ID

        },
        times: [
          /*{
            "timeId":"1",
            "courseTime":"08:00-08:50",
            "courseIndex":"1",
            "courseType":"0"
          }*/
        ],
        saveMess: {},
        //获取的大纲剩余课时数
        CourseTimeArr: [],
        CourseTimeObj: {},
        //课程类型
        courseType: [],
        courseTime: [],
        //课程教研室设置ID
        dayCourse: [],
        course: [],
        //请求科室列表
        getDepTitle: {
          ajaxSuccess: 'getDepData',
          ajaxParams: {
            url: api.byDepth.path,
            params: {
              depth: 2,
            }
          }
        },
        //教研室设置时间添加
        saveCoursetimeTitle: {
          type: 'batchAdd',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.modifyCourseBatchData.path,
            method: api.modifyCourseBatchData.method,
            jsonString: true,
            data: {},
          }
        },

        //根据教学周历ID和时间获取一天的教学安排
        getDayCourseSetTitle: {
          ajaxSuccess: 'getDayCourseData',
          ajaxParams: {
            url: api.getCourseBatchData.path,
            params: {
              weekSetId: this.weekSetId
            }
          }
        },
        //获取课大纲和其课时数
        getCountCourseTime: {
          ajaxSuccess: 'CourseTimeData',
          ajaxParams: {
            url: api.countCourseTime.path,
            params: {
              weekSetId: this.weekSetId
            }
          }
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //获取科室option数据
        /*setTimeout(() => {
          this.ajax(this.getDepTitle);
        }, 1);*/
        this.ajax(this.getCountCourseTime);//先获取大纲，再获取时间
      },

      //获取课大纲和其课时数
      CourseTimeData (res) {
        let data = res.data;
        if (!data) return;
        this.CourseTimeArr = data;
        this.CourseTimeObj = data.reduce((obj, item) => {
          obj[item.outlineId] = item;
          return obj;
        }, {})
        this.ajax(this.getDayCourseSetTitle);//获取时间课程设置时间

      },

      //从server端获取当天是否已有课程设置
      getDayCourseData (responseData) {
        let data = responseData.data;
        this.dayCourse = this.$util._.defaultsDeep([], data);//确保数据的正确性
        let course = []//课程列表数据
        if (data.length > 0) {
          data.map((item) => {
            this.outlineChange(item, true)
            Object.assign(item, {
              time: item.startHours + '-' + item.endHours,
              start: '',
              end: '',
            })
            course.push(item);
          })
          this.course = course;
        } else {
          this.addCourse()
        }
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        if (this.course.length == 0) {//先验证必填项
          this.showMess('至少要选择一个课程!');
          return;
        }
        for (var i = 0, item; i < this.course.length; i++) {
          item = this.course[i];
          if (item._start && item._end && item.outlineId && item.weekNum && item.beginTime && item.endTime && item.courseTimeCount && item.courseAddress && item.classOrder && item.classOrderEnd && item.courseType) {
            if (!/^\d*$/g.test(item.courseTimeCount)) {
              this.errorMess(`第${i + 1}个授课课时: 须为正整数`);
              return;
            }
            if (item.classOrder > item.classOrderEnd) {
              this.errorMess(`第${i + 1}个: 开始节次不能大于结束节次 须为正整数`);
              return;
            }
          } else {
            this.errorMess(`第${i + 1}个课程数据不完整`);
            return;
          }
          Object.assign(item, {
            outlineName: this.CourseTimeObj[item.outlineId].outlineName,
            courseTeachingResearchRoom: this.CourseTimeObj[item.outlineId].researchSectionId,
            startHours: item._start,
            endHours: item._end,
          })

        }
//
        //在验证合法性
        let course = this.course;
        for (let i = 0; i < course.length; i++) {
          let item = course[i]
          if (!this.dateRange(item)) {
            let {weekSetStartTime, weekSetEndTime} = this.operailityData;
            this.errorMess(`第${i + 1}个时间范围应在${weekSetStartTime} - ${weekSetEndTime}之内`)
            return;
          }
          if (!this.existenceWeek(item)) {
             this.errorMess(`第${i + 1}个时间范围内不存在 星期${item.weekNum}`)
             return
           }
           if (this.DateConflict(course, item, i)) return;//验证时间是否重叠
          /* Object.assign(item, {
             startHours: item._start,
             endHours: item._end,
           })*/
        }

        if (!isLoadingFun) isLoadingFun = function () {
        };
        isLoadingFun(true);
        let noId = this.course.every((item) => {
          return !item.id
        })

        if (this.dayCourse.length > 0 && noId) {
          this.course[0].id = this.dayCourse[0].id;
        }

        this.formValidate.details = course;
        Object.assign(this.saveCoursetimeTitle.ajaxParams.data, this.formValidate);
        this.ajax(this.saveCoursetimeTitle, isLoadingFun);
      },

      /**判断当前时间是否在时间范围之内*/
      dateRange ({beginTime, endTime}) {
        beginTime = this.parseTimestamp(beginTime);
        endTime = this.parseTimestamp(endTime);
        let weekSetStartTime = this.parseTimestamp(this.operailityData.weekSetStartTime);
        let weekSetEndTime = this.parseTimestamp(this.operailityData.weekSetEndTime);

        if (beginTime >= weekSetStartTime && endTime <= weekSetEndTime) {
          return true
        }
      },
      /**判断当前时间范围内是否存在当前所选择的星期
       * @params  item {object}  需要判断的数据（时间和周期都在里面）
       */
      existenceWeek ({beginTime, endTime, weekNum}) {
        let flag = false;
        beginTime = this.parseTimestamp(beginTime)//转换成时间戳
        endTime = this.parseTimestamp(endTime)
        let dataNum = (endTime - beginTime) / 86400000 + 1//此时间范围内一共几天
        weekNum = this.weekOption.indexOf(weekNum) + 1;
        for (let i = 0; i < dataNum; i++) {
          let week = new Date(beginTime + i * 86400000).getDay();
          if (week === weekNum) {
            flag = true;
            continue;
          }
        }
        return flag
      },

      //按日查询
      getDayAll (begin, end) {
        var dateAllArr = [];
        var ab = begin.split('-');
        var ae = end.split('-');
        var db = new Date();
        db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
        var de = new Date();
        de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
        var unixDb = db.getTime();
        var unixDe = de.getTime();
        for (var k = unixDb; k <= unixDe;) {
          var mydate = new Date(parseInt(k));
          var myddy = mydate.getDay() - 1;//获取存储当前日期
          if (this.weekOption[myddy]) {
            dateAllArr.push(this.weekOption[myddy]);
          }
          k = k + 24 * 60 * 60 * 1000;
        }
        return dateAllArr;
      },

      //时间端有交集的部分周次是否包含
      isHasWeek (begin, end, weekNum) {
        let tempArr = this.getDayAll(begin, end)
        return tempArr.indexOf(weekNum) > -1
      },

      /**时间冲突*/
      DateConflict (course, item, index) {
        let {beginTime: speBeginTime, endTime: speEndTime, weekNum: speWeekNum, start: speStart, end: speEnd, classOrder: speClassOrder} = item
        speBeginTime = this.parseTimestamp(speBeginTime)//转换成时间戳
        speEndTime = this.parseTimestamp(speEndTime)
        speStart = speStart.getTime();
        speEnd = speEnd.getTime();
        console.log(course);
        for (let i = index + 1; i < course.length; i++) {
          let {beginTime, endTime, weekNum, start, end, classOrder} = course[i];
          beginTime = this.parseTimestamp(beginTime);//转换成时间戳
          endTime = this.parseTimestamp(endTime);
          start = start.getTime();
          end = end.getTime();
          let repWeekArr = [speEndTime, beginTime, speBeginTime, endTime];
          repWeekArr.sort((a, b) => a - b)
          let dateCompare = speEndTime >= beginTime && speBeginTime <= endTime;//开始时间段比较

          let timeCompare = speEnd >= start && speStart <= end;//开始时间段比较

          let classOrderCompare = speClassOrder == classOrder;

          let isHashWeekFlag = this.isHasWeek(this.conductDate(repWeekArr[1], 'yyyy-MM-dd'), this.conductDate(repWeekArr[2], 'yyyy-MM-dd'), weekNum)

          if (speWeekNum === weekNum && dateCompare && isHashWeekFlag && timeCompare) {
            this.errorMess(`第${index + 1}和${i + 1}个课程 时间范围重叠 所选周数相同 时间段不能重叠`)
            return true
          }
          /* if (speWeekNum === weekNum && dateCompare && isHashWeekFlag && classOrderCompare) {
             this.errorMess(`第${index + 1}和${i + 1}个课程 时间范围重叠 所选周数相同 节次不能相同`)
             return true
           }*/
          /*if (speWeekNum === weekNum && dateCompare && timeCompare) {
            this.errorMess(`第${index + 1}和${i + 1}个课程 时间范围重叠 所选周数相同 时间段不能重叠`)
            return true
          }*/
        }

      },

      //获取server端返回的科室
      getDepData (responseData) {
        let data = responseData.data;
        if (!data) return;
        for (let i = 0; i < data.length; i++) {
          let item = data[i]
          if (item.id == -1) {
            data.splice(i, 1);
            i--;
          }
        }
        this.optionData = data;
      },

      /*  舍弃
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data);
        let tempArr = [];
        let timeRecords = []
        for (var i = 0, item; i < this.course.length; i++) {
          item = this.course[i];
          tempArr.push(item.sltTimeId);
          if (item.sltTimeId != '') {
            timeRecords.push(i + 1);
          } else {
            timeRecords.push(null);
          }
        }
        myData.timeRecords = timeRecords.join(',');
        myData.teachRoomDepId = tempArr.join(',');
        return myData;
      },

      //选中值发生变化时触发
      change (val) {

      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel () {
        this.$emit('cancel', 'batchAdd');
      },

      //添加数据
      addCourse () {
        this.course.push({
          start: '',
          end: '',
          time: '',
          courseTimeCount: '',
          courseAddress: '',
          classOrder: '',  //节次

          'weekSetId': this.weekSetId,
          'beginTime': '',
          'endTime': '',
          'weekNum': '',
          'startHours': '',
          'endHours': '',
          'courseTeachingResearchRoom': '',
          'courseName': '',
          'courseType': '',
          outlineId: '',
          outlineName: '',
          courseTime: {},
          classOrderEnd: '',
        })
      },

      /**
       * 移除时间范围限制并且移除数据
       * */
      removeCourse (index) {
        if (this.course.length < 1 || this.course.length === 1) {
          this.showMess('只剩最后一个了！');
          return;
        }
        this.course.splice(index, 1);
      },

      //设置时间
      setDateGroupVal (index, flag, val) {
        flag = flag == 'startDate' ? 'beginTime' : 'endTime';
        this.course[index][flag] = val;
      },

      dateChange (data) {
      },

      //大纲发生改变
      outlineChange (item, flag) {
        if (!item) return;
        let val = item.outlineId;
        if (!val) return;
        if (!flag) {
          item.courseType = '';
        }
        let courseType = item.courseTypes = this.CourseTimeObj[val].count || []
        item.courseTime = courseType.reduce((obj, item) => {
          obj[item.courseType] = item;
          return obj
        }, {});
      },

    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {timeQuantum}
  }
</script>

