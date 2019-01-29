<template>
  <!-- 考生考核表信息 -->
  <div class="modalContent">
    <div class="leftCon">
      <img :src="getPhotoPath(studentData.userPhotoPath)" onerror="javascript:this.src='/static/image/defAvatar.png';">
      <p class="infoItem bottom">考生姓名：{{ studentData.userName || '-' }}</p>
      <p class="infoItem bottom">总分：{{ studentData.sumMark || '0'}}</p>
      <p class="infoItem bottom">排名：{{ studentData.ranking || '0'}}</p>
      <p class="infoItem">标准分：{{ studentData.standMark || '0'}}</p>
    </div>
    <div class="contentMain">
      <el-row>
        <el-col :span="8">
          <template v-if="showPrintScore">
            <el-button type="info" @click="deriveScore" style="margin: 10px">{{ 'export' | sysLan }}评分表</el-button>
            <el-button type="info" @click="printScore" style="margin: 10px">{{ 'print' | sysLan }}评分表</el-button>
          </template>
          <span v-else>&nbsp;</span>
        </el-col>
        <el-col :span="16">
          <el-form :inline="true" align="right">
            <el-form-item label="考站名称：" style="margin:10px 10px 10px 0;">
              <el-input v-model="listFilterData.stationName" placeholder="输入考站名称进行筛选"></el-input>
            </el-form-item>
            <el-form-item label="内容名称：" style="margin:10px 0;">
              <el-input v-model="listFilterData.contentName" placeholder="输入内容名称进行筛选"></el-input>
            </el-form-item>
            <!--<el-button style="margin:10px 0;" type="info" @click="">筛选</el-button>-->
          </el-form>
        </el-col>
      </el-row>
      <el-table align="center" :height="dynamicHt" :context="self" :data="filterMarkList()" tooltip-effect="dark" class="tableShowMoreInfo"
                @selection-change="handleSelectionChange"
                style="width: 100%;">
        <el-table-column type="selection" width="55" :selectable="canPrintScore"></el-table-column>
        <el-table-column label="操作" width="160">
          <template scope="scope">
            <el-button size="small" type="success" :disabled="!scope.row.markId" @click="showInfo(scope.row)">详情</el-button>
            <el-button size="small" type="info" :disabled="!scope.row.markId" @click="downVideo(scope.row)">下载监控</el-button>
          </template>
        </el-table-column>
        <el-table-column label="分站名称" prop="stationName" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.stationName || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="考核内容" prop="contentName" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.contentName || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="最终得分" prop="totalMark" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.totalMark || '0' }}
          </template>
        </el-table-column>
        <el-table-column label="最高分" width="120" prop="maxMark" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.maxMark || '0' }}
          </template>
        </el-table-column>
        <el-table-column label="最低分" width="120" prop="minMark" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.minMark || '0' }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 考生信息 -->
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="studentInfoModal" height="200" title="对话框标题" class-name="vertical-center-modal" :loading="true"
           :width="1200" @on-cancel="cancel">
      <modal-header slot="header" :parent="self" :content="contentHeader.studentInfoId"></modal-header>

      <student-info v-if="studentInfoModal" @cancel="cancel" @edit="subCallback" :sceneId="sceneId" :studentId="userId" :markId="markId"
                    :stationId="stationId" :arrangementId="arrangementId"></student-info>
      <div slot="footer"></div>
    </Modal>
    <!--导出弹窗-->
    <Modal :mask-closable="false" height="200" v-model="deriveModal" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="contentHeader.deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗？</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="exportUrl">
              <el-button @click="cancel('derive')" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="cancel('derive')">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!--打印弹窗-->
    <Modal :mask-closable="false" v-model="printDataModal" height="200" class-name="vertical-center-modal"
           :width="1100">
      <modal-header slot="header" :parent="self" :content="contentHeader.printDataId"></modal-header>
      <print-data v-if="printDataModal" @cancel="cancel" @print="printDone">
        <print-score :printData="printData"></print-score>
      </print-data>
      <div slot="footer"></div>
    </Modal>
    <download-examine-video :operailityData="operailityData" @cancel="downloadExamine=false" v-if="downloadExamine"></download-examine-video>
  </div>
</template>

