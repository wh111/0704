<template>

  <div>
    <el-form :model="formValidate" ref="formValidate"  class="demo-form-inline" label-width="90px" >
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="复试专业:" prop="name" >
            <el-select filterable  v-model="formValidate.userType" placeholder="请选择">
              <select-option :url="' '" :unAll="true"></select-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="22" :offset="1">
          <el-table
            align="center"
            maxheight="400"
            :data="tableData"
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%;height: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              align="center"
              label="序号"
              prop="index"
              width="75">
              <template scope="scope">
                <span>{{scope.row.index}}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="name"
              label="学号">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="name"
              label="姓名"
              width="200">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="name"
              width="75"
              label="性别">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="name"
              label="电话号码"
              width="150">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="name"
              label="专业代码"
              width="150">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="address"
              label="专业方向"
              width="150">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="phone"
              label="学位类型"
              align="center"
              width="100">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="remark"
              label="备注">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="remark"
              label="初试成绩"
              width="100">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="remark"
              label="状态">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="16" :offset="2">
          <el-form-item label="已选中人员:" prop="address">
            {{selectPerson}}
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="复试地点:" prop="remark">
            <el-input v-model="formValidate.remark" type="textarea" resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>

    <el-row >
      <el-col :span="24" style="text-align: center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button  @click="cancel">取消</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
      props:['operailityData','url'],
    data (){
      return{
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          name:'',        //楼名
          address:'',     //地址
          phone:'',       //电话
        },
        tableData:[],
        multipleSelection:[], // 选中的值
        selectPerson:'',
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
//            url:this.url.buildAdd,
            jsonString:true,
            method:'post',
            data:{

            },
          }
        },
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //暂时没有初始化,预留初始化入口
    },
    methods:{
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit){
          if(!isLoadingFun) isLoadingFun=function(){};
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data=this.getFormData(this.formValidate);
          this.ajax(this.addMessTitle,isLoadingFun)
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
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel',this.addMessTitle.type);
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
        let tempArr=[]
        for(let i =0;i<val.length;i++){
          tempArr.push(val.name);
        }
        this.selectPerson = tempArr.join(',')
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //this.ajax(this.listMessTitle)
      },
    }
  }
</script>

