<!----------------------------------
****--课程表预览(syllabusView_list)
****--@date     2017/6/17
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
  <div><el-form  label-width="80px" class="demo-ruleForm">
    <el-row style="margin-top: 10px">
      <el-col  :span="8" >
        <el-form-item label="开始时间" prop="name" >
          <el-date-picker
            v-model="formValidate.courseBeginTime"
            type="date"
            :editable="false"
            placeholder="选择日期"
            :clearable="false"
            :picker-options="pickerOptions0"
            @change="handleStartTime"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8" >
        <el-form-item label="结束时间" prop="name" >
          <el-date-picker
            v-model="formValidate.courseEndTime"
            align="right"
            type="date"
            :clearable="false"
            :editable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions1"
            @change="handleEndTime">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col v-if="this.role=='JYC'" :span="6" >
        <el-form-item label="科室" prop="name" >
          <el-select v-model="formValidate.depId" placeholder="科室">
            <select-option  :type="'dep'"></select-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="2" >
          <el-button  @click="searchEvent">搜索</el-button>
      </el-col>
    </el-row>
  </el-form></div>
  <div id="content" ref="content" style="position: absolute;left:0;top: 85px;bottom: 0;right:6px;">
    <listHeaders
      :role="role"
      :headList="tableHeader"
      @mouseEnter="mouseEnter"
      @mouseLeave="mouseLeave"
      :url="api"
      :tableDataList="tableData">
    </listHeaders>
  </div>
</div>
</template>

