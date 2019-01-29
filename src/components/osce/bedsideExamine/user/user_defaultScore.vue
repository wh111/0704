<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-form>
      <el-form-item>
        <span style="text-indent: 2em;">
          确定设置“{{ operailityData.examName }}”为的 {{ operailityData.userName }} 出科考核成绩吗？
        </span>
      </el-form-item>
    </el-form>
    <div align="center">
      <el-button type="info" @click="setCall">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data () {
      return {};
    },
    methods: {
      //初始化请求列表数据
      init () {

      },
      setCall () {
        let opt = {
          ajaxSuccess: res => this.$emit('set', 'defaultScore', '设为出科成绩成功'),
          ajaxError: () => this.errorMess('设为出科成绩失败'),
          ajaxParams: {
            url: api.setMark.path,
            method: api.setMark.method,
            data: {
              podId: this.operailityData.podId,
              bedsideId: this.operailityData.bedsideId,
              isGraduateMark: 'YES'
            }
          }
        };
        this.ajax(opt);
      },
      cancel () {
        this.$emit('cancel', 'defaultScore');
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
