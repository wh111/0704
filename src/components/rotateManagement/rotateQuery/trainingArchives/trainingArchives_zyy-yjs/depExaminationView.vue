<!----------------------------------
****--@name     出科小结
****--@role     ${*}
****--@date     2017/11/23
****--@author   gx
----------------------------------->
<template>
    <div>
      <el-table
        align="center"
        :height="height"
        :data="operailityData.depExamination"
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
          prop="userSummary"
          label="个人小结">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="userSummaryTime"
          label="个人小结填写时间"
          align="center">
          <template scope="scope">
            {{scope.row.userSummaryTime | formatDate('yyyy-MM-dd')}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="teacherComment"
          label="带教老师评语"
          align="center">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="teacherCommentUserName"
          label="带教老师评语填写人">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="teacherCommentTime"
          label="带教老师评语填写时间">
          <template scope="scope">
            {{scope.row.teacherCommentTime | formatDate('yyyy-MM-dd')}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="depSummary"
          label="科室评语">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="depCommentUserName"
          label="科室评语人">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="depCommentTime"
          label="科室评语时间">
          <template scope="scope">
            {{scope.row.depCommentTime | formatDate('yyyy-MM-dd')}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="depQualified"
          label="出科结果">
          <template scope="scope">
            {{depQualified(scope.row.depQualified)}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="isMakeupRotary"
          label="是否补轮转">
          <template scope="scope">
            {{ scope.row.isMakeupRotary | isMakeupRotary}}
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>
<script>
    /*当前组件必要引入*/

    //当前组件引入全局的util
    let Util = null;
    export default {
      props:['operailityData','height'],
        data() {
            return {}
        },
        methods: {
            //初始化请求列表数据
            init() {

            },

          depQualified(type){
              let obj = {
                'USER_NOT_REPORT':'已填写未上报',
                'TEC_NOT_REPORT':'老师已填写未上报',
                'EDU_NOT_REPORT':'带教秘书已填写未上报',
                'EDU_REPORT':'出科鉴定完成',
              }

              return obj[type]||type
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
