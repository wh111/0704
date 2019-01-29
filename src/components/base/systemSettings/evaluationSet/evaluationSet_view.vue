<template>

  <div>
    <el-form :model="formValidate" ref="formValidate"  class="demo-form-inline" label-width="90px" >

      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="名称:" prop="title" >
           {{formValidate.title}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="模块:" prop="model" >
            {{formValidate.model}}
          </el-form-item>
        </el-col>
        </el-col >
        <el-col :span="8" :offset="2">
          <el-form-item label="评分类型:" prop="type">
            {{formValidate.type==1?'按考核内容显示打分':'按考核项目显示打分'}}
          </el-form-item>
        </el-col >
        <el-col :span="8" :offset="2">
          <el-form-item label="生源类型:" prop="userType">
            {{formValidate.userType | userType}}
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>

    <el-table
      align="center"
      max-height="400"
      :data="tableData"
      tooltip-effect="dark"
      highlight-current-row
      border
      style="width: 100%;height: 100%">
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="100">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        prop="detailClassification"
        label="考核项目">
      </el-table-column>
      <el-table-column
        prop="detailInspectionItem"
        label="考核内容"
        align="center"
        width="280"
        show-overflow-tooltip
        class-name="clearPadding">
        <template scope="scope">
          <div v-for="(item, index) in scope.row.configurationDetails">
            <div :class="{'div-noborder':scope.row.configurationDetails.length-1==index}" class="div-border" >
              {{item.detailInspectionItem}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="detailNote"
        class-name="clearPadding"
        label="考核备注"
        show-overflow-tooltip
        align="center">
        <template scope="scope">
          <div v-for="(item, index) in scope.row.configurationDetails">
            <div :class="{'div-noborder':scope.row.configurationDetails.length-1==index}" class="div-border" >
              {{item.detailNote}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        class-name="clearPadding"
        prop="detailScore"
        label="标准分值"
        align="center">
        <template scope="scope">
          <div v-for="(item, index) in scope.row.configurationDetails">
            <div :class="{'div-noborder':scope.row.configurationDetails.length-1==index}" class="div-border" >
              {{item.detailScore}}
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
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
          title:'',        //名称
          model:'',     //模块
          type:0,       //评分类型
          userType:'SXS',      //生源类型
          configurationDetails:[],
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:this.url.configurationAdd.path,
            jsonString:true,
            method:'post',
            data:{},
          }
        },

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.configurationGet.path+this.operailityData.model,
          }
        },
        tableData:[],
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      this.init()
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
          this.formValidate.configurationDetails = this.tableData;
          this.addMessTitle.ajaxParams.data=this.getFormData(this.formValidate);
          isLoadingFun(true);
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


      //获取数据
      SuccessGetCurrData(res){
        let data = res.data;
        if(!data)return;
        this.formValidate = data;
        let configurationDetails = data.configurationDetails;

        let temArr = [];
        let index = -1;
        let flag;
        if(data.type==1){
          flag = true;
        }

        let detailClassification = '';///项目名称
        for(let i=0;i<configurationDetails.length;i++){
            if(flag || detailClassification!=configurationDetails[i].detailClassification){
              index++;
              temArr[index] = {
                detailClassification:'',
                configurationDetails:[],
              };
              detailClassification = configurationDetails[i].detailClassification;
              temArr[index].detailClassification = configurationDetails[i].detailClassification;
              temArr[index].configurationDetails.push(configurationDetails[i]);
            }else {
              temArr[index].configurationDetails.push(configurationDetails[i]);
            }

        }
        this.tableData = temArr;

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
        return myData;
      },

      //add添加列表项
      add(index){
        let obj={
          detailClassification:'',   //
          detailInspectionItem:'',   //
          detailScore:'',   //
          detailNote:'',   //
          detailCandidate:'',   //
        }
        this.tableData.splice(index+1,0,obj)

      },


      //移除列表项
      remove(index){
        if(this.tableData.length<2){
          this.errorMess('不能移除');
          return ;
        }
        this.tableData.splice(index,1);
      },

      /*
       * 组件初始化入口
       * */
      init(){
        this.ajax(this.listMessTitle)
      },
    }
  }
</script>

