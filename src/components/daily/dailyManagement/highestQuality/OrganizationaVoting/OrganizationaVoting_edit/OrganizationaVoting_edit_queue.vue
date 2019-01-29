<!--组织投票-->
<!-- 列表-->
<template>
  <div id="nosocomial" ref="nosocomial" class="modal">
    <el-row>
      <el-form :inline="true" ref="formValidate" label-width="100px" class="demo-ruleForm">
        <el-col align="right">
          <el-form-item prop="title">
            <el-input v-model="formValidate.userName" placeholder="输入姓名搜索">
              <el-button @click="searchEvent" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div id="nosocomialTable" ref="nosocomialTable">
      <el-table align="center" :height="300" :context="self" :data="tableData" tooltip-effect="dark" ref="multipleTable"
                style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="序号" type="index" width="70">
        </el-table-column>
        <el-table-column prop="userName" label="姓名" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="grade" label="年级" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="group" label="班级" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['selectProjectId', 'sellOneself'],
    data() {
      return {
        //查询表单
        sellOneselfIds: this.sellOneself,
        formValidate: {
          appraisingId: '', //评优项目id
          userName: '', //姓名
          grade: '', //年级
          group: '', //班级
        },
        //获取的列表数据
        tableData: [
          //          {
          //            "id": "",
          //            "userId": "",
          //            "userName": "",
          //            "grade": "",
          //            "group": "",
          //            "appraisingId": "",
          //            "title": "",
          //            "examineStatus": ""
          //          }
        ],
        searchData: {
          title: '提交',
          callParEvent: 'searchEvent'
        },

        /*--按钮button--*/
        showId: {
          id: 'auditId',
          title: '查看'
        },

        operailityData: '',
        multipleSelection: '',
        dynamicHt: 100,
        self: this,
        loading: false,
        listTotal: 0,
      }
    },
    methods: {

      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;
        //        this.queryQptions = {
        //         curPage: 1,pageSize: Util.pageInitPrams.pageSize
        //        }

        this.setTableData();
      },

      //设置表格及分页的位置
      setTableDynHeight() {
        let nosocomial = this.$refs.nosocomial;
        let parHt = nosocomial.parentNode.offsetHeight;
        let nosocomialTable = this.$refs.nosocomialTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - nosocomialTable.offsetTop - paginationHt;
      },

      setTableData(isLoadingFun) {
        let that = this;
        //处理服务数据
        this.formValidate.appraisingId = this.selectProjectId;
        let myPromise = Util.queryData({
          url: 'appraising/sellOneself/select/list',
          params: this.formValidate
        })();
        myPromise.then(function (res) {
          let responseData = res.data;
          if (_.isObject(responseData["status"]) && responseData["status"]["code"] == 0) {
            that.tableData = responseData.data;
            if (that.sellOneselfIds) {
              setTimeout(function () { //表格渲染完之后再选择
                that.currSelect(that.filtrate(that.tableData, that.sellOneselfIds)); //根据id数组选出初始被选择的数据，并使表格选中

              }, 0)
            }

          } else {
            that.errorMess('获取数据失败');
            that.$refs.multipleTable.clearSelection(); //获取数据失败的时候清空table选中状态

          }
        }).catch(function (response) {
          that.$refs.multipleTable.clearSelection(); //获取数据失败的时候清空table选中状态
          if (response instanceof Error) {
            // 意外发生在设置要求引发一个错误
            that.errorMess(response.message);
          } else {
            that.errorMess(response.status + "错误!");
          }
        })
      },

      /*
       * 筛选选中的数据
       *
       * */

      filtrate(data, ids) {
        if (!data || !ids) return;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
          if (~ids.indexOf(data[i].userId)) {
            arr.push(data[i])
          }
        }
        return arr;
      },
      /*
       * 设置默认选中的表格
       * */
      currSelect(rows) {
        let that = this;
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        }
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected(isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess("请选择数据!");
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },


      //搜索监听回调
      searchEvent(isLoading) {
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate');
        if (isSubmit) {
          this.setTableData()
        }
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name) {
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


      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(index) {
        this.operailityData = this.tableData[index].id;
        this.showModal = true;
      },


      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer) {
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
      subCallback(target, title, updata) {
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
      openModel(options) {
        this[options + 'Modal'] = true;
      },
    },
    created() {
      this.init();
    },

    mounted() {

      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })


    },
    watch: {
      selectProjectId(val, old) {
        this.$refs.multipleTable.clearSelection();
        this.multipleSelection = '';
        this.sellOneselfIds = '';
        this.setTableData()
      },
      multipleSelection(val, old) {

        this.$emit('recommendPerson', val)
      }
    }
  }

</script>

