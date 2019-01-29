<!--
****--@file     financialStatistics
****--@date     2018/7/28 11:13
****--@author   ${王恒}
****--@describe   经费统计
-->
<template>
  <div ref="content">
    <el-form :inline="true">
      <el-row>
        <el-col :span="24" align="right">
          <el-form-item label="资金库名称：">
          <el-input v-model="searchObj.fundName"></el-input>
          </el-form-item>
          <el-form-item label="经费代码：">
          <el-input v-model="searchObj.fundCode"></el-input>
          </el-form-item>
          <el-form-item>
          <el-button type="info" @click="search">搜索</el-button>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
          </el-form-item>
        </el-col>
        <div v-show="searchMore" style="clear:both;text-align: right" ref="searchMore">
          <!--<el-form-item label="资金库：">
            <el-input v-model="searchObj.fundName" @focus="selectFund" icon="circle-close"
                      :on-icon-click="clearFundSelect"></el-input>
          </el-form-item>-->
          <!--<el-form-item label="项目名称：">
            <el-input v-model="searchObj.projectName"></el-input>
          </el-form-item>-->
          <!--<el-form-item label="报销类型：">-->
          <!--<el-select v-model="searchObj.accountingType" placeholder="请选择">-->
          <!--<el-option v-for="(item,index) in accountingType" :key="index" :label="item.value" :value="item.code">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="经费来源：">-->
          <!--<el-select v-model="searchObj.fundSource" placeholder="请选择">-->
          <!--<el-option v-for="(item,index) in fundSource" :key="index" :label="item.value" :value="item.code">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="出账或者入账：">-->
          <!--<el-select placeholder="请选择" v-model="searchObj.outOrEnter" clearable>-->
          <!--<el-option v-for="(item,index) in typeOption" :key="index" :label="item.label"-->
          <!--:value="item.value"></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="实报或发生：">-->
          <!--<el-select placeholder="请选择" v-model="searchObj.costType" clearable>-->
          <!--<el-option-->
          <!--v-for="item in options"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="报销时间：">
            <date-group :dateGroup="{text:'',startDate:searchObj.startTime,endDate:searchObj.endTime}">
              <el-date-picker name="start" v-model="searchObj.startTime" :editable="false" type="date"
                              placeholder="选择开始时间" :picker-options="pickerOptions0"
                              @change="handleStartTime"></el-date-picker>
              <span>-</span>
              <el-date-picker name="end" v-model="searchObj.endTime" :editable="false" type="date"
                              placeholder="选择结束时间" :picker-options="pickerOptions1"
                              @change="handleEndTime"></el-date-picker>
            </date-group>
          </el-form-item>
        </div>
      </el-row>
    </el-form>
    <!-- echarts -->
    <div id="myTable" ref="myTable" :style="'width:100%;height:'+tabHeight+'px'" class="statisticsBox">
      <div class="statisticsBox-statis">
        <!--经费来源构成-->
        <div id="fundSources" class="statistics-pic-box chart-panel" style="width: 49%;"></div>
        <!--经费报销类型构成-->
        <div id="fundType" class="statistics-pic-box chart-panel" style="width: 49%;"></div>
        <!--各资金库出/入账-->
        <div id="fundInAndOut" class="statistics-pic-box chart-panel"></div>
        <!--各资金库入账趋势-->
        <div v-if="searchObj.outOrEnter=='ENTER'||searchObj.outOrEnter==''" id="fundInput"  class="statistics-pic-box chart-panel"></div>
        <!--各资金库出账趋势-->
        <div v-if="searchObj.outOrEnter=='OUT'||searchObj.outOrEnter==''" id="fundOuput" class="statistics-pic-box chart-panel"></div>
      </div>
    </div>
  </div>
