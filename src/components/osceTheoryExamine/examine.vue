<!--
****--@file     examine
****--@date     2018/2/28 11:22
****--@author   YC
****--@describe 理论考核考生考生页面
-->
<template>
  <div ref="paperContent" class="osceTheoryExamine">
    <el-button class="osceLogoutBtn" @click="logout">退出</el-button>
    <template v-if="loading">
      <p class="loading">{{ tipsMsg }}</p>
    </template>
    <template v-else>
      <div ref="topInfo" class="topInfo">
        <el-row>
          <el-col :span="18" :offset="3">
            <h1 align="center">{{ paperContent.contentName }}</h1>
            <el-col class="infoItem" :span="10">考生姓名：{{ paperContent.userName }}</el-col>
            <el-col class="infoItem" :span="14">开始时间：{{ paperContent.startTime }}</el-col>
            <!--<el-col class="infoItem" :span="8">{{ timeText }}：{{ hasTime }}</el-col>-->
            <el-button type="info" class="saveBtn" @click="save" :disabled="!startExamination">提交答案</el-button>
          </el-col>
        </el-row>
      </div>
      <el-row class="oteMain" :style="{height:wHeight + 'px'}">
        <el-col :span="18" :offset="3">
          <paper-content :show-data="paperContent.paperContentList" type="input" showType="studentOption"
                         @selected="userSelected" :disabled="!startExamination"></paper-content>
        </el-col>
      </el-row>
    </template>
    <!--退出弹窗-->
    <Modal v-model="logoutModal" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="logoutId"></modal-header>
      <el-row>
        <el-form>
          <el-form-item><b v-if="startExamination">请确认试卷所有试题已做并且已提交答案</b><br>确认退出系统登录？</el-form-item>
        </el-form>
        <el-col align="right">
          <el-button type="info" @click="logOutCall" :disabled="!submitQuestion&&startExamination">确定退出</el-button>
          <el-button @click="logoutModal=false">取消返回</el-button>
        </el-col>
      </el-row>
      <div slot="footer"></div>
    </Modal>
    <!--退出弹窗-->
    <Modal v-model="submitModal" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="submitId"></modal-header>
      <el-row>
        <el-form>
          <el-form-item>
            <template v-if="paperContent.paperContentList.length != userSubmitQuestionId.length">
              当前还有
              <b>{{ paperContent.paperContentList.length - userSubmitQuestionId.length }}</b>
              题未做，
            </template>
            <b>提交后答案不可更改</b>；<br>确认提交答案？
          </el-form-item>
        </el-form>
        <el-col align="right">
          <el-button type="info" @click="save('FINISH',true,true)">确认提交</el-button>
          <el-button @click="submitModal=false">取消返回</el-button>
        </el-col>
      </el-row>
      <div slot="footer"></div>
    </Modal>
    <!--退出弹窗-->
    <Modal v-model="stopModal" :mask-closable="false" class-name="vertical-center-modal-stop" :width="500">
      <modal-header slot="header" :content="stopId"></modal-header>
      <el-row>
        <el-form>
          <el-form-item><b>考核暂停,请耐心等待！</b></el-form-item>
        </el-form>
      </el-row>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<style lang="scss">
  .osceTheoryExamine {
    height: 100%;
    position: relative;
    overflow: hidden;
    .loading {
      width: 100%;
      position: absolute;
      left: 0;
      top: 50%;
      line-height: 24px;
      font-size: 16px;
      margin-top: -12px;
      text-align: center;
    }
    .topInfo {
      width: 100%;
      padding: 20px;
      position: relative;
      background-color: #eaedf1;
    }
    .saveBtn {
      position: absolute;
      left: 84%;
      top: 50%;
      margin-top: -18px;
      margin-left: -44px;
    }
    .infoItem {
      font-size: 16px;
      margin-top: 20px;
    }
    .oteMain {
      padding: 20px;
      overflow: auto;
    }
  }

  .osceLogoutBtn {
    position: fixed;
    right: 20px;
    top: 32px;
    z-index: 2;
  }

  .vertical-center-modal-stop .ivu-icon-ios-close-empty {
    display: none;
  }
