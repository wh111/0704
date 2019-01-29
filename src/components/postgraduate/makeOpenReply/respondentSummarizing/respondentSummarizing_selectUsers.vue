<!----------------------------------
****--新建答辩汇总(respondentSummarizing_add)
****--@date     2017/9/12
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-form inline>
      <el-row>
        <!--<el-col :span="3">
          <div class="cal-schoolTit" style="text-align: right;">专科：</div>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="formValidate.specialty"></el-input>
        </el-col>-->
        <el-form-item label="年级"  >
          <el-select filterable  v-model="formValidate.boundary" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in optionData" :key="item" :label="item" :value="item" ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学位类型" >
          <el-select filterable  v-model="formValidate.degree" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="学术学位" value="MAJOR"></el-option>
            <el-option label="专业学位" value="LEARNING"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="专业方向" prop="status" >
          <el-select v-model="formValidate.specialtyName" placeholder="请选择">
            <major :selectDefault="true" @majorDefault="majorDefault"></major>
          </el-select>
        </el-form-item>
          <el-button type="primary" @click="handleSubmit('formValidate')" icon="search"></el-button>
      </el-row>
    </el-form>
    <br/>
    <el-table
      ref="multipleTable"
      align="center"
      :data="tableData1"
      max-height="400"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="序号"
        type="index"
        width="70">
      </el-table-column>
      <el-table-column
        prop="name"
        label="申请人"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="studentId"
        label="学号"
        align="center"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="boundary"
        label="年级"
        align="center"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        align="center"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="specialtyName"
        label="专业方向"
        align="center"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="specialtyCode"
        label="专业代码"
        align="center"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="degree"
        label="学位类型"
        align="center"
        width="120"
        show-overflow-tooltip>
        <template scope="scope">
          {{ scope.row.degree | typeText}}
        </template>
      </el-table-column>
    </el-table>
    <br />
    <el-row>
      <el-col :span="8" class="textCenter">&nbsp;</el-col>
      <el-col :span="4" class="textCenter"><el-button type="primary" @click="submitForm('ruleForm')">提交</el-button></el-col>
      <el-col :span="4" class="textCenter"><el-button  @click="cancel">取消</el-button></el-col>
      <el-col :span="8" class="textCenter">&nbsp;</el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入--操作url的api
  import major from '../../common/major_name.vue';
  import api from "../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data() {
      return {
        optionData:[],
        //查询表单
        formValidate: {
          "name":"",
          "specialtyName":"",
          degree:'',
          boundary:'',
        },

        onlyOnce:true,

        tableData1:[
//          {
//            "id":"1",
//            "applicantId":"申请人",
//            "name":"申请人",
//            "studentId":"学号",
//            "boundary":"年级",
//            "phone":"手机号",
//            "specialtyCode":"专业代码",
//            "specialtyName":"专业",
//            "degree":"学位类型",
//            "status":"状态"
//          }
        ],
        multipleSelection: [],

        //查询列表数据
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.defenseSummaryUserList.path,
            params:{
            }
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){

        let year = new Date().getFullYear();

        let tempArr = []
        for(let i=0 ;i<4;i++){
          tempArr.push(year-i);
        }
        this.optionData = tempArr

//        this.ajax(this.listMessTitle);
        /*let tempArr = [];
        if(this.operailityData.length>0){
          let splt = this.operailityData;
          for(var i=0;i<this.tableData1.length;i++){
            for(var k=0;k<splt.length;k++){
              if(this.tableData1[i]["id"]==splt[k]["userId"]){
                tempArr.push(i);
                break;
              }
            }
          }
          this.multipleSelection = [];
          for(var i=0;i<tempArr.length;i++){
            this.multipleSelection.push(this.tableData1[tempArr[i]]);
          }
        }*/
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name){
        let option = Util._.defaultsDeep({},this.listMessTitle);
        option.ajaxParams.params = Object.assign(option.ajaxParams.params,this.formValidate);
        this.ajax(option);
      },
      setTableData(){
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.formValidate);
        this.ajax(this.listMessTitle);
      },

      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        for(var i=0,item;i<data.length;i++){
          item = data[i]
          if(item.id==-1){
            data.splice(i,1);
          }
        }
        this.tableData1 = [];
        this.tableData1= data;
        let tempArr = [];
        if(this.operailityData.length>0){
          let splt = this.operailityData;
          for(var i=0;i<this.tableData1.length;i++){
            for(var k=0;k<splt.length;k++){
              if(this.tableData1[i]["applicantId"]==splt[k]["userId"]){
                tempArr.push(i);
                break;
              }
            }
          }
          this.multipleSelection = [];
          for(var i=0;i<tempArr.length;i++){
            this.multipleSelection.push(this.tableData1[tempArr[i]]);
          }
        }
      },


      //提交数据到父组件
      submitForm(){
        if(!this.isSelected()) return;
        let data=[]  //[{id:1,name:"内科"},……}
        for(var i=0,item;i<this.multipleSelection.length;i++){
          item = this.multipleSelection[i];
          data.push({
            userId:item.applicantId, userName:item.name,
          });
        }
        this.$emit("setUsers",data);
        this.cancel();
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
      isSelected(isOnly){
        let len = this.multipleSelection.length;
        let flag = true;
        if(len==0){
          this.showMess("请选择数据!");
          flag = false;
        }
        if(len>1 && isOnly){
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','selectUser');
      },


      //设置默认的专业
      majorDefault(item){

      this.formValidate.specialtyName = item.name;

       this.setTableData()
      },

    },
    created(){
      Util = this.$util;
      this.init();
    },
    mounted(){
      //页面dom稳定后调用

    },
    watch:{
      multipleSelection(val){
        if(!this.onlyOnce) return;
        this.$nextTick(function () {
          if(val.length > 0){
            let tempArr = this.multipleSelection;
            for (var i = 0; i < tempArr.length; i++) {
              this.$refs.multipleTable.toggleRowSelection(tempArr[i], true);
            }
          }
        })
      }
    },
    components: {major}
  }
</script>
