<!----------------------------------
****--@name     开放导师
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
---------------------------------->
<template>
  <div id="content" ref="content">
    <el-form :model="formInline" :inline="true" ref="formInline">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="14">
          <el-button type="primary" @click="setMentor">设置开放导师</el-button>
          <el-button v-if="isDelet" type="primary" @click="release">发布</el-button>
          <el-button v-else type="primary"  :disabled="true">发布</el-button>
          <el-button v-if="isDelet" type="danger" @click="remove">删除</el-button>
          <el-button v-else type="danger"  :disabled="true">删除</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="10" align="right">
          <!--<el-form-item label="年级">-->
          <!--<el-select v-model="formInline.boundary" placeholder="">-->
          <!--<el-option label="2015" value="2015"></el-option>-->
          <!--<el-option label="2016" value="2016"></el-option>-->
          <!--<el-option label="2017" value="2017"></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->

          <!--<el-form-item label="姓名" prop="name">-->
          <!--<el-input v-model="formInline.name" placeholder=""></el-input>-->
          <!--</el-form-item>-->

          <el-form-item label="专业方向">
            <el-select v-model="formInline.majorCode" placeholder="请选择专业">
              <optionList></optionList>
            </el-select>
          </el-form-item>

          <!--<el-form-item label="学位类型" prop="specialtyName">-->
          <!--<el-select v-model="formInline.degree" placeholder="">-->
          <!--<el-option label="学术学位" value="学术学位"></el-option>-->
          <!--<el-option label="专业学位" value="专业学位"></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item>
            <el-button type="info" @click="onSubmit">{{ 'query' | sysLan }}</el-button>
            <!--<el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>-->
          </el-form-item>
        </el-col>
        <!--高级搜索项-->
        <el-col v-if="searchMore" ref="searchMore" align="right">
        </el-col>
      </el-row>
    </el-form>

    <!--- 开放导师列表 --->
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
          :data="tableData1"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%;height: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"
            :selectable="canTodo">
          </el-table-column>
          <el-table-column
            align="center"
            label="序号"
            prop="index"
            width="65">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160">
            <template scope="scope">
              <el-button size="small" @click="show(scope.row)">查看</el-button>
              <el-button size="small" :disabled="scope.row.status == 'PUBLISH'" @click="edit(scope.row)">修改</el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="teacherNames"
            label="导师姓名"
            width="150"
          >
          </el-table-column>
          <el-table-column
            prop="majorCode"
            label="专业代码"
            width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="major"
            label="专业方向"
            width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="openTime"
            label="开放时间"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="studentNames"
            label="学生姓名">
          </el-table-column>

          <el-table-column
            prop="status"
            label="状态"
            width="80"
          >
            <template scope="scope">
              {{ scope.row.status | typeText }}
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
            :total="listTotal">
          </el-pagination>
        </div>
      </div>
      <!-- 模态框 设置新的开放导师（add） -->
      <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="600">
        <modal-header slot="header" :content="addId"></modal-header>
        <set-mentor v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></set-mentor>
        <div slot="footer"></div>
      </Modal>
      <Modal close-on-click-modal="false" height="200" v-model="removeModal" title="对话框标题"
             class-name="vertical-center-modal" :loading="loading"
             :width="500">
        <modal-header slot="header" :content="button.removeId"></modal-header>
        <remove v-if="removeModal" :deleteUrl="api.removes" @remove="subCallback" @cancel="cancel"
                :operaility-data="operailityData"></remove>
        <div slot="footer"></div>
      </Modal>
      <!-- 模态框 查看（view） -->
      <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal"
             :loading="true"
             :width="600">
        <modal-header slot="header" :parent="self" :content="button.showId"></modal-header>
        <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
        <div slot="footer"></div>
      </Modal>
      <!-- 模态框 编辑（edit） -->
      <Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题" class-name="vertical-center-modal"
             :width="600">
        <modal-header slot="header" :content="button.editId"></modal-header>
        <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"
              :id="todoId"></edit>
        <div slot="footer"></div>
      </Modal>
    </div>

  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api                 from '../api';
  //引入查看组件
  import optionList          from '../../common/major.vue';
  import setMentor           from './setMentor.vue';
  import show                from './openingMentor_choice.vue';
  import edit                from './openingMentor_edit.vue';
  //引入--修改--组件
  //import revise from "../components/revise.vue";
  //引入验证规则
  import { queryAssessment } from '../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        api,
        queryAssessment,
        formInline: {
          major: '',
//        degree:'',
//        name:''
          majorCode: ''
        },
        button: {
          removeId: {
            id: 'removeId',
            title: '删除开放导师'
          },
          showId: {
            id: 'showId',
            title: '查看开放导师'
          },
          editId: {
            id: 'editId',
            title: '修改开放导师'
          }
        },
        operailityData: {},
        operailityData1: {},
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        loading: false,
        isDelet: false,
        searchMore: false,
        listTotal: 0,
        tableData1: [],
        addId: {
          id: 'auditId',
          title: '新建开放导师'
        },
        //弹窗类型
        modal: {
          type: ''
        },
        listMessTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.choiceList.path,
            params: {}
          }
        },
        queryListTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.choiceList.path,
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
        this.setTableData();
      },
      setTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,
          this.queryQptions.params);
        this.ajax(this.listMessTitle);
      },
      getTableData () {
        this.queryListTitle.ajaxParams.params = Object.assign(this.queryListTitle.ajaxParams.params,
          this.queryQptions.params);
        this.queryListTitle.ajaxParams.params = Object.assign(this.queryListTitle.ajaxParams.params, this.formInline);
        this.ajax(this.queryListTitle);
      },
      successGetList (res) {
        let data = res.data;
        data = this.addIndex(data);
        this.tableData1 = data;
        this.listTotal = res.totalCount;
      },
      // 是否允许参与选择
      canTodo (row) {
        return row.status == 'UNPUBLISH';
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },
      //查询
      onSubmit () {
        this.getTableData();
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      //新建开放导师
      setMentor () {
        this.operailityData = null;
        this.modal.type = 'add';
        this.openModel('add');
      },
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
        if (this.multipleSelection.length > 0) {
          this.isDelet = true;
        } else {
          this.isDelet = false;
        }

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
      },
      /*
       * 列表数据选择
       */
      isSelected () {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len < 1) {
          this.showMess('请选择数据!');
          flag = false;
        }
        return flag;
      },
      //删除
      remove () {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection;
          this.openModel('remove');
        }
      },
      //查看
      show (data) {
        this.operailityData = data;
        this.openModel('show');
      },
      // 编辑
      edit (row) {
        this.todoId = row.id;
        this.openModel('edit');
      },
      //发布
      release () {
        this.$confirm('确定进行该操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let arr = [];
          let that = this;
          if (this.multipleSelection.length > 0) {
            for (let i = 0; i < this.multipleSelection.length; i++) {
              arr.push(this.multipleSelection[i].id);
            }
            let ids = arr.join();
            this.ajax({
              ajaxParams: {
                url: api.release.path + ids,
                method: api.release.method
              },
              ajaxSuccess: res => {
                if (res.status.code == 0) {
                  that.$message({
                    type: 'info',
                    message: '操作成功'
                  });
                  that.init();
                }
              }
            });
          }
        }).catch(() => {
        });
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
      setMentor, show, edit, optionList
    }
  };
</script>