</style>
<script>
  /*当前组件必要引入*/
  import paperContent from '../osce/examineInterval/examineIntervalSetInfo/paperContent/view.vue'
  //当前组件引入全局的util
  let Util = null
  export default {
    data () {
      return {
        config: null,
        loading: true,
        wHeight: 0,
        hasTime: '00:00:00',
        logoutModal: false,
        submitModal: false,
        stopModal: false,
        showType: '',
        logoutId: {
          id: 'logoutId',
          title: '退出提示'
        },
        stopId: {
          id: 'stopId',
          title: '暂停提示'
        },
        submitId: {
          id: 'submitId',
          title: '提交答案提示'
        },
        startExamination: false, // 是否可以开始考核
        paperLoadError: false, // 试卷加载错误
        paperContent: {
          contentName: '',
          endTime: '',
          userName: '',
          status: '',
          paperContentList: []
        },
        userSelectData: [], // 用户选择的数据
        userSubmitQuestionId: [], // 记录用户已经答题的id
        submitQuestion: false, // 用户是否手动提交过答案
        saveData: {
          'examStatus': '', // 学生最后提交的时候才设置状态为FINISH表示考核结束
          'scheduleId': '', //考核成绩id(可以为空，为空时代表第一次提交)
          'markId': '', // 总成绩id(可以为空，为空时代表第一次提交)
          'sceneId': '',// 场次id
          'arrangementId': '',// 考核安排id
          'scoreTableId': '',// 考核内容id
          'userId': '',// 考生id
          'mark': '0',// 教师评分成绩
          'evaluate': '',// 教师评价信息
          'detailsList': [
            // {// 评分详情列表
            //   'sceneId': '',// 场次id
            //   'scoreTableId': '',// 考核内容id
            //   'detailsId': '',// 题目id
            //   'mark': '0',// 单项得分
            //   'teacherId': '',// 教师id
            //   'userId': ''// 考生id
            // }
          ]
        },
        tipsMsg: '试题加载中...',
        cutDowns: null,
        timeText: '剩余时间',
        showOnce: false,
        firstIn: true,
        nowTime: '',
        timer: null,
        nowTimeAddInt: null, // 当前时间自动增加
        setTimeInt: null
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        this.config = Util.getLocalStorage('osceTheoryExamineConfig')

        if (this.config) {
          this.getNowTime();
        } else {
          this.$router.push('/osceTheoryExamine/login')
        }
      },

      // 获取状态
      selectStatus () {
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.getNowStationStatus()
        }, 1000)
      },

      // 获取当前考站的考核状态
      getNowStationStatus () {
        let opt = {
          ajaxLoading: false,
          ajaxSuccess: res => {
            if (res.data.status == 'SUSPEND') {
              clearInterval(this.cutDowns);
              this.startExamination = false;
              this.stopModal = true;
            } else if (res.data.status == 'FINISH') {
              clearTimeout(this.setTimeInt)
              clearInterval(this.cutDowns)
              clearInterval(this.timer)
            } else {
              if (this.stopModal) {
                this.stopModal = false;
                this.getNowTime();
              }
            }
          },
          ajaxParams: {
            url: '/scene/get/basic/' + this.config.sceneId
          }
        }
        this.ajax(opt)
      },

      // 用户选择答案
      userSelected (arr) {
        console.log('触发保存')
        let userSubmitQuestionId = []
        this.userSelectData = arr
        arr.map(item => {
          if (typeof(item.userSelect) != undefined) {
            if (item.userSelect.length != 0) {
              userSubmitQuestionId.push(item.paperId)
            }
          } else if (item.userSelect) {
            userSubmitQuestionId.push(item.paperId)
          }
        })
        this.userSubmitQuestionId = userSubmitQuestionId
        // 自动提交
        this.save()
      },

      save (examStatus = '', timeEnd = false, isUserSubmit = false) {
        if (!this.startExamination) { // 还未开始考核
          return false
        }
        if (this.paperContent.status == 'FINISH') {
          return false
        }
        if (examStatus) { // 手动或者自动提交答案
          if (!timeEnd) { // 时间没结束并且还有题目没有做完
            this.submitModal = true
            return false
          } else {
            this.submitModal = false
          }
        }
        if (isUserSubmit) { // 用户提交
          this.submitQuestion = true
        }
        this.saveCall(examStatus)
      },
      // 提交答案
      saveCall (examStatus = '') {
        let saveData = this.getSaveData();
        saveData.examStatus = examStatus
        let opt = {
          ajaxLoading: examStatus === 'FINISH',
          ajaxSuccess: res => {
            if (examStatus) { // 提交答案之后就不能编辑了
              this.startExamination = false;
              this.paperContent.status = 'FINISH';
              this.successMess('答案提交成功！');
            } else { // 提交答案之后就不再获取试卷内容
//              this.getPaperContent(false)
            }
          },
          ajaxParams: {
            url: 'scene/paper/submit',
            method: 'post',
            jsonString: true,
            data: saveData
          }
        }
        this.ajax(opt)
      },
      getSaveData () {
        let saveData = Util._.defaultsDeep({}, this.saveData)
        let userSelectData = Util._.defaultsDeep([], this.userSelectData)
        let detailsList = []
        let sumMark = 0
        userSelectData.map(item => {
          let mark
          if (item.types === 'CHECKBOX') {
            item.userSelect = (item.userSelect.sort()).join('|')
          }
          // 判断是否答对并计算分数
          mark = item.options === item.userSelect ? item.optionScore : 0
          sumMark += mark
          detailsList.push({// 评分详情列表
            'sceneId': saveData.sceneId,// 场次id
            'scoreTableId': saveData.scoreTableId,// 考核内容id
            'detailsId': item.paperId,// 题目id
            'mark': mark,// 单项得分
            'teacherId': '',// 教师id
            'userId': saveData.userId,// 考生id
            'options': item.userSelect
          })
        })
        saveData.mark = sumMark
        saveData.detailsList = detailsList
        return saveData
      },
      // 当前时间
      getNowTime (loadPaper = true) {
        clearInterval(this.nowTimeAddInt)
        this.ajax({
          ajaxLoading: false,
          ajaxSuccess: res => {
            this.nowTime = res.data;
            console.log(new Date(res.data).toLocaleString())
            this.nowTimeAddInt = setInterval(() => {
              this.nowTime += 1000
            }, 1000)
            console.log('获取当前时间')
            if (loadPaper) {
              this.getPaperContent()
            }
          },
          ajaxParams: {
            url: 'nowTime',
            method: 'get',
            params: {}
          }
        });
      },
      /**
       * 获取试卷内容
       * @param resetPaperContent 是否重置之前的试卷数据
       */
      getPaperContent (resetPaperContent = true) {
        if (this.stopModal) {
          return
        }
        let initKeys = ['scheduleId', 'markId', 'sceneId', 'arrangementId', 'userId', 'mark']
        let opt = {
          ajaxLoading: false,
          ajaxSuccess: res => {
            if (resetPaperContent) {
              this.paperContent = res.data
            }
            let startTime = new Date(res.data.startTime.toString().replace(/-/g, '/')).getTime();
            let endTime = new Date(res.data.endTime.toString().replace(/-/g, '/')).getTime();
            initKeys.map(key => this.saveData[key] = res.data[key] || '');
            this.saveData.scoreTableId = res.data.contentId
            this.loading = false
            this.setContenHeight();
            if (this.nowTime > startTime && this.nowTime < endTime) { // 现在已经在考试时间范围之内
              this.startExaminationCall()
              console.log('考试时间内')
            }
            if (this.nowTime < startTime) { // 提前登录考试系统
//              this.timeText = '等待时间'
              console.log('等待中')
              this.countDown(this.nowTime, startTime, (h, m, s) => {
                console.log(`等待${h}:${m}:${s}`)
//                this.hasTime = `${addFix(h)}:${addFix(m)}:${addFix(s)}`
              }, () => {
                console.log('等待完成')
                this.startExaminationCall() // 到开始时间直接进行
              })
            }
            this.selectStatus()
          },
          error: res => {
            this.paperLoadError = true;
            this.tipsMsg = res.status && res.status.msg || '试题加载异常！';
            clearTimeout(this.setTimeInt)
            if (this.paperLoadError) {
              this.setTimeInt = setTimeout(() => this.getPaperContent(), 1 * 1000)
            } else {
              this.errorMess(res.status.msg)
            }
          },
          ajaxParams: {
            url: 'scene/paper/get',
            params: this.config
          }
        }
        this.ajax(opt)
      },
      // 开始考核
      startExaminationCall () {
        this.startExamination = this.paperContent.status == 'FINISH' ? false : true; // 考核是否已经结束
        let {startTime, endTime} = Util._.defaultsDeep({}, this.paperContent)
        let addFix = s => s.toString().length < 2 ? '0' + s : s
        startTime = new Date(startTime.toString().replace(/-/g, '/')).getTime()
        startTime = startTime < this.nowTime ? this.nowTime : startTime
        this.timeText = '剩余时间'
        this.countDown(startTime, new Date(endTime.toString().replace(/-/g, '/')).getTime(), (h, m, s) => {
          this.hasTime = `${addFix(h)}:${addFix(m)}:${addFix(s)}`
          console.log(this.hasTime)
        }, () => { // 考核结束时
          // 自动提交答案(还未考核完成)
          if (!this.submitQuestion && this.paperContent.status != 'FINISH') {
            if (this.startExamination) {
              this.autoSubmitTips();
              this.save('FINISH', true)
            }
          }
          this.initData();
          clearTimeout(this.setTimeInt);
          // 这里要获取下一个人的试题
          this.getNextData();
          console.log('结束')
        })
      },
      // 获取下一个人的数据
      getNextData () {
        this.loading = true;
        this.getNowTime()
      },
      // 输出数据
      initData () {
        this.startExamination = false;
        this.submitQuestion = false;
        this.paperLoadError = false;
        this.userSelectData = [];
        this.userSubmitQuestionId = [];
        this.submitQuestion = false;
      },
      // 自动提交答案提示
      autoSubmitTips () {
        this.$notify.info({
          title: '提示',
          message: '考核时间到，答案自动提交中！',
          offset: 100,
          duration: 2000
        })
      },
      /**
       * 倒计时
       * @param startTime 开始时间
       * @param endTime 结束时间
       * @param intervalCall 倒计时执行时回调
       * @param endCall 倒计时执行结束时回调
       */
      countDown (startTime, endTime, intervalCall, endCall) {
        let timeDifference = parseInt((endTime - startTime) / 1000)
        console.log('时差：' + timeDifference)
        let h = parseInt(timeDifference / (60 * 60)),
          m = parseInt((timeDifference - h * 60 * 60) / 60),
          s = parseInt(timeDifference - h * 60 * 60 - m * 60)
        let that = this
        let cd = function () {
          --s
          if (s < 0) {
            s = 59
            --m
          }
          if (m < 0) {
            m = 59
            --h
          }
        }
        clearInterval(this.cutDowns)
        this.cutDowns = setInterval(() => {
          cd()
          intervalCall(h, m, s)
          if (h < 0 || (h <= 0 && m <= 0 && s <= 0)) {
            clearInterval(that.cutDowns)
            that.cutDowns = null
            endCall()
          }
        }, 1000)
      },
      getContenHeight () {
        if (!this.loading) {
          //console.log(this.$refs.paperContent.parentNode==undefined)
          if (this.$refs.paperContent != undefined) {
            let w = this.$refs.paperContent.parentNode.offsetHeight
            let c = this.$refs.topInfo.offsetHeight
            this.wHeight = w - c
          }

        }
      },
      setContenHeight () {
        //页面dom稳定后调用
        this.$nextTick(function () {
          //初始表格高度及分页位置
          this.getContenHeight()
          //为窗体绑定改变大小事件
          let Event = Util.events
          Event.addHandler(window, 'resize', this.getContenHeight)
        })
      },
      logout () {
        if (this.paperLoadError) {
          this.logOutCall()
        } else {
          this.logoutModal = true;
        }
      },
      // 退出登录
      logOutCall () {
        this.$router.push('/osceTheoryExamine/login')
//        this.$util.loginOut(this, '/osceTheoryExamine/login')
      }
    },
    created () {
      this.init()
    },
    beforeDestroy () {
      clearTimeout(this.setTimeInt)
      clearInterval(this.cutDowns)
      clearInterval(this.timer)
    },
    mounted () {
      this.setContenHeight()
    },
    components: {
      paperContent
    }
  }

</script>
                                                                                           
