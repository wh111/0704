<!----------------------------------
****--@name     经典病例管理
****--@role     ${*}
****--@date     2017/11/13
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form   ref="formValidate" :model="formValidate" :rules="largeCaseWriteList" inline label-width="100px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10" >
          <el-button type="primary"  @click="pass">批量通过</el-button>
          <el-button type="danger"  @click="reject">批量驳回</el-button> &nbsp;
        </el-col>
        <!--搜索项-->
        <el-col :span="14"  align="right">
          <el-form-item  label="姓名:" prop="cname">
            <el-input   v-model="formValidate.cname" placeholder="输入姓名搜索">
              <el-button @click="searchEvent"  slot="append"  icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>

      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore" align="right">
        <el-form-item label="住院号:"  prop="czyNo">
          <el-input   v-model="formValidate.czyNo" placeholder="输入住院号搜索">
          </el-input>
        </el-form-item>
        <!--UE上未体现-->
        <!-- <el-form-item  label="科室:"   prop="title">
           <el-select v-model="formValidate.depId" placeholder="请选择科室">
             <select-option :unAll="true" :type="'dep'"> </select-option>
           </el-select>
           </el-input>
         </el-form-item>-->
        <el-form-item label="状态:"  prop="title">
          <el-select v-model="formValidate.cstate" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="待审核" value="NO_PASS"></el-option>
            <el-option label="通过" value="PASS"></el-option>
            <el-option label="驳回" value="REJECT"></el-option>
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
            width="100">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="200">
            <template scope="scope">
              <el-button size="small" @click="show(scope.row)">查看</el-button>
              <!--<el-button v-if="scope.row.cstate=='NO_SUBMIT'"  size="small" @click="audit(scope.row)">审核</el-button>-->
              <el-button  v-if="['NO_PASS'].includes(scope.row.cstate)"  size="small" @click="audit(scope.row)">审核</el-button>
              <!--<el-button v-if="scope.row.cstate != 'PASS' && scope.row.cstate != 'REJECT' && scope.row.ctype == 'DBL'" size="small" @click="postil(scope.row)">批注</el-button>-->
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="cname"
            label="病人姓名"
          >
          </el-table-column>
          <el-table-column
            prop="czyNo"
            label="住院号"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="cbedNo"
            label="床号"
          >
          </el-table-column>
          <el-table-column
            prop="createUserName"
            label="创建人">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间">
          </el-table-column>
          <!--<el-table-column-->
            <!--prop="isClassic"-->
            <!--v-if="type !='classicCase'"-->
            <!--label="病例类型">-->
            <!--<template scope="scope">-->
              <!--{{scope.row.isClassic==0?'非经典':'经典'}}-->
            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column
            prop="cstate"
            label="状态"
          >
            <template scope="scope">
              {{scope.row.cstate | typeText}}
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
      close-on-click-modal="false"
      width="1400"
      v-model="addModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData" :url="url"></add>
      <div slot="footer"></div>
    </Modal>
    <!--审核-->
    <Modal
      close-on-click-modal="false"
      width="1000"
      v-model="auditModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="auditId"></modal-header>
      <edit v-if="auditModal" @cancel="cancel" :url="url"  @audit="subCallback"  :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!--查看弹窗-->
    <Modal
      width="1000"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :url="url" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!--批注弹窗-->
    <Modal
      width="1200"
      v-model="postilModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="postilId"></modal-header>
      <postil v-if="postilModal" @cancel="cancel" @postil="subCallback" :operaility-data="operailityData" :url="url"></postil>
      <div slot="footer"></div>
    </Modal>

    <!--批量通过-->
    <Modal
      width="500"
      v-model="passModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="passId"></modal-header>
      <operate v-if="passModal" :type="'pass'" :operate-url="url.classicCasesReviews.path"   @cancel="cancel" @operate="subCallback" :operaility-data="operailityData" ></operate>
      <div slot="footer"></div>
    </Modal>

    <!--批量驳回-->
    <Modal
      width="500"
      v-model="rejectModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="rejectId"></modal-header>
      <operate v-if="rejectModal" :type="'reject'" :operate-url="url.classicCasesRejects.path"   @cancel="cancel" @operate="subCallback" :operaility-data="operailityData" ></operate>
      <div slot="footer"></div>
    </Modal>

  </div>
