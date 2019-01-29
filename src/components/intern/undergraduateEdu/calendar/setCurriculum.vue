<!----------------------------------
****--课程设置(setCurriculum)
****--@date     2017/6/14
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <h2 style="text-align: center;padding: 10px 0;">{{operailityData.date}}课程设置</h2>
    <el-button @click="addCourse" type="primary">添加课程</el-button>
    <el-form :inline="true" labelWidth="90px">
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
              <el-col :span="9">
                <el-form-item label="时间：">
                  <timeQuantum :index="index" :range="range" :data="item"></timeQuantum>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="授课课时：">
                  <el-input v-model="item.courseTimeCount"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
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
                  <el-select style="width: 70px;" v-model="item.classOrderEnd" placeholder="请选择">
                    <el-option
                      v-for="subItem in classOrderOption"
                      :key="subItem.value"
                      :label="subItem.label"
                      :value="subItem.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="授课地点：">
                  <el-input v-model="item.courseAddress"></el-input>
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
    props: ['operailityData'],
    data() {
      return {
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        optionData: [{}],
        classOrderOption: [
          {value: 1, label: 1}, {value: 2, label: 2}, {value: 3, label: 3}, {value: 4, label: 4},
          {value: 5, label: 5}, {value: 6, label: 6}, {value: 7, label: 7}, {value: 8, label: 8},
          {value: 9, label: 9}, {value: 10, label: 10}, {value: 11, label: 11}, {value: 12, label: 12}
        ],
        //获取的大纲剩余课时数
        CourseTimeArr: [],
        CourseTimeObj: {},
        //课程类型
        courseType: [],
        courseTime: [],
        range: [],
        formValidate: {
          weekSetId: this.operailityData.weekSetId, //周历ID
          courseTime: this.operailityData.date,   //课程时间(yyyy-MM-dd)
          'courseTimeId': '',
//          timeInfos: '',  //课程时间段(逗号分隔)  时间段ID
//          teachRoomDepId: '',  //大科室ID(逗号分隔)
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
        //课程教研室设置ID
        dayCourse: [],
        course: [],
        //获取时间段设置
        getTimesTitle: {
          ajaxSuccess: 'getTimeData',
          ajaxParams: {
            url: api.teachCourseTime.path,
            params: {}
          }
        },
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
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.courseTime.path,
            method: api.courseTime.method,
            jsonString: true,

          }
        },

        //根据教学周历ID和时间获取一天的教学安排
        getDayCourseSetTitle: {
          ajaxSuccess: 'getDayCourseData',
          ajaxParams: {
            url: api.dayCourseSet.path + '/' + this.operailityData.weekSetId,
            params: {
              dateTime: this.operailityData.date
            }
          }
        },

        //教研室设置时间修改
        courseTimeModifyTitle: {
          type: 'add',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.courseTimeModify.path,
            method: api.courseTimeModify.method,
            data: {
              weekSetId: this.operailityData.weekSetId,
              weekTime: this.operailityData.date,
            },
            jsonString: true,
          }
        },

        //获取课大纲和其课时数
        getCountCourseTime: {
          ajaxSuccess: 'CourseTimeData',
          ajaxParams: {
            url: api.countCourseTime.path,
            params: {
              weekSetId: this.operailityData.weekSetId
            }
          }
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        console.log(this.operailityData);
        Util = this.$util;
        //获取科室option数据
//        setTimeout(() => {
//          console.log(this.getDepTitle);
//          this.ajax(this.getDepTitle);
//        }, 1);
        //获取时间课程设置时间
        setTimeout(() => {

        }, 10)
        this.ajax(this.getCountCourseTime);
      },
      //获取课大纲和其课时数
      CourseTimeData(res) {
        let data = res.data;
        if (!data) return;
        this.CourseTimeArr = data;
        this.CourseTimeObj = data.reduce((obj, item) => {
          obj[item.outlineId] = item;
          return obj;
        }, {})

        this.ajax(this.getDayCourseSetTitle);

      },

      //从server端获取当天是否已有课程设置
      getDayCourseData(responseData) {
        let data = responseData.data;
        this.dayCourse = data;
        if (data.length > 0) {
          data.map((item) => {
            this.outlineChange(item, true)
            Object.assign(item, {
              start: item.timeInfoBegin || '',
              end: item.timeInfoEnd || '',
              time: '',
            })
          })
          this.course = this.$util._.defaultsDeep([], data);
        } else {
          this.addCourse()
        }
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        if (this.course.length == 0) {
          this.showMess('至少要选择一个科室!');
          return;
        }
        let id = '';
        //全没有id则返回true
        let noId = this.course.every((item) => {
          return !item.id
        })

        if (this.dayCourse.length > 0 && noId) {
          this.course[0].id = this.dayCourse[0].id;
        }
        for (var i = 0, item; i < this.course.length; i++) {
          item = this.course[i];
          console.log(item);
          if (item._start && item._end && item.courseTimeCount && item.courseAddress && item.classOrder && item.classOrderEnd && item.outlineId && item.courseType) {
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
            weekSetId: this.operailityData.weekSetId,
            timeInfoBegin: item._start,
            timeInfoEnd: item._end,
            outlineName: this.CourseTimeObj[item.outlineId].outlineName,
            courseTeachingResearchRoom: this.CourseTimeObj[item.outlineId].researchSectionId,
          })
        }
        if (!isLoadingFun) isLoadingFun = function () {
        };
        isLoadingFun(true);
        this.formValidate.weekCourseTimeRecordDtoList = this.course;
        this.courseTimeModifyTitle.ajaxParams.data = this.formValidate;
        this.ajax(this.courseTimeModifyTitle, isLoadingFun);
      },

      //获取server端返回的科室
      getDepData(responseData) {
        console.log(responseData.data);
        let data = responseData.data;
//        if (!data) return;
//        for (let i = 0; i < data.length; i++) {
//          let item = data[i]
//          if (item.id == -1) {
//            data.splice(i, 1);
//            i--;
//          }
//        }

        this.optionData = data;
      },

      /*  舍弃
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
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
      change(val) {

      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'add');
      },

      //添加数据
      addCourse() {
        this.course.push({
          start: '',
          end: '',
          time: '',
          'id': '',
          'courseTimeId': '',
          'weekSetId': '',
          'courseTeachingResearchRoom': '',
          'courseTimeCount': '',
          'courseAddress': '',
          'courseTeachingResearchRoomThird': '',
          'batchDataId': '',
          'classOrder': '',
          'courseType': '',
          'outlineId': '',
          'outlineName': '',
          'timeInfoBegin': '',
          'timeInfoEnd': '',
          classOrderEnd: '',
          courseTime: {}
        })
      },

      /**
       * 移除时间范围限制并且移除数据
       * */
      removeCourse(index) {
        if (this.course.length < 1 || this.course.length === 1) {
          this.showMess('只剩最后一个了！');
          return;
        }
        this.range.splice(index * 2, 2);
        this.course.splice(index, 1);
      },

      //大纲发生改变
      outlineChange(item, flag) {
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

    }
    ,
    created() {
      this.init();
    }
    ,
    mounted() {
    }
    ,
    components: {
      timeQuantum,
    }
  }
</script>

