<template>
  <el-row class="editForm">
    <el-form ref="formValidate" label-width="124px">
      <el-col :span="9" :offset="2">
        <el-form-item label="购买时间：">
          {{ showData.buyDate }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="购买数量：">
          {{ showData.buyNum }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="单价：">
          {{ showData.price | money }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="厂商电话：">
          {{ showData.manufacturerPhone }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="购买地址：">
          {{ showData.buyAdderss }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="存放地点：">
          {{ showData.storageLocation }}
        </el-form-item>
      </el-col>
    </el-form>
  </el-row>
</template>

<script>
  export default {
    props: {
      urlParams: {
        type: Object,
        required: true
      },
      id: { // 耗材id
        type: [Number, String],
        required: true
      }
    },
    data() {
      return {
        // 显示数据
        showData: {
          buyDate: "-",
          buyNum: "-",
          price: "-",
          manufacturerPhone: "-",
          buyAdderss: "-",
          storageLocation: "-"
        },
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
      },
    },
    mounted() {
      //初始化
      this.init();
    }
  }

</script>
