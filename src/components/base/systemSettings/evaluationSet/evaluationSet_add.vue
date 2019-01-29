<template>

  <div>
    <el-form :model="formValidate" ref="formValidate"  class="demo-form-inline" label-width="90px" >

      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="名称:" prop="title" >
            <el-input style="width:200px;" v-model="formValidate.title" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="模块:" prop="model" >
            <el-select v-model="formValidate.model">
              <el-option label="大病历" value="DBL"></el-option>
            </el-select>
          </el-form-item>
        </el-col >

        <el-col :span="8" :offset="2">
          <el-form-item label="评分类型:" prop="type">
           <el-select v-model="formValidate.type">
             <el-option label="按考核项目显示打分" :value="0"></el-option>
             <el-option label="按考核内容显示打分" :value="1"></el-option>
           </el-select>
          </el-form-item>
        </el-col >
        <el-col :span="8" :offset="2">
          <el-form-item label="生源类型:" prop="userType">
            <el-select v-model="formValidate.userType">
              <el-option label="实习生" value="SXS"></el-option>
              <el-option label="研究生" value="YJS"></el-option>
              <el-option label="住院医" value="ZYY"></el-option>
              <el-option label="进修生" value="JXS"></el-option>
            </el-select>
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
        <template scope="scope">
          <el-input v-model="scope.row.detailClassification"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="detailInspectionItem"
        label="考核内容">
        <template scope="scope">
          <el-input v-model="scope.row.detailInspectionItem"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="detailScore"
        label="标准分值"
        align="center">
        <template scope="scope">
          <el-input v-model="scope.row.detailScore"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="detailNote"
        label="考核备注"
        align="center">
        <template scope="scope">
          <el-input v-model="scope.row.detailNote"></el-input>
        </template>
      </el-table-column>
      <!--<el-table-column-->
        <!--show-overflow-tooltip-->
        <!--prop="detailCandidate"-->
        <!--label="评分后选项"-->
        <!--align="center">-->
        <!--<template scope="scope">-->
          <!--<el-input v-model="scope.row.detailCandidate"></el-input>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column
        label="操作"
        width="160">
        <template scope="scope">
          <el-button size="small" type="success" icon="plus" @click="add(scope.$index)"></el-button>
          <el-button size="small" type="warning" icon="minus" @click="remove(scope.$index)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <br>
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
          title:'',        //名称
          model:'DBL',     //模块
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
        tableData:[{
          detailClassification:'',   //
          detailInspectionItem:'',   //
          detailScore:'',   //
          detailNote:'',   //
          detailCandidate:'',   //
        }],
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
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel',this.addMessTitle.type);
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
        //this.ajax(this.listMessTitle)
      },
    }
  }
</script>

