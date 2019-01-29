<!--
****--@file     roomReserve_selectRoom
****--@date     2018/7/20 15:52
****--@author   YC
****--@describe 房间预约-选择房间
-->
<template>
  <div class="selectRoomBox">
    <el-row>
      <el-col align="right">
        <el-form :inline="true" onsubmit="return false">
          <el-form-item label="房间号：">
            <el-input placeholder="房间号" v-model="formValidate.roomNum">
            </el-input>
          </el-form-item>
          <el-form-item label="房间所在位置：">
            <el-input placeholder="房间所在位置" v-model="formValidate.address">
            </el-input>
          </el-form-item>
          <el-form-item label="房间类型：">
            <el-select v-model="formValidate.roomType" clearable placeholder="请选择">
              <el-option value="" label="全部"></el-option>
              <el-option v-for="(item,key) in typeText" :key="key" :value="key" :label="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="search">{{ 'query' | sysLan }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <el-table v-if="!selectOne" ref="multipleTable" align="center" :context="self" :data="tableData" tooltip-effect="dark" :height="dynamicHt"
                  style="width: 100%" @selection-change="SelectionChangeRoom">
          <el-table-column type="selection" :selectable="selectable" width="55"></el-table-column>
          <el-table-column label="房间号" prop="roomNum"></el-table-column>
          <el-table-column label="房间名称" prop="roomName" show-overflow-tooltip></el-table-column>
          <el-table-column label="房间所在位置" prop="address" show-overflow-tooltip></el-table-column>
          <el-table-column label="房间类型" prop="roomType" show-overflow-tooltip>
            <template scope="scope">
              {{ loadTypeText(scope.row.roomType) }}
            </template>
          </el-table-column>
          <el-table-column label="可容量" prop="capacity" width="80" show-overflow-tooltip>
            <template scope="scope">
              <p align="right">
                {{ scope.row.capacity }}
              </p>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-else ref="multipleTable" align="center" :context="self" :data="tableData" tooltip-effect="dark" :height="dynamicHt"
                  style="width: 100%" highlight-current-row @current-change="handleCurrentChange">
          <el-table-column label="序号" type="index" width="70"></el-table-column>
          <el-table-column label="房间号" prop="roomNum" show-overflow-tooltip></el-table-column>
          <el-table-column label="房间名称" prop="roomName" show-overflow-tooltip></el-table-column>
          <el-table-column label="房间所在位置" prop="address" show-overflow-tooltip></el-table-column>
          <el-table-column label="房间类型" prop="roomType" show-overflow-tooltip>
            <template scope="scope">
              {{ loadTypeText(scope.row.roomType) }}
            </template>
          </el-table-column>
          <el-table-column label="可容量" prop="capacity" width="80" show-overflow-tooltip>
            <template scope="scope">
              <p align="right">
                {{ scope.row.capacity }}
              </p>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页按钮 -->
        <div style="float: right;margin-top:10px;">
          <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                         :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
        </div>
      </el-col>
      <div style="clear:both;padding-top:20px;">
        <el-col :span="6" :offset="6" align="center">
          <el-button type="primary" @click="selectRoom">确定</el-button>
        </el-col>
        <el-col :span="6" align="center">
          <el-button @click="cancel">取消</el-button>
        </el-col>
      </div>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'roomReserveSelectRoom',
    props: ['select'],
    data () {
      return {
        self: this,
        selectOne: false,
        roomNum: '', // 搜索房间号
        roomType: '', // 房间类型
        dynamicHt: 300,
        totalCount:0,
        selectData: [], // 已选择的数据
        tableData: [],
        allData: [],
        formValidate: {
          roomNum: '',
          isOpen: 'YES',
          roomType: '',
          address: ''
        },
        typeText: null
      };
    },
    methods: {
      init: function () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.selectRoomList.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };
//        Object.assign(this.queryQptions.params, this.postData);
        this.getTypeText();
      },
      cancelSubmit () {
        return false;
      },
      getTypeText () {
        let opt = {
          ajaxSuccess: res => {
            let temp = {};
            (res.data || []).map(item => {
              temp[item.code] = item.name;
            });
            console.log(temp);
            this.typeText = temp;
            this.setTableData();
          },
          ajaxParams: {
            url: 'room/getAffairType'
          }
        };
        this.ajax(opt);
      },
      loadTypeText (key) {
        return this.typeText && this.typeText[key] || key;
      },
      //*----------- 表格 ------------*//
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      SelectionChangeRoom (val) {
        console.log(val);
        this.selectData = val;
      },
      handleCurrentChange (val) {
        // 表格开启了是否选择
        if (this.disSelect && (this.unSelectRoom.indexOf(+val.id) > -1)) {
          this.errorMess(`房间号 ${val.roomNum} 不允许选择，请选择其他房间！`);
          return false;
        }
        this.selectData[0] = val;
      },
      /*
       * 表格是否可选
       **/
      selectable (row) {
        let tag = true;
        // 表格开启了是否选择
        if (this.disSelect && (this.unSelectRoom.indexOf(+row.id) > -1)) {
          tag = false;
        }
        return tag;
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData (isLoading) {
        Object.assign(this.queryQptions.params, this.formValidate);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading);
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.tableData = res.data;
        this.allData = res.data;
        this.$nextTick(() => {
          if (this.select.length) {
            let thisPageIds = [];
            let rowIndex;
            console.log(thisPageIds);
            console.log(this.select);
            res.data.map(item => thisPageIds.push(item.id || item.roomId));
            this.select.map(id => {
              rowIndex = thisPageIds.indexOf(id);
              if (rowIndex > -1) {
                this.$refs.multipleTable.toggleRowSelection(this.tableData[rowIndex]); // 选中数据
              }
            });
          }
        });
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected (isOnly) {
        let len = this.selectData.length;
        let flag = true;
        if (len == 0) {
          this.showMess('请选择房间！');
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess('只能选择一个房间!');
          flag = false;
        }
        return flag;
      },
      /**************** 按钮交互 ***************/
      // 取消
      cancel () {
        this.$emit('cancel', 'selectRoom');
      },
      // 确定
      selectRoom () {
        if (this.isSelected(this.selectOne)) {
          this.$emit('select', this.selectData);
        }
      },
      search () {
        this.setTableData();
//        let arr = [];
//        (this.allData || []).map(item => {
//          if (this.roomNum !== '') {
//            if (~item.roomNum.indexOf(this.roomNum)) {
//              this.roomType ? (item.roomType === this.roomType ? arr.push(item) : '') : arr.push(item);
//            }
//          } else {
//            this.roomType ? ((item.roomType === this.roomType) ? arr.push(item) : '') : arr.push(item);
//          }
//        });
//        this.tableData = arr;
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
