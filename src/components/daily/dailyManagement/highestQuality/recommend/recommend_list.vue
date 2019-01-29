<!--自荐-->

<template>
  <div id="nosocomial" ref="nosocomial" class="modal">
    <el-row>
      <el-form :inline="true" ref="formValidate" class="demo-ruleForm">
        <el-col :span="10" align="left">
          <el-button type="primary" @click="pass">批量通过</el-button>
          <el-button type="danger" @click="reject">批量驳回</el-button>
        </el-col>
        <el-col :span="14" align="right">
          <el-form-item label="类型：" prop="examineStatus" >
            <el-select placeholder="请选择" v-model="formValidate.examineStatus" @change="searchEvent">
              <el-option label="全部" value=""></el-option>
              <el-option label="待审核" value="DSH"></el-option>
              <el-option label="不通过" value="BTG"></el-option>
              <el-option label="通过" value="TG"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="name">
            <el-input v-model="formValidate.userName" placeholder="输入姓名搜索">
              <el-button @click="searchEvent" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div
      id="nosocomialTable"
      ref="nosocomialTable"
    >
      <el-table
        align="center"
        :height="dynamicHt"
        :context="self"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column
                type="selection"
                width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          prop="index"
          width="70">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="140"
          show-overflow-tooltip
        >
          <template scope="scope">
            <el-button
              size="small"
              type="info"
              @click="show(scope.row)">查看
            </el-button>
            <el-button
              size="small"
              type="warning"
              @click="audit(scope.row)">审核
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="姓名"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="grade"
          label="年级"
          show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.grade || '——' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="group"
          label="班级"
          show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.group || '——' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="评优项目"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="examineStatus"
          label="审核状态"
          show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.examineStatus | typeText }}
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
          :total="totalCount">
        </el-pagination>
      </div>
      <div>
        <!--修改弹窗-->
        <Modal
          :mask-closable="false"
          v-model="auditModal"
          height="200"
          title="对话框标题"
          class-name="vertical-center-modal"
          :width="960">
          <!--<div slot="header"> -->
          <!--</div>-->
          <modal-header slot="header" :content="auditId"></modal-header>
          <audit v-if="auditModal" @cancel="cancel" @audit="subCallback" :operaility-data="operailityData"></audit>
          <div slot="footer"></div>
        </Modal>
        <!---->
        <!--批量审核-->
        <Modal
                width="500"
                v-model="passModal"
                title="查看档案管理弹窗"
                class-name="vertical-center-modal"
                :loading="loading">
          <modal-header slot="header" :content="passId"></modal-header>
          <operate v-if="passModal" :type="'pass'" :operate-url="url" :methods="'put'" :operateData="operateData"  @cancel="cancel" @operate="subCallback" :operaility-data="operailityData" ></operate>
          <div slot="footer"></div>
        </Modal>
        <!--查看弹窗-->
        <Modal
          :mask-closable="false"
          v-model="showModal"
          height="200"
          title="对话框标题"
          class-name="vertical-center-modal"
          :loading="true"
          :width="960"
        >
          <modal-header slot="header" :content="showId"></modal-header>
          <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData" ></show>
          <div slot="footer"></div>
        </Modal>
        <!---->
      </div>
    </div>
  </div>
</template>

<script>
  /*当前组审核件必要引入*/
  import api from './api';
  //引入----组件
  import audit from "./recommend_audit.vue";
  //引入--查看--组件
  import show from "./recommend_view.vue";


  //当前组件引入全局的util
  let Util = null;
  export default {

    data() {
      return {
          operateData:{
              data:{id:'',examineStatus:'',opinion:''}
          },
          url:'',
        isRoot: true,
        //表单数据
        formValidate: {
          examineStatus: 'DSH',//审核状态
          userName: '',     //姓名
          grade: '',   //年级
          group: '',   //班级
        },
          //批量审核
          passId:{id:'passId',title:'通过'},
          rejectId:{id:'rejectId',title:'驳回'},
          passModal:false,
          rejectModal:false,
        searchData: {title: '提交', callParEvent: 'searchEvent'},
        /*--按钮button--*/
        auditId: {
          id: 'auditId',
          title: '审核'
        },
        showId: {
          id: 'auditId',
          title: '查看'
        },
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        loading: false,
        totalCount: 0,
        listMessTitle: {
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: {
            url: api.list.path,
            params: {}
          }
        },

      }


    },
    methods: {

      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1, pageSize: Util.pageInitPrams.pageSize
        }

        this.setTableData();
      },

      //设置表格及分页的位置
      setTableDynHeight() {
        let nosocomial = this.$refs.nosocomial;
        let parHt = nosocomial.parentNode.offsetHeight;
        let nosocomialTable = this.$refs.nosocomialTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - nosocomialTable.offsetTop - paginationHt;
      },


      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val)
      },


      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected(isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess("请选择数据!");
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },
        /*--点击--批量通过--按钮--*/
        pass(){
            if(!this.isSelected()) return;
            var userIds=[];
            for(let i=0;i<this.multipleSelection.length;i++){
                if(this.multipleSelection[i].examineStatus== 'BTG' ||this.multipleSelection[i].examineStatus == 'TG'){
                    this.errorMess('已通过或者已驳回的数据不能进行审核');
                    return;
                }else{
                    userIds.push(this.multipleSelection[i].id)
                }
            }
            this.operailityData =this.multipleSelection;
            this.operateData={
                data:{
                    id:userIds.toString(),
                    examineStatus:'TG',
                    opinion:''
                }
            }
            this.url='/appraising/sellOneself/modifyExamineStatus/approval'
            this.openModel('pass') ;
        },
        /*--点击--审核--按钮--*/
        audit(data){
            this.operailityData = data;
            this.openModel("audit");

        },
        /*--点击--批量驳回-按钮--*/
        reject(){
            if(!this.isSelected()) return;
            var userIds=[];
            for(let i=0;i<this.multipleSelection.length;i++){
                if(this.multipleSelection[i].examineStatus== 'BTG' ||this.multipleSelection[i].examineStatus == 'TG'){
                    this.errorMess('已通过或者已驳回的数据不能进行审核');
                    return;
                }else{
                    userIds.push(this.multipleSelection[i].id)
                }
            }
            this.operailityData =this.multipleSelection;
            this.operateData={
                data:{
                    id:userIds.toString(),
                    examineStatus:'BTG',
                    opinion:''
                }
            }
            this.url='/appraising/sellOneself/modifyExamineStatus/approval'
            this.openModel('reject') ;
        },
      listDataSuccess(res) {
        this.totalCount = +res.totalCount;
        this.tableData = this.addIndex(res.data);
      },

      setTableData(isLoading) {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, this.formValidate);
        this.ajax(this.listMessTitle, isLoading)
      },


      //搜索监听回调
      searchEvent() {
        this.setTableData()
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name) {
        let flag = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag = true
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
        return flag;
      },


      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data) {
        this.operailityData = data;
        this.showModal = true;
      },


      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      audit(data) {
        this.operailityData = data;
        this.openModel('audit')
      },


      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer) {
        this[targer + 'Modal'] = false;
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
      subCallback(target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },


      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
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
    components: {
      //当前组件引入的子组件
      audit, show
    },
  }
</script>







