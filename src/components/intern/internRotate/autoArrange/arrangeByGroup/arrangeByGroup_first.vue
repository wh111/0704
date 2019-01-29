<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2018/7/2
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-form ref="formValidate" inline label-width="60px">
      <el-row style="margin-bottom:0">
        <!--搜索项-->
        <el-col :span="24">
          <el-form-item label="学校：">
            <el-select v-model="formValidate.schoolId" style="width:300px;" multiple clearable filterable
                       placeholder="请选择" @change="schoolChange">
              <select-option unAll="true" :url="api.schools.path"></select-option>
            </el-select>
          </el-form-item>
          <el-form-item label="大纲：">
            <el-select v-model="formValidate.outlineId" style="width:300px;" multiple clearable filterable
                       placeholder="请选择">
              <el-option
                v-for="(item,index) in dgData"
                :key="index"
                :label="item.outlineName"
                :value="item.outlineId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="info" @click="search">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div
      id="myTable"
      ref="myTable"
    >
      <el-table
        stripe
        align="center"
        :height="400"
        :data="tableData"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%;height: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="75">
        </el-table-column>
        <el-table-column
          prop="groupName"
          label="小组名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="schoolName"
          label="学校"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="groupIndexName"
          label="轮转顺序"
          width="160"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../../../internRotate/api.js';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        api,
        formValidate: {
          schoolId: [],
          specialty: '',
          outlineId: [],
        },
        tableData: [],
        multipleSelection: [],
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.getDepGroupNoReleaseUser.path,
            params: {}
          }
        },
        //获取的大纲集合 outlineId 为key
        getDgBySpecialty: {},
        //学校专业对应大纲
        dgData: [],
        getDgBySchoolId: {
          ajaxSuccess: 'getDgData',
          ajaxParams: {
            url: api.schoolGetDg.path,
            params: {}
          }
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        this.setTableData();
      },

      updateListData (res) {
        let data = res.data;
        if (!data) data = []
        this.tableData = data;
      },
      search () {
        this.setTableData()
      },
      setTableData () {
        this.listMessTitle.ajaxParams.params = {
          schoolId: this.formValidate.schoolId.join(),
          specialty: '',
          outlineId: this.formValidate.outlineId.join(),
        }
        this.ajax(this.listMessTitle);
      },
      /*
        * checkbox 选择后触发事件
        * @param val Array 存在所有的选择每一个行数据
        */
      handleSelectionChange (val) {
        this.multipleSelection = val;
      },

      //改变学校
      schoolChange (val) {
        let ids = val.reduce((arr, item) => {
          arr.push(item)
          return arr;
        }, [])
        if (ids == 0) {
          this.clearn();
          return;
        }
        let option = this.$util._.defaultsDeep({}, this.getDgBySchoolId);
        option.ajaxParams.url += '/2' //+ ids.join()
        this.ajax(option);
        this.clearn();
      },

      //清除数据
      clearn () {
        this.getDgBySpecialty = {};
        this.dgData = [];
        this.formValidate.outlineId = [];
      },

      //根据学校id获取专业对应大纲
      getDgData (responseData) {
        let data = responseData.data;
        this.dgData = data || [];
        let getDgBySpecialty = {};
        data.map(item => {
          getDgBySpecialty[item.outlineId] = item;
        })
        this.getDgBySpecialty = getDgBySpecialty
      },

      //设置表格及分页的位置
      setTableDynHeight () {
//        let content = this.$refs.content;
//        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 25;
        console.log(myTable);
        this.dynamicHt = 500 - myTable.offsetTop - paginationHt;
      },

      //获取子组件的信息
      parentGetData () {
        if (this.multipleSelection == 0) {
          this.errorMess('请选择小组');
          return;
        }
        return {
          'groups': this.multipleSelection
        }
      }

    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  }
</script>
