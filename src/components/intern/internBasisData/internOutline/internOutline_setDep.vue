<!----------------------------------
****--设置大纲科室(internOutline_setDep)
****--@date     2017/6/28
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
    <div>
      <div class="cal-schoolTit">待选科室:<el-input style="width: 200px;" v-model="filterDep" placeholder="请输入内容"></el-input></div>
      <div class="sltDepWrapper">
        <ul class="sltDepUl">
          <div v-for="(item,index) in depTreeData" :key="item.id" class="sltDepBox">
            <li class="sltDep"><el-checkbox @change="handleCheck(item)" v-model="item.checked">{{item.name}}</el-checkbox></li>
            <li class="sltSubDep" v-if="typeof item.childList!='undefined'" v-for="(subItem,subIndex) in item.childList"><el-checkbox @change="handleCheck(subItem)" v-model="subItem.checked">{{subItem.name}}</el-checkbox></li>
          </div>
        </ul>
      </div>

      <div style="text-align: center;margin-top: 10px;">
        <el-button @click="listenSubEvent" type="primary">确定</el-button>
      </div>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    //引入--操作url的api
    import api from "../api.js";
    //当前组件引入全局的util
    let Util = null;
    export default{
      //props接收父组件传递过来的数据
      props: ['operailityData'],
        data() {
            return {
              //查询表单

              //保存按钮基本信息
              loadBtn:{title:'确定',callParEvent:'listenSubEvent'},

              depTreeData:[],
              saveDepTreeData:{},

              //查询科室
              filterDep:"",

              initDep:[],

              //获取所有的科室
              getDepMessTitle:{
                ajaxSuccess:'setDepData',
                ajaxParams:{
                  url: api.getByDepth.path,
                  params:{
                    depth: 2,
                  }
                }
              },
            }
        },
        methods: {
            //初始化请求列表数据
            init(){
              Util = this.$util;
              this.ajax(this.getDepMessTitle);
            },


          //格式化科室目录树
          initFormateDepTree(data){
            /*data = [
             {
             "expand":true,
             "name":"内科",
             "id":1,
             "leaf":false,
             "childList":[
             {
             "expand":true,
             "name":"内科A1",
             "id":3,
             "leaf":true
             },
             {
             "expand":true,
             "name":"内科A2",
             "id":4,
             "leaf":true
             }
             ]
             },
             {
             "expand":true,
             "name":"外科",
             "id":2,
             "leaf":true
             }
             ]*/
            for(var i=0,item;i<this.operailityData.length;i++){
              item = this.operailityData[i];
              this.initDep.push(item.depId);
              this.saveDepTreeData[item.depId] = {depId:item.depId,depName:item.depName};
            }
            this.setChecked(data);

            this.depTreeData = data;
          },

          //获取server端所有科室
          setDepData(responseData){
            let data = responseData.data;
            if(this.valDataType(data,"Array")){
              data.map(item => {//去掉子集
                item.childList = '';
              })
              //if(typeof data[0].childList!="undefined"){
              //this.initFormateDepTree(data[0].childList);
              //}
              this.initFormateDepTree(data);
            }
          },

          /**
           * 勾选科室后
           * @param item {Object}  科室数据
           * */
          handleCheck(item){
            if(item.checked){
              this.saveDepTreeData[item.id] = {depId:item.id,depName:item.name};
            }else{
              if(typeof this.saveDepTreeData[item.id]!="undefined"){
                delete this.saveDepTreeData[item.id];
              }
            }
          },

          /**
           * 动态添加科室
           * @param id {Number}  科室id
           * @param name {string}  科室名称
           * */
          addDep(id,name){

          },


          setChecked(data){
            for (var i = 0; i < data.length; i++) {
              if(this.initDep.indexOf(data[i].id)>-1){
                data[i]["checked"] = true;
              }else{
                data[i]["checked"] = false;
              }
              if (this.valDataType(data,"Array")&&data[i].childList!==null) {
                this.setChecked(data[i].childList);
              }
            }
          },

          /*
           * 点击提交按钮 监听是否提交数据
           * @param isLoadingFun boolean  form表单验证是否通过
           * */
          listenSubEvent(){
            let obj = Util._.defaultsDeep({},this.saveDepTreeData);
            let data = [];
            Util._.forEach(obj,function (n,k) {
              data.push(n);
            })
            this.$emit("filterAddDepData",data);
            this.cancel();
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
            this.$emit('cancel','setDep');
          },

        },
        created(){
            this.init();
        },
      mounted(){
        //页面dom稳定后调用

      },
      watch:{
        filterDep(val){
          //todo
          //if(!val){
          //this.depTreeData = this.saveDepTreeData;
          //}else{
          this.depTreeData.sort(function(a, b) {
            return a.name.indexOf(val) < b.name.indexOf(val);
          })
          for(var i=0,item;i<this.depTreeData.length;i++){
            item = this.depTreeData[i]["childList"];
            if(typeof item!="undefined"){
              item.sort(function(a, b) {
                return a.name.indexOf(val) < b.name.indexOf(val);
              })
            }
          }
          //}

          //console.log(val);
        }
      },
        components: {}
    }
</script>
