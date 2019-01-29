<template>
  <!-- 场次参考人员列表 -->
  <div>
    <!-- 操作按钮 -->
    <div>
      <el-button size="small" type="success" @click="addUser" :disabled="!canEdit">添加参考人员</el-button>
      <el-button size="small" type="danger" @click="removeUser" :disabled="!canEdit">删除参考人员</el-button>
    </div>
    <!-- 表格 -->
    <!--表格数据-->
    <div id="myTable" ref="myTable" style="margin-top:10px;">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark" highlight-current-row
                style="width: 100%;height: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row.userId)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userNum" label="学号">
        </el-table-column>
        <el-table-column prop="userName" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="userSex" label="性别" width="100">
          <template scope="scope">
            {{ scope.row.userSex | typeText }}
          </template>
        </el-table-column>
        <el-table-column prop="deptName" label="所在部门">
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                       :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal">
        </el-pagination>
      </div>
    </div>
    <!-- 添加参考人员 -->
    <Modal :mask-closable="false" width="890" v-model="selectUserModal" title="添加人员" class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.selectUserId"></modal-header>
      <!-- 此处人员还未对应 -->
      <select-user v-if="selectUserModal" @cancel="closeSltUser" @setUsers="setUsers" :unSelect="unSelect"></select-user>
      <div slot="footer"></div>
    </Modal>
    <!--删除弹窗-->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" title="对话框标题" class-name="vertical-center-modal" :loading="loading"
           :width="500">
      <modal-header slot="header" :content="contentHeader.removeUserId"></modal-header>
      <remove v-if="removeModal" :delete-url="api.userDelete" @remove="delUserCall" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!--查看人员-->
    <Modal width="1000" v-model="showModal" class-name="vertical-center-modal" :loading="loading">
      <modal-header slot="header" :content="contentHeader.viewUserId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :dataId="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util = null;

  import api from '../api'; // API

  import selectUser from '../../../common/selectUser'; // 选择人员
  import show from '../../../teach/archivesManagement/archivesManagement/archivesManagement_view/archivesManagement_view_basic'; // 查看

  export default {
    props: {
      contenHeight: {
        type: Number,
        default: 100
      },
      id: {
        type: Number,
        required: true
      }
    },
    data () {
      return {
        api,
        status: 'NOARRANGED', // 增删人员初始化状态为未生成轮转表
        canEdit: true,
        dynamicHt: 100,
        self: this,
        listTotal: 0,
        loading: false,
        tableData: [],
        //给选择人员框传递的已选人员信息
        unSelect: [],
        removeUserIds: [], // 删除人员id
        operailityData: '',
        multipleSelection: [],
        /*-- 模态框提示 --*/
        contentHeader: {
          selectUserId: {
            id: 'selectUserId',
            title: '添加参考人员'
          },
          removeUserId: {
            id: 'removeUserId',
            title: '删除参考人员'
          },
          viewUserId: {
            id: 'viewUserId',
            title: '查看参考人员'
          }
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
          //url:this.listUrl,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        this.listMessTitle = {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.api.userList.path + '/' + this.id,
            method: this.api.userList.method,
            data: {}
          }
        };

        this.setTableData();
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = this.contenHeight - myTable.offsetTop - paginationHt;
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
        let data = (responseData.data || []).splice(0, 150);
        let that = this;
        this.tableData = [];
        data = that.addIndex(data);
        this.tableData = data;
        that.listTotal = responseData.totalCount || 0;
      },
      setTableData () {
        this.listMessTitle.ajaxParams = Object.assign(this.listMessTitle.ajaxParams, this.queryQptions);
        this.ajax(this.listMessTitle);
      },
      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit (name) {
        let formData = Util._.defaultsDeep({}, this.formValidate);
        // console.log(formData)
      },
      // 回调
      subCallback (target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.updateStatus();
          this.setTableData();
        }
      },
      // 更新本地状态
      updateStatus () {
        this.$store.commit('examineInterval/station/setInfo', {
          status: this.status
        });
      },
      /**************************** 模态窗 ****************************/
      // 删除已选择的参考人员
      removeUser () {
        let removeUserIds = [];
        if (this.multipleSelection.length >= this.listTotal) {
          this.errorMess('参考人员不能全部删除！');
          return;
        }
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.operailityData.map(item => removeUserIds.push(item.id));
        this.removeUserIds = removeUserIds;
        this.openModel('remove');
      },
      // 删除人员回调
      delUserCall (target, title, updata) {
        this.removeUserIds.map(id => { // 从禁选人员中移除该人员
          this.$store.commit('examineInterval/room/removeUnSelectUserById', {
            type: 'user', id
          });
        });
        this.subCallback(target, title, updata);
      },
      //添加人员
      addUser () {
        // let allUser = {
        //   paramsData: 'add',
        //   ajaxSuccess: res => {
        //     this.unSelect = res.data || [];
        //     this.openModel('selectUser');
        //   },
        //   ajaxParams: {
        //     url: this.api.allUserId.path + this.id,
        //     method: this.api.allUserId.method,
        //     data: {
        //       id: this.id, // 场次id
        //     }
        //   }
        // };
        // this.ajax(allUser);
        this.getUnSelectUser();
        this.openModel('selectUser');
      },
      /*
       * 获取选择人员的人员信息并赋值
       * @param users [{id:'',name:''},{}]  已选人员信息
       * */
      setUsers (users) {
        let userList = [];
        let addUserIds = [];
        users.map(item => {
          userList.push({
            userId: item.key,
            userName: item.label,
            specialty: item.specialty
          });
          addUserIds.push(item.key);
        });
        let addMessTitle = {
          paramsData: 'add',
          ajaxSuccess: () => {
            this.successMess('添加人员成功');
            this.updateStatus();
            this.closeSltUser();
            this.setTableData();
            this.$store.commit('examineInterval/room/addUnSelectUser', { // 把选择的人员加入到禁选人员中
              type: 'user',
              id: addUserIds
            });
          },
          ajaxParams: {
            url: this.api.userAdd.path,
            method: this.api.userAdd.method,
            jsonString: true,
            data: {
              id: this.id, // 场次id
              // userIds: userId.join(',') || '', // 参考人员id
              userList
            }
          }
        };
        this.ajax(addMessTitle);
      },
      //关闭选择人员弹窗
      closeSltUser () {
        this.cancel('selectUser');
      },
      // 获取禁选人员
      getUnSelectUser () {
        let temp = this.$store.state.examineInterval.room.unSelectUser;
        let unSelArr = [];
        Util._.map(temp, (arr, key) => {
          unSelArr = unSelArr.concat(arr);
        });
        this.unSelect = unSelArr;
      },
      /************************** 模态框逻辑 *************************************/
      // 查看
      show (id) {
        this.operailityData = id;
        this.openModel('show');
        // console.log(id)
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
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      }
    },
    components: {
      selectUser,
      show
    },
    created () {
      this.init();
      this.canEdit = this.$store.getters['examineInterval/station/edit'];
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
    watch: {
      contenHeight (val) {
        this.setTableDynHeight();
      }
    }
  };

</script>
