<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div class="editForm">
    <el-row>
      <el-form :model="formValidate" ref="formValidate" label-width="80px">
        <el-col :span="12">
          <el-form-item label="房间：" prop="roomNum">
            {{ formValidate.roomNum }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="IP：" prop="readerIp">
            {{ formValidate.readerIp }}
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        formValidate: {
          roomNum: '',
          roomId: '',
          readerIp: '',
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        if (this.operailityData) {
          this.getEditData()
        }
      },
      getEditData() {
        let opt = {
          ajaxSuccess: res => {
            for (let key in this.formValidate) {
              this.formValidate[key] = res.data[key]
            }
          }, ajaxError: () => this.errorMess('获取数据失败'),
          ajaxParams: {
            url: api.get.path + this.operailityData.readerId,
            method: api.get.method
          }
        };
        this.ajax(opt)
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {}
  }

</script>
