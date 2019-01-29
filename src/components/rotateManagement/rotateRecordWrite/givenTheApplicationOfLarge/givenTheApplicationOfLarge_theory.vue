<template>
  <!-- 理论考核 - 补考 -->
  <div>
    <h3 align="center">出科考核补考申请</h3>
    <el-row style="margin-top:20px;">
      <el-form label-width="100px">
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
            {{ viewData.beginTime }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="周期：">
            {{ viewData.makeupTs }}周
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="理论成绩：">
            {{ viewData.theoryExamScore }}
          </el-form-item>
        </el-col>
        <!--<el-col :span="20" :offset="2">
          <el-form-item label="理论成绩：">
            {{ viewData.theoryExamScore }}
          </el-form-item>
        </el-col>-->
      </el-form>
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
            method: api.get.method
          }
        })
      },

      // 获取数据成功
      getDataSuccess(res) {
        this.viewData = res.data;
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
