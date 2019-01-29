<!--
****--@file     jysperstatistic_view
****--@date     2018/11/13 13:57
****--@author   ZWT
****--@describe 查看
-->
<template>
  <div id="content" ref="content" class="modal">
    <el-form :model="formValidate" ref="formValidate" label-width="130px">
      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="指标名:" prop="code">
            <span>{{formValidate.code}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="姓名:" prop="userName">
            <span>{{formValidate.userName}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="科室:" prop="deptName">
            <span>{{formValidate.deptName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="得分:" prop="score">
            <span>{{formValidate.score}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24" style="text-align: center">


      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'jysperstatistic_view',
    props: ['operailityData'],
    data () {
      return {
        formValidate: {
          id: '',
          userName: '',
          score: '',
          deptName: '',
          code: '',
        },
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.listGit.path + this.operailityData.id,
            method: api.listGit.method,
            params: {},
          },

        },
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.ajax(this.listMessTitle);
      },
      updateListData (res) {
        this.formValidate = res.data;
      },
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {},
  }

</script>
