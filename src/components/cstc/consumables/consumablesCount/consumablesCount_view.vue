<template>
  <el-form label-width="100px">
    <el-row>

      <el-col :span="8" :offset="2">
        <el-form-item label="设备名称：">
          {{ showData.consumablesName }}
        </el-form-item>
      </el-col>
      <el-col :span="8" :offset="2">
        <el-form-item label="期望数量：">
          {{ showData.expectNum }}
        </el-form-item>
      </el-col>

      <el-col :span="8" :offset="2">
        <el-form-item label="实际数量：">
          {{ showData.actualNum }}
        </el-form-item>
      </el-col>
      <el-col :span="8" :offset="2">
        <el-form-item label="相差数量：">
          {{ showData.differenceNum }}
        </el-form-item>
      </el-col>

      <el-col :span="8" :offset="2">
        <el-form-item label="盘点时间：">
          {{ showData.inventoryTime }}
        </el-form-item>
      </el-col>
      <el-col :span="8" :offset="2">
        <el-form-item label="盘点人：">
          {{ showData.inventoryMan }}
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
          expectNum: "-",
          actualNum: "-",
          differenceNum: "-",
          inventoryTime: "-",
          inventoryMan: "-",
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
