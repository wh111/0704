<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2017/8/26
****--@author   gx
----------------------------------->
<template>
    <div>
      <div v-if="isshow" style="font-size: 18px;text-align: center;height: 50px;"><strong>附件列表</strong></div>
      <el-row>
        <el-col  :span="16" :offset="4">
          <upload-file :uploadFiles="fileList" :show="isshow" :noFirstCallBack="true"  @setUploadFiles="expenseFileEvent"></upload-file>
        </el-col>
      </el-row>
      </br>
      <el-row>
        <el-col :span="10" :offset="11">
          <el-button @click="cancel">返回</el-button>
        </el-col>
      </el-row>

    </div>
</template>
<script>
    /*当前组件必要引入*/

    //当前组件引入全局的util
    let Util = null;
    export default{
        props:['fileList','isshow'],
        data() {
            return {}
        },
        methods: {
            //初始化请求列表数据
            init(){

            },
          expenseFileEvent(ids,files){
            let names = [];
            for(let i=0;i<files.length;i++){
              let item = files[i];
              names.push(item.name)
            }
            this.$emit('upLoad',ids,names,files)
          },

          cancel(){
            this.$emit('cancel')
          }

        },
        created(){
            this.init();
        },
        mounted(){
        },
        components: {}
    }
</script>
