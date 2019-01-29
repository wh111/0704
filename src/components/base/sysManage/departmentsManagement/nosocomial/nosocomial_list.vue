<!--菜单管理-->
<!--业务字典-->
<template>
  <layout-tree>
    <left-tree slot="left" @tree-click="treeClick" :upDateNumber="upDateNumber" @setCurrSltNodeId="setTreeDepId"
               :treeOptions="treeDefaults" :fromWhereTreeType="fromWhereTree"></left-tree>
    <div slot="right" id="content" ref="content" class="modal">
      <!--右侧查询-->

      <div class="add-remove">
        <el-button v-show="flag" class="but-col" @click="trigger(true)" :type="flag1?'primary':''">下级科室列表
        </el-button>
        <el-button v-show="flag" class="but-col" @click="trigger(false)" :type="flag1?'':'primary'">科室信息
        </el-button>
        <!--<el-button @click="uploadExcel" type="primary">导入-->
        <!--</el-button>-->
        <!--<el-button @click="derive" type="primary">导出-->
        <!--</el-button>-->
      </div>

      <div class="add-remove">
        <fieldset class="layui-elem-field layui-field-title" style="margin-top: 30px;">
          <legend>{{flag1 ? '下级科室列表' : '科室信息'}}</legend>
        </fieldset>
        <el-row>
          <el-col :span="5" :offset="1">
            <el-button v-show="flag1" class="but-col" @click="add" type="primary">添加</el-button>
          </el-col>
          <el-col :span="10" :offset="2">
            <div v-show="flag1" class="listUpArea-searchWrapper">
              <!--右侧查询-->
              <el-form v-for="item in 1" :key="item" ref="formValidate" :rules="rules"
                       :model="formValidate" class="form-inline lose-margin" label-width="60px">
                <div class="listUpArea-searchLeft">
                  <input class="hidden">
                  <el-form-item prop="name">
                    <el-input placeholder="请输入内容" v-model="formValidate.name">
                      <div slot="prepend">科室名称</div>
                      <el-button @click="searchEvent" :btnData="searchData" slot="append"
                                 icon="search"></el-button>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="listUpArea-moreSearch">
                  <el-button @click="showMoreSearch" type="text">高级查询</el-button>
                </div>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="isShowMoreSearch" class="listUpArea-moreSearchBox">
        <el-form v-for="item in 1" :key="item" :inline="true" :model="formValidate" :rules="rules"
                 ref="formValidate" style="margin-top:10px;" label-width="74px">
          <el-row>
            <el-form-item label="编号:" prop="code">
              <el-input v-model="formValidate.code"></el-input>
            </el-form-item>
            <el-form-item label="科室主任:" prop="director">
              <el-input v-model="formValidate.director"></el-input>
            </el-form-item>
            <el-form-item label="教学秘书:" prop="secretary">
              <el-input v-model="formValidate.secretary"></el-input>
            </el-form-item>
            <el-form-item label="护士长:" prop="nurse">
              <el-input v-model="formValidate.nurse"></el-input>
            </el-form-item>
            <el-form-item label="承载量:" prop="capacity">
              <el-input v-model="formValidate.capacity"></el-input>
            </el-form-item>
            <!--<el-form-item label="考核状态:">
              <el-select v-model="searchObj.status" placeholder="请选择">
                <el-option v-for="item in examineStatuOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>-->
            <el-button type="info" @click="searchEvent">查询</el-button>
          </el-row>
        </el-form>
      </div>
      <div v-show="!flag1">
        <el-row class="lose-margin2">
          <el-col :span="5" :offset="1">
            <span class="text-w"><strong>科室编号：</strong></span><span>{{depDetails.code}}</span>
          </el-col>
          <el-col :span="5" :offset="2"><strong>科室名称：</strong><span>{{depDetails.name}}</span></el-col>
        </el-row>
        <el-row class="lose-margin2">
          <el-col :span="5" :offset="1">
            <strong>上级科室：</strong><span>{{depDetails.parentName}}</span>
          </el-col>
          <el-col :span="5" :offset="2"><strong> 最大承载量：</strong><span>
          {{depDetails.zyyCapacity + depDetails.ssyCapacity + depDetails.yjsCapacity + depDetails.jxsCapacity}}
        </span></el-col>
        </el-row>
        <el-row class="lose-margin2">
          <el-col :span="5" :offset="1">
            <span><strong>科室主任：</strong></span><span>{{depDetails.director}}</span>
          </el-col>
          <el-col :span="5" :offset="2"><strong>教学秘书：</strong><span>{{depDetails.secretary}}</span></el-col>
        </el-row>
        <el-row class="lose-margin2">
          <el-col :span="5" :offset="1">
            <span><strong>护士长：</strong></span><span>{{depDetails.nurse}}</span>
          </el-col>
        </el-row>
      </div>
      <div
        id="nosocomialTable"
        ref="nosocomialTable"
      >
        <el-table
          v-show="flag1"
          align="center"
          :height="dynamicHt"
          :context="self"
          :data="tableData1"

          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="序号"
            prop="index"
            width="70">
            <!--<template scope="scope">-->
            <!--<span>{{scope.row.index}}</span>-->
            <!--</template>-->
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="200"
          >
            <template scope="scope">
              <el-button
                size="small"
                type="info"
                @click="show(scope.$index,scope.row)">查看
              </el-button>
              <el-button
                size="small"
                type="warning"
                @click="edit(scope.$index, scope.row)">修改
              </el-button>
              <el-button size="small" v-if="scope.row.enable==0" class="but-col"
                         @click="forbidden(scope.$index, scope.row)" type="danger">禁用
              </el-button>
              <el-button size="small" v-if="scope.row.enable==1" class="but-col"
                         @click="startUsing(scope.$index, scope.row)">启用
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="科室名称"
            align="center"
            width="200">
          </el-table-column>
          <el-table-column
            prop="code"
            label="科室编号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="director"
            label="科室主任"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="secretary"
            label="教学秘书"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="capacity"
            label="最大承载量"
            show-overflow-tooltip>
            <template scope="scope">
              {{scope.row.zyyCapacity + scope.row.ssyCapacity + scope.row.yjsCapacity + scope.row.jxsCapacity}}
            </template>
          </el-table-column>
          <el-table-column
            prop="enable"
            label="状态"
            show-overflow-tooltip>
            <template scope="scope">
              {{scope.row.enable == 0 ? "启用" : "禁用"}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin: 10px;">
        <div style="float: right;">

          <el-pagination
            v-show="flag1"
            @size-change="changePageSize"
            @current-change="changePage"
            :current-page="myPages.currentPage"
            :page-sizes="myPages.pageSizes"
            :page-size="myPages.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listTotal">
          </el-pagination>
        </div>
        <!--修改弹窗-->
        <Modal
          :mask-closable="false"
          v-model="editModal"
          height="200"
          title="对话框标题"
          class-name="vertical-center-modal"
          :width="1100">
          <!--<div slot="header"> -->
          <!--</div>-->
          <modal-header slot="header" :content="editId"></modal-header>
          <edit v-if="editModal" @cancel="cancel" @edit="subCallback"
                :operaility-data="operailityData"></edit>
          <div slot="footer"></div>
        </Modal>
        <!---->
        <!--增加弹窗-->
        <Modal
          :mask-closable="false"
          v-model="addModal"
          height="200"
          title="对话框标题"
          class-name="vertical-center-modal"
          :width="960">
          <!--<div slot="header"> -->
          <!--</div>-->
          <modal-header slot="header" :content="addId"></modal-header>
          <add v-if="addModal" @getHeight="getHeight" @cancel="cancel" @add="subCallback"
               :operaility-data="operailityData"></add>
          <div slot="footer"></div>
        </Modal>
        <!---->
        <!--查看弹窗-->
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
          <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
          <div slot="footer"></div>
        </Modal>
        <!---->

        <!--删除弹窗-->
        <Modal
          close-on-click-modal="false"
          height="200"
          v-model="removeModal"
          title="对话框标题"
          class-name="vertical-center-modal"
          :loading="loading"
          :width="500">
          <modal-header slot="header" :content="removeId"></modal-header>
          <remove v-if="removeModal" :deleteUrl="deleteUrl" @remove="subCallback" @cancel="cancel"
                  :operaility-data="operailityData"></remove>
          <div slot="footer"></div>
        </Modal>

        <!-- &lt;!&ndash;导入弹窗&ndash;&gt;
         <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="toChannelModal"
                class-name="vertical-center-modal" :width="800">
           <modal-header slot="header" :content="toChannelId"></modal-header>
           <toChannel v-if="toChannelModal"  @toChannel="subCallback" @cancel="toChannelModal=false"
                      :operaility-data="operailityData"></toChannel>
           <div slot="footer"></div>
         </Modal>
         &lt;!&ndash;&ndash;&gt;
         &lt;!&ndash;导出弹窗&ndash;&gt;
         <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal"
                class-name="vertical-center-modal" :width="400">
           <modal-header slot="header" :content="deriveId"></modal-header>
           <derive v-if="deriveModal" type="excel" @cancel="cancel('derive')" :url="api.exportExcel.path"></derive>
           <div slot="footer"></div>
         </Modal>-->
        <!---->
        <!--导出弹窗-->
        <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal"
               class-name="vertical-center-modal" :width="400">
          <modal-header slot="header" :content="deriveId"></modal-header>
          <derive v-if="deriveModal" type="excel" @cancel="cancel('derive')" :url="api.exportExcel.path"></derive>
          <div slot="footer"></div>
        </Modal>
        <!---->
      </div>
    </div>
  </layout-tree>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../api'
  import {nosocomialList as rules} from '../../rules'
  //引入--修改--组件
  import edit from './nosocomial_edit.vue'
  //引入--查看--组件
  import show from './nosocomial_view.vue'
  //引入--添加--组件
  import add from './nosocomial_add.vue'
  //当前组件引入全局的util
  let Util = null
  let store = null
  export default {
    props: ['isInit'],
    data() {
      return {
        api,
        rules,
        //是否显示科室信息标签
        flag: false,
        flag1: true,
        upDateNumber: 1,
        //tree默认项设置
        treeDefaults: {
          getTreeUrl: '/hospital/dept/tree',
          getDataUrl: '',
          isShowSearch: false,
          isShowMenus: false,
        },
        fromWhereTree: 'user',

        //禁用
        isUsing: true,
        forbiddenUrl: '/account/disEnable',
        usingUrl: '/account/enable',

        //查询表单
        deleteUrl: '',
        formValidate: {
          name: '',
          code: '',
          director: '',
          secretary: '',
          nurse: '',
          capacity: ''
        },

        //当前科室详情
        depDetails: {
          'name': '',
          'code': '',
          'directorId': '',
          'secretaryId': '',
          'nurseId': '',
          'director': '',
          'secretary': '',
          'nurse': '',
          'capacity': '',
          'parentId': '',
          'parentName': ''
        },

        searchData: {title: '提交', callParEvent: 'searchEvent'},
        addData: '',
        editData: '',
        showData: '',
        auditData: '',
        /*--按钮button--*/
        addId: {
          id: 'add',
          title: '添加'
        },
        removeId: {
          id: 'remove',
          title: '删除'
        },
        editId: {
          id: 'edit',
          title: '修改'
        },
        showId: {
          id: 'auditId',
          title: '查看'
        },
        toChannelId: {
          id: 'toChannelId',
          title: '导入'
        },
        deriveId: {
          id: 'deriveId',
          title: '导出'
        },
        forbiddenId: {id: 'forbiddenId', forbiddenId: '禁用'},
        startUsingId: {id: 'forbiddenId', startUsingId: '启用'},
        //tree
        currDeptId: '',

        path: '/',   //深度路径
        depth: 0,  //深度级别

        shortNoteModal: false,
        toChannelModal: false,
        deriveModal: false,
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData1: [],
        loading: false,
        listTotal: 0,

        //初始化加载页面信息
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: '/hospital/dept/list',
            params: {}
          }
        },
        middle: {},
        middleItem: {},
      }
    },
    methods: {

      //初始化请求列表数据
      init() {
        Util = this.$util
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams
        this.queryQptions = {
          //url:this.listUrl,
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        }

        //this.setTableData();
      },

      search() {
        this.setTableData()
      },

      //搜索监听回调
      searchEvent(isLoading) {
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate')
        if (isSubmit) {
          this.setTableData()
        }
      },

      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name) {
        let flag = true
        for (let i = 0; i < this.$refs[name].length; i++) {
          this.$refs[name][i].validate((valid) => {
            if (!valid) {
              flag = false
            }
          })
        }
        return flag
      },
      //设置表格及分页的位置
      setTableDynHeight(n) {
        let content = this.$refs.content
        let parHt = content.parentNode.offsetHeight
        let nosocomialTable = this.$refs.nosocomialTable
        if (isNaN(n)) {
          n = 42  //默认加载
        } else {
          n = -128 //点击目录树设置
        }
        let paginationHt = n
        this.dynamicHt = parHt - nosocomialTable.offsetTop - paginationHt
      },

      //切换科室信息
      //切换下级科室信息
      trigger(flag) {
        this.flag1 = flag
        this.setTableDynHeight(2)
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },

