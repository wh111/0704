<!--房间资料-->
<template>

  <div>
      <el-form class="demo-form-inline" label-width="100px">
        <el-row >
          <el-col :span="8" :offset="2">
            <el-form-item label="大楼名称:" class="feildFontweight">
              {{roomData.buildingName}}
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="房间类别:" class="feildFontweight">
              {{roomData.sex | roomSex}}
            </el-form-item>
          </el-col>
        </el-row >
        <el-row >
          <el-col :span="8" :offset="2">
            <el-form-item label="房间号:" class="feildFontweight">
              {{roomData.no}}
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="床位数:" class="feildFontweight">
              {{roomData.bedNum}}
            </el-form-item>
          </el-col>
        </el-row >

        <el-row >
          <el-col :span="16" :offset="2">
            <el-form-item label="备注:" class="feildFontweight" >
              <el-input
                type="textarea"
                :rows="5"
                readonly
                resize="none"
                v-model="roomData.remark">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row >
    </el-form>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','selectRoom','url','build'],
    data (){
      return{
        //保存按钮基本信息
        roomData:{},
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.roomGet+this.selectRoom.id,
          }
        }
      }
    },
    created(){
      //初始化时间
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
        this.roomData = data;
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
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
    }
  }
</script>
