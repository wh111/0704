<template>
  <div class="volunteerActivity_view">
    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <p>
          <span class="text-w">姓名：</span>
          <span>{{data.userName}}</span>
        </p>
      </el-col>
    </el-row>
    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <p>
          <span class="text-w">学校：</span>
          <span>{{data.userSchool}}</span>
        </p>
      </el-col>
    </el-row>
    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <p>
          <span class="text-w">专业：</span>
          <span>{{data.userMajor}}</span>
        </p>
      </el-col>
    </el-row>
    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <p>
          <span class="text-w">科室：</span>
          <span>{{data.depName}}</span>
        </p>
      </el-col>
    </el-row>
    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <fieldset class="layui-elem-field">
          <legend>考勤:</legend>
          <div class="layui-field-box">
            <el-row class=" table-back-one">
              <el-col :span="4" :offset="2">
                <p>
                  <span class="text-w2">实际出勤：</span>
                  <span>{{data.attendance.workAttendance}} 天</span>
                </p>
              </el-col>
              <!--<el-col :span="4" >-->
              <!--<p ><span class="text-w2">半工半休：</span><span>{{data.attendance.workAndRest}} 天</span></p>-->
              <!--</el-col >-->
              <el-col :span="4">
                <p>
                  <span class="text-w2">事假：</span>
                  <span>{{data.attendance.compassionateLeave}} 天</span>
                </p>
              </el-col>
              <el-col :span="4">
                <p>
                  <span class="text-w2">病假：</span>
                  <span>{{data.attendance.sickLeave}} 天</span>
                </p>
              </el-col>
              <el-col :span="4">
                <p>
                  <span class="text-w2">婚假：</span>
                  <span>{{data.attendance.marriageLeave}} 天</span>
                </p>
              </el-col>
            </el-row>
            <el-row class="  table-back-two-d">
              <el-col :span="4" :offset="2">
                <p>
                  <span class="text-w2">丧假：</span>
                  <span>{{data.attendance.funeralLeave}} 天</span>
                </p>
              </el-col>
              <el-col :span="4">
                <p>
                  <span class="text-w2">其他：</span>
                  <span>{{data.attendance.otherLeave}} 天</span>
                </p>
              </el-col>
              <el-col :span="4">
                <p>
                  <span class="text-w2">旷工：</span>
                  <span>{{data.attendance.absenteeism}} 天</span>
                </p>
              </el-col>
            </el-row>

          </div>

        </fieldset>
      </el-col>
    </el-row>

    <template v-if="role=='jxs'">
      <el-row class="lose-margin2">
        <el-col :span="20" :offset="2">
          <p><span class="text-w">考核等级：</span><span>{{converter(data.examinationLevel)}}</span></p>
        </el-col>
      </el-row>
    </template>

    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <p>
          <span class="text-w">发放月份：</span>
          <span>{{data.provideMonth | formatDate('yyyy-MM')}}</span>
        </p>
      </el-col>
    </el-row>
    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <p>
          <span class="text-w">发放金额：</span>
          <span>{{data.provideAmount}}</span>
        </p>
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
      if (userType == "jxs") {
        type = "yjx";
      } else {
        type = userType;
      }
      console.log(userType)
        console.log(type)
      this.listMessTitle.ajaxParams.url = "allowance/get/" + type + "/" + this.operailityData.id;
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
        let text = {good: "优秀", well: "良好", bad: "差"};
        return text[type] || type;
      }
    }
  };

</script>

