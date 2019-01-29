<template>
  <!-- 出科申请 - 带教老师 -->
  <div>
    <el-row class="givenTheApplicationView">
      <el-form>
        <el-col :span="10" :offset="2">
          <el-form-item label="姓名：">{{ viewData.userName }}</el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="科室：">{{ viewData.depName }}</el-form-item>
        </el-col>
        <!--<el-col :span="20" :offset="2">-->
        <!--<el-form-item label="考勤：">-->
        <!--<span>旷工 {{ viewData.minerDays || 0 }} 天，</span>-->
        <!--<span>病假 {{ viewData.sickDays || 0 }} 天，</span>-->
        <!--<span>事假 {{ viewData.personalDays || 0 }} 天</span>-->
        <!--</el-form-item>-->
        <!--</el-col>-->

        <!--<el-col :span="20" :offset="2">-->
        <!--<el-form-item label="奖惩情况：">-->
        <!--<span>奖励 {{ viewData.rewardNum || 0 }} 次，</span>-->
        <!--<span>惩罚 {{ viewData.penaltyNum || 0 }} 次</span>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="20" :offset="2">
          <el-form-item label="老师评价：">{{ viewData.teacherEvaluation || '暂无' }}</el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-table :data="viewDayData">
            <el-table-column label="旷工" prop="minerDays">
              <template scope="scope">
                {{ scope.row.minerDays || 0 }} 天
              </template>
            </el-table-column>
            <el-table-column label="病假" prop="sickDays">
              <template scope="scope">
                {{ scope.row.sickDays || 0 }} 天
              </template>
            </el-table-column>
            <el-table-column label="事假" prop="personalDays">
              <template scope="scope">
                {{ scope.row.personalDays || 0 }} 天
              </template>
            </el-table-column>
            <el-table-column label="奖励" prop="rewardNum">
              <template scope="scope">
                {{ scope.row.rewardNum || 0 }} 次
              </template>
            </el-table-column>
            <el-table-column label="惩罚" prop="penaltyNum">
              <template scope="scope">
                {{ scope.row.penaltyNum || 0 }} 次
              </template>
            </el-table-column>
          </el-table>
        </el-col>

        <el-col :span="20" :offset="2">
          <h4>轮转要求统计：</h4>
          <el-table align="center" :context="self" :data="rotaryRequirStatic" tooltip-effect="dark">
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="要求数量" prop="yqnum" show-overflow-tooltip></el-table-column>
            <el-table-column label="已完成数量" prop="ywcnum" show-overflow-tooltip></el-table-column>
            <el-table-column label="完成比例" prop="wcbl" show-overflow-tooltip></el-table-column>
          </el-table>
        </el-col>

        <!--<el-col :span="20" :offset="2">-->
        <!--<h4>轮转记录填写：</h4>-->
        <!--<el-table align="center" :context="self" :data="viewData.depRequired" tooltip-effect="dark">-->
        <!--<el-table-column label="名称" prop="requiredName"></el-table-column>-->
        <!--<el-table-column label="要求例数" prop="requiredNum" show-overflow-tooltip></el-table-column>-->
        <!--<el-table-column label="实填例数" prop="userNum" show-overflow-tooltip></el-table-column>-->
        <!--</el-table>-->
        <!--</el-col>-->
        <el-col :span="20" :offset="2">
          <h4>出科成绩：</h4>
          <table class="el-table">
            <thead>
            <tr>
              <th>
                <div class="cell">名称</div>
              </th>
              <th>
                <div class="cell">成绩</div>
              </th>
              <th>
                <div class="cell">是否补考</div>
              </th>
              <th>
                <div class="cell"></div>
              </th>
              <th>
                <div class="cell"></div>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr class="el-table__row">
              <td>
                <div class="cell">理论考核</div>
              </td>
              <td>
                <div class="cell">{{ viewData.theoryExamScore }}</div>
              </td>
              <td>
                <div class="cell">{{ (viewData.theoryExamScore != null ? viewData.theoryExamIsMakeup : '--') | isNeed
                  }}
                </div>
              </td>
              <td>
                <div class="cell">
                  {{viewData.examName}}
                </div>
              </td>
              <td>
                <div class="cell">
                  <el-button @click="examChange">更换试卷</el-button>
                </div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td>
                <div class="cell">技能考核</div>
              </td>
              <td>
                <div class="cell">{{ viewData.skillExamScore }}</div>
              </td>
              <td>
                <div class="cell">{{ (viewData.skillExamScore != null ? viewData.skillExamIsMakeup : '--') | isNeed }}
                </div>
              </td>
              <td>
                <div class="cell">
                </div>
              </td>
              <td>
                <div class="cell">
                </div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td>
                <div class="cell">日常考核</div>
              </td>
              <td>
                <div class="cell">{{ viewData.dailyExamScore }}</div>
              </td>
              <td>
                <div class="cell">--</div>
              </td>
              <td>
                <div class="cell">
                </div>
              </td>
              <td>
                <div class="cell">
                </div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td>
                <div class="cell">综合成绩</div>
              </td>
              <td>
                <div class="cell">{{ viewData.coligateScore }}</div>
              </td>
              <td>
                <div class="cell">--</div>
              </td>
              <td>
                <div class="cell">
                </div>
              </td>
              <td>
                <div class="cell">
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </el-col>

        <el-col :span="20" :offset="2">
          <h4>个人小结：</h4>
          {{ viewData.userSummary }}
        </el-col>
        <el-col :span="20" :offset="2">
          <h4>小结附件：</h4>
          <uploadFile :uploadFiles="studentUploadFiles" :show="true"></uploadFile>
        </el-col>
        <el-col :span="20" :offset="2">
          <h4>老师评语：</h4>
          {{ viewData.teacherComment || '暂无' }}
        </el-col>
        <el-col :span="20" :offset="2">
          <h4>老师附件：</h4>
          <uploadFile :uploadFiles="teacherUploadFiles" :show="true"></uploadFile>
        </el-col>

        <el-col :span="20" :offset="2">
          <h4>科室评语：</h4>
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" :maxlength="250" placeholder="请输入内容"
                    v-model="summaryFileList.comment"></el-input>
        </el-col>
        <el-col :span="20" :offset="2">
          <h4>科室附件：</h4>
          <uploadFile @setUploadFiles="setUploadFiles" :uploadFiles="depUploadFiles"></uploadFile>
        </el-col>
        <el-col :span="20" :offset="2" style="margin-top:20px;">
          <el-form-item label="是否合格：">
            <el-radio-group v-model="summaryFileList.depQualified">
              <el-radio label="QUALIFIED">合格</el-radio>
              <el-radio label="NO_QUALIFIED">不合格</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <template v-if="summaryFileList.depQualified === 'NO_QUALIFIED'">
          <el-col :span="10" :offset="2">
            <el-form-item label="是否需要补轮转：">
              <el-radio class="radio" v-model="summaryFileList.isMakeupRotary" :label="1">是</el-radio>
              <el-radio class="radio" v-model="summaryFileList.isMakeupRotary" :label="0">否</el-radio>
            </el-form-item>
          </el-col>
          <!--<el-col :span="10" v-if="summaryFileList.isMakeupRotary">-->
          <!--<el-form-item label="补轮转周期：">-->
          <!--<el-input v-model="summaryFileList.makeupTs" style="width:200px;"></el-input> 周-->
          <!--</el-form-item>-->
          <!--</el-col>-->
        </template>
      </el-form>
      <div style="padding-top:16px;clear:both;">
        <el-col :span="6" :offset="6" align="center">
          <el-button @click="save('BC')" type="success">保存</el-button>
        </el-col>
        <el-col :span="6" align="center">
          <el-button @click="save('SB')" type="info">上报</el-button>
        </el-col>
      </div>
    </el-row>
    <!-- 模态框 更换试卷 -->
    <Modal :mask-closable="false" v-model="examModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="examId"></modal-header>
      <selectExam :url="url" v-if="examModal" :tempId="viewData.historyMarkId" @cancel=" this.examModal=false; "
                  :userId="viewData.userId" :outDepId="operailityData.depExaminationId"
                  @exam="selectExamBack"></selectExam>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import api from '../api';
  import uploadFile from '../../../../../components/common/uploadFile';
  import selectExam from '../givenAudit_selectExam.vue'//更换试卷
  export default {
    props: ['operailityData', 'userType'],
    data() {
      return {
        url: api,
        self: this,
        viewDayData: [{ // 出勤、奖惩情况
          minerDays: '',
          sickDays: '',
          personalDays: '',
          rewardNum: '',
          penaltyNum: '',
        }],
        rotaryRequirStatic: [], // 轮转要求统计
        viewData: {},
        summaryFileList: {
          fileIds: '',
          comment: '',
          depQualified: "QUALIFIED", // 是否合格 QUALIFIED合格|NO_QUALIFIED不合格
          isMakeupRotary: 0, // 是否需要补轮转 0不需要|1需要
          makeupTs: 1, // 轮转周期
          czType: '',
        },
        studentUploadFiles: [], // 学生附件
        teacherUploadFiles: [], // 老师附件
        depUploadFiles: [], // 科室附件
        // 学生类型
        studentType: 'SXS', // 默认实习生
        depRequirement: [],
        examModal: false,
        examId: {
          id: 'examId',
          title: '更换试卷'
        },
      }
    },
    methods: {
      // 初始化
      init() {
        if (this.userType) {
          this.studentType = this.userType;
        }
        this.getViewData();
      },

      // 获取出勤比例
      getRotaryStuAbsenteeismRate() {
        this.ajax({
          ajaxSuccess: res => {
            // 如果轮转出勤比例大于设置的轮转比例数的则默认需要补轮转
            if ((this.viewData.attendanceRate || 0) > +(res.data.configValue ? res.data.configValue : 20)) {
              this.summaryFileList.isMakeupRotary = 1;
              this.summaryFileList.depQualified = 'NO_QUALIFIED';
            }
          },
          ajaxParams: {
            url: api.getConfig.path + 'rotary_stu_absenteeism_rate-' + this.studentType,
            method: api.getConfig.method
          }
        })
      },

      // 转要求统计
      getRotaryRequirStatic() {
        let name = {
          sscz: '手术操作',
          jnys: '技能演示',
          bltl: '病例讨论',
          klxjz: '科内小讲座',
          jxcf: '教学查房',
          dbl: '大病历',
          jn: '技能',
          bz: '病种',
        };
        let opt = {
          ajaxSuccess: res => {
            if (res.data) {
              let temp = [];
              this.$util._.map(res.data, (val, key) => {
                val.key = key;
                val.name = name[key];
                temp.push(val)
              })
              this.rotaryRequirStatic = temp;
            }
          },
          ajaxParams: {
            url: api.getRotaryRequirStatic.path + (this.viewData.podId || this.operailityData.podId),
            method: api.getRotaryRequirStatic.method,
            params: {state: 'PASS'},
          }
        };
        this.ajax(opt)
      },
      // 获取试卷名称
      getMork(id) {
        let opt = {
          ajaxSuccess: res => {
            let data = res.data;
            if (!data) return;
            this.viewData.examName = data.paperName;
          },
          ajaxParams: {
            url: api.markGet.path + id,
            method: api.markGet.method
          }
        };
        this.ajax(opt)
      },

      // 获取预览数据
      getViewData() {
        this.ajax({
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: api.get.path + this.operailityData.depExaminationId,
            method: api.get.method
          }
        })
      },

      // 获取数据成功
      getDataSuccess(res) {
        let fileIds = [];
        if (res.data.historyMarkId) {
          this.getMork(res.data.historyMarkId);//获取试卷名称
        }
        this.viewData = res.data;

        for (let key in this.viewDayData[0]) {
          this.viewDayData[0][key] = this.viewData[key] || '';
        }

        this.summaryFileList.comment = res.data.depComment;
        this.summaryFileList.depQualified = res.data.depQualified || "QUALIFIED";
        this.summaryFileList.isMakeupRotary = res.data.isMakeupRotary || 0;
        this.summaryFileList.makeupTs = res.data.makeupTs;
        this.studentUploadFiles.length = 0;
        this.teacherUploadFiles.length = 0;
        this.depUploadFiles.length = 0;
        // 学生附件
        (res.data.summaryFileList || []).map(item => {
          this.studentUploadFiles.push({
            fileId: item.id,
            fileName: item.fileName,
            filePath: '/api/file/download/' + item.id
          })
        });
        // 老师附件
        (res.data.teacherCommentFileList || []).map(item => {
          this.teacherUploadFiles.push({
            fileId: item.id,
            fileName: item.fileName,
            filePath: '/api/file/download/' + item.id
          })
        });
        // 科室附件
        (res.data.depCommentFileList || []).map(item => {
          fileIds.push(item.id);
          this.depUploadFiles.push({
            fileId: item.id,
            fileName: item.fileName,
            filePath: '/api/file/download/' + item.id
          })
        });

        this.summaryFileList.fileIds = fileIds.join(',');

        this.getRotaryRequirStatic();

        // 首次审核则获取该生的轮转缺勤比例来初始化是否出科合格及是否需要补轮转
        if (!res.data.depQualified) {
          this.getRotaryStuAbsenteeismRate();
        }


        if (this.studentType === 'SXS') {
          this.operailityData.podId && this.getDepRequirementBySXS()
        } else {
          this.operailityData.podId && this.getDepRequirement();
        }
      },

      // 获取实习生查看的轮转记录填写
      getDepRequirementBySXS() {
        this.ajax({
          ajaxSuccess: res => this.depRequirement = res.data || [],
          ajaxParams: {
            url: api.getDepRequirementBySXS.path + '--' + this.operailityData.podId,
            method: api.getDepRequirementBySXS.method
          }
        })
      },
      // 获取非实习生查看的轮转记录填写
      getDepRequirement() {
        this.ajax({
          ajaxSuccess: res => this.depRequirement = res.data || [],
          ajaxParams: {
            url: api.getDepRequirement.path + '__' + this.operailityData.podId,
            method: api.getDepRequirement.method
          }
        })
      },

      // 上传附件
      setUploadFiles(ids) {
        this.summaryFileList.fileIds = ids;
      },

      // 确定
      save(type) {
        let msg = type === 'BC' ? '保存' : '上报';
        this.summaryFileList.czType = type;
        this.ajax({
          ajaxSuccess: () => this.$emit('rotary', 'rotary', msg + '成功'),
          ajaxParams: {
            url: api.depAddComment.path + this.operailityData.depExaminationId,
            method: api.depAddComment.method,
            data: this.summaryFileList,
          }
        })
      },

      // 取消
      cancel() {
        this.$emit('cancel', 'rotary')
      },

      //更换试卷
      examChange() {
        this.examModal = true;
      },

      //选择试卷的回调函数
      selectExamBack(item) {
        this.viewData.historyMarkId = item.id;
        this.viewData.examName = item.paperName;
        this.viewData.theoryExamScore = item.mark;
        this.examModal = false;
      },

    },
    components: {
      uploadFile, selectExam
    },
    created() {
      this.init()
    },
  }

</script>

<style lang="scss">
  /* 出科申请 */

  .givenTheApplicationView {
    h4 {
      margin: 20px 0;
    }
  }

</style>
