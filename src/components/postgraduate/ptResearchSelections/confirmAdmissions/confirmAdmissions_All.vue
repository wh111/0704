<!----------------------------------
****--@name     确认招生
****--@role     所有人（教育处可以操作，其他人只能查看）
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content">
    <el-form :model="formInline" :rules="queryAssessment" :inline="true" ref="formInline">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="6">
          <!--<template v-if="fromModular!=='admissionsQuery'&&['YJSGL','JYC'].includes(typeView)">-->
            <!--<el-button type="primary" :disabled="isPass" @click="confirm">确定招生</el-button>-->
            <!--<el-button type="primary" @click="send">发短信</el-button>-->
          <!--</template>-->
          <!--<span v-else></span>-->
          <span></span>
        </el-col>
        <!--搜索项-->
        <el-col :span="18" align="right">
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="formInline.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!searchMore" type="info" @click="onSubmit">{{ 'query' | sysLan }}</el-button>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>
          </el-form-item>
        </el-col>
        <!--高级搜索项-->
        <el-col v-if="searchMore" ref="searchMore" align="right">
          <el-form-item label="专业方向">
            <el-select v-model="formInline.majorCode" clearable>
              <optionList></optionList>
            </el-select>
          </el-form-item>

          <!--<el-form-item label="年级">-->
          <!--<el-select v-model="formInline.boundary" placeholder="">-->
          <!--<el-option label="全部" value=""></el-option>-->
          <!--<el-option v-for="item in optionData" :key="item" :label="item" :value="item" ></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->

          <el-form-item label="学位类型" prop="specialtyName">
            <el-select v-model="formInline.degree" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="学术学位" value="MAJOR"></el-option>
              <el-option label="专业学位" value="LEARNING"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select v-model="formInline.status" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="教育处未确认" value="INTERVIEW"></el-option>
              <el-option label="教育处已确认" value="JYCCONFIRM"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
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
          <!--<el-table-column-->
            <!--v-if="fromModular!=='admissionsQuery'"-->
            <!--type="selection"-->
            <!--width="55">-->
          <!--</el-table-column>-->
          <el-table-column
            align="center"
            label="序号"
            prop="index">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="name"
            label="姓名">
          </el-table-column>
          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="teacherName"
            label="导师">
          </el-table-column>
          <!--<el-table-column-->
          <!--prop="boundary"-->
          <!--label="年级"-->
          <!--&gt;-->
          <!--</el-table-column>-->
          <el-table-column
            prop="phone"
            label="电话号码"
            align="center"
            width="180"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="majorCode"
            label="专业代码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="major"
            label="专业方向"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="degree"
            label="学位类型"
          >
            <template scope="scope">
              {{scope.row.degree | interview}}
            </template>
          </el-table-column>
          <!--<el-table-column-->
            <!--show-overflow-tooltip-->
            <!--prop="studentNames"-->
            <!--label="备注"-->
          <!--&gt;-->
          <!--</el-table-column>-->
          <el-table-column
            show-overflow-tooltip
            prop="status"
            label="状态"
          >
            <template scope="scope">
              {{scope.row.status | dsInterview}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div style="margin: 10px;">
        <div style="float: right;">
          <el-pagination
            @size-change="change,PageSize"
            @current-change="changePage"
            :current-page="myPages.currentPage"
            :page-sizes="myPages.pageSizes"
            :page-size="myPages.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listTotal">
          </el-pagination>
        </div>
      </div>
      <!-- 模态框 发送短信 -->
      <Modal
        :width="500"
        v-model="sendModal"
        title="发送短信"
        class-name="vertical-center-modal"
        :loading="loading">
        <modal-header slot="header" :content="showId"></modal-header>
        <sms-send v-if="sendModal" @cancel="cancel" :operaility-data="operailityData" @send="subCallback"></sms-send>
        <div slot="footer"></div>
      </Modal>
    </div>

  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api                 from './api';
  //引入查看组件
  import optionList          from '../../common/major.vue';
  //引入--修改--组件
  //import revise from "../components/revise.vue";
  //引入验证规则
  import { queryAssessment } from '../rules';
  //引入发送短信
  import smsSend             from './send';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      contentHeight: {
        type: Number,
        default: 0
      },
      fromModular: {
        type: String,
        default: ''
      },
//      typeView: {
//        type: String,
//        default: ''
//      }
    },
    data () {
      return {
        searchMore: false,
        queryAssessment,
        formInline: {
          boundary: '',
          name: '',
          major: '',
          degree: '',
          status: '',
          majorCode: ''
        },
        optionData: [],
        ids: '',
        phone: '',
        operailityData: {},
        operailityData1: {},
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        loading: false,
        sendModal: false,
        listTotal: 0,
        tableData1: [],
        isPass: true,
        showId: {
          id: 'showId',
          title: '发送短信'
        },
        listMessTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.jyclist.path,
            params: {}
          }
        },
        queryListTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.jyclist.path,
            params: {}
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {

        let year = new Date().getFullYear();
        let tempArr = [];
        for (let i = 0; i < 4; i++) {
          tempArr.push(year - i);
        }
        this.optionData = tempArr;

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
      //查询
      onSubmit () {
        this.getTableData();
      },
      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore() {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        if (this.contentHeight > 0) {
          let consumablesTable = this.$refs.myTable;
          let paginationHt = 50 * 2 + 25;
          this.dynamicHt = this.contentHeight - consumablesTable.offsetTop - paginationHt;
          //console.log(this.contentHeight,this.dynamicHt,consumablesTable.offsetTop);
        } else {
          let content = this.$refs.content;
          let parHt = content.parentNode.offsetHeight;
          let myTable = this.$refs.myTable;
          let paginationHt = 50;
          this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
          //console.log(this.contentHeight,this.dynamicHt,consumablesTable.offsetTop,2);
        }
      },
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
        let isPass = val.some((item) => {
          return item.status !== 'INTERVIEW';
        });
        this.isPass = val == 0 ? true : isPass;

      },
      send () {
        let arr = [];
        if (this.multipleSelection.length > 0) {
          for (let i = 0; i < this.multipleSelection.length; i++) {
            arr.push(this.multipleSelection[i].phone);
          }
          let telphone = arr.join();
          this.operailityData = telphone;
          this.openModel('send');
        }
      },
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      // 是否允许参与选择
      canTodo (row) {
        return row.status == 'KSCCONFIRM';
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
      //确认招生
      confirm () {
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
            console.log(ids);
            this.ajax({
              ajaxParams: {
                url: api.jycconfirm.path + ids,
                method: api.jycconfirm.method,
                data: {
                  ids,
                  status: 'JYCCONFIRM'
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
      optionList,
      smsSend
    },
    watch: {
      contentHeight (val) {
      }
    }
  };
</script>
