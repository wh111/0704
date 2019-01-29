<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="标题：">
        <el-input v-model="searchObj.title"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="searchObj.status">
          <el-option label="ONGOING" value="进行中"></el-option>
          <el-option label="FINALLY" value="已结束"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table align="center" :maxHeight="400" :context="self" :data="selectList" tooltip-effect="dark"
              style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="自荐开始时间" prop="startDate"></el-table-column>
      <el-table-column label="自荐结束时间" prop="endDate"></el-table-column>
      <el-table-column label="状态" prop="status">
        <template scope="scope">
          {{scope.row.status == 'ONGOING' ? '进行中' : '已结束'}}
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 16px">
      <el-col align="center">
        <el-button type="info" @click="selectCall">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['roleId', 'onlyOne'],
    data() {
      return {
        self: this,
        searchObj: {
          title: '',
          roleId: this.roleId,
          status: "",
          startBeginDate: "",
          startEndDate: "",
        },
        selectList: [],
        selectData: [],
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.getSelectList()
      },
      search() {
        this.getSelectList()
      },
      getSelectList() {
        let opt = {
          ajaxSuccess: res => {
            let data = [];
            if (res.data instanceof Array) {
              data = res.data
            }
            this.selectList = data
          },
          ajaxError: () => this.errorMess('获取数据失败'),
          ajaxParams: {
            url: api.selectList.path,
          }
        };
        this.ajax(opt)
      },
      handleSelectionChange(val) {
        this.selectData = val
      },
      selectCall() {
        if(this.onlyOne && !this.selectData.length){
          this.errorMess('必选选择数据');
          return
        }
        if (this.onlyOne && this.selectData.length !== 1) {
          this.errorMess('只能选择一条数据');
          return
        }
        this.$emit('select', this.selectData)
      },
      cancel() {
        this.$emit('cancel', 'scoreTable')
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
