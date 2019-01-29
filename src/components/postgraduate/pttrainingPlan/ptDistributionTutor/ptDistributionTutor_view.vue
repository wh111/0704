<!--
****--@file     ptDistributionTutor_view
****--@date     2017/12/13 18:02
****--@author   YC
****--@describe 查看导师
-->
<template>
  <el-row>
    <el-form>
      <el-form-item v-if="showData===null">正在获取导师信息</el-form-item>
      <template v-else-if="showData.length">
        <el-col v-for="(item,index) in showData" :key="index">
          <el-col :span="10">
            <el-form-item label="姓名：">{{ item.teacherName }}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="导师：">第{{ item.isSubsidiary ? '二' : '一' }}导师</el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="danger" @click="remove(item)" :disabled="!item.isSubsidiary">删除</el-button>
            </el-form-item>
          </el-col>
        </el-col>
      </template>
      <el-form-item v-else>请分配导师</el-form-item>
    </el-form>
    <!--删除弹窗-->
    <Modal :mask-closable="false" height="200" v-model="removeModal" class-name="vertical-center-modal"
           :loading="loading" :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :delete-url="deleteUrl" @remove="subCallback" @cancel="cancel"
              :operaility-data="removeData"></remove>
      <div slot="footer"></div>
    </Modal>
  </el-row>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../api'
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        loading: false,
        deleteUrl: api.removeTeacher.path,
        removeData: [],
        showData: null,
        removeId: {
          id: 'removeId',
          title: '删除第二导师'
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.getTeacher()
      },
      getTeacher() {
        let opt = {
          ajaxSuccess: res => this.showData = res.data,
          ajaxParams: {
            url: api.showTeacher.path,
            method: api.showTeacher.method,
            params: {
              userId: this.operailityData.userId
            }
          }
        }
        this.ajax(opt)
      },
      remove(item) {
        this.removeData = [item];
        this.removeModal = true;
      },
      subCallback() {
        this.getTeacher();
        this.cancel();
      },
      cancel() {
        this.removeModal = false;
      }
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {}
  }

</script>
