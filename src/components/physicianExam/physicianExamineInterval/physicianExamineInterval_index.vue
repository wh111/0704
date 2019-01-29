<!--
****--@file     physicianExamineInterval_list
****--@date     2018/5/21 11:43
****--@author   YC
****--@describe 国家医师考核-考核管理
-->
<template>
  <div>
    <ab-table-search :hasSearch="false" :tableURL="listApi" :loadTableData="loadTableData" @selectionChange="selectionChange">
      <template slot="todoBtns">
        <el-button type="success" @click="add">{{ 'new' | sysLan }}</el-button>
        <el-button type="danger" @click="remove">{{ 'delete' | sysLan }}</el-button>
      </template>
      <template slot="tableItem">
        <el-table-column align="center" label="操作" width="210">
          <template scope="scope">
            <el-button size="small" type="info" @click="view(scope.row)">{{ 'view' | sysLan }}</el-button>
            <el-button size="small" @click="edit(scope.row)" :disabled="['FINISH','ONGOING'].includes(scope.row.examStatus)">{{ 'edit' | sysLan }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="考试名称" prop="examName" min-width="100"></el-table-column>
        <el-table-column align="center" label="状态" prop="examStatus" min-width="80">
          <template scope="scope">
            {{ scope.row.examStatus | typeText }}
          </template>
        </el-table-column>
      </template>
    </ab-table-search>
    <!--删除弹窗-->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" class-name="vertical-center-modal"
           :loading="loading" :width="500">
      <modal-header slot="header" :content="headerContent.removeId"></modal-header>
      <remove v-if="removeModal" :delete-url="deleteURL" @remove="subCallback" @cancel="cancel"
              :operaility-data="operailityData" idKey="examId"></remove>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'physicianExamineIntervalIndex',
    data () {
      return {
        loading: false,
        listApi: api.list,
        deleteURL: api.remove.path,
        loadTableData: 0,
        multipleSelection: [],
        operailityData: null,
        headerContent: {
          removeId: {
            id: 'remove',
            title: '删除考核'
          }
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init () {

      },
      selectionChange (val) {
        this.multipleSelection = val
      },
      add () {
        this.$emit('viewChange', 'input')
      },
      edit (data) {
        this.$emit('viewChange', 'input', data)
      },
      view (data) {
        this.$emit('viewChange', 'view', data)
      },
      remove () {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection
          if (this.operailityData.some(item => item.examStatus == 'ONGOING')) {
            this.errorMess('场次中存在状态为“考核中”不能删除')
            return
          }
          this.openModel('remove')
        }
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected (isOnly) {
        let len = this.multipleSelection.length
        let flag = true
        if (len == 0) {
          this.showMess('请选择数据!')
          flag = false
        }
        if (len > 1 && isOnly) {
          this.showMess('只能修改一条数据!')
          flag = false
        }
        return flag
      },
      /********************************* 弹窗相关 *****************************/
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false
      },
      // 弹窗回调
      subCallback (target, title, updata) {
        this.cancel(target)
        if (title) {
          this.successMess(title)
        }
        if (!updata) {
          this.loadTableData++
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  }

</script>
