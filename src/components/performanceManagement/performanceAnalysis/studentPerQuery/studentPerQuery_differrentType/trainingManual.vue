<!----------------------------------
****--@name     培训手册完成情况
****--@role     ${*}
****--@date     2017/12/7
****--@author   gx
----------------------------------->
<template>
    <div>
      <el-table
        align="center"
        :data="operailityData.datum==='entity'?tableData:skillOperation"
        tooltip-effect="dark"
        highlight-current-row
        border
        style="width: 100%;height: 100%">
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="75">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="require"
          label="要求例数">
        </el-table-column>
        <el-table-column align="center" label="实际完成例数">
          <el-table-column
            show-overflow-tooltip
            prop="pass"
            label="审核通过">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="reject"
            label="审核驳回">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="uncommitted"
            label="未提交">
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
</template>
<script>
    /*当前组件必要引入*/

    //当前组件引入全局的util
    let Util = null;
    export default {
      props:['operailityData'],
        data() {
            return {
              tableData:[
                {
                  name:'高血压',
                  require:'25',
                  pass:'25',
                  reject:'5',
                  uncommitted:'0',
                },
                {
                  name:'糖尿病',
                  require:'15',
                  pass:'15',
                  reject:'5',
                  uncommitted:'0',
                },
              ],
              skillOperation:[
                {
                  name:'心包穿刺术',
                  require:'3',
                  pass:'3',
                  reject:'0',
                  uncommitted:'0',
                },
                {
                  name:'动态血压',
                  require:'5',
                  pass:'3',
                  reject:'0',
                  uncommitted:'1',
                },
              ]


            }
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
