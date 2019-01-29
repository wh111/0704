<template>
    <div id="content" ref="content" class="table-head-content">
      <div class="el-popover"
           style="min-width: 920px;
           transform-origin: center bottom 0px;
            z-index: 2016;
            "
           ref="popover"
           v-if="popover"
           :style="{left:offset.left+'px',top:offset.top+'px','max-width':offset.width+'px','min-height':offset.height+'px' ,opacity:opacity}"
      >
        <div class="showCurrMess">
          <div v-for="(item,index) in data">
            <el-row :gutter="20" class="row-bg">
              <el-col :span="6"><p><strong>科室:</strong>{{item.courseDep}} </p></el-col>
              <el-col :span="6"><p><strong>授课地点:</strong>{{item.courseAddress}} </p></el-col>
              <el-col :span="6"><p><strong>授课对象:</strong> {{item.gradeNum+'级'+item.classNum+'班'}} </p></el-col>
            </el-row>
            <el-row :gutter="20" class="row-bg">
              <el-col :span="6"><p><strong>课程类型:</strong>{{item.courseType}}  </p></el-col>
              <!--<el-col :span="6"><p><strong>课程时间:</strong> {{item.activityTime}} </p></el-col>-->
              <el-col :span="6"><p><strong>授课老师:</strong> {{item.teachName}} </p></el-col>
            </el-row>
            <el-row :gutter="20" class="row-bg">
              <el-col :span="18"><p><strong>课程内容:</strong>{{item.courseContent}}  </p></el-col>
            </el-row>
            <el-row  class="row-bg">
              <el-col :span="3"><p><strong>课程资料:</strong> </p></el-col>
              <el-col :span="18"><upload-file  :show="true" :uploadFiles="item.fileList"></upload-file></el-col>
            </el-row>
            </br>
            <hr>
          </div>
          <div slot="reference" class="name-wrapper">
          </div>
        </div>
      </div>

      </el-popover>

      <div
        id="myTable"
        ref="myTable"
        class="pointer"

      >
        <el-table
          v-if="tableHeadList[0]"
          :data="tableData"
          :height="dynamicHt"
          :stripe="true"
          border
          @cell-mouse-enter="cellMouseEnter"
          @cell-mouse-leave="cellMouseLeave"
          style="width: 100%">
          <el-table-column
            fixed
            prop="weekIndex"
            label="周次"
            width="70">
          </el-table-column>
          <el-table-column
            fixed
            prop="date"
            label="日期"
            width="300">
            <template scope="scope">
              <el-icon name="time"></el-icon>
              <span style="margin-left: 10px">{{ scope.row.BeginTime}} ~{{ scope.row.EndTime }}</span>
            </template>
          </el-table-column>
          <el-table-column v-for="item in 7" :key="item" :label="'星期'+upper(item)">
            <el-table-column
              v-for="(amOrpM,mIndex) in tableHeadList"
              :key="mIndex"
              :label="mIndex?'下午':'上午'"
              width="150">
              <el-table-column
                v-for="(timeId,timeIndex) in amOrpM"
                :prop="item+'-'+timeId.timeId"
                :key="timeIndex"
                :label="timeId.timeId+''"
                width="100">
              </el-table-column>
            </el-table-column>

          </el-table-column>
        </el-table>
      </div>

  </div>
