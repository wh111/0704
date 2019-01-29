<!-- 基础教务 - 资源库管理 - 创建标准课程 -->
<template>
  <layout>
    <!-- 课程标题 -->
    <p slot="title">{{ title || '加载中...' }}</p>
    <!-- 封面图 -->
    <img :src="getPicUrl(logo)" alt="" slot="menuTop">
    <!-- 菜单 -->
    <div slot="menu">
      <!-- <nmenu-item :class="{'active':menuActive === 'basic'}" name="basic" @click="menuClick">课程基本信息</nmenu-item> -->
      <nmenu-item :class="{'active':menuActive === 'notice'}" name="notice" @click="menuClick">公告</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'intro'}" name="intro" @click="menuClick">课程简介</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'outline'}" name="outline" @click="menuClick">课程教学大纲</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'plan'}" name="plan" @click="menuClick">教学计划</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'courseware'}" name="courseware" @click="menuClick">课件</nmenu-item>
      <!-- <nmenu-item :class="{'active':menuActive === 'liveVideo'}" name="liveVideo" @click="menuClick">课程直播</nmenu-item> -->
      <nmenu-item :class="{'active':menuActive === 'EO'}" name="EO" @click="menuClick">评测与作业</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'TQVInfo'}" name="TQVInfo" @click="menuClick">教学质量评价表</nmenu-item>
      <!-- <nmenu-item :class="{'active':menuActive === 'discuss'}" name="discuss" @click="menuClick">讨论区</nmenu-item> -->
      <!-- <nmenu-item :class="{'active':menuActive === 'TREInfo'}" name="TREInfo" @click="menuClick">试运行评估表</nmenu-item> -->
    </div>
    <!-- 底部 -->
    <div slot="footer">
      <slot></slot>
    </div>
    <!-- 内容 start -->
    <!-- 加载动画 -->
    <keep-alive>
      <loading v-if="menuActive === 'load'"></loading>
    </keep-alive>
    <!-- 课程基本信息 -->
    <basic-view v-if="menuActive === 'basic'"></basic-view>
    <!-- 公告 -->
    <notice-view v-if="menuActive === 'notice'"></notice-view>
    <!-- 课程简介 -->
    <intro-view v-if="menuActive === 'intro'"></intro-view>
    <!-- 课程教学大纲 -->
    <outline-view v-if="menuActive === 'outline'"></outline-view>
    <!-- 教学计划 -->
    <plan-view v-if="menuActive === 'plan'"></plan-view>
    <!-- 课件 -->
    <courseware-view v-if="menuActive === 'courseware'" :showProgress="false"></courseware-view>
    <!-- 课程直播 -->
    <live-video-view v-if="menuActive === 'liveVideo'"></live-video-view>
    <!-- 评测与作业 (提交试题之后重新获取最新的数据并打开EQ菜单) -->
    <eo-view v-if="menuActive === 'EO'" :showInfo="false" :isCourse="true"></eo-view>
    <!-- 教学质量评价表 -->
    <tqv-info-view v-if="menuActive === 'TQVInfo'"></tqv-info-view>
    <!-- 讨论区 -->
    <!-- <discuss-view v-if="menuActive === 'discuss'"></discuss-view> -->
    <!-- 试运行评估表 -->
    <!-- <tre-info-view v-if="menuActive === 'TREInfo'"></tre-info-view> -->
    <!-- 内容 end -->
  </layout>
</template>

<script>
  import api from './api';
  /*当前组件必要引入*/
  import layout from "../../../teach/teacherResManagement/normCourse/_components/layout"; // 基础布局
  import nmenuItem from '../../../teach/teacherResManagement/normCourse/_components/menu'; // 菜单项

  import loading from "../../../teach/teacherResManagement/normCourse/load/loading"; // 加载动画

  import basicView from '../../../teach/teacherResManagement/normCourse/basic/basic_view'; // 课程基本信息
  import noticeView from '../../../teach/teacherResManagement/normCourse/notice/notice_view'; // 公告
  import introView from '../../../teach/teacherResManagement/normCourse/intro/intro_view'; // 课程简介
  import outlineView from '../../../teach/teacherResManagement/normCourse/outline/outline_view'; // 课程教学大纲
  import planView from '../../../teach/teacherResManagement/normCourse/plan/plan_view'; // 教学计划
  import coursewareView from '../../../teach/teacherResManagement/normCourse/courseware/courseware_view'; // 课件
  // import liveVideoView from '../../../teach/teacherResManagement/normCourse/liveVideo/view'; // 直播
  import eoView from '../../../teach/teacherResManagement/normCourse/EO/EO_view'; // 评测与作业
  import tqvInfoView from '../../../teach/teacherResManagement/normCourse/TQVInfo/TQVInfo_view'; // 教学质量评价表
  // import discussView from '../../../teach/teacherResManagement/normCourse/discuss/edit'; // 讨论区
  // import treInfoView from '../../../teach/teacherResManagement/normCourse/TREInfo/TREInfo_view'; // 试运行评估表

  // 测试数据
  //当前组件引入全局的util
  let Util = null;
  export default {
    /**
     * operailityData 基础数据 必须有id
     * showType 视图类型（默认正常查看，取值范围：main）
     */
    props: ['operailityData', 'showType'],
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
        let urls = {
          "main": api.mainInfo, // 最新课程查看（进行权限检测）
        };
        let getUrl = api.info; // 课程查看（不进行权限检测）
        if (this.showType) {
          getUrl = urls[this.showType] ? urls[this.showType] : getUrl;
        };
        this.ajax({
          ajaxSuccess: res => {
            this.$store.commit('curriculum/look/updateData', res.data);
            this.title = this.$store.state.curriculum.look.course.title;
            this.logo = this.$store.state.curriculum.look.course.logo;
            setTimeout(() => this.menuActive = 'notice', 1000)
            this.$emit('getViewData', res.data)
          },
          ajaxParams: {
            url: getUrl.path + this.operailityData.id,
            method: getUrl.method
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
      this.$store.commit('curriculum/look/init')
      this.init();
    },

    // 销毁状态
    destroyed() {
      //      this.$store.commit('curriculum/look/destroy')
    },

    components: {
      loading,
      layout,
      nmenuItem,
      basicView,
      noticeView,
      introView,
      outlineView,
      planView,
      coursewareView,
      // liveVideoView,
      eoView,
      tqvInfoView,
      // discussView,
      // treInfoView,
    }

  }

</script>
<style lang="scss">


</style>
