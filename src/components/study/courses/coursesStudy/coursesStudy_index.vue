<!--课程学习-->
<template>
  <div class="coursesStudy">
    <!-- 顶部 -->
    <div class="coursesStudyHeader">
      <class-menu @menuClick="menuClick" :types="'VIDEO'" menuUrl="/criterionCourseType/tree"></class-menu>
      <div class="coursesStudyInfo">
        <div align="right">
          <div style="height: 36px;"></div>
          <!--<el-input class="searchStudy" placeholder="搜索课程" v-model="input5">-->
          <!--<el-button slot="append" icon="search"></el-button>-->
          <!--</el-input>-->
        </div>
        <div class="coursesStudyTask coursesStudyBorder">
          <h3>学习任务</h3>
          <el-row class="coursesStudyTaskMain">
            <div v-if="myTask.length > 0">
              <el-col class="coursesStudyItem" :span="22" :offset="2" v-for="item in myTask" :key="item.id">
                <el-col :span="7">
                  <p class="coursesStudyTitle overflow-txt1">{{ item.title }}</p>
                </el-col>
                <el-col :span="12" :offset="1">
                  <el-progress :text-inside="true" :stroke-width="20" :percentage="item.progress"></el-progress>
                </el-col>
                <el-col :span="4" align="right">
                  <el-button size="small" @click="videoClick(item)" type="success">快速进入</el-button>
                </el-col>
              </el-col>
            </div>
            <p v-else class="coursesStudyItemTips">暂无学习任务</p>
          </el-row>
          <p class="coursesStudyHours overflow-txt1">
            <!-- <b>本月学习时长：15小时20分钟</b> -->
          </p>
        </div>
      </div>
    </div>
    <!-- 内容部分 -->
    <el-row class="coursesStudyBody">
      <el-col :span="17" class="coursesStudyBorder coursesStudyLeft">
        <!-- 必修课 -->
        <el-row class="coursesStudyVideoContent">
          <!-- 标题 -->
          <el-col class="coursesStudyTopTitle">
            <el-col :span="12" align="left">
              <h4 class="coursesStudyTopTitleText overflow-txt1">我的必修课</h4>
            </el-col>
            <el-col :span="12" align="right">
              <el-button v-if="myStudyTotalCount > myStudy.length" type="text" @click="showExChange('myStudy')">更多<i class="el-icon-arrow-right el-icon--right"></i></el-button>
              <!--<el-button  type="text" @click="showExChange('myStudy')">更多<i class="el-icon-arrow-right el-icon&#45;&#45;right"></i></el-button>-->
            </el-col>
          </el-col>
          <!-- 视频内容 -->
          <el-col>
            <div v-if="myStudy.length > 0">
              <el-col  :xs="23" :sm="11" :md="7" :lg="5" class="coursesStudyVideoItem" :offset="1" v-for="item in myStudy" :key="item.id">
                <div  @click="videoClick(item)" style="cursor: pointer">
                  <div style="width: 100% ;height: 125px;">
                    <img v-if="getPicUrl(item.logo)" :src="getPicUrl(item.logo)" class="coursesStudyPhoto" style="height: 125px;">
                  </div>
                  <!-- <p class="">视频名称</p> -->
                  <div class="coursesStudyVideoInfo">
                    <h3 class="overflow-txt1">{{ item.title }}</h3>
                    <el-row>
                      <el-col :span="12">
                        <p class="overflow-txt1">{{ item.teacher }}</p>
                      </el-col>
                      <el-col :span="12" align="right">
                        <span>{{ item.totalLesson }}课时</span>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-col>
            </div>
            <p v-else class="coursesStudyItemTips">暂无必修课</p>
          </el-col>
        </el-row>
        <!-- 最新课程 -->
        <el-row class="coursesStudyVideoContent">
          <!-- 标题 -->
          <el-col class="coursesStudyTopTitle">
            <el-col :span="12" align="left">
              <h4 class="coursesStudyTopTitleText overflow-txt1">最新课程</h4>
            </el-col>
            <el-col :span="12" align="right">
              <el-button type="text" v-if="mainQueryTotalCount > mainQuery.length" @click="exchange('coursesList')">换<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-col>
          </el-col>
          <!-- 视频内容 -->
          <el-col>
            <div v-if="mainQuery.length > 0">
              <el-col :xs="23" :sm="11" :md="7" :lg="5" class="coursesStudyVideoItem" :offset="1" v-for="item in mainQuery" :key="item.id">
                <div  @click="mainQueryClick(item)" style="cursor: pointer">
                  <div style="width: 100% ;height: 125px;">
                   <img v-if="getPicUrl(item.logo)"  :src="getPicUrl(item.logo)" class="coursesStudyPhoto" style="height: 125px;">
                  </div>
                  <!-- <p class="">视频名称</p> -->
                  <div class="coursesStudyVideoInfo">
                    <h3 class="overflow-txt1">{{ item.title }}</h3>
                    <el-row>
                      <el-col :span="12">
                        <p class="overflow-txt1">{{ item.teacher }}</p>
                      </el-col>
                      <el-col :span="12" align="right">
                        <span>{{ item.totalLesson }}课时</span>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-col>
            </div>
            <p v-else class="coursesStudyItemTips">暂无最新课程</p>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6" :offset="1">
        <!-- 直播列表 -->
        <el-row class="coursesStudyBorder coursesStudyRightItem">
          <el-col class="coursesStudyTopTitle">
            <h4 class="coursesStudyTopTitleText overflow-txt1">最近直播</h4>
          </el-col>
          <el-col class="coursesStudyPadding">
            <div v-if="nextPlay.length > 0">
              <div class="timeBarBox">
                <div class="timeBarItem" v-for="(item,index) in nextPlay" :key="index">
                  <div class="day" :class="{'active':isToday(item.date)}">
                    {{ item.date }}{{ isToday(item.date) ? '（今天）' : '' }}
                  </div>
                  <div class="time" v-for="timeItem in item.timeList" :key="timeItem.id">
                    <span class="timeText">{{ timeItem.startTime + ' - ' + timeItem.endTime }}</span>
                    <span class="titleText">{{ timeItem.title }}</span>
                  </div>
                </div>
              </div>
            </div>
            <p v-else class="coursesStudyItemTips">最近暂无直播</p>
          </el-col>
        </el-row>
        <!-- 播放记录 -->
        <el-row class="coursesStudyBorder coursesStudyPaddingBottom20 coursesStudyRightItem">
          <el-col class="coursesStudyTopTitle">
            <el-col :span="12" align="left">
              <h4 class="coursesStudyTopTitleText overflow-txt1">播放记录</h4>
            </el-col>
            <el-col :span="12" align="right">
              <el-button type="text" v-if="myHistoryTotalCount > myHistory.length" @click="showExChange('myHistory')">更多<i class="el-icon-arrow-right el-icon--right"></i></el-button>
              <!--<el-button type="text" @click="showExChange('myHistory')">更多<i class="el-icon-arrow-right el-icon&#45;&#45;right"></i></el-button>-->
            </el-col>
          </el-col>
          <el-col>
            <div v-if="myHistory.length > 0">
              <el-col :xs="23" :sm="23" :md="23" :lg="11" class="coursesStudyVideoItem" :offset="1" v-for="item in myHistory" :key="item.id">
                <div @click="videoClick(item)" style="cursor: pointer">
                  <div style="width: 100% ;height: 125px;">
                   <img v-if="getPicUrl(item.logo)" :src="getPicUrl(item.logo)" class="coursesStudyPhoto" style="height: 125px;">
                  </div>
                  <!-- <p class="">视频名称</p> -->
                  <div class="coursesStudyVideoInfo">
                    <h3 class="overflow-txt1">{{item.title}}</h3>
                  </div>
                </div>
              </el-col>
            </div>
            <p v-else class="coursesStudyItemTips">暂无播放记录</p>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 更多弹窗 -->
    <Modal :mask-closable="false" v-model="moreModal" class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="moreId"></modal-header>
      <more v-if="moreModal" :operaility-data="operailityData"></more>
      <div slot="footer"></div>
    </Modal>

    <!-- 详情弹窗 -->
    <Modal :mask-closable="false" v-model="showModal" class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="showId"></modal-header>
      <show style="height: 600px;" v-if="showModal" :operaility-data="showData" :showType="showType"
            :saveProgress="true"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import show from '../webCourses/webCourses_view.vue'
  import api from './api';
  /*当前组件必要引入*/
  import more from './coursesStudy_more.vue'

  import classMenu from '../../common/menu';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        operailityData: {}, //传到更多的数据
        myTask: [],
        myStudy: [], //我的必修课
        myStudyTotalCount: 0, //我的必修课
        mainQuery: [], //最新课程
        mainQueryTotalCount: 0,
        MainQueryPage: 1,
        MainQueryPageSize: 8,

        nextPlay: [],
        myHistory: [], //播放记录
        myHistoryTotalCount: 0, //播放记录
        today: 0,
        input5: '',

        showType: '', // 最新课程查看

        moreModal: false,
        moreId: {
          id: 'addId',
          title: '更多'
        },

        showModal: false,
        showId: {
          id: 'showId',
          title: '查看'
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        let now = new Date();
        this.today = new Date(now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()).getTime();
        this.getMyTask();
        this.getMyStudy();
        this.getMainQuery();
        this.getNextPlay();
      },
      // 视图切换
      showExChange(type) {
        let obj = {
          myStudy: '我的必修课',
          mainQuery: '最新课程',
          myHistory: '播放记录',
        }
        this.operailityData = {
          path: api[type].path,
        };
        this.moreId.title = obj[type];
        this.moreModal = true;
      },

      //换
      exchange() {
        if (this.MainQueryPage * this.MainQueryPageSize >= this.mainQueryTotalCount) {
          this.MainQueryPage = 1;
        } else {
          this.MainQueryPage++;
        }
        this.getMainQuery()
      },

      // 视图切换
      show(viewType = 'coursesList', data = '') {
        this.$emit('show', viewType, data)
      },
      // 按钮点击
      menuClick(obj, idObj) {
        this.show(undefined, idObj)
      },
      // 是否是今天
      isToday(day) {
        let dayTime = new Date(day).getTime();
        return dayTime >= this.today && dayTime <= (this.today + 24 * 60 * 60 * 1000)
      },
      /************************** 获取数据 *******************************/
      // 获取学习任务
      getMyTask() {
        this.ajax({
          ajaxSuccess: res => this.myTask = res.data,
          ajaxParams: {
            url: api.myTask.path
          }
        })
      },
      // 获取我的必修课
      getMyStudy() {
        this.ajax({
          ajaxSuccess: res => {
            this.myStudy = res.data;
            this.myStudyTotalCount = res.totalCount || res.data.length || 0;
          },
          ajaxParams: {
            url: api.myStudy.path,
            params: {
              curPage: 1,
              pageSize: 8
            }
          }
        })
      },
      // 获取最新课程
      getMainQuery() {
        this.ajax({
          ajaxSuccess: res => {
            this.mainQuery = res.data,
              this.mainQueryTotalCount = res.totalCount || res.data.length || 0;
          },
          ajaxParams: {
            url: api.mainQuery.path,
            params: {
              curPage: this.MainQueryPage,
              pageSize: this.MainQueryPageSize
            }
          }
        })
      },
      // 获取最新直播课程
      getNextPlay() {
        this.ajax({
          ajaxSuccess: res => {
            if (res.data.length > 3) { // 只取前三天
              res.data.length = 3
            }
            this.nextPlay = res.data;
          },
          ajaxParams: {
            url: api.nextPlay.path,
          }
        })
      },
      // 获取播放记录
      getMyHistory() {
        this.ajax({
          ajaxSuccess: res => {
            this.myHistory = res.data;
            this.mainQueryTotalCount = res.totalCount || res.data.length || 0;
          },
          ajaxParams: {
            url: api.myHistory.path,
            params: {
              curPage: 1,
              pageSize: 4
            }
          }
        })
      },
      // 获取图片
      getPicUrl(staticUrl) {
        let src = '';
        if (staticUrl) {
          src = this.$store.state.envPath.http + staticUrl
        }
        return src
      },

      //点击视频
      videoClick(data) {
        this.showType = '';
        this.showData = data;
        this.showModal = true;
      },
      // 最新课程查看
      mainQueryClick(data) {
        let opt = {
          ajaxSuccess: res => {
            this.showType = 'main';
            this.showData = data;
            this.showModal = true;
          },
          ajaxParams: {
            url: api.mainInfo.path + data.id,
            method: api.mainInfo.method
          }
        }
        this.ajax(opt)
      }
    },
    created() {
      this.init();
    },
    mounted() {},
    components: {
      classMenu,
      more,
      show
    }
  }

</script>

<style lang="scss">
  @import"../../../../assets/ambuf/css/coursesStudy_v1.0/index";
  @import"../../../../assets/ambuf/css/coursesStudy_v1.0/timeBar";

</style>
