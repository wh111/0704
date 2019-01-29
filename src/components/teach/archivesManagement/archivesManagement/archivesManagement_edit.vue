<!--修改-->
<!--档案查看-->
<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本情况" name="first">
        <!-- 基本情况-->
        <keep-alive>
          <basic :operailityData="operailityData" :fromWhere="'archives'" v-if="currentView==0" @edit="subCallback"></basic>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="学历信息" name="second">
        <keep-alive>
          <education :data-id="operailityData.id" v-if="currentView==1" @edit="subCallback"></education>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="工作经历" name="third">
        <!--   工作经历-->
        <keep-alive>
          <work-experience :data-id="operailityData.id" v-if="currentView==2" @edit="subCallback"></work-experience>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="专业技术职称晋升情况" name="fourth">
        <!-- 专业技术职称晋升情况-->
        <keep-alive>
          <professional-skill :data-id="operailityData.id" v-if="currentView==3" @edit="subCallback"></professional-skill>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="资格证书取得情况" name="five">
        <!-- 资格证书取得情况-->
        <keep-alive>
          <credentials :data-id="operailityData.id" v-if="currentView==4" @edit="subCallback"></credentials>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="教学经历" name="six">
        <!--教学经历-->
        <keep-alive>
          <teaching-experience :data-id="operailityData.id" v-if="currentView==5" @edit="subCallback"></teaching-experience>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="学习培训情况" name="seven">
        <!--学习培训情况-->
        <keep-alive>
          <study :data-id="operailityData.id" v-if="currentView==6" @edit="subCallback"></study>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="培训考试、考核情况" name="eight">
        <!--培训考试、考核情况-->
        <keep-alive>
          <train :data-id="operailityData.id" v-if="currentView==7" @edit="subCallback"></train>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="获奖情况" name="nine">
        <!--获奖情况-->
        <keep-alive>
          <awards :data-id="operailityData.id" v-if="currentView==8" @edit="subCallback"></awards>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="科研信息" name="ten">
        <!--科研信息-->
        <keep-alive>
          <scientific :data-id="operailityData.id" v-if="currentView==9" @edit="subCallback"></scientific>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="证件复印件" name="eleven">
        <!--证件复印件-->
        <keep-alive>
          <papers :data-id="operailityData.id" v-if="currentView==10" @edit="subCallback"></papers>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  /*引入查看的子组件*/
  //  引入--基本情况--组件
  //import basic from './archivesManagement_edit/archivesManagement_edit_basic.vue';
  import basic from '../../../base/sysManage/departmentStaff/departmentStaff_edit.vue';
  //  引入--学历信息--组件
  import education from './archivesManagement_edit/archivesManagement_edit_education.vue';
  //  引入--工作经历--组件
  import workExperience from './archivesManagement_edit/archivesManagement_edit_workExperience.vue';
  //  引入--专业技术职称晋升情况--组件
  import professionalSkill from './archivesManagement_edit/archivesManagement_edit_professionalSkill.vue';
  //  引入--资格证书取得情况--组件
  import credentials from './archivesManagement_edit/archivesManagement_edit_credentials.vue';
  //  引入--教学经历--组件
  import teachingExperience from './archivesManagement_edit/archivesManagement_edit_teachingExperience.vue';
  //  引入--学习培训情况--组件
  import study from './archivesManagement_edit/archivesManagement_edit_study.vue';
  //  引入--培训考试、考核情况--组件
  import train from './archivesManagement_edit/archivesManagement_edit_train.vue';
  //  引入--获奖情况--组件
  import awards from './archivesManagement_edit/archivesManagement_edit_awards.vue';
  //  引入--科研信息--组件
  import scientific from './archivesManagement_edit/archivesManagement_edit_scientific.vue';
  //  引入--证件复印件--组件
  import papers from './archivesManagement_edit/archivesManagement_edit_papers.vue';

  export default {
    props: ['operailityData'],
    data() {
      return {
        currentView: 0,
        activeName: 'first',
      };
    },
    methods: {
      handleClick(tab, event) {
        this.currentView = tab["index"];
      },
      //模态窗操作完成后的回调
      subCallback(target, title, updata) {
        this.$emit('edit', target, title, updata)
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
