<template>

  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="90px" >
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="复试专业:" prop="majorAndCode" >
            <el-select filterable  v-model="formValidate.majorAndCode" @change="majorChange" placeholder="请选择">
              <el-option label="shanghai-11" value="shanghai-11"></el-option>
              <el-option label="beijing-1212" value="beijing-1212"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="22" :offset="1">
          <el-table
            align="center"
            max-height="400"
            :data="personData"
            tooltip-effect="dark"
            highlight-current-row
            style="width:100%;height:100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              align="center"
              label="序号"
              type="index"
              width="75">
              <template scope="scope">
                <span>{{scope.row.index}}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="studentId"
              label="学号"
              width="150">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="name"
              label="姓名"
              width="150">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="sex"
              width="75"
              label="性别">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="phone"
              label="电话号码"
              width="150">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="majorCode"
              label="专业代码"
              width="150">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="major"
              label="专业方向"
              width="150">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="degree"
              label="学位类型"
              align="center"
              width="100">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="remarks"
              label="备注">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="initialScore"
              label="初试成绩"
              width="100">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="remark"
              label="状态">
              <template scope="scope">

              </template>
            </el-table-column>
          </el-table>
          <div style="margin: 10px;">
            <div style="float: right;">
              <el-pagination
                @size-change="changePageSize"
                @current-change="changePage"
                :current-page="myPages.currentPage"
                :page-sizes="myPages.pageSizes"
                :page-size="myPages.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
              </el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="已选中人员:" prop="userIds">
            {{selectPerson}}
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="复试时间:" prop="retestTime">
            <el-input v-model="formValidate.retestTime" type="textarea" resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="复试地点:" prop="retestAddress">
            <el-input v-model="formValidate.retestAddress" type="textarea" resize="none" :rows="8"></el-input>
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
  import {ptSummarizingReexamine as rules} from '../rules'
  let Util=null;
  export default {
    props:['operailityData','url'],
    data (){
      return{
        rules,
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          retestTime:'',        //复试时间
          retestAddress:'',     //复试地点
          userIds:'',       //复试人员IDS
          major:'',       //专业
          majorAndCode:'',       //专业
          majorCode:'',       //专业代码
        },
        totalCount:0,
        personData:[],  //储存获取到的人员信息
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
            url:this.url.retestAdd.path,
            jsonString:true,
            method:this.url.retestAdd.method,
            data:{

            },
          }
        },
        getMajorMessTitle:{
          ajaxSuccess:'getMajorSuccess',
          ajaxParams:{
//            url:this.url.queryByPersonType.path,
//            method:this.url.queryByPersonType.method,
          }
        },


      }
    },
    created(){
      //给当前组件注入全局util
      this.init()

    },
    mounted(){
      //暂时没有初始化,预留初始化入口
    },
    methods:{
      init(){
        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1,pageSize: Util.pageInitPrams.pageSize
        }
      },
      //获取专业
      getMajorSuccess(res){
        let data = res.data;
        if(!data)return;
        this.personData = data;
      },
      getPersonSuccess(res){
        res ={
          "data":[
            {
              "id":"1",
              "studentId":"100000",
              "name":"张三",
              "sex":"'GIRL','BOY'",
              "phone":"1800000000",
              "major":"内科",
              "majorCode":"10010",
              "degree":"'MAJOR'学术学位,'LEARNING'专业学位",
              "initialScore":"初试成绩",
              "remarks":"备注",
              "status":"状态(UNORGANIZED未组织)"
            }
          ],
          "totalCount":"20",
          "status":{
            "msg":"",
            "code":"0"
          }
        }
        let data = res.data;
        if(!data)return;
        this.personData = data;
        this.totalCount = data.totalCount
      },

      getPerson(major){
       let params = Object.assign(this.queryQptions,{major:major});
        //获取人员列表
        let getPersonMessTitle={
          ajaxSuccess:'getPersonSuccess',
          ajaxParams:{
            url:this.url.queryByPersonType.path,
            method:this.url.queryByPersonType.method,
            params,
          }
        }
        this.ajax(getPersonMessTitle);
      },
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
          this.ajax(this.addMessTitle,isLoadingFun);
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
        let userName=[];
        let userId=[];
        for(let i =0;i<val.length;i++){
          let item = val[i];
          userName.push(item.name);
          userId.push(item.studentId);
        }
        this.formValidate.userIds = userId.join(',');
        this.selectPerson = userName.join(',');
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
//        this.ajax(this.getMajorMessTitle);
      },

      expenseFileEvent(ids){
        this.formValidate.fileIds = ids;

      },


      //改变专业
      majorChange(val){
        val =  val.split('-');
        this.formValidate.major = val['0'];
        this.formValidate.majorCode = val['1'];
        this.queryQptions = {
          curPage: 1,pageSize: Util.pageInitPrams.pageSize
        }
        this.getPerson(val[1]);
      },

    }
  }
</script>

