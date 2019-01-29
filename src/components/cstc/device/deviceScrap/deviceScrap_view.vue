<template>
  <el-form label-width="122px">
    <el-row>

      <el-col :span="8" :offset="2">
        <el-form-item label="设备名称：">
          {{ showData.deviceTypeName }}
        </el-form-item>
      </el-col>
      <el-col :span="8" :offset="2">
        <el-form-item label="设备编号：">
          {{ showData.deviceIdentifier }}
        </el-form-item>
      </el-col>

      <el-col :span="8" :offset="2">
        <el-form-item label="报废时间：">
          {{ showData.scrapTime }}
        </el-form-item>
      </el-col>

      <el-col :span="18" :offset="2">
        <el-form-item label="报废原因：">
          {{ showData.scrapReason }}
        </el-form-item>
      </el-col>

      <el-col :span="18" :offset="2">
        <el-form-item label="处理方式：">
          {{ showData.handleWay }}
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
          deviceTypeName: "-",
          deviceIdentifier: "-",
          scrapTime: "-",
          scrapReason: "-",
          handleWay: "-"
        }
      }
    },
    methods: {
      /**************************** 从服务器获取编辑的数据 *****************************************/
      getDataForServer() {
        let roomId = this.id,
          urlParams = this.urlParams; // props
        this.ajax({
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: `${urlParams.path}/${roomId}`,
            method: urlParams.method
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
