<!----------------------------------
****--以人员角度查看(autoArrangeByUser_list.vue)
****--@date     2017/7/12
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
    <div>
      <el-table
        v-if="tableData.tbody.length>0"
        :data="tableData.tbody"
        border
        :height="params.dynamicHt+40"
        style="width: 100%;height: 100%">
        <el-table-column
          v-for="(item,idx) in tableData.thead"
          :key="idx"
          :fixed="idx<3?true:false"
          :prop="item.prop"
          :label="item.label"
          :width="idx<3?wdt[idx]:''">
        </el-table-column>
      </el-table>
      <div v-else style="text-align: center;font-size: 20px;padding: 50px;">
        <p>{{mess}}</p>
      </div>
    </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from "../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["params","userType",'operailityData'],
    data() {
      return {
        mess:"数据加载中!",
        wdt:[120,120,120],
        otherWdt:120,
        tableData:{"thead":[],"tbody":[]},
        //当前组件默认请求(list)数据时,ajax处理的 按人展示列表
        listMessByUserTitle:{
          ajaxSuccess:'updateListDataByUser',
          ajaxParams:{
            url: api.rotaryListByUser.path+this.userType,
            params:{
              userName:"",
              schoolName:"",
              year:"",
              rtState:"",
            }
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;

        this.setTableData();
        /*let mydata = {
          "times":[
            {
              "beginTime":"2017-01-01",
              "endTime":"2017-01-15"
            },
            {
              "beginTime":"2017-01-01",
              "endTime":"2017-01-15"
            }
          ],
          "userInfo":[
            {
              "userId":111,
              "userName":"呼吸内科",
              "specialty":"专业",
              "highestEdu":"学历"
            }
          ],
          "rotaryData":[
            {
              "userId":111,
              "depName":"科室",
              "beginTime":"2017-01-01",
              "endTime":"2017-01-15"
            },
            {
              "userId":111,
              "depName":"科室",
              "beginTime":"2017-01-16",
              "endTime":"2017-01-31"
            },
            {
              "userId":112,
              "depName":"科室2",
              "beginTime":"2017-01-16",
              "endTime":"2017-01-31"
            }
          ]
        }

        this.formatTableData(mydata);*/


      },

      setTableData() {
        let formValidate = Util._.defaultsDeep({}, this.operailityData);
        formValidate = this.formDate(formValidate, ['year'], 'yyyy');
        this.listMessByUserTitle.ajaxParams.params = Object.assign(this.listMessByUserTitle.ajaxParams.params,formValidate);
        this.ajax(this.listMessByUserTitle);
      },

      updateListDataByUser(responseData){
        let data = responseData.data;
        this.formatTableData(data);
      },


      //格式化排班表数据
      formatTableData(data){
        //this.tableData.thead  this.tableData.tbody
        let fixedInfo=[{"prop":"userName","label":"姓名"},{"prop":"highestEdu","label":"学历"},{"prop":"specialty","label":"培训方向"}]
        let thead = [];
        let tbody = [];
        let tempArr = [];
        for(var i=0,item;i<data["times"].length;i++){
          item = data["times"][i];
          tempArr.push({
            "prop":item["beginTime"]+item["endTime"],
            "label":item["beginTime"]+" "+item["endTime"],
          })
        }
        thead = fixedInfo.concat(tempArr);
        /*for(var i=0,item;i<data["rotaryData"].length;i++){
         item = data["rotaryData"][i];
         bodyRight[item["beginTime"]+item["endTime"]+item["userId"]] = item;
         }*/
        for(var i=0,item;i<data["userInfo"].length;i++){
          item = data["userInfo"][i];
          for(var k=0,subItem;k<data["rotaryData"].length;k++){
            subItem = data["rotaryData"][k];
            if(item["userId"]==subItem["userId"]){
              item[subItem["beginTime"]+subItem["endTime"]] = subItem["depName"];
            }
          }
        }
        tbody = data["userInfo"];
        this.tableData={"thead":[],"tbody":[]};
        this.tableData.thead = thead;
        this.tableData.tbody = tbody;
        if(this.tableData.thead.length*this.otherWdt<this.params.dynamicWt){
            this.otherWdt='';
        }
        if(this.tableData.tbody.length==0){
          this.mess = "没有查到相关轮转安排!";
        }
      },

    },
    watch:{
      params(val){
        let option = Util._.defaultsDeep({},this.listMessByUserTitle);
        option.ajaxParams.params = Object.assign(option.ajaxParams.params,val);
        this.ajax(option);
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
