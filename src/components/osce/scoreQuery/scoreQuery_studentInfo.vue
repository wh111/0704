<template>
  <!-- 考生考核信息 -->
  <div class="exmUserContent" style="min-height:500px;">
    <!-- 老师信息 -->
    <div class="teacherInfo" v-if="teacherinfo.length && studentInfo.stationType !== 'THEORY'">
      <el-row class="border">
        <el-col :span="6" class="teacherInfoItem" v-for="(item,index) in teacherinfo" :key="index" @click.native="selectTeacher(item)">
          <img :src="getPhotoPath(item.userPhotoPath)" onerror="javascript:this.src='/static/image/defAvatar.png';">
          <p :class="{'active':teacherUserId === item.id}">{{ item.userName }}</p>
        </el-col>
      </el-row>
      <!-- 教师头像 -->
      <div class="phontoContent">
        <img :src="getPhotoPath(selectTeaData.userPhotoPath)" onerror="javascript:this.src='/static/image/defAvatar.png';">
      </div>
      <!-- 其他内容 -->
      <p class="otherInfo">考官姓名：{{ selectTeaData.userName || '-' }}</p>
      <!--<p class="otherInfo">考官评语：{{ scheduleData.evaluate || '-' }}</p>-->
    </div>
    <!-- 考核信息 -->
    <div class="exmContentMain">
      <paper-show :style="{'maxHeight':dynamicHt+'px'}" v-if="studentInfo.stationType === 'THEORY'" :showData="paperInfo.paperContentList" showRight='Show'
                  showType="studentOption"></paper-show>
      <template v-else>
        <el-col align="right" v-if="['ORDINARY', 'SP'].includes(studentInfo.stationType)">
          <el-button type="info" size="small" @click="deriveScore">{{ 'export' | sysLan }}评分表</el-button>
          <el-button type="info" size="small" @click="printScore" style="margin-right: 15px">{{ 'print' | sysLan }}评分表</el-button>
        </el-col>
        <el-table align="center" :max-height="dynamicHt-(contentDataList.deductList.length ? 200 : 0)" :context="self" :data="contentDataList.detailsList" :summary-method="getSummaries"
                  show-summary tooltip-effect="dark" class="tableShowMoreInfo" style="width: 100%;">
          <el-table-column label="项目" prop="classify" show-overflow-tooltip width="150"></el-table-column>
          <el-table-column label="评分标准及要求" prop="content" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column label="标准分" width="80" prop="score" show-overflow-tooltip align="right"></el-table-column>
          <el-table-column label="得分" prop="mark" show-overflow-tooltip width="100" align="right">
            <template scope="scope">
              {{ scope.row.mark || '-' }}
            </template>
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
        <el-form align="right" :inline="true" style="margin-bottom: -15px;">
          <el-form-item label="考官签名：" style="margin-bottom: 0;">
            <img class="teacherAutograph" :src="getStaticUrl(scheduleData.signImage)" alt="">
          </el-form-item>
        </el-form>
      </template>
    </div>
    <!-- 考生信息 -->
    <div class="studentInfo">
      <p class="studentInfoNum">考生</p>
      <div class="studentPhoto">
        <img :src="getPhotoPath(studentInfo.userPhotoPath)" onerror="javascript:this.src='/static/image/defAvatar.png';">
      </div>
      <!-- 基本信息 -->
      <p class="otherInfo">姓名：{{ studentInfo.userName }}</p>
      <p class="otherInfo">学号：{{ studentInfo.userNum }}</p>
      <p class="otherInfo">性别：{{ (studentInfo.userSex || '-') | typeText }}</p>
      <!-- 老师评价 -->
      <p class="otherInfo">老师评价：{{ scheduleData.evaluate || '-' }}</p>
    </div>

    <!--导出弹窗-->
    <Modal :mask-closable="false" height="200" v-model="deriveModal" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="contentHeader.deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗？</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="exportUrl">
              <el-button @click="cancel('derive')" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="cancel('derive')">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>

    <!--打印弹窗-->
    <Modal :mask-closable="false" v-model="printDataModal" height="200" class-name="vertical-center-modal"
           :width="1100">
      <modal-header slot="header" :parent="self" :content="contentHeader.printDataId"></modal-header>
      <print-data v-if="printDataModal" @cancel="cancel" @print="printDone">
        <print-score :printData="printData"></print-score>
      </print-data>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import api from './api';
  import printData from '../../../components/common/print.vue';
  import printScore from './scoreQuery_printScore';
  import paperShow from '../examineInterval/examineIntervalSetInfo/paperContent/view';

  export default {
    props: ['sceneId', 'studentId', 'markId', 'stationId', 'arrangementId'],
    data () {
      return {
        dynamicHt: 500,
        self: this,
        nowTime: '-', // 当前时间
        // 考核内容
        scheduleData: {
          userNum: ''
        },
        // 考核内容
        contentDataList: {
          detatilsList: [],
          deductList: []
        },
        // 试卷信息
        paperInfo: {
          paperContentList: [],
          totalScore: ''
        },
        teacherUserId: '',
        // 老师信息
        teacherinfo: {},
        // 学生信息
        studentInfo: {},
        // 选中的老师
        selectTeaData: {},
        // 获取老师列表
        teacherList: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.stationGet.path + '/' + this.markId,
            params: {}
          }
        },
        //获取老师获取考站监考老师列表
        scheduleList: {
          ajaxSuccess: 'scheduleListData',
          ajaxParams: {
            url: api.teacherGet.path,
            params: {}
          }
        },
        printDataModal: false,
        deriveModal: false,
        contentHeader: {
          deriveId: {
            id: 'deriveId',
            title: '导出评分表'
          },
          printDataId: {
            id: 'printDataId',
            title: '打印评分表'
          }
        },
        exportUrl: '',
        printData: [],
        deductSumScore: 0 // 总扣分
      };
    },
    methods: {
      // 获取考核内容统计
      getSummaries () {
        const sums = ['总分', '', this.scheduleData.totalScore, this.scheduleData.totalMark];
        return sums;
      },
      // 获取试卷内容（理论考核）
      getPaperContent () {
        let opt = {
          ajaxSuccess: res => this.paperInfo = res.data,
          ajaxParams: {
            url: api.paperGet.path,
            params: {
              arrangementId: this.arrangementId
            }
          }
        };
        this.ajax(opt);
      },
      /*********************** 初始化数据 ****************************/
      //通过get请求列表数据
      updateListData (responseData) {
        let data = responseData.data;
        this.studentInfo = data;
        this.teacherinfo = data.teacherList;
        if (data.stationType === 'THEORY') { // 理论考核
          this.getPaperContent();
        } else { // 非理论考核（SP、普通）
          //初始化选择老师
          this.selectTeacher(data.teacherList[0]);
        }
      },
      //选择老师获取列表数据
      scheduleListData (responseData) {
        let data = responseData.data;
        if (data) {
          this.scheduleData = data;
          this.contentDataList = this.conductListData(data);
        } else {
          this.scheduleData = {};
        }
      },
      //处理获取到列表数据，为添加评分服务
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
        console.log(deductListArr);
        return listData;
      },
      /********************** 获取数据 ********************************/
      // 获取老师列表
      getTeacherList () {
        this.teacherList.ajaxParams.params = Object.assign(this.teacherList.ajaxParams.params, {
          markId: this.markId,
          sceneId: this.sceneId,
          arrangementId: this.arrangementId
        });
        this.ajax(this.teacherList);
      },
      //获取右侧列表 选择老师的时候调用
      selectTeacher (data) {
        this.teacherUserId = data.id;
        this.selectTeaData = data;
        this.scheduleList.ajaxParams.params = Object.assign(this.scheduleList.ajaxParams.params, {
          teacherId: data.id,
          arrangementId: this.arrangementId
        });
        this.ajax(this.scheduleList);
      },
      // 获取头像地址
      getPhotoPath (path) {
        return this.getStaticUrl(path) || '/static/image/defAvatar.png';
      },
      getStaticUrl (path) {
        return path && this.$store.getters.getEnvPath.http + path || '';
      },
      // 获取打印的评分表
      getAllScoreTable (callFun) {
        let opt = {
          ajaxSuccess: res => callFun(res),
          ajaxParams: {
            url: api.stationScoreTable.path,
            method: api.stationScoreTable.method,
            params: {
              teacherId: this.teacherUserId,
              arrangementId: this.arrangementId
            }
          }
        };
        this.ajax(opt);
      },
      // 打印评分表
      printScore () {
        this.getAllScoreTable(res => {
          this.printData = [res.data];
          this.openModel('printData');
        });
      },
      // 打印完成
      printDone () {
        this.cancel('printData');
        this.printData = null;
      },

      // 导出评分表
      deriveScore () {
        this.exportUrl = '/api/scene/examUser/station/teacher/exportWord?teacherId=' + this.teacherUserId + '&arrangementId=' + this.arrangementId;
        this.openModel('derive');
      },
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      }
    },
    created () {
      this.getTeacherList();
    },
    components: {
      printScore, printData, paperShow
    }
  };

</script>

<style lang="scss">
  @import '~@/assets/ambuf/css/examineMonitor_v1.0/studentInfo';

  .teacherAutograph {
    margin-top: 10px;
    margin-right: 40px;
    max-height: 100px;
  }
</style>
