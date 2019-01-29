<template>
  <!-- 考核详情 -->
  <div class="givenTheApplicationView">
    <el-row>
      <el-form>
        <el-col :span="8">
          <el-form-item label="姓名：">{{ viewData.userName }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入科时间：">{{ viewData.rotaryBeginTime }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出科时间：">{{ viewData.rotaryEndTime }}</el-form-item>
        </el-col>

        <fieldset>
          <legend style="font-size:16px">&nbsp;&nbsp;{{ viewData.depName }}出科情况汇总&nbsp;&nbsp;</legend>
          <!--<el-col>-->
            <!--<el-form-item label="考勤：">-->
              <!--<span>旷工 {{ viewData.minerDays || 0 }} 天，</span>-->
              <!--<span>病假 {{ viewData.sickDays || 0 }} 天，</span>-->
              <!--<span>事假 {{ viewData.personalDays || 0 }} 天</span>-->
            <!--</el-form-item>-->
          <!--</el-col>-->

          <!--<el-col>-->
            <!--<el-form-item label="奖惩情况：">-->
              <!--<span>奖励 {{ viewData.rewardNum || 0 }} 次，</span>-->
              <!--<span>惩罚 {{ viewData.penaltyNum || 0 }} 次</span>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col>
            <el-form-item label="老师评价：">{{ viewData.teacherEvaluation || '暂无' }}</el-form-item>
          </el-col>

          <el-col>
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

          <el-col>
            <h4>轮转要求统计：</h4>
            <el-table align="center" :context="self" :data="rotaryRequirStatic" tooltip-effect="dark">
              <el-table-column label="名称" prop="name"></el-table-column>
              <el-table-column label="要求数量" prop="yqnum" show-overflow-tooltip></el-table-column>
              <el-table-column label="已完成数量" prop="ywcnum" show-overflow-tooltip></el-table-column>
              <el-table-column label="完成比例" prop="wcbl" show-overflow-tooltip></el-table-column>
            </el-table>
          </el-col>

          <!--<el-col>-->
            <!--<h4>轮转记录填写：</h4>-->
            <!--&lt;!&ndash; <el-table align="center" :context="self" :data="viewData.depRequired" tooltip-effect="dark">-->
              <!--<el-table-column label="名称" prop="requiredName"></el-table-column>-->
              <!--<el-table-column label="要求例数" prop="requiredNum" show-overflow-tooltip></el-table-column>-->
              <!--<el-table-column label="实填例数" prop="userNum" show-overflow-tooltip></el-table-column>-->
            <!--</el-table> &ndash;&gt;-->
            <!--<el-table align="center" :context="self" :data="depRequirement" tooltip-effect="dark">-->
              <!--<el-table-column label="名称" prop="disTitle"></el-table-column>-->
              <!--<el-table-column label="要求例数" prop="disNum" show-overflow-tooltip></el-table-column>-->
              <!--<el-table-column label="实填例数" prop="disTs" show-overflow-tooltip></el-table-column>-->
            <!--</el-table>-->
          <!--</el-col>-->
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
        </fieldset>
      </el-form>
      <div align="center" style="margin-top:16px;">
        <h3>出科结果： <b :style="{'color': viewData.depQualified !== 'QUALIFIED' ? 'red' : ''}">{{ viewData.depQualified | typeText }}</b></h3>
      </div>
    </el-row>
  </div>
</template>

<script>
  import api from './api';
  export default {
    props: ['operailityData', 'userType'],
    data() {
      return {
        self: this,
        viewDayData:[{ // 出勤、奖惩情况
          minerDays:'',
          sickDays:'',
          personalDays:'',
          rewardNum:'',
          penaltyNum:'',
        }],
        rotaryRequirStatic:[], // 轮转要求统计
        viewData: [],
        // 学生类型
        studentType: 'SXS', // 默认实习生
        depRequirement: [],
      }
    },
    methods: {
      // 初始化
      init() {
        if (this.userType) {
          this.studentType = this.userType.toLocaleUpperCase()
        }
        this.getViewData();
        this.getRotaryRequirStatic();
      },

      // 转要求统计
      getRotaryRequirStatic(){
        let name = {
          sscz:'手术操作',
          jnys: '技能演示',
          bltl: '病例讨论',
          klxjz: '科内小讲座',
          jxcf: '教学查房',
          dbl: '大病历',
          jn: '技能',
          bz: '病种',
        };
        let opt = {
          ajaxSuccess:res=>{
            if(res.data){
              let temp = [];
              this.$util._.map(res.data,(val,key)=>{
                val.key = key;
                val.name = name[key];
                temp.push(val)
              })
              this.rotaryRequirStatic = temp;
            }
          },
          ajaxParams:{
            url:api.getRotaryRequirStatic.path + this.operailityData.podId,
            method: api.getRotaryRequirStatic.method,
            params: {state: 'PASS'},
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
        this.viewData = res.data;
        for(let key in this.viewDayData[0]){
          this.viewDayData[0][key] = this.viewData[key] || '';
        }
        if (this.studentType === 'SXS') {
          this.operailityData.podId && this.getDepRequirementBySXS()
        } else {
          this.operailityData.rdId = this.viewData.rdId;
          this.operailityData.depId = this.viewData.depId;
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
            url: api.getDepRequirement.path + (this.operailityData.rdId || '') + '_' + (this.operailityData.depId || '') + '_' + this.operailityData.podId,
            method: api.getDepRequirement.method
          }
        })
      },
    },
    components: {},
    created() {
      this.init()
    },
  }

</script>

<style lang="scss">
  .givenTheApplicationView {
    h4 {
      margin: 20px 0;
    }
  }

</style>
