<!-- 考核学生签到 -->
<template>
  <div>
    <el-form :model="loginValidate" ref="loginValidate" :rules="login" label-width="100px" class="demo-ruleForm" style="margin-bottom: 30px">
      <p ref="spara" id="spara" style="display: none;">&nbsp;</p>
      <OBJECT classid="clsid:10946843-7507-44FE-ACE8-2B3483D179B7" ref="CVR_IDCard" id="CVR_IDCard" name="CVR_IDCard" width="0"
        height="0">
      </OBJECT>
      <el-row>
        <el-col :span="15" :offset="1">
          <el-row>
            <el-col :span="12">
              <el-form-item label="学生姓名" prop="userName">
                <el-input v-model="loginValidate.userName" :maxlength="10"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="身份证号" prop="idCard">
                <el-input v-model="loginValidate.idCard" :maxlength="18"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="text-align: center">
              <div style="height: 50px"></div>
              <el-button type="info" @click="isResult">读卡</el-button>
              <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
              <el-button type="warning" @click="reset">重置</el-button>
              <el-button type="info" @click="derive">导出</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="5" :offset="1">
          <img :src="loginValidate.pic" alt="" style="width: 150px;height: 150px;">
        </el-col>
      </el-row>
    </el-form>
    <hr>
    </br>
    <el-row ref="content">
      <el-col :span="22" :offset="1">
        <div style="overflow:hidden;padding-bottom:20px;">
          <div class="listUpArea-search">
            <div class="listUpArea-searchWrapper">
              <!--右侧查询-->
              <el-form ref="formValidate" :inline="true" :model="formValidate" class="form-inline lose-margin" label-width="60px">
                <div class="listUpArea-searchLeft">
                  <input class="hidden">
                  <el-input placeholder="请输入内容" v-model="formValidate.userName">
                    <div slot="prepend">姓名</div>
                    <el-button slot="append" @click="handleSubmit('formValidate')" icon="search"></el-button>
                  </el-input>
                </div>
                <div class="listUpArea-moreSearch">
                  <el-button @click="showMoreSearch" type="text">高级查询</el-button>
                </div>
              </el-form>
            </div>
          </div>
        </div>
        <div v-if="isShowMoreSearch" class="listUpArea-moreSearchBox" style="height:auto;">
          <el-form :model="formValidate" ref="formValidate" :inline="true">
            <el-form-item label="考生姓名" prop="userName">
              <el-input v-model="formValidate.userName" :maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="考号" prop="userNum">
              <el-input v-model="formValidate.userNum" :maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="formValidate.idCard" :maxlength="18"></el-input>
            </el-form-item>
            <el-button @click="handleSubmit('formValidate')">查询</el-button>
          </el-form>
        </div>
        <el-table ref="myTable" :max-height="300" :data="tableData" style="width: 100%;">
          <!--<el-table-column
              type="selection"
              width="55">
            </el-table-column>-->
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>


          <el-table-column prop="userName" label="姓名">
          </el-table-column>
          <el-table-column prop="userSex" label="性别" width="80">
            <template scope="scope">
              {{ scope.row.userSex | typeText}}
            </template>
          </el-table-column>
          <el-table-column prop="idCard" label="身份证号" width="200">
          </el-table-column>
          <el-table-column prop="userNum" label="准考证号" width="200">
          </el-table-column>

          <el-table-column prop="isSign" label="是否签到">
            <template scope="scope">
              {{(scope.row.isSign || '0') | typeText}}
            </template>
          </el-table-column>
        </el-table>
        </br>
        <div style="float: right;">
          <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
            :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    </br>
    <p class="buttonBox" style="text-align: center">
      <el-button type="info" @click="$emit('cancel','planLogin')">确定</el-button>
    </p>

    <!--导出到excel弹窗-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="deriveModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="500">
      <modal-header slot="header" :content="button.deriveExcelId"></modal-header>
      <derive v-if="deriveModal"  messTitle="确认导出场次参考人员签到列表吗？" :url="importExcelUrl" @cancel="deriveModal=false"></derive>
      <div slot="footer"></div>
    </Modal>
  </div>

</template>

