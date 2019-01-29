<!--档案-->
<template>
  <div :class="{'userInfoAllShow': !showTab }">
    <p align="right">
      <el-button @click="changeView">切换视图</el-button>
    </p>
    <el-tabs v-model="activeName" v-show="showTab">
      <el-tab-pane label="基本情况" name="basic"></el-tab-pane>
      <el-tab-pane label="学历信息" name="education"></el-tab-pane>
      <el-tab-pane label="工作经历" name="workExperience"></el-tab-pane>
      <el-tab-pane label="专业技术职称晋升情况" name="professionalSkill"></el-tab-pane>
      <el-tab-pane label="资格证书取得情况" name="credentials"></el-tab-pane>
      <el-tab-pane label="教学经历" name="teachingExperience"></el-tab-pane>
      <el-tab-pane label="学习培训情况" name="study"></el-tab-pane>
      <el-tab-pane label="培训考试、考核情况" name="train"></el-tab-pane>
      <el-tab-pane label="获奖情况" name="awards"></el-tab-pane>
      <el-tab-pane label="科研信息" name="scientific"></el-tab-pane>
      <el-tab-pane label="证件复印件" name="papers"></el-tab-pane>
    </el-tabs>

    <basic class="userInfoItem" :dataId="operailityData.id" v-show="!showTab || activeName==='basic'" ref="basic" @save="saveCall" :addRules="basicAddRules" :mustUploadHP="mustUploadHP"></basic>
    <education class="userInfoItem" :dataId="operailityData.id" v-show="!showTab || activeName==='education'" ref="education" @save="saveCall"></education>
    <work-experience class="userInfoItem" :dataId="operailityData.id" v-show="!showTab || activeName==='workExperience'" ref="workExperience" @save="saveCall"></work-experience>
    <professional-skill class="userInfoItem" :dataId="operailityData.id" v-show="!showTab || activeName==='professionalSkill'" ref="professionalSkill" @save="saveCall"></professional-skill>
    <credentials class="userInfoItem" :dataId="operailityData.id" v-show="!showTab || activeName==='credentials'" ref="credentials" @save="saveCall"></credentials>
    <teaching-experience class="userInfoItem" :dataId="operailityData.id" v-show="!showTab || activeName==='teachingExperience'" ref="teachingExperience" @save="saveCall"></teaching-experience>
    <study class="userInfoItem" :dataId="operailityData.id" v-show="!showTab || activeName==='study'" ref="study" @save="saveCall"></study>
    <train class="userInfoItem" :dataId="operailityData.id" v-show="!showTab || activeName==='train'" ref="train" @save="saveCall"></train>
    <awards class="userInfoItem" :dataId="operailityData.id" v-show="!showTab || activeName==='awards'" ref="awards" @save="saveCall"></awards>
    <scientific class="userInfoItem" :dataId="operailityData.id" v-show="!showTab || activeName==='scientific'" ref="scientific" @save="saveCall"></scientific>
    <papers class="userInfoItem" :dataId="operailityData.id" v-show="!showTab || activeName==='papers'" ref="papers" @save="saveCall"></papers>

    <div style="font-size: 1px;overflow: hidden;line-height: 1;border-top:1px solid #e3e8ee;margin: 12px 0;"></div>
    <div align="center">
      <!--<el-button type="primary" v-if="userInfo.archivesAuditStatus!='NOT_AUDIT'" @click="saveDataToParent">保存</el-button>-->
      <!--<el-button type="primary" @click="saveData">保存</el-button>-->
      <!--<load-btn v-if="userInfo.archivesAuditStatus!='NOT_AUDIT'" @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>-->
      <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      <!--<span v-if="userInfo.archivesAuditStatus=='NOT_AUDIT'" style="margin-right: 10px;color: #FF4949;">您的档案信息正在审核中……</span>-->
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>
  /*引入查看的子组件*/
  //  引入--基本情况--组件
  import basic from '../../../common/archivesManagement/archivesManagement_basic/s_yjs/input.vue';
  //  引入--学历信息--组件
  import education from '../../../common/archivesManagement/archivesManagement_edit/archivesManagement_edit_education.vue';
  //  引入--工作经历--组件
  import workExperience from '../../../common/archivesManagement/archivesManagement_edit/archivesManagement_edit_workExperience.vue';
  //  引入--专业技术职称晋升情况--组件
  import professionalSkill from '../../../common/archivesManagement/archivesManagement_edit/archivesManagement_edit_professionalSkill.vue';
  //  引入--资格证书取得情况--组件
  import credentials from '../../../common/archivesManagement/archivesManagement_edit/archivesManagement_edit_credentials.vue';
  //  引入--教学经历--组件
  import teachingExperience from '../../../common/archivesManagement/archivesManagement_edit/archivesManagement_edit_teachingExperience.vue';
  //  引入--学习培训情况--组件
  import study from '../../../common/archivesManagement/archivesManagement_edit/archivesManagement_edit_study.vue';
  //  引入--培训考试、考核情况--组件
  import train from '../../../common/archivesManagement/archivesManagement_edit/archivesManagement_edit_train.vue';
  //  引入--获奖情况--组件
  import awards from '../../../common/archivesManagement/archivesManagement_edit/archivesManagement_edit_awards.vue';
  //  引入--科研信息--组件
  import scientific from '../../../common/archivesManagement/archivesManagement_edit/archivesManagement_edit_scientific.vue';
  //  引入--证件复印件--组件
  import papers from '../../../common/archivesManagement/archivesManagement_edit/archivesManagement_edit_papers.vue';

  let Util = null;
  let loadingFun = null;

  import {basicAddRules} from '../../../base/sysManage/rules';

  export default {
    props:['operailityData','mustUploadHP'],
    data() {
      return {
        basicAddRules,
        showTab: true,
        activeName: 'basic',
        //保存按钮基本信息
        loadBtn:{title:'保存',callParEvent:'listenSubEvent'},
        allTab:['basic','education','workExperience','professionalSkill','credentials','teachingExperience','study','train','awards','scientific','papers'],
        saveTab:[],
      };
    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init(){},

      // 切换视图
      changeView(){
        this.showTab = !this.showTab;
        if(this.showTab){
          this.activeName= 'basic';
        }
      },

      // 保存
      saveData(){
        if(this.showTab){ // 单个保存
          this.$refs[this.activeName].saveCurrData()
        }else { // 全部保存
          this.allTab.map(item=>this.$refs[item].saveCurrData())
        }
      },

      // 保存回调
      saveCall(type){
        if(this.showTab){
//          loadingFun(false);
//          this.successMess('保存成功')
          this.$emit('edit','edit','保存成功')
        }else {
          loadingFun(true);
          this.saveTab.push(type);
          if (this.saveTab.length == this.allTab.length){
            loadingFun(false);
//          this.successMess('保存成功');
            this.$emit('edit','edit','保存成功')
          }
          if (this.saveTab.indexOf('basic') == -1){ // 基本信息未填写完整
            loadingFun(false);
          }
        }
//        console.log(type)
//        this.showMess(type)
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        this.saveTab.length = 0;
        if (!isLoadingFun) isLoadingFun = function () {};
//        isLoadingFun(true);
        if(this.showTab){
//          console.log('单个保存'+this.activeName);
          this.$refs[this.activeName].saveCurrData()
        }else {
          this.allTab.map(item=>this.$refs[item].saveCurrData())
//          console.log('全部保存')
        }
        loadingFun = isLoadingFun
      },



      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','edit');
      },

    },
    created(){
      this.init();
    },
    computed:{
      userInfo(){
        let info = this.$store.getters.getUserInfo || {};
        return info;
      }
    },
    components:{
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
  .userInfoAllShow{
    .userInfoItem{
      &~.userInfoItem{
        margin-top: 40px;
      }
    }
  }
</style>
