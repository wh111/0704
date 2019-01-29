<!--
****--@file     staffRoomFineTuningReview_list
****--@date     2018/6/13 16:08
****--@author   YC
****--@describe 教研室课程审核列表
-->
<!----------------------------------
****--@name     课程审核
****--@role     ${*}
****--@date     2018/5/25
****--@author   gx
----------------------------------->
<template>
  <!--表格数据-->
  <el-table
    align="center"
    :height="400"
    :data="tableData"
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
      show-overflow-tooltip
      align="center"
      prop="courseName"
      label="课程">
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      align="center"
      prop="courseTeachingResearchRoomThirdName"
      label="科室">
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      align="center"
      prop="courseContent"
      label="内容">
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      prop="teacherNames"
      label="教师"
      align="center">
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      prop="courseDate"
      label="课程时间">
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      prop="weekSetStartTime"
      width="180"
      label="时间段">
      <template scope="scope">
        {{ scope.row.timeInfoBegin}} - {{ scope.row.timeInfoEnd}}
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  /*当前组件必要引入*/
  import url from '../api'
  //引入--查看--组件
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      type: {//类型
        type: String,
        default: 'jys'
      },
      editOperailityData: {
        type: Object,
        default: {},
      },
    },
    data() {
      return {
        deriveUrl: '',
        url: url,
        //查询表单
        deleteUrl: '/role/remove',
        formValidate: {
          weekSetId: this.editOperailityData.weekSetId,
          outlineId: this.editOperailityData.outlineId,
          depId: this.editOperailityData.courseTeachingResearchRoomThird||this.editOperailityData.courseTeachingResearchRoom,
          type:'three',
        },
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        tableData: [],
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: url.getCourseSet.path,
            params: {}
          }
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        if(this.type=='jyc'){
          this.formValidate.type='two';
          this.formValidate.depId=this.editOperailityData.courseTeachingResearchRoom;
        }
        //ajax请求参数设置
        this.setTableData();
        console.log(this.editOperailityData)
      },

      //通过get请求列表数据
      updateListData(responseData) {
        let data = responseData.data && responseData.data.courseData;
        this.courseStatic = responseData.data && responseData.data.courseStatic;
        if (!this.valDataType(data, 'Array')) return;
        let myData = [];
        for (var i = 0, item; i < data.length; i++) {
          item = data[i];
          Util._.forEach(item, (v, k) => {
            let contentArr = v;
            for (var i = 0; i < contentArr.length; i++) {
//              let num = this.courseTimeData[contentArr[i]["timeId"]].courseIndex;//(i+1);
              myData.unshift(contentArr[i])
            }
          })
        }
        this.tableData = myData
        console.log(myData);
      },
      setTableData() {
        this.listMessTitle.ajaxParams.params = this.getFormValidate()
        this.ajax(this.listMessTitle);
      },

      getFormValidate() {
        return this.$util._.defaultsDeep({}, this.formValidate)
      },

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      //当前组件引入的子组件
    }
  }
</script>

