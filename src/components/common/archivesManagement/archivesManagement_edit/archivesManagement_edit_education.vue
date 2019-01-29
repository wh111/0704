<!--档案管理修改-->
<!--学历信息-->

<template>

  <div>
    <!--标题-->
    <el-row>
      <el-col :span="24" class="lose-margin2" style="text-align: center">
        <span class="table-headline ">学历信息</span>
      </el-col>
    </el-row>
    <!--内容-->
    <el-form ref="formValidate" label-width="100px" class="demo-ruleForm archivesEdit">
      <el-row>
        <el-col :span="24">
          <el-table
            align="center"
            :data="tableData"
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column
              prop="date"
              label="毕业时间"
              width="140"
            >
              <template scope="scope">
                <el-form-item prop="date1">
                  <el-date-picker type="month" :editable="false" style="width: 100%;" v-model="scope.row.date"
                                  placeholder="选择日期"></el-date-picker>
                </el-form-item>
              </template>

            </el-table-column>
            <el-table-column
              prop="school"
              label="毕业学校"
            >
              <template scope="scope">
                <el-form-item prop="school">
                  <el-input style="width: 100%;" v-model="scope.row.school" placeholder="请输入内容"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="specialty"
              label="毕业专业"
            >
              <template scope="scope">
                <el-form-item prop="specialty">
                  <el-input style="width: 100%;" v-model="scope.row.specialty" placeholder="请输入内容"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="diplomaNo"
              label="学历证书编号">
              <template scope="scope">
                <el-form-item prop="specialty">
                  <el-input style="width: 100%;" v-model="scope.row.diplomaNo" placeholder="请输入内容"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="degree"
              label="学位">
              <template scope="scope">
                <el-form-item prop="type">
                  <el-input style="width: 100%;" v-model="scope.row.degree" placeholder="请输入内容"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="degreeType"
              label="学位类型">
              <template scope="scope">
                <el-form-item prop="degreeType">
                  <el-input style="width: 100%;" v-model="scope.row.degreeType" placeholder="请输入内容"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="degreeNo"
              label="学位证书编号">
              <template scope="scope">
                <el-form-item prop="degreeNo">
                  <el-input style="width: 100%;" v-model="scope.row.degreeNo" placeholder="请输入内容"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140px" align="left">
              <template scope="scope">
                <el-button size="small" type="danger" @click="delRow(scope.$index)" v-if="tableData.length > 1">删除
                </el-button>
                <el-button size="small" type="success" @click="addRow()" v-if="scope.$index == tableData.length - 1">
                  添加
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
//    props: ['dataId', 'initData'],
    props: ['dataId'],
    data() {
      return {
        tableData: [],
        dataTemplate: {
          "date": "",
          "school": "",
          "specialty": "",
          "diplomaNo": "",
          "degree": "",
          "degreeType": "",
          "degreeNo": ""
        },

        loadBtn: {title: '上报审核', callParEvent: 'listenSubEvent'},
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'saveSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: '/archives/save/edu/' + this.dataId,
            method: 'post',
            jsonString: 'jsonString',
            data: {}
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        initMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: '/archives/list/edu/' + this.dataId
          }
        }
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
      //初始化
      this.init();
    },
    mounted() {

    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据
//        this.SuccessGetCurrData();
        this.ajax(this.initMessTitle)
      },

      //设置tableData默认值
      setTableDatTemplate() {
        let dataTemplate = Util._.defaultsDeep({}, this.dataTemplate);
        this.tableData.push(dataTemplate);
        this.tableData[this.tableData.length - 1].index = this.tableData.length - 1;
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      saveCurrData(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true)
          this.editMessTitle.ajaxParams.data = this.formDate(this.getFormData(this.tableData), ['date'], this.yearMonth);
//          this.$emit("setSaveData", this.editMessTitle.ajaxParams.data);
          this.ajax(this.editMessTitle, isLoadingFun)
        }
      },



      saveDataToParent() {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          this.editMessTitle.ajaxParams.data = this.formDate(this.getFormData(this.tableData), ['date'], this.yearMonth);
          this.$emit("setSaveData", this.editMessTitle.ajaxParams.data);
        }
      },


      listenSubEvent() {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          this.$emit("subAuditArchives", this.editMessTitle.ajaxParams.data);
        }
      },


      //保存成功后回调
      saveSuccess() {
        this.$emit("save",'education');
      },


      /*
      * 点击添加按钮触发
      * */
      addRow() {
        this.setTableDatTemplate();
      },
      // 删除
      delRow(index) {
        this.tableData.length && this.tableData.splice(index, 1)
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


      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData) {
//        let data = this.initData;//responseData.data;
        let data = responseData.data;//responseData.data;
        this.tableData = this.formDate(data, ['date'], this.yearMonth);
        this.setTableDatTemplate();
      },

      //列表页添加序号 arr=>arr  依赖:页数,页条数
      addIndex(data) {
        let arr = []
        for (let i = 0, length = data.length; i < length; i++) {
          data[i].index = i
          arr.push(data[i])
        }
        return arr
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'edit');
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep([], data);
        let tempArr = [];
        let valValue = ["date", "school", "specialty", "diplomaNo", "degree", "degreeType", "degreeNo"]
        for (var i = 0; i < myData.length; i++) {
          if (!this.objValIsEmpty(myData[i], valValue)) {
            tempArr.push(myData[i]);
          }
        }
        return tempArr;
      },


    }
  }
</script>


