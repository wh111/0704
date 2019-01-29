<!--档案查看-->
<template>
  <div>
    <p align="right">
      <el-button @click="changeView">切换视图</el-button>
    </p>
    <keep-alive>
    <el-tabs v-show="showTab" v-model="activeName">
      <el-tab-pane label="基本情况" name="basic">
        <!-- 基本情况-->
        <keep-alive>
          <basic :data-id="operailityData.id" v-if="activeName==='basic'" :byFilter="byFilter"></basic>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="学历信息" name="education">
        <keep-alive>
          <education :data-id="operailityData.id" v-if="activeName==='education'" :byFilter="byFilter"></education>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="工作经历" name="work-experience">
        <!--   工作经历-->
        <keep-alive>
          <work-experience :data-id="operailityData.id" v-if="activeName==='work-experience'"
                           :byFilter="byFilter"></work-experience>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="专业技术职称晋升情况" name="professional-skill">
        <!-- 专业技术职称晋升情况-->
        <keep-alive>
          <professional-skill :data-id="operailityData.id" v-if="activeName==='professional-skill'"
                              :byFilter="byFilter"></professional-skill>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="资格证书取得情况" name="credentials">
        <!-- 资格证书取得情况-->
        <keep-alive>
          <credentials :data-id="operailityData.id" v-if="activeName==='credentials'"
                       :byFilter="byFilter"></credentials>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="教学经历" name="teaching-experience">
        <!--教学经历-->
        <keep-alive>
          <teaching-experience :data-id="operailityData.id" v-if="activeName==='teaching-experience'"
                               :byFilter="byFilter"></teaching-experience>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="学习培训情况" name="study">
        <!--学习培训情况-->
        <keep-alive>
          <study :data-id="operailityData.id" v-if="activeName==='study'" :byFilter="byFilter"></study>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="培训考试、考核情况" name="train">
        <!--培训考试、考核情况-->
        <keep-alive>
          <train :data-id="operailityData.id" v-if="activeName==='train'" :byFilter="byFilter"></train>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="获奖情况" name="awards">
        <!--获奖情况-->
        <keep-alive>
          <awards :data-id="operailityData.id" v-if="activeName==='awards'" :byFilter="byFilter"></awards>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="科研信息" name="scientific">
        <!--科研信息-->
        <keep-alive>
          <scientific :data-id="operailityData.id" v-if="activeName==='scientific'" :byFilter="byFilter"></scientific>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="证件复印件" name="papers">
        <!--证件复印件-->
        <keep-alive>
          <papers :data-id="operailityData.id" v-if="activeName==='papers'" :byFilter="byFilter"></papers>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    </keep-alive>
    <div v-show="!showTab">
      <template v-if="initShowData">
        <basic :data-id="operailityData.id" class="archivesItems" :byFilter="byFilter"></basic>
        <education :data-id="operailityData.id" class="archivesItems" :byFilter="byFilter"></education>
        <work-experience :data-id="operailityData.id" class="archivesItems" :byFilter="byFilter"></work-experience>
        <professional-skill :data-id="operailityData.id" class="archivesItems"
                            :byFilter="byFilter"></professional-skill>
        <credentials :data-id="operailityData.id" class="archivesItems" :byFilter="byFilter"></credentials>
        <teaching-experience :data-id="operailityData.id" class="archivesItems"
                             :byFilter="byFilter"></teaching-experience>
        <study :data-id="operailityData.id" class="archivesItems" :byFilter="byFilter"></study>
        <train :data-id="operailityData.id" class="archivesItems" :byFilter="byFilter"></train>
        <awards :data-id="operailityData.id" class="archivesItems" :byFilter="byFilter"></awards>
        <scientific :data-id="operailityData.id" class="archivesItems" :byFilter="byFilter"></scientific>
        <papers :data-id="operailityData.id" class="archivesItems" :byFilter="byFilter"></papers>
      </template>
    </div>
  </div>
</template>
<script>
  /*引入查看的子组件*/
  //  引入--基本情况--组件
  import basic from '../../../common/archivesManagement/archivesManagement_basic/s_yjs/view.vue';
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
    props: ['operailityData', 'byFilter'],
    data() {
      return {
        activeName: 'basic',
//        activeName: 0,
        showTab:true,
        initShowData: false,
      };
    },
    methods: {
      handleClick(tab, event) {
        this.activeName = tab["index"];
      },
      changeView(){
        this.showTab = !this.showTab;
        if(this.showTab){
          this.activeName= 'basic';
//          this.activeName = 0;
        }
        this.initShowData = true;
      },
    },
    components: {
      basic,
      education,
      workExperience,
      professionalSkill,
      credentials,
      teachingExperience,
      study,
      train,
      awards,
      scientific,
      papers
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
