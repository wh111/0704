<template>
  <!-- 考核监控 -->
  <div id="examineScore" ref="examineScore">
    <template v-if="emTabHeader">
      <el-tabs v-model="emTabHeader">
        <template v-for="item in tabList">
          <el-tab-pane :label="item.sceneName" :key="item.id" :name="(item.id).toString()"></el-tab-pane>
        </template>
      </el-tabs>
      <div id="examineScoreContent" ref="examineScoreContent">
        <studentList :sceneId="emTabHeader"></studentList>
      </div>
    </template>
    <p v-else style="position: absolute;top: 50%;text-align: center;width: 100%;">暂无可评分的考核场次</p>
  </div>
</template>

<script>
  import api from './api'; // Api
  import studentList from './examineScore_studentList'; // 考站列表
  export default {
    data() {
      return {
        emTabHeader: '',
        sceneName: '',
        tabList: [],
      }
    },
    methods: {
      // 获取监控考核场次列表
      getMonitorList() {
        this.ajax({
          ajaxSuccess: 'updateTabData',
          ajaxParams: {
            url: api.list.path,
            method: api.list.method,
            params: {
              teacherUserId: this.$store.getters.getUserInfo.id, // 当前教师账户id
            }
          }
        })
      },
      // 更新tab
      updateTabData(res) {
        if (res.data && res.data.length) {
          this.emTabHeader = (res.data[0].id || '').toString();
          this.tabList = res.data;
          this.activeName = res.data[0].id;
          this.sceneName = res.data[0].sceneName;
        }
      },
      // 内容区域高度
      // setTableDynHeight(){
      //   let contenHeight = this.$refs.examineScore.parentNode.offsetHeight;
      //   let tableView = this.$refs.examineScoreContent;
      //   let paginationHt = 50 + otherHeight + 16;
      //   this.dynamicHt = contenHeight - tableView.offsetTop - paginationHt;
      // }
    },
    created() {
      this.getMonitorList();
    },
    components: {
      studentList
    },
    // mounted() {
    //   //页面dom稳定后调用
    //   this.$nextTick(function () {
    //     //初始表格高度及分页位置
    //     this.setTableDynHeight();
    //     //为窗体绑定改变大小事件
    //     let Event = Util.events;
    //     Event.addHandler(window, "resize", this.setTableDynHeight);
    //   })
    // },
  }

</script>

<style lang="scss">
  @import'~@/assets/ambuf/css/examineMonitor_v1.0/stationList';
  #examineScore {
    width: 100%;
    height: 100%;
    position: relative;
  }

  #examineScoreContent {
    position: absolute;
    left: 0;
    bottom: 0;
    top: 58px;
    width: 100%;
  }

</style>
