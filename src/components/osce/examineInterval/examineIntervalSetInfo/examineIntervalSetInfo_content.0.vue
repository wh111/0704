<template>
  <div>
    <el-row style="margin:20px 0;">
      <el-col align="right">
        <el-button type="primary" @click="addContent">添加考核内容</el-button>
      </el-col>
    </el-row>
    <el-table align="center" :context="self" :data="tableData" tooltip-effect="dark"
              class="tableShowMoreInfo spSelectTime" style="width: 100%;">
      <template v-if="stationType === 'THEORY'">
        <el-table-column label="考核内容名称" prop="contentName" show-overflow-tooltip>
          <template scope="scope">
            <el-input v-model="scope.row.contentName" :maxlength="20"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="试题数量" width="180" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.paperContentList.length || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="试题总分" width="180" show-overflow-tooltip>
          <template scope="scope">
            <template v-if="scope.row.paperContentList.length">
              {{ getPaperContentScore(scope.row.paperContentList) }}
            </template>
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>
      </template>
      <template v-else>
        <el-table-column label="考核2内容名称" width="180" prop="contentName" show-overflow-tooltip>
          <template scope="scope">
            <el-input v-model="scope.row.contentName" :maxlength="20"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="评分表" prop="scoreTableName" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.scoreTableName || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="病例" prop="caseName" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.caseName || '-' }}
          </template>
        </el-table-column>
        <template v-if="stationType === 'SP'">
          <el-table-column label="剧本" prop="scriptName" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.scriptName || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="SP评分表" prop="spScoreTableName" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.spScoreTableName || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="考核时间" prop="timeCount" width="110">
            <template scope="scope">
              <el-select v-if="sceneType === 'STANDARD'" v-model="scope.row.timeCount" placeholder="请选择">
                <el-option v-for="item in 10" :key="item" :label="Number((item * basicsTime).toFixed(1))" :value="item">
                </el-option>
              </el-select>
              <el-input v-else v-model.number="scope.row.timeCount" :maxlength="3"></el-input>
            </template>
          </el-table-column>
        </template>
      </template>
      <el-table-column label="操作" width="180">
        <template scope="scope">
          <!-- 理论考试 -->
          <template v-if="stationType === 'THEORY'">
            <el-button size="mini" type="success" style="margin-left:0;margin-right:10px;"
                       @click="editPaperContent(scope.$index)">编辑
            </el-button>
            <el-button size="mini" type="info" style="margin-left:0;margin-right:10px;"
                       :disabled="!scope.row.paperContentList.length"
                       @click="viewPaperContent(scope.$index)">预览
            </el-button>
            <el-button size="mini" type="danger" style="margin-left:0;" @click="removeContent(scope.$index)">删除
            </el-button>
          </template>
          <!-- 非理论考试 -->
          <template v-else>
            <el-button size="mini" type="success" style="margin-left:0;margin-right:10px;"
                       @click="openSelectCase(scope.$index)">病例
            </el-button>
            <el-button size="mini" type="warning" style="margin-left:0;margin-right:10px;"
                       @click="openSelectScore(scope.$index)">评分表
            </el-button>
            <el-button size="mini" type="danger" style="margin-left:0;" @click="removeContent(scope.$index)">删除
            </el-button>
            <template v-if="stationType === 'SP'">
              <el-button size="mini" style="margin-left:0;margin-right:10px;" @click="openSelectScript(scope.$index)">
                剧本
              </el-button>
              <el-button size="mini" type="info" style="margin-left:0;margin-right:10px;"
                         @click="openSelectSPScore(scope.$index)">SP评分表
              </el-button>
            </template>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部按钮 -->
    <el-row>
      <el-col :span="8" :offset="4" align="center" style="margin-top:20px;">
        <el-button type="warning" @click="pre">上一步</el-button>
      </el-col>
      <el-col :span="8" align="center" style="margin-top:20px;">
        <el-button type="success" @click="next">下一步</el-button>
      </el-col>
    </el-row>

    <!-- 模态框 选择评分表（select） -->
    <Modal :mask-closable="false" v-model="scoreSelectModal" height="200" class-name="vertical-center-modal" :width="840">
      <modal-header slot="header" :content="headerContent.scoreSelectId"></modal-header>
      <score-select v-if="scoreSelectModal" @cancel="cancel" @select="selectScore" :is-only="false"></score-select>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 选择SP评分表（select） -->
    <Modal :mask-closable="false" v-model="spScoreSelectModal" height="200" class-name="vertical-center-modal" :width="840">
      <modal-header slot="header" :content="headerContent.spScoreSelectId"></modal-header>
      <score-select v-if="spScoreSelectModal" @cancel="spScoreSelectModal = false"
                    @select="selectSPScore"></score-select>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 选择病例表（select） -->
    <Modal :mask-closable="false" v-model="caseSelectModal" height="200" class-name="vertical-center-modal" :width="840">
      <modal-header slot="header" :content="headerContent.caseSelectId"></modal-header>
      <case-select v-if="caseSelectModal" @cancel="cancel" @select="selectCase"></case-select>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 选择剧本（select） -->
    <Modal :mask-closable="false" v-model="scriptSelectModal" height="200" class-name="vertical-center-modal" :width="840">
      <modal-header slot="header" :content="headerContent.scriptSelectId"></modal-header>
      <script-select v-if="scriptSelectModal" @cancel="cancel" @select="selectScript" :caseId="caseId"></script-select>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 理论考试试题编辑 -->
    <Modal :mask-closable="false" v-model="editPaperContentModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="headerContent.editPaperContentId"></modal-header>
      <edit-paper-content v-if="editPaperContentModal" :paperContent="tableData[row].paperContentList" @cancel="cancel" @save="savePaperContent"></edit-paper-content>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 理论考试试题预览 -->
    <Modal :mask-closable="false" v-model="viewPaperContentModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="headerContent.viewPaperContentId"></modal-header>
      <view-paper-content v-if="viewPaperContentModal" :showData="tableData[row].paperContentList" @cancel="cancel"></view-paper-content>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import scoreSelect  from '../../assessmentContent/assessmentContentScore/assessmentContentScore_select'; // 评分表
  import caseSelect   from '../../assessmentContent/assessmentContentCase/assessmentContentCase_select'; // 病例表
  import scriptSelect from '../../assessmentContent/assessmentContentScript/assessmentContentScript_select'; // 剧本选择

  import editPaperContent from './paperContent/input'; // 理论考试试题编辑
  import viewPaperContent from './paperContent/view'; // 理论考试试题预览

  export default {
    data() {
      return {
        self: this,
        sceneType: '', // 考站
        stationType: '', // 当前考站类型
        basicsTime: 1, // 考试时间基数
        caseId: 0, // 病例id
        roomInfo: {},
        tableData: [],

        scoreSelectModal: false,
        spScoreSelectModal: false,
        caseSelectModal: false,
        scriptSelectModal: false,
        editPaperContentModal: false,
        viewPaperContentModal: false,
        row: 0, // 当前操作第几行
        // 模态框顶部标识
        headerContent: {
          scoreSelectId: {
            id: 'scoreSelectId',
            title: '选择评分表'
          },
          spScoreSelectId: {
            id: 'spScoreSelectId',
            title: '选择SP评分表'
          },
          caseSelectId: {
            id: 'caseSelectId',
            title: '选择病例表'
          },
          scriptSelectId: {
            id: 'scriptSelectId',
            title: '选择剧本'
          },
          editPaperContentId: {
            id: 'editPaperContentId',
            title: '编辑试题'
          },
          viewPaperContentId: {
            id: 'viewPaperContentId',
            title: '试题预览'
          }
        }
      }
    },
    methods: {
      // 上一步
      pre() {
        this.$emit('goStep', 1)
      },
      // 下一步
      next() {
        if (!this.checkData()) return;
        if (this.stationType === 'SP') {
          // 计算时间
          let count = 0;
          for (let i = 0, d = this.tableData, l = d.length; i < l; i++) {
            count += d[i].timeCount;
          }
          this.roomInfo.timeCount = count;
        }
        this.$emit('goStep', 3);
      },
      /********************** 数据校验 **********************/
      checkData() {
        // 是否有考核内容
        if (this.tableData.length < 1) {
          this.errorMess('至少添加一条考核内容！')
          return false
        }
        // 考核内容名称必须填写
        for (let i = 0, d = this.tableData, l = d.length; i < l; i++) {
          if (!d[i].contentName) {
            this.errorMess(`第 ${i + 1} 行考核内容名称必须填写！`)
            return false
          }
        }

        for (let i = 0, list = this.tableData, l = list.length; i < l; i++) {
          if (this.stationType == 'THEORY') { // 理论考核
            if (!list[i].paperContentList.length) {
              this.errorMess(`第 ${i + 1} 行考核内容至少要有1个试题！`)
              return false
            }
          } else {
            // 评分表必须选择
            if (!list[i].scoreTableId) {
              this.errorMess(`第 ${i + 1} 行评分表没有选择！`)
              return false
            }
            // 病例必须选择
            // if (!list[i].caseId) {
            //   this.errorMess(`第 ${i+1} 行病例没有选择！`)
            //   return false
            // }
            // SP考站必须选择SP评分表
            if (this.stationType == 'SP' && !list[i].spScoreTableId) {
              this.errorMess(`第 ${i + 1} 行SP评分表没有选择！`)
              return false
            }
            // SP考站必须选择剧本
            if (this.stationType == 'SP' && !list[i].scriptId) {
              this.errorMess(`第 ${i + 1} 行剧本没有选择！`)
              return false
            }
          }
        }
        return true
      },
      /********************** 考核内容 **********************/
      // 添加
      addContent() {
        this.$store.commit('examineInterval/temp/addStationContentList')
      },
      // 删除
      removeContent(index) {
        this.$store.commit('examineInterval/temp/removeStationContents', index)
      },
      // 设置教师评分表
      selectScore(res) {
        this.$store.commit('examineInterval/temp/updateStationContentList', {
          index: this.row, // 需要设置评分表的索引
          value: { // 更新键值对
            scoreTableId: res.id, // 教室评分表id
            scoreTableName: res.scoreTableName // 教师评分表名称
          }
        })
      },
      // 设置SP评分表
      selectSPScore(res) {
        this.$store.commit('examineInterval/temp/updateStationContentList', {
          index: this.row, // 需要设置sp评分表的索引
          value: { // 更新键值对
            spScoreTableId: res.id, // 教室评分表id
            spScoreTableName: res.scoreTableName // SP评分表名称
          }
        });
        this.cancel('spScoreSelect')
      },
      // 设置病例表
      selectCase(res) {
        let value = {
          caseId: res.id, // 病例id
          caseName: res.caseName // 病例名称
        };
        if (res.scoreTableId) { // 病例关联的评分表
          value.scoreTableId = res.scoreTableId;
          value.scoreTableName = res.scoreTableName;
        }
        this.$store.commit('examineInterval/temp/updateStationContentList', {
          index: this.row, // 需要设置病例的索引
          value
        })
      },
      // 设置剧本
      selectScript(res) {
        this.$store.commit('examineInterval/temp/updateStationContentList', {
          index: this.row, // 需要设置剧本的索引
          value: { // 更新键值对
            scriptId: res.id, // 病例id
            scriptName: res.scriptName // 病例名称
          }
        })
      },
      // 保存理论考试试题内容
      savePaperContent(content) {
        this.tableData[this.row].paperContentList = content;
        this.cancel('editPaperContent')
      },
      /********************* 弹窗 *****************************/
      // 打开教师评分表
      openSelectScore(index) {
        this.row = index;
        this.openModel('scoreSelect')
      },
      // 打开SP评分表
      openSelectSPScore(index) {
        this.row = index;
        this.openModel('spScoreSelect')
      },
      // 打开病例表
      openSelectCase(index) {
        this.row = index;
        this.openModel('caseSelect')
      },
      // 打开剧本
      openSelectScript(index) {
        let thisRow = this.tableData[index];
        this.row = index;
        if (!thisRow.caseId) {
          this.showMess("请先选择病例!");
          return;
        }
        this.caseId = thisRow.caseId;

        this.openModel('scriptSelect')
      },
      // 编辑试题内容（理论考试使用）
      editPaperContent(index) {
        this.row = index;

        this.openModel('editPaperContent')
      },
      // 预览试题内容（理论考试使用）
      viewPaperContent(index) {
        this.row = index;
        this.openModel('viewPaperContent')
      },
      // 获取每项理论考核的分数
      getPaperContentScore(row) {
        let sum = 0;
        row.map(item => sum += +item.optionScore);
        return sum
      },
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      }
    },
    components: {
      scoreSelect,
      caseSelect,
      scriptSelect,
      editPaperContent,
      viewPaperContent
    },
    created() {
      this.roomInfo = this.$store.state.examineInterval.temp.info;
      this.tableData = this.$store.state.examineInterval.temp.info.stationContentList;
      this.sceneType = this.$store.state.examineInterval.station.info.sceneType; // 当前考站类型
      this.stationType = this.$store.state.examineInterval.temp.info.stationType; // 当前考站类型
      this.basicsTime = this.$store.state.examineInterval.station.info.basicsTime; // 考试时间基数
    }
  }

</script>

<style>
  .spSelectTime .el-select .el-input {
    width: 100%;
  }

</style>
