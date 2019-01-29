<!--
****--@file     bespeakSearch_list
****--@date     2018/6/7 17:45
****--@author   YC
****--@describe 预约查询
-->
<template>
  <div ref="bespeakSearch">
    <el-tabs v-model="activeName">
      <el-tab-pane label="预约上课" name="room">
        <room-list v-if="activeName == 'room'" :contenHeight="contenHeight" @show="show"></room-list>
      </el-tab-pane>
      <el-tab-pane label="自主训练" name="project">
        <project-list v-if="activeName == 'project'" :contenHeight="contenHeight" @show="show"></project-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import projectList from './project/project_list';
  import roomList from './room/room_list';

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'bespeakSearchList',
    data () {
      return {
        activeName: 'room',
        contenHeight: 0
      };
    },
    methods: {
      init () {

      },
      // 获取内容部分高度
      getContentHeight () {
        this.contenHeight = this.$refs.bespeakSearch.parentNode.offsetHeight - 80;
      },
      // 视图切换
      show (view) {
        this.activeName = view;
      }
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.getContentHeight();
        //为窗体绑定改变大小事件
        let Event = this.$util.events;
        Event.addHandler(window, 'resize', this.getContentHeight);
      });
    },
    created () {
      this.init();
    },
    components: {
      projectList, roomList
    }
  };

</script>
