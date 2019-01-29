<!--评分表-->
<template>
  <div>
      <div  class="add-scope  to-channel" >
        <el-table
          v-if="body[0]"
          :data="body"
          border
          @cell-click="cellClick"
          :max-height="500"
          :row-class-name="tableRowClassName"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            fixed
            width="80">
          </el-table-column>
          <!--<el-table-column-->
          <!--label="操作"-->
          <!--width="180">-->
          <!--<template scope="scope">-->
          <!--<el-button size="small" type="danger" @click="remove(scope.$index,scope.row)">删除</el-button>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column
            v-for="(item,index) in header"
            :key="index"
            :prop="item.key"
            :label="item.label"
            align="center"
            show-overflow-tooltip
            :width="this.width||180">
            <template scope="scope">
              <span v-if="!scope.row[item.key+'edit']">{{scope.row[item.key]}}</span>
              <el-input v-else v-model="scope.row[item.key]"></el-input>
            </template>
          </el-table-column>
        </el-table>
        </br>
        <el-table
          v-if="error[0]"
          :max-height="300"
          :data="error"
          style="width: 100%">
          <el-table-column
            prop="seq"
            label="行数"
            align="center"
            width="200">
          </el-table-column>
          <el-table-column
            prop="errorMessage"
            label="错误提示"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="10" :offset="10">
            <div style="margin-top: 20px">
              <load-btn @handleToChannel="confirm" :btnData="loadBtn"></load-btn>
              <el-button  @click="cancel">取消</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
  </div>
