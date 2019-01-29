<template>

  <div class="showWrapper">
    <el-form class="demo-form-inline" label-width="100px">
      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="姓名:" class="feildFontweight">
            {{data.name}}
          </el-form-item>
        </el-col>
        <el-col :span="10" >
          <el-form-item label="性别:" class="feildFontweight">
            {{operailityData.gender}}
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="电话号码:" class="feildFontweight">
            {{operailityData.phone}}
          </el-form-item>
        </el-col>

        <el-col :span="10" >
          <el-form-item label="邮箱:" class="feildFontweight">
            {{operailityData.email}}
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="专业:" class="feildFontweight">
            {{operailityData.major}}
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="状态:" prop="disState" >
            {{data.state | typeText}}
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="20" :offset="2">
          <img v-if="data.doctorCertificateUrl&&data.doctorCertificateUrl!=0" v-for="(item,index) in data.doctorCertificateUrl" :src="http+item" style="width: 200px;height:150px;margin: 5px">
          <img v-else  style="width: 200px;height:150px;margin: 5px">
        </el-col>
      </el-row >

      <br>
      <el-table
        v-if="data.reviewInfoList && data.reviewInfoList[0]"
        align="center"
        :height="200"
        :data="data.reviewInfoList"
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
//          "id":1,
//          "name":"1号宿舍大楼",
//          "address":"北京市海淀区紫竹园路青东商务区A座栋楼11层",
//          "phone":"029-2100000",
//          "remark":"员工宿舍大楼"
        },
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.getExamInfoByUserId.path+this.operailityData.userId,
          }
        },
        http:'/server',
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      let env = this.$store.getters.getEnvPath;
      this.http = env['http'];
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
