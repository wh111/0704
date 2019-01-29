<!----------------------------------
****--配置科室对照列表(setDepList)
****--@date     2017/7/26
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
    <div>
      <div class="cal-schoolTit">标准科室：{{standardDep}}({{serverData["ts"]}}月)</div>
      <div class="listUpAreaBox">
        <div class="listUpArea-menus">
          <div class="add-remove">
          </div>
        </div>
        <div class="listUpArea-search"></div>
      </div>
      <br />
      <el-table
        border
        align="center"
        :height="dynamicHt"
        :context="self"
        :data="tableData1"
        style="width: 100%">

        <el-table-column
          prop=""
          label="科室"
          align="center"
          class-name="clearPadding"
          width="200">
          <template scope="scope">
            <div :class="{'div-noborder':scope.row.hospitalDeps.length-1==subIndex}" class="div-border" v-for="(subItem, subIndex) in scope.row.hospitalDeps">
              {{subItem.hospitalDepName}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          align="center"
          class-name="clearPadding"
          label="科室安排类型">
          <template scope="scope">
            <div v-if="scope.row.deType==0">
                <div class="div-border" :class="{'div-noborder':scope.row.hospitalDeps.length-1==subIndex}" v-for="(subItem, subIndex) in scope.row.hospitalDeps">
                  固定
                </div>
              </div>
              <div class="div-noborder" :style="'height:'+scope.row.hospitalDeps.length*45+'px;line-height:'+scope.row.hospitalDeps.length*45+'px'" v-else>任选其{{scope.row.depRandomNum}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          align="center"
          class-name="clearPadding"
          label="是否连续轮转">
          <template scope="scope">
              <div v-if="scope.row.deType==0">
                <div class="div-border" :class="{'div-noborder':scope.row.hospitalDeps.length-1==subIndex}" v-for="(subItem, subIndex) in scope.row.hospitalDeps">
                  {{scope.row.depIsCou==0?'是':'否'}}
                </div>
              </div>
              <div class="div-noborder" :style="'height:'+scope.row.hospitalDeps.length*45+'px;line-height:'+scope.row.hospitalDeps.length*45+'px'" v-else>
                {{scope.row.depIsCou==0?'是':'否'}}
              </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalChTs"
          label="3年时间"
          align="center"
          class-name="clearPadding"
          width="100">
          <template scope="scope">
              <div v-if="scope.row.deType==0">
                <div class="div-border" :class="{'div-noborder':scope.row.hospitalDeps.length-1==subIndex}" v-for="(subItem, subIndex) in scope.row.hospitalDeps">
                  {{subItem.chTs}}月
                </div>
              </div>
              <div class="div-noborder" :style="'height:'+scope.row.hospitalDeps.length*45+'px;line-height:'+scope.row.hospitalDeps.length*45+'px'" v-else>{{scope.row.hospitalDeps[0].chTs}}月</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalCh2Ts"
          label="2年时间"
          align="center"
          class-name="clearPadding"
          width="100">
          <template scope="scope">
            <div v-if="scope.row.deType==0">
              <div class="div-border" :class="{'div-noborder':scope.row.hospitalDeps.length-1==subIndex}" v-for="(subItem, subIndex) in scope.row.hospitalDeps">
                {{subItem.ch2Ts}}月
              </div>
            </div>
            <div class="div-noborder" :style="'height:'+scope.row.hospitalDeps.length*45+'px;line-height:'+scope.row.hospitalDeps.length*45+'px'" v-else>{{scope.row.hospitalDeps[0].ch2Ts}}月</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalCh1Ts"
          label="1年时间"
          align="center"
          class-name="clearPadding"
          width="120">
          <template scope="scope">
            <div v-if="scope.row.deType==0">
              <div class="div-border" :class="{'div-noborder':scope.row.hospitalDeps.length-1==subIndex}" v-for="(subItem, subIndex) in scope.row.hospitalDeps">
                {{subItem.ch1Ts}}月
              </div>
            </div>
            <div class="div-noborder" :style="'height:'+scope.row.hospitalDeps.length*45+'px;line-height:'+scope.row.hospitalDeps.length*45+'px'" v-else>{{scope.row.ch1Ts}}月</div>
          </template>
        </el-table-column>
      </el-table>

    </div>
</template>
<script>
/*当前组件必要引入*/

import api from "../../api.js";
//当前组件引入全局的util
let Util = null;
export default{
    props:["editOperailityData"],
    data() {
      return {
        deleteUrl: api.removeRulesDepHgGroup.path,
        saveDelUrl: api.removeRulesDepHgGroup.path,
        /*--按钮button--*/
        addId:{
          id:'add',
          title:'添加'},
        removeId:{
          id:'remove',
          title:'删除'
        },
        editId:{
          id:'edit',
          title:'修改'
        },

        //server端请求回来的原始数据
        serverData:{},

        //标准科室名称
        standardDep:"",

        operailityData:'',
        dynamicHt: 500,
        self: this,
        tableData1: [],
        loading:false,
        listTotal:0,
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.getRulesDepHgGroup.path+this.editOperailityData["rtId"]+"_"+this.editOperailityData["rdId"],
            params:{
              name:'',code:''
            }
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        this.setTableData();
//        this.initFormateData();
      },


      //格式化server传输过来的数据
      initFormateData(data){
        /*  data = {
            "rdId":11,
            "cdepId":11,
            "cdepName":"内科",
            "depType":"安排类型(1任选 0 必须轮转)",
            "ts":11,
            "depRandomNum":0,
            "hospitalDep":[
              {
                "hgId":1,
                "hgGroup":"组号",
                "deType":0,
                "depRandomNum":0,
                "depIsCou":1,
                "chTs":12,
                "ch2Ts":9,
                "ch1Ts":24,
                "hospitalDeps":[
                  {
                    "hospitalDepId":1,
                    "hospitalDepName":"院内科室名称",
                    "chTs":5,
                    "ch2Ts":6,
                    "ch1Ts":9
                  },
                  {
                    "hospitalDepId":1,
                    "hospitalDepName":"院内科室名称",
                    "chTs":4,
                    "ch2Ts":1,
                    "ch1Ts":8
                  },
                  {
                    "hospitalDepId":1,
                    "hospitalDepName":"院内科室名称",
                    "chTs":3,
                    "ch2Ts":2,
                    "ch1Ts":7
                  }
                ]
              },
              {
                "hgId":2,
                "hgGroup":"组号",
                "deType":1,
                "depRandomNum":1,
                "depIsCou":0,
                "chTs":3,
                "ch2Ts":2,
                "ch1Ts":1,
                "hospitalDeps":[
                  {
                    "hospitalDepId":1,
                    "hospitalDepName":"院内科室名称",
                    "chTs":3,
                    "ch2Ts":2,
                    "ch1Ts":1
                  },
                  {
                    "hospitalDepId":1,
                    "hospitalDepName":"院内科室名称",
                    "chTs":3,
                    "ch2Ts":2,
                    "ch1Ts":1
                  }
                ]
              }
            ]
          }*/
        if(data["hospitalDep"]===null){
          data["hospitalDep"] = [];
        }
        this.serverData = data;
        this.standardDep = data["cdepName"];
        this.tableData1=[];
        this.tableData1=data["hospitalDep"];
        //this.tableData1.push(data);
      },

      setTableData(params){
        //this.setAjaxParams();
        this.ajax(this.listMessTitle);
      },


      //设置提交的参数
      setAjaxParams(){
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params);
      },


      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        this.tableData1=[];
        this.initFormateData(data);
      },


      /*--点击--添加--按钮--*/
      add(){
        this.operailityData = {
          "rtId":this.editOperailityData["rtId"],      //培训细则id
          "rdId":this.editOperailityData["rdId"],      //轮转id
          "cdepId":this.serverData["cdepId"],    //标准科室id
          "cdepName":this.serverData["cdepName"],  //标准科室name
          "ts":this.serverData["ts"],  //标准科室周期
          "hgGroup":this.serverData["hospitalDep"].length,
          "hgId":"",

        }
        this.openModel('add');
      },


      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      edit(index,row){
        this.operailityData = {
          "rtId":this.editOperailityData["rtId"],      //培训细则id
          "rdId":this.editOperailityData["rdId"],      //轮转id
          "cdepId":this.serverData["cdepId"],    //标准科室id
          "cdepName":this.serverData["cdepName"],  //标准科室name
          "ts":this.serverData["ts"],  //标准科室周期
          "hgGroup":index,
          "hgId":row["hgId"],

        }
        this.openModel('edit');
      },


      /*--点击--删除--按钮--*/
      remove(hgId){
        this.deleteUrl = this.saveDelUrl+hgId;
        this.operailityData = [];
        this.openModel('remove') ;
      },


      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer){
        this[targer+'Modal'] = false;
      },


      /*
       * 监听子组件通讯的方法
       * 作用:ajax请求成功回调,该监听方法在libs/util 中的混合模式下定义回调
       * @param targer string example:"add"、"edit"
       * @param targer string 提示返回的ajax回调返回的信息改信息在对应的子组件中定义
       * 例如:errorTitle、errorTitle
       *addMessTitle:{
       *    type:'add',
       *    successTitle:'添加成功!',
       *    errorTitle:'添加失败!',
       *    ajaxSuccess:'ajaxSuccess',
       *    ajaxError:'ajaxError',
       *    ajaxParams:{
       *      url:'/role/add',
       *      method:'post'
       *    }
       *    }
       * @param udata boolean 默认false  是否不需要刷新当前表格数据
       * */
      subCallback(target,title,updata){
        this.cancel(target);
        if(title){
          this.successMess(title);
        }
        if(!updata){
          this.setTableData();
          this.$emit("add");
        }
      },


      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options){
        this[options+'Modal'] = true;
      }
    },
    created(){
      Util = this.$util;
      this.init();
    },
    mounted(){
    },
    components: {
    }
}
</script>