<script>
  import {
    login
  } from '../rules';
  import url from '../api';
  let Util;
  export default {
    props: ['sceneId'],

    data() {
      return {
        importExcelUrl:'/api/'+url.importExcel.path+this.sceneId.id,//导出人员url
        login: login,
        loadBtn: {
          loading: false,
          title: '签到',
          callParEvent: 'listenSubEvent'
        },
        loginValidate: {
          id: this.sceneId.id, //场次id
          userName: '', //姓名
          idCard: '', //身份证号
          pic: '',
        },

        formValidate: {
          id: this.sceneId.id, //场次id
          userName: '', //考生姓名
          userNum: '', //考生编号
          idCard: '', //身份证号
          sortby: '', //排序字段
        },
        listTotal: 0,
        //当前组件提交数据时,ajax处理的 基础信息设置
        addMessTitle: {
          ajaxSuccess: 'loginSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: url.userSign.path,
            method: 'post',
            data: {}
          }
        },

        tableData: [],

        //初始化加载页面信息
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: url.signList.path,
            params: {}
          }
        },
        button:{
          deriveExcelId:{
            id: 'deriveExcelId',
            title: '导出'
          }
        },
        deriveModal:false,
        pgph: '',
        obj: '',
        CVR_IDCard: '',
        timeOut: '',
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
      //初始化
      this.init();
    },
    beforeDestroy() {
      clearInterval(this.timeOut);
    },
    methods: {
      reset() {
        clearInterval(this.timeOut);
        this.loginValidate.userName = '';
        this.loginValidate.idCard = '';
        this.loginValidate.pic = '';
        //        this.timeOut = setInterval(this.isResult, 100);
      },
      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name) {
        this.setTableData();
      },
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;
        this.queryQptions = {
          //url:this.listUrl,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }
        this.setTableData();
      },

      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      //通过get请求列表数据并渲染表格数据
      updateListData(responseData) {
        let data = responseData.data;
        this.tableData = [];
        data = this.addIndex(data);
        this.tableData = data;
        this.listTotal = responseData.totalCount || 0;
      },

      //初始化加载列表数据
      setTableData() {
        let listMessTitle = Util._.defaultsDeep({}, this.listMessTitle);
        listMessTitle.ajaxParams.url = url.signList.path + this.sceneId.id;
        listMessTitle.ajaxParams.params = Object.assign(listMessTitle.ajaxParams.params, this.formValidate, this.queryQptions
          .params);
        this.ajax(listMessTitle)
      },

      loginSuccess(res) {
        clearInterval(this.timeOut);
        this.successMess('签到成功');
        this.setTableData();
        let that = this;
        this.loginValidate.userName = '';
        this.loginValidate.idCard = '';
        this.loginValidate.pic = '';
        //        this.timeOut = setInterval(that.isResult, 100);
      },
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("loginValidate");
        if (!isSubmit) return;
        if (this.loginValidate.userName == '' || this.loginValidate.idCard == '') {
          this.showMess('请刷身份证')
        }
        isLoadingFun(true);
        this.addMessTitle.ajaxParams.data = this.loginValidate;
        this.ajax(this.addMessTitle, isLoadingFun)
      },

      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },

      //准备读取
      isResult() {
        try {
          this.CVR_IDCard = document.getElementById("CVR_IDCard");
          let strReadResult = "";
          try {
            strReadResult = this.CVR_IDCard.ReadCard();
          } catch (e) {
            strReadResult = this.obj.ReadCard();
            this.CVR_IDCard = this.obj;
          }
          if (strReadResult == "0") {
            clearInterval(this.timeOut);
            this.setFormData();
          }
        } catch (xe) {}
      },

      setFormData() {
        let CVR_IDCard = this.CVR_IDCard;
        let obj = this.obj;
        this.loginValidate.userName = CVR_IDCard.Name;
        this.loginValidate.idCard = CVR_IDCard.CardNo;
        this.loginValidate['pic'] = "data:image/bmp;base64," + CVR_IDCard.picture;
        if (this.loginValidate['pic'] == undefined) {
          this.loginValidate['pic'] = 'data:image/jpeg;base64,' + obj.PotoBase64;
        }
      },


      //导出
      derive(){
        this.deriveModal = true;
      },
    },
    mounted() {

      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);


        let pgph = this.pgph = this.$refs.spara;
        let obj = this.obj = document.createElement("object");
        try {
          obj.type = "application/win32-npCardRead";
          obj.width = 0;
          obj.height = 0;
          insertAfter(obj, pgph);
          obj.OnJsFunc = objJSfunc;
        } catch (ww) {}

        function objJSfunc() {

        }

        function insertAfter(newEl, targetEl) {
          let parentEl = targetEl.parentNode;
          if (parentEl.lastChild == targetEl) {
            parentEl.appendChild(newEl);
          } else {
            parentEl.insertBefore(newEl, targetEl.nextSibling);
          }
        }
        let that = this;
        clearInterval(this.timeOut);
        //        this.timeOut = setInterval(this.isResult, 100)
      })
    },

  }

</script>

<style>


</style>
