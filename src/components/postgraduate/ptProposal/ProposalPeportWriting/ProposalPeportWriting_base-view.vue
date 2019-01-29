<template>
  <div class="worldContentBox">
    <el-form ref="formValidate">
      <div class="worldContentItem">
        <br>
        <br>
        <p class="yihao" align="center">{{ schoolName }}</p>
        <p class="erhao" align="center">研究生学位论文开题报告</p>
        <p class="erhao" align="center">及论文工作实施计划</p>
        <p class="sihao" align="center">（供中医硕士专业学位研究生用）</p>
        <br>
        <br>
        <br>
        <el-row>
          <el-col :span="10" :offset="7" align="center">
            <el-form-item label="基  地  名   称" label-width="140px" prop="baseName" align="left">
              <p class="basicInfo borderBottom">
                {{ operailityData.baseName }}　
              </p>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="7" align="center">
            <el-form-item label="专           业" label-width="140px" prop="major" align="left">
              <p class="basicInfo borderBottom">
                {{ operailityData.major }}　
              </p>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="7" align="center">
            <el-form-item label="研 究 生 姓 名" label-width="140px" prop="applicantName" align="left">
              <p class="basicInfo borderBottom">
                {{ operailityData.applicantName }}　
              </p>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="7" align="center">
            <el-form-item label="导  师  姓  名" label-width="140px" prop="tutorName" align="left">
              <p class="basicInfo borderBottom">
                {{ operailityData.tutorName }}　
              </p>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="7" align="center">
            <el-form-item label="入  学  年  月" label-width="140px" prop="enrolmentYear" align="left">
              <p class="basicInfo borderBottom">
                {{ operailityData.enrolmentYear | formatDate('yyyy-MM') }}　
              </p>
              <!--<el-date-picker class="borderBottom" v-model="" type="month" placeholder="选择年月"></el-date-picker>-->
              <!--<input class="el-input__inner borderBottom" v-model="operailityData.enrolmentYear"/>-->
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="7" align="center">
            <el-form-item label="开 题 报 告 日 期" label-width="140px" prop="reportDate" align="left">
              <p class="basicInfo borderBottom">
                {{ operailityData.reportDate | formatDate('yyyy-MM-dd') }}　
              </p>
              <!--<el-date-picker class="borderBottom" v-model="operailityData.reportDate" type="date" placeholder="选择日期"></el-date-picker>-->
              <!--<input class="el-input__inner borderBottom" v-model="operailityData.reportDate"/>-->
            </el-form-item>
          </el-col>
        </el-row>
        <br>
        <br>
        <br>
      </div>

      <div class="worldContentItem">
        <p align="center"><b class="sanhao">{{ schoolName }}研究生院</b></p>
        <br>
        <p class="erhao" align="center">填 表 须 知</p>
        <ul>
          <li class="sihao">1.本表须经导师审批，评议小组签署意见。</li>
          <li class="sihao">2.随本表应附本人的文献综述,博士还需附查新报告。</li>
          <li class="sihao">3.应在第四学期3月31日前完成开题工作。</li>
          <li class="sihao">4.本表原件由研究生本人保存，申请学位时提供审核。</li>
          <li class="sihao">5.本表请如实填写、备查，如有造假，责任自负。</li>
          <li class="sihao">6.本表请用A4纸打印，切勿改变表格格式，内容较多时可以加页。</li>
        </ul>
        <!--<br><br><br><br><br><br><br><br><br><br>-->
        <!--</div>-->
        <br><br>
        <!--<div class="worldContentItem">-->
        <p class="sihao">一、学位论文开题报告</p>
        <table class="el-table el-table--border">
          <tr style="height: 0;border: 0;overflow: hidden;">
            <th width="4" height="0"></th>
            <th width="2" height="0"></th>
            <th width="2" height="0"></th>
            <th width="2" height="0"></th>
            <th width="6" height="0"></th>
          </tr>
          <tr align="center">
            <td>
              <div class="cell">论 文 题 目</div>
            </td>
            <td colspan="4">
              <div class="cell">
                {{ operailityData.topicName }}
              </div>
            </td>
          </tr>
          <tr align="center">
            <td>
              <div class="cell">研 究 方 向</div>
            </td>
            <td colspan="4">
              <div class="cell">
                {{ operailityData.researchDirection }}
              </div>
            </td>
          </tr>
          <tr align="center">
            <td rowspan="2">
              <div class="cell">题 目 来 源</div>
            </td>
            <td rowspan="2">
              <div class="cell">{{ operailityData.topicSource }}</div>
            </td>
            <td>
              <div class="cell">有无合同</div>
            </td>
            <td>
              <div class="cell">经费数</div>
            </td>
            <td>
              <div class="cell">备注</div>
            </td>
          </tr>
          <tr align="center">
            <td>
              <div class="cell">
                {{ operailityData.isContract | typeText }}
              </div>
            </td>
            <td>
              <div class="cell">
                {{ operailityData.funds }}
              </div>
            </td>
            <td>
              <div class="cell">
                {{ operailityData.remarks }}
              </div>
            </td>
          </tr>
          <tr align="center">
            <td>
              <div class="cell">题 目 类 型</div>
            </td>
            <td colspan="4">
              <div class="cell">{{ operailityData.topicType }}</div>
            </td>
          </tr>
          <tr align="center">
            <td>
              <div class="cell">
                论文开题前上网检索情况（硕士生可不作要求；博士生应填写并附查新报告）
              </div>
            </td>
            <td colspan="4">
              <div class="cell" style="height: 100%">
                {{ operailityData.networkRetrieval }}
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="5">
              <div class="cell">
                <p class="sihao margin-top-14px">开题报告内容（具体要求见《南京中医药大学研究生选题、开题报告的原则和要求》）</p>
                <p class="sihao">（一）课题研究目的，其理论与实际意义，国内外研究动态和发展趋势</p>
                <p class="sihao">{{ operailityData.researchObjective }}</p>
                <p class="sihao">（二）课题研究的内容和主要研究方法</p>
                <p class="sihao">{{ operailityData.contentAndMethod }}</p>
                <p class="sihao">（三）课题研究的目标</p>
                <p class="sihao">{{ operailityData.subjectTarget }}</p>
                <p class="sihao">（四）完成课题的条件</p>
                <p class="sihao">{{ operailityData.completionConditions }}</p>
                <p class="sihao">（五）研究进度、具体安排及预期结果 </p>
                <p class="sihao">{{ operailityData.expectedResults }}</p>
                <br>
                <p align="right">
                  <span class="sihao">研究生签名 {{ operailityData.applicantName }}</span>
                  <span style="width: 25px;display: inline-block;"></span>
                </p>
                <br>
                <p align="right">
                  <span class="sihao">年</span>
                  <span style="width: 20px;display: inline-block;"></span>
                  <span class="sihao">月</span>
                  <span style="width: 20px;display: inline-block;"></span>
                  <span class="sihao" style="margin-right: 40px;">日</span>
                </p>
                <br><br>
              </div>
            </td>
          </tr>
        </table>
        <!--</div>-->
        <br><br>
        <!--<div class="worldContentItem">-->
        <p class="sihao">二、学位论文工作实施计划</p>
        <p class="sihao">（一）论文的理论分析与硬件要求及其预期达到的水平与结果</p>
        <p class="sihao">{{ operailityData.theoreticalAnalysisResults }}</p>
        <p><br></p>
        <p class="sihao">（二）论文工作进度与安排</p>
        <table class="el-table el-table--border">
          <tr align="center">
            <td>
              <div class="cell">起讫日期</div>
            </td>
            <td>
              <div class="cell">工 作 内 容 和 要 求</div>
            </td>
            <td>
              <div class="cell">备 注</div>
            </td>
          </tr>
          <template v-if="operailityData.arrangeList && operailityData.arrangeList.length">
            <tr v-for="(item,index) in operailityData.arrangeList" :key="index">
              <td align="center">
                <div class="cell">
                  <p class="sihao">{{ item.startDate | formatDate('yyyy-MM-dd') }} - {{ item.endDate | formatDate('yyyy-MM-dd') }}</p>
                </div>
              </td>
              <td>
                <div class="cell">
                  <p class="sihao">{{ item.workArrangement }}</p>
                </div>
              </td>
              <td>
                <div class="cell">
                  <p class="sihao">{{ item.remarks }}</p>
                </div>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="3" align="center">
              <div class="cell">未填写</div>
            </td>
          </tr>
        </table>
        <br>
        <p class="sihao">（三）论文的大纲</p>
        <p class="sihao">
          {{ operailityData.outline }}
        </p>
        <p></p>
        <br>
        <!--</div>-->
        <br>
        <!--<div class="worldContentItem">-->
        <p class="sihao textCenter">学 科 评 议 小 组 意 见 统 计</p>
        <table class="el-table el-table--border">
          <tr align="center">
            <td>
              <div class="cell">
                评议项目
              </div>
            </td>
            <td colspan="3">
              <div class="cell">评议意见</div>
            </td>
          </tr>
          <tr align="center">
            <td>
              <div class="cell">论文选题的意义</div>
            </td>
            <td>
              <div class="cell">
                <p>好</p>
                <p>( {{ operailityData.significanceGood }} )人</p>
              </div>
            </td>
            <td>
              <div class="cell">
                <p>一般</p>
                <p>( {{operailityData.significanceOrdinary}} )人</p>
              </div>
            </td>
            <td>
              <div class="cell">
                <p>差</p>
                <p>( {{ operailityData.significanceBad }} )人</p>
              </div>
            </td>
          </tr>
          <tr align="center">
            <td>
              <div class="cell">论文难度与工作量是否适度</div>
            </td>
            <td>
              <div class="cell">
                <p>偏高</p>
                <p>( {{ operailityData.workloadBig }} )人</p>
              </div>
            </td>
            <td>
              <div class="cell">
                <p>适当</p>
                <p>( {{ operailityData.workloadAppropriate }} )人</p>
              </div>
            </td>
            <td>
              <div class="cell">
                <p>偏低</p>
                <p>( {{ operailityData.workloadSmall }} )人</p>
              </div>
            </td>
          </tr>
          <tr align="center">
            <td>
              <div class="cell">研究方案的可行性</div>
            </td>
            <td>
              <div class="cell">
                <p>可行性高</p>
                <p>( {{ operailityData.feasibilityBig }} )人</p>
              </div>
            </td>
            <td>
              <div class="cell">
                <p>一般</p>
                <p>( {{ operailityData.feasibilityOrdinary }} )人</p>
              </div>
            </td>
            <td>
              <div class="cell">
                <p>不可行</p>
                <p>( {{ operailityData.infeasible }} )人</p>
              </div>
            </td>
          </tr>
          <tr align="center">
            <td>
              <div class="cell">是否同意论文开题</div>
            </td>
            <td>
              <div class="cell">
                <p>同意</p>
                <p>( {{ operailityData.agree }} )人</p>
              </div>
            </td>
            <td>
              <div class="cell">
                <p>不同意</p>
                <p>( {{ operailityData.disagree }} )人</p>
              </div>
            </td>
            <td>
              <div class="cell">
                <p>弃权</p>
                <p>( {{ operailityData.waiver }} )人</p>
              </div>
            </td>
          </tr>
        </table>
        <br>
        <p class="sihao textCenter">评 议 小 组 组 成 人 员</p>
        <table class="el-table el-table--border">
          <tr align="center">
            <td>
              <div class="cell">评议小组</div>
            </td>
            <td>
              <div class="cell">姓 名</div>
            </td>
            <td>
              <div class="cell">职 称</div>
            </td>
            <td>
              <div class="cell">研究方向</div>
            </td>
            <td>
              <div class="cell">所在单位或部门</div>
            </td>
          </tr>
          <template v-if="operailityData.groupList && operailityData.groupList.length">
            <tr v-for="(item,index) in operailityData.groupList" :key="index" align="center">
              <td>
                <div class="cell">组{{ index ===0 ? '长' : '员'}}</div>
              </td>
              <td>
                <div class="cell">{{ item.name }}</div>
              </td>
              <td>
                <div class="cell">{{ item.dutiesTitle }}</div>
              </td>
              <td>
                <div class="cell">{{ item.researchDirection }}</div>
              </td>
              <td>
                <div class="cell">{{ item.dept }}</div>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="5" align="center">
              <div class="cell">未填写</div>
            </td>
          </tr>
          <tr>
            <td colspan="5">
              <div class="cell">
                <p class="margin-top-14px">记录人：
                  <input type="text">
                </p>
                <br>
                <br>
                <p align="right">
                  <span class="sihao">年</span>
                  <span style="width: 20px;display: inline-block;"></span>
                  <span class="sihao">月</span>
                  <span style="width: 20px;display: inline-block;"></span>
                  <span class="sihao" style="margin-right: 40px;">日</span>
                </p>
                <br><br>
              </div>
            </td>
          </tr>
        </table>
        <!--</div>-->
        <br><br>
        <!--<div class="worldContentItem">-->
        <el-row style="border: 1px solid #ccc;position: relative;">
          <el-col style="width: 100px;padding: 18px;position: absolute;left: 0;top: 50%;transform: translateY(-50%)">
            <span class="cell">导师对开题报告的综合意见</span>
          </el-col>
          <el-col style="padding-left: 100px;">
            <div style="padding: 18px;border-left: 1px solid #ccc;">
              <p class="sihao">{{operailityData.tutorOpinion}}</p>
              <br>
              <p align="right">
                <span class="sihao">指导教师（签名） {{ operailityData.tutorName }}</span>
                <span style="width: 25px;display: inline-block;"></span>
              </p>
              <br>
              <p align="right">
                <span class="sihao">年</span>
                <span style="width: 20px;display: inline-block;"></span>
                <span class="sihao">月</span>
                <span style="width: 20px;display: inline-block;"></span>
                <span class="sihao" style="margin-right: 40px;">日</span>
              </p>
              <br><br>
            </div>
          </el-col>
        </el-row>
        <el-row style="border: 1px solid #ccc;position: relative;">
          <el-col style="width: 100px;padding: 18px;position: absolute;left: 0;top: 50%;transform: translateY(-50%)">
            <span class="cell">开题报告评议情况记录</span>
          </el-col>
          <el-col style="padding-left: 100px;">
            <div style="padding: 18px;border-left: 1px solid #ccc;" class="cell">
              <p>
                1.评议小组成员（一般不少于5人）
              </p>
              <p style="padding: 5px 0;">组长：{{ groupInfo.leader }}</p>
              <p style="padding: 5px 0;">组员：{{ groupInfo.member.join('、') }}</p>
              <p style="padding: 5px 0;">2.评议小组意见</p>
              <p class="sihao">{{operailityData.groupOpinion}}</p>
              <br>
              <p style="padding: 5px 0;">3.开题结果</p>
              <p style="padding: 5px 0;">
                {{ operailityData.result }}
              </p>
              <p align="right">
                <span class="sihao">年</span>
                <span style="width: 20px;display: inline-block;"></span>
                <span class="sihao">月</span>
                <span style="width: 20px;display: inline-block;"></span>
                <span class="sihao" style="margin-right: 40px;">日</span>
              </p>
              <br><br>
            </div>
          </el-col>
        </el-row>

      </div>
    </el-form>
  </div>
</template>
<style lang="scss">
  @import "../../../../assets/ambuf/css/common/worldContent";
</style>
<script>
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'view'],
    data () {
      return {
        schoolName:'',
        tableData: [],
        header: [],
        activeNames: 1
      };
    },
    created () {
      let userInfo = this.$store.getters['getUserInfo'];
      //给当前组件注入全局util
      Util = this.$util;
      this.schoolName = userInfo.schoolName || userInfo.school;
    },
    computed: {
      groupInfo () {
        let info = {leader: '', member: []};
        (this.operailityData && this.operailityData.groupList || []).map((item, index) => {
          if (index === 0) {
            info.leader = item.name;
          } else {
            info.member.push(item.name);
          }
        });
        return info;
      }
    },
    mounted () {
      //初始化
    },
    methods: {}

  };
</script>

