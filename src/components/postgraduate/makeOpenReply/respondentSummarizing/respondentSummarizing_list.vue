<!----------------------------------
****--@name     答辩汇总
****--@role     答辩秘书
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
<div id="content" ref="content">
  <el-form ref="formValidate" :model="formValidate"  inline label-width="100px">
    <el-row style="margin-bottom:0">
      <!--列表操作按钮-->
      <el-col :span="10" >
        <el-button type="primary" @click="add">添加</el-button>

      </el-col>
      <!--搜索项-->
      <el-col :span="14"  align="right">
        <el-form-item label="答辩地点" prop="defensePlace" >
          <el-input style="width:300px;"   v-model="formValidate.defensePlace" placeholder="输入答辩地点搜索">
            <el-button @click="searchEvent"  slot="append"  icon="search"></el-button>
          </el-input>
        </el-form-item>
        <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
      </el-col>
    </el-row>
    <!--高级搜索项-->
    <div v-show="searchMore"  ref="searchMore">
      <el-form-item label="答辩时间" prop="defenseTime" >
        <el-date-picker
          :editable="false"
          v-model="formValidate.defenseTime"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status" >
        <el-select v-model="formValidate.status" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="info" @click="searchEvent">查询</el-button>

    </div>
  </el-form>

  <!--列表数据-->
  <div>
    <!--表格数据-->
    <div
      id="myTable"
      ref="myTable"
    >
      <el-table
        align="center"
        :height="dynamicHt"
        :context="self"
        :data="tableData"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%;height: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          align="center"
          label="序号"
          prop="index"
          width="70">
          <template scope="scope">
            <span>{{scope.row.index}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200">
          <template scope="scope">
            <el-button size="small" @click="show(scope.row)">查看</el-button>
            <el-button :disabled="scope.row.status!='WSB' && scope.row.status!='BH'" size="small" @click="edit(scope.row)">修改</el-button>
            <el-button :disabled="scope.row.status!='WSB' && scope.row.status!='BH'" size="small" @click="reported(scope.row)">上报</el-button>
          </template>
        </el-table-column>
       <!-- <el-table-column
          show-overflow-tooltip
          prop="name"
          label="申请人"
          width="160">
        </el-table-column>-->
        <el-table-column
          show-overflow-tooltip
          align="center"
          prop="defenseTime"
          label="答辩时间"
          width="160">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          align="center"
          prop="defensePlace"
          label="答辩地点">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="specialtyName"
          align="center"
          label="专业方向">
        </el-table-column>
       <!-- <el-table-column
          show-overflow-tooltip
          prop="specialtyCode"
          label="专业代码"
          align="center"
          width="120">
        </el-table-column>-->
        <el-table-column
          show-overflow-tooltip
          prop="status"
          label="状态"
          width="120">
          <template scope="scope">
            {{scope.row.status | typeText}}
          </template>
        </el-table-column>

      </el-table>
    </div>
    <!--分页-->
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination
          @size-change="changePageSize"
          @current-change="changePage"
          :current-page="myPages.currentPage"
          :page-sizes="myPages.pageSizes"
          :page-size="myPages.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
  <!--新建-->
  <Modal
    :mask-closable="false"
    width="800"
    v-model="addModal"
    title="对话框标题"
    class-name="vertical-center-modal"
    :loading="loading">
    <modal-header slot="header" :content="addId"></modal-header>
    <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></add>
    <div slot="footer"></div>
  </Modal>
  <!--修改-->
  <Modal
    :mask-closable="false"
    width="800"
    v-model="editModal"
    title="对话框标题"
    class-name="vertical-center-modal"
    :loading="loading">
    <modal-header slot="header" :content="editId"></modal-header>
    <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
    <div slot="footer"></div>
  </Modal>
  <!--查看弹窗-->
  <Modal
    :mask-closable="false"
    width="800"
    v-model="showModal"
    title="查看档案管理弹窗"
    class-name="vertical-center-modal"
    :loading="loading">
    <modal-header slot="header" :content="viewId"></modal-header>
    <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData"></show>
    <div slot="footer"></div>
  </Modal>


  <!--上报弹窗-->
  <Modal
    close-on-click-modal="false"
    height="200"
    v-model="reportedModal"
    title="对话框标题"
    class-name="vertical-center-modal"
    :loading="loading"
    :width="500">
    <modal-header slot="header" :content="reportedId"></modal-header>
    <operate v-if="reportedModal" :type="'reported'"  :operateData="reportedData" @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
    <div slot="footer"></div>
  </Modal>

</div>
</template>
<script>
/*当前组件必要引入*/
import add from "./respondentSummarizing_add.vue";
import show from "./respondentSummarizing_view.vue";
import edit from "./respondentSummarizing_edit.vue";
import {respondentReply as rules} from "../rules.js";

import api from "../api.js";
//当前组件引入全局的util
let Util = null;
export default{
  data() {
    return {
      rules,
      formValidate: {
        defenseTime: '',       //答辩时间
        defensePlace: '',       //答辩地点
        status: '',    //   状态
      },
      reportedData:{
          url:api.defenseSummaryReport.path,
        data:{
          status:'DSH'
        }
      },
      reportedId:{id:'reportedId',title:'上报'},
      options:[{
        value: '',
        label: '全部'
      },{
        value: 'WSB',
        label: '未上报'
      }, {
        value: 'DSH',
        label: '待审核'
      }, {
        value: 'TG',
        label: '通过'
      }, {
        value: 'BH',
        label: '驳回不通过'
      }],

      /*--按钮button--*/
      addId:{id:'addId',title:'新建'},
      viewId:{id:'viewId',title:'查看'},
      editId:{id:'editId',title:'修改'},

      operailityData:'',
      multipleSelection: [],
      dynamicHt: 100,
      self: this,
      tableData: [
         /*{
         "id":"1",
         "name":"申请人",
         "defenseTime":"答辩时间",
         "defensePlace":"答辩地点",
         "specialtyCode":"专业代码",
         "specialtyName":"专业",
         "status":"TG"
         }*/
      ],
      searchMore: false,
      loading:false,
      reportedModal:false,
      editModal:false,
      totalCount:0,
      //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
      listMessTitle:{
        paramsData:'listUrl',
        ajaxSuccess:'updateListData',
        ajaxParams:{
          url:api.defenseSummaryList.path,
          params:{
            boundary:"",  //年界
            name:"",  //姓名
            specialtyName:'',  //专业
            degree:'',  //学位类型
            status:'',  //状态
          }
        }
      },
    }
  },
  methods: {
    //初始化请求列表数据
    init(){
      this.myPages =  Util.pageInitPrams;

      this.queryQptions = {
        curPage: 1,pageSize: Util.pageInitPrams.pageSize
      }

      this.setTableData();
    },


    //设置表格及分页的位置
    setTableDynHeight(){
      let content = this.$refs.content;
      let parHt = content.parentNode.offsetHeight;
      let myTable = this.$refs.myTable;
      let paginationHt = 50;
      this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
    },
    /*
     * checkbox 选择后触发事件
     * @param val Array 存在所有的选择每一个行数据
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /*
     * 列表数据只能选择一个
     * @param isOnly true  是否只选择一个
     */
    isSelected(isOnly){
      let len = this.multipleSelection.length;
      let flag = true;
      if(len==0){
        this.showMess("请选择数据!");
        flag = false;
      }
      if(len>1 && isOnly){
        this.showMess("只能删除一条数据!")
        flag = false;
      }
      return flag;
    },

    //通过get请求列表数据
    updateListData(responseData){
      this.tableData = this.addIndex(responseData.data || []);
      this.totalCount = responseData.totalCount || 0;
    },
    setTableData(){
      this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions,this.formValidate);
      this.ajax(this.listMessTitle);
    },



    //搜索监听回调
    searchEvent(isLoading){
      //        isLoading(true);
      let isSubmit = this.handleSubmit('formValidate');
      if(isSubmit){
        this.formValidate.defenseTime = this.conductDate(this.formValidate.defenseTime,'yyyy-MM-dd')
        this.setTableData();
      }
    },


    /*
     * 获取表单数据
     * @return string  格式:id=0&name=aa
     * */
    getFormData(data){
      let myData = Util._.defaultsDeep({},data);
      return myData;
    },


    /*
     * 列表查询方法
     * @param string 查询from的id
     * */
    handleSubmit(name){
      let flag =false
      this.$refs[name].validate((valid) => {
        if (valid) {
          flag =true;
        } else {
          this.$Message.error('表单验证失败!');
        }
      })
      return flag
    },


    /*--点击--添加--按钮--*/
    add(){
      this.openModel("add");
    },
    /*--点击--添加--按钮--*/
    edit(data){
      this.operailityData = data;
      this.openModel("edit");
    },


    /*
     * 点击--查看--按钮
     * @param index string|number  当前行索引
     * */
    show(data){
      this.operailityData = data;
      this.openModel("show");
    },


    /*
     * 监听子组件通讯的方法
     * 作用:根据不同的参数关闭对应的模态
     * @param targer string example:"add"、"edit"
     * */
    cancel(targer){
      this[targer+'Modal'] = false;
    },


    reported(data){
      this.operailityData = data;
      this.openModel("reported");

    },
    /*
     * 监听子组件通讯的方法
     * 作用:ajax请求成功回调,该监听方法在libs/util 中的混合模式下定义回调
     * @param targer string example:"add"、"edit"
     * @param targer string 提示返回的ajax回调返回的信息改信息在对应的子组件中定义
     * 例如:errorTitle、errorTitle
     *addMessTitle:{
     *    type:'add',
     *    successTitle:'添加成功!',
     *    errorTitle:'添加失败!',
     *    ajaxSuccess:'ajaxSuccess',
     *    ajaxError:'ajaxError',
     *    ajaxParams:{
     *      url:'/role/add',
     *      method:'post'
     *    }
     *    }
     * @param udata boolean 默认false  是否不需要刷新当前表格数据
     * */
    subCallback(target,title,updata){
      this.cancel(target);
      if(title){
        this.successMess(title);
      }
      if(!updata){
        this.setTableData();
      }
    },


    /*
     * 打开指定的模态窗体
     * @param options string 当前指定的模态:"add"、"edit"
     * */
    openModel(options){
      this[options+'Modal'] = true;
    },


    // 高级搜索按钮展开搜索表单并重新计算表格高度
    showSearchMore() {
      this.searchMore = !this.searchMore;
      this.$nextTick(function () {
        this.setTableDynHeight()
      })
    },

  },
  created(){
    Util = this.$util;
    this.init();
  },
  mounted(){
    //页面dom稳定后调用
    this.$nextTick(function () {
      //初始表格高度及分页位置
      this.setTableDynHeight();
      //为窗体绑定改变大小事件
      let Event = Util.events;
      Event.addHandler(window, "resize", this.setTableDynHeight);
    })
  },
  components: {
    add,show,edit
  }
}
</script>
