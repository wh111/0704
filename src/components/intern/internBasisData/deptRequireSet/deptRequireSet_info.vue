<!--科室要求 - 查看-->
<template>
  <el-table ref="multipleTable" align="center" :data="tableData" :height="500" tooltip-effect="dark" style="width: 100%">
    <el-table-column prop="depName" label="科室" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="disType" label="要求类别" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="disTitle" label="要求名称" align="center" width="180">
    </el-table-column>
    <el-table-column prop="disNum" label="要求数量" align="center" width="180">
    </el-table-column>
    <el-table-column prop="disTs" label="轮转周期" align="center" width="100">
    </el-table-column>
  </el-table>
</template>
<script>
  /*当前组件必要引入*/
  import api from "../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ["operailityData"],
    data() {
      return {
        //数据查询
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.getDepRequirement.path + this.operailityData.depOutlineId + '-' + this.operailityData.depId + '-' +
              this.operailityData.podId,
          }
        },
        //表单数据bind
        tableData: [],
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        this.ajax(this.listMessTitle)
      },
      //通过get请求列表数据
      updateListData(responseData) {
        this.tableData = responseData.data || [];
      },
    },
    created() {
      this.init();
    },
    mounted() {},
    components: {}
  }

</script>
