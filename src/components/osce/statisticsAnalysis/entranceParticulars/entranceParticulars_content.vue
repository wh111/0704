<!--
****--@file     entranceParticulars_content
****--@date     2018/6/14 16:09
****--@author   YC
****--@describe 考核内容详情
-->
<template>
  <div ref="eContent" class="modal">
    <!--<el-row>-->
    <!--<el-form :inline="true">-->
    <!--<el-col :span="4">-->
    <!--<el-form-item>-->
    <!--<el-button @click="derive" type="info">{{ 'export' | sysLan }}</el-button>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="20" align="right">-->
    <!--<el-form-item label="场次名称：">-->
    <!--<el-input v-model="formValidate.sceneName"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="考站名称：">-->
    <!--<el-input v-model="formValidate.stationName"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item>-->
    <!--<el-button @click="searchEvent" type="info">{{ 'search' | sysLan }}</el-button>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--</el-form>-->
    <!--</el-row>-->
    <!--表格数据-->
    <div id="myTable" ref="myTable">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark" highlight-current-row
                style="width: 100%;height: 100%" @selection-change="handleSelectionChange">
        <el-table-column align="center" label="序号" prop="index" width="100">
          <template scope="scope">
            <span>{{scope.row.index}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="sceneName" label="场次" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="contentName" label="考核内容" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="numberOfPeople" label="考核人数" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="maxMark" label="最高分">
        </el-table-column>
        <el-table-column prop="minMark" label="最低分">
        </el-table-column>
        <el-table-column prop="avgMark" label="平均分">
        </el-table-column>
      </el-table>
      <!--分页-->
      <div style="margin: 10px;">
        <div style="float: right;">
          <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                         :page-sizes="myPages.pageSizes"
                         :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--查看弹窗-->
    <Modal width="1100" v-model="showModal" title="查看档案管理弹窗" class-name="vertical-center-modal" :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <substation v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityShowData" :url="url"></substation>
      <div slot="footer"></div>
    </Modal>
    <!--导出弹窗-->
    <Modal :mask-closable="false" height="200" v-model="deriveModal" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>
      <div>
        <div class="remove">确定导出吗？</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="exportUrl">
              <el-button @click="cancel('derive')" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="cancel('derive')">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import substation from './substation/substationContent_list';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'entranceParticularsContent',
    props: ['operailityData', 'url'],
    data () {
      return {
        //查询表单
        formValidate: {
          sceneId: this.operailityData.sceneId || '', //场次id
          statisticsId: this.operailityData.statisticsId || '', //统计id
          sceneName: '', // 场次名称
          stationName: '' // 考站名称
        },

        operailityShowData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        loading: false,
        deriveModal: false,
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.url.eContentList,
            params: {}
          }
        },
        exportUrl: '',
        /*--按钮button--*/
        viewId: {
          id: 'viewId',
          title: '查看'
        },
        deriveId: {
          id: 'deriveId',
          title: '导出'
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize
        };

        this.setTableData();
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.eContent;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 80;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected (isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess('请选择数据!');
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess('只能修改一条数据!');
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData (responseData) {
        this.tableData = this.addIndex(responseData.data);
        this.totalCount = responseData.totalCount || 0;
      },
      setTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions,
          this.formValidate);
        this.ajax(this.listMessTitle);
      },

      //处理获取到的列表，房间和监考老师提取出来
      conductList (data) {

        for (let i = 0; i < data.length; i++) {
          let rooms = [];
          let teachers = [];
          for (let k = 0; k < data[i].roomList.length; k++) {
            rooms.push(data[i].roomList[k].roomNum);
          }
          for (let l = 0; l < data[i].teacherList.length; l++) {
            teachers.push(data[i].teacherList[l].teacherName);
          }
          data[i].roomNum = rooms.join(',');
          data[i].teacherName = teachers.join(',');
        }
        return data;
      },
      //搜索监听回调
      searchEvent () {
//        let isSubmit = this.handleSubmit('formValidate');
//        if (isSubmit) {
//          this.setTableData()
//        }
        this.setTableData();
      },

      //导出
      derive () {
        this.getDeriveURL();
        this.openModel('derive');
      },

      // 获取导出URL
      getDeriveURL () {
        let params = [];
        Object.keys(this.formValidate).map(key => params.push(key + '=' + this.formValidate[key]));
        this.exportUrl = '/api/scene/statistics/station/exportExcel?' + params.join('&');
      },

      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit (name) {
        let flag = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag = true;
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
        return flag;
      },

      /*--点击--添加--按钮--*/
      add () {
        this.openModel('add');
      },
      /*--点击--修改--按钮--*/
      edit (data) {
        this.operailityShowData = data;
        this.openModel('edit');
      },
      /*--点击--删除--按钮--*/
      remove () {
        if (!this.isSelected()) return;
        this.operailityShowData = this.multipleSelection;
        this.openModel('remove');
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show (data) {
        this.operailityShowData = data;
        this.openModel('show');
      },
      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel (targer) {
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
      subCallback (target, title, updata) {
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
      openModel (options) {
        this[options + 'Modal'] = true;
      }
    },
    created () {
      this.init();
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      });
    },
    components: {
      substation
    }
  };

</script>
