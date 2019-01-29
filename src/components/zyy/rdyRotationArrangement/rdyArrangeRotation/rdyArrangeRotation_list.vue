<template>
  <div id="content"  ref="content"  class="modal">

    <div class="listUpAreaBox">
      <div class="listUpArea-menus">
        <!--表格数据操作按钮-->
        <div class="ivu-row">
          <div class="ivu-col ivu-col-span-24">
            <el-button  class="but-col"  @click="rotation"  type="primary">安排轮转</el-button>
          </div>
        </div>
      </div>
      <div class="listUpArea-search">
        <div class="listUpArea-searchWrapper">
          <!--右侧查询-->
          <el-form ref="formValidate"  :inline="true" :model="formValidate" class="form-inline lose-margin" label-width="60px" >
            <div class="listUpArea-searchLeft">
              <input class="hidden">
              <el-input placeholder="请输入内容" v-model="formValidate.userName">
                <div slot="prepend">姓名</div>
                <el-button slot="append" @click="handleSubmit('formValidate')" icon="search"></el-button>
              </el-input>
            </div>
            <div class="listUpArea-moreSearch">
              <el-button @click="showMoreSearch" type="text">高级查询</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div v-if="isShowMoreSearch" class="listUpArea-moreSearchBox">

    </div>
    <br />
    <!--表格数据操作按钮-->
    <div>
      <div
        id="myTable"
        ref="myTable"
      >
        <el-table
          stripe
          align="center"
          :height="dynamicHt"
          :context="self"
          :data="tableData1"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%"
          @selection-change="handleSelectionChange">

          <el-table-column
            label="序号"
            type="index"
            width="75">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column label="操作"  width="100" align="center">
            <template scope="scope">
              <!--<el-button
                v-if="scope.row.rotaryState!=-1"
                size="small"
                @click="edit(scope.$index, scope.row)">微 调</el-button>-->
              <el-button
                size="small"
                :disabled="scope.row.arrangeDepState=='N'"
                @click="show(scope.$index,scope.row)">查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="userName"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="depName"
            label="科室名称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="ts"
            label="时间"
            width="120">
          </el-table-column>
          <el-table-column
            prop="rtBeginTime"
            label="轮转开始时间"
          >
          </el-table-column>
          <el-table-column
            prop="rtEndTime"
            label="轮转结束时间"
            width="120">
          </el-table-column>
          <el-table-column
            prop="arrangeDepState"
            label="轮转状态"
            width="120"
          >
            <template scope="scope">
              <span v-if="scope.row.arrangeDepState=='N'">未安排</span>
              <span v-if="scope.row.arrangeDepState=='P'">已安排</span>
              <span v-if="scope.row.arrangeDepState=='Y'">已安排</span>
            </template>
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
    <!--微调-->
    <!--<Modal
      :mask-closable="false"
      v-model="editModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="960">
      &lt;!&ndash;<div slot="header"> &ndash;&gt;
      &lt;!&ndash;</div>&ndash;&gt;
      <modal-header slot="header" :content="editId"></modal-header>
      <trimming v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></trimming>
      <div slot="footer"></div>
    </Modal>-->
    <!---->
    <!--安排轮转-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="rotationModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="rotationId"></modal-header>
      <rotation v-if="rotationModal" @rotation="subCallback" @cancel="cancel" :operaility-data="operailityData"></rotation>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--查看-->
    <Modal
      :mask-closable="false"
      v-model="showModal"
      height="200"
      title="对话框标题"

      class-name="vertical-center-modal"
      :loading="true"
      :width="800"
    >
      <modal-header slot="header" :parent="self" :content="showId"></modal-header>
      <show v-if="showModal"  @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script >
  /*当前组件必要引入*/
  //引入--微调--组件
  import rotation from "./rdyArrangeRotation_rotationSet.vue";
  import show from "./rdyArrangeRotation_view.vue";

  import api from "../api.js";
  //当前组件引入全局的util
  let Util=null;
  export default{
    props:{
      userType:{
        type: String,
        default: "ZYY",
      }
    },
    data() {
      return {
        //查询表单
        //form表单bind数据
        formValidate: {
          userName:"",
          sortby:"",
          podClass: this.userType,
          order:"",
          rtBeginTimeStart:"",
          rtBeginTimeEnd:"",
          rtEndTimeStart:"",
          rtEndTimeEnd:"",
          arrangeDepState:"",
        },
        /*--按钮button--*/
        rotationId:{
          id:'rotation',
          title:'安排轮转'
        },
        /*editId:{
          id:'edit',
          title:'微调'
        },*/
        showId:{
          id:'showId',
          title:'查看'
        },


        //安排轮转
        rotationModal:false,


        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData1: [],
        loading:false,
        listTotal:0,
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.getDepRotaryUser.path,
            params:{
              userName:"",
              sortby:"",
              order:"",
              podClass: this.userType,
              order:"",
              rtBeginTimeStart:"",
              rtBeginTimeEnd:"",
              rtEndTimeStart:"",
              rtEndTimeEnd:"",
              arrangeDepState:"",
            }
          }
        },

      }



    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;

        this.queryQptions = {
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
        }else{
          var sltTs =  this.multipleSelection[0].ts;
          for(var i=0,item;i<this.multipleSelection.length;i++){
              item = this.multipleSelection[i];
              if(item.ts!=sltTs){
                this.showMess("请选择相同时间范围的人员一起安排!");
                flag = false;
                break;
              }
          }
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        this.tableData1=[];
        data = this.addIndex(data);
        this.tableData1=data;
        this.listTotal = responseData.totalCount || 0;
      },
      setTableData(){
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions.params,this.formValidate);
        this.ajax(this.listMessTitle);
      },
      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name){
        this.setTableData();
      },

      /*--点击--安排轮转--按钮--*/
      rotation(){
        if(!this.isSelected()) return;
        let tempArr = [];
        let depName = this.multipleSelection[0].depName;
        let ts = this.multipleSelection[0].ts;
        for(var i=0,item;i<this.multipleSelection.length;i++){
          item = this.multipleSelection[i];
          tempArr.push(item["podId"]);
        }
        this.operailityData = {
          depName:depName,
          ts:ts,
          podIds:tempArr.join(",")
        };
        this.openModel('rotation') ;
      },

      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(index){
        this.operailityData = this.tableData1[index];
        this.showModal = true;
      },


      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer){
        this[targer+'Modal'] = false;
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
          //this.formValidate = this.setObjValEmpty(this.formValidate);
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
    },
    created(){
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
    components:{
      //当前组件引入的子组件
      rotation,show,
    }

  }
</script>
