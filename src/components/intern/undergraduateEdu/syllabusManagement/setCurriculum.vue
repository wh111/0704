<!----------------------------------
****--课程设置(setCurriculum)
****--@date     2017/6/17
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <h2 style="text-align: center;padding: 10px 0;">{{operailityData.date}}课程安排</h2>
    <br/>
    <el-table
      v-if="course!=0"
      v-for="item in 1"
      :key="item"
      align="center"
      :data="course"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        prop="outlineName"
        label="大纲名称"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="courseName"
        label="课程名称"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="courseType"
        label="课程类型"
        width="80"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="timeInfo"
        label="授课时间"
        width="120"
        show-overflow-tooltip>
        <template scope="scope">
          {{scope.row.timeInfoBegin}}-{{scope.row.timeInfoEnd}}
        </template>
      </el-table-column>
      <el-table-column
        prop="room"
        label="教研室"
        width="120"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        label="课程"
        align="center"
        width="260"
        class-name="valiTableStyle"
        show-overflow-tooltip>
        <template scope="scope">
          <el-form :model="{courseTeachingResearchRoomThird:scope.row.courseTeachingResearchRoomThird}"
                   ref="f" :rules="setSyllabus" label-width="0"
                   style=" display: inline-block">
            <el-form-item prop="courseTeachingResearchRoomThird">
              <el-select
                v-if="optionData[scope.row.courseType]"
                v-model="scope.row.courseTeachingResearchRoomThird"
                :filterable="true"
                style="width: 100%"
                placeholder="选择课程"
                @change="change(optionObj[scope.row.courseType],scope.row)">
                <el-option
                  v-for="item in optionData[scope.row.courseType]"
                  :key="item.id"
                  :label="`${item.courseName}(${item.depName})剩余课时：${item.shouldCourseTime -item.nowCourseTime }`"
                  :value="item.depId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!--  <el-table-column
          prop="courseTimeCount"
          label="课程"
          width="120">
          <template scope="scope">
            {{ optionObj[scope.row.courseType] && optionObj[scope.row.courseType][scope.row.courseTeachingResearchRoomThird] && optionObj[scope.row.courseType][scope.row.courseTeachingResearchRoomThird].courseName}}
          </template>
        </el-table-column>-->
      <el-table-column
        prop="courseTimeCount"
        label="课时"
        width="80"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="recordCourseAddress"
        label="授课地点"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="classOrder"
        width="80"
        label="节次"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <br/>
    <el-row v-if="course!=0">
      <el-col :span="24" style="text-align: center;">
        <!--<el-button :disabled="disabled.report" type="success" @click="save('NO_SUBMIT')">保存</el-button>-->
        <el-button @click="save('NO_PASS')" type="info">提交</el-button>
        <!--<el-button :disabled="disabled.revoke" @click="revoke" type="warning">撤回</el-button>-->
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入当前组件字典api
  import api from '../api.js';
  //引入--验证--组件
  import {setSyllabus} from '../../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'editOperailityData', 'outlineId'],
    data() {
      return {
        setSyllabus,
        //保存按钮基本信息
        optionData: {},
        optionObj: {},
        course: [],
        formValidate: {
          recordIds: '',
          depIds: '',
        },
        //请求大纲对应的内容和科室列表
        getDepTitle: {
          ajaxSuccess: 'getDepData',
          ajaxParams: {
            url: api.detailqueryCount.path,
            params: {
              outlineId: this.editOperailityData.outlineId,
              weekSetId: this.editOperailityData.weekSetId,
              researchSectionId: this.editOperailityData.courseTeachingResearchRoom,
              type: '',
            }
          }
        },

        //获取课程
        getMyTeachRoomCourseTitle: {
          ajaxSuccess: 'getMyTeachRoomCourse',
          ajaxParams: {
            url: api.getMyTeachRoomCourse.path,
            method: api.getMyTeachRoomCourse.method,
            params: {
              courseTime: this.operailityData.date,
              weekSetId: this.operailityData.weekSetId,
              type: 'two'
            }
          }
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //获取科室option数据
        console.log(this.operailityData,this.editOperailityData,175);

        this.ajax(this.getMyTeachRoomCourseTitle);
      },

      //获取server端返回的科室
      getDepData(responseData) {
        let data = responseData.data;
        if (!data) return;
        let optionData = {};
        let optionObj = {};
        data.map((item) => {
          if (!optionData[item.courseType]) {
            optionData[item.courseType] = [];
            optionObj[item.courseType] = {};
          }
          optionData[item.courseType].push(item);
          optionObj[item.courseType][item.depId] = item;
        })
        this.optionData = optionData;
        this.optionObj = optionObj;
      },

      //获取server端课程信息
      getMyTeachRoomCourse(responseData) {
        let data = responseData.data;
        let depId = ''
        for (var i = 0, item; i < data.length; i++) {
          item = data[i];
          item['id'] = item.timeRecordId;
          depId = item.depId;
//          item.courseTeachingResearchRoomThird = ''
        }
//        this.getDepTitle.ajaxParams.params = {depId: depId,};
        this.ajax(this.getDepTitle);
        this.course = data;
      },

      /**保存或者上报*/
      save(type, isLoadingFun) {
        let isSubmit = this.submitForm();
        if (!isLoadingFun) isLoadingFun = function () {
        };

        if (isSubmit) {
          let saveRoomCourseTitle = {
            type: 'add',
            successTitle: `${ '提交'}成功!`,
            errorTitle: `${'提交'}失败!`,
            ajaxError: 'ajaxError',
            ajaxParams: {
              url: api.modifyThreeDep.path,
              method: api.modifyThreeDep.method,
              jsonString: true,
              data: this.getFormData(this.course)
            }
          }
          this.ajax(saveRoomCourseTitle, isLoadingFun);
        }
      },

      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = true;
        console.log(this.$refs);
        for (let i = 0; i < this.$refs.f.length; i++) {
          this.$refs.f[i].validate((valid) => {
            if (!valid) {
              flag = false;
            }
          });
        }
        return flag;
      },

      //选中值发生变化时触发
      change(courseTypeOption, rowData) {
        let outlineOption = courseTypeOption[rowData.courseTeachingResearchRoomThird];
        rowData.outlineDetailId = outlineOption.outlineDetailId;
        rowData.courseName = outlineOption.courseName;
        console.log(outlineOption);
        console.log(rowData);
      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'add');
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep([], data);
        return myData;
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {}
  }
</script>

