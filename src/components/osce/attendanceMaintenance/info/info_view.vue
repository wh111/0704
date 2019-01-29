<template>
  <!-- 考生考核信息 -->
  <div class="exmUserContent">

    <div class="add-score-head">
      <span class="add-score-l">{{examUserData.sceneName}}</span>
      <span class="add-score-r">满分({{ examUserData.scoreTable.totalScore }})</span>
    </div>
    <hr>
    <!-- 老师信息(非理论考核的时候才显示) -->
    <div class="teacherInfo " style="top: 31px;padding-top: 0" v-if="operailityData.stationType !== 'THEORY'">
      <!-- 教师头像 -->
      <p class="teacher-header">考官</p>
      <div class="phontoContent">
        <img :src="getPhotoPath(examUserData.teacher.teacherUserPhotoPath)" onerror="javascript:this.src='/static/image/defAvatar.png';">
      </div>
      <!-- 其他内容 -->
      <p class="otherInfo ">姓名：{{examUserData.teacher.teacherUserName}}</p>
      <p class="otherInfo ">房间号：{{examUserData.roomNum}}</p>
      <p class="otherInfo ">考核内容：{{examUserData.contentName}}</p>
    </div>
    <!-- 考核信息 -->
    <div class="exmContentMain " style="top: 31px;">
      <!-- 理论考核显示试卷 -->
      <paper-show v-if="operailityData.stationType === 'THEORY'" :showData="paperData.paperContentList"></paper-show>
      <!-- 非理论考核 -->
      <el-form v-else ref="formValidate" label-width="80px">
        <!--列表数据-->
        <el-table align="center" :max-height="contentDataList.deductList.length ? 300 : 400" show-summary :data="contentDataList.detailsList"
                  tooltip-effect="dark" highlight-current-row :summary-method="getSummaries"
                  style="width: 100%;height: 100%"
                  class="add-scope">
          <el-table-column prop="classify" label="项目" width="150">
          </el-table-column>
          <el-table-column prop="content" label="评分标准及要求">
          </el-table-column>
          <el-table-column prop="score" label="标准分" align="right" width="80">
          </el-table-column>
          <el-table-column prop="mark" label="得分" align="right" width="100">
          </el-table-column>
        </el-table>
        <!--扣分项-->
        <el-table v-if="contentDataList.deductList.length" align="center" max-height="200"
                  :data="contentDataList.deductList" tooltip-effect="dark" highlight-current-row
                  style="width: 100%;height: 100%" class="add-scope">
          <el-table-column prop="classify" label="项目" width="150">
          </el-table-column>
          <el-table-column prop="content" label="扣分标准及要求">
          </el-table-column>
          <el-table-column prop="score" label="标准分" align="right" width="80">
          </el-table-column>
          <el-table-column prop="mark" label="扣分" align="center" width="100">
            <template scope="scope">
              <span class="el-checkbox__input" :class="{'is-checked': scope.row.mark > 0}">
                <span class="el-checkbox__inner"></span>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <!-- 考生信息 -->
    <div class="studentInfo" style="top: 31px;">
      <p class="studentInfoNum">考生</p>
      <div class="studentPhoto">
        <img :src="getPhotoPath(examUserData.examUser.userPhotoPath)" onerror="javascript:this.src='/static/image/defAvatar.png';">
      </div>
      <p class="otherInfo">姓名：{{examUserData.examUser.userName}}</p>
      <p class="otherInfo">性别：{{examUserData.examUser.userSex | typeText}}</p>
      <!-- 非理论考核才显示点评 -->
      <p class="otherInfo" v-if="operailityData.stationType !== 'THEORY'">点评：{{ examUserData.scoreTable.evaluate || '-' }}</p>
      <!-- 基本信息 -->
      <!--<p class="otherInfo">姓名：{{ studentInfo.userName }}</p>-->
      <!-- 操作按钮 -->
    </div>

  </div>
</template>

<script>
  import paperShow from '../../examineInterval/examineIntervalSetInfo/paperContent/view';

  let Util;
  export default {
    props: ['url', 'operailityData'],
    data () {
      return {
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        //选择内容id
        selectContentId: '',
        //获取考站监考老师评分详情form
        examUserForm: {
          scheduleId: this.operailityData.scheduleId, //教师评分id
          teacherId: this.operailityData.teacherId, //教师id
          arrangementId: this.operailityData.arrangementId //考核安排id
        },
        //获取的考生详情数据
        examUserData: {
          'teacher': {},
          'examUser': {},
          'scoreTable': {
            detailsList: []
          }
        },
        //添加用的form列表
        contentDataList: {
          detatilsList: [],
          deductList: []
        },
        paperData: { // 理论考核试卷数据
          paperContentList: []
        },
        //当前组件默认请求 学生数据,ajax处理的 基础信息设置
        examUserMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.url.scheduleGet.path,
            params: {}
          }
        },

        deductSumScore: 0 // 总扣分
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        if (this.operailityData.stationType === 'THEORY') { // 理论考核
          this.getPaperContent();
        } else {
          this.setTableData();
        }
      },

      // 获取试卷信息
      getPaperContent () {
        let opt = {
          ajaxSuccess: res => {
            let {markSchedule: paperData, examUser} = res.data;
            this.paperData = paperData;
            this.examUserData.examUser = examUser;
          },
          ajaxParams: {
            url: this.url.stationPaperGet.path,
            params: {
              scheduleId: this.operailityData.scheduleId, //教师评分id
              arrangementId: this.operailityData.arrangementId //考核安排id
            }
          }
        };
        this.ajax(opt);
      },

      //通过get请求列表数据
      updateListData (responseData) {
        let data = responseData.data;
        if (!data) return;
        this.examUserData = data;
        this.contentDataList = this.conductListData(data.scoreTable);
      },

      //处理获取到列表数据
      conductListData (data) {
        let listData = {};
        //处理列表外层数据
        let deductListArr = []; // 扣分项
        let detailsListArr = []; // 评分项
        let detailsList = data.detailsList;
        let length = detailsList.length;
        for (let i = 0; i < length; i++) {
          let temp = detailsList[i];
          temp.mark = Number(temp.mark) || 0;
          if (temp.isPoints && temp.mark) { // 累加扣分项
            this.deductSumScore += temp.score;
          }
          Array.push.call(null, temp.isPoints ? deductListArr : detailsListArr, temp);
        }
        listData.detailsList = detailsListArr;
        listData.deductList = deductListArr;
        return listData;
      },

      setTableData () {
        this.examUserMessTitle.ajaxParams.params = Object.assign(this.examUserMessTitle.ajaxParams.params, this.examUserForm);
        this.ajax(this.examUserMessTitle);
      },
      //最后一行总计
      getSummaries (param) {
        const {
          columns,
          data
        } = param;
        const sums = [];
        let poor = 0;
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总分';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += '';
          } else {
            sums[index] = ' ';
          }
        });
        poor = sums[sums.length - 1] - this.deductSumScore; // 总得分减去扣分项的分
        sums[sums.length - 1] = poor > 0 ? poor : 0; // 小于0就等于0
        return sums;
      },

      // 获取头像地址
      getPhotoPath (path) {
        return path && this.$store.getters.getEnvPath.http + path || '/static/image/defAvatar.png';
      }
    },
    created () {
      this.init();
    },
    components: {
      paperShow
    }
  };

</script>

<style lang="scss">
  @import '~@/assets/ambuf/css/examineMonitor_v1.0/studentInfo';

</style>
