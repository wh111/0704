<!----------------------------------
****--@name     签到（吉大二院）
****--@role     ${*}
****--@date     2018/8/24
****--@author   gx
----------------------------------->
<template>
  <div>
    <div align="center">
      <print ref="print">
        <div slot="print"></div>
        <div align="center">
          <h3 style="font-size: 18px">{{formValidate.activityName}}</h3>
          <img :src="fileUrl" onerror="this.src='/static/image/qrImgLoadError.png'" alt=""
               style="width: 300px;height: 300px;">
        </div>
      </print>
      <el-button @click="print">打印二维码</el-button>
    </div>
    <div>
      <div align="right">
        <el-button @click="exportExcel"> 导出</el-button>
      </div>
      <el-table
        :data="tableData"
        :max-height="400"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="65">
        </el-table-column>
        <el-table-column
          label="编号"
          prop="codeNumber"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="姓名"
          prop="signUserName"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="signTimeStr"
          label="签到时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="activityTips"
          label="教学活动总结">
        </el-table-column>
      </el-table>
    </div>
    <Modal
      :mask-closable="false"
      close-on-click-modal="false"
      height="200"
      v-model="exportExcelModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="500">
      <modal-header slot="header" :content="exportId"></modal-header>
      <ajaxDerive messTitle="确定要导出吗？" @derive="exportExcelModal=false" @cancel="exportExcelModal=false"
                  v-if="exportExcelModal"
                  :url="url.exportSignInList+this.operailityData.id"></ajaxDerive>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  import print from '../../../common/print.vue'
  import ajaxDerive from '../../../common/ajax-derive.vue'
  //当前组件引入全局的util
  let Util = null
  export default {
    props: ['url', 'operailityData'],
    data () {
      return {
        tableData: [],
        fileUrl: '',
        formValidate: {
          'activityName': '',
          'fileList': [],
          'signRecordDtos': [],
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'oneDataSuccess',
          ajaxParams: {
            url: this.url.siginIn + this.operailityData.id,
            params: {},
          }
        },
        exportExcelModal: false,
        exportId: {
          id: 'exportId',
          title: '导出'
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        this.ajax(this.listMessTitle)
      },
      //初次获取信息
      oneDataSuccess (res) {
        console.log(res)
        let data = res.data
        if (!data) return
        this.tableData = data.signRecordDtos || []
        this.formValidate = data
        this.fileUrl = data.fileList && data.fileList[0] && '/api' + data.fileList[0].fileUrl
      },
      /**打印按钮*/
      print () {
        this.$refs.print.printContent()
      },

      /**导出按钮*/
      exportExcel () {
        this.exportExcelModal = true
      }

    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {
      print, ajaxDerive,
    }
  }
</script>
