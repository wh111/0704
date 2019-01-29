<!-- 基础教务 - 资源库管理 - 修改标准课程 -->
<template>
  <layout>
    <!-- 菜单 -->
    <div slot="menu">
      <nmenu-item :class="{'active':menuActive === 'basic'}" name="basic" @click="menuClick">课程基本信息</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'intro'}" name="intro" @click="menuClick">课程简介</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'outline'}" name="outline" @click="menuClick">课程教学大纲</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'plan'}" name="plan" @click="menuClick">教学计划</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'courseware'}" name="courseware" @click="menuClick">课件</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'EO'}" name="EO" @click="menuClick">评测与作业</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'TQVInfo'}" name="TQVInfo" @click="menuClick">教学质量评价表</nmenu-item>
      <!-- <nmenu-item :class="{'active':menuActive === 'TREInfo'}" name="TREInfo" @click="menuClick">试运行评估表</nmenu-item> -->
    </div>
    <!-- 底部 -->
    <div align="center" slot="footer">
      <el-button type="info" @click="saveCall('DXD')">保存草稿</el-button>
      <el-button type="success" @click="saveCall('DSH')">提交审核</el-button>
    </div>
    <!-- 内容 start -->
    <!-- 加载动画 -->
    <keep-alive>
      <loading v-if="menuActive === 'load'" ref="load"></loading>
    </keep-alive>
    <!-- 课程基本信息 -->
    <basic-edit v-if="menuActive === 'basic'" ref="basic"></basic-edit>
    <!-- 课程简介 -->
    <intro-edit v-if="menuActive === 'intro'" ref="intro"></intro-edit>
    <!-- 课程教学大纲 -->
    <outline-edit v-if="menuActive === 'outline'" ref="outline"></outline-edit>
    <!-- 教学计划 -->
    <plan-edit v-if="menuActive === 'plan'" ref="plan"></plan-edit>
    <!-- 课件 -->
    <courseware-edit v-if="menuActive === 'courseware'" ref="courseware"></courseware-edit>
    <!-- 评测与作业 -->
    <eo-edit v-if="menuActive === 'EO'" ref="EO"></eo-edit>
    <!-- 教学质量评价表 -->
    <tqv-info-edit v-if="menuActive === 'TQVInfo'" ref="TQVInfo"></tqv-info-edit>
    <!-- 试运行评估表 -->
    <!-- <tre-info-edit v-if="menuActive === 'TREInfo'" ref="TREInfo"></tre-info-edit> -->
    <!-- 内容 end -->
  </layout>
</template>

<script>
  import api from './api';
  import {
    getCourse
  } from './dataTool';
  /*当前组件必要引入*/
  import layout from "./_components/layout"; // 基础布局
  import nmenuItem from './_components/menu'; // 菜单项

  import loading from "./load/loading"; // 加载动画

  import basicEdit from './basic/basic_edit'; // 课程基本信息
  import introEdit from './intro/intro_edit'; // 课程简介
  import outlineEdit from './outline/outline_edit'; // 课程教学大纲
  import planEdit from './plan/plan_edit'; // 教学计划
  import coursewareEdit from './courseware/courseware_edit'; // 课件
  import eoEdit from './EO/EO_edit'; // 评测与作业
  import tqvInfoEdit from './TQVInfo/TQVInfo_edit'; // 教学质量评价表
  // import treInfoEdit from './TREInfo/TREInfo_edit'; // 试运行评估表

  export default {
    props: ['operailityData'],
    data() {
      return {
        menuActive: 'load', // 激活菜单
      }
    },
    methods: {
      // 菜单点击
      menuClick(menu) {
        // 保存数据到store之后才能切到目标菜单
        if (this.$refs[this.menuActive].saveToStore()) {
          this.menuActive = 'load';
          setTimeout(() => this.menuActive = menu, 500)
        }
      },
      // 保存 调用子组件的save方法
      saveCall(status) {
        let msg = status === 'DXD' ? '保存草稿' : '提交审核';
        if (this.$refs[this.menuActive].saveToStore()) {
          this.ajax({
            type: 'edit',
            successTitle: msg + '成功',
            errorTitle: msg + '失败',
            ajaxSuccess: 'ajaxSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              jsonString: true,
              url: api.modify.path + this.operailityData.id,
              method: api.modify.method,
              data: this.getSaveData(status)
            }
          })
        }
      },
      // 获取查看数据
      getViewData() {
        this.ajax({
          ajaxSuccess: res => {
            this.$store.commit('curriculum/data/updateData', res.data);
            setTimeout(() => this.menuActive = 'basic', 1000)
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        })
      },
      // 获取数据
      getSaveData(status) {
        let theData = this.$store.state.curriculum.data;
        return getCourse(theData.course, theData.evaluate, theData.planDtoList, status)
      },
    },

    //初始化组件
    created() {
      this.$store.commit('curriculum/data/init');
      this.getViewData();
    },

    // 销毁状态
    destroyed() {
      this.$store.commit('curriculum/data/destroy')
    },

    mounted() {},

    components: {
      loading,
      layout,
      nmenuItem,
      basicEdit,
      introEdit,
      outlineEdit,
      planEdit,
      coursewareEdit,
      eoEdit,
      tqvInfoEdit,
      // treInfoEdit,
    }

  }

</script>
<style lang="scss">


</style>
