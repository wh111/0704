<!----------------------------------
****--以科室角度查看(autoArrangeByDep_list)
****--@date     2017/7/12
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-table
      v-if="tableData.tbody.length>0"
      :data="tableData.tbody"
      border
      align="center"
      :height="params.dynamicHt+40"
      style="width: 100%;height: 100%">
      <el-table-column
        v-for="(item,idx) in tableData.thead"
        :key="idx"
        :fixed="idx<1?true:false"
        :prop="item.prop"
        :label="item.weekName"
        align="center"
        :class-name="''"
        :width="idx<1?wdt[idx]:''">
        <el-table-column
          :key="idx"
          :fixed="idx<1?true:false"
          :prop="item.prop"
          :class-name="item.isHead=='true'&&idx==0?'tabBiasLine':''"
          :label="item.label+'-'+idx"
          align="center"
          :width="idx<1?wdt[idx]:''"
          :render-header="handleRenderHeader"
        >
          <template scope="scope">
            <div v-if="idx> 0">
              <div v-html="formatUserName(scope.row[item.prop])"></div>
            </div>
            <div v-else>
              {{scope.row[item.prop]}}
            </div>
            {{idx}}
          </template>
        </el-table-column>
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
        wdt:[120],
        otherWdt:120,
        tableData:{"thead":[],"tbody":[]},
        //当前组件默认请求(list)数据时,ajax处理的 按部门展示列表
        listMessByDepTitle:{
          ajaxSuccess:'updateListDataByDep',
          ajaxParams:{
            url: api.rotaryListByDep.path+this.userType,
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
        this.setTableData(this.operailityData)
        /*let mydata = {
          "times":[
            {
              "beginTime":"2017-01-01",
              "endTime":"2017-01-15"
            },
            {
              "beginTime":"2017-01-16",
              "endTime":"2017-01-31"
            },
            {
              "beginTime":"2017-02-01",
              "endTime":"2017-02-15"
            }
          ],
          "deps":[
            {
              "depId":111,
              "depName":"呼吸内科"
            },
            {
              "depId":112,
              "depName":"消化内科"
            },
            {
              "depId":113,
              "depName":"肾内科"
            }
          ],
          "rotaryData":[
            {
              "userName":"张三",
              "beginTime":"2017-01-01",
              "endTime":"2017-01-15",
              "depId":111
            },
            {
              "userName":"张三",
              "beginTime":"2017-01-16",
              "endTime":"2017-01-31",
              "depId":112
            },
            {
              "userName":"李四",
              "beginTime":"2017-02-01",
              "endTime":"2017-02-15",
              "depId":113
            }
          ]
        }

        this.formatTableData(mydata)*/

      },

      updateListDataByDep(responseData){
        let data = responseData.data;
        this.formatTableData(data);
      },


      //格式化人员展示
      formatUserName(data){
        let users = "";
        if(typeof data!="undefined"){
          data = data+"";
          let tempArr = data.split("##");
          for(var i=0,item;i<tempArr.length;i++){
            item = tempArr[i];
            users+= "<div style='padding: 3px 0;'>"+item+"</div>";
          }
        }
        return users;
      },


      //格式化排班表数据
      formatTableData(data){
        //this.tableData.thead  this.tableData.tbody
        let fixedInfo=[{"prop":"depName","label":"科室","weekName":"周序","isHead":'true'}]
        let thead = [];
        let tbody = [];
        let tempArr = [];
        for(var i=0,item;i<data["times"].length;i++){
          item = data["times"][i];
          tempArr.push({
            "prop":item["beginTime"]+item["endTime"],
            "label":item["beginTime"]+" "+item["endTime"],
            "weekName":(i+1)+"",
            "isHead":'false',
          })
        }
        thead = fixedInfo.concat(tempArr);
        /*for(var i=0,item;i<data["rotaryData"].length;i++){
         item = data["rotaryData"][i];
         bodyRight[item["beginTime"]+item["endTime"]+item["userId"]] = item;
         }*/
        for(var i=0,item;i<data["deps"].length;i++){
          item = data["deps"][i];
          for(var k=0,subItem;k<data["rotaryData"].length;k++){
            subItem = data["rotaryData"][k];
            if(item["depId"]==subItem["depId"]){
              if(typeof item[subItem["beginTime"]+subItem["endTime"]]=="undefined"){
                item[subItem["beginTime"]+subItem["endTime"]] = subItem["userName"];
              }else{
                item[subItem["beginTime"]+subItem["endTime"]] += "##"+subItem["userName"];
              }
              //item[subItem["beginTime"]+subItem["endTime"]] = subItem["userName"];
            }
          }
        }
        tbody = data["deps"];
        this.tableData={"thead":[],"tbody":[]};
        this.tableData.thead = thead;
        this.tableData.tbody = tbody;
        if(this.tableData.thead.length*this.otherWdt<this.params.dynamicWt){
          this.otherWdt='';
        }
        if(this.tableData.tbody.length==0){
          this.mess = "没查到相关的轮转安排!";
        }
      },


      //格式化表头显示
      handleRenderHeader(h, { column, $index }){
        let label = column.label;
        if($index==0){
            let htlFirst = h("div");
            htlFirst.text="temp";
            setTimeout(()=>{
              let elmFirst = htlFirst["elm"];
              elmFirst.innerHTML = "<div style='text-align: right;float: right;'>时间</div><div style='padding: 0;float: left;margin-top: 10px;'>科室</div>";
            },10)

            label=htlFirst;
        }
        return label;
      },

      setTableData(val){
        let util = this.$util
        let option = util._.defaultsDeep({},this.listMessByDepTitle);
        val = util._.defaultsDeep({},val);
        val = this.formDate(val, ['year'], 'yyyy');
        option.ajaxParams.params = Object.assign(option.ajaxParams.params,val);
        this.ajax(option);
      },

    },
    watch:{
      params(val){
       this.setTableData(val);
      }
    },
    created(){
      Util = this.$util;
      this.init();
    },
    mounted(){
    },
    components: {}
  }
</script>
