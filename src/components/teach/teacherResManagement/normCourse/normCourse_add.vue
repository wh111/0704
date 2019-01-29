<!-- 基础教务 - 资源库管理 - 创建标准课程 -->
<template>
  <layout>
    <!-- 菜单 -->
    <div slot="menu">
      <!-- 前置菜单 -->
      <slot name="preMenu">
        <template scope="props">
          <!-- <nmenu-item :class="{'active':menuActive === props.name}" :name="props.name" @click="menuClick">{{ props.text }}</nmenu-item> -->
          <p>{{ props.text }}</p>
        </template>
      </slot>
      <nmenu-item :class="{'active':menuActive === 'basic'}" name="basic" @click="menuClick">课程基本信息</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'intro'}" name="intro" @click="menuClick">课程简介</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'outline'}" name="outline" @click="menuClick">课程教学大纲</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'plan'}" name="plan" @click="menuClick">教学计划</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'courseware'}" name="courseware" @click="menuClick">课件</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'EO'}" name="EO" @click="menuClick">评测与作业</nmenu-item>
      <nmenu-item :class="{'active':menuActive === 'TQVInfo'}" name="TQVInfo" @click="menuClick">教学质量评价表</nmenu-item>
      <!-- <nmenu-item :class="{'active':menuActive === 'TREInfo'}" name="TREInfo" @click="menuClick">试运行评估表</nmenu-item> -->
      <!-- 后置菜单 -->
      <slot name="menu">
        <template scope="props">
          <nmenu-item :class="{'active':menuActive === props.name}" :name="props.name" @click="menuClick">{{ props.text
            }}
          </nmenu-item>
        </template>
      </slot>
    </div>
    <!-- 底部 -->
    <div align="center" slot="footer" style="height: 80px">
      <el-button type="info" @click="saveCall('DXD')">保存草稿</el-button>
      <el-button type="success" @click="saveCall('DSH')">提交审核</el-button>
    </div>
    <!-- 内容 start -->
    <!-- 前置内容 -->
    <slot name="preContent"></slot>
    <!-- 加载动画 -->
    <keep-alive>
      <loading v-if="menuActive === 'load'" ref="load"></loading>
    </keep-alive>
    <!-- 课程基本信息 -->
    <basic-edit v-show="menuActive === 'basic'" ref="basic" :operailityData="operailityData"></basic-edit>
    <!-- 课程简介 -->
    <intro-edit v-show="menuActive === 'intro'" ref="intro"></intro-edit>
    <!-- 课程教学大纲 -->
    <outline-edit v-show="menuActive === 'outline'" ref="outline"></outline-edit>
    <!-- 教学计划 -->
    <plan-edit v-show="menuActive === 'plan'" ref="plan"></plan-edit>
    <!-- 课件 -->
    <courseware-edit v-show="menuActive === 'courseware'" ref="courseware"></courseware-edit>
    <!-- 评测与作业 -->
    <eo-edit v-show="menuActive === 'EO'" ref="EO"></eo-edit>
    <!-- 教学质量评价表 -->
    <tqv-info-edit v-show="menuActive === 'TQVInfo'" ref="TQVInfo"></tqv-info-edit>
    <!-- 试运行评估表 -->
    <!-- <tre-info-edit v-if="menuActive === 'TREInfo'" ref="TREInfo"></tre-info-edit> -->
    <!-- 后置内容 -->
    <slot name="content"></slot>
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

  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['showMenu', 'operailityData'],
    data() {
      return {
        menuActive: 'basic', // 激活菜单

        vMenuActive: [ //验证各个组件的必填项
          {
            key: 'basic',
            label: '课程基本信息',
          },
          {
            key: 'intro',
            label: '课程简介',
          },
          {
            key: 'outline',
            label: '课程教学大纲',
          },
          {
            key: 'plan',
            label: '教学计划',
          },
          {
            key: 'courseware',
            label: '课件',
          },
          {
            key: 'EO',
            label: '评测与作业',
          },
          {
            key: 'TQVInfo',
            label: '教学质量评价表',
          },
        ]
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
      // 保存 调用子组件的save方法|提交审核
      saveCall(status) {
        let msg = status === 'DXD' ? '保存草稿' : '提交审核';
        for (let i = 0; i < this.vMenuActive.length; i++) { // 验证各个组件的必填项
          let item = this.vMenuActive[i];
          if (!this.$refs[item.key].saveToStore()) {
            console.log(item.key,this.menuActive);
             if(item.key!=this.menuActive)this.errorMess(`请补全${item.label}`);
            return;
          }
        }
        let flag = true;
        let saveData = this.getSaveData(status);
        saveData.planDtoList.map(item =>{
          item.testingDtoList.map(child =>{
            if(child.questionsDtoList.length>0){
              child.questionsDtoList.map(lastChild =>{
                if(lastChild.options == ''){
                  this.errorMess('请检查您添加的试题，每道试题必须包含正确答案！')
                  return flag = false
                }
              })
            }
          })
        })
        if(flag){
          this.ajax({
            type: 'add',
            successTitle: msg + '成功',
            errorTitle: msg + '失败',
            ajaxSuccess: 'ajaxSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              jsonString: true,
              url: api.add.path,
              method: api.add.method,
              data: this.getSaveData(status)
            }
          })
        }
      },
      // 获取数据
      getSaveData(status) {
        let theData = this.$store.state.curriculum.data;
        return getCourse(theData.course, theData.evaluate, theData.planDtoList, status)
      },
      //判断当前数据类型是否符合标准

    },

    //初始化组件
    created() {
      this.$store.commit('curriculum/data/init');
      // 外部可显示指定菜单
      if (this.showMenu) {
        this.menuActive = this.showMenu
      }
    },

    // 销毁状态
    destroyed() {
      this.$store.commit('curriculum/data/destroy')
    },

    mounted() {
    },

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