</template>
<script>
  export default {

    /*title ：按钮文字
     *
     * format：格式化数据  把中文转换成英文
     *
     * 如 {
     //        "设备名称":"deviceTypeName",
     //        "设备编号":"deviceIdentifier",
     //        "单价":"price",
     //        "购买日期":"purchaseTime",
     //        "厂商电话":"manufacturerPhone",
     //        "维修电话":"servicingPhone",
     //        "所在位置":"storageLocation",
     //        "购买地址":"buyAdderss",
     //        "生产日期":"manufactureDate",
     //        "保修截止日期":"guaranteeDate",
     //        //"状态":"status",
     //        "描述":"describes"
     //      }
     *
     *
     * width :  单元格宽度
     * height :  最小高度
     * */
    props:['format','height','url','data','extra','id','treeRoad','date','headerData'],
    data(){

      return{
        //保存按钮基本信息
        loadBtn:{title:'确定',callParEvent:'handleToChannel'},
//        widths:'',
        body:[],
        header:[],
        formats:[],
        oldErrorList:[],   //保存的是错误的行号
        row:this.rows||0,  //省略头部行数
        old:{
          oldRow  :{} ,  //上一次点击的row
          oldKey:'',  //上一次点击的key
        },
        tempArr:[],// 初始的时候临时body
        error:[],
        errorHeader:[
          {
            label:'行数',
            key:'seq'
          },
          {
            label:'错误提示',
            key:'errorMessage'
          }
        ],

//        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
//        toMessTitle:{
//          type:'edit',
//          successTitle:'导入成功',
//          errorTitle:'导入失败,请修改',
//          ajaxSuccess:'ajaxSuccess',
//          ajaxParams:{
//            jsonString:true,
//            url:'/user/import/user',
//            method:'post',
//            data:[]
//          }
//        },



      }
    },
    created(){
      if(this.format){
        this.formats = this.format
      }
      if(!this.url){
        this.showMess('地址不能为空');
        return;
      }
      this.header =this.formatHeader(this.data.header) ;
      this.formatBody(this.data.body) ;
    },
    methods: {
      /*  确定
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      confirm(isLoadingFun){
        this.ajaxCreateLoading(true);
        isLoadingFun(true);
          //处理将要提交的数据
        let queryData = this.conductQueryData(this.body==0?this.tempArr:this.body)


        let that = this;
        //处理服务数据
        let myPromise = that.$util.queryData({
          jsonString:true,
          url:(this.url),
          method:'post',
          data:queryData
        })();
        myPromise.then(function (res) {
          let responseData = res.data;
          let data = responseData.data
          if(that.$util._.isObject(responseData["status"])&&responseData["status"]["code"]==0){
            that.$emit('success',that.body);
            that.successMess('导入成功')
          }else if(that.$util._.isObject(responseData["status"])&&responseData["status"]["code"]==52){
            that.conductError(data);
            that.errorMess('导入失败，请修改')
          }else {
            that.errorMess('系统错误')
          }
          isLoadingFun(false);
          that.ajaxCreateLoading(false);
        }).catch(function(error){
          if (error.response) {
            isLoadingFun(false);
             that.ajaxCreateLoading(false);
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            util.handleAjaxError(that,error.response.status+'');
          } else if (error.request) {
            isLoadingFun(false);
            that.ajaxCreateLoading(false);
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            that.errorMess(error.request);
          } else {
            isLoadingFun(false);
            that.ajaxCreateLoading(false);
            // Something happened in setting up the request that triggered an Error
            that.errorMess(error.message);
          }
        })
      },

      //处理将要提交的数据
      conductQueryData(data){
       let  queryData = this.$util._.defaultsDeep([], data);
        return queryData;
      },


      analysisErrorData(data){

          let tempArr = [];
          let index = 0;
          let countArr = []
          for (let i=0;i<data.length;i++){
              if(data[i].errorMsgList == null){
                data[i].errorMsgList=[];
              }
               tempArr.push(data[i]);
              index = tempArr.length-1;
            countArr.push(index);

          }
          for (let i=0;i<countArr.length;i++){
            if(tempArr[i].errorMsgList == null ||tempArr[i].errorMsgList == 0){
              tempArr.splice(i,1)
              i--;
            }
          }
          return tempArr
      },
      //处理错误
      conductError(data){
          //处理传过来的数据 变成数组包含对象，对象不会包含其他引用
         data =  this.analysisErrorData(data);


        let old = this.old;
        if(old.oldRow ){
          old.oldRow[old.oldKey+'edit'] = false;
        }

        let oldErrorList = this.oldErrorList;
        let bodyData = this.body;
//        this.body = [];  //制空
//        this.error = [];
        let error =[];

        if(oldErrorList[0]){//上一次错误的列表
          for (let i=0;i<oldErrorList.length;i++){
            bodyData[oldErrorList[i]].error = false;
          }
        }


        this.oldErrorList=[];

        for(let i=0;i<data.length;i++){
          this.oldErrorList.push(data[i].seq); //添加上错误行号；
          bodyData[data[i].seq].error = true;
          //添加错误列表
          error.push({  //添加
            seq:data[i].seq+1,
            errorMessage:data[i].errorMsgList.join(' , '),
          })
        }
//        if(old.oldRow ){
//          old.oldRow[old.oldKey+'edit'] = true;
//        }else {
//          bodyData[0].error = false;
//          bodyData[0].error = true;
//        }
        this.body = bodyData;
        this.error = error
      },

      //双击打开输入框并获取焦点
      cellClick(row,col,obj,a){
        let old = this.old;
        if(old.oldRow ){
          old.oldRow[old.oldKey+'edit'] = false;
        }
        let key = col['property'] ; // 当前点击的key值
        row[key+'edit'] = true;
        old.oldRow = row;
        old.oldKey = key;

      },

//      //点击上传
//      handleSelectedFile (convertedData) {
//
//        this.tableModal = true;
//      },

      //格式化Header 把中文转换成英文
      formatHeader(data){

        let format= this.formats;
        if(!format){
          this.showMess('format未定义');
          return  data;
        }
        let formats=[]
        let tempArr=[];
        for(let i=0;i<data.length;i++){
          tempArr.push({
            key   : format[data[i]],
            label : data[i]
          })
          formats.push(format[data[i]])
        }
        this.formats = formats;
        if(this.headerData){
          data  =this.headerData;
          let temp=[];
          for(let i=0;i<data.length;i++){
            temp.push({
              key   : format[data[i]],
              label : data[i]
            })
          }
          return  temp;
        }else {
          return  tempArr;
        }

      },

      //格式化body 把中文转换成英文
      formatBody(data){
        let format= this.formats;
        let treeId = this.id;
        if(!format) return  data;
        let tempArr=[];
        for(let i=0;i<data.length;i++){
          let tempObj={};
          for( let key in format){
//            tempObj[format[key]]  = data[i][key].replace(/(^\s*)|(\s*$)/g, "");
            tempObj[format[key]]  = data[i][key];
            tempObj[format[key]+'edit']  = false;

          }
          if(this.extra){
            for (let k=0;k<this.extra.length;k++){
              tempObj[this.extra[i].key] = this.extra[i].label
            }
          }
          if(this.date){
            for(let l=0;l<this.date.length;l++){
              if(tempObj[this.date[l]]){
                tempObj[this.date[l]] = tempObj[this.date[l]].replace(/\//g,"-");
              }
            }
          }
          tempObj.error=false;
          tempArr.push(tempObj);
        }
        this.tempArr=tempArr;
//        this.confirm(function(){})
        //分段添加数据
        let len = tempArr.length;
        let that = this;
        that.body=[];
        for(let i=0,n=0;i<len;i+=100,n++){
          setTimeout(()=>{
            that.body= that.body.concat(tempArr.splice(0,100));
          },n*50)
        }

        this.formats = this.format;



//        return  tempArr;
      },

      //取消弹窗

      cancel(){
        this.$emit('cancel')
      },

      remove(index,row){
        this.body.splice(index,1)

      },

      tableRowClassName(row, index) {
        if(row.error){
          return 'positive-row'
        }
      }
    }
  }
</script>
