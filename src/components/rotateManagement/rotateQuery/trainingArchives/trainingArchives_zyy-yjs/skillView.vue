<!----------------------------------
****--@name     技能记录
****--@role     ${*}
****--@date     2017/11/23
****--@author   gx
----------------------------------->
<template>
    <div>
      <el-table
        align="center"
        :height="height"
        :data="operailityData.skill"
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
          prop="deName"
          label="技能名称">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="patienNo"
          label="病历号"
          align="center">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="patientName"
          label="病人姓名"
          align="center">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="fillTime"
          label="填写时间">
          <template scope="scope">
            {{scope.row.fillTime | formatDate('yyyy-MM-dd')}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="depName"
          label="科室名称">
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

        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {}
    }
</script>