<script>
  import listHeaders from './listHeaders.vue';
  import api from '../api.js';
  let Util = null;
  export default {
    props:['role'],
    data() {
      return {
        api,
        //查询表单
        listUrl: '',
        url:api.teachCourseTime.path,
        tableData: [],
        tableHeader: [

        ],

        formValidate: {
          courseBeginTime: '',//开始时间
          courseEndTime: '',//结束时间
          depId: '',//科室
        },
        date: {
          startStamp: '', //开始时间
          endStamp: '', //结束时间
          weekCount: '', //一周的累计
          index: 0,    //索引
          mistiming: 150, // 时间差  初始化的时候开始和结束时间未定
          timeOut:'',//定时
          time:1000,//定时时间
        },


        //当前组件默认请求(头部)数据时,ajax处理的 基础信息设置
        headerListMessTitle: {
          ajaxSuccess: 'updateHeaderList',
          ajaxParams: {
            url: api.teachCourseTime.path,
            params: {},
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        tableListMessTitle: {
          ajaxSuccess: 'updateTableList',
          ajaxParams: {
            url: api.WeekSetTimeTables+'/',
            params: {},
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
          //通过role来判断当前权限的是学员还是教育处，带教老师
        if(this.role=='XY'){
          this.tableListMessTitle.ajaxParams.url = this.api.WeekSetUserWeekSetTimeTables;
        }else if(this.role=='LS'){
          this.tableListMessTitle.ajaxParams.url = this.api.WeekSetTeacherWeekSetTimeTables;
        } else if(this.role=='JYC'){
          this.tableListMessTitle.ajaxParams.url = this.api.WeekSetTimeTables;
        }


        Util = this.$util;
        var myDate=new Date();
        let year = myDate.getFullYear();
        let start=this.parseDate(year+"-01-01");
        let end = this.parseDate(this.getFirstAndLastMonthDay(year,12));

        //ajax请求参数设置
         //初始化时间戳
        this.formValidate.courseBeginTime = start; //获得格式化的时间
        this.formValidate.courseEndTime = end;

        this.queryQptions = {
          url: this.listUrl
        }

        this.setTableData();
      },

      //获取当前月的第一天和最后一天:
      getFirstAndLastMonthDay( year, month){
          var   firstdate = year + '-' + month + '-01';
          var  day = new Date(year,month,0);
          var lastdate = year + '-' + month + '-' + day.getDate();//获取当月最后一天日期
          //给文本控件赋值。同下
          return lastdate;
        },


  //通过get请求列表数据
      setTableData(){
          this.date= {
          startStamp: '', //开始时间
            endStamp: '', //结束时间
            weekCount: '', //一周的累计
            index: 0,    //索引
            mistiming: 150, // 时间差  初始化的时候开始和结束时间未定
            timeOut:'',//定时
            time:1000,//定时时间
        };
        this.date.weekCount = this.getWeek(this.formValidate.courseBeginTime); //开始时间所在的星期

        this.calculate(this.formValidate.courseBeginTime,this.formValidate.courseEndTime);
//        this.date.startStamp = this.formValidate.courseBeginTime;
//        this.date.endStamp =this.formValidate.courseEndTime;
        let formValidate = this.formDate(Util._.defaultsDeep({},this.formValidate),['courseBeginTime','courseEndTime'],this.yearMonthData);
        this.tableListMessTitle.ajaxParams.params = Object.assign( this.tableListMessTitle.ajaxParams.params,formValidate);
        this.ajax(this.headerListMessTitle);  //请求头部
        this.ajax(this.tableListMessTitle);     //请求列表数据
      },


      //获取表头数据成功
      updateHeaderList(res){
        this.tableHeader =  this.decomposeHead(res.data);
      },

      //获取列表数据成功
      updateTableList(res){
        let data =res.data ;
        data = this.convertData(data);
        this.tableData = this.disposeTableData(this.getFormData(data));
      },


      //转换数据
      convertData(data){
          if(data==0)return data;
          let convertArr = [];
        let tempArr = [];
        for(let i in data){
           data[i].time= i ;
          convertArr.push(data[i]);
        }

        if(tempArr.length>1){
          tempArr.sort(function(a,b){
            let lost = this.timestamp(a.time);
            let next = this.timestamp(b.time);
            return b-a;
          });
        }
        for(let i =0;i< convertArr.length;i++){
          let time= convertArr[i].time;
          let day = convertArr[i];

          for(let k in day){
              if(typeof day[k]=='string')continue;
            let timeId = day[k];
            let obj= {
              activityTime:time,
              recordTimeIds:k.split('-')[1],
              activityId :[],
              activityName :[],
            };
              for(let l=0;l<timeId.length;l++){
                obj.activityId.push(timeId[l].courseArrangeId);
                obj.activityName.push(timeId[l].courseContent);
              }
            obj.activityId = obj.activityId.join(',');
            obj.activityName = obj.activityName.join(';');

              tempArr.push(obj)
          }
        }
          return tempArr
      },



      //处理表单数据
      disposeTableData(data){
        let tableData = [{BeginTime:'',EndTime:'',}]
        let ascending =this.date.startStamp ;
        let end = this.date.endStamp;
        let length=1;
        let index = this.date.index;
        let weekCount = this.date.weekCount;
        let activityBeginTime =  this.formValidate.activityBeginTime;
        let activityEndTime =  this.formValidate.activityEndTime;
        let key ;
        let recordTimeIds;
        //先把第一个对象数据填满
        tableData[index].BeginTime = this.getDate(ascending);
        tableData[index].EndTime = this.countDate(ascending,weekCount);
        tableData[index].weekIndex = this.theWeek(ascending);
        let cell ='';
        while (weekCount<8){
          if(data[0]&& data[0].activityTime.replace(/(^\s*)|(\s*$)/g, "")== this.getDate(ascending).replace(/(^\s*)|(\s*$)/g, "")){
            cell =  data.shift();
            recordTimeIds = cell.recordTimeIds.split(',');
            for(let i=0;i<recordTimeIds.length;i++){
              key = weekCount+'-'+recordTimeIds[i];
              tableData[index][key] = cell.activityName;  //为tableData添加内容
              tableData[index][key+'-id'] = cell.activityId;
            }
          }else {
            weekCount++;
            ascending = ascending+86400000;

          }
        }
        //再把第其余对象数据填满
        while (ascending<=end){
          if(weekCount>7){
            weekCount=1;
            index++;
            tableData.push({});
            tableData[index].BeginTime = this.getDate(ascending);
            tableData[index].EndTime = this.countDate(ascending,weekCount);
            tableData[index].weekIndex = this.theWeek(ascending);
          }else {
            if(data[0] && data[0].activityTime.replace(/(^\s*)|(\s*$)/g, "") == this.getDate(ascending).replace(/(^\s*)|(\s*$)/g, "")){  //2017-04-04判定
              cell =  data.shift();
              recordTimeIds = cell.recordTimeIds.split(',');
              for(let i=0;i<recordTimeIds.length;i++){  //拆分合并的单元格
                key = weekCount+'-'+recordTimeIds[i];
                tableData[index][key] = cell.activityName;  //为tableData添加内容
                tableData[index][key+'-id'] = cell.activityId;
              }
            }else {
              weekCount++;
              ascending = ascending+86400000;
            }
          }

          if(tableData.length==length*20||ascending<end){
            length++;
            this.tableData = tableData
          }
        }

        return tableData
      },
      //鼠标进入单元格
      mouseEnter(ids){
        this.date.timeOut = setTimeout(() =>{
        },this.date.time)
      },
      mouseLeave(ids){
        clearTimeout(this.date.timeOut)
      },


      //统计时间
      countDate(startStamp,weekCount){
        let endStamp;
        let residue = 7-  weekCount;
        endStamp =  startStamp +  residue*86400000;
        if(endStamp>this.date.endStamp)endStamp = this.date.endStamp;
        return this.getDate(endStamp)

      },


      //计算指定时间，算出开始和结束时间
      calculate(start, end){
        let endTime;
        let startTime;
        if (!end) {
          endTime = this.date.endStamp = this.timestamp();
        } else {
          endTime = this.date.endStamp = this.timestamp(end);
        }
        if (!start) {
          startTime = this.date.startStamp = this.timestamp() - this.date.mistiming * 86400000;
        } else {
          startTime = this.date.startStamp = this.timestamp(start);
        }

      },

      //获取指定时间的时间戳

      timestamp(date){
        let timestamp
        if(navigator.userAgent.indexOf("Firefox")>0){  //解决火狐兼容性问题
//          date &&(date =date+'T09:00:00') ;
          timestamp = date ? Date.parse(date) : new Date().getTime() ;
        }else {
          timestamp = date ? new Date(date).getTime() : new Date().getTime() ;
        }
        return timestamp ;

      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep([],data);
        return myData;
      },

      //获取当前时间属于星期几
      getWeek(date){
        if(navigator.userAgent.indexOf("Firefox")>0){
//          date &&(date =date+'T09:00:00');
          date = date ? Date.parse(date) : new Date().getTime();
        }
        let week;
        let time = new Date(date);

        week = time.getDay();
        switch (week) {
          case 0 :
            week = 7;
            break;
          case 1 :
            week = 1;
            break;
          case 2 :
            week = 2;
            break;
          case 3 :
            week = 3;
            break;
          case 4 :
            week = 4;
            break;
          case 5 :
            week = 5;
            break;
          case 6 :
            week = 6;
            break;
        }
        return week;
      },


      //js获取当前日期在当前年所属第几周
      theWeek(date) {
        let totalDays = 0;
        let now = new Date(date);
        let years = now.getYear();
        if (years < 1000)
          years += 1900
        let days = new Array(12);
        days[0] = 31;
        days[2] = 31;
        days[3] = 30;
        days[4] = 31;
        days[5] = 30;
        days[6] = 31;
        days[7] = 31;
        days[8] = 30;
        days[9] = 31;
        days[10] = 30;
        days[11] = 31;

        //判断是否为闰年，针对2月的天数进行计算
        if (Math.round(now.getYear() / 4) == now.getYear() / 4) {
          days[1] = 29
        } else {
          days[1] = 28
        }

        let y = now.getFullYear();
        let dt = new Date(y+"-01-01");
        let weekNum = dt.getDay();
        let d = 0
        if(weekNum==0){
          d = 6
        }else{
          if(week!=1){
            d = weekNum-1;
          }
        }
        totalDays = d;
        if (now.getMonth() == 0) {
          totalDays = totalDays + now.getDate();
        }else {
          /*let curMonth = now.getMonth();
          totalDays = totalDays + days[curMonth-1] + now.getDate();*/
          let curMonth = now.getMonth();
          for (let count = 1; count <= curMonth; count++) {
            totalDays = totalDays + days[count - 1];
          }
          totalDays = totalDays + now.getDate();
        }
        //得到第几周
        let week = Math.ceil(totalDays / 7);
//        week=week+1;
        return week;
      },


      //把获取的头部信息分为上午 下午 以courseType划分  并排序
      decomposeHead(data){
        if (!this.valDataType(data, 'Array')) {
          this.errorMess('活动时间段格式错误');
          return;
        }
        let arr = [[], []];
        for (let i = 0; i < data.length; i++) {
          if (!data[i].courseType) {
            arr[0].push(data[i])

          } else {
            arr[1].push(data[i])
          }
        }
        for (let i = 0; i < arr.length; i++){
          arr[i].sort(function(a,b){
            return a.timeId-b.timeId});
        }
        return arr;
      },


      //获取时间 1990-01-02
      getDate(date){
        return this.conductDate(date,'yyyy-MM-dd');
      },

      searchEvent(isLoading){
        //        isLoading(true);
          this.setTableData()
      },


    },
    created(){
      this.init();
    },
    components:{
      listHeaders,
    }
  };

</script>