</template>
<script>
  export default{
      props:['headList','tableDataList','url','role'],
      data(){
          return{
            tableHeadList:[],
            tableData:[],
            timeOut:'',
            time:1000,
            popover:true,
            popoverData:'',
            offset:{
              left:0,
              top:0,
              width:'',
              height:'',
            },
            opacity:0,
            popoverOffset:{
              width:908,
                height:''
            },
            client:{
                left:'',
              top:'',
            },


            "data":[
//                {
//              "id":1,
//              "depId":2,
//              "depName":"内科",
//              "activityName":"教学查房",
//              "activityType":"理论",
//              "hostUserId":2,
//              "hostUserName":"张三",
//              "activityTime":"2017-03-31",
//              "activitySite":"教学楼三楼301室",
//              "activityUser":"呼吸科-住院医师",
//              "whetherNeedCases":"YES",
//              "casesName":"穿刺术",
//              "activityContent":"活动内容",
//              "activityUserType":"rotarydep",
//              "activityUserTypeValue":"2,3, 4",
//              "activityUserTypeValueName":"呼吸内科,消化内科, 血液内科",
//              "activityDepUserType":"",
//              "shouldUserCount":30,
//              "actuallyUserCount":10,
//              "timeIds":"1,2,3",
//              "recordTimes":"8:00-9:00,10:00-11:00，11:10-12:00",
//              "activityState":"nosubmit",
//              "fileList":[
//                {
//                  "fileId":"2",
//                  "fileName":"文件名称",
//                  "fileUrl":"www.baidu.com",
//                  "fileType":"txt"
//                }
//              ]
//            }
            ],
            dynamicHt: 100,
            //当前组件默认请求()数据时,ajax处理的 基础信息设置
           listMessTitle: {
              ajaxSuccess: 'updateList',
              ids:'',
              ajaxParams: {
                url: this.url.userGetCourse.path,
                params: {},
              }
            },
          }
      },
    created(){
      if(this.role=='XY'){
        this.listMessTitle.ajaxParams.url = this.url.weekSetUserGetCourse
      }else if(this.role=='LS'){
        this.listMessTitle.ajaxParams.url = this.url.teacherGetCourse
      } else if(this.role=='JYC'){
        this.listMessTitle.ajaxParams.url = this.url.WeekSetManageGetCourse
      }
    },
    methods:{

      //数字转中文大写
      upper(number){
        switch (number){
          case 1: number = '一';
            break;
          case 2: number = '二';
            break;
          case 3: number = '三';
            break;
          case 4: number = '四';
            break;
          case 5: number = '五';
            break;
          case 6: number = '六';
            break;
          case 7: number = '日';
            break;
        }
        return number;
      },

      //鼠标进入
      cellMouseEnter(row, column, cell, event){
        if(!row[column.property]) return;
        let ids = row[column.property+'-id'];
        this.timeOut = setTimeout(() =>{
          let clientWidth = document.body.clientWidth;
          let clientHeight = 500  ;
          this.offset.width = clientWidth/2;
          this.offset.height = clientHeight/2;
            cell = cell.getBoundingClientRect();
            let popoverOffset = this.popoverOffset;
            let left = cell.left-(popoverOffset.left||335);
            let top = cell.top-popoverOffset.top+cell.height;

          if(left+popoverOffset.width/2>=clientWidth-left){
            this.offset.left = left-(left+popoverOffset.width/2-(clientWidth-left));
          }else {
            this.offset.left =left/2;
          }
          if(this.dynamicHt/2<top){
            this.offset.top = 0;
          }else {
            this.offset.top = top;
          }

            this.listMessTitle.ids = ids;
             let listMessTitle =  this.getFormData(this.listMessTitle)
            listMessTitle.ajaxParams.params = {courseArrangeIds:ids};
            this.ajax(listMessTitle)
        },this.time)
      },

      //鼠标移出
      cellMouseLeave(row, column, cell, event){
        if(!row[column.property]) return;
            clearTimeout(this.timeOut);
        this.popover=false;

      },


      //请求成功
      updateList(res,m){
        if(this.listMessTitle.ids!=m.ids){
            return;
        }else {
          if(res.data==0){
              this.showMess('无课程资料');
              return;
          }
          this.data = res.data;
            this.popover=true;
        }
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = this.$util._.defaultsDeep({},data);
        return myData;
      },

      //转义
      trope(type){
          switch(type){
            case 'rotarydep': type='轮转科室';
              break;
            case 'partuser': type='部分人员';
              break;
            case 'partrole': type='部分角色';
              break;
            case 'alluser': type='所有人员';
              break;
        }
        return type;

      },

      //设置表格及分页的位置
      setTableDynHeight(){
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },
    },

    watch:{
      headList(val){
          this.tableHeadList = val;
      },
      tableDataList(val){
        this.tableData = val;
      },
    },
    mounted(){
      this.popoverOffset = this.$refs.popover.getBoundingClientRect();
      setTimeout(()=>{this.popover=false;this.opacity=1},200)
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = this.$util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    }

  }
</script>

