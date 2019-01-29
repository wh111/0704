<template>
  <div class="examineInterval" ref="examineInterval" style="height:100%">
    <!-- 场次标题 -->
    <el-row>
      <el-col :span="20">
        <h2 class="eiTitle">{{ sceneName }}</h2>
      </el-col>
      <el-col :span="4" align="right" style="float:right;">
        <el-button type="info" @click="backList">返回列表</el-button>
      </el-col>
    </el-row>
    <!-- 视图按钮 -->
    <div class="viewChangeButtonList" ref="viewChangeButtonList">
      <el-button size="small" type="success" @click="shows('info')">基本信息</el-button>
      <el-button size="small" type="warning" @click="shows('user')">参考人员信息</el-button>
      <el-button size="small" type="info" @click="shows('station')">考站信息</el-button>
      <el-button size="small" type="primary" @click="shows('time')">时间表</el-button>
      <el-button size="small" type="info" @click="copySceneCall">场次复制</el-button>
      <el-button size="small" @click="shows('attendance')">考勤查询</el-button>
    </div>
    <!-- 视图 -->
    <div ref="tableData" id="tableData" :style="tableDataStyle">
      <edit-info v-if="show === 'info'" :id="id" @updateInfo="initData"></edit-info>
      <user-info v-if="show === 'user'" :contenHeight="contenHeight" :id="id"></user-info>
      <station v-if="show === 'station'" :id="id"></station>
      <ei-time v-if="show === 'time'" :id="id" :sceneType="sceneType"></ei-time>
      <attendance v-if="show === 'attendance'" :id="id" :contenHeight="contenHeight"></attendance>
    </div>
    <!-- 模态框 复制场次（copyScene） -->
    <Modal :mask-closable="false" height="200" v-model="copySceneModal" title="对话框标题" class-name="vertical-center-modal" :loading="loading"
           :width="800">
      <modal-header slot="header" :content="contentHeader.copySceneId"></modal-header>
      <copy-scene v-if="copySceneModal" @copy="subCallback" @cancel="subCallback('copyScene')" :copySceneData="copySceneObj"></copy-scene>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import editInfo from './examineIntervalInfo/examineIntervalInfo_edit'; // 规范化考核信息
  import userInfo from './examineIntervalInfo/examineIntervalInfo_user'; // 参考人员列表
  import station from './examineInterval_stationEdit'; // 考站信息
  import eiTime from './examineIntervalTime/examineIntervalTime'; // 时间表
  import attendance from './examineInterval_attendance'; // 考勤查询
  import copyScene from './examineInterval_copyScene'; // 场次复制

  export default {
    props: {
      contenHeight: {
        type: Number,
        default: 100
      },
      id: { // 查看id
        type: Number,
        default: 0
      },
      sceneName: {
        type: String,
        default: ''
      },
      sceneType: { //考核类型
        type: String,
        default: ''
      }
    },
    data () {
      return {
        loading: false,
        name: '', // 场次名称
        show: 'info', // 当前显示视图
        tableDataStyle: {
          height: ''
        },
        copySceneObj: null, // 被复制场次的
        copySceneModal: false,
        // 模态框提示
        contentHeader: {
          copySceneId: {
            id: 'copySceneId',
            title: '场次复制'
          }
        }
      };
    },
    methods: {
      // 返回列表
      backList () {
        this.$emit('show', {
          look: 'index'
        });
      },
      /********************** 视图控制 *****************************/
      // 视图显示并参数初始化
      shows (view) {
        if (view === this.show) {
          return;
        }
        this.show = view;
      },
      // 场次复制
      copySceneCall () {
        let {id, sceneType} = this;
        this.copySceneObj = {id, sceneType};
        this.openModel('copyScene');
      },
      // 增加回调
      subCallback (target, title) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      /******************** 数据获取 **********************************/

      /******************** 数据存状态 *********************************/

      /******************** 数据初始化 *********************************/
      initData () {
        //this.name = this.$store.state.examineInterval.station.info.sceneName;  //名称通过传过来的
      },
      setTableHeight () {
        let contenHeight = this.$refs.examineInterval.offsetHeight;
        let tableHeight = this.$refs.tableData.offsetTop;
        this.tableDataStyle.height = (contenHeight - tableHeight) + 'px';
      }
    },
    components: {
      editInfo,
      userInfo,
      station,
      eiTime,
      attendance,
      copyScene
    },
    created () {
      // this.initData()
    },
    destroyed () {
      this.$store.commit('examineInterval/room/destroy');
      this.$store.commit('examineInterval/station/destroy');
    },
    mounted () {
      this.name = this.$store.state.examineInterval.station.info.sceneName;
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableHeight();
        //为窗体绑定改变大小事件
        let Event = this.$util.events;
        Event.addHandler(window, 'resize', this.setTableHeight);
      });
    }
  };

</script>

<style lang="scss">
  @import '../../../assets/ambuf/css/examineInterval_v1.0/view';

</style>