</template>
<script>
import api from './api';
import echarts from "echarts";
import typeOption from '../revealingManagement/typeOption';
import selectDepTree from '../../../common/selectTree';
import selectFund from '../capitalLibraryManagement/capitalLibraryManagement_select.vue';
import show from '../revealingManagement/revealingManagement_view.vue';
//当前组件引入全局的util
let Util = null;
export default {
data() {
return {
typeOption,
deriveModal:false,
searchMore: false,
accountingType: [], // 报销类型
fundSource: [],  // 经费来源
recordType:[],  //记录类型
//实报、发生总额类型
options: [{
value: '1',
label: '实报总额'
}, {
value: '2',
label: '发生总额'
}],
searchObj: {
"fundCode":"",              //经费代码
"accountingType":"",        //报销类型
"fundSource":"",            //经费来源
"outOrEnter":"",            //出入账 OUT
"startTime": this.getInitDate().startTime,              // 开始时间
"endTime":  this.getInitDate().endTime,                // 结束时间
"accountingIds":"",         //出入账id
"userId":"",                //当前登录人id
"costType":"1",              //实报、发生总额类型
},
exportUrl:"",
headerContent: {
deriveId:{
id: 'deriveId',
title: '导出'
}
},
dynamicHt: 100,
tabHeight: 0,
self: this,
loading: false,
multipleSelection: [],
tableData: [],
totalCount: 0,
}
},
methods: {
//初始化请求列表数据
init() {
Util = this.$util;
//ajax请求参数设置
this.myPages = Util.pageInitPrams;

this.queryQptions = {
url: api.analysisList.path,
params: {}
}
this.getAccountingType();
this.getFundSource();
this.getRecordType();

this.setTableData()
},
getInitDate(){
let myDate = new Date();//获取系统当前时间
let dy = myDate.getFullYear();
let dm = myDate.getMonth() + 1;
dm = dm<10?'0'+dm:dm
let dd = myDate.getDate(); //获取当前日(1-31)
dd = dd<10?'0'+dd:dd
let startTime = dy+"-01-01";
let endTime = dy+"-"+dm+"-"+dd;
return {startTime:startTime,endTime:endTime}
},
// 获取经费报销类型
getAccountingType() {
let opt = {
ajaxSuccess: res => {
res.data.unshift({code: "", value: "全部"});
this.accountingType = res.data || []
},
ajaxError: () => this.errorMess('获取经费报销类型失败，请重试...'),
ajaxParams: {
url: api.getAccountingType.path,
method: api.getAccountingType.method
}
};
this.ajax(opt)
},
// 获取经费经费来源
getFundSource() {
let opt = {
ajaxSuccess: res => {
res.data.unshift({code: "", value: "全部"});
this.fundSource = res.data || []
},
ajaxError: () => this.errorMess('获取经费经费来源失败，请重试...'),
ajaxParams: {
url: api.getFundSource.path,
method: api.getFundSource.method
}
};
this.ajax(opt)
},
// 获取经费记录类型
getRecordType() {
let opt = {
ajaxSuccess: res => {
res.data.unshift({code: "", value: "全部"});
this.recordType = res.data || []
},
ajaxError: () => this.errorMess('获取经费经费记录失败，请重试...'),
ajaxParams: {
url: api.getRecordType.path,
method: api.getRecordType.method
}
};
this.ajax(opt)
},
/******************************** 按钮事件 *********************/


//导出
derive() {
this.getDeriveURL();
this.openModel('derive');
},

// 获取导出URL
getDeriveURL() {
let ids = [];
if(this.multipleSelection.length){
this.multipleSelection.map(item=>ids.push(item.accountingId))
}
let sltData = "?";
if(ids.length>0){
this.searchObj['accountingIds'] = ids.join(',')
}
this.searchObj['userId'] = this.userInfo.id
sltData += Util.serializeParams(this.searchObj)

this.exportUrl = '/api/'+api.ststExcelExport.path+sltData
},

//确定导出
affirmDerive() {
this.cancel('derive');
},


// 搜索
search() {
//判断是否跨年
let startYear = this.conductDate(this.searchObj.startTime, 'yyyy');
let endYear = this.conductDate(this.searchObj.endTime, 'yyyy');
if(startYear!==endYear){
this.errorMess("所选时间段不能跨年！")
return
}
this.setTableData()
},
// 筛选
showSearchMore() {
this.searchMore = !this.searchMore;
this.$nextTick(function () {
if (this.searchMore) {
this.tabHeight = this.dynamicHt - this.$refs.searchMore.offsetHeight;
} else {
this.tabHeight = this.dynamicHt
}
})
},
/********************************* 表格相关 *****************************/
/*
* 设置表格数据
* @param isLoading Boolean 是否加载
*/
setTableData(isLoading) {
Object.assign(this.queryQptions.params, this.searchObj);
let params = this.queryQptions.params;
params.expenseTime = this.conductDate(params.startTime, 'yyyy-MM-dd');
params.endTime = this.conductDate(params.endTime, 'yyyy-MM-dd');
this.ajax({
ajaxSuccess: 'listDataSuccess',
ajaxParams: this.queryQptions
}, isLoading)
},
// 数据请求成功回调
listDataSuccess(res, m, loading) {
this.totalCount = res.totalCount || 0;
if (res.data && res.data.length) {
res.data.map(item => item.id = item.accountingId);
}
this.tableData = res.data || [];

this.fundSources(this.tableData)
this.fundType(this.tableData)
this.fundInAndOut(this.tableData)
this.fundOuput(this.tableData)
this.fundInput(this.tableData)
},

//获取选择的年份
getYear(){
let year = this.conductDate(this.searchObj.startTime, 'yyyy');
return year+"年";
},

//经费来源构成 - 饼状图
fundSources(data){
data["totalAccountRatio"] = data["totalAccountRatio"] || [];
let myData = data["totalAccountRatio"].map(function (item) {
  item.outOrEnter=item.outOrEnter=='OUT'?'出账':'入账';
let {outOrEnter: name, money: value} = item;
return {name, value};
})
let option = {
title : {
text: '整体入账出账占比',
x:'left'
},
tooltip : {
trigger: 'item',
//formatter: "{a} <br/>{b} : {c} ({d}%)"
formatter: function (item) {
  console.log(item)
return item.seriesName+'<br />'+item.name+'：￥'+(Number(item.value)).toFixed(2)+' 元 ('+(Number(item.percent)).toFixed(2)+'%)'
}
},
toolbox: {
feature: {
saveAsImage: {}
}
},
legend: {
orient: 'vertical',
left: 'left',
  padding: 40,
  data: ['入账','出账']
},
series : [
{
name: '入账出账比例',
type: 'pie',
radius : '55%',
center: ['50%', '60%'],
data:myData,
itemStyle: {
emphasis: {
shadowBlur: 10,
shadowOffsetX: 0,
shadowColor: 'rgba(0, 0, 0, 0.5)'
},
}
}
]
};

if (option && typeof option === "object") {
let myEcharts = echarts.init(document.getElementById('fundSources'));
myEcharts.showLoading();
myEcharts.setOption(option,true);
myEcharts.hideLoading();
}

},

//经费报销类型构成 - 饼状图
fundType(data){
  data["detailAccountRatio"] = data["detailAccountRatio"] || [];
  let myData = data["detailAccountRatio"].map(function (item) {

let {fundName: name, money: value} = item;
return {name, value};
})
let option = {
title : {
text: '资金库占比',
x:'left'
},
tooltip : {
trigger: 'item',
//formatter: "{a} <br/>{b} : {c} ({d}%)"
formatter: function (item) {
return item.seriesName+'<br />'+item.name+'：'+(Number(item.value)).toFixed(2)+' 元 ('+(Number(item.percent)).toFixed(2)+'%)'
}
},
toolbox: {
feature: {
saveAsImage: {}
}
},
/*legend: {
orient: 'vertical',
left: 'left',
data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
},*/
series : [
{
name: '资金库占比',
type: 'pie',
radius : '55%',
center: ['50%', '60%'],
data:myData,
itemStyle: {
emphasis: {
shadowBlur: 10,
shadowOffsetX: 0,
shadowColor: 'rgba(0, 0, 0, 0.5)'
}
}
}
]
};

if (option && typeof option === "object") {
let myEcharts = echarts.init(document.getElementById('fundType'));
myEcharts.showLoading();
myEcharts.setOption(option,true);
myEcharts.hideLoading();
}
},

//各资金库出/入账 - 柱状图
fundInAndOut(data){
let xData = [];
let yEnterData = [];
let yOuterData = [];
data["accountOutOrEnter"] = data["accountOutOrEnter"] || [];
data["accountOutOrEnter"].map(function (item) {
let idx = xData.indexOf(item.fundName);
if (idx == -1) {
xData.push(item.fundName);
yOuterData.push(0);
yEnterData.push(0);
}

if(item.outOrEnter==='OUT'){
yOuterData[xData.indexOf(item.fundName)] = item.money;
}else{
yEnterData[xData.indexOf(item.fundName)] = item.money;
}
})

let option = {
title : {
text: '资金库历史趋势',
},
tooltip : {
trigger: 'axis',
formatter: function (item) {
let tempArr = [item[0].name];
for(var i=0,subItem;i<item.length;i++){
subItem = item[i];
let seriesName = subItem.seriesName+'：￥'+(Number(subItem.value)).toFixed(2)+' 元';
tempArr.push(seriesName)
}
return tempArr.join('<br />')
}
},
legend: {
data:['出账','入账'],
},
toolbox: {
feature: {
saveAsImage: {}
}
},
xAxis : [
{
type : 'category',
data : xData
}
],
yAxis : [
{
name: '金额',
type : 'value',
axisLabel: {
formatter:function(value){return (Number(value)/1000).toFixed(2)+"k";},
}
}
],
series : [
{
name:'出账',
type:'bar',
data: yOuterData,
},
{
name:'入账',
type:'bar',
data: yEnterData,
}
]
};

if (option && typeof option === "object") {
let myEcharts = echarts.init(document.getElementById('fundInAndOut'));
myEcharts.showLoading();
myEcharts.setOption(option,true);
myEcharts.hideLoading();
}
},

//各项资金库入账趋势 - 折线图
fundInput(data){
if(this.searchObj.outOrEnter=='OUT') return;
let legendData = []
let xAxisData = [1,2,3,4,5,6,7,8,9,10,11,12]
let fundNameData = {};
data["fundEnter"] = data["fundEnter"] || [];
data["fundEnter"].map(function (item) {
if(typeof fundNameData[item.fundName]=="undefined"){
legendData.push(item.fundName)
fundNameData[item.fundName] = [];
fundNameData[item.fundName].push(item)
}else{
fundNameData[item.fundName].push(item)
}
})

let option = {
title: {
text: '资金库入账趋势', // 图表标题
x: 'left'
},
tooltip: {
trigger: 'axis',
formatter: function (item) {
let tempArr = ['各资金库'+item[0].name+'月份入账'];
for(var i=0,subItem;i<item.length;i++){
subItem = item[i];
let seriesName = subItem.seriesName+'：￥'+(Number(subItem.value)).toFixed(2)+' 元';
tempArr.push(seriesName)
}
return tempArr.join('<br />')
}
},
legend: {
orient: 'vertical',
x: 'left',
top:'30px',
data: legendData //
},
grid: {
left: '10%',
right: '5%',
bottom: '3%',
containLabel: true
},
toolbox: {
feature: {
saveAsImage: {}
}
},
xAxis: {
name: '月',
type: 'category',
boundaryGap: false,
data: xAxisData // X轴年、月份
},
yAxis: {
name: '金额',
type: 'value',
axisLabel: {
formatter:function(value){return (Number(value)/1000).toFixed(2)+"k";},
}
},
series: []
};
for(var i=0,item;i<legendData.length;i++){
item = legendData[i];
let tempObj = {name: item,type: 'line',data: [0,0,0,0,0,0,0,0,0,0,0,0]}
for(var j=0,subItem;j<fundNameData[item].length;j++){
subItem = fundNameData[item][j];
let num = parseInt(subItem.month)
tempObj.data[num-1] = Number(subItem.money)//(Number(subItem.money)/1000).toFixed(2);
}
option.series.push(tempObj)
}

if (option && typeof option === "object") {
let myEcharts = echarts.init(document.getElementById('fundInput'));
myEcharts.showLoading();
myEcharts.setOption(option,true);
myEcharts.hideLoading();
}
},

//各项资金库出账趋势 - 折线图
fundOuput(data){
if(this.searchObj.outOrEnter=='ENTER') return;
let legendData = []
let xAxisData = [1,2,3,4,5,6,7,8,9,10,11,12]
let fundNameData = {};
data["fundOut"] = data["fundOut"] || [];
data["fundOut"].map(function (item) {
if(typeof fundNameData[item.fundName]=="undefined"){
legendData.push(item.fundName)
fundNameData[item.fundName] = [];
fundNameData[item.fundName].push(item)
}else{
fundNameData[item.fundName].push(item)
}
})

let option = {
title: {
text: '资金库出账趋势', // 图表标题
x: 'left'
},
tooltip: {
trigger: 'axis',
formatter: function (item) {
let tempArr = ['各资金库'+item[0].name+'月份出账'];
for(var i=0,subItem;i<item.length;i++){
subItem = item[i];
let seriesName = subItem.seriesName+'：￥'+(Number(subItem.value)).toFixed(2)+' 元';
tempArr.push(seriesName)
}
return tempArr.join('<br />')
}
},
legend: {
orient: 'vertical',
  x: 'left',
  top:'30px',
data: legendData //
},
grid: {
left: '10%',
right: '5%',
bottom: '3%',
containLabel: true
},
toolbox: {
feature: {
saveAsImage: {}
}
},
xAxis: {
name: '月',
type: 'category',
boundaryGap: false,
data: xAxisData // X轴年、月份
},
yAxis: {
name: '金额',
type: 'value',
axisLabel: {
formatter:function(value){return (Number(value)/1000).toFixed(2)+"k";},
}
},
series: []
};

for(var i=0,item;i<legendData.length;i++){
item = legendData[i];
let tempObj = {name: item,type: 'line',data: [0,0,0,0,0,0,0,0,0,0,0,0]}
for(var j=0,subItem;j<fundNameData[item].length;j++){
subItem = fundNameData[item][j];
let num = parseInt(subItem.month)
tempObj.data[num-1] = Number(subItem.money) //(Number(subItem.money)/1000).toFixed(2);
}
option.series.push(tempObj)
}
if (option && typeof option === "object") {
let myEcharts = echarts.init(document.getElementById('fundOuput'));
myEcharts.showLoading();
myEcharts.setOption(option,true);
myEcharts.hideLoading();
}
},

//设置表格及分页的位置
setTableDynHeight() {
let contenHeight = this.$refs.content.parentNode.offsetHeight;
let tableData = this.$refs.myTable;
let paginationHt = 0;
this.dynamicHt = contenHeight - tableData.offsetTop - paginationHt;
this.tabHeight = this.dynamicHt;
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
isSelected(isOnly) {
let len = this.multipleSelection.length;
let flag = true;
if (len == 0) {
this.showMess("请选择数据!");
flag = false;
}
if (len > 1 && isOnly) {
this.showMess("只能选择一条数据!")
flag = false;
}
return flag;
},
// 允许选择的行
canSelect(row) {
return true
},
/********************************* 弹窗相关 *****************************/
// 取消
cancel(targer) {
this[targer + 'Modal'] = false;
},
// 弹窗回调
subCallback(target, title, updata) {
this.cancel(target);
if (title) {
this.successMess(title);
}
if (!updata) {
this.setTableData();
}
},
/*
* 打开指定的模态窗体
* @param options string 当前指定的模态:"add"、"edit"
* */
openModel(options) {
this[options + 'Modal'] = true;
},
},
created() {
this.init();
},
computed: {
userInfo() {
let info = this.$store.getters.getUserInfo || {};
return info;
}
},
mounted() {
//页面dom稳定后调用
this.$nextTick(function () {
//初始表格高度及分页位置
this.setTableDynHeight();
//为窗体绑定改变大小事件
let Event = Util.events;
Event.addHandler(window, "resize", this.setTableDynHeight);
})
},
components: {
selectDepTree,
selectFund,
show,
}
}
</script>
<style scoped>
.statisticsBox{
  position: relative;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  overflow: auto;
}
/*.statisticsBox-left{
  width: 500px;
}*/
.statisticsBox-statis{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
.statistics-pic-top{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.statistics-pic-box{
  margin: 0 auto;
  width: 100%;
  height: 360px;
  border:2px solid #f5f5f5;
  position: relative;
  top: 16px;
  left: 0;
  bottom: 0;
  float: left;
  z-index: 100000;
}
</style>