</template>
<script>
  import {largeCaseWriteList} from '../rules'
  /*当前组件必要引入*/
  import url from '../api'
  //引入--修改--组件
  import edit from "./manageClassicCase_audit.vue";
  //引入--查看--组件
  import show from "../../rotateRecordWrite/userClassicCase/userClassicCase_view.vue";
  //引入--查看--组件
  //当前组件引入全局的util
  let Util=null;
  export default{
    props:['type'],
    data() {
      return {
        largeCaseWriteList,
        url:url,
        //查询表单
        listUrl:'/role/list?name=&identify=&type=',
        deleteUrl:'/role/remove',
        formValidate: {
          cname:'',       //姓名
          czyNo: '',      //住院号
          depId:'',       //科室ID(下拉选择)
          cstate:'NO_PASS',      //状态
          sortby: '',     //排序列
          order: ''  ,     //升序、降序
          classicCase:'',  //是否为经典病例 classicCase经典noclassic
        },

        passData:{
          data:{diseaseIds:''}
        },

        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [
//          {
//            "cid":12,
//            "cname":"111",
//            "depName":"科室",
//            "createUserName":"创建人",
//            "czyNo":"123123",
//            "cbedNo":"111",
//            "createTime":"2017-05-08",
//            "cstate":"NO_SUBMIT",
//            "ctype":"类型"
//          }
        ],
        loading:false,
        auditModal:false,
        passModal:false,
        reportedModal:false,
        rejectModal:false,
        postilModal:false,
        totalCount:0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:url.classicCaseRecordList.path,
            params:{},
          }
        },
        searchMore: false,
        /*--按钮button--*/
        addId:{id:'addId',title:'新建'},
        editId:{id:'editId',title:'修改'},
        auditId:{id:'auditId',title:'审核'},
        viewId:{id:'viewId',title:'查看'},
        passId:{id:'passId',title:'通过'},
        reportedId:{id:'reportedId',title:'上报'},
        rejectId:{id:'rejectId',title:'驳回'},
        postilId:{id:'postilId',title:'大病历批注'},
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;
        this.queryQptions = {
          curPage: 1,pageSize: Util.pageInitPrams.pageSize
        };
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
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData(responseData){
        if(!responseData.data)return;
        this.tableData = this.addIndex(responseData.data);
        this.totalCount = responseData.totalCount;
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
          this.setTableData()
        }
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name){
        let flag =false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag =true;
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
        return flag
      },


      /*--点击--批量通过--按钮--*/
      pass(){
        if(!this.isSelected()) return;
        let operailityData =[];
        for(let i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].cstate == 'PASS' || this.multipleSelection[i].cstate == 'REJECT'){
            this.errorMess('已通过或驳回的数据不能进行通过');
            return;
          }
          operailityData.push({id:this.multipleSelection[i].cid});
        }

        this.operailityData = operailityData
        this.openModel('pass') ;
      },

      /*--点击--批量驳回--按钮--*/
      reject(){
        if(!this.isSelected()) return;
        let operailityData =[];
        for(let i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].cstate == 'PASS'  || this.multipleSelection[i].cstate == 'REJECT'){
            this.errorMess('已通过或驳回的数据不能进行驳回');
            return;
          }
          operailityData.push({id:this.multipleSelection[i].cid});
        }
        this.operailityData = operailityData
        this.openModel('reject') ;
      },



      /*--点击--添加--按钮--*/
      add(){
        this.openModel("add");
      },

      /*--点击--修改--按钮--*/
      audit(data){
        this.operailityData = data;
        this.openModel("audit");
      },
      /*--点击--修改--按钮--*/
      postil(data){
        this.operailityData = data;
        this.openModel("postil");
      },

      /*--点击--修改--按钮--*/
      reported(data){
        this.operailityData = {id:data.cid};
        this.openModel("reported");
      },


      /*--点击--删除--按钮--*/
      remove(){
        if(!this.isSelected(true)) return;
        this.operailityData =[{id:this.multipleSelection[0].cid}];
        this.openModel('remove') ;
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
      edit,show
    }
  }
</script>