<script>
  let Util = null;

  import api from './api';
  import studentInfo from './scoreQuery_studentInfo';
  import printData from '../../../components/common/print.vue';
  import printScore from './scoreQuery_printScore';
  import DownloadExamineVideo from '../../common/downloadExamineVideo';

  export default {
    props: ['userId', 'sceneId'],
    data () {
      return {
        self: this,
        markId: 0,
        stationId: 0,
        arrangementId: 0,
        dynamicHt: 400,
        printDataModal: false,
        studentInfoModal: false,
        deriveModal: false,
        exportUrl: '',
        multipleSelection: [],
        downloadExamine: false,
        operailityData: null,
        listFilterData: {
          stationName: '',
          contentName: ''
        },
        totalCount: 0,
        studentData: {},
        contentHeader: {
          studentInfoId: {
            id: 'studentInfoId',
            title: '考生分数详情'
          },
          deriveId: {
            id: 'deriveId',
            title: '导出评分表'
          },
          printDataId: {
            id: 'printDataId',
            title: '打印评分表'
          }
        },
        printData: [],
        showPrintScore: false
      };
    },
    methods: {
      /************************** 基本逻辑 ******************************/
      init () {
        Util = this.$util;

        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.examUserGet.path + '/' + this.userId,
          method: api.examUserGet.method,
          params: {}
        };
        this.setTableData();
      },
      handleSelectionChange (val) {
        this.multipleSelection = val;
      },
      // 下载监控
      downVideo (obj) {
        let {arrangementId: id, stationName: sceneName} = obj;
        this.operailityData = {id, sceneName};
        this.downloadExamine = true;
      },
      /************************* 表格逻辑 *********************************/
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData () {
        Object.assign(this.queryQptions.params, {
          id: this.userId,
          sceneId: this.sceneId
        });
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        });
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        if (res.data) {
          this.totalCount = res.totalCount;
          this.studentData = res.data;
          this.showPrintScore = ((res.data.markList instanceof Array) ? res.data.markList : []).some(item => ['ORDINARY', 'SP'].includes(item.stationType));
        }
      },
      // 筛选
      filterMarkList () {
        let arr = [];
        if (!this.listFilterData.stationName && !this.listFilterData.contentName) {
          arr = this.studentData.markList;
        } else {
          let markList = this.studentData.markList;
          markList && markList.map(item => {
            if ((item.stationName.indexOf(this.listFilterData.stationName) > -1) && (item.contentName && item.contentName.indexOf(this.listFilterData.contentName) > -1)) {
              arr.push(item);
            }
          });
        }
        return arr;
      },
      // 查看更多信息
      showInfo (row) {
        this.markId = row.markId;
        this.stationId = row.stationId;
        this.arrangementId = row.arrangementId;
        this.openModel('studentInfo');
      },
      canPrintScore (row) {
        return !!row.markId || !['ORDINARY', 'SP'].includes(row.stationType);
      },
      // 获取打印的评分表
      getAllScoreTable (stationIds, callFun) {
        let opt = {
          ajaxSuccess: res => callFun(res),
          ajaxParams: {
            url: api.stationAllScoreTable.path,
            method: api.stationAllScoreTable.method,
            params: {
              sceneId: this.sceneId,
              userId: this.userId,
              stationIds
            }
          }
        };
        this.ajax(opt);
      },
      // 打印评分表
      printScore () {
        let stationIds = [];
        if (!this.multipleSelection || !this.multipleSelection.length) {
          this.errorMess('请选要打印的评分表');
          return false;
        }
        this.multipleSelection.map(item => stationIds.push(item.stationId));

        this.getAllScoreTable(stationIds.join(','), res => {
          this.printData = res.data;
          this.openModel('printData');
        });
      },
      // 打印完成
      printDone () {
        this.cancel('printData');
        this.printData = null;
      },
      // 导出评分表
      deriveScore () {
        let stationIds = []; // 考站id字符串
        if (!this.multipleSelection || !this.multipleSelection.length) {
          this.errorMess('请选择需要导出的评分表');
          return false;
        }
        this.multipleSelection.map(item => stationIds.push(item.stationId));
        this.exportUrl = '/api/scene/examUser/station/exportWord?sceneId=' + this.sceneId + '&userId=' + this.userId + '&stationIds=' + stationIds.join(',');
        this.openModel('derive');
      },
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      // 回调
      subCallback (target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },
      // 获取头像地址
      getPhotoPath (path) {
        return path && this.$store.getters.getEnvPath.http + path || '/static/image/defAvatar.png';
      }
    },
    components: {
      DownloadExamineVideo,
      studentInfo, printScore, printData
    },
    created () {
      this.init();
    }
  };

</script>

<style lang="scss">
  $boderColor: #dfe6ec; // 边框颜色
  .modalContent {
    margin: -16px;
    margin-right: 0;
    position: relative;
    .leftCon {
      width: 25%;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      border-right: 1px solid $boderColor;
      img {
        width: 120px;
        height: 120px;
        display: block;
        margin: 10px auto;
      }
      .infoItem {
        line-height: 40px;
        padding-left: 16px;
        &.top {
          border-top: 1px solid $boderColor;
        }
        &.bottom {
          border-bottom: 1px solid $boderColor;
        }
      }
    }
    .contentMain {
      min-height: 450px;
      margin-left: 25%;
      .stationList {
        padding: 10px;
        padding-right: 0;
        overflow: hidden;
      }
    }
  }

</style>
