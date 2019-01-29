<!----------------------------------
****--@name     进修计划查询
****--@role     进修生、带教老师、教学秘书、教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div ref="content">
    <el-form>
      <el-form-item label="科室">
        <el-select v-model="depId" placeholder="请选择" clearable @change="changeDep">
          <el-option v-for="(item,index) in depOption" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div ref="table">
      <el-table
        align="center"
        :data="tableData"
        :height="dynamicHt"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="depName"
          label="科室"
          class-name="valiTableStyle"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="disType"
          label="类别"
          class-name="valiTableStyle"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="disTitle"
          label="名称"
          align="center"
          class-name="valiTableStyle">
        </el-table-column>
        <el-table-column
          prop="disNum"
          label="要求例数"
          align="center"
          class-name="valiTableStyle">
        </el-table-column>
        <el-table-column
          prop="deMasterDegree"
          label="掌握程度"
          class-name="valiTableStyle"
          align="center">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from "../educationPlanWrite/api";

  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        dynamicHt: '100',
        // 科室
        depId: '',
        depOption: {},

        tableData:[],

        //表单数据bind
        formValidate: {
          "depOutlineId": "",
          "name": "",
          "specialty": "",
          "outlineRequires": []
        },

        //查询详情
        tableListMessTitle: {
          ajaxSuccess: 'setTableListData',
          ajaxParams: {
            url: api.get.path,
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        this.ajax(this.tableListMessTitle);
      },

      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content.parentNode.offsetHeight;
        let myTable = this.$refs.table.offsetTop;
        let paginationHt = 16;
        this.dynamicHt = content - myTable - paginationHt;
      },

      //通过get请求列表数据
      setTableListData(responseData) {
        this.formValidate = responseData.data;
        (responseData.data.outlineRequires || []).map(item => this.depOption[item.depId] = {id:item.depId,name:item.depName})
        this.tableData = responseData.data.outlineRequires || [];
      },

      // 科室筛选
      changeDep(id){
        let temp = [];
        if(!id){
          this.tableData = Util._.defaultsDeep([],this.formValidate.outlineRequires)
          return
        }
        this.formValidate.outlineRequires.map(item=>{
          if (item.depId === id){
            temp.push(item)
          }
        })
        this.tableData = temp
      },
    },
    created() {
      this.init();
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    components: {}
  }
</script>
