<!--档案查看-->
<template>
  <div>
    <p align="right">
      <el-button @click="changeView">切换视图</el-button>
    </p>
    <el-tabs v-show="showTab" v-model="activeName" @tab-click="handleClick">
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
    <div v-show="!showTab">
      <template v-if="initShowData">
        <basic :data-id="operailityData.id" class="archivesItems"></basic>
        <education :data-id="operailityData.id" class="archivesItems"></education>
        <work-experience :data-id="operailityData.id" class="archivesItems"></work-experience>
        <professional-skill :data-id="operailityData.id" class="archivesItems"></professional-skill>
        <credentials :data-id="operailityData.id" class="archivesItems"></credentials>
        <teaching-experience :data-id="operailityData.id" class="archivesItems"></teaching-experience>
        <study :data-id="operailityData.id" class="archivesItems"></study>
        <train :data-id="operailityData.id" class="archivesItems"></train>
        <awards :data-id="operailityData.id" class="archivesItems"></awards>
        <scientific :data-id="operailityData.id" class="archivesItems"></scientific>
        <papers :data-id="operailityData.id" class="archivesItems"></papers>
      </template>
    </div>
  </div>
</template>
<script>
  /*引入查看的子组件*/
//  引入--基本情况--组件
  import basic from '../../../common/archivesManagement/archivesManagement_basic/other/view.vue';
//  引入--学历信息--组件
  import education from '../../../common/archivesManagement/archivesManagement_view/archivesManagement_view_education.vue';
//  引入--工作经历--组件
  import workExperience from '../../../common/archivesManagement/archivesManagement_view/archivesManagement_view_workExperience.vue';
//  引入--专业技术职称晋升情况--组件
  import professionalSkill from '../../../common/archivesManagement/archivesManagement_view/archivesManagement_view_professionalSkill.vue';
//  引入--资格证书取得情况--组件
  import credentials from '../../../common/archivesManagement/archivesManagement_view/archivesManagement_view_credentials.vue';
//  引入--教学经历--组件
  import teachingExperience from '../../../common/archivesManagement/archivesManagement_view/archivesManagement_view_teachingExperience.vue';
//  引入--学习培训情况--组件
  import study from '../../../common/archivesManagement/archivesManagement_view/archivesManagement_view_study.vue';
//  引入--培训考试、考核情况--组件
  import train from '../../../common/archivesManagement/archivesManagement_view/archivesManagement_view_train.vue';
//  引入--获奖情况--组件
  import awards from '../../../common/archivesManagement/archivesManagement_view/archivesManagement_view_awards.vue';
//  引入--科研信息--组件
  import scientific from '../../../common/archivesManagement/archivesManagement_view/archivesManagement_view_scientific.vue';
//  引入--证件复印件--组件
  import papers from '../../../common/archivesManagement/archivesManagement_view/archivesManagement_view_papers.vue';

  export default {
    props:['operailityData'],
    data() {
      return {
        activeName: 'first',
        currentView: 0,
        showTab:true,
        initShowData:false,
      };
    },
    methods: {
      handleClick(tab, event) {
        this.currentView = tab["index"];
      },
      changeView(){
        this.showTab = !this.showTab;
        if(this.showTab){
          this.activeName= 'first';
          this.currentView = 0;
        }
        this.initShowData =true;
      },
    },
    components:{
      basic,education,workExperience,professionalSkill,credentials,teachingExperience,study,train,awards,scientific,papers
    }
  };
</script>

<style lang="scss">
  .archivesItems{
    &~&{
      margin-top:50px;
    }
  }
</style>
