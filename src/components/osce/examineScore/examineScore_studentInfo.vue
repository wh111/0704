<template>
  <!-- 考生考核信息 -->
  <div class="exmUserContent" style="min-height:600px;">
    <!-- 选择评分表 -->
    <el-row v-if="studentInfo.randomType === 'TEACHER_SELECT' && !studentInfo.contentId">
      <el-form ref="selectContentForm" :model="selectContentForm" label-width="80px" :inline="true"
               :rules="selectContent">
        <el-form-item label="评分表：">
          <el-select v-model="selectContentForm.contentId" placeholder="请选择评分表" @change="getPriveContent"
                     :disabled="selectContentForm.select">
            <el-option v-for="item in selectContentOption" :key="item.id" :label="item.contentName"
                       :value="item.contentId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="selectContentConfim" :disabled="selectContentForm.select">确认选择</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 考核信息 -->
    <div class="exmContentMain">
      <el-form ref="formValidate" label-width="80px">
        <!--列表数据-->
        <el-table border align="center" :height="tableMaxHeight" show-summary
                  :data="contentDataList.detailsList"
                  tooltip-effect="dark" highlight-current-row :summary-method="getSummaries"
                  style="width: 100%;height: 100%" class="add-scope">
          <el-table-column prop="classify" label="项目" width="150">
          </el-table-column>
          <el-table-column align="left" prop="content" label="评分标准及要求">
          </el-table-column>
          <el-table-column prop="score" label="标准分" align="right" width="80">
          </el-table-column>
          <el-table-column prop="mark" label="得分" align="right" width="100">
            <template scope="scope">
              <el-form :model="scope.row" :rules="rules.addScore" :ref="'formValidate'+[scope.$index+'scope']"
                       label-width="80px">
                <el-form-item prop="mark" error="cuo" label-width="0px">
                  <el-input v-if="studentInfo.examStatus === 'ONGOING'" @blur="markChange(scope.row)"
                            type="number" @change="scoreInputChange" :min="0" :max="scope.row.score"
                            v-model.number="scope.row.mark"></el-input>
                  <el-input v-else @blur="markChange(scope.row)" type="number" @change="scoreInputChange" :min="0"
                            :max="scope.row.score" v-model.number="scope.row.mark" :disabled="!chgScore"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
        <!--扣分项-->
        <el-table border v-if="contentDataList.deductList.length" align="center" max-height="200"
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
              <el-form :model="scope.row">
                <el-form-item prop="mark" label-width="0px">
                  <el-checkbox v-if="studentInfo.examStatus === 'ONGOING'" v-model="scope.row.mark" :true-label="1" :false-label="0"
                               @change="changeDeduct(scope.row)"></el-checkbox>
                  <el-checkbox v-else v-model="scope.row.mark" :true-label="1" :false-label="0" :disabled="!chgScore"
                               @change="changeDeduct(scope.row)"></el-checkbox>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
        <br>
        <el-form-item label="点评">
          <el-row>
            <el-col :span="20">
              <el-input type="textarea" resize="none" v-model="contentDataList.evaluate" :rows="3"
                        v-if="studentInfo.examStatus === 'ONGOING'"></el-input>
              <el-input type="textarea" resize="none" v-model="contentDataList.evaluate" :rows="3" v-else
                        :disabled="!chgScore"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <!-- 考生信息 -->
    <div class="studentInfo">
      <p class="studentInfoNum">当前考核人员（{{ nowId }}/{{ userSums }}）</p>
      <div class="studentInfoBox">
        <div class="studentPhotoPos">
          <img :src="getPhotoPath(studentInfo.userPhotoPath)">
        </div>
        <!-- 基本信息 -->
        <p class="otherInfo">姓名：{{ studentInfo.userName }}</p>
        <p class="otherInfo">性别：{{ studentInfo.userSex | typeText }}</p>
        <p class="otherInfo">结束倒计时：{{ countDown }}</p>
        <p class="otherInfo">当前考生得分：{{ studentInfo.totalMark || 0 }}</p>
      </div>
      <!-- 操作按钮 -->
      <p align="center" style="margin-top:20px;">
        <!-- <el-button v-if="studentInfo.examStatus === 'NOTEXAM' && studentInfo.contentId" type="danger" @click="idVerification">身份确认并开始考核</el-button> -->
        <el-button v-if="studentInfo.examStatus === 'NOTEXAM' || studentInfo.examStatus ===  'DRAW'" type="danger"
                   @click="idVerification">身份确认并开始考核
        </el-button>
        <el-button v-if="studentInfo.examStatus === 'ONGOING'"
                   :disabled="studentInfo.randomType === 'TEACHER_SELECT' && !studentInfo.contentId && !selectContentForm.select"
                   type="danger" @click="finishAndSub">考核结束提交分数
        </el-button>
        <el-button v-if="!chgScore && studentInfo.examStatus === 'FINISH'"
                   :disabled="studentInfo.randomType === 'TEACHER_SELECT' && !studentInfo.contentId && !selectContentForm.select"
                   type="danger" @click="changeScore">修改分数
        </el-button>

        <load-btn @listenSubEvent="listenSubEvent" type="success" v-if="chgScore" :btnData="loadBtn"></load-btn>
        <el-button v-if="!studentInfo.contentId && studentInfo.randomType !== 'TEACHER_SELECT'" type="warning"
                   @click="sample">抽题
        </el-button>
      </p>
      <p class="changeStudent">
        <el-button type="info" @click="changeStudent('p')" v-if="nowId > 1">上一人</el-button>
        <el-button type="success" @click="changeStudent('n')" v-if="nowId < userSums">下一人</el-button>
      </p>
      <!-- 服务器连接状态 -->
      <p class="serverStatus error" v-if="isError">服务器连接异常</p>
      <p class="serverStatus" v-else>服务器连接正常</p>
      <div class="studentVideoBox">
        <!-- 监控视频 -->
        <exa-video :roomId="roomId"></exa-video>
      </div>
    </div>
  </div>
