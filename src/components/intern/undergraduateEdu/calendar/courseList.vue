<!----------------------------------
****--@name     课程大纲列表
****--@role     ${*}
****--@date     2018/7/10
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-table
      align="center"
      :max-height="200"
      :data="tableData"
      stripe
      tooltip-effect="dark"
      highlight-current-row
      style="width: 97%">
      <el-table-column
        label="序号"
        type="index"
        width="65">
      </el-table-column>
      <el-table-column
        prop="outlineName"
        label="大纲名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="courseType"
        label="类型"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="shouldCourseTime"
        label="总课时">
      </el-table-column>
      <el-table-column
        prop="nowCourseTime"
        label="已安排">
      </el-table-column>
      <el-table-column
        label="未安排">
        <template scope="scope">
          {{(+scope.row.shouldCourseTime) - (+scope.row.nowCourseTime)}}
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>
<script>
  /*当前组件必要引入*/
  import api from '../api.js';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        tableData: [],
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
      },

      getCourseStatistics (weekSetId) {//获取请求的数据
        let getMainTitle = {
          ajaxSuccess: (res) => {
            let data = res.data;
            this.tableData = data || [];
          },
          ajaxParams: {
            url: api.countCourseTimeList.path,
            params: {
              weekSetId: weekSetId,
            }
          }
        }
        this.ajax(getMainTitle)
      },

      //验证 false 为通过
      validate () {
        return this.tableData.some(item => {
          if ((+item.shouldCourseTime) - (+item.nowCourseTime) !== 0) {
            this.errorMess(`${item.outlineName} 还有需安排!`)
            return true
          }
        })

      },

    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  }
</script>
