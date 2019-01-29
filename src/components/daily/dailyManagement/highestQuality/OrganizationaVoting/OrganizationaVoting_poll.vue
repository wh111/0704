<!--投票结果-->
<template>
  <div id="nosocomial" ref="nosocomial" class="modal">
    <div>
      <el-row>
        <el-col align="center">
          <h3>{{showData.title}}</h3>
        </el-col>
      </el-row>
    </div>
    <div class="add-remove">
      <el-row>
        <el-col :span="6">
          <el-button class="but-col" type="primary" @click="derive">导出excel</el-button>
        </el-col>
      </el-row>
    </div>
    <div id="nosocomialTable" ref="nosocomialTable">
      <el-table align="center" :height="300" :data="showData.voteResultList" tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column label="序号" type="index" width="70"></el-table-column>
        <el-table-column prop="userName" label="姓名" align="center" width="200" show-overflow-tooltip>
          <template scope="scope">
            <el-button type="text" size="small" @click="show(scope.row)">{{scope.row.userName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="voteNum" label="得票数" align="center" show-overflow-tooltip>
          <template scope="scope">
            <el-popover trigger="hover" @show="showItem(scope.row)" placement="top">
              <p>投票人: {{ nameList.join('、') }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag>{{scope.row.voteNum || '0'}}</el-tag>
              </div>
            </el-popover>

          </template>
        </el-table-column>
        <el-table-column prop="rewardDate" label="得票率 " show-overflow-tooltip>
          <template scope="scope">
            <!--得票率-->
            <el-progress :text-inside="true" :stroke-width="18"
                         :percentage="scope.row.voteNum ? (( parseInt(scope.row.voteNum / showData.totalNum) * 100)==(scope.row.voteNum / showData.totalNum) * 100? ((scope.row.voteNum / showData.totalNum) * 100) :( (scope.row.voteNum / showData.totalNum) * 100).toFixed(2)): 0"></el-progress>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--姓名弹窗-->
    <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal"
           :width="800">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="showId"></modal-header>
      <show v-if="showModal" :operaility-data="pollOperailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal"
           class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="excelExportUrl">
              <el-button @click="affirmDerive" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click=" deriveModal=false">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  /*
   * 引入--查看--组件
   * */
  import show from './OrganizationaVoting_poll_view.vue'
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        nameList: [],
        showData: {
          "title": "",
          "voteResultList": [],
          "totalNum": 0
        },
        deriveId: {
          id: 'deriveId',
          title: '导出'
        },
        showId: {
          id: 'auditId',
          title: '查看'
        },
        deriveModal: false,
        pollOperailityData: '',
        showModal: false,
        multipleSelection: [],
        tableData1: [],
        listMessTitle: {
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: {
            url: 'appraising/vote/project/getResult/' + this.operailityData.id,
            params: {}
          }
        },
        excelExportUrl: '',
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
            pageSize: Util.pageInitPrams.pageSize
          }
        }
        this.setTableData();
      },
      //导出
      derive() {
        this.excelExportUrl = '/api/appraising/vote/project/excelExport?id=' + this.operailityData.id;
        this.openModel('derive');
      },
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      //展示投票人
      showItem(data) {
        if (data.voteNum != 0) {
          this.ajax({
            ajaxSuccess: 'getItemSuccess',
            ajaxParams: {
              url: '/appraising/vote/project/getVoteResult/' + this.operailityData.id,
              params: {
                userId: data.userId,
              }
            }
          })
        } else {
          this.nameList = ['暂无']
        }
      },
      getItemSuccess(res) {
        var that = this;
        that.nameList = [];
        res.data.map(function (item) {
          that.nameList.push(item.voterName);
        })

      },
      /*
      * 打开指定的模态窗体
      * @param options string 当前指定的模态:"add"、"edit"
      * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      /*
       *点击姓名，查看信息
       *
       * */
      show(data) {
        this.pollOperailityData = data
        this.showModal = true;
      },

      //通过get请求列表数据
      listDataSuccess(res, m, loading) {
        this.showData.title = res.data.title;
        this.showData.voteResultList = res.data.voteResultList;
        let sum = 0;
        res.data.voteResultList.map(item => sum += (+item.voteNum));
        this.showData.totalNum = sum;
      },
      setTableData(isLoading) {
        this.ajax(this.listMessTitle, isLoading)
      },
      //确定导出
      affirmDerive() {
        this.cancel('derive');
      },
    },
    created() {
      this.init();
    },
    components: {
      show
    }
  }

</script>

