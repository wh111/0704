<!----------------------------------
****--培训标准(rdyTrainingStandards_list)
****--@date     2017/7/21
****--@author   zyc<332533011@qq.com
----------------------------------->
<!---楼房信息管理--->
<!--档案审核-->
<template>
  <div id="content" ref="content" class="modal">
    <el-form :model="formValidate" ref="formValidate" inline label-width="120px" class="demo-ruleForm">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10" >
          <el-button type="primary" @click="add">添加</el-button>
          <!--<el-button type="danger" @click="remove">删除</el-button>-->
          <el-button type="primary" @click="toChannel">导入</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="14"  align="right">
          <el-form-item label="培训标准名称:" prop="rtName" >
            <el-input style="width:300px;"   v-model="formValidate.rtName" placeholder="输入培训标准名称搜索">
              <el-button @click="searchEvent"  slot="append"  icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>
      <br>
      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore">
        <!--<el-form-item label="基地名称:" prop="jdName" >-->
            <!--<el-input style="width:300px;"   v-model="formValidate.jdName" placeholder="输入专业"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="专业:" prop="rtProclass" >
            <el-input style="width:300px;"   v-model="formValidate.rtProclass" placeholder="输入专业"></el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="state" >
          <el-select filterable  v-model="formValidate.state" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="ENABLE"></el-option>
            <el-option label="禁用" value="DISABLE"></el-option>
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
            width="260">
            <template scope="scope">
              <el-button size="small" @click="show(scope.row)">查看</el-button>
              <el-button size="small" @click="edit(scope.row)" :disabled="scope.row.isUse==1">修改</el-button>
              <el-button  type="success" size="small" v-if="scope.row.rtState=='DISABLE'" @click="enable(scope.row)">启用</el-button>
              <el-button type="danger" size="small" :disabled="scope.row.isUse==1" v-if="scope.row.rtState=='ENABLE'"
                         @click="disEnable(scope.row)">禁用
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="jdName"
            label="基地名称"
            show-overflow-tooltip
            width="200">
          </el-table-column>
          <el-table-column
            prop="rtName"
            label="培训标准名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="rtProclass"
            show-overflow-tooltip
            label="培训方向"
            align="center"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="isUser"
            label="已使用"
            width="100"
            show-overflow-tooltip>
            <template scope="scope">
              {{scope.row.isUse | typeText}}
            </template>
          </el-table-column>
          <el-table-column
            prop="rtState"
            label="状态"
            width="100"
            show-overflow-tooltip>
            <template scope="scope">
              {{scope.row.rtState  | typeText}}
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
      width="1300"
      v-model="addModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal" @resize="resize" @cancel="cancel" @add="subCallback" :rtModelType="rtModelType" :operaility-data="operailityData" :url="url"></add>
      <div slot="footer"></div>
    </Modal>
    <!--修改-->
    <Modal
      :mask-closable="false"
      width="1300"
      v-model="editModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :rtModelType="rtModelType" :operaility-data="operailityData" :url="url"></edit>
      <div slot="footer"></div>
    </Modal>
    <!--删除弹窗-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="removeModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove  v-if="removeModal" :delete-url="url.removeRules.path" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>

      <div slot="footer"></div>
    </Modal>
    <!--启用弹窗-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="enableModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="enableId"></modal-header>
      <operate  v-if="enableModal" :type="'enable'"  @operate="subCallback" @cancel="cancel" :operateData="enableData" :operaility-data="operailityData"></operate>

      <div slot="footer"></div>
    </Modal>
    <!--禁用弹窗-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="disEnableModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="disEnableId"></modal-header>
      <operate  v-if="disEnableModal" :type="'disEnable'"  @operate="subCallback" @cancel="cancel" :operateData="disEnableData" :operaility-data="operailityData"></operate>

      <div slot="footer"></div>
    </Modal>
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      width="1300"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :rtModelType="rtModelType" @show="subCallback"
            :operaility-data="operailityData" :url="url"></show>
      <div slot="footer"></div>
    </Modal>
    <!--导入-->
    <Modal
      :mask-closable="false"
      width="800"
      v-model="toChannelModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="toChannelId"></modal-header>
      <toChannel v-if="toChannelModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData" :url="url"></toChannel>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import url from '../api'
  //引入--新建--组件
  import add from "./rdyTrainingStandards_add.vue";
  //引入--修改--组件
  import edit from "./rdyTrainingStandards_edit.vue";
  //引入--查看--组件
  import show from "./rdyTrainingStandards_view.vue";
  //引入--导入--组件
  import toChannel from "./rdyTrainingStandards_toChannel.vue";

  //当前组件引入全局的util
  let Util=null;
  export default{
    props:{
      rtModelType:{   //各个生源类型判断ZYY(住院医)、YJS(研究生)、JXS(进修生)
        type: String,
        default:'ZYY',
      }
    },
    data() {
      return {
        url:url,
        //搜索项
        searchMore:false,
        disEnableModal:false,
        enableModal:false,
        toChannelModal:false,
        //查询表单
        listUrl:'/role/list?name=&identify=&type=',
        deleteUrl:'/role/remove',
        formValidate: {
          rtName: '',            //细则名称
          rtProclass: '',        //专业
          state: '',             //状态
//          rtModelType: 'ZYY',       //模块   //住院医 ZYY 研究生 YJS  进修生 JXS
          rtModelType: this.rtModelType,       //模块   //住院医 ZYY 研究生 YJS  进修生 JXS
          sortby: '',//排序列
          order: ''     //升序、降序
        },
        enableData:{
            url:url.modifyRulesState.path,
            data:{
              state:'ENABLE'
            }
        }, //启用

        disEnableData:{
          url:url.modifyRulesState.path,
          data:{
            state:'DISABLE'
          }
        },  //禁用
        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        loading:false,
        totalCount:0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:url.rulesgetPageList.path,
            params:{}
          }
        },
        /*--按钮button--*/
        addId:{id:'addId',title:'新建'},
        editId:{id:'editId',title:'修改'},
        removeId:{id:'removeId',title:'删除'},
        viewId:{id:'viewId',title:'查看'},
        disEnableId:{id:'disEnableId',title:'禁用'},
        enableId:{id:'enableId',title:'启用'},
        toChannelId:{id:'toChannelId',title:'导入培训细则'},
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
          this.showMess("只能操作一条数据!");
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData(responseData){
        if(!responseData.data)return;
        this.tableData = this.addIndex(responseData.data);
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
          this.setTableData()
        }
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

      toChannel(){
        this.openModel("toChannel");
      },
      /*--点击--修改--按钮--*/
      edit(data){
        this.operailityData = data;
        this.openModel("edit");
      },
      /*--点击--删除--按钮--*/
      remove(){
        if(!this.isSelected(true)) return;
        this.operailityData = [{id:this.multipleSelection[0].rtId}] ;
        this.openModel('remove');
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data){
        this.operailityData = data;
        this.openModel("show");
      },


      //启用
      enable(data){

        this.operailityData ={id:data.rtId} ;
        this.openModel('enable');
      },


      //禁用
      disEnable(data){
        this.operailityData ={id:data.rtId} ;
        this.openModel('disEnable');
      },
      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer){
        this[targer+'Modal'] = false;
      },

      resize(){
        this.setTableData()

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
      add,edit,show,toChannel
    }
  }
</script>
