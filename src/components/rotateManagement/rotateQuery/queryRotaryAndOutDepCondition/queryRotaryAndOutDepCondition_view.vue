<!----------------------------------
****--@name     科室教学任务完成情况（查看）
****--@role     ${*}
****--@date     2018/7/8
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-table
      border
      align="center"
      :height="300"
      :data="tableData"
      tooltip-effect="dark"
      highlight-current-row
      style="width: 100%;height: 100%">
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="100">
      </el-table-column>
      <el-table-column
        align="center"
        prop="userName"
        label="病种"
        show-overflow-tooltip>
        <el-table-column
          align="center"
          prop="diseasePlan"
          label="计划完成"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="center"
          prop="diseaseActually"
          label="实际完成"
          show-overflow-tooltip>
        </el-table-column>
      </el-table-column>

      <el-table-column
        align="center"
        prop="userName"
        label="技能"
        show-overflow-tooltip>
        <el-table-column
          align="center"
          prop="skillPlan"
          label="计划完成"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="center"
          prop="skillActually"
          label="实际完成"
          show-overflow-tooltip>
        </el-table-column>
      </el-table-column>

      <el-table-column
        align="center"
        prop="userName"
        label="病例"
        show-overflow-tooltip>
        <el-table-column
          align="center"
          prop="casePlan"
          label="计划完成"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="center"
          prop="caseActually"
          label="实际完成"
          show-overflow-tooltip>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //引入--修改--组件
  //引入--查看--组件
  //引入--查看--组件
  //当前组件引入全局的util
  let Util = null
  export default {
    props: ['operailityData', 'url'],
    data () {
      return {
        //查询表单
        formValidate: {},
        tableData: [],
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.url.getByPodId.path + this.operailityData.podId,
            params: {},
          },
        },
        deriveModal: false,
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        this.setTableData()
      },

      //通过get请求列表数据
      updateListData (responseData) {
        let data = responseData.data
        if (!data) return
        this.tableData = [data]
      },

      setTableData () {
        this.listMessTitle.ajaxParams.params = this.formValidate
        this.ajax(this.listMessTitle)
      },
    },

    created () {
      this.init()
    },
    mounted () {
    },
    components: {
      //当前组件引入的子组件
    },
  }
</script>
