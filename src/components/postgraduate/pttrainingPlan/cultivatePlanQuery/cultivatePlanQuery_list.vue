<!----------------------------------
****--@name     培养计划审核
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content">
    <template v-if="hasViewPower">
      <!--搜索form-->
      <el-row>
        <el-col align="right">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="姓名">
              <el-input v-model="formInline.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="专业方向">
              <el-select v-model="formInline.major" clearable>
                <major value="major"></major>
              </el-select>
            </el-form-item>
            <!--  <el-form-item label="状态" prop="status" v-if="typeView=='DS'">
                <el-select filterable v-model="formInline.status" placeholder="请选择">
                  &lt;!&ndash;<el-option label="全部" value=""></el-option>&ndash;&gt;
                  <el-option label="待审核" value="AUDIT"></el-option>
                  <el-option label="不通过" value="DSTPASS"></el-option>
                  <el-option label="通过" value="DSADOPT"></el-option>
                  &lt;!&ndash;<el-option label="教育处审核中" value="JYCDSH"></el-option>&ndash;&gt;
                  &lt;!&ndash;<el-option label="教育处审核驳回" value="JYCBH"></el-option>&ndash;&gt;
                  &lt;!&ndash;<el-option label="通过" value="TG"></el-option>&ndash;&gt;
                </el-select>
              </el-form-item>
              <el-form-item label="状态" prop="status" v-if="typeView=='JYC'||typeView=='YJSGL'">
                <el-select filterable v-model="formInline.status" placeholder="请选择">
                  <el-option label="导师审核中" value="DSDSH"></el-option>
                  <el-option label="导师审核驳回" value="DSBH"></el-option>
                  <el-option label="教研室审核中" value="JYSDSH"></el-option>
                  <el-option label="教研室审核驳回" value="JYSBH"></el-option>
                  &lt;!&ndash;<el-option label="全部" value="JYCDSH,JYCBH,TG"></el-option>&ndash;&gt;
                  <el-option label="待审核" value="KSZRADOPT"></el-option>
                  <el-option label="不通过" value="JYCTPASS"></el-option>
                  <el-option label="通过" value="JYCADOPT"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态" prop="status" v-if="typeView=='KEZR'">
                <el-select filterable v-model="formInline.status" placeholder="请选择">
                  &lt;!&ndash;<el-option label="导师审核中" value="DSDSH"></el-option>&ndash;&gt;
                  &lt;!&ndash;<el-option label="导师审核驳回" value="DSBH"></el-option>&ndash;&gt;
                  &lt;!&ndash;<el-option label="全部" value="JYSDSH,JYSBH,JYCDSH,JYCBH"></el-option>&ndash;&gt;
                  <el-option label="待审核" value="DSADOPT"></el-option>
                  <el-option label="不通过" value="KSZRTPASS"></el-option>
                  <el-option label="通过" value="KSZRADOPT"></el-option>
                  &lt;!&ndash;<el-option label="通过" value="TG"></el-option>&ndash;&gt;
                </el-select>
              </el-form-item>-->
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!--- 培养计划列表 --->
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
            style="width: 100%;height: 100%">

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
              width="100">
              <template scope="scope">
                <el-button size="small" @click="lookUp(scope.row)">查看</el-button>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="name"
              label="姓名">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="teacher"
              label="指导老师">
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
              prop="school"
              label="所在学院">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="statusStr"
              label="状态">
              <template scope="scope">
                {{scope.row.status | plane}}
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
        <!--查看弹窗-->
        <Modal
          :mask-closable="false"
          v-model="showModal"
          height="200"
          title="对话框标题"
          class-name="vertical-center-modal"
          :loading="true"
          :width="900"
        >
          <modal-header slot="header" :parent="self" :content="showId">查看培养计划</modal-header>
          <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
          <div slot="footer"></div>
        </Modal>
      </div>
    </template>
    <div v-else style="font-size: 18px;text-align: center;line-height: 100px;">
      <strong>您没有此权限</strong>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api      from '../api';
  import auditApi from '../cultivatePlanAudit/api';
  import major    from '../../common/major.vue';
  import show     from '../components/lookUp.vue';
  //引入--修改--组件
  //import show from "../components/revise.vue";
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        hasViewPower: true, // 是否有查看权限
        formInline: {
          name: '',
          major: '',
          status: '',
//          majorCode: ''
        },
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        loading: false,
        listTotal: 0,
        tableData1: [],
        showId: {
          id: 'auditId',
          title: '查看'
        },
        listMessTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: '',
            params: {
              name: '',
              major: '',
              status: '',
              majorCode: ''
            }
          }
        },
        typeView: []
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        let typeView = [];
        let userInfo = this.$store.getters.getUserInfo;
        userInfo.roleList.map(item => typeView.push(item.identify));
        this.typeView = typeView;
        console.log(typeView);
        if (typeView.includes('DS')) {
          this.listMessTitle.ajaxParams.url = auditApi.tutorList.path;
//          this.formInline.status = 'AUDIT';
        } else if (typeView.includes('KEZR')) {
          this.listMessTitle.ajaxParams.url = auditApi.jysList.path;
//          this.formInline.status = 'DSADOPT';
        } else if (typeView.includes('YJSGL') || typeView.includes('JYC')) {
          this.listMessTitle.ajaxParams.url = auditApi.list.path;
//          this.formInline.status = 'KSZRADOPT';
        } else if (typeView.includes('YJS')) {
          this.listMessTitle.ajaxParams.url = auditApi.yjsList.path;
          this.formInline.isMy = '1';
        } else {
          this.hasViewPower = false;
        }
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
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params, this.formInline);
        this.ajax(this.listMessTitle);
      },
      successGetList (res) {
        let data = res.data;
        data = this.addIndex(data);
        this.tableData1 = data;
        this.listTotal = res.totalCount;
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
        console.log(this.multipleSelection);
      },

      /**
       * 页面列表查询
       */
      onSubmit () {
        this.queryQptions = {
          //url:this.listUrl,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize,
            name: this.formInline.name,
            major: this.formInline.major,
            status: this.formInline.status
          }
        };
        this.setTableData();
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
      lookUp (row) {
        this.operailityData = row;
        this.showModal = true;
      },
      revise () {

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
      show, major
    }
  };
</script>
