<template>
  <!-- 查看分析策略 -->
  <div>
    <el-form :inline="true" :model="formValidate" ref="formValidate">
      <el-form-item label="策略名称：" prop="title">
        {{ formValidate.title }}
      </el-form-item>
      <fieldset>
        <legend style="font-size:16px">&nbsp;&nbsp;分析对象设置&nbsp;&nbsp;</legend>
        <el-form-item label="分析对象：">
          {{ formValidate.objType | synthesizeStatistics }}
        </el-form-item>
        <p></p>
        <el-form-item label="分析报告基本信息展示：">
          {{ formValidate.viewContent }}
        </el-form-item>
        <p></p>
        <el-form-item label="分析报告数据查询内容：">
          {{ formValidate.queryContent }}
        </el-form-item>
      </fieldset>
      <fieldset style="margin-top:20px">
        <legend style="font-size:16px">&nbsp;&nbsp;分析数据来源&nbsp;&nbsp;</legend>
        <el-table align="center" :context="self" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
          <el-table-column label="名称" prop="activityName" show-overflow-tooltip></el-table-column>
          <el-table-column label="评价时间" prop="timeText" show-overflow-tooltip>
            <template scope="scope">
              {{ getTimeText(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="评价人" prop="appraiser" show-overflow-tooltip>
            <!--<template scope="scope">-->
              <!--{{ scope.row.appraiser && scope.row.appraiser.split('=')[1] }}-->
            <!--</template>-->
          </el-table-column>
          <el-table-column label="被评价人" prop="evaluated" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.evaluated  }}
              <div v-if="show"></div>
            </template>
          </el-table-column>
          <el-table-column label="权重" prop="weight"></el-table-column>
        </el-table>
      </fieldset>
    </el-form>
  </div>
</template>

<script>
  let Util;
  import api from './api';
  export default {
    props: ['operailityData'],
    data() {
      return {
        viewContent: [], // 分析报告基本信息展示
        queryContent: [], // 分析报告数据查询内容
        //form表单bind数据
        show:false,
        formValidate: {
          "title": "",
          "objType": "",
          "obj": "",
          "viewContent": "",
          "queryContent": "",
          "strategyResourceDtoList": [
            // {
            //   "activityId": 2,
            //   "weight": 1
            // },
            // {
            //   "activityId": 2,
            //   "weight": 3
            // }
          ]
        },
        // 表格
        self: this,
        tableData: [], // 表格数据
        scoreSelectData: [], // 评分项

      }
    },
    methods: {
      // 获取评价时间描述文本
      getTimeText({dateType,startDay,endDay,startDate,endDate}){
        let date='' ;
        switch (dateType){
          case 1:date = `出科前${startDay}天——后${endDay}天评价一次`;
            break;
          case 2:date = `每周${startDay}——周${endDay}评价一次`;
            break;
          case 3:date = `每月${startDay}日——${endDay}日评价一次`;
            break;
          case 4:date = `${startDate}~${endDate}`;
            break;
          case 5:date = `每天评价一次`;
            break;
          case 6:date = `每季度评价一次`;
            break;
          case 7:date = `每半年评价一次`;
            break;
          case 8:date = `每年评价一次`;
            break;
        }
        return date;
      },
      // 从服务器获取数据
      getDataForServer() {
        let opt = {
          ajaxSuccess: 'getDataForServerSuccess',
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method,
          }
        };
        this.ajax(opt)
      },
      // 成功获取数据
      getDataForServerSuccess(res) {
        this.viewContent = (res.data.viewContent || '').split(',');
        this.queryContent = (res.data.queryContent || '').split(',');
        this.formValidate = res.data;
        let data = res.data.strategyResourceDtoList;
        for (let i = 0, l = data.length; i < l; i++) {
//          data[i].timeText = this.getTimeText(data[i]);
          this.getSelectDataInfo(i,data[i].activityId ,data)
        }
        this.tableData = res.data.strategyResourceDtoList;
      },
      // 根据选择的评分表获取详细信息
      getSelectDataInfo(index, id,data) {
        if (!id) {
          return
        }
        if(!data){
          data = this.tableData
        }
        this.ajax({
          ajaxSuccess: res => {
          this.$nextTick(function () {

            data[index].appraiser =this.conductRole(res.data.appraiser,res.data,0) ; // 评价对象
            data[index].evaluated =this.conductRole(res.data.evaluated,res.data,1) ; // 评价对象
//              data[index].evaluated = res.data.evaluated; // 被评价对象
            data[index].timeText = this.getTimeText(res.data); // 评价时间
            this.show = !this.show;
          })
        },
        ajaxParams: {
          url: api.getActivity.path + id,
            method: api.getActivity.method,
            params: {
            id
          }
        }
      })
      },

      conductRole(data,item,index){
        if(item.relationship== 'NO'&&!data){
          return '所有人'
        }
        if(item.relationship== 'LOOP'){
          let tempArr=[['学生','老师'],['学生','科室'],['老师','学生']];
          return tempArr[item.loopType-1][index]
        }

        let tempArr=[]
        if(typeof data == 'string'){
          data=data.split(',')
          for(let i=0;i<data.length;i++){
            let temp=data[i].split('=');
            tempArr.push(temp[1]);
          }
        }
        return tempArr.join(' ; ');
      },
      /*
       * 组件初始化入口
       * */
      init() {
        Util = this.$util;
        this.getDataForServer();
      },
    },
    created() {
      this.init()
    }
  }

</script>

<style>
  /* 编辑分析策略 */

</style>
