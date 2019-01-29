<!----------------------------------
****--公共课考试
****--@date     2017/7/3
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form  ref="formValidate" :model="formValidate" :rules="rules" inline label-width="130px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10" >
          <el-button type="primary" @click="derive">导出考核信息到Excel</el-button>
          <el-button type="primary" @click="toChannel">从Excel导入成绩</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="14"  align="right">
          <el-form-item label="姓名:" prop="name" >
            <el-input style="width:300px;"   v-model="formValidate.name" placeholder="输入姓名搜索">
              <el-button @click="searchEvent"  slot="append"  icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>
      <br>
      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore">

        <el-form-item label="专业:" prop="major" >
          <el-input  v-model="formValidate.major" placeholder="输入姓名搜索"></el-input>
        </el-form-item>

        <el-form-item label="成绩范围（最小）:" prop="minScore" >
          <el-input   v-model="formValidate.minScore" placeholder="输入成绩"></el-input>
        </el-form-item>

        <el-form-item label="成绩范围（最大）:" prop="maxScore" >
          <el-input  v-model="formValidate.maxScore" placeholder="输入成绩"></el-input>
        </el-form-item>

        <!--<el-form-item label="生源类型:" prop="userType" >-->
        <!--<el-select filterable  v-model="formValidate.userType" placeholder="请选择">-->
        <!--<el-option label="全部" value=""></el-option>-->
        <!--<el-option label="实习生" value="SXS"></el-option>-->
        <!--<el-option label="研究生" value="YJS"></el-option>-->
        <!--<el-option label="住院医" value="ZYY"></el-option>-->
        <!--<el-option label="进修生" value="JXS"></el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-button type="info" @click="searchEvent">查询</el-button>

      </div>
    </el-form>

    <!--列表数据-->
    <div>
      <!--表格数据-->
      <div
        id="myTable"
        ref="myTable">
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
            align="center"
            label="序号"
            prop="index"
            width="80">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="codeNumber"
            label="编号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userName"
            label="姓名"
            width="150">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="gender"
            label="性别"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="phone"
            label="电话号码">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="major"
            label="专业">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="email"
            label="邮箱">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="commonsScore"
            label="成绩"
            width="100">
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
    <!--导入弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="toChannelModal" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="toChannelId"></modal-header>
      <toChannel v-if="toChannelModal" :url="url"  @toChannel="subCallback" @cancel="cancel" :operaility-data="operailityData"></toChannel>
      <div slot="footer"></div>
    </Modal>
    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="derivePath">
              <el-button @click="affirmDerive" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click=" deriveModal=false">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import {completionOfTheInspectionList as rules} from '../rules';
  import config from '../../../../config/config.js'
  /*当前组件必要引入*/
  import url from '../api'
  //引入--导入--组件
  import toChannel from "./commonTest_toChannel.vue";

  //当前组件引入全局的util
  let Util=null;
  export default{
    data() {
      return {
        rules,
        url,
        //查询表单
        listUrl:'/role/list?name=&identify=&type=',
        deleteUrl:'/role/remove',
        formValidate: {
          name: '',       //姓名
          userType: '',   //生源类型
          year: '',   //年级
          major: '',   //专业
          minScore: '',   //成绩范围（最小）
          maxScore: '',   //成绩范围（最大）
          sortby: '',   //排序列ieID
          order: ''     //升序、降序 ASC ,DESC
        },

        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        searchMore: false,
        toChannelModal: false,
        deriveModal: false,
        loading:false,
        totalCount:0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:url.commonsCourseList.path,
            params:{}
          }
        },
        /*--按钮button--*/
        toChannelId:{id:'toChannelId',title:'导入'},
        deriveId:{id:'deriveId',title:'导出'},
        removeId:{id:'removeId',title:'删除'},
        viewId:{id:'viewId',title:'查看'},

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
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData(responseData){
        if(!responseData.data)return;
        this.tableData = this.addIndex(responseData.data);
        if(!responseData.totalCount) return;
        this.totalCount = responseData.totalCount;
      },
      setTableData(){
        let {minScore,maxScore} = this.formValidate;
        if(minScore && maxScore && minScore>=maxScore){
          this.errorMess('最大分数必须大于最小分数');
          return
        }
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


      /*--点击--导入--按钮--*/
      toChannel() {
        this.openModel('toChannel')
      },
      //导出
      derive() {
        this.openModel('derive')
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

      //确定导出
      affirmDerive() {
        this.cancel('derive')
      },
    },
    created(){
      this.init();
    },
    computed:{
      derivePath(){
        let util = this.$util
//        url.examineExport.path
        let path = util.serializeParams(this.formValidate)
        return config.urlPrefix+url.commonsCourseExport.path+'?'+path
      },
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
      toChannel
    }
  }
</script>
