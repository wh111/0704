<template>
  <el-form label-width="100px">
    <el-row>

      <el-col :span="8" :offset="2">
        <el-form-item label="设备名称：">
          {{ showData.consumablesName }}
        </el-form-item>
      </el-col>
      <el-col :span="8" :offset="2">
        <el-form-item label="数量：">
          {{ showData.borrowerNum }}
        </el-form-item>
      </el-col>

      <el-col :span="8" :offset="2">
        <el-form-item label="借用人：">
          {{ showData.borrower }}
        </el-form-item>
      </el-col>
      <el-col :span="8" :offset="2">
        <el-form-item label="借用时间：">
          {{ showData.borrowerTime }}
        </el-form-item>
      </el-col>

      <el-col :span="18" :offset="2">
        <el-form-item label="用途：">
          {{ showData.purpose }}
        </el-form-item>
      </el-col>

      <el-col :span="18" :offset="2">
        <el-form-item label="备注：">
          {{ showData.remark }}
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      id: {
        type: [Number, String],
        required: true
      },
      urlParams: { // api对象
        type: Object,
        required: true
      }
    },
    data() {
      return {
        //form表单bind数据
        showData: {
          // "id": "1",
          // "consumablesId": "1",
          consumablesName: "-",
          borrowerNum: "-",
          borrower: "-",
          borrowerTime: "-",
          purpose: "-",
          remark: "-"
        }
      }
    },
    methods: {
      /**************************** 从服务器获取编辑的数据 *****************************************/
      getDataForServer() {
        this.ajax({
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: `${this.urlParams.path}/${this.id}`,
            method: this.urlParams.method
          }
        })
      },
      ajaxSuccess(res) {
        this.showData = res.data // 初始化编辑数据
      },
      /*
       * 组件初始化入口
       * */
      init() {
        this.getDataForServer()
      }
    },
    created() {
      this.init()
    }
  }

</script>
