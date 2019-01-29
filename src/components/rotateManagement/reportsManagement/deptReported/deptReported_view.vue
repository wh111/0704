<template>
  <el-row>
    <el-form :inline="true">
      <el-col :span="10" :offset="2">
        <el-form-item label="姓名：">{{ viewData.userName }}
        </el-form-item>
      </el-col>
      <el-col :span="10" :offset="2">
        <el-form-item label="科室：">{{ viewData.depName }}
        </el-form-item>
      </el-col>
      <el-col :span="10" :offset="2">
        <el-form-item label="入科时间：">{{ viewData.rotaryBeginTime }}
        </el-form-item>
      </el-col>
      <el-col :span="10" :offset="2">
        <el-form-item label="报到时间：">{{ viewData.registerTime }}
        </el-form-item>
      </el-col>
      <el-col :span="20" :offset="2">
        <el-form-item label="带教老师：">
          <span class="deptReported">{{ (viewData.teacherNames || '').replace(/,/,'，') || '暂无带教老师' }}</span>
        </el-form-item>
      </el-col>
    </el-form>
  </el-row>
</template>

<script>
  import api from './api';
  export default {
    props: ['operailityData'],
    data() {
      return {
        viewData: {},
      }
    },
    methods: {
      getInfo() {
        let opt = {
          ajaxSuccess: res => {
            this.viewData = res.data;
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.podId,
            method: api.get.method,
          }
        }
        this.ajax(opt)
      },
    },
    created() {
      this.getInfo()
    }
  }

</script>

<style lang="scss">
  .deptReported {
    margin-right: 10px;
    &:empty {
      margin-right: 0
    }
  }

</style>
