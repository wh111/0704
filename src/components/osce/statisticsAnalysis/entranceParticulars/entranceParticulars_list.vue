<!-- 进入  详情 -->
<template>
  <div id="content" ref="content" style="height:100%;">
    <el-form ref="formValidate" label-width="100px">
      <el-row>
        <el-col :span="5" :offset="19" align="right">
          <el-button type="primary" @click="goBack">返回</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="场次概况" name="first">
        <keep-alive>
          <overview-session :url="url" :operaility-data="operailityData"></overview-session>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="考生详情" name="second">
        <keep-alive>
          <examinee v-if="activeName == 'second'" :url="url" :operaility-data="operailityData"></examinee>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="分站详情" name="third">
        <keep-alive>
          <substation v-if="activeName =='third'" :url="url" :operaility-data="operailityData"></substation>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="考核内容详情" name="eContent">
        <keep-alive>
          <e-content v-if="activeName =='eContent'" :url="url" :operaility-data="operailityData"></e-content>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="综合统计" name="fourth">
        <keep-alive>
          <comprehensive v-if="activeName =='fourth'" :url="url" :operaility-data="operailityData"></comprehensive>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  /*引入组件*/
  import url from '../app';
  /*  引入--场次概况*/
  import overviewSession from './entranceParticulars_overviewSession.vue';
  /*  引入--考生详情*/
  import examinee from './entranceParticulars_examinee.vue';
  /*  引入--分站详情*/
  import substation from './entranceParticulars_substation.vue';
  /*  引入--考核内容详情*/
  import eContent from './entranceParticulars_content';
  /*  引入--综合统计*/
  import comprehensive from './entranceParticulars_comprehensive.vue';

  export default {
    // 只拿到场次id sceneId
    props: ['operailityData'],
    data () {
      return {
        url: url,
        activeName: 'first'
      };
    },
    methods: {
      handleClick (tab, event) {},
      //返回到列表页
      goBack () {
        this.$emit('cancel');
      }
    },
    components: {
      overviewSession,
      examinee,
      substation,
      comprehensive,
      eContent
    }
  };

</script>