//      //下级科室列表查询
//      searchEvent(){
//        this.setTableData()
//      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected(isOnly) {
        let len = this.multipleSelection.length
        let flag = true
        if (len == 0) {
          this.showMess('请选择数据!')
          flag = false
        }
        if (len > 1 && isOnly) {
          this.showMess('只能修改一条数据!')
          flag = false
        }
        return flag
      },

      //通过get请求列表数据并渲染表格数据
      updateListData(responseData) {
        let data = responseData.data
        let that = this
        this.tableData1 = []
        data = that.addIndex(data)
        that.tableData1 = data

        this.listTotal = responseData.totalCount || 0
      },

      //初始化加载列表数据
      setTableData() {
        this.listMessTitle.ajaxParams.params['parentId'] = this.currDeptId
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params, this.formValidate)
        this.postParamToServer(this.listMessTitle)
      },

      //当前科室详情
      currDepDetails() {
        //初始化加载页面信息
        let resetTitle = {
          ajaxSuccess: (res) => {
            this.depDetails = res.data
          },
          ajaxParams: {
            url: '/hospital/dept/get/' + this.currDeptId,
          }
        }
        this.ajax(resetTitle)
      },

      //向服务器发送数据
      postParamToServer(options) {
        if (this.currDeptId != '') {
          options['ajaxParams']['params']['parentId'] = this.currDeptId
        }
        this.ajax(options)
      },

