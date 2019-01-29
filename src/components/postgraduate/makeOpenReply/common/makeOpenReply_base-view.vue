<template>
  <div>
    <el-form ref="form" label-width="120px" v-if="operailityData.openTopicReportInfoResult">
      <!--不需要申请人的基本信息-->
      <el-row>
        <el-col :span="12" style="border-left: 1px solid #ececec;border-top: 1px solid #ececec;">
          <el-form-item label="姓名:" style="padding:4px 0;margin: 0;">
            {{operailityData.openTopicReportInfoResult.applicantName}}
          </el-form-item>
        </el-col>
        <el-col :span="12" style="border: 1px solid #ececec;border-bottom: none;">
          <!--<el-form-item label="汉语拼音:" style="padding:4px 0;margin: 0;">-->
          <!--{{operailityData.openTopicReportInfoResult.pinyin}}-->
          <!--</el-form-item>-->
          <el-form-item label="性别:" style="padding:4px 0;margin: 0;">
            {{operailityData.openTopicReportInfoResult.sex | typeText}}
          </el-form-item>
        </el-col>
        <el-col :span="12" style="border-left: 1px solid #ececec;border-top: 1px solid #ececec;">
          <el-form-item label="出生年月:" style="padding:4px 0;margin: 0;">
            {{getBirthDate(operailityData.openTopicReportInfoResult.birthDate)}}
          </el-form-item>
        </el-col>
        <el-col :span="12" style="border: 1px solid #ececec;border-bottom: none;">
          <el-form-item label="入学年月:" style="padding:4px 0;margin: 0;">
            {{operailityData.openTopicReportInfoResult.enrolmentYear}}
          </el-form-item>
        </el-col>
        <el-col :span="12" style="border: 1px solid #ececec;border-right: none;">
          <el-form-item label="学科专业:" style="padding:4px 0;margin: 0;">
            {{operailityData.openTopicReportInfoResult.major}}
          </el-form-item>
        </el-col>
        <el-col :span="12" style="border: 1px solid #ececec;">
          <el-form-item label="研究方向:" style="padding:4px 0;margin: 0;">
            {{operailityData.openTopicReportInfoResult.researchDirection}}
          </el-form-item>
        </el-col>
        <el-col style="border: 1px solid #ececec;">
          <el-form-item label="课题名称:" style="padding:4px 0;margin: 0;">
            {{operailityData.openTopicReportInfoResult.topicName}}
          </el-form-item>
        </el-col>
        <el-col :span="12" style="border: 1px solid #ececec;border-right: none;">
          <el-form-item label="导师姓名:" style="padding:4px 0;margin: 0;">
            {{operailityData.openTopicReportInfoResult.tutorName}}
          </el-form-item>
        </el-col>
        <el-col :span="12" style="border: 1px solid #ececec;">
          <el-form-item label="职称:" style="padding:4px 0;margin: 0;">
            {{operailityData.openTopicReportInfoResult.positionalTitle}}
          </el-form-item>
        </el-col>
      </el-row>
      <br>
      <el-row class="table-back-one">
        <el-col :span="12">
          <el-form-item label="答辩专科:">
            {{operailityData.defenseSpecialist}}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="答辩时间:">
            {{operailityData.defenseTime}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="table-back-two">
        <el-col :span="12">
          <slot>
            <el-form-item label="答辩地点:">
              {{operailityData.defensePlace}}
            </el-form-item>
          </slot>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否预答辩:" prop="isPreDefense">
            {{operailityData.isPreDefense==1?'是':'否'}}
          </el-form-item>
        </el-col>
      </el-row>

      <!--  <el-row class="table-back-one" style="padding: 0">
          <el-col :span="4" style="text-align: center;">
            <div style="font-size: 14px;color: #48576a;line-height: 96px">拟答辩研究生名单</div>
          </el-col>

          <el-col :span="20">
            <el-row class="table-back-two" style="border-top: none;border-right:none;">
              <el-col :span="24">
                <el-form-item  label="博士:" >
                  {{operailityData.degreeType=='DOCTOR'?operailityData.applicantName:''}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="table-back-one" style="border-right:none;">
              <el-col :span="24" >
                <el-form-item  label="硕士:" >
                  {{operailityData.degreeType=='MASTER'?operailityData.applicantName:''}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-col >
        </el-row >-->
      <el-row class="table-back-one" style="padding: 0">
        <el-col>
          <el-form-item label="拟答辩研究生:">
            {{operailityData.applicantName}}({{ operailityData.degreeType=='MASTER'?'硕士':'博士' }})
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="table-back-two-d">
        <el-col>
          <el-form-item label="导师:" prop="tutorName">
            {{operailityData.tutorName}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <br>

    <h2 align="center">审核组成员</h2>
    <el-table
      class="margin-top-14px"
      align="center"
      :data="operailityData.memberList"
      tooltip-effect="dark"
      highlight-current-row
      style="width: 100%;height: 100%">
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="75">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="positionalTitle"
        label="职称"
        align="center">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="company"
        label="单位"
        align="center">
      </el-table-column>
    </el-table>

    <br>
    <!--要办理的事项-->
    <h2 align="center">办理事项</h2>
    <el-table
      align="center"
      :data="matter"
      class="margin-top-14px"
      tooltip-effect="dark"
      highlight-current-row
      style="width: 100%;height: 100%">
      <el-table-column
        show-overflow-tooltip
        prop="key"
        label="事项">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="状态"
        prop="name"
        width="200">
        <template scope="scope">
          <span :style="{color:scope.row.adopt?'#13CE66':'#FF4949'}">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
    </el-table>

    <template v-if="operailityData.arrangeRotaryList && operailityData.arrangeRotaryList">
      <br>
      <h2 align="center">轮转安排</h2>
      <el-table class="margin-top-14px" align="center" :data="operailityData.arrangeRotaryList" tooltip-effect="dark" highlight-current-row
                style="width: 100%;height: 100%">
        <el-table-column align="center" label="序号" type="index" width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="depName" class-name="valiTableStyle" label="科室名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="teacherName" class-name="valiTableStyle" label="带教老师"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="startDate" class-name="valiTableStyle" label="开始日期">
          <template scope="scope">
            {{ (scope.row.startDate || scope.row.rotaryBeginTime || '') | formatDate('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="endDate" class-name="valiTableStyle" label="结束日期">
          <template scope="scope">
            {{ (scope.row.endDate || scope.row.rotaryEndTime || '') | formatDate('yyyy-MM-dd') }}
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!--审核列表-->
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'view'],
    data () {
      return {
        matter: []
      };
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util;
      this.init();
    },
    mounted () {
      //初始化
    },
    methods: {
      init () {
        let data = this.operailityData;
        let matter = [
          {
            key: '培养计划',
            name: data.trainingPlan || '未填写',
            adopt: data.trainingPlan === '已填写'
          },
//            {
//              key: '开题申请',
//              name: data.openTopicApplication
//            },
          {
            key: '开题报告',
            name: data.openTopicReport || '未填写',
            adopt: data.openTopicReport === '已填写'
          }];
        // 专业性
        matter.push(
          {
            key: '出科考核是否合格',
            name: data.depExaminationQualified === 'YES' ? '合格' : '不合格',
            // 学术学位不强制要求
            adopt: data.degree === 'MAJOR' ? true : (data.depExaminationQualified === 'YES')
          });
        matter.push({
          key: '中期考核是否合格',
          name: data.midTermAssessmentQualified === 'YES' ? '合格' : '不合格',
          adopt: data.midTermAssessmentQualified === 'YES'
        });
        // 学术性
        matter.push({
          key: `科研日志是否达标（${data.scientificResearchLogNum}/${data.scientificResearchLogNeedNum}）`,
          name: data.isScientificResearchLog === 'YES' ? '合格' : '不合格',
          // 专业学位不强制要求
          adopt: data.degree === 'LEARNING' ? true : (data.isScientificResearchLog === 'YES')
        });
        matter.push({
          key: '理论成绩是否合格',
          name: data.theoreticalAchievementQualified === 'YES' ? '合格' : '不合格',
          adopt: data.theoreticalAchievementQualified === 'YES'
        });
        matter.push({
          key: '学术论文发表证明是否提交',
          name: data.paperProvesSubmission === 'YES' ? '提交' : '未提交',
          adopt: data.paperProvesSubmission === 'YES'
        });
        this.matter = matter;
      },
      getBirthDate (num) {
        return num ? this.yearMonth(num) : '';
      }
    },
    watch: {
      operailityData () {
        this.init();
      }
    }
  };
</script>

