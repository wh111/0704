<!--
****--@file     teStaff
****--@date     2018/10/24 14:26
****--@author   ZWT
****--@describe 老师教研室
-->
<template>
  <div id="content" ref="content" class="modal">
    <el-form v-model="formValidate" ref="formValidate" :inline="true"
             class="form-inline lose-margin" label-width="90px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="时间：">
            <date-group>
              <el-date-picker v-model="formValidate.startTime" name="start"
                              :editable="false" type="date" placeholder="开始日期"
                              :picker-options="pickerOptions0"
              ></el-date-picker>
              <span> 至 </span>
              <el-date-picker v-model="formValidate.endTime" name="end"
                              :editable="false" type="date" placeholder="截止日期"
                              :picker-options="pickerOptions1"
              ></el-date-picker>
            </date-group>
          </el-form-item>
          <el-form-item label="科室" prop="deptName">
            <el-select clearable placeholder="请选择"
                       v-model="formValidate.deptName">
              <!--<select-option label="全部" value=""></select-option>-->
              <!--<el-option ></el-option>-->
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" prop="userName">
            <el-input placeholder="输入姓名搜索" v-model="formValidate.userName">
            </el-input>
          </el-form-item>
          <el-form-item label="分类" prop="type">
            <el-input placeholder="输入分类搜索" v-model="formValidate.type">
            </el-input>
          </el-form-item>
          <el-form-item label="一级指标" prop="firstCode">
            <el-input placeholder="输入一级指标搜索" v-model="formValidate.firstCode">
            </el-input>
          </el-form-item>
          <el-form-item label="二级指标" prop="secondCode">
            <el-input placeholder="输入二级指标搜索" v-model="formValidate.secondCode">
            </el-input>
          </el-form-item>
          <el-button type="primary" @click="searchEvent">&nbsp; 查询 &nbsp;
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <div style="border: 1px solid #dfe6ec">
      <table class="el-table">
        <thead>
        <tr class="place">
          <th width="10%">科室</th>
          <th width="10%">姓名</th>
          <th width="10%">分类</th>
          <th width="10%">分类得分</th>
          <th width="10%">一级指标</th>
          <th width="10%">一级得分</th>
          <th width="20%">二级指标</th>
          <th width="10%">二级得分</th>
          <th width="10%">查看</th>
        </tr>
        </thead>
      </table>
      <div class="inStudyRegister tr-count-child"
           :style="{overflow: 'auto',height:dynamicHt-30+'px'}">
        <table ref="myTable" class="el-table">
          <colgroup>
            <col name="el-table_1_column_24" width="10%">
            <col name="el-table_1_column_25" width="10%">
            <col name="el-table_1_column_26" width="10%">
            <col name="el-table_1_column_27" width="10%">
            <col name="el-table_1_column_28" width="10%">
            <col name="el-table_1_column_29" width="10%">
            <col name="el-table_1_column_30" width="20%">
            <col name="el-table_1_column_31" width="10%">
            <col name="el-table_1_column_32" width="10%">
          </colgroup>
          <tbody>
          <tr v-for="(item,index) in listData" v-if="listData.length>0">
            <td v-if="item.depCount!=null " style="border: 1px solid  #dfe6ec"
                :rowspan="item.depCount">
              {{item.deptName}}
            </td>
            <td v-if="item.userCount!=null" style="border: 1px solid  #dfe6ec"
                :rowspan="item.userCount">
              {{item.userName}}
            </td>
            <td v-if="item.typeCount!=null" style="border: 1px solid  #dfe6ec"
                :rowspan="item.typeCount">
              {{item.type}}
            </td>
            <td v-if="item.typeCount!=null" style="border: 1px solid  #dfe6ec"
                :rowspan="item.typeCount">
              {{item.typeScore}}
            </td>
            <td v-if="item.normCount!=null" style="border: 1px solid  #dfe6ec"
                :rowspan="item.normCount">
              {{item.firstCodeName}}
            </td>
            <td v-if="item.normCount!=null" style="border: 1px solid  #dfe6ec"
                :rowspan="item.normCount">
              {{item.score}}
            </td>
            <td style="border: 1px solid  #dfe6ec">
              {{item.codeName}}
            </td>
            <td style="border: 1px solid  #dfe6ec">
              {{item.sumScore}}
            </td>
            <td style="border: 1px solid  #dfe6ec">
              <!--<template scope="scope">-->
              <el-button @click="show(item)">查看</el-button>
              <!--</template>-->
            </td>
          </tr>
          <tr v-else>
            <td colspan="9" :style="{height: dynamicHt-30+'px'}">暂无数据</td>
          </tr>
          </tbody>
        </table>
      </div>
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
    <!--查看弹窗-->
    <Modal
      width="1000"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback"
            :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import show from './teaperstatistic_view'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'teStaff',
    data () {
      return {
        formValidate: {
          type: '',
          userName: '',
          deptName: '',
          firstCode: '',
          secondCode: '',
          startTime: '',
          endTime: '',
          achieveType: 'te_staff',
        },
        loading: false,
        viewId: {id: 'viewId', title: '查看'},
        dynamicHt: 100,
        listData: [],
        totalCount: 0,
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.listAchieveCount.path,
            method: api.listAchieveCount.method,
            params: {},
          },
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util

        this.myPages = Util.pageInitPrams

        this.queryQptions = {
          curPage: 1, pageSize: Util.pageInitPrams.pageSize,
        }
        this.setTableData()
      },
      updateListData (res) {
        let depArr = [];
        let data = res.data;
        depArr = this.getSame(data, 'depId');

        //分出层级结构
        let dataList = depArr.reduce((arr, item) => {
          arr.push(this.getSame(item, 'userName'));
          return arr
        }, [])
        console.log('depNameArr', dataList)

        let tableData = [];
        dataList.map((depNameArr) => {
          let depArr = []//存储科室
          depNameArr.map((depItem, depIndex) => {//科室
            let userArr = []//存储姓名
            depItem.map((userItem, userIndex) => {//
              let typeArr = []//存储分类
              userItem.achieveList.map((typeItem, typeIndex) => {
                let normArr = []//存储一级指标
                typeItem.secondList.map((achieveListItem, achieveListIndex) => {
                  normArr.push(Object.assign({}, typeItem, achieveListItem,
                    {typeScore: achieveListItem.score}, userItem, typeItem))
                })
                if (normArr.length > 0) {
                  Object.assign(normArr[0], {normCount: normArr.length})//增加一级指标合并数
                }
                typeArr = typeArr.concat(normArr)//组成分类
              })
              if (typeArr.length > 0) {
                Object.assign(typeArr[0], {typeCount: typeArr.length})//增加分类合并数
              }
              userArr = userArr.concat(typeArr)//组成人员
            })
            if (userArr.length > 0) {
              Object.assign(userArr[0], {userCount: userArr.length})//增加分类合并数
            }
            depArr = depArr.concat(userArr)
          })
          if (depArr.length > 0) {
            Object.assign(depArr[0], {depCount: depArr.length})//增加分类合并数
          }
          tableData = tableData.concat(depArr)
        })
        console.log('tableData', tableData);
        this.listData = tableData
        this.totalCount = res.totalCount
        // console.log(res.data)
      },

      //相同的数据放到一起
      getSame (list, key) {
        let temObj = {}
        let temArr = []
        list.map(item => {
          let index = 0;
          if (temObj[item[key]]) {
            index = temObj[item[key]]
            temArr[index].push(item)
          } else {
            index = temArr.length
            temArr[index] = [item]
          }
        })
        return temArr
      },
      setTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(
          this.listMessTitle.ajaxParams.params, this.queryQptions,
          this.formValidate)
        this.ajax(this.listMessTitle)
      },
      //搜索监听回调
      searchEvent (isLoading) {
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate');
        if (isSubmit) {
          this.setTableData()
        }
      },
      show (data) {
        console.log(data)
        this.operailityData = data;
        this.openModel('show');
      },
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      /*
      * 打开指定的模态窗体
      * @param options string 当前指定的模态:"add"、"edit"
      * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      subCallback (target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        console.log(content);
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 0;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
        console.log(parHt, this.dynamicHt);
      },

      /*
   * 列表查询方法
   * @param string 查询from的id
   * */
      handleSubmit (name) {
        let flag = false
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag = true;
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
        return flag
      },
    },
    created () {
      this.init()
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        console.log(211111);
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      })
    },
    components: {
      show,
    },
  }

</script>
<style scoped>
  .el-table {
    border: 1px solid #fff;
  }

  .el-table th {
    white-space: nowrap;
    overflow: hidden;
    background-color: #eef1f6;
    text-align: center;
  }

  .el-table td {
    text-align: center;
  }
</style>
