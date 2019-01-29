<!----------------------------------
****--@name     科室报到--获取带教老师
****--@role     ${*}
****--@date     2018/5/25
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-form :inline="true" align="right">
      <el-row style="margin-bottom:0">
        <!--搜索项-->
        <el-col :span="24" align="right">
          <el-form-item label="部门筛选">
            <el-select v-model="searchObj.hasMore" placeholder="请选择">
              <el-option label="本部门" value=""></el-option>
              <el-option label="所有部门" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model.trim="searchObj.name">
            </el-input>
          </el-form-item>
          <el-button @click="search" type="info"> {{ 'query' | sysLan}}</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 表格数据 -->
    <el-table align="center" :height="400" :data="tableData" tooltip-effect="dark"
              style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" prop="index" width="100"></el-table-column>
      <el-table-column label="姓名" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="部门名称" prop="depName" show-overflow-tooltip></el-table-column>
    </el-table>
    <div style="height: 45px;">
      <div style="float: right;margin-top:10px;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                       :page-sizes="myPages.pageSizes"
                       :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="totalCount"></el-pagination>
      </div>
    </div>
    <el-row>
      <el-col :span="24" align="center">
        <el-button @click="selectTeachers" type="primary">{{ 'sure' | sysLan}}</el-button>
        <el-button @click="cancel">{{ 'cancel' | sysLan }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['url','podClass'],
    data() {
      return {
        multipleSelection: '', // 表格已选集
        tableData: [],
        totalCount: 0,
        searchObj: {
          name: '',
          hasMore: '',
          podClass:this.podClass
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.url.getRotaryTeachers.path,
            params: {},
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize,
          }
        }
        this.setTableData();
      },

      search() {
        this.setTableData();
      },

      setTableData(isLoading) {
        this.listMessTitle.ajaxParams.params = Object.assign(this.$util._.defaultsDeep({}, this.searchObj),
          this.queryQptions.params);
        this.ajax(this.listMessTitle)
      },
      //选择老师
      selectTeachers() {
        this.$emit('setUsers', this.multipleSelection || [])
      },
      //
      updateListData(res) {
        let data = res.data || [];
        this.tableData = this.addIndex(data || []);
        this.totalCount = res.totalCount || 0;

      },

      /*
      * checkbox 选择后触发事件
      * @param val Array 存在所有的选择每一个行数据
      */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      //取消
      cancel() {
        this.$emit('cancel');
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
