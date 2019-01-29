<!--填写基本信息-->
<!--选择评价表-->

<template>
  <div id="content" ref="content">
    <!--表格数据-->
    <el-row>
      <el-col :span="24">
        <el-form ref="formValidate" inline label-width="80px" inline class="demo-ruleForm">
          <el-form-item label="开始时间" prop="activityBeginTime">
            <el-date-picker
              v-model="formValidate.examTimeBegin"
              type="date"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions0"
              @change="handleStartTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="activityEndTime">
            <el-date-picker
              v-model="formValidate.examTimeEnd"
              align="right"
              type="date"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions1"
              @change="handleEndTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="title" label="科室:">
            <el-select v-model="formValidate.depId" placeholder="请选择科室">
              <select-option :type="'byUserType'"></select-option>
            </el-select>
          </el-form-item>
          <el-button @click="searchEvent" icon="search"></el-button>
        </el-form>
      </el-col>

    </el-row>
    <div
      id="myTable"
      ref="myTable">
      <el-radio-group style="display: block" v-model="tempRadio" @change="radioChange">
        <el-table
          :height="400"
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">

          <el-table-column
            align="center"
            width="65">
            <template scope="scope">
              <el-radio :label="scope.row.id"> {{' ' }} </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="65">
          </el-table-column>
          <el-table-column
            label="试卷名称"
            prop="paperName">
          </el-table-column>
          <el-table-column
            prop="depName"
            label="科室名称 "
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="examTime"
            label="考试时间 "
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="markType"
            label="成绩类型 "
            show-overflow-tooltip>
            <template scope="scope">{{scope.row.markType | markType}}</template>
          </el-table-column>
          <el-table-column
            prop="mark"
            label="成绩"
            width="120">
            <!--<template scope="scope">-->
            <!--{{scope.row.mark / 100}}-->
            <!--</template>-->
          </el-table-column>
        </el-table>
      </el-radio-group>
    </div>
    <el-row>
      <el-col :span="10" :offset="11">
        <el-button @click="baseInfo">确定</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<style>
</style>
<script>
  /*当前组件必要引入*/
  //引入--新建教学活动--组件
  let Util = null;
  export default {
    props: ['url', 'tempId', 'outDepId', 'userId'],
    data() {
      return {
        //查询项
        tempRadio: this.tempId,
        publishModal: false, //评价
        /*--按钮button--*/
        publishId: {id: 'publishId', title: '发布'},
        //请求的列表数据
        formValidate: {
          depId: '',
          userId: this.userId,
          examTimeBegin: '',
          examTimeEnd: '',
        },
        tempData: '',
        //表格数据
        loading: false,
        tableData: [],
        operailityData: '',
        multipleSelection: [],
        /*--按钮button--*/
        addId: {id: 'add', title: '添加'},
        editId: {id: 'edit', title: '修改'},
        viewId: {id: 'view', title: '查看'},
        removeId: {id: 'remove', title: '删除'},
        totalCount: 0,

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateList',
          ajaxParams: {
            url: this.url.queryList.path,
            params: {},
          }
        },

      }
    },
    created() {
      this.init();
      this.setTableData()
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;
        this.queryQptions = {
          curPage: 1, pageSize: Util.pageInitPrams.pageSize
        }

      },


      //搜索监听回调
      searchEvent(isLoading) {
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
      /*
       * 更新列表数据
       * @param JSON 后台返回的data
       */
      updateList(responseData) {
        let data = responseData.data;
        if (!data) return;
        this.tableData = data;
        this.totalCount = responseData.totalCount || 0;
        if (this.tempRadio) this.radioChange(this.tempRadio);
      },
      setTableData() {
        let formValidate = this.getFormData(this.formValidate);
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, formValidate);
        this.ajax(this.listMessTitle);
      },


      /*--点击--查看--按钮--*/
      show(data) {
        this.operailityData = data;
        this.openModel('show');

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

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        myData = this.formDate(myData, ['examTimeBegin', 'examTimeEnd'], 'yyyy-MM-dd');
        return myData;
      },

      baseInfo() {//提交之前先保存分数
        if (!this.tempData) {
          this.errorMess('请选择一条数据');
          return;
        }
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        let addMarkMessTitle = {
          ajaxSuccess: (res) => {
            this.$emit('exam', this.tempData);
          },
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: this.url.modifyMarkByOutDepId.path + this.outDepId,
            method: this.url.modifyMarkByOutDepId.method,
            data: {
              mark: this.tempData.mark + '',
              historyMarkId: this.tempData.id,
            }
          }
        }

        this.ajax(addMarkMessTitle)
      },

      radioChange(id) {
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].id == id) {
            this.tempData = this.tableData[i]
          }
        }
      },

    },
    mounted() {
    },
    components: {}
  };
</script>

