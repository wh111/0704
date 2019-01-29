<!--
****--@name     费用查看
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-table :maxHeight="300" :data="formValidate" tooltip-effect="dark" align="center">
      <el-table-column label="姓名" prop="userName" show-overflow-tooltip></el-table-column>
      <el-table-column label="会议补贴" prop="trafficFee" show-overflow-tooltip>
        <template scope="scope">{{scope.row.trafficFee | score}}</template>
      </el-table-column>
      <el-table-column label="会务费" prop="conferenceFee" show-overflow-tooltip>
        <template scope="scope">{{scope.row.conferenceFee | score}}</template>
      </el-table-column>
      <el-table-column label="差旅费" prop="travelFee" show-overflow-tooltip>
        <template scope="scope">{{scope.row.travelFee | score}}</template>
      </el-table-column>
      <el-table-column label="住宿费" prop="hotelFee" show-overflow-tooltip>
        <template scope="scope">{{scope.row.hotelFee | score}}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import uploadFile from '../../../common/uploadFile.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      operailityData: {
        type: Object,
        default: () => ({id: ''})
      }
    },
    data() {
      return {
        files: [],
        // 表单数据
        formValidate: []
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        //给当前组件注入全局util
        Util = this.$util;

        if (this.operailityData.id) {
          this.getEditData()
        }
      },
      // 获取编辑数据
      getEditData() {
        let opt = {
          ajaxSuccess: "getEditDataSuccess",
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        };
        this.ajax(opt)
      },
      // 初始化编辑数据
      getEditDataSuccess(res) {
        if (!res.data || !res.data.id) {
          return
        }

        this.formValidate = res.data.conferenceUserList || [];
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      uploadFile,
    }
  }

</script>
