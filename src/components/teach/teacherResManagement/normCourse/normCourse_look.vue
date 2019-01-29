<!-- 基础教务 - 资源库管理 - 创建标准课程 -->
<template>
  <layout>
    <!-- 课程标题 -->
    <p slot="title">{{ title || '加载中...' }}</p>
    <!-- 封面图 -->
    <img :src="getPicUrl(logo)" alt="" slot="menuTop">
    <!-- 菜单 -->
    <div slot="menu">
      <nmenu-item :class="{'active':menuActive === 'basic'}" name="basic" @click="menuClick">课程基本信息</nmenu-item>
      <!-- <nmenu-item :class="{'active':menuActive === 'notice'}" name="notice" @click="menuClick">公告</nmenu-item> -->
      <nmenu-item :class="{'active':menuActive === 'intro'}" name="intro" @click="menuClick">课程简介</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'outline'}" name="outline" @click="menuClick">课程教学大纲</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'plan'}" name="plan" @click="menuClick">教学计划</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'courseware'}" name="courseware" @click="menuClick">课件</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'EO'}" name="EO" @click="menuClick">评测与作业</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'TQVInfo'}" name="TQVInfo" @click="menuClick">教学质量评价表</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'TREInfo'}" name="TREInfo" @click="menuClick">试运行评估表</nmenu-item>
    </div>
    <!-- 底部 -->
    <div slot="footer">
      <slot></slot>
    </div>
    <!-- 内容 start -->
    <!-- 加载动画 -->
    <keep-alive>
      <loading v-if="menuActive === 'load'" ref="load"></loading>
    </keep-alive>
    <!-- 课程基本信息 -->
    <basic-view v-if="menuActive === 'basic'"></basic-view>
    <!-- 公告 -->
    <!-- <notice-view v-if="menuActive === 'notice'"></notice-view> -->
    <!-- 课程简介 -->
    <intro-view v-if="menuActive === 'intro'"></intro-view>
    <!-- 课程教学大纲 -->
    <outline-view v-if="menuActive === 'outline'"></outline-view>
    <!-- 教学计划 -->
    <plan-view v-if="menuActive === 'plan'"></plan-view>
    <!-- 课件 -->
    <courseware-view v-if="menuActive === 'courseware'"></courseware-view>
    <!-- 评测与作业 -->
    <eo-view v-if="menuActive === 'EO'"></eo-view>
    <!-- 教学质量评价表 -->
    <tqv-info-view v-if="menuActive === 'TQVInfo'"></tqv-info-view>
    <!-- 试运行评估表 -->
    <tre-info-view v-if="menuActive === 'TREInfo'"></tre-info-view>
    <!-- 内容 end -->
  </layout>
</template>

<script>
  import api from './api';
  /*当前组件必要引入*/
  import layout from "./_components/layout"; // 基础布局
  import nmenuItem from './_components/menu'; // 菜单项

  import loading from "./load/loading"; // 加载动画

  import basicView from './basic/basic_view'; // 课程基本信息
  // import noticeView from './notice/notice_view'; // 公告
  import introView from './intro/intro_view'; // 课程简介
  import outlineView from './outline/outline_view'; // 课程教学大纲
  import planView from './plan/plan_view'; // 教学计划
  import coursewareView from './courseware/courseware_view'; // 课件
  import eoView from './EO/EO_view'; // 评测与作业
  import tqvInfoView from './TQVInfo/TQVInfo_view'; // 教学质量评价表
  import treInfoView from './TREInfo/TREInfo_view'; // 试运行评估表

  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        title: '---', // 课程名称
        logo: '', // 封面
        menuActive: 'load', // 激活菜单
      }
    },
    methods: {
      // 初始化
      init() {
        this.getViewData();
      },
      // 菜单点击
      menuClick(menu) {
        this.menuActive = 'load';
        setTimeout(() => this.menuActive = menu, 500)
      },
      // 获取查看数据
      getViewData() {
        this.ajax({
          ajaxSuccess: res => {
            this.$store.commit('curriculum/data/updateData', res.data);
            this.title = this.$store.state.curriculum.data.course.title;
            this.logo = this.$store.state.curriculum.data.course.logo;
            setTimeout(() => this.menuActive = 'intro', 1000)
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
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
    },

    //初始化组件
    created() {
      this.$store.commit('curriculum/data/init')
      this.init();
    },

    // 销毁状态
    destroyed() {
      // this.$store.commit('curriculum/data/destroy')
    },

    components: {
      loading,
      layout,
      nmenuItem,
      basicView,
      // noticeView,
      introView,
      outlineView,
      planView,
      coursewareView,
      eoView,
      tqvInfoView,
      treInfoView,
    }

  }

</script>
<style lang="scss">


</style>
