<!--评优项目管理-->

<template>
  <div id="nosocomial" ref="nosocomial" class="modal">
    <div class="add-remove">
      <el-row>
        <el-col>
          参投人数：
          <span class="show-count">{{data.totalNum}}</span>人 &nbsp; &nbsp; &nbsp; 已投人数：
          <span class="show-count">{{data.voteNum}}</span>人 &nbsp; &nbsp; &nbsp; 未投人数：
          <span class="show-count">{{data.noVoteNum}}</span>人 &nbsp; &nbsp; &nbsp;
        </el-col>
      </el-row>
    </div>
    <div id="nosocomialTable" ref="nosocomialTable">
      <el-table align="center" :height="400" :data="data.voteRecordList" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange">

        <el-table-column label="序号" type="index" width="70">
        </el-table-column>
        <el-table-column prop="userName" label="投票人" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="voteTime" label="投票时间 " show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="isVote" label="是否投票 " show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.isVote | typeText }}
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
  //当前组件引入全局的util
  let Util = null;
  let store = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        "data": {
          "totalNum": "", //总人数
          "voteNum": "", //投票人数
          "noVoteNum": "", //未投票人数
          "voteRecordList": []
        },

        multipleSelection: [],
        tableData: [],
        listMessTitle: {
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: {
            url: 'appraising/vote/project/record/get/' + this.operailityData.id,
            params: {}
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

        this.setTableData();
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected(isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess("请选择数据!");
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },

      /*
       *点击姓名，查看信息
       *
       * */
      show() {
        this.showModal = true;
      },

      //通过get请求列表数据
      listDataSuccess(res, m, loading) {
        this.data = res.data;
      },
      setTableData(isLoading) {
        this.ajax(this.listMessTitle, isLoading)
      },
    },
    created() {
      this.init();
    },
  }
</script>
