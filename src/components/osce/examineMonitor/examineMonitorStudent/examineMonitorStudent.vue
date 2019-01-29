<template>
  <!-- 考生考核信息 -->
  <div class="exmUserContent">
    <!-- 老师信息 (没有就不显示) -->
    <div class="teacherInfo" v-if="stationRoom.teacherList && stationRoom.teacherList.length">
      <el-row class="border">
        <el-col :span="6" class="teacherInfoItem" v-for="(item,tIndex) in stationRoom.teacherList" :key="tIndex"
                @click.native="selectTeacher(item.userId)">
          <img :src="getPhotoPath(item.userPhotoPath)" onerror="javascript:this.src='/static/image/defAvatar.png';">
          <p :class="{'active':teacherUserId === item.userId}">{{ item.userName }}</p>
        </el-col>
      </el-row>
      <!-- 教师头像 -->
      <div class="phontoContent">
        <img :src="getPhotoPath(teacherInfo.userPhotoPath)" onerror="javascript:this.src='/static/image/defAvatar.png';">
        <p class="teacherName">{{ teacherInfo.userName }}</p>
      </div>
      <!-- 当前时间 -->
      <div class="timeInfo">
        <p>当前时间</p>
        <p>{{ nowTime }}</p>
      </div>
      <!-- 其他内容 -->
      <p class="otherInfo">考核内容：{{ studentInfo.contentName }}</p>
      <p class="otherInfo">分站时间：{{ ((teacherInfo.timeLength || 0) / 60) | toFixed }}分钟</p>
      <p class="otherInfo">房间号：{{ exmContent.roomNum || '-'}}</p>
    </div>
    <!-- 考核信息 -->
    <div class="exmContentMain">
      <paper-show :style="{'maxHeight':dynamicHt+'px'}" v-if="stationRoom.stationType === 'THEORY'" :showData="paperInfo.paperContentList" showRight='Show'
                  showType="studentOption"></paper-show>
      <template v-else>
        <el-table align="center" :height="dynamicHt-(contentDataList.deductList.length ? 250 : 50)" :context="self" :data="contentDataList.detailsList"
                  :summary-method="getSummaries"
                  show-summary tooltip-effect="dark" class="tableShowMoreInfo" style="width: 100%;">
          <el-table-column label="项目" prop="classify" show-overflow-tooltip width="150"></el-table-column>
          <el-table-column label="评分标准及要求" prop="content" show-overflow-tooltip></el-table-column>
          <el-table-column label="标准分" width="80" prop="score" show-overflow-tooltip align="right"></el-table-column>
          <el-table-column label="得分" prop="mark" show-overflow-tooltip width="100" align="right">
            <template scope="scope">
              {{ scope.row.mark || 0 }}
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
        <div style="padding: 5px">
          老师评价：<span>{{ exmContent.evaluate || '-' }}</span>
        </div>
      </template>
    </div>
    <!-- 考生信息 -->
    <div class="studentInfo">
      <p class="studentInfoNum">当前考核人员（{{ nowId }}/{{ userSums }}）</p>
      <div class="studentPhoto">
        <img :src="getPhotoPath(studentInfo.userPhotoPath)" width="120" height="120" alt="" onerror="javascript:this.src='/static/image/defAvatar.png';">
      </div>
      <!-- 基本信息 -->
      <p class="otherInfo">姓名：{{ studentInfo.userName }}</p>
      <p class="otherInfo">性别：{{ studentInfo.userSex | typeText }}</p>
      <p class="otherInfo">结束倒计时：{{ countDown }}</p>
      <p class="otherInfo">当前考生得分：{{ exmContent.totalMark || 0 }}</p>
      <!-- 操作按钮 -->
      <p class="changeStudent">
        <el-button type="info" @click="changeStudent('p')" v-if="nowId > 1">上一人</el-button>
        <el-button type="success" @click="changeStudent('n')" v-if="nowId < userSums">下一人</el-button>
      </p>
      <!-- 服务器连接状态 -->
      <p class="serverStatus error" v-if="isError">服务器连接异常</p>
    </div>
  </div>
</template>

