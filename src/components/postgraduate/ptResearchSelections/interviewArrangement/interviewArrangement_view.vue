<template>
  <el-form :model="formValidate" ref="formValidate" class="roomUsageFrom" label-width="100px">
    <el-row>
      <el-col>
        <el-form-item label="人员：" prop="roomId">
          <span>{{formValidate.name}}</span>
        </el-form-item>
      </el-col>

      <el-col>
        <el-form-item label="面试时间：" prop="interviewTime">
          <span>{{formValidate.interviewTime | formatDate('yyyy-MM-dd HH:mm')}}</span>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="面试地点：" prop="address">
          <span>{{formValidate.address}}</span>
        </el-form-item>
      </el-col>

      <el-col>
        <el-form-item label="备注：" prop="remarks">
          <span>{{formValidate.remarks}}</span>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      operailityData: {
        type: Object
      }
    },
    data () {
      return {
        formValidate: {
          name: '',
          interviewTime: '',
          address: '',
          remarks: ''
        },
        listMessTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.getInterview.path + this.operailityData.userId,
            method: api.getInterview.method,
            params: {}
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        this.ajax(this.listMessTitle);
      },
      successGetList (res) {
        this.formValidate = res.data;
        this.formValidate.name = this.operailityData.name;
      },
      cancel () {
        this.$emit('cancel', 'show');
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };
</script>
