<template>
  <el-form label-width="100px">
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
        <el-form-item label="借用人：">
          {{ showData.borrower }}
        </el-form-item>
      </el-col>

      <el-col :span="18" :offset="2">
        <el-form-item label="用途：">
          {{ showData.purpose }}
        </el-form-item>
      </el-col>

      <el-col :span="18" :offset="2">
        <el-form-item label="配件：">
          {{ showData.parts || '-' }}
        </el-form-item>
      </el-col>

      <el-col :span="8" :offset="2">
        <el-form-item label="借出日期：">
          {{ showData.borrowTime }}
        </el-form-item>
      </el-col>
      <el-col :span="8" :offset="2">
        <el-form-item label="归还日期：">
          {{ showData.returnTime }}
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
          deviceTypeName: "-", // 设备类型名称
          deviceIdentifier: "-", // 设备编号
          borrower: "-", // 借用人
          purpose: "-", // 用途
          borrowTime: "-", // 借出时间
          returnTime: "-", // 归还时间
          remark: "-" // 备注
        }
      }
    },
    methods: {
      /**************************** 从服务器获取编辑的数据 *****************************************/
      getDataForServer() {
        this.ajax({
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: `${this.urlParams.path}/${this.id}`,
            method: this.urlParams.method,
            params: {
              id: this.id
            }
          }
        })
      },
      getDataSuccess(res) {
        this.showData = res.data // 初始化编辑数据
      },
      /*
       * 组件初始化入口
       * */
      init() {
        //this.ajax(this.listMessTitle)
        this.getDataForServer()
      }
    },
    created() {
      this.init()
    }
  }

</script>
