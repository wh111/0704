<template>
  <el-row>
    <el-form :inline="true" :model="formInline" label-width="100px">
      <el-row>
        <el-col>
          <el-form-item label="专业方向:">
            <div>{{formInline.major}}</div>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="导师:">
            <div>{{formInline.teacherNames.replace(/,/g,'、')}}</div>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="学员:">
            <div>{{formInline.studentNames.replace(/,/g,'、')}}</div>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="开放时间:">
            {{formInline.openTime}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--<el-col :span="16" :offset="2">-->
    <!--<div style="margin-left: 100px">-->
    <!--<el-button  @click="cancel">关闭</el-button>-->
    <!--</div>-->
    <!--</el-col>-->
  </el-row>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../api';
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
        //获取当前组建的数据
        formInline: this.operailityData
      };
    },
    methods: {
      //初始化请求列表数据
      init () {

      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
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
