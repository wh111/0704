<!----------------------------------
****--@name     答辩结果记录
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content">
    <el-form ref="formValidate" :model="formValidate" inline>
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <!--<el-col :span="10">-->
        <!--&lt;!&ndash;<el-button v-if="isPass" type="primary" @click="auditing('TG')">提示研究生上报毕业申请</el-button>&ndash;&gt;-->
        <!--</el-col>-->
        <!--搜索项-->
        <el-col align="right">
          <el-form-item label="姓名" prop="defensePlace">
            <el-input v-model="formValidate.applicantName" placeholder="输入姓名">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!searchMore" type="info" @click="searchEvent">{{ 'query' | sysLan }}</el-button>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <!--高级搜索项-->
      <div v-show="searchMore" ref="searchMore" align="right">
        <!--<el-form-item label="专业方向" >-->
        <!--<el-select   v-model="formValidate.specialtyName" placeholder="请选择">-->
        <!--<major></major>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="学校">
          <el-input v-model="formValidate.schoolName" placeholder="请输入学校"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="年级：">
          <el-input v-model="formValidate.boundary" placeholder="请输入年级"></el-input>
        </el-form-item>
        <!--<el-form-item label="状态" prop="status">-->
          <!--<el-select v-model="formValidate.resultStatus" clearable placeholder="请选择">-->
            <!--<el-option-->
              <!--v-for="item in options"-->
              <!--:key="item.value"-->
              <!--:label="item.label"-->
              <!--:value="item.value">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="info" @click="searchEvent">{{ 'query' | sysLan }}</el-button>
        </el-form-item>
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
            width="70">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="80">
            <template scope="scope">
              <el-button size="small" @click="show(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="applicantName"
            label="姓名">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="defenseSpecialist"
            label="答辩专科">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="defenseTime"
            label="答辩时间">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="isPreDefense"
            label="是否预答辩">
            <template scope="scope">
              {{scope.row.isPreDefense == 1?'是':'否'}}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="defensePlace"
            label="答辩地点">
          </el-table-column>
          <!--<el-table-column-->
          <!--show-overflow-tooltip-->
          <!--prop="specialtyCode"-->
          <!--label="专业代码">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
          <!--show-overflow-tooltip-->
          <!--prop="specialtyName"-->
          <!--label="专业方向">-->
          <!--</el-table-column>-->
          <el-table-column
            show-overflow-tooltip
            prop="schoolName"
            label="学校">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="status"
            label="审核状态">
            <template scope="scope">
              {{scope.row.status | typeText}}
            </template>
          </el-table-column>
          <!--<el-table-column-->
            <!--show-overflow-tooltip-->
            <!--prop="status"-->
            <!--label="状态"-->
            <!--width="120">-->
            <!--<template scope="scope">-->
              <!--{{scope.row.resultStatus | dsresultRecord}}-->
            <!--</template>-->
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
            :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      width="900"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import show                         from './respondentResultQuery_view.vue';
  import { respondentReply as rules } from '../rules.js';

  import api   from '../api.js';
  import major from '../../common/major.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        rules,
        formValidate: {
          applicantName: '',       //姓名
          specialtyName: '',       //专业
          schoolName: '', // 学校
          boundary: '', // 年级
          resultStatus: ''    //   状态
        },
        options: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '0',
            label: '未答辩'
          },
          {
            value: '1',
            label: '教研室未确认'
          },
          {
            value: '2',
            label: '不通过'
          },
          {
            value: '3',
            label: '教育处未确认'
          },
          {
            value: '4',
            label: '教育处确认'
          }
        ],

        isPass: true,
        isNotpass: true,
        auditModal: false,
        /*--按钮button--*/
        auditId: {id: 'addId', title: '审核'},
        viewId: {id: 'viewId', title: '查看'},

        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [
          /*{
           id":"1",
           "name":"姓名",
           "specialtyName":"专业",
           "researchDirection":"研究方向",
           "thesisTitle":"论文题目",
           "resultStatus":"状态",  1通过  2不通过
           "advisor":"指导老师",
           "school":"所在学院",
           "fileInfo":{
           "fileId":"1",
           "fileName":"文件名称",
           "filePath":"/file/",
           "fileType":"txt"
           }
           }*/
        ],
        searchMore: false,
        loading: false,
        reportedModal: false,
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.defenseAppResGetList.path,
            params: {
              name: '',  //姓名
              specialtyName: '',  //专业
              resultStatus: 'DSH'  //状态
            }
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1, pageSize: Util.pageInitPrams.pageSize
        };

        this.setTableData();
      },

      //设置表格及分页的位置
      setTableDynHeight () {
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
      handleSelectionChange (val) {
        this.multipleSelection = val;
        if (this.multipleSelection.length > 0) {
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if (this.multipleSelection[i].status == 'DSH') {
              this.isPass = true;
              this.isNotpass = true;
            } else {
              this.isPass = false;
              this.isNotpass = false;
            }
          }
        } else {
          this.isPass = true;
          this.isNotpass = true;
        }
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
          this.showMess('只能删除一条数据!');
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData (responseData) {
        this.tableData = this.addIndex(responseData.data || []);
        this.totalCount = responseData.totalCount || 0;
      },
      setTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, this.formValidate);
        this.ajax(this.listMessTitle);
      },

      //搜索监听回调
      searchEvent (isLoading) {
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate');
        if (isSubmit) {
          this.formValidate.defenseTime = this.conductDate(this.formValidate.defenseTime, 'yyyy-MM-dd');
          this.setTableData();
        }
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
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

      //状态修改
      auditing (status) {
        if (!this.isSelected()) return;
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
                url: api.defenseSummaryAudit.path + ids,
                method: api.defenseSummaryAudit.method,
                data: {
                  status: status
                }
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
        }).catch(() => {});

      },

      /*--点击--添加--按钮--*/
      pass () {
        this.openModel('audit');
      },

      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show (data) {
        this.operailityData = data;
        this.openModel('show');
      },
      audit (data) {
        this.operailityData = data;
        this.openModel('audit');
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
      },

      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore () {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight();
        });
      }

    },
    created () {
      Util = this.$util;
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
      show, major
    }
  };
</script>
