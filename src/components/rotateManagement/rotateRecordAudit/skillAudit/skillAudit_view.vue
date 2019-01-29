<template>

  <div class="showWrapper">
    <el-form   class="demo-form-inline" label-width="90px" >

      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="科室:" prop="name" >
           {{data.depName}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="病人姓名:" prop="phone" >
            {{data.patientName}}
          </el-form-item>
        </el-col >

      </el-row >

      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="病历号:" prop="phone" >
            {{data.patienNo}}
          </el-form-item>
        </el-col >
        <el-col :span="8" :offset="2">
          <el-form-item label="日期:" prop="phone" >
            {{data.fillTime}}
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="病种名称:" prop="name" >
            {{data.deName}}
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="成功:" prop="name" >
            {{data.isSuccess | typeText}}
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="失败原因:" prop="name" >
            {{data.reasonFailure}}
          </el-form-item>
        </el-col>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="相关证明材料:" prop="name" >
            <upload-file :uploadFiles="data.fileList"  :show="true" ></upload-file>
          </el-form-item>
        </el-col>
        </el-col >
      </el-row >


      <el-table
        v-if="data.reviewMess && data.reviewMess[0]"
        align="center"
        :height="200"
        :context="self"
        :data="data.reviewMess"
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
          align="center"
          prop="createUserName"
          label="审核人"
          width="200">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="审核时间"
          width="300">
        </el-table-column>
        <el-table-column
          prop="reviewMess"
          label="审核意见"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="spState"
          label="审核状态"
        >
          <template scope="scope">
            {{ scope.row.spState | typeText}}
          </template>
        </el-table-column>

      </el-table>


    </el-form>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','url'],
    data (){
      return{
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        "data":{
         /* "diseaseId":12,
          "podId":12,
          "depId":12,
          "depName":"111",
          "patientName":"张三",
          "patienNo":"1212121",
          "fillTime":"2017-05-08",
          "mainDiagnosis":"主要诊断",
          "secondaryDiagnosis":"次要诊断",
          "isDirector":"Y",
          "isRescue":"N",
          "situation":"转归情况",
          "disState":"NO_SUBMIT",
          "createUserName":"填写人名称",
          "createTime":"2017-05-08 12:00:00",
          "fileList":[
            {
              "fileName":"123",
              "fileType":"txt",
              "fileUrl":"www.baidu.com"
            }
          ],*/
//          "reviewMess":[{
//              "reviewId":111,
//              "spState":"PASS",
//              "reviewMess":"审批意见",
//              "createTime":"2014-05-06",
//              "createUserName":"张三"
//            }
//          ]
        },
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.skillRecordGet+this.operailityData.skillId,
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
      this.init();
    },
    methods:{
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        this.data = data;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','show');
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
