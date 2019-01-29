<template>
  <!-- 列表数据 -->
  <div ref="dataList">
    <el-row style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #dfe6ec;">
      <el-col :span="22" align="center">
        <h2 style="line-height:30px;">{{ stitle || '-' }}</h2>
      </el-col>
      <el-col :span="2" align="right">
        <el-button type="info" size="small" @click="backList">返回列表</el-button>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <div id="tableView" ref="tableView" style="padding-top:10px;">
      <div>
        <station-room v-for="(stationItem,index) in tableData" :option="{hasAdd:false,hasRemove:false}" :initData="{index:stationItem.stationId,cIndex:stationItem,name:stationItem.stationName,roomNum:stationItem.roomNum}"
          :key="index" @roomClick="showStationInfo" style="width:80px;margin-right:30px;"></station-room>
      </div>
    </div>
    <Modal :mask-closable="false" width="1100" v-model="queryStudentModal" title="考站队列设置" class-name="vertical-center-modal"
      @on-cancel="cancel">
      <modal-header slot="header" :content="contentHeader.queryStudentId"></modal-header>
      <query-student v-if="queryStudentModal" @cancel="cancel" :url="url" :stationData="stationData"></query-student>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util = null;

  import api from './api'; // api
  import stationRoom from '../examineInterval/examineInterval_room'; // 考站
  import queryStudent from './attendanceMaintenance_info'; // 查看

  export default {
    // http://218.241.184.2:9014/#!/project/api/detail?projectID=15&apiID=529
    props: ['id', 'stitle'],
    data() {
      return {
        url: api,
        stationData: '',
        dynamicHt: 100,
        queryStudentModal: false,
        tableData: [ //
          // {
          //   "sceneId": "1",
          //   "userId": "1",
          //   "userName": "李四",
          //   "userNum": "2017012012"
          // }
        ],
        contentHeader: {
          queryStudentId: {
            id: "queryStudentId",
            title: '考生信息'
          }
        }
      }
    },
    methods: {
      /************************** 基本逻辑 ******************************/
      //初始化请求列表数据
      init() {
        Util = this.$util;

        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.stationList.path + this.id,
          method: api.list.method,
        }
        this.setTableData();
      },
      /************************* 表格逻辑 *********************************/
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData() {
        this.queryQptions.url = api.stationList.path + this.id;
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        })
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.tableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight(otherHeight = 0) {
        let contenHeight = this.$refs.dataList.parentNode.parentNode.offsetHeight;
        let tableView = this.$refs.tableView;
        let paginationHt = 50 + otherHeight + 16;
        this.dynamicHt = contenHeight - tableView.offsetTop - paginationHt;
      },
      // 返回列表
      backList() {
        this.$emit('show', {
          view: 'index'
        })
      },
      /************************************** 模态框处理 **************************************************/
      // 查看
      show(id) {
        this.openModel('queryStudent')
      },
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
        this.setTableData();
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },

      //点击考站
      showStationInfo(data) {
        this.stationData = data.cIndex;
        this.openModel('queryStudent')
      },
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    components: {
      queryStudent,
      stationRoom
    },
    created() {
      this.init()
    },
    watch: {
      id(val) {
        this.setTableData()
      },
    }
  }

</script>

<style lang="scss">
  .noMarginBottom {
    .el-form-item {
      margin-bottom: 0;
    }
  }

</style>
