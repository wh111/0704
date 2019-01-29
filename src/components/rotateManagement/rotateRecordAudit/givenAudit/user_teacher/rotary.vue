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
        <!--<span>旷工 <el-input v-model="numParams.minerDays" class="numInput"></el-input> 天，</span>-->
        <!--<span>病假 <el-input v-model="numParams.sickDays" class="numInput"></el-input> 天，</span>-->
        <!--<span>事假 <el-input v-model="numParams.personalDays" class="numInput"></el-input> 天</span>-->
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

          <table class="el-table">
            <thead>
            <tr>
              <th>
                <div class="cell">旷工</div>
              </th>
              <th>
                <div class="cell">病假</div>
              </th>
              <th>
                <div class="cell">事假</div>
              </th>
              <th>
                <div class="cell">奖励</div>
              </th>
              <th>
                <div class="cell">惩罚</div>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                <div class="cell">
                  <el-input v-model="numParams.minerDays" class="numInput"></el-input>
                  天
                </div>
              </td>
              <td>
                <div class="cell">
                  <el-input v-model="numParams.sickDays" class="numInput"></el-input>
                  天
                </div>
              </td>
              <td>
                <div class="cell">
                  <el-input v-model="numParams.personalDays" class="numInput"></el-input>
                  天
                </div>
              </td>
              <td>
                <div class="cell">
                  {{ viewData.rewardNum || 0 }} 次
                </div>
              </td>
              <td>
                <div class="cell">
                  {{ viewData.penaltyNum || 0 }} 次
                </div>
              </td>
            </tr>
            </tbody>
          </table>

          <!--<el-table>-->
          <!--<el-table-column label="旷工" prop="minerDays">-->
          <!--<template>-->
          <!--<el-input v-model="numParams.minerDays" class="numInput"></el-input> 天-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="病假" prop="sickDays">-->
          <!--<template scope="scope">-->
          <!--{{ scope.row.sickDays || 0 }} 天-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="事假" prop="personalDays">-->
          <!--<template scope="scope">-->
          <!--{{ scope.row.personalDays || 0 }} 天-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="奖励" prop="rewardNum">-->
          <!--<template scope="scope">-->
          <!--{{ scope.row.rewardNum || 0 }} 次-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="惩罚" prop="penaltyNum">-->
          <!--<template scope="scope">-->
          <!--{{ scope.row.penaltyNum || 0 }} 次-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--</el-table>-->
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
                <div class="cell">
                  <el-input v-model="numParams.theoryExamScore" class="numInput"
                            @change="countColigateScore"></el-input>
                </div>
              </td>
              <td>
                <!--<div class="cell">{{ viewData.skillExamIsMakeup | isNeed }}</div>-->
                <div class="cell">--</div>
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
                <div class="cell">
                  <el-input v-model="numParams.skillExamScore" class="numInput" @change="countColigateScore"></el-input>
                </div>
              </td>
              <td>
                <!--<div class="cell">{{ viewData.skillExamIsMakeup | isNeed }}</div>-->
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
                <div class="cell">日常考核</div>
              </td>
              <td>
                <div class="cell">
                  <el-input v-model="numParams.dailyExamScore" class="numInput" @change="countColigateScore"></el-input>
                </div>
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
                <div class="cell">
                  {{ numParams.coligateScore }}
                  <!--<el-input v-model="numParams.coligateScore" class="numInput"></el-input>-->
                </div>
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

      </el-form>
      <el-col :span="20" :offset="2">
        <h4>个人小结：</h4>
        {{ viewData.userSummary || '暂无' }}
      </el-col>
      <el-col :span="20" :offset="2">
        <h4>小结附件：</h4>
        <uploadFile :uploadFiles="studentUploadFiles" :show="true"></uploadFile>
      </el-col>
      <el-col :span="20" :offset="2">
        <h4>科室评语：</h4>
        {{ viewData.depComment || '暂无' }}
      </el-col>
      <el-col :span="20" :offset="2">
        <h4>科室附件：</h4>
        <uploadFile :uploadFiles="depUploadFiles" :show="true"></uploadFile>
      </el-col>
      <el-col :span="20" :offset="2">
        <h4>老师评价：
          <el-button @click="go">去评价</el-button>
        </h4>
      </el-col>
      <el-col :span="20" :offset="2">
        <h4>老师评语：</h4>
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" :maxlength="250" placeholder="请输入内容"
                  v-model="summaryFileList.comment"></el-input>
      </el-col>
      <el-col :span="20" :offset="2">
        <h4>老师附件：</h4>
        <uploadFile @setUploadFiles="setUploadFiles" :uploadFiles="teacherUploadFiles"></uploadFile>
      </el-col>
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
        viewData: [],
        summaryFileList: {
          fileIds: '', // 附件IDs
          comment: '', // 老师评语
          czType: '', // 操作类型
        },
        numParams: { // 数字类输入，如果为空则为0
          minerDays: '', // 旷工天数
          sickDays: '', // 病假天数
          personalDays: '', // 事假天数
          theoryExamScore: '', // 理论成绩
          skillExamScore: '', // 技能成绩
          dailyExamScore: '', // 日常考核成绩
          coligateScore: '', // 综合成绩
        },
        studentUploadFiles: [], // 学生附件
        teacherUploadFiles: [], // 老师附件
        depUploadFiles: [], // 科室附件
        // 学生类型
        studentType: 'SXS', // 默认实习生
        depRequirement: [],
        // 分数比例
        markRatio: {
          ll: 1, // 理论
          jn: 1, // 技能
          rc: 1, // 日常
        },
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

      // 获取分数比例
      getMarkRatio() {
        let opt = {
          ajaxSuccess: "getMarkRatioSuccess",
          ajaxParams: {
            url: api.getConfig.path + 'rotary_givenDdep_markRatio-' + (this.studentType||this.viewData.podClass),
            method: api.getConfig.method,
          }
        };
        this.ajax(opt)
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
        if (res.data.historyMarkId) {
          this.getMork(res.data.historyMarkId);//获取试卷名称
        }
        this.viewData = res.data;
        this.summaryFileList.comment = res.data.teacherComment;
        let fileIds = [];
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
          fileIds.push(item.id);
          this.teacherUploadFiles.push({
            fileId: item.id,
            fileName: item.fileName,
            filePath: '/api/file/download/' + item.id
          })
        });
        // 科室附件
        (res.data.depCommentFileList || []).map(item => {
          this.depUploadFiles.push({
            fileId: item.id,
            fileName: item.fileName,
            filePath: '/api/file/download/' + item.id
          })
        });

        this.summaryFileList.fileIds = fileIds.join(',');

        // 获取输入数据
        for (let key in this.numParams) {
          this.numParams[key] = res.data[key]
        }

        //2017-11-16 （新增） 如果有老师对学生的日常评价则覆盖值
        let evaluateInfoResultList = res.data.evaluateInfoResultList || []
        let dailyExamScore = 0;
        let count = 0;
        evaluateInfoResultList.map((item) => {
          if (item.businessModel == 'ROTARY_OUTDEP_TEACTOSTU_DAILY' && item.totalScore != null) {
            dailyExamScore += item.totalScore;
            count++
          }
        })
        if(count){
          this.numParams.dailyExamScore = (dailyExamScore/(count*100)).toFixed(2);
        }

          this.getRotaryRequirStatic();
          this.getMarkRatio();

        if ((this.studentType||res.data.podClass) === 'SXS') {
          this.operailityData.podId && this.getDepRequirementBySXS()
        } else {
          this.operailityData.podId && this.getDepRequirement();
        }
      },

      // 获取分数比例
      getMarkRatioSuccess(res) {
        if (res.data.configValue) {
          let mr = res.data.configValue.split(',');
          let count = 0;
          mr.map(item => count += +item);
          this.markRatio.ll = (mr[0] / count).toFixed(2);
          this.markRatio.jn = (mr[1] / count).toFixed(2);
          this.markRatio.rc = (mr[2] / count).toFixed(2);
        }
      },

      // 计算综合成绩
      countColigateScore() {
        let temp = 0;
        if (!isNaN(this.numParams.theoryExamScore)) {
          temp += +(this.numParams.theoryExamScore * this.markRatio.ll).toFixed(2);
        }
        if (!isNaN(this.numParams.skillExamScore)) {
          temp += +(this.numParams.skillExamScore * this.markRatio.jn).toFixed(2);
        }
        if (!isNaN(this.numParams.dailyExamScore)) {
          temp += +(this.numParams.dailyExamScore * this.markRatio.rc).toFixed(2);
        }
        if (temp.toString().indexOf('.') > -1) {
          temp = temp.toFixed(1);
        }
        this.numParams.coligateScore = temp;
      },

      // 获取实习生查看的轮转记录填写
      getDepRequirementBySXS() {
        this.ajax({
          ajaxSuccess: res => this.depRequirement = res.data || [],
          ajaxParams: {
            url: api.getDepRequirementBySXS.path + '--' + (this.operailityData.podId||this.viewData.podId),
            method: api.getDepRequirementBySXS.method
          }
        })
      },
      // 获取非实习生查看的轮转记录填写
      getDepRequirement() {
        this.ajax({
          ajaxSuccess: res => this.depRequirement = res.data || [],
          ajaxParams: {
            url: api.getDepRequirement.path + '__' + (this.operailityData.podId||this.viewData.podId),
            method: api.getDepRequirement.method
          }
        })
      },

      // 上传附件
      setUploadFiles(ids) {
        this.summaryFileList.fileIds = ids;
      },

      // 保存
      save(type) {
        let msg = type === 'BC' ? '保存' : '上报';
        let tips = {
          minerDays: '旷工天数', // 旷工天数
          sickDays: '病假天数', // 病假天数
          personalDays: '事假天数', // 事假天数
          theoryExamScore: '理论考核成绩', // 理论成绩
          skillExamScore: '技能考核成绩', // 技能成绩
          dailyExamScore: '日常考核成绩', // 日常考核成绩
          coligateScore: '综合成绩', // 综合成绩
        }
        // 获取输入数据
        for (let key in this.numParams) {
          if (isNaN(this.numParams[key]) || !(this.numParams[key] >= 0 && this.numParams[key] <= 100)) {
            this.errorMess(`${tips[key]}只能为数字并且在0-100之间！`)
            return
          }
          if (!this.numParams[key]) {
            this.numParams[key] = '0'
          }
        }

        this.summaryFileList.czType = type;
        let data = this.$util._.defaultsDeep({}, this.summaryFileList, this.numParams);
        this.ajax({
          ajaxSuccess: () => this.$emit('rotary', 'rotary', msg + '成功'),
          ajaxParams: {
            url: api.teacherAddComment.path + this.operailityData.depExaminationId,
            method: api.teacherAddComment.method,
            data,
          }
        })
      },

      // 取消
      cancel() {
        this.$emit('cancel', 'rotary')
      },

      //跳转路由到我的评价
      go(){
        this.$router.push({ path: `/manage/evaluations/myEvaluation` })
      },

      //更换试卷
      examChange() {
        this.examModal = true;
      },
      //选择试卷的回调函数
      selectExamBack(item) {
        this.viewData.historyMarkId = item.id;
        this.viewData.examName = item.paperName;
        this.numParams.theoryExamScore = item.mark;
        this.examModal = false;
      },

    },
    components: {
      uploadFile,
      selectExam
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
    .numInput {
      width: 80px;
    }
  }

</style>
