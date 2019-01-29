<!----------------------------------
****--@name     日常管理（手册书写完成）
****--@role     ${*}
****--@date     2017/12/7
****--@author   gx
----------------------------------->
<template>
    <div>
      <el-table
        align="center"
        :data="tableData"
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
        <el-table-column align="center" label="及时提交情况">
          <el-table-column
            show-overflow-tooltip
            prop="submit"
            label="按时提交">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="delaySubmit"
            label="延期提交">
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
                  name:'抢救记录',
                  submit:'3',
                  delaySubmit:'0',
                  uncommitted:'0',
                },
                {
                  name:'抢救记录',
                  submit:'5',
                  delaySubmit:'0',
                  uncommitted:'1',
                },
              ],
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