//      /*
//       * 列表查询方法
//       * @param string 查询from的id
//       * */
//      handleSubmit(name){
//        this.$refs[name].validate((valid) => {
//          if (valid) {
//            this.$Message.success('提交成功!');
//          } else {
//            this.$Message.error('表单验证失败!');
//          }
//        })
//      },

      /*--点击--添加--按钮--*/
      add() {
        if (this.currDeptId == '') {
          this.errorMess('请选择左侧目录节点!')
          return
        }
        if (JSON.stringify(this.middleItem) != '{}') {
          this.operailityData = this.middleItem
        } else {
          this.operailityData = this.middle
        }
        this.openModel('add')
      },
      getHeight(res) {
        this.$message({
          message: '添加科室成功',
          type: 'success'
        })
        this.middleItem = res
        this.upDateNumber++
        this.setTableData()
        this['addModal'] = false

      },
      /*--点击--删除--按钮--*/
      remove(index) {
        if (typeof index != 'number') {
          if (!this.isSelected(true)) return
          this.operailityData = this.multipleSelection[0]
          this.openModel('remove')
        } else {
          this.operailityData = this.tableData1[index]
          this.openModel('remove')
        }
      },

      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(index) {
        this.operailityData = this.tableData1[index].id
        this.showModal = true
      },

      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      edit(index) {
        if (typeof index != 'number') {
          if (!this.isSelected(true)) return
          this.operailityData = this.multipleSelection[0]
          this.openModel('edit')
        } else {
          this.operailityData = this.tableData1[index]
          this.openModel('edit')
        }
      },

      //禁用
      forbidden(index) {
        this.$Modal.confirm({
          title: '禁用',
          content: '<p>您确定要禁用该科室吗?</p>',
          loading: true,
          onOk: () => {
            let rowData = this.tableData1[index]
            let id = rowData.id
            //初始化加载页面信息
            let resetTitle = {
              ajaxSuccess: (res) => {
                this.$Modal.remove()
                this.successMess('禁用成功!')
                rowData.enable = 1
              },
              errorTitle: '禁用失败!',
              ajaxParams: {
                url: '/hospital/dept/disenable/' + id,
                method: 'put'
              }
            }
            this.ajax(resetTitle)
          }
        })
      },

      //启用
      startUsing(index) {
        this.$Modal.confirm({
          title: '启用',
          content: '<p>您确定要启用该科室吗?</p>',
          loading: true,
          onOk: () => {
            let rowData = this.tableData1[index]
            let id = rowData.id
            //初始化加载页面信息
            let resetTitle = {
              ajaxSuccess: (res) => {
                this.$Modal.remove()
                this.successMess('启用成功!')
                rowData.enable = 0
              },
              errorTitle: '启用失败!',
              ajaxParams: {
                url: '/hospital/dept/enable/' + id,
                method: 'put'
              }
            }
            this.ajax(resetTitle)
          }
        })
      },

      //导入
      uploadExcel() {
        this.openModel('toChannel')
      },
      //导入
      derive() {
        this.openModel('derive')
      },

      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer) {
        this[targer + 'Modal'] = false
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
        this.cancel(target)
        if (title) {
          this.successMess(title)
        }
        console.log(updata)
        if (!updata) {

          this.setTableData()
          //刷新左侧目录树根据不同的情况
          this.$children[0].$children[0].updataTree()
        }
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true
      },

      /*
       * 左侧目录树节点click调用父组件方法
       *
       * @param obj {} 当前选中节点的一级数据
       *
       * @param node  {}  整个tree节点所有数据
       *
       * @param  self  {}  当前tree vue实例
       *
       * */
      treeClick(obj, node, self) {
        /*if(node.isLeaf){  //当前是否为叶子节点
         alert("====")
         }else {

         }*/
        this.path = obj.path   //深度路径
        this.depth = obj.depth  //深度级别
        this.trigger(true)
        this.flag = true
        this.setTreeDepId(obj.id, obj)
        this.showTreeList()
        this.currDepDetails()
        //页面dom稳定后调用
        this.$nextTick(function () {
          //初始表格高度及分页位置
          this.setTableDynHeight()
          //为窗体绑定改变大小事件
          let Event = Util.events
          Event.addHandler(window, 'resize', this.setTableDynHeight)
        })

      },

      /*
       * 根据部门id查询当前部门的人员信息
       * */
      showTreeList() {
        //初始化加载页面信息
        let listMessTitle = Util._.defaultsDeep({}, this.listMessTitle)
        this.postParamToServer(listMessTitle)
      },

      /*
       * 是否选择部门
       * @return flag blooean  是否选择目录树节点
       * */
      isSltedTree(isSltedTreeNode) {
        let flag = false
        if (this.currDeptId != '' || isSltedTreeNode(this.treeClickInit)) {
          flag = true
        }
        return flag
      },

      /*
       *  初始化或者刷新数列表的时候  调用treeClick函数 为deptId赋值
       * */
      treeClickInit(obj) {
        this.treeClick(obj)
      },

      /*
       * 设置当前部门Id
       * @param id string || number  当前左侧选中的科室id   ***必填***
       * @param node {}  当前左侧选中科室的map对象数据   ***选填***
       * */
      setTreeDepId(id, node) {

        if (typeof node != 'undefined') {
          this.depDetails.name = node.name
        }
        if (this.currDeptId == '') {
          this.currDeptId = id
          this.setTableData()
        } else {
          this.currDeptId = id
        }
        if (this.currDeptId != '-1') {
          this.middleItem = {}
        }
        let depth = parseInt(this.depth) + 1  //深度级别
        let str = ''
        if (this.path.length != 1) {
          str = '/'
        }
        let path = this.path + str + this.currDeptId //深度路径
        this.middle = {
          parentName: this.depDetails.name,
          parentId: this.currDeptId,
          path: path,
          depth: depth
        }
      }
    },

    watch: {
      isInit: function (val, oldVal) {
        if (val == '0') {
          this.flag = false
          this.flag1 = true
        }
      }
    },

    //初始化组件
    created() {
      this.init()
    },

    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight()
        //为窗体绑定改变大小事件
        let Event = Util.events
        Event.addHandler(window, 'resize', this.setTableDynHeight)
      })
    },

    components: {
      //当前组件引入的子组件
      edit, add, show,
    }

  }
</script>
<style>

  .add-remove {
    margin-bottom: 20px;
  }

  .header {
    height: 30px;
    font-size: 18px;
    color: #ffffff;

  }


</style>
