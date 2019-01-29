<template>
  <!-- 出科申请 -->
  <div>
    <el-row class="givenTheApplicationOfLarge">
      <el-form :inline="true">
        <el-col :span="12">
          <el-form-item label="姓名：">{{ viewData.userName || operailityData.userName }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="科室：">{{ viewData.greatName || operailityData.greatName }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入科时间：">{{ viewData.beginTime || operailityData.rotaryBeginTime }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出科时间：">{{ viewData.endTime || operailityData.rotaryEndTime }}</el-form-item>
        </el-col>
        <el-col class="timeInfo">
          <el-form-item label="共缺时间：">
            <span>{{ (viewData.minerDays + viewData.sickDays + viewData.personalDays) || 0 }} 天</span>
          </el-form-item>
          <el-form-item label="其中：">
            <span>旷工 {{ viewData.minerDays || 0 }} 天，</span>
            <span>病假 {{ viewData.sickDays || 0 }} 天，</span>
            <span>事假 {{ viewData.personalDays || 0 }} 天</span>
          </el-form-item>
          <el-form-item label="轮转比例：">
            <span>{{ (viewData.deficitRatio || 0) * 100 }} %</span>
          </el-form-item>
        </el-col>

        <el-col>
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
                <div class="cell">{{ (viewData.theoryExamScore !=null ? viewData.theoryExamIsMakeup : '--') | isNeed }}</div>
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
                <div class="cell">{{ (viewData.skillExamScore !=null ? viewData.skillExamIsMakeup : '--') | isNeed }}</div>
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
            </tr>
            </tbody>
          </table>
        </el-col>

        <el-col class="subDepAppraise">
          <div class="subDepAppraiseItem" :class="{'marginLeft':index % 2 === 1,'onlyOne':(index === (viewData.subDepAppraise.length -1)) && (index  % 2 === 0)}" v-for="(item,index) in viewData.subDepAppraise" :key="index">
            <fieldset>
              <legend style="font-size:16px">&nbsp;&nbsp;{{ item.depName }}出科情况汇总&nbsp;&nbsp;</legend>
              <!--<el-form-item label="考勤：">-->
                <!--<span>旷工 {{ item.minerDays || 0 }} 天，</span>-->
                <!--<span>病假 {{ item.sickDays || 0 }} 天，</span>-->
                <!--<span>事假 {{ item.personalDays || 0 }} 天</span>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="奖惩情况：">-->
                <!--<span>奖励 {{ item.rewardNum || 0 }} 次，</span>-->
                <!--<span>惩罚 {{ item.penaltyNum || 0 }} 次</span>-->
              <!--</el-form-item>-->
              <div>
                <el-form-item label="老师评价：">{{ item.teacherEvaluation }}</el-form-item>
              </div>
              <div>
                <el-form-item label="老师评语：">{{ item.teacherComment }}</el-form-item>
              </div>
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
                    <div class="cell">{{ item.minerDays || 0 }} 天</div>
                  </td>
                  <td>
                    <div class="cell">{{ item.sickDays || 0 }} 天</div>
                  </td>
                  <td>
                    <div class="cell">{{ item.personalDays || 0 }} 天</div>
                  </td>
                  <td>
                    <div class="cell">{{ item.rewardNum || 0 }} 次</div>
                  </td>
                  <td>
                    <div class="cell">{{ item.penaltyNum || 0 }} 次</div>
                  </td>
                </tr>
                </tbody>
              </table>
              <!--<h4>轮转记录填写：</h4>-->
              <!--<el-table align="center" :context="self" :data="item.depRequired" tooltip-effect="dark">-->
                <!--<el-table-column label="名称" prop="requiredName"></el-table-column>-->
                <!--<el-table-column label="要求例数" prop="requiredNum" show-overflow-tooltip></el-table-column>-->
                <!--<el-table-column label="实填例数" prop="userNum" show-overflow-tooltip></el-table-column>-->
              <!--</el-table>-->
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
                  </tr>
                </thead>
                <tbody>
                  <tr class="el-table__row">
                    <td>
                      <div class="cell">理论考核</div>
                    </td>
                    <td>
                      <div class="cell">{{ item.theoryExamScore }}</div>
                    </td>
                    <td>
                      <div class="cell">{{ (item.theoryExamScore !=null ? item.theoryExamIsMakeup : '--') | isNeed }}</div>
                    </td>
                  </tr>
                  <tr class="el-table__row">
                    <td>
                      <div class="cell">技能考核</div>
                    </td>
                    <td>
                      <div class="cell">{{ item.skillExamScore }}</div>
                    </td>
                    <td>
                      <div class="cell">{{ (item.skillExamScore !=null ? item.skillExamIsMakeup : '--') | isNeed }}</div>
                    </td>
                  </tr>
                  <tr class="el-table__row">
                    <td>
                      <div class="cell">日常考核</div>
                    </td>
                    <td>
                      <div class="cell">{{ item.dailyExamScore }}</div>
                    </td>
                    <td>
                      <div class="cell">--</div>
                    </td>
                  </tr>
                  <tr class="el-table__row">
                    <td>
                      <div class="cell">综合成绩</div>
                    </td>
                    <td>
                      <div class="cell">{{ item.coligateScore }}</div>
                    </td>
                    <td>
                      <div class="cell">--</div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--<p class="depQualified">
                <b>出科结果：{{ item.depQualified | typeText }}</b>
              </p>-->
              <h4 class="depQualified">出科结果：
                <b :style="{'color': item.depQualified !== 'QUALIFIED' ? 'red' : 'green'}">{{ item.depQualified | typeText }}</b>
              </h4>
            </fieldset>
          </div>
        </el-col>

        <el-col>
          <h4>个人小结：</h4>
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" :maxlength="250" placeholder="请输入内容" v-model="summaryFileList.comment"></el-input>
        </el-col>
        <el-col>
          <h4>小结附件：</h4>
          <uploadFile @setUploadFiles="setUploadFiles" :uploadFiles="uploadFiles"></uploadFile>
        </el-col>
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
  </div>
</template>

<script>
  import api from './api';
  import uploadFile from '../../../../components/common/uploadFile';

  export default {
    props: ['operailityData'],
    data() {
      return {
        self: this,
        viewData: [],
        summaryFileList: {
          fileIds: '',
          comment: '',
          groupNo: this.operailityData.groupNo || '',
          rtId: this.operailityData.rtId || '',
          examinationId: this.operailityData.examinationId || '',
          czType: '',
        },
        uploadFiles: [],
      }
    },
    methods: {
      // 初始化
      init() {
//        if (this.operailityData.examinationId) {
          this.getViewData()
//        }
      },

      // 获取预览数据
      getViewData() {
        this.ajax({
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: api.get.path + (this.operailityData.examinationId || ''),
            method: api.get.method,
            params: {
              rtId: this.operailityData.rtId,
              groupNo: this.operailityData.groupNo,
            }
          }
        })
      },

      // 获取数据成功
      getDataSuccess(res) {
        this.viewData = res.data;
        this.summaryFileList.comment = res.data.userSummary;
        let fileIds = [];
        this.uploadFiles.length = 0;
        res.data.summaryFileList.map(item => {
          fileIds.push(item.id);
          this.uploadFiles.push({
            fileId: item.id,
            fileName: item.fileName,
            filePath: '/api/file/download/' + item.id
          })
        });
        this.summaryFileList.fileIds = fileIds.join(',')
      },

      // 上传附件
      setUploadFiles(ids) {
        this.summaryFileList.fileIds = ids;
      },

      // 保存
      save(type) {
        let msg = type === 'BC' ? '保存' : '上报';
        this.summaryFileList.czType = type;
        this.ajax({
          ajaxSuccess: () => this.$emit('rotary', 'rotary', msg + '成功'),
          ajaxParams: {
            jsonString: true,
            url: api.addUserComment.path + (this.operailityData.examinationId || '0'),
            method: api.addUserComment.method,
            data: this.summaryFileList,
          }
        })
      },
    },
    components: {
      uploadFile
    },
    created() {
      this.init()
    },
  }

</script>

<style lang="scss">
  /* 出科申请 */

  .givenTheApplicationOfLarge {
    h4 {
      margin: 20px 0;
    }
    .timeInfo {
      .el-form-item {
        margin-bottom: 0;
        &~.el-form-item {
          margin-left: 30px;
        }
      }
    }
    fieldset {
      h4 {
        margin: 10px 0;
      }
      .el-form-item {
        margin-bottom: 0;
      }
    }
    .depQualified {
      clear: both; // padding-top: 10px;
      margin-bottom: 0;
    }
    .subDepAppraise {
      .el-col {
        margin-top: 20px;
      }
    }
    .subDepAppraiseItem {
      width: 49%;
      margin-top: 20px;
      float: left;
      &:nth-child(2n) {
        margin-left: 2%;
      }
      &.onlyOne{
        width: 100%;
      }
    }
  }

</style>
