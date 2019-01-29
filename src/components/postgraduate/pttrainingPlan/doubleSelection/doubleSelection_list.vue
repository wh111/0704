<!----------------------------------
****--@name     双选
****--@role     ${*}
****--@date     2017/9/18
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content">
    <el-row style="height: 38px">
      <el-col>
        <span style="line-height: 38px;">已选择导师：</span>
        <template v-if="selectUserMentor.length">
          <el-tag v-for="(tag,index) in selectUserMentor" :key="index" :closable="!tag.closable" :type="tag.teacherName"
                  style="margin: 5px" @close="handleClose(index)">
            {{tag.teacherName}}
          </el-tag>
          <el-button type="primary" @click="confirm" :disabled="style.confirm">确定</el-button>
        </template>
        <span style="line-height: 38px;color: red;" v-else>请选择导师（每个学生只能选择一个导师，选择之后不可更改）</span>
      </el-col>
    </el-row>
    <br>
    <!--- 开放导师列表 --->
    <div>
      <!--表格数据-->
      <div
        id="myTable"
        ref="myTable"
      >
        <el-table
          ref="multipleTable"
          align="center"
          :height="dynamicHt"
          :context="self"
          :data="tableData"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%;height: 100%"
          @select="handleSelectionChange"
          @select-all="handleSelectionAll"
        >
          <el-table-column
            type="selection"
            width="55"
            :selectable="selectable"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="序号"
            width="75"
            prop="index">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="80">
            <template scope="scope">
              <!--<el-button v-if="isTeacher" size="small" @click="choice(scope.row)">选择</el-button>-->
              <!--<el-button v-else size="small"  :disabled="true">选择</el-button>-->
              <el-button size="small" @click="show(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="teacherName"
            label="导师姓名">
          </el-table-column>
          <el-table-column
            prop="sex"
            label="性别"
            width="75"
            show-overflow-tooltip>
            <template scope="scope">{{scope.row.sex | typeText }}</template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="major"
            label="专业方向"
            align="center"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="duties"
            label="职称"
          ></el-table-column>
          <!--<el-table-column-->
          <!--show-overflow-tooltip-->
          <!--prop="studentNames"-->
          <!--label="院系"-->
          <!--&gt;-->
          <!--</el-table-column>-->

          <!--<el-table-column-->
          <!--prop="status"-->
          <!--label="导师类型"-->
          <!--show-overflow-tooltip-->
          <!--&gt;-->
          <!--</el-table-column>-->
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
            :total="listTotal">
          </el-pagination>
        </div>
      </div>
      <!-- 模态框 查看（view） -->
      <Modal :width="1200" v-model="showModal" title="查看档案管理弹窗" class-name="vertical-center-modal" :loading="loading">
        <modal-header slot="header" :content="showId"></modal-header>
        <user-info v-if="showModal" @cancel="cancel" @show="subCallback" :dataId="dataId"
                   :operaility-data="{id:operailityData.teacherId}"></user-info>
        <div slot="footer"></div>
      </Modal>
    </div>

  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api      from './api';
  //引入查看组件
  import userInfo from './archivesManagement_view';
  // import userInfo from "../../../teach/archivesManagement/archivesManagement/archivesManagement_view.vue"
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        isEdit: false,  // 是否允许修改
        teacherName: '',
        id: '',
        isTeacher: false,
        isChoice: true,
        showModal: false,
        tableData: [],
        dynamicHt: 100,
        self: this,
        listTotal: 0,
        modal: {
          type: ''
        },
        style: {
          confirm: false
        },
        dataId: '',
        isCheckBox: false,//是否可以勾选
        loading: false,
        operailityData: {},
        selectUserMentor: [],//当前选中导师的数据
        getSelectUserMentor: [],//当前选中导师的数据
        showId: {
          id: 'showId',
          title: '导师信息'
        },
        multipleSelection: [],
        listMessTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.list.path,
            params: {}
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
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        };

        this.getSelected();
      },
      getSelected () {
        this.ajax({
          ajaxParams: {

            url: api.selected.path,
            method: api.selected.method
          },
          ajaxSuccess: res => {
            this.setTableData();
            if (typeof res.data == 'string') {
              this.errorMess('返回的已选择导师数据错误');
              return;
            }
            if (res.data.length != 0) {
              //如果返回的有重复的，去重
              let obj = {};
              let id = [];
              let getSelectUserMentor = [];
              let selectUserMentor = [];
              for (let i = 0; i < res.data.length; i++) {
                if (obj[res.data[i].teacherId]) {
                  this.errorMess(`已选择导师有重复`);
                  continue;
                } else {
                  obj[res.data[i].teacherId] = 1;
                }
                res.data[i].closable = !this.isEdit;
                res.data[i].teacherName = res.data[i].name;
                id.push(res.data[i].teacherId + '');
                getSelectUserMentor.push(res.data[i]);
                selectUserMentor.push(res.data[i]);
              }
//              if (res.data.length >= 3) {
//                this.style.confirm = true;
//              }
              this.selectUserMentor = selectUserMentor;
              this.getSelectUserMentor = getSelectUserMentor;
              this.id = id;
              this.style.confirm = true;
            }
          }
        });
      },
      setTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,
          this.queryQptions.params);
        this.ajax(this.listMessTitle);
      },
      successGetList (res) {
        let data = res.data;
        data = this.addIndex(data);

        //补全获取到的已选老师
        if (this.selectUserMentor != 0) {
          for (let i = 0; i < this.selectUserMentor.length; i++) {
            let item = this.selectUserMentor[i];
            for (let k = 0; k < data.length; k++) {
              let row = data[k];
              if (item.teacherId + '' == row.teacherId + '') {
                row.closable = !this.isEdit;
                this.selectUserMentor[i] = row;
              }
            }
          }
        }

        this.tableData = data;
        //页面dom稳定后调用
        this.$nextTick(function () {
          this.toggleSelection(this.selectUserMentor);
        });
        this.listTotal = res.totalCount;
      },

      /**
       * close tag
       * @param {Number} index  标签的索引
       * */
      handleClose (index) {
        this.selectUserMentor.splice(index, 1);
        this.$refs.multipleTable.clearSelection();
        this.toggleSelection(this.selectUserMentor);
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },
      selectHostCallback (data) {
        //this.rowData.planActivityHost = data
        let ids = [];
        let names = [];
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          ids.push(item.key);
          this.mentorArr.push(item.lable);
        }

        //this.formInline.teacherIds = names.join(',');
        this.formInline.teacherIds = ids.join(',');
        this.hostModal = false;
        this.selectUserMentor = data;
      },

      /**
       * 切换选中状态
       * @param {Array} rows 表单行元素
       * @return {null}
       * */
      toggleSelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        }
        this.confirmShow();
      },

      /**
       * button show or hidden
       * */
      confirmShow () {
        let selectUserMentor = this.selectUserMentor;
        if (!this.isEdit) {
          if (selectUserMentor.length === this.getSelectUserMentor.length) {
            this.style.confirm = true;
          } else if (selectUserMentor.length > 1) {
            this.style.confirm = true;
          } else {
            this.style.confirm = false;
          }
        } else {
          if (selectUserMentor.length > 1) {
            this.style.confirm = true;
          } else {
            this.style.confirm = false;
          }
        }
      },

      /**
       * table是否可以被选择
       * @param {Object} row 是一个表格对象
       * @return {boolean}
       * */
      selectable (row) {
        if (this.isEdit) return true;
        let getSelectUserMentor = this.getSelectUserMentor;
        if (getSelectUserMentor.length >= 1) {
          return false;
        } else if (getSelectUserMentor.length < 1 && getSelectUserMentor.length > 0) {
          return !getSelectUserMentor.some((item) => {
            return item.teacherId + '' == row.teacherId + '';
          });
        } else {
          return true;
        }
      },

      /**
       * checkbox 选择后单个时触发事件
       * @param {Array} val Array 存在所有的选择每一个行数据
       * @param {Object} row  一个行数据
       * @return {null}
       */
      handleSelectionChange (val, row) {
        let selectUserMentor = this.selectUserMentor;
        //当前点击的row，是否选中状态
        let isSelect = false;
        for (let k = 0; k < val.length; k++) {
          let item = val[k];
          if (item.teacherId + '' == row.teacherId + '') {
            isSelect = true;
          }
        }

        if (isSelect) {
          selectUserMentor.push(row);
        } else {
          for (let i = 0; i < selectUserMentor.length; i++) {
            let item = selectUserMentor[i];
            if (item.teacherId + '' == row.teacherId + '') {
              selectUserMentor.splice(i, 1);
              i--;
            }
          }
        }
        this.confirmShow();
//            this.multipleSelection = val;
      },

      /**
       * checkbox 选择后全部时触发事件
       * @param {Array} val Array 存在所有的选择每一个行数据
       * @return {null|undefined}
       */
      handleSelectionAll (val) {
        let selectUserMentor = [];
        let tempArr = [];
        //去掉已选择的
        if (!this.isEdit) {
          val.forEach((value, index) => {
            if (!this.id.includes(value.teacherId + '')) {
              tempArr.push(value);
            }
          });
          val = tempArr;
        }

        if (val.length !== 0) {
          if (this.selectUserMentor == 0) {
            for (let i = 0; i < val.length; i++) {
              selectUserMentor.push(val[i]);
            }
            this.selectUserMentor = selectUserMentor;
            return;
          }
          for (let k = 0; k < val.length; k++) {
            let row = val[k];
            let isSelect = false;
            for (let i = 0; i < this.selectUserMentor.length; i++) {
              let item = this.selectUserMentor[i];
              if (item.teacherId + '' == row.teacherId + '') {
                isSelect = true;
                continue;
              }
            }
            if (!isSelect) {
              selectUserMentor.push(row);
            }
          }
          this.selectUserMentor = this.selectUserMentor.concat(selectUserMentor);
        } else {
          for (let i = 0; i < this.selectUserMentor.length; i++) {
            let item = this.selectUserMentor[i];
            for (let k = 0; k < this.tableData.length; k++) {
              let row = this.tableData[k];
              if (!this.isEdit) {
                if (this.id.includes(item.teacherId + '')) continue;
              }
              if (item.teacherId + '' == row.teacherId + '') {
                this.selectUserMentor.splice(i, 1);
                i--;
                continue;
              }
            }
          }

        }
        this.confirmShow();
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },

      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected (isOnly) {
        let len = this.selectUserMentor.length;
        let flag = true;
        if (len == 0) {
          this.showMess('请选择导师!');
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess('只能选择一个导师!');
          flag = false;
        }
        return flag;
      },

      choice (data) {
        this.teacherName = data.teacherName;
        this.id = data.teacherId;
      },

      show (data) {
        this.operailityData = data;
        this.operailityData.id = data.teacherId;
        this.dataId = data.teacherId;
        this.openModel('show');
      },

      confirm () {
        if (!this.isSelected(true)) return;
        let id = [];
        for (let i = 0; i < this.selectUserMentor.length; i++) {
          let item = this.selectUserMentor[i];
          if (!this.isEdit) {
            if (this.id.includes(item.teacherId + '')) {
              continue;
            }
          }
          id.push(item.teacherId);
        }
        this.ajax({
          ajaxParams: {
            url: api.confirm.path + id.join(','),
//                url: api.confirm.path + '12528',
            method: api.confirm.method
          },
          ajaxSuccess: res => {
            if (res.status.code == 0) {
              this.$message({
                type: 'info',
                message: '操作成功'
              });
              this.getSelected();
              this.isTeacher = false;
            }
          }
        });
      },
      // 增加回调
      subCallback (target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
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
      userInfo
    }
  };
</script>
