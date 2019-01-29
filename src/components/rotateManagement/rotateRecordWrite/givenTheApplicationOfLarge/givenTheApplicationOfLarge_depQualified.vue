<template>
  <!-- 考核详情 -->
  <el-row class="givenTheApplicationOfLarge">
    <el-form :inline="true">
      <el-col :span="12">
        <el-form-item label="姓名：">{{ viewData.userName }}</el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="科室：">{{ viewData.greatName }}</el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="入科时间：">{{ viewData.beginTime }}</el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="出科时间：">{{ viewData.endTime }}</el-form-item>
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

      <el-col class="subDepAppraise">
        <div class="subDepAppraiseItem" :class="{'marginLeft':index % 2 === 1,'onlyOne': (index === (viewData.subDepAppraise.length -1)) && (index  % 2 === 0)}" v-for="(item,index) in viewData.subDepAppraise" :key="index">
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
              <el-form-item label="老师评价：">{{ item.teacherEvaluation || '-' }}</el-form-item>
            </div>
            <div>
              <el-form-item label="老师评语：">{{ item.teacherComment || '暂无' }}</el-form-item>
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
                    <div class="cell">{{ (item.theoryExamScore ? item.theoryExamIsMakeup : '--') | isNeed }}</div>
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
                    <div class="cell">{{ (item.skillExamScore ? item.skillExamIsMakeup : '--') | isNeed }}</div>
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
            <h4 class="depQualified">出科结果：
              <b :style="{'color': item.depQualified !== 'QUALIFIED' ? 'red' : 'green'}">{{ item.depQualified | typeText }}</b>
            </h4>
          </fieldset>
        </div>
      </el-col>
      <!--<el-col>
            <h4>个人小结：</h4>
            {{ viewData.userSummary }}
          </el-col>
          <el-col>
            <h4>实习单位意见：</h4>
            {{ viewData.eduComment }}
          </el-col>
          <el-col>
            <h4>出科是否合格：{{ viewData.depQualified | typeText }}</h4>
          </el-col>-->
      <!--<el-col>
            <h4>小结附件：</h4>
            <uploadFile :uploadFiles="uploadFiles" :show="true"></uploadFile>
          </el-col>
          <el-col>
            <h4>带教老师评语：</h4>
            {{ viewData.teacherComment }}
          </el-col>
          <el-col>
            <h4>科室评语：</h4>
            {{ viewData.depComment }}
          </el-col>
          <el-col>
            <h4>老师签名：</h4>
            <img :src="viewData.teacherAutograph">
          </el-col>-->
    </el-form>
  </el-row>
</template>

<script>
  import api from './api';
  export default {
    props: ['operailityData'],
    data() {
      return {
        self: this,
        viewData: [],
      }
    },
    methods: {
      // 初始化
      init() {
        this.getViewData()
      },

      // 获取预览数据
      getViewData() {
        this.ajax({
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: api.get.path + this.operailityData.examinationId,
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
      },
    },
    components: {},
    created() {
      this.init()
    },
  }

</script>

<style lang="scss">
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
