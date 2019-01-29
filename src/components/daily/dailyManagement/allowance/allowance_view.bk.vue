<template>
  <div class="volunteerActivity_view">
    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <p><span class="text-w">姓名：</span><span>{{data.userName}}</span></p>
      </el-col>
    </el-row>
    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <p><span class="text-w">学校：</span><span>{{data.userSchool}}</span></p>
      </el-col>
    </el-row>
    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <p><span class="text-w">专业：</span><span>{{data.userMajor}}</span></p>
      </el-col>
    </el-row>
    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <p><span class="text-w">科室：</span><span>{{data.depName}}</span></p>
      </el-col>
    </el-row>

    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <fieldset class="layui-elem-field">
          <legend>考勤:</legend>
          <div class="layui-field-box">
            <el-row class=" table-back-one">
              <el-col :span="4" :offset="2">
                <p><span class="text-w2">实际出勤：</span><span>{{data.attendance.workAttendance}} 天</span></p>
              </el-col>
              <!--<el-col :span="4" >-->
              <!--<p ><span class="text-w2">半工半休：</span><span>{{data.attendance.workAndRest}} 天</span></p>-->
              <!--</el-col >-->
              <el-col :span="4">
                <p><span class="text-w2">事假：</span><span>{{data.attendance.compassionateLeave}} 天</span></p>
              </el-col>
              <el-col :span="4">
                <p><span class="text-w2">病假：</span><span>{{data.attendance.sickLeave}} 天</span></p>
              </el-col>
              <el-col :span="4">
                <p><span class="text-w2">婚假：</span><span>{{data.attendance.marriageLeave}} 天</span></p>
              </el-col>
            </el-row>
            <el-row class="  table-back-two-d">
              <el-col :span="4" :offset="2">
                <p><span class="text-w2">丧假：</span><span>{{data.attendance.funeralLeave}} 天</span></p>
              </el-col>
              <el-col :span="4">
                <p><span class="text-w2">其他：</span><span>{{data.attendance.otherLeave}} 天</span></p>
              </el-col>
              <el-col :span="4">
                <p><span class="text-w2">旷工：</span><span>{{data.attendance.absenteeism}} 天</span></p>
              </el-col>
            </el-row>

          </div>

        </fieldset>
      </el-col>
    </el-row>

    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <p><span class="text-w">老师评价：</span><span>{{converter(data.evaluate)}}</span></p>
      </el-col>
    </el-row>
    <el-row class="lose-margin2">
      <el-col :span="5" :offset="2">
        <p><span class="text-w" style="width:90px;">日常考核成绩：</span><span>{{data.score}}</span></p>
      </el-col>
      <el-col :span="5">
        <p><span class="text-w" style="width:90px;">结果：</span><span>{{converter(data.examinationResult)}}   </span></p>
      </el-col>
    </el-row>

    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <fieldset class="layui-elem-field">
          <legend>奖惩情况:</legend>
          <div class="layui-field-box">
            <el-table
              align="center"
              :height="dynamicHt"
              :data="data.rewardsAndPunishments"
              tooltip-effect="dark"
              style="width: 100%"
            >
              <el-table-column
                prop="rewardAndPunishmentType"
                label="名称"
                align="center"
              >
                <template scope="scope">
                  {{scope.row.rewardAndPunishmentType?'惩罚':'奖励'}}
                </template>
              </el-table-column>
              <el-table-column
                prop="rewardAndPunishmentDescribe"
                label="事项说明"
                width="200"
                show-overflow-tooltip>
                <template scope="scope">
                  {{scope.row.rewardAndPunishmentDescribe}}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </fieldset>
      </el-col>
    </el-row>
    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <p><span>轮转记录填写：</span><span>{{show.userName}}</span></p>
      </el-col>
    </el-row>
    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <el-table
          align="center"
          :height="dynamicHt"
          :data="data.record"

          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column
            prop="recordName"
            label="名称"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="needNum"
            label="要求例数"
            width="200"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="actualNum"
            label="实填例数"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!--研究生-->
    <el-row v-if="role=='yjx'" class="lose-margin2">
      <el-col :span="20" :offset="2">
        <p><span class="text-w">综合评分：</span><span>{{data.provideMonth}}</span></p>
      </el-col>
    </el-row>
    <!--进修生-->
    <el-row v-if="role=='jxs'" class="lose-margin2">
      <el-col :span="20" :offset="2">
        <p><span class="text-w">考核等级：</span><span>{{data.examinationLevel}}</span></p>
      </el-col>
    </el-row>

    <el-row class="lose-margin2">

      <el-col :span="20" :offset="2">
        <p><span class="text-w">发放月份：</span><span>{{data.provideMonth}}</span></p>
      </el-col>
    </el-row>
    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <p><span class="text-w">发放金额：</span><span>{{data.provideAmount}}</span></p>
      </el-col>
    </el-row>
    <!---->
  </div>
</template>
<script>
  export default {
    props: ["operailityData"],
    data() {
      return {
        formValidate: {
          name: "",
          school: "",
          status: ""
        },
        //角色

        data: {
          id: "",
          userId: "", //学员名称
          userName: "", //学校
          userSchool: "", //专业
          userMajor: "", //专业
          depId: "", //科室Id
          depName: "", //科室名称
          provideMonth: "", //发放年月
          provideAmount: "", //发放金额
          provideStatus: "", //发放状态
          attendance: {
            //考勤统计对象
            workAttendance: "", //实际出勤
            workAndRest: "", //半工半休
            compassionateLeave: "", //事假
            sickLeave: "", //病假
            marriageLeave: "", //婚假
            funeralLeave: "", //丧假
            otherLeave: "", //其他
            absenteeism: "" //旷工
          },
          evaluate: "", //老师评价
          score: "", //考试成绩
          examinationResult: "", //考核结果
          rewardsAndPunishments: [
            //奖惩情况
            {
              rewardAndPunishmentType: "", //奖惩类型
              rewardAndPunishmentDescribe: "" //事项说明
            }
          ],
          record: [
            //轮转记录统计对象
            {
              recordName: "", //类型名称
              needNum: "", //需求数量
              actualNum: "" //实际填写数量
            }
          ]
        },
        dynamicHt: 0,
        tableData1: [],
        show: {},
        listMessTitle: {
          paramsData: "listUrl",
          ajaxSuccess: "SuccessGetCurrData",
          ajaxParams: {
            url: ""
          }
        },
        role: ""
      };
    },
    created() {
      let type;
      let userType = this.operailityData.userType.toLocaleLowerCase();
      this.role = userType;
      if (userType == "yjs") {
        type = "yjx";
      } else {
        type = userType;
      }
      this.listMessTitle.ajaxParams.url =
        "allowance/get/" + type + "/" + this.operailityData.id;
    },
    mounted() {
      //初始化
      this.init();
    },
    methods: {
      /*
         * 默认组件第一次请求数据
         * @param res JSON  数据请求成功后返回的数据
         * */
      SuccessGetCurrData(responseData) {
        this.data = responseData.data;
      },
      /*
         * 组件初始化入口
         * */
      init() {
        this.ajax(this.listMessTitle);
      },
      confirm() {
        this.$emit("cancel", "show");
      },

      //converter转换  'good'=>'优秀'
      converter(type) {
        switch (type) {
          case "good":
            type = "优秀";
            break;
          case "well":
            type = "良好";
            break;
          case "bad":
            type = "差";
            break;
        }
        return type;
      }
    }
  };
</script>
