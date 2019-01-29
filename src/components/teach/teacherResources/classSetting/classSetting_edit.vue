<template>

  <div class="showWrapper">
    <el-form class="demo-form-inline  archivesEdit lose-margin2">

      <el-row>
        <el-col :span="24">

          <!--表格数据-->
          <el-table border align="center" :data="tableData" height="400" tooltip-effect="dark" highlight-current-row style="width: 100%;height: 100%">
            <el-table-column prop="name" label="职称" width="170" align="center">
              <template scope="scope">
                <el-form-item>
                  <el-select placeholder="请选择职称" v-model="scope.row.teachLevel">
                    <!--<el-option v-for="(item,index) in teachLevelOptions" :key="index" :label="item.label" :value="item.value"></el-option>-->
                    <selectOption type="getByCode" :isCode="true" :unAll="true" id="value" codeType="PROFESSIONAL_TITLE_OF_TEACHERS"> </selectOption>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="identify" width="170" label="课程类型" align="center">
              <template scope="scope">
                <el-form-item>
                  <el-select placeholder="请选择课程类型" v-model="scope.row.type">
                    <!--<el-option v-for="(item,index) in typeOptions" :key="index" :label="item.label" :value="item.value"></el-option>-->
                    <selectOption type="getByCode" :isCode="true" :unAll="true" id="value" codeType="TEACH_COURSE_TYPE"> </selectOption>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="remark" align="center" label="优">
              <el-table-column prop="type" width="120" label="评分" align="center">
                <template scope="scope">
                  <el-input class="input-x" v-model="scope.row.excellent"></el-input> -
                  <el-input class="input-x" v-model="scope.row.excellentMax"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="type" width="120" label="课时费" align="center">
                <template scope="scope">
                  <!--<el-input class="input-x"></el-input> - -->
                  <el-input v-model="scope.row.excellentFee"></el-input>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column prop="remark" label="良" align="center">
              <el-table-column prop="type" width="120" label="评分" align="center">
                <template scope="scope">
                  <el-input class="input-x" v-model="scope.row.good"></el-input> -
                  <el-input class="input-x" v-model="scope.row.goodMax"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="type" width="120" label="课时费" align="center">
                <template scope="scope">
                  <!--<el-input class="input-x"></el-input> - -->
                  <el-input v-model="scope.row.goodFee"></el-input>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column prop="remark" label="中" align="center">
              <el-table-column prop="type" width="120" label="评分" align="center">
                <template scope="scope">
                  <el-input class="input-x" v-model="scope.row.avg"></el-input> -
                  <el-input class="input-x" v-model="scope.row.avgMax"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="type" width="120" label="课时费" align="center">
                <template scope="scope">
                  <!--<el-input class="input-x" ></el-input> - -->
                  <el-input v-model="scope.row.avgFee"></el-input>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column prop="remark" label="差" align="center">
              <el-table-column prop="type" width="120" label="评分" align="center">
                <template scope="scope">
                  <el-input class="input-x" v-model="scope.row.bad"></el-input> -
                  <el-input class="input-x" v-model="scope.row.badMax"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="type" width="120" label="课时费" align="center">
                <template scope="scope">
                  <!--<el-input class="input-x"></el-input> - -->
                  <el-input v-model="scope.row.badFee"></el-input>
                </template>
              </el-table-column>
            </el-table-column>
            <!--<el-table-column prop="identify" width="90" label="操作" align="center">-->
              <!--<template scope="scope">-->
                <!--<el-button type="danger" size="small" @click="removeRow(scope.$index)">删除</el-button>-->
              <!--</template>-->
            <!--</el-table-column>-->
          </el-table>
        </el-col>
      </el-row>

    </el-form>
    <!--<el-button type="primary" icon="plus" @click="addRow"></el-button>-->
    <el-row>
      <el-col :span="24" style="text-align: center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data() {
      return {
        teachLevelOptions: [{
          value: '正高',
          label: "正高"
        }, {
          value: '副高',
          label: "副高"
        }, {
          value: '初级',
          label: "初级"
        }],
        typeOptions: [{
          value: '理论课',
          label: "理论课"
        }, {
          value: '见习课',
          label: "见习课"
        }, {
          value: 'PBL',
          label: "PBL"
        }, {
          value: 'CBL',
          label: "CBL"
        }],
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        countDate: 0,

        tableData: [],
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功',
          errorTitle: '修改失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            jsonString: true,
            url: api.modify.path + this.operailityData.id,
            method: api.modify.method,
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
          }
        }
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //初始化
      this.init();
    },
    methods: {
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        //        let isSubmit = this.submitForm("formValidate");
        if (!this.validate()) return; //验证是否通过
        if (true) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
          this.editMessTitle.ajaxParams.data = this.getFormData(this.tableData[0]);
          this.ajax(this.editMessTitle, isLoadingFun)
        }
      },

      //验证
      validate() {
        let validate = {
          teachLevel: [{validate: this.require, message: "职称必填"}],
          type: [{validate: this.require, message: "课程类型必填"}],
          excellent: [{validate: this.integer, message: "优最低分分数"}, {validate: this.inputLen(0, 6), message: "优最低分分数"}],
          excellentMax: [{validate: this.integer, message: "优最高分分数"}, {
            validate: this.inputLen(0, 6),
            message: "优最高分分数"
          }],
          excellentFee: [{validate: this.integer, message: "优课时费"}, {validate: this.inputLen(0, 6), message: "优课时费"}],
          good: [{validate: this.integer, message: "良最低分分数"}, {validate: this.inputLen(0, 6), message: "良最低分分数"}],
          goodMax: [{validate: this.integer, message: "良最高分分数"}, {validate: this.inputLen(0, 6), message: "良最高分分数"}],
          goodFee: [{validate: this.integer, message: "良课时费"}, {validate: this.inputLen(0, 6), message: "良课时费"}],
          avg: [{validate: this.integer, message: "中最低分分数"}, {validate: this.inputLen(0, 6), message: "中最低分分数"}],
          avgMax: [{validate: this.integer, message: "中最高分分数"}, {validate: this.inputLen(0, 6), message: "中最高分分数"}],
          avgFee: [{validate: this.integer, message: "中课时费"}, {validate: this.inputLen(0, 6), message: "中课时费"}],
          bad: [{validate: this.integer, message: "差最低分分数"}, {validate: this.inputLen(0, 6), message: "差最低分分数"}],
          badMax: [{validate: this.integer, message: "差最高分分数"}, {validate: this.inputLen(0, 6), message: "差最高分分数"}],
          badFee: [{validate: this.integer, message: "差课时费"}, {validate: this.inputLen(0, 6), message: "差课时费"}],
        }

        let tableData = this.tableData;
        let flag = true;
        for (let i = 0; i < tableData.length; i++) {
          let item = tableData[i]; //一行数据
          for (let key in item) { //获取对象的每一项数据
            if (!validate[key]) continue; //没有进行验证则下一项
            for (let l = 0; l < validate[key].length; l++) {
              let valid = validate[key][l]; //每一项验证
              if (!flag) return;
              valid.validate(item[key], (mes) => {
                if(mes) {
                  this.errorMess(mes);
                  flag = false;
                }
              }, `第${i + 1}行：${valid.message}`); //进项验证
            }
          }
        }
        if (!flag) return;
        return true;
      },

      //必填
      require(value, callback, message) {
        if (value !== '' && value != null) {
          callback()
        } else {
          callback(message)
        }
      },

      inputLen: (min, max) => {
        // 长度检测
        return (value = '', callback, message) => {
          let msg;
          if (value === null || value === undefined) value = '';
          if (min === 0 && max && value.length > max) {
            msg = `最多输入${max}个字符`;
          } else {
            if (max && (value.length > max || value.length < min)) {
              msg = '只能输入' + (min === max ? min : `${min}-${max}`) + '个字符'
            }
            if (value.length < min) {
              msg = `最少输入${min}个字符`;
            }
          }
          msg && callback(message + msg);
          callback();
        }
      },
      //整数验证
      integer: function (value, callback, message) {
        if (value == '' || value == null) {
          callback();
          return;
        }
        //检验位的检测
        if (!/^\+?[1-9]\d*$/.test(value)) {
          callback(message + '必须正整数且大于零');
        }
        callback();
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
        this.tableData = [responseData.data] || [];
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
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      /*
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },



      //table删除操作
      removeRow(index) {
        if (this.tableData.length == 1) return;
        this.tableData.splice(index, 1)
      },

      addRow() {
        this.tableData.push({
          "teachLevel": "",
          "type": "",
          "excellent": '',
          "good": '',
          "avg": '',
          "bad": '',
          "excellentMax": '',
          "goodMax": '',
          "avgMax": '',
          "badMax": '',
          "excellentFee": '',
          "goodFee": '',
          "avgFee": '',
          "badFee": ''
        })
      },
    }
  }

</script>
