<!----------------------------------
****--@name     人员微调
****--@role     ${*}
****--@date     2018/7/2
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" inline label-width="100px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="6">
          <el-button @click="remove" type="danger">删除</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="18" align="right">
          <el-form-item>
            <input class="hidden">
            <el-input placeholder="请输入内容" v-model="formValidate.userName">
              <div slot="prepend">姓名</div>
              <el-button slot="append" @click="handleSubmit('formValidate')" icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>
        </el-col>
      </el-row>

      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore" align="right">
        <el-row>
          <el-form-item label="轮转状态:">
            <el-select v-model="formValidate.rtState" placeholder="请选择状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="轮转中" value="99"></el-option>
              <el-option label="已安排未开始轮转" value="9"></el-option>
              <el-option label="轮转暂停" value="-1"></el-option>
              <el-option label="已终止" value="-99"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="排序:">
             <el-select v-model="formValidate.sortby" placeholder="请选择状态">
               <el-option label="全部" value=""></el-option>
               <el-option label="创建时间" value="createTime"></el-option>
               <el-option label="状态" value="rtState"></el-option>
             </el-select>
           </el-form-item>-->
          <el-form-item label="所在年度:" prop="year">
            <el-date-picker
              v-model="formValidate.year"
              align="right"
              type="year"
              @change="selectYear"
              :editable="false"
              placeholder="选择年">
            </el-date-picker>
          </el-form-item>
          <!--<el-form-item label="考核状态:">
            <el-select v-model="searchObj.status" placeholder="请选择">
              <el-option v-for="item in examineStatuOption" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>-->
          <el-button type="info" @click="search">查询</el-button>
        </el-row>
      </div>
    </el-form>
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

          <el-table-column label="操作" width="250" align="center">
            <template scope="scope">
              <el-button
                v-if="scope.row.rotaryState!=-1 && scope.row.rotaryState!=-99"
                size="small"
                type="primary"
                @click="edit(scope.$index, scope.row)">微 调
              </el-button>
              <el-button v-if="scope.row.rotaryState==-1 " size="small" class="but-col"
                         @click="recover(scope.$index, scope.row)">恢复
              </el-button>
              <el-button v-if="scope.row.rotaryState!=-1 && scope.row.rotaryState!=-99" size="small" class="but-col"
                         @click="pause(scope.$index, scope.row)" type="warning">暂停
              </el-button>
              <el-button v-if="scope.row.rotaryState!=-1 && scope.row.rotaryState!=-99" size="small" class="but-col"
                         @click="stop( scope.row)" type="danger">终止
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="userName"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="major"
            label="专业"
            width="120">
          </el-table-column>
          <el-table-column
            prop="rotaryBeginTime"
            label="轮转开始时间"
          >
          </el-table-column>
          <el-table-column
            prop="rotaryEndTime"
            label="轮转结束时间"
            width="120">
          </el-table-column>
          <el-table-column
            prop="rotaryState"
            label="轮转状态"
            width="120"
          >
            <template scope="scope">
              {{scope.row.rotaryState | rotaryState}}
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
    <Modal
      :mask-closable="false"
      v-model="editModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="960">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="editId"></modal-header>
      <trimming v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></trimming>
      <div slot="footer"></div>
    </Modal>
    <!---->
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
      <remove v-if="removeModal" :deleteUrl="deleteUrl" @remove="subCallback" @cancel="cancel"
              :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--恢复弹窗-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="recoverModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="recoverId"></modal-header>
      <recover v-if="recoverModal" @cancel="cancel" @recover="subCallback" :operaility-data="operailityData"></recover>
      <div slot="footer"></div>
    </Modal>
    <!--暂停弹窗-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="pauseModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="pauseId"></modal-header>
      <pause v-if="pauseModal" @cancel="cancel" @pause="subCallback" :operaility-data="operailityData"></pause>
      <div slot="footer"></div>
    </Modal>
    <!--终止弹窗-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="stopModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="stopId"></modal-header>
      <stopRotate v-if="stopModal" @cancel="cancel" @stop="subCallback" :operaility-data="operailityData"></stopRotate>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  /*当前组件必要引入*/
  import { form } from '../../../rules';
  //引入--微调--组件
  import trimming from '../trimming.vue';
  import recover from '../recoverRotate.vue';
  import pause from '../pauseRotate.vue';
  import stopRotate from '../stopRotate.vue';//终止轮转

  import api from '../../api.js';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        form,
        //查询表单
        deleteUrl: api.deleteRotary.path,
        //form表单bind数据
        formValidate: {
          userName: '',
          rtState: '',
          year: '',
          sortby: '',
          order: ''
        },
        /*--按钮button--*/
        removeId: {
          id: 'remove',
          title: '删除'
        },
        editId: {
          id: 'edit',
          title: '微调'
        },
        recoverId: {
          id: 'forbidden',
          title: '恢复'
        },
        pauseId: {
          id: 'startUsing',
          title: '暂停'
        },
        stopId: {
          id: 'stopId',
          title: '终止'
        },

        //恢复
        recoverModal: false,
        stopModal: false,//终止

        //暂停
        pauseModal: false,

        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData1: [],
        loading: false,
        searchMore: false,
        listTotal: 0,
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.rtuserPagelist.path,
            params: {
              userName: '',
              rtState: '',
              year: '',
              sortby: '',
              order: ''
            }
          }
        },

      }

    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        }

        this.setTableData();
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 25;
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
          this.showMess('只能修改一条数据!')
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData (responseData) {
        let data = responseData.data;
        this.tableData1 = [];
        data = this.addIndex(data);
        this.tableData1 = data;
        this.listTotal = responseData.totalCount || 0;
      },
      setTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params, this.formValidate);
        this.ajax(this.listMessTitle);
      },
      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit (name) {
        this.setTableData();
      },

      /*--点击--删除--按钮--*/
      remove () {
        if (!this.isSelected()) return;
        let tempArr = [];
        for (var i = 0, item; i < this.multipleSelection.length; i++) {
          item = this.multipleSelection[i];
          tempArr.push(item['userId']);
        }
        let url = this.deleteUrl;
        if (url.indexOf('?') > -1) {
          url = url.split('?')[0];
        }
        url += '?' + 'userIds' + '=' + tempArr.join(',');
        this.deleteUrl = url;
        this.operailityData = [];
        this.openModel('remove');
      },

      //查询
      search () {
        this.setTableData()
      },
      // 选择年
      selectYear (val) {
        this.formValidate.year = val
      },
      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      edit (index) {
        if (typeof index == 'undefined') {
          if (!this.isSelected(true)) return;
          this.operailityData = {'userId': this.tableData1[index]['userId']};
          this.openModel('edit')
        } else {
          this.operailityData = {'userId': this.tableData1[index]['userId']};
          this.openModel('edit')
        }
      },
      /*
       * 点击--恢复--按钮
       * @param index string|number  当前行索引
       * */
      recover (index) {
        this.operailityData = this.tableData1[index];
        this.openModel('recover');
      },
      /*
       * 点击--暂停 --按钮
       * @param index string|number  当前行索引
       * */
      pause (index) {
        this.operailityData = this.tableData1[index];
        this.openModel('pause');
      },
      /*
       * 点击--终止 --按钮
       * @param index string|number  当前行索引
       * */
      stop (item) {
        this.operailityData = item;
        this.openModel('stop');
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
          this.formValidate = this.setObjValEmpty(this.formValidate);
          this.setTableData();
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      //tree
      treeClick (obj, node, self) {
        //出现切换按钮
        this.flag = true;
        this.clickId = obj.id
        this.targetKeys2 = [9]
        store = node.store;
        this.tableData1 = obj.children;

      },

      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore () {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
      },

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
      })
    },
    components: {
      //当前组件引入的子组件
      trimming, recover, pause, stopRotate
    }

  }
</script>
