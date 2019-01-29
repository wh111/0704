<template>
  <!-- 出科考核补考申请 -->
  <div>
    <h3 align="center">出科考核补考申请</h3>
    <el-row>
      <el-form :inline="true" :model="formValidate" ref="formValidate" :rules="rules" label-width="110px">
        <el-col :span="10" :offset="2">
          <el-form-item label="姓名：">
            {{ showData.userName }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="科室：">
            {{ showData.depName }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="入科时间：">
            {{ showData.rotaryBeginTime }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="出科时间：">
            {{ showData.rotaryEndTime }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="周期：">
            {{ showData.ts || 0 }} {{ showData.podType === 'SXS' ? '周' : '月' }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="技能成绩：" prop="mark">
            <el-input v-model="formValidate.mark" :maxlength="3"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <el-col :span="20" :offset="2">
        <div class="gsmuaVideoPlayer">
          <video-player  style="height: 350px" :filePath="videoUrl" v-if="videoUrl"></video-player>
          <div :filePath="videoUrl" v-else style="color: #fff;font-size: 20px;line-height: 300px;text-align: center">暂无视频</div>
        </div>
      </el-col>
      <div style="padding:20px 0;">
        <el-col :span="6" :offset="6" align="center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
        <el-col :span="6" align="center">
          <el-button type="info" @click="cancel">取消</el-button>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
  import api from './api';
  import {
    givenSkillMakeUpAudit as rules
  } from '../../rules';
  import videoPlayer from '../../../common/video.vue';
  export default {
    props: ['operailityData'],
    data() {
      return {
        rules,
        videoUrl:'',
        formValidate: {
          mark: '',
        },
        showData: {},
        loadBtn: {
          title: '保存',
          callParEvent: 'listenSubEvent'
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.getInfo()
      },
      // 获取结业资料
      getInfo() {
        this.ajax({
          ajaxSuccess: res => {
            this.showData = res.data;
            if (res.data.fileList.length){
              this.videoUrl = '/api'+res.data.fileList[0].fileUrl;
            }
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.id
          }
        })
      },
      // 保存
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.ajax({
            type: 'add',
            successTitle: '提交成功!',
            errorTitle: '提交失败!',
            ajaxSuccess: 'ajaxSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              url: api.modifyExamMark.path + this.operailityData.id,
              method: api.modifyExamMark.method,
              data: {
                mark: this.formValidate.mark
              }
            }
          }, isLoadingFun)
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      // 取消
      cancel() {
        this.$emit('cancel', 'add')
      },
    },
    created() {
      this.init();
    },
    components:{
      videoPlayer,
    }
  }

</script>

<style>
  /* 出科考核补考申请 */
  .gsmuaVideoPlayer{height: 350px;margin-bottom: 20px;background-color: #000;}
</style>
