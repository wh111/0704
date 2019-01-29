<template>
  <!-- 考核场次 -->
  <div id="interval" ref="interval">
    <keep-alive>
      <index-interval v-if="look == 'index'" :contenHeight="contenHeight" :url="url" :skillType="skillType" :update="update" @show="show"></index-interval>
    </keep-alive>
    <add-interval v-if="look == 'add'" :dept="dept" :contenHeight="contenHeight" :url="url" :skillType="skillType" :id="id" :add-type="type" @show="show"></add-interval>
    <view-interval v-if="look == 'view'" :contenHeight="contenHeight" :sceneType="sceneType" :sceneName="name" :id="id" @show="show"></view-interval>
  </div>
</template>
<script>
  let Util = null;
  import {
    mapMutations
  } from 'vuex';

  import api from './api';
  import indexInterval from './examineInterval_index'; // 默认列表视图
  import addInterval from './examineInterval_add'; // 新增考核
  import viewInterval from './examineInterval_view'; // 查看考核

  export default {
    name: 'interval',
    props: ['skillType', 'url'],  //skillOutdepExam 技能出科试卷设置
    data () {
      return {
        look: 'index',
        contenHeight: 100,
        type: 'STANDARD', // 增加考核的类型
        update: false, // 是否更新子组件数据
        id: 0, // 操作id
        name: '',
        sceneType: '', //考核类型，如果是自由考核，时间表不要 time
        dept: {
          deptId: '',
          deptName: ''
        },
        timer: null
      };
    },
    methods: {
      init () {

      },
      /************************** 组件回调 ******************************/
      // 视图显示并参数初始化
      show (args) {
        for (var key in args) {
          this[key] = args[key] || '';
        }
        // 每次增加都初始化状态
        if (args.look !== 'index') {
          this.initState();
//          this.keepLife();
        } else {
          clearInterval(this.timer);
        }
        // 获取所有参考人员
        if (args.look === 'view') {
          this.ajax({
            ajaxSuccess: res => {
              this.$store.commit('examineInterval/room/initUnSelectUser', res.data);
            },
            ajaxParams: {
              url: api.queryAllUserList.path,
              params: {
                sceneId: this.id
              }
            }
          });
        }
      },
      /************************** 基本逻辑 ******************************/
      getContenHeight () {
        this.contenHeight = this.$refs.interval.parentNode.offsetHeight - 10;
      },
      /************************** 状态初始化 *******************/
      ...mapMutations({
        initRoomList: 'examineInterval/room/initRoomList', // 初始化考站
        initRoomInfo: 'examineInterval/room/initRoomInfo', // 初始化考站信息
        initInfo: 'examineInterval/station/initInfo', // 初始化考核场次信息
        initIndex: 'examineInterval/roomIndex/init', // 初始化操作索引
        initScriptList: 'examineInterval/room/initScriptList', // 初始化SP人员病例
        initUnSelectRoom: 'examineInterval/room/initUnSelectRoom', // 初始化禁选房间
        initUnSelectUser: 'examineInterval/room/initUnSelectUser', // 初始化禁选人员
        initSpecialtyList: 'examineInterval/room/initSpecialtyList', // 初始化可选专业
        initEdit: 'examineInterval/station/initEdit' // 初始化是否可编辑
        // initTemp: 'examineInterval/temp/initData', // 初始化中转状态
      }),
      initState () {
        this.initRoomList();
        this.initRoomInfo();
        this.initInfo();
        this.initIndex();
        this.initScriptList();
        this.initUnSelectRoom();
        this.initUnSelectUser();
        this.initSpecialtyList();
        this.initEdit();
        // this.initTemp();
      },
      // 与服务器保存连接
      keepLife () {
        clearInterval(this.timer);
        this.timer = setInterval(() => { this.getUserInfo();}, 1000 * 60 * 15);
      },
      // 当前时间
      getUserInfo () {
        this.ajax({
          ajaxLoading: false,
          ajaxSuccess: () => {},
          ajaxParams: {
            url: '/user/getUserInfo',
            method: 'get'
          }
        });
      }
    },
    components: {
      indexInterval,
      addInterval,
      viewInterval
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.getContenHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.getContenHeight);
      });
    },
    created () {
      Util = this.$util;
      this.init();
    },
    beforeDestroy () {
//      clearInterval(this.timer);
    }
  };

</script>
<style lang="scss">
  #interval {
    height: 100%;
    overflow-y: auto;
    .itemLayout {
      width: 100%;
    }
  }
</style>
