<template>
  <!-- 技能考核 - 补考 - 实习生 -->
  <div>
    <h3 align="center">出科考核补考申请</h3>
    <el-row style="margin-top:20px;">
      <el-form label-width="120px">
        <el-col :span="10" :offset="2">
          <el-form-item label="姓名：">
            {{ viewData.userName }}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="科室：">
            {{ viewData.greatName }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="入科时间：">
            {{ viewData.beginTime }}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="出科时间：">
            {{ viewData.endTime }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="周期：">
            {{ viewData.makeupTs }}周
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="技能成绩：">
            {{ viewData.skillExamScore }}
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="2">
          <el-form-item label="技能操作视频：">
            <upload-file @setUploadFiles="setUploadFiles" :length="1" :uploadFiles="uploadFiles" :size="2048*1024" accept="mp4"></upload-file>
          </el-form-item>
        </el-col>
      </el-form>
      <div style="padding-top:16px;clear:both;">
        <el-col :span="6" :offset="6" align="center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
        <el-col :span="6" align="center">
          <el-button @click="cancel">取消</el-button>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
  import api from './api';
  export default {
    props: ['operailityData'],
    data() {
      return {
        self: this,
        viewData: [],
        uploadFiles: [],
        //form表单bind数据
        formValidate: { // 缺少podId、生源类型
          fileId: '',
          podId: this.operailityData.examinationId,
          type: 'BIG_DEP', // DEP 小科 | BIG_DEP 出大科
        },
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
      }
    },
    methods: {
      // 初始化
      init() {
        this.getViewData()
      },

      // 获取预览数据
      getViewData() {
        this.ajax({
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: api.get.path + this.operailityData.examinationId,
            method: api.get.method,
            params: {
              rtId: this.operailityData.rtId,
              groupNo: this.operailityData.groupNo,
            },
          }
        })
      },

      // 获取数据成功
      getDataSuccess(res) {
        this.viewData = res.data;
        // let fileId = [];
        // this.uploadFiles.length = 0;
        // res.data.summaryFileList.map(item => {
        //   fileId.push(item.id);
        //   this.uploadFiles.push({
        //     fileId: item.id,
        //     fileName: item.fileName,
        //     filePath: '/api/file/download/' + item.id
        //   })
        // });
        // this.fileId = fileId.join(',')
      },

      // 上传附件
      setUploadFiles(ids) {
        this.formValidate.fileId = ids;
      },

      // 取消
      cancel() {
        this.$emit('cancel', 'skill')
      },

      // 提交
      listenSubEvent(isLoadingFun) {
        if (!this.formValidate.fileId) {
          this.errorMess('请上传技能操作视频')
          return
        }
        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true);
        this.ajax({
          type:'skill',
          successTitle: '补考提交成功',
          errorTitle: '补考提交失败',
//          ajaxSuccess: 'getDataSuccess',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.skillMakeUpExamAdd.path,
            method: api.skillMakeUpExamAdd.method,
            data: this.formValidate
          }
        }, isLoadingFun)
      },
    },
    components: {},
    created() {
      this.init()
    },
  }

</script>

<style>
  /* 技能考核 - 补考 */

</style>
