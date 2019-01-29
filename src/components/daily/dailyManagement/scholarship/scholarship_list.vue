<template>
  <div id="content"  ref="content"  class="modal">

        <el-form ref="formValidate"  :inline="true" :model="formValidate" class="demo-form-inline">
          <el-row >
          <el-col :span="4">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formValidate.name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          </el-col >

          <el-col :span="4">
            <el-form-item label="学校"  prop="school">
              <el-input v-model="formValidate.school" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col >

          <el-col :span="4">
            <el-form-item label="状态" prop="status">
              <el-select v-model="formValidate.status" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
           </el-form-item>
          </el-col>

          <el-col :span="4" :offset="2">
            <el-button type="primary"  @click="handleSubmit('formValidate')">&nbsp; 搜索 &nbsp;</el-button>
          </el-col >
          </el-row >
        </el-form>
    <div>
    <div
      id="myTable"
      ref="myTable"
    >
      <el-table
        align="center"
        :height="dynamicHt"
        :context="self"
        :data="tableData1"

        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">

        <el-table-column
          label="序号"
          prop="index"
          width="100">
          <template scope="scope">
            <span>{{scope.row.index}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="160" align="center">
          <template scope="scope">
            <el-button
              size="small"
              @click="show(scope.$index,scope.row)">查看</el-button>
            <el-button
              size="small"
              @click="audit(scope.$index, scope.row)">审核</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="姓名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="学校"
          width="120">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="申请时间"
          width="120">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="状态"
         >
        </el-table-column>

      </el-table>
    </div>
      <div style="margin: 10px;">
        <div style="float: right;">
          <el-pagination
            @size-change="changePageSize"
            @current-change="changePage"
            :current-page="myPages.currentPage"
            :page-sizes="myPages.pageSizes"
            :page-size="myPages.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listTotal">
          </el-pagination>
        </div>
        </div>
      </div>
    <Modal
      :mask-closable="false"
      v-model="showModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="1100">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="showId"></modal-header>
      <show @loading="showHidden" v-loading="loading" @show="handleShow" :show-data="showData"></show>
    </Modal>

    <Modal
      :mask-closable="false"
      v-model="auditModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="1100">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="auditId"></modal-header>
      <audit @loading="showHidden" v-loading="loading" @show="handleAudit" :show-data="auditData"></audit>
      <div slot="footer">


      </div>
    </Modal>

  </div>
  </div>

</div>
</template>
<script >
  import show from "./scholarship_view.vue";
  import audit from "./scholarship_audit.vue";
  let Util=null;

  export default{
      data() {
        return {
          //查询表单
          formValidate: {
            name: '',
            pickerOptions0: '',
            status: ''
          },
          options: [{
            value: '0',
            label: '待审核'
          }, {
            value: '1',
            label: '审核通过'
          }, {
            value: '2',
            label: '未审核'
          }],

          editData: '',
          showData:'',
          auditData:'',
          addmodal: false,
          editmodal: false,
          showModal: false,
          auditModal:false,
          loading: true,
          addId:{
            id:'add',
            title:'添加'},
          removeId:{
            id:'remove',
            title:'删除'
          },
          showId:{
            id:'show',
            title:'奖学金-查看'
          },
          auditId:{
            id:'auditId',
            title:'审核'
          },

          multipleSelection: [],
          dynamicHt: 100,
          self: this,
          tableData1: [],
          listTotal:0
        }

      },
      methods: {
        init(){
          Util = this.$util;
          //ajax请求参数设置
          this.listUrl = "/role/list";
          this.myPages =  Util.pageInitPrams;

          this.queryQptions = {
            url:this.listUrl,
            params:{curPage: 1,pageSize: Util.pageInitPrams.pageSize}
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
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        setTableData(){
          let that = this;
          //处理服务数据
          let myPromise = Util.queryData(this.queryQptions)();
          myPromise.then(function (res) {
              let responseData = res.data;

              if(_.isObject(responseData["status"])&&responseData["status"]["code"]==0){
                that.tableData1 = that.addIndex(responseData.data);
                that.listTotal = responseData.totalCount || 0;
              }
            }).catch(function(response){
                if (response instanceof Error) {
                  // 意外发生在设置要求引发一个错误
                  console.log('Error', response.message);
                } else {
                  // The request was made, but the server responded with a status code
                  // that falls out of the range of 2xx
                  console.log(response.headers);
                }
            })
        },

        changePageSize (n){
          this.queryQptions.params.pageSize = n;
          this.setTableData();
        },
        changePage (n) {
            console.log("changePage"+n)
          // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
          this.queryQptions.params.curPage = n;
          this.setTableData();
        },
        handleSubmit(name){
          alert(this.$cookie.get('setToken'));
          this.$store.commit("setToken")
          //查询
          this.$refs[name].validate((valid) => {
            if (valid) {
              this.$Message.success('提交成功!');
            } else {
              this.$Message.error('表单验证失败!');
            }
          })
        },
        show(index){
          this.showData =this.tableData1[index].id
          this.showModal = true;
        },
        handleShow(data){
          alert(1)
        },
        audit(index){
          this.auditData =this.tableData1[index].id
          this.auditModal = true;
        },
        handleAudit(){

        },

        addIndex(data){
          let arr = []
          for(let i=0,length=data.length;i<length;i++){
            data[i].index = (this.queryQptions.params.curPage-1)*this.queryQptions.params.pageSize+i+1
            arr.push(data[i])
          }
          return arr
        },
        showHidden(status){
          this.loading = !!status
        },
        show(index){

          this.showData =this.tableData1[index].id
          this.showModal = true;
        },
        handleShow(data){
          alert(1)
        },

      },
    created(){
      this.init();
    },

    mounted(){
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    components:{
      show,audit
    }

  }
</script>

