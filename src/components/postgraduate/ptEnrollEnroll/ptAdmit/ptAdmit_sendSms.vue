<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <el-row>
    <el-form :model="formValidate" :rules="rules" ref="formValidate" inline label-width="100px">
      <el-row style="margin-bottom:0">
        <el-col align="right">
          <el-form-item prop="name">
            <el-input style="width:300px;" v-model="formValidate.name" placeholder="输入姓名搜索">
              <el-button @click="searchEvent" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>

        <!--高级搜索项-->
        <el-col align="right" v-if="searchMore" ref="searchMore">

          <el-form-item label="专业方向：">
            <el-select v-model="formValidate.major" clearable placeholder="请选择">
              <el-option v-for="(item,index) in majorData" :key="index"
                         :label="(item.value || '全部')+ (item.code ? '（'+ item.code +'）' : '')"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="成绩：" prop="minScore" style="margin-right: 0;">
            <el-input v-model="formValidate.minScore" placeholder="最小成绩">
            </el-input>
          </el-form-item>
          <span style="line-height: 36px;">~</span>
          <el-form-item prop="maxScore">
            <el-input v-model="formValidate.maxScore" placeholder="最大成绩">
            </el-input>
          </el-form-item>

          <el-form-item label="年届:" prop="boundary">
            <el-date-picker v-model="formValidate.boundary" type="year" placeholder="选择年份"
                            @change="selectBoundary"></el-date-picker>
          </el-form-item>

          <!--<el-form-item label="录取状态" prop="enterStrtus">-->
          <!--<el-select filterable v-model="formValidate.enterStrtus" placeholder="请选择">-->
          <!--<el-option label="全部" value=""></el-option>-->
          <!--<el-option label="录取" value="ENROLL"></el-option>-->
          <!--<el-option label="不录取" value="NOENROLL"></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->

          <el-form-item>
            <el-button type="info" @click="searchEvent">查询</el-button>
          </el-form-item>

        </el-col>
      </el-row>
    </el-form>

    <!--列表数据-->
    <div>
      <!--表格数据-->
      <div id="myTable" ref="myTable">
        <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
                  highlight-current-row style="width: 100%;height: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column align="center" label="序号" prop="index" width="100">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="studentId" label="学号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="姓名">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="sex" label="性别" align="center">
            <template scope="scope">
              {{scope.row.sex | typeText}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="phone" label="电话号码">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="messageStrtus" label="短信通知">
            <template scope="scope">
              <el-button v-if="scope.row.messageStrtus=='NOTICE'" type="text">已通知</el-button>
              <span v-else>未通知</span>
            </template>
          </el-table-column>
          <!--<el-table-column-->
          <!--show-overflow-tooltip-->
          <!--prop="major"-->
          <!--label="短信回执">-->
          <!--</el-table-column>-->
          <el-table-column show-overflow-tooltip prop="quasiAdmissionStrtus" label="拟录取状态">
            <template scope="scope">
              {{scope.row.quasiAdmissionStrtus | typeText}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="score" label="成绩">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="enterStrtus" label="录取状态">
            <template scope="scope">
              {{(scope.row.enterStrtus || '待处理') | typeText}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div style="margin: 10px;">
        <div style="float: right;">
          <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                         :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </div>

    <br>
    <el-form :model="msgFormValidate" ref="msgFormValidate" :rules="rules">
      <el-col>
        <el-form-item label="通知人员：">
          <template v-if="operailityData instanceof Object">
            <el-tag class="ptAdmitUserItem" v-for="(item,index) in operailityData" :key="index" :closable="true"
                    type="gray"
                    @close="removeUser(index)">
              {{item.name}}
            </el-tag>
          </template>
          <span v-else>请选择需要通知的人员</span>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="时间：" prop="time">
          <el-date-picker v-model="msgFormValidate.time" type="date" :editable="false" placeholder="请选择日期"
                          @change="selectTime"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-form>
    <el-col align="center">
      <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      <el-button @click="cancel">取消</el-button>
    </el-col>
  </el-row>
</template>
<style>
  .ptAdmitUserItem {
    margin: 5px;
  }
</style>
<script>
  /*当前组件必要引入*/
  import { ptAdmitSendSms as rules } from '../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['url'],
    data () {
      return {
        rules,
        //查询表单
        formValidate: {
          enterStrtus: 'ENROLL', //录取状态
          name: '', //姓名
          boundary: '', //年级
          major: '', //专业
          minScore: '', //最小成绩
          maxScore: '' //最大成绩
        },
        operailityData: null,
        multipleSelection: [],
        dynamicHt: 292,
        self: this,
        tableData: [],
        searchMore: false,
        loading: false,
        totalCount: 0,
        //保存按钮基本信息
        loadBtn: {title: '通知', callParEvent: 'listenSubEvent'},
        majorData: [],

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.url.enrollList.path,
            params: {}
          }
        },

        msgFormValidate: {
          ids: '',
          time: ''
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

        this.getMajor();
        this.setTableData();
      },

      // 选择年届
      selectBoundary (val) {
        this.formValidate.boundary = val;
      },
      // 获取专业
      getMajor () {
        let opt = {
          ajaxSuccess: res => {
            if (res.data && res.data.child) {
              this.majorData = res.data.child;
            }
            this.majorData.unshift({code: '', value: ''});
          },
          ajaxError: () => this.errorMess('获取专业失败'),
          ajaxParams: {
            url: this.url.majorList
          }
        };
        this.ajax(opt);
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        let data = this.getFormData(this.operailityData);
        if (val) {
          val.map(item => data[item.id] = item);
        }
        this.operailityData = Object.keys(data).length ? data : null;
      },

      removeUser (index) {
        let data = this.getFormData(this.operailityData);
        delete data[index];
        this.operailityData = Object.keys(data).length ? data : null;
      },

      setTableData () {
        if (this.formValidate.minScore && this.formValidate.maxScore) {
          if (this.formValidate.maxScore < this.formValidate.minScore) {
            this.errorMess('最大分数不能小于最小分数');
            return;
          }
        }
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions,
          this.formValidate);
        this.ajax(this.listMessTitle);
      },

      //通过get请求列表数据
      updateListData (responseData) {
        if (!responseData.data) return;
        this.tableData = this.addIndex(responseData.data);
        this.totalCount = responseData.totalCount;
      },

      //搜索监听回调
      searchEvent (isLoading) {
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate');
        if (isSubmit) {
          this.setTableData();
        }
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
            this.$Message.error('查询内容有误!');
          }
        });
        return flag;
      },

      selectTime (val) {
        this.msgFormValidate.time = val;
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('msgFormValidate');
        if (this.hasUser() && isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          let opt = {
            type: 'sendMsg',
            successTitle: '发送通知成功!',
            errorTitle: '发送通知失败!',
            ajaxSuccess: 'ajaxSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              url: this.url.enrollMessage.path,
              method: this.url.enrollMessage.method,
              data: this.getFormData(this.msgFormValidate)
            }
          };
          this.ajax(opt, isLoadingFun);
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },

      hasUser () {
        let user = Object.keys(this.operailityData || {});
//        for(let key in this.operailityData){
//          user.push(key)
//        }
        this.msgFormValidate.ids = user.join(',');
        if (!user.length) {
          this.errorMess('请选择需要通知的人员！');
        }
        return !!user.length;
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },

      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore () {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight();
        });
      },

      //设置表格及分页的位置
      setTableDynHeight () {
        let parHt = 400;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },

      cancel () {
        this.$emit('cancel', 'sendMsg');
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