</template>

<script>
  let sd = null; // 倒计时
  let studentInfoTime = null;
  let Util = null;
  import {
    selectContent,
    addScore as rules
  } from './rules';
  import api from './api';
  import exaVideo from '../examineMonitor/examineMonitorRoom/examineMonitorRoom_video'; // 监控摄像头

  export default {
    // props: ['nowIndex', 'index', 'sceneId', 'stationId', 'roomId', 'userSum'],
    props: ['sceneId', 'stationId', 'roomId', 'userSum', 'teacherId'],
    data () {
      return {
        rules,
        selectContent,
        isError: false,
        dynamicHt: 600,
        tableMaxHeight: 0,
        chgScore: false,
        userSums: this.userSum || 0,
        self: this,
        nowTime: '-', // 当前时间
        countDown: '00：00：00', // 结束倒计时

        loadBtn: {
          title: '提交分数',
          callParEvent: 'listenSubEvent'
        },

        userId: '',
        teacherUserId: '', // 当前登录老师的用户id

        selectContentOption: null,
        selectContentForm: {contentId: '', select: false},

        // 学生信息
        studentInfo: { // 没有头像信息
          userId: '',
          userName: '-',
          userSex: '-',
          userNum: '-',
          randomType: '',
          timeLength: 0, // 单位是分钟？
          contentId: '',
          contentName: '-',
          mark: '-',
          nowIndex: '1',
          startTime: '-',
          endTime: '',
          examStatus: '-',
          arrangementId: '1',
          markId: ''
        },
        //获取的内容列表数据 （会合并成）
        contentDataList: {
          detailsList: [],
          deductList: [],
          evaluate: ''
        },
        // 其他
        // sceneId: this.sceneId, // 场次id
        // stationId: this.stationId, // 站点id
        arrangementId: 0, // 考核安排id
        nowId: 1, // 考核顺序
        // roomId: 5, // 房间id
        // teacherId: 0, // 监考老师id
        addMessTitle: {
          type: 'add',
          ajaxLoading: false,
          successTitle: '评分成功!',
          errorTitle: '评分失败!',
          ajaxSuccess: 'saveCase',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true, //  //使用Content-Type: application/json
            url: api.submit.path,
            method: api.submit.method,
            data: {}
          }
        },
        contentIds: [], // 评分项id集
        deductSumScore: 0, // 总扣分
        cacheContent: {} // 缓存考核内容（老师手工选择考核内容预览缓存）
      };
    },
    methods: {
      /*********************** 初始化数据 ****************************/
      // 当前时间
      getNowTime () {
        let _this = this;
        setInterval(() => {
          _this.nowTime = ((new Date().toLocaleString()).split(' '))[1];
        }, 1000);
      },
      // 考生切换
      changeStudent (type) {
        this.contentDataList.detailsList.length = 0;
        this.contentDataList.deductList.length = 0;
        this.contentDataList.evaluate = '';
        clearTimeout(studentInfoTime);
        if (type) {
          type === 'n' ? ++this.nowId : --this.nowId;
          this.selectContentForm = {contentId: '', select: false};
        }
        let params = this.$util._.defaultsDeep({}, {
          nowIndex: this.nowId,
          sceneId: this.sceneId,
          stationId: this.stationId,
          roomId: this.roomId
        });
        this.ajax({
          ajaxSuccess: 'updateStudentInfo',
          error: () => this.isError = true,
          ajaxParams: {
            url: api.examUserGet.path,
            method: api.examUserGet.method,
            params
          }
        });
      },
      // 抽题
      sample () {
        let params = this.$util._.defaultsDeep({}, {
          sceneId: this.sceneId,
          stationId: this.stationId,
          arrangementId: this.arrangementId
        });
        this.ajax({
          ajaxSuccess: (res) => {
            // 抽题返回contentId 才能进行获取考核内容
            if (res.data) {
              this.studentInfo.contentId = res.data;
              this.successMess('抽题成功');
              this.setContentList();
            } else {
              this.errorMess('抽题失败，请重试！');
            }
          },
          ajaxError: () => {
            this.isError = true;
            this.errorMess('抽题失败，请重试！');
          },
          ajaxParams: {
            url: api.random.path,
            method: api.random.method,
            params
          }
        });
      },
      // 身份确认
      idVerification () {
        if (!this.checkSceneStatus()) {
          return;
        }
        if (this.studentInfo.sceneType === 'STANDARD') { // 规范考核
          let nowTime = new Date().getTime();
          if (nowTime < new Date(this.studentInfo.startTime).getTime()) {
            this.errorMess('该考生还未到达考核时间！');
            return;
          }
          // if (nowTime > new Date(this.studentInfo.endTime).getTime()) {
          //   this.errorMess('该考生已过考核时间！');
          //   return
          // }
        }
        let data = this.$util._.defaultsDeep({}, {
          id: this.arrangementId,
          userId: this.userId,
          sceneId: this.sceneId,
          stationId: this.stationId,
          roomId: this.roomId
        });
        this.ajax({
          ajaxSuccess: (res) => {
            this.successMess('身份确认操作成功');
            this.studentInfo.examStatus = 'ONGOING';
            // 修改评分状态不再请求数据
            clearTimeout(studentInfoTime);
          },
          ajaxError: () => {
            this.isError = true;
            this.errorMess('身份确认操作失败');
          },
          ajaxParams: {
            url: api.modiryStatus.path,
            method: api.modiryStatus.method,
            data
          }
        });
      },
      // 考核结束提交分数
      finishAndSub () {
        if (!this.checkSceneStatus()) {
          return;
        }
        this.studentInfo.examStatus = 'FINISH';
        this.contentDataList.examStatus = 'FINISH';
        this.addMessTitle.ajaxParams.url = api.submitFinish.path;
        this.listenSubEvent(); // 提交评分
      },
      // 修改评分
      changeScore () {
        // 改变一个状态让提交评分按钮出现
        this.chgScore = true;
        this.addMessTitle.ajaxParams.url = api.submit.path;
        // 修改评分状态不再请求数据
        clearTimeout(studentInfoTime);
      },
      /************************* 更新数据 *********************************/
      // 保存评分成功
      saveCase (res) {
        if (this.chgScore) { // 恢复显示修改按钮
          this.chgScore = false;
        }
        // this.setContentList()
        if (this.studentInfo.examStatus === 'FINISH') {
          console.log('重新获取学生信息');
          this.$nextTick(function () {
            this.changeStudent(); // 重新获取考生的所有信息
          });
        }
      },
      /*
       * 点击提交按钮 监听是否提交数据 (评分)
       * @param isLoadingFun boolean  form表单验证是否通过
       * autoSubmitData 自动提交分数的数据
       * */
      listenSubEvent (isLoadingFun, autoSubmitData) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = autoSubmitData || this.getSaveData();
          this.ajax(this.addMessTitle, isLoadingFun);
        }
      },
      // 获取保存数据
      getSaveData () {
        let res = Util._.defaultsDeep({}, this.contentDataList);
        res.detailsList = res.detailsList.concat(res.deductList);
        delete res.deductList;
        return res;
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = false;
        let isBlack = false;
        for (let key in this.$refs) {
          this.$refs[key].validate((valid) => {
            if (valid) {
              flag = true;
            } else {
              isBlack = true;
            }
          });
          if (isBlack) {
            return false;
          }
        }
        return flag;
      },
      // 结束倒计时
      getCountDown () {
        clearInterval(sd);
        let endTime = new Date(this.studentInfo.endTime || new Date()).getTime();
        let _this = this;
        sd = setInterval(() => {
          let nowTime = new Date().getTime();
          let t = endTime - nowTime;
          let h = 0;
          let m = 0;
          let s = 0;
          if (t >= 0) {
            h = Math.floor(t / 1000 / 60 / 60 % 24);
            m = Math.floor(t / 1000 / 60 % 60);
            s = Math.floor(t / 1000 % 60);
            h = _this.getCpl(h);
            m = _this.getCpl(m);
            s = _this.getCpl(s);
            _this.countDown = h + '：' + m + '：' + s;
          } else {
            clearInterval(sd);
            _this.countDown = '00：00：00';
            // 如果当前考生倒计时结束还没有确认考核结束（包括未开始考核），则自动提交考生状态为已结束考核并提交分数（0分）
            // if (this.studentInfo.examStatus !== 'FINISH') {
            // this.finishAndSub()
            // }
          }
        }, 1000);
      },
      // 补全时间
      getCpl (s) {
        return s < 10 ? '0' + s : s;
      },
      //获取内容请求
      setContentList () {
        let opt = {
          ajaxSuccess: 'contentData',
          ajaxParams: {
            url: api.contentGet.path + this.teacherId,
            params: {
              id: this.teacherId,
              sceneId: this.sceneId,
              stationId: this.stationId,
              arrangementId: this.arrangementId
            }
          }
        };
        this.ajax(opt);
      },
      // 老师手工选择考核内容的选项
      getContentOptionByTeacher() {
        let opt = {
          ajaxSuccess: res => this.selectContentOption = (res.data.contentList || []),
          ajaxParams: {
            url: api.getContentOption.path,
            method: api.getContentOption.method,
            params: {
              teacherId: this.teacherId,
              arrangementId: this.arrangementId // 考核安排id
            }
          }
        };
        this.ajax(opt);
      },
      // 确认选择评分表
      selectContentConfim() {
        if (!this.submitForm('selectContentForm')) {
          return false;
        }
        let opt = {
          ajaxSuccess: res => {
            // 不再请求数据
            clearTimeout(studentInfoTime);
            this.selectContentForm.select = true;
            this.setContentList();
          },
          ajaxParams: {
            url: api.confimSelectContent.path,
            method: api.confimSelectContent.method,
            params: {
              contentId: this.selectContentForm.contentId,
              arrangementId: this.arrangementId
            }
          }
        };
        this.contentDataList = this.conductListData({});
        this.ajax(opt);
      },
      // 获取预览数据
      getPriveContent() {
        if (!this.selectContentForm.contentId) {
          return false;
        }
        if (this.cacheContent[this.selectContentForm.contentId]) {
          this.loadPriveContentData();
          return false;
        }
        let opt = {
          ajaxSuccess: res => {
            if (res.data instanceof Object) {
              this.cacheContent[this.selectContentForm.contentId] = res.data;
              this.loadPriveContentData(res.data);
            }
          },
          ajaxParams: {
            url: api.getContentInfo.path + this.selectContentForm.contentId,
            method: api.getContentInfo.method,
            params: {
              teacherId: this.teacherId
            }
          }
        };
        this.ajax(opt);
      },
      loadPriveContentData(contentObj) {
        this.contentDataList = this.conductListData({});
        let data = contentObj || Util._.defaultsDeep({}, this.cacheContent[this.selectContentForm.contentId]);
        let list = this.conductListData(data);
        this.$nextTick(function () {
          this.contentDataList = list;
        });
      },
      // 评分输入框的值改变
      scoreInputChange () {
        if (this.studentInfo.examStatus === 'FINISH') {
          this.chgScore = true;
        }
        // 不再请求数据
        clearTimeout(studentInfoTime);
      },
      // 更新考核内容数据
      updateExmContent (res) {
        if (res.data) {
          this.exmContent = res.data;
        } else {
          this.exmContent.detailsList = [];
        }
      },
      // 更新考生信息
      updateStudentInfo (res) {
        if (this.contentDataList.detailsList.length) {
          for (let key in this.$refs) {
            this.$refs[key].resetFields();
          }
        }
        this.studentInfo = res.data;
        this.arrangementId = res.data.arrangementId;
        this.userId = res.data.userId;
        this.chgScore = false;
        if (this.studentInfo.examStatus == 'NOTEXAM') { // 只有在未确认身份的时候才获取状态数据
          // 间隔连接 30s
          studentInfoTime = setTimeout(() => this.changeStudent(), 30000);
        }
        this.getCountDown();
        if (res.data.randomType === 'TEACHER_SELECT' && !res.data.contentId) {
          console.log('获取评分表');
          if (this.selectContentOption !== null) {
            this.getPriveContent();
          } else {
            this.getContentOptionByTeacher();
          }
        } else if (res.data.contentId) {
          this.setContentList();
        } else {
          this.contentDataList.detailsList = [];
          this.contentDataList.deductList = [];
        }
        if (typeof res.data != 'object') {
          this.isError = true;
        } else {
          this.isError = false;
        }
      },

      //获取内容列表数据
      contentData (responseData) {
        let data = responseData.data;
        if (!data) return;
        this.studentInfo.markId = data.markId;
        this.contentDataList = this.conductListData(data);
      },

      //处理获取到列表数据，为添加评分服务
      conductListData (data) {
        this.deductSumScore = 0;
        let contentIds = [];
        let teacherId = this.teacherId;
        let scheduleId = data.scheduleId || '';
        let userId = this.userId;
        let arrangementId = this.arrangementId;
        let scoreTableId = data.scoreTableId;
        let sceneId = data.sceneId || '';
        let listData = {
          'teacherId': teacherId,
          'scheduleId': scheduleId,
          'markId': data.markId,
          'sceneId': sceneId,
          'arrangementId': arrangementId,
          'scoreTableId': scoreTableId,
          'userId': userId,
          'mark': '',
          'evaluate': data.evaluate,
          'detailsList': [],
          'deductList': []
        };
        //处理列表外层数据
        let deductListArr = []; // 扣分项
        let detailsListArr = []; // 评分项
        let detailsList = data.detailsList || data.detatilsList || [];
        let length = detailsList.length;
        for (let i = 0; i < length; i++) {
          let temp = detailsList[i];
          temp.sceneId = sceneId;
          temp.scoreTableId = scoreTableId;
          temp.scheduleId = scheduleId;
          temp.teacherId = teacherId;
          temp.userId = userId;
          temp.mark = Number(temp.mark) || 0;
          if (temp.isPoints && temp.mark) { // 累加扣分项
            this.deductSumScore += temp.score;
          }
          Array.push.call(null, temp.isPoints ? deductListArr : detailsListArr, temp);
        }
        contentIds = (detailsListArr || []).map(item => item.scoreTableDetailId);
        this.contentIds = contentIds;
        listData.detailsList = detailsListArr;
        listData.deductList = deductListArr;
        console.log(this.deductSumScore);
        return listData;
      },
      // 切换扣分项
      changeDeduct (obj) {
        if (obj.mark) {
          this.deductSumScore += obj.score;
        } else {
          this.deductSumScore -= obj.score;
        }
        this.markChange(obj);
        console.log(this.deductSumScore);
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
        this.contentDataList.mark = sums[sums.length - 1];
        return sums;
      },
      // 计算表格告诉
      getTableMaxHeight() {
        console.log('计算高度了');
        this.tableMaxHeight = 400 - (this.contentDataList.deductList.length ? 100 : 0);
      },

      /**
       * 检测分数是否正确
       * row 行
       * index 所修改分数所在行索引
       */
      markChange (row) {
        //mark 得分验证
        if (row.mark > row.score) {
//          row.mark = row.score;
          row.mark = '';
        } else if (row.mark < 0 || !row.mark) {
          row.mark = 0;
        }
        // 自动提交（考核中）
        if (this.studentInfo.examStatus === 'ONGOING' && this.studentInfo.sceneStatus === 'ONGOING') {
          this.addMessTitle.ajaxParams.url = api.submit.path;
          let data = this.$util._.defaultsDeep({}, this.contentDataList);
          data.detailsList = [this.$util._.defaultsDeep({}, row)]; // 只提交被修改的一行分数
          this.listenSubEvent(null, data);
          console.log(33);
        }
      },

      // 检测当前考站是否是考核中
      checkSceneStatus () {
        let msg = {
          PUBLISH: '未开始',
          FINISH: '已结束',
          SUSPEND: '暂停中'
        };
        let tag = (this.studentInfo.sceneStatus === 'ONGOING');
        if (!tag) {
          this.errorMess('考站考核' + (msg[this.studentInfo.sceneStatus] || '未开始') + '！');
        } else if (this.studentInfo.examStatus === 'DRAW') {
          tag = false;
          this.errorMess('当前考生还未抽签！');
        }
        return tag;
      },

      // 获取头像地址
      getPhotoPath (path) {
        return path && this.$store.getters.getEnvPath.http + path || '/static/image/defAvatar.png';
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      }
    },
    created () {
      Util = this.$util;
      this.teacherUserId = this.$store.getters.getUserInfo.id;
      this.changeStudent();
    },

    destroyed () {
      clearTimeout(studentInfoTime);
    },
    watch: {
      ['contentDataList.deductList']() {
        this.getTableMaxHeight();
      }
    },
    components: {
      exaVideo
    }
  };

</script>

<style lang="scss">
  @import '~@/assets/ambuf/css/examineMonitor_v1.0/studentInfo';

  .studentInfo {
    overflow: auto;
    .studentInfoBox {
      position: relative;
      .studentPhotoPos {
        position: absolute;
        right: 4px;
        top: 0;
        width: 120px;
        background-color: #f3f3f3;
        img {
          width: 120px;
          height: 120px;
        }
      }
    }
    .studentVideoBox {
      margin: 10px;
      /*background: #000;*/
      min-height: 200px;
      .debugVideoBox-right {
        .el-form-item__content {
          width: 184px;
        }
        .el-col-10 {
          width: 94%;
          margin-left: 6%;
        }
      }
    }
    .serverStatus {
      padding-bottom: 20px;
    }
  }

  .exmContentMain .el-table__body-wrapper {
    overflow-x: hidden;
  }

</style>
