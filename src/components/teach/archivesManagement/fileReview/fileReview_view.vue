<!--档案查看-->
<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本情况" name="first">
        <!-- 基本情况-->
        <keep-alive>
          <basic :data-id="operailityData.id" v-if="currentView==0"></basic>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="学历信息" name="second">
        <keep-alive>
          <education :data-id="operailityData.id" v-if="currentView==1"></education>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="工作经历" name="third">
        <!--   工作经历-->
        <keep-alive>
          <work-experience :data-id="operailityData.id" v-if="currentView==2"></work-experience>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="专业技术职称晋升情况" name="fourth">
        <!-- 专业技术职称晋升情况-->
        <keep-alive>
          <professional-skill :data-id="operailityData.id" v-if="currentView==3"></professional-skill>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="资格证书取得情况" name="five">
        <!-- 资格证书取得情况-->
        <keep-alive>
          <credentials :data-id="operailityData.id" v-if="currentView==4"></credentials>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="教学经历" name="six">
        <!--教学经历-->
        <keep-alive>
          <teaching-experience :data-id="operailityData.id" v-if="currentView==5"></teaching-experience>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="学习培训情况" name="seven">
        <!--学习培训情况-->
        <keep-alive>
          <study :data-id="operailityData.id" v-if="currentView==6"></study>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="培训考试、考核情况" name="eight">
        <!--培训考试、考核情况-->
        <keep-alive>
          <train :data-id="operailityData.id" v-if="currentView==7"></train>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="获奖情况" name="nine">
        <!--获奖情况-->
        <keep-alive>
          <awards :data-id="operailityData.id" v-if="currentView==8"></awards>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="科研信息" name="ten">
        <!--科研信息-->
        <keep-alive>
          <scientific :data-id="operailityData.id" v-if="currentView==9"></scientific>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="证件复印件" name="eleven">
        <!--证件复印件-->
        <keep-alive>
          <papers :data-id="operailityData.id" v-if="currentView==10"></papers>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  /*引入查看的子组件*/
  //  引入--基本情况--组件
  import basic from './fileReview_view/fileReview_view_basic.vue';
  //  引入--学历信息--组件
  import education from './fileReview_view/fileReview_view_education.vue';
  //  引入--工作经历--组件
  import workExperience from './fileReview_view/fileReview_view_workExperience.vue';
  //  引入--专业技术职称晋升情况--组件
  import professionalSkill from './fileReview_view/fileReview_view_professionalSkill.vue';
  //  引入--资格证书取得情况--组件
  import credentials from './fileReview_view/fileReview_view_credentials.vue';
  //  引入--教学经历--.vue';
  //  引入--培训考试、考核情况--组件组件
  import teachingExperience from './fileReview_view/fileReview_view_teachingExperience.vue';
  //  引入--学习培训情况--组件
  import study from './fileReview_view/fileReview_view_study';
  import train from './fileReview_view/fileReview_view_train.vue';
  //  引入--获奖情况--组件
  import awards from './fileReview_view/fileReview_view_awards.vue';
  //  引入--科研信息--组件
  import scientific from './fileReview_view/fileReview_view_scientific.vue';
  //  引入--证件复印件--组件
  import papers from './fileReview_view/fileReview_view_papers.vue';

  export default {
    props:['operailityData'],
    data() {
      return {
        activeName: 'first',
        currentView: 0,
      };
    },
    methods: {
      handleClick(tab, event) {
        this.currentView = tab["index"];
      },
    },
    components:{
      basic,education,workExperience,professionalSkill,credentials,teachingExperience,study,train,awards,scientific,papers
    }
  };
</script>