<script>
  let sd = null; // 倒计时
  let studentTime = null;
  let isLive = true;
  import api from '../api';
  import paperShow from '../../examineInterval/examineIntervalSetInfo/paperContent/view';

  export default {
    props: ['nowIndex', 'index', 'sceneId', 'stationId', 'roomId', 'userSum'],
    data () {
      return {
        isError: false,
        dynamicHt: 600,
        userSums: this.userSum || 0,
        self: this,
        nowTime: '-', // 当前时间
        countDown: '00：00：00', // 倒计时
        // http://218.241.184.2:9014/#!/project/api/detail?projectID=15&apiID=512
        // 考核内容
        exmContent: {
          scoreTableId: '0',
          scheduleId: '0',
          markId: '-',
          caseName: '-',
          totalScore: '-',
          totalMark: '-',
          evaluate: '-',
          detailsList: [ //
            // {
            //   "tableDetailsId": "1",
            //   "classify": "分类",
            //   "content": "考核内容",
            //   "score": "5",
            //   "detailOrder": "1",
            //   "scheduleDetailsId": "1",
            //   "mark": "2.5"
            // }
          ]
        },
        contentDataList: { // 考核评分内容展示
          detailsList: [],
          deductList: []
        },
        // 学生信息
        studentInfo: { // 没有头像信息
          userId: '1',
          userName: '-',
          userSex: '-',
          userNum: '-',
          timeLength: 0, // 单位是分钟？
          contentName: '-',
          mark: '-',
          nowIndex: '1',
          startTime: '-',
          endTime: '-',
          examStatus: 'NOTEXAM',
          arrangementId: '1',
          markId: '-'
        },
        timer: '',
        // 考站信息
        stationRoom: {},
        // 当前选中老师信息
        teacherInfo: {},
        // 试卷信息
        paperInfo: {
          paperContentList: [],
          totalScore: ''
        },
        // 其他
        // sceneId: this.sceneId, // 场次id
        // stationId: this.stationId, // 站点id
        arrangementId: 0, // 考核安排id
        nowId: this.nowIndex, // 考核顺序
        // roomId: 5, // 房间id
        teacherId: 0, // 监考老师id
        teacherUserId: 0, // 监考老师用户id
        initTime: '',
        deductSumScore: 0 // 总扣分
      };
    },
    methods: {
      showDefImg () {
        return '/static/image/defAvatar.png';
      },
      // 获取考核内容统计
      getSummaries () {
//        const sums = ['评价意见', this.exmContent.evaluate, this.exmContent.totalScore, this.exmContent.totalMark];
        const sums = ['总分', '', this.exmContent.totalScore, this.exmContent.totalMark];
        return sums;
      },
      // 选择老师
      selectTeacher (id) {
        this.teacherUserId = id;
        this.getTeacherInfo();
      },
      /*********************** 初始化数据 ****************************/
      // 结束倒计时
      getCountDown () {
        clearInterval(sd);
        let endTime = new Date(this.studentInfo.endTime || new Date()).getTime();
        let _this = this;
        console.log('时差：' + parseInt((endTime - this.initTime) / 1000));

        sd = setInterval(() => {
          let t = endTime - this.initTime;
          let h = 0;
          let m = 0;
          let s = 0;
          if (t >= 0) {
            t = parseInt(t / 1000);
            h = Math.floor(t / 60 / 60 % 24);
            m = Math.floor(t / 60 % 60);
            s = Math.floor(t % 60);
            h = _this.getCpl(h);
            m = _this.getCpl(m);
            s = _this.getCpl(s);
            _this.countDown = h + '：' + m + '：' + s;
          } else {
            clearInterval(sd);
            _this.countDown = '00：00：00';
          }
        }, 1000);
      },
      // 补全时间
      getCpl (s) {
        return s < 10 ? '0' + s : s;
      },
      // 当前时间
      getNowTime () {
        this.ajax({
          ajaxLoading: false,
          ajaxSuccess: (res) => {
            this.initTime = res.data;
            clearInterval(this.timer);
            this.timer = setInterval(() => {this.nowTime = new Date(this.initTime += 1000).toLocaleString().split(' ')[1]; }, 1000);
          },
          ajaxParams: {
            url: 'nowTime',
            method: 'get',
            params: {}
          }
        });
        // let _this = this
//        setInterval(() => {
//          _this.nowTime = ((new Date().toLocaleString()).split(' '))[1]
//
//        }, 1000)
      },
      // 点击老师获取学生的考核内容
      getContentByTeacher () {
        let params = this.$util._.defaultsDeep({}, {
          id: this.teacherId,
          sceneId: this.sceneId,
          stationId: this.stationId,
          arrangementId: this.arrangementId
        });
        this.ajax({
          ajaxLoading: false,
          ajaxSuccess: 'updateExmContent',
          ajaxParams: {
            url: api.teacherGet.path + this.teacherId,
            method: api.teacherGet.method,
            params
          }
        });
      },
      // 考生切换
      changeStudent (type) {
        this.getNowTime();
        clearTimeout(studentTime);
        if (type) {
          type === 'n' ? ++this.nowId : --this.nowId;
        }
        this.getStudentInfo();
      },
      // 获取学生信息
      getStudentInfo () {
        let params = this.$util._.defaultsDeep({}, {
          nowIndex: this.nowId,
          sceneId: this.sceneId,
          stationId: this.stationId,
          roomId: this.roomId
        });
        clearTimeout(studentTime);
        this.ajax({
          error: () => this.isError = true,
          ajaxLoading: false,
          ajaxSuccess: 'updateStudentInfo',
          ajaxParams: {
            url: api.examUserGet.path,
            method: api.examUserGet.method,
            params
          }
        });
      },
      // 获取老师信息
      getTeacherInfo () {
        let params = this.$util._.defaultsDeep({}, {
          sceneId: this.sceneId,
          teacherId: this.teacherUserId
        });
        this.ajax({
          ajaxLoading: false,
          ajaxSuccess: 'getTeacherInfoData',
          ajaxParams: {
            url: api.stationGet.path,
            method: api.stationGet.method,
            params
          }
        });
      },
      /************************* 更新数据 *********************************/
      // 获取老师数据
      getTeacherInfoData (res) {
        this.teacherInfo = res.data;
        this.teacherId = res.data.id;
        this.getContentByTeacher();
      },
      // 更新考核内容数据
      updateExmContent (res) {
        if (res.data) {
          this.exmContent = res.data;
          this.studentInfo.totalMark = res.data.totalMark;
          this.contentDataList = this.conductListData(res.data);
        } else {
          this.contentDataList = { // 考核评分内容展示
            detailsList: [],
            deductList: []
          };
          this.exmContent.detailsList = [];
        }
      },
      //处理获取到列表数据
      conductListData (data) {
        let listData = {};
        //处理列表外层数据
        let deductListArr = []; // 扣分项
        let detailsListArr = []; // 评分项
        let detailsList = data.detailsList;
        let length = detailsList.length;
        this.deductSumScore = 0;
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
      // 更新考生信息
      updateStudentInfo (res) {
        let that = this;
        this.studentInfo = res.data;
        this.arrangementId = res.data.arrangementId;
        // clearInterval(sd);
        this.getCountDown();
        if (this.stationRoom.stationType === 'THEORY') { // 理论考核
          this.getPaperContent();
        } else { // 非理论考核（SP、普通）
          this.getTeacherInfo();
        }
        if (typeof res.data != 'object') {
          this.isError = true;
        } else {
          this.isError = false;
        }
        clearTimeout(studentTime);
        if (res.data.examStatus === 'ONGOING') { // 如果当前学生为考核中就继续获取最新的数据
          studentTime = setTimeout(() => {
            that.getStudentInfo();
          }, 5 * 1000);
        }
      },
      // 获取试卷内容（理论考核）
      getPaperContent () {
        let opt = {
          ajaxLoading: false,
          ajaxSuccess: res => {
            this.paperInfo = res.data;
          },
          ajaxParams: {
            url: api.paperGet.path,
            params: {
              arrangementId: this.arrangementId
            }
          }
        };
        this.ajax(opt);
      },
      // 获取头像地址
      getPhotoPath (path) {
        return path && this.$store.getters.getEnvPath.http + path || '/static/image/defAvatar.png';
      }
    },
    created () {
      this.stationRoom = this.$store.state.examineMonitor.index.stationRoom;
      this.teacherUserId = this.stationRoom.teacherList && this.stationRoom.teacherList.length && this.stationRoom.teacherList[0].userId || '';
      this.changeStudent();
    },
    beforeDestroy () {
      isLive = false;
      clearTimeout(studentTime);
      clearInterval(this.timer);
    },
    components: {
      paperShow
    }
  };

</script>

<style lang="scss">
  @import '~@/assets/ambuf/css/examineMonitor_v1.0/studentInfo';

</style>
