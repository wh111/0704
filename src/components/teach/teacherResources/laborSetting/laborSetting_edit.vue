<template>

  <div class="addLabor">
    <el-form :model="formValidate" ref="formValidate" class="demo-form-inline" label-width="0" >

      <el-table
        align="center"
        border
        :data="tableData"
        tooltip-effect="dark"
        highlight-current-row>
        <el-table-column label="操作" align="center" width="140px">
          <template scope="scope">
            <div style="float: right">
              <el-button size="small" type="success" @click="addRow()" v-if="scope.$index == tableData.length - 1">添加</el-button>
              <el-button size="small" type="danger" @click="delRow(scope.$index)" v-if="tableData.length > 1">删除</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="teachLevel"
          label="职称"
          width="120">
          <template scope="scope">
            <el-form-item prop="teachLevel">
              <el-select v-model="scope.row.teachLevel" placeholder="请选择">
                <el-option
                  v-for="item in teachLevelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="课程类型"
          width="120">
          <template scope="scope">
            <el-form-item prop="type">
              <el-select v-model="scope.row.type" placeholder="请选择">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label="优"
          align="center"
        >
          <el-table-column
            prop="excellent"
            label="评分"
            width="150"
            align="center"
          >
            <template scope="scope">
              <el-row>
                <el-col :span="10">
                  <el-form-item prop="excellent">
                    <el-input style="width: 100%;" v-model="scope.row.excellent"  placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  -
                </el-col>
                <el-col :span="10">
                  <el-form-item prop="excellent">
                    <el-input style="width: 100%;" v-model="scope.row.maxMark"  placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="excellentFee"
            label="课时费"
            width="95"
            align="center"
          >
            <template scope="scope">
              <el-form-item prop="name">
                <el-input style="width: 100%;" v-model="scope.row.excellentFee"  placeholder="请输入内容"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          label="良"
          align="center"
        >
          <el-table-column
            prop="good"
            label="评分"
            align="center"
            width="150"
          >
            <template scope="scope">
              <el-row>
                <el-col :span="10">
                  <el-form-item prop="good">
                    <el-input style="width: 100%;" v-model="scope.row.good"  placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  -
                </el-col>
                <el-col :span="10">
                  <el-form-item prop="good">
                    <el-input style="width: 100%;" v-model="scope.row.excellent"  placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="goodFee"
            label="课时费"
            align="center"
          >
            <template scope="scope">
              <el-form-item prop="name">
                <el-input style="width: 100%;" v-model="scope.row.goodFee"  placeholder="请输入内容"></el-input>
              </el-form-item>
            </template>
          </el-table-column>

        </el-table-column>
        <el-table-column
          label="中"
          align="center"
        >
          <el-table-column
            prop="avg"
            label="评分"
            align="center"
            width="150"
          >
            <template scope="scope">
              <el-row>
                <el-col :span="10">
                  <el-form-item prop="avg">
                    <el-input style="width: 100%;" v-model="scope.row.avg"  placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  -
                </el-col>
                <el-col :span="10">
                  <el-form-item prop="avg">
                    <el-input style="width: 100%;" v-model="scope.row.good"  placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="avgFee"
            label="课时费"
            align="center"
            width="95"
          >
            <template scope="scope">
              <el-form-item prop="name">
                <el-input style="width: 100%;" v-model="scope.row.avgFee"  placeholder="请输入内容"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          label="差"
          align="center"
        >
          <el-table-column
            prop="bad"
            label="评分"
            align="center"
            width="150"
          >
            <template scope="scope">
              <el-row>
                <el-col :span="10">
                  <el-form-item prop="bad">
                    <el-input style="width: 100%;" v-model="scope.row.bad"  placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  -
                </el-col>
                <el-col :span="10">
                  <el-form-item prop="bad">
                    <el-input style="width: 100%;" v-model="scope.row.avg"  placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="badFee"
            label="课时费"
            align="center"
            width="95"
          >
            <template scope="scope">
              <el-form-item prop="name">
                <el-input style="width: 100%;" v-model="scope.row.badFee"  placeholder="请输入内容"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-form>
    <br />
    <el-row >
      <el-col :span="24" style="text-align: center;">
        <div style="margin-left: 100px">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button  @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row >
  </div>
</template>
<style>
  .addLabor .el-form-item{margin-bottom: 0}
</style>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        countDate:0,
        //form表单bind数据
        formValidate: {
          "teachLevel":"",
          "type":"",
          "excellent":90,
          "good":80,
          "avg":60,
          "bad":0,
          "excellentFee":100,
          "goodFee":80,
          "avgFee":70,
          "badFee":60,
          "maxMark":100,
        },
        teachLevelOptions:[{value:0,label:"正高"},{value:1,label:"正中"}],
        typeOptions:[{value:0,label:"理论"},{value:1,label:"见习"},{value:2,label:"PBL"}],


        dataTemplate:{
          "teachLevel":"",
          "type":"",
          "excellent":90,
          "good":80,
          "avg":60,
          "bad":0,
          "excellentFee":100,
          "goodFee":80,
          "avgFee":70,
          "badFee":60,
          "maxMark":100,
        },
        tableData: [
          {
            "id":8,
            "teachLevel":0,
            "type":1,
            "excellent":90,
            "good":80,
            "avg":60,
            "bad":0,
            "excellentFee":100,
            "goodFee":80,
            "avgFee":70,
            "badFee":60,
            "maxMark":100,
          },
          {
            "id":2,
            "teachLevel":0,
            "type":1,
            "excellent":90,
            "good":80,
            "avg":60,
            "bad":20,
            "excellentFee":100,
            "goodFee":80,
            "avgFee":70,
            "badFee":0,
            "maxMark":100,
          }
        ],
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功',
          errorTitle:'修改失败',
          ajaxSuccess:'ajaxSuccess',
          ajaxParams:{
            url:'/service-fee/modify/'+this.operailityData.id,
            method:'put',
            "jsonString":true
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'/service-fee/get/'+this.operailityData.id,
          }
        }
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化
      //this.init();
    },
    methods:{


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true)
          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.editMessTitle, isLoadingFun)
        }
      },


      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag= true;
          }
        });
        return flag;
      },


      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        this.tableData = data;
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','edit');
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        myData.type = data.type.join(",");
        return myData;
      },


      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
    }
  }
</script>
