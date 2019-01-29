<!----------------------------------
****--麻醉科
****--@date     2017/7/4
****--@author   gx
----------------------------------->
<template>
    <div>
      <el-form  ref="formValidate"  class="demo-form-inline" label-width="130px" >
        <el-row class="table-back-one">
          <el-col :span="6" >
            <el-form-item label="科别:" prop="name" >
            {{operailityData.depName}}
            </el-form-item>
          </el-col>

          <el-col :span="6" >
            <el-form-item label="床号:" prop="cbedNo" >
              {{formValidate.cbedNo}}
            </el-form-item>
          </el-col>

          <el-col :span="6" >
            <el-form-item label="住院号:" prop="czyNo" >
              {{formValidate.czyNo}}
            </el-form-item>
          </el-col>

          <el-col :span="6" >
            <el-form-item label="日期:" prop="cjlDate" >
              {{formValidate.cjlDate}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="table-back-two">
          <el-col :span="6" >
            <el-form-item label="姓名:" prop="cname" >
              {{formValidate.cname}}
            </el-form-item>
          </el-col>

          <el-col :span="6" >
            <el-form-item label="性别:" prop="csex" >
              {{formValidate.csex}}
            </el-form-item>
          </el-col>

          <el-col :span="6" >
            <el-form-item label="年   龄:" prop="cage" >
              {{formValidate.cage}}
            </el-form-item>
          </el-col>

          <el-col :span="6" >
            <el-form-item label="体重:" prop="acaTz" >
              {{formValidate.acaTz}} KG
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="table-back-one">
          <el-col :span="6" >
            <el-form-item label="医保:" prop="name" >
              {{formValidate.acaIsybYes | typeText}}
            </el-form-item>
          </el-col>

          <el-col :span="6" >
            <el-form-item label="心功能:" prop="acaXgn" >
              {{formValidate.acaXgn}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="table-back-two">
          <el-col :span="12" >
            <el-form-item label="手术后诊断:" prop="acaSszd" >
              {{formValidate.acaSszd}}
            </el-form-item>
          </el-col>

          <el-col :span="12" >
            <el-form-item label="已施手术:" prop="acaYsss" >
              {{formValidate.acaYsss}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="table-back-one">
          <el-col :span="12" >
            <el-form-item label="麻醉前用药:" prop="acaMzqyw" >
              {{formValidate.acaMzqyw}}
            </el-form-item>
          </el-col>

          <el-col :span="12" >
            <el-form-item label="特殊情况:" prop="acaTsqk" >
              {{formValidate.acaTsqk}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="table-back-one">
          <el-col :span="12" >
            <el-form-item label="麻醉开始(时间):" prop="acaMzBegintime" >
              {{formValidate.acaMzBegintime}}
            </el-form-item>
          </el-col>

          <el-col :span="12" >
            <el-form-item label="麻醉终止(时间):" prop="acaMzEndtime" >
              {{formValidate.acaMzEndtime}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="table-back-one">
          <el-col :span="12" >
            <el-form-item label="手术开始(时间):" prop="acaSsBegintime" >
              {{formValidate.acaSsBegintime}}
            </el-form-item>
          </el-col>

          <el-col :span="12" >
            <el-form-item label="手术终止(时间):" prop="acaSsEndtime" >
              {{formValidate.acaSsEndtime}}
            </el-form-item>
          </el-col>
        </el-row>
        <div style="width: 1380px;overflow: auto;margin: 0 auto" class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
          <table :width=" mzStatusHeader.length==1?'100%':mzRecordHeader.length*150">
            <colgroup  v-for="(item,index) in mzRecordHeader">
              <col :name="'el-table_1_column_'+index" :width=" mzStatusHeader.length==1?'100%':150">
            </colgroup>
            <thead>
            <tr>
              <th class="cell" v-for="(item,index) in mzRecordHeader">
                {{item}}
              </th>
            </tr>
            </thead>
          </table>
          <div class="el-table__body-wrapper" style="max-height:400px;overflow-x: hidden;overflow-y: auto;" :style="'width:'+mzRecordHeader.length*150+'px'">
            <table   :width="mzRecordHeader.length*150">
              <colgroup  v-for="(item,index) in mzRecordHeader">
                <col name="'el-table_1_column_'+index" :width="150">
              </colgroup>

              <tbody  class="add-scope">
              <tr v-for="(item,index) in formValidate.mzRecord">
                <td v-for="(head,i) in item" :key="i">
                  {{item[i]}}
                </td>
              </tr>

              </tbody>
            </table>
            以上是使用麻醉药物的记录（每5分钟一个时间点）
          </div>
        </div>
        <div style="width: 1380px;overflow: auto;margin: 0 auto" class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
          <table :width= " mzStatusHeader.length==1?'100%':mzStatusHeader.length*150">
            <colgroup  v-for="(item,index) in mzStatusHeader">
              <col :name="'el-table_1_column_'+index" :width="mzStatusHeader.length==1?'100%':150">
            </colgroup>
            <thead>
            <tr>
              <th class="cell" v-for="(item,index) in mzStatusHeader">
                {{item}}
              </th>
            </tr>
            </thead>
          </table>
          <div class="el-table__body-wrapper" style="max-height:400px;overflow-x: hidden;overflow-y: auto;" :style="'width:'+mzStatusHeader.length*150+'px'">
            <table   :width="mzStatusHeader.length*150">
              <colgroup  v-for="(item,index) in mzStatusHeader">
                <col name="'el-table_1_column_'+index" :width="150">
              </colgroup>

              <tbody  class="add-scope">
              <tr v-for="(item,index) in formValidate.mzStatus  ">
                <td v-for="(head,i) in item" :key="i">
                  {{item[i]}}
                </td>
              </tr>

              </tbody>
            </table>
            以上部分是记录病人的麻醉状态（每5分钟一个时间点）
          </div>
        </div>
        <div style="width: 1380px;overflow: auto;margin: 0 auto" class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
          <table :width="aidDrugNameHeader.length==1?'100%':(aidDrugNameHeader.length+1)*150">
            <colgroup  v-for="(item,index) in mzRecordHeader.length+1">
              <col :name="'el-table_1_column_'+index" :width="aidDrugNameHeader.length==1?'100%':150">
            </colgroup>
            <thead>
            <tr>
              <th class="cell" :colspan="index==0&&2"  v-for="(item,index) in aidDrugNameHeader">
                {{item}}
              </th>
            </tr>
            </thead>
          </table>
          <div class="el-table__body-wrapper" style="max-height:400px;overflow-x: hidden;overflow-y: auto;" :style="'width:'+(aidDrugNameHeader.length+1)*150+'px'">
            <table   :width="(aidDrugNameHeader.length+1)*150">
              <colgroup  v-for="(item,index) in (aidDrugNameHeader.length+1)">
                <col name="'el-table_1_column_'+index" :width="150">
              </colgroup>
              <tbody  class="add-scope">
              <tr v-for="(item,index) in formValidate.aidDrugName">
                <td v-if="index==0" :rowspan="formValidate.aidDrugName.length">
                  出
                </td>
                <td v-for="(head,i) in item" :key="i">
                  {{item[i]}}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <el-row class="table-back-one">
          <el-col style="font-size: 18px;line-height: 78px;text-align: center" :span="1">
            入
          </el-col>
          <el-col :span="21">
            <el-row>
              <el-col style="line-height: 36px" :span="3">
                出血量（ML单位）
              </el-col>
              <el-col :span="4">
                <el-form-item prop="acaCxl" label-width="0">
                  {{formValidate.acaCxl}} ML
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col style="line-height: 36px" :span="3">
                出尿量（ML单位）
              </el-col>
              <el-col :span="4">
                <el-form-item prop="acaCnl" label-width="0">
                  {{formValidate.acaCnl}} ML
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <div style="width: 1380px;overflow: auto;margin: 0 auto" class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
          <table width= "100%">
            <colgroup  v-for="(item,index) in 2">
              <col :name="'el-table_1_column_'+index" width="50%">
            </colgroup>
            <thead>
            <tr>
              <th class="cell" >诱导药物名称</th>
              <th class="cell" >病人从进手术室开始到出手术室的过程记录</th>
            </tr>
            </thead>
          </table>
          <div class="el-table__body-wrapper" style="max-height:400px;overflow-x: hidden;overflow-y: auto;width:100%" >
            <table   width="100%">
              <colgroup  v-for="(item,index) in 2">
                <col name="'el-table_1_column_'+index" width="50%">
              </colgroup>
              <tbody  class="add-scope">
              <tr>
                <td>
                  <el-form-item prop="acaYdyw" label-width="0">
                    {{formValidate.acaYdyw}}
                  </el-form-item>
                </td>
                <td>
                  <el-form-item prop="acaShjl" label-width="0">
                    {{formValidate.acaShjl}}
                  </el-form-item>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <el-row class="table-back-one">
          <el-col :span="16" >
            <el-row>
              <el-col :span="10" >
                <el-form-item label="麻醉方法:" prop="acaMzff" >
                  {{formValidate.acaMzff}}
                </el-form-item>
              </el-col>
              <el-col :span="10" >
                <el-form-item label="手术体位:" prop="acaSstw" >
                  {{formValidate.acaSstw}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" >
                <el-form-item label="麻醉剂及剂量(维持):" prop="acaMzjl" label-width="150px" >
                  {{formValidate.acaMzjl}}
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="20" style="height:62px">
                <el-form-item label="术后镇疼方法:" prop="acaShzt" >
                  <el-checkbox-group v-model="formValidate.acaShzt">
                    <el-checkbox disabled :label="1" >一次性</el-checkbox>
                    <el-checkbox disabled :label="2">镇痛泵</el-checkbox>
                    (<el-checkbox  disabled :label="3">硬外</el-checkbox>
                    <el-checkbox  disabled :label="4 " >静脉</el-checkbox>
                    <el-checkbox disabled :label="5 " >皮下</el-checkbox>)
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20" style="height:64px">
                <el-form-item label="麻醉者:" prop="acaMzUser" >
                  {{formValidate.acaMzUser}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="手术者:" prop="acaSsUser" >
                  {{formValidate.acaSsUser}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="洗手:" prop="acaXs" >
                  {{formValidate.acaXs}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="巡回:" prop="acaXh" >
                  {{formValidate.acaXh}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="8" >
            <el-form-item label="全   血:" prop="acaQx" >
              {{formValidate.acaQx}} ml
            </el-form-item>
            <el-form-item label="成分输血" prop="acaCfxl" >
              {{formValidate.acaCfxl}} ml
            </el-form-item>
            <el-form-item label="代 血 浆" prop="acaDxj" >
              {{formValidate.acaDxj}} ml
            </el-form-item>
            <el-form-item label="总输入量:" prop="acaZsyl" >
              {{formValidate.acaZsyl}} ml
            </el-form-item>
            <el-form-item label="出 血 量:" prop="acaCxlo" >
              {{formValidate.acaCxlo}} ml
            </el-form-item>
            <el-form-item label="尿    量:" prop="acaNl" >
              {{formValidate.acaNl}} ml
            </el-form-item>
            <el-form-item label="其 他:" prop="acaQt" >
              {{formValidate.acaQt}} ml
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="table-back-two-d">
          <el-col :span="10" >
            <el-form-item label="相关证明材料:">
              <upload-file :uploadFiles="formValidate.fileList" :show="true"></upload-file>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!--审核历史列表-->
      <el-table
        v-if="formValidate.review && formValidate.review[0]"
        align="center"
        :height="200"
        :data="formValidate.review"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%;height: 100%">
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createUserName"
          label="审核人"
          width="200">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="审核时间"
          width="300">
        </el-table-column>
        <el-table-column
          prop="reviewMess"
          label="审核意见"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="spState"
          label="审核状态"
        >
          <template scope="scope">
            {{ scope.row.spState | typeText}}
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>
<script>
    /*当前组件必要引入*/

    //当前组件引入全局的util
    let Util = null;
    export default{
      props:['operailityData','url','podId'],
        data() {
            return {
              saveBtn: {title: '提交', callParEvent: 'saveSubEvent'},
              loadBtn: {title: '上报', callParEvent: 'appearSubEvent'},
              mzRecordHeader:['药物名称/使用的剂量'],  //药物名称/使用的剂量
              mzStatusHeader:['生命体征'],  //药物名称/使用的剂量
              aidDrugNameHeader: ['辅助输入的药品名称'],  //药物名称/使用的剂量
              isFirst:true,
              formValidate:{
              /*  "caseId":'',
                "cdepId":'',
                "cdepName":'',
                "cpodId":'',
                "createUserNmae":"",
                "cbedNo":"",
                "czyNo":"",
                "cjlDate":"",
                "cname":"姓名",
                "csex":"性别",
                "cage":"年龄",
                "acaTz":"体重",
                "acaIsybYes":"是否医保",
                "acaXgn":"心功能",
                "acaSszd":"手术后诊断",
                "acaYsss":"已施手术",
                "acaMzqyw":"麻醉前用药",
                "acaTsqk":"特殊情况",
                "acaMzBegintime":"2012-02-03 12:15:10",
                "acaMzEndtime":"2012-02-03 12:15:10",
                "acaSsBegintime":"2012-02-03 12:15:10",
                "acaSsEndtime":"2012-02-03 12:15:10",
                "mzRecord":[
                ],
                "mzStatus":[
                ],
                "aidDrugName":[
                ],
                "acaCxl":"出血量",
                "acaCnl":"出尿量",
                "acaYdyw":"诱导药物名称",
                "acaShjl":"病人从进手术室开始到出手术室的过程记录",
                "acaMzff":"麻醉方法",
                "acaSstw":"手术体位",
                "acaMzjl":"麻醉剂及剂量",
                "acaShzt":[
                  1,
                  2,
                  3
                ],
                "acaMzUser":"麻醉者",
                "acaSsUser":"手术者",
                "acaXs":"洗手",
                "acaXh":"巡回",
                "acaQx":"全血",
                "acaCfxl":"成分输血",
                "acaDxj":"代 血 浆",
                "acaZsyl":"总输入量",
                "acaCxlo":"出 血 量",
                "acaNl":"尿 量",
                "acaQt":"其 他",
                "fileList":[
                  {
                    "id":11,
                    "fileName":"123",
                    "fileType":"txt",
                    "fileUrl":"www.baidu.com"
                  }
                ],
                "review":[
                  {
                    "createUserName":"审核人",
                    "createTime":"审核时间",
                    "reviewMess":"审核意见",
                    "spState":"审核状态(PASS 通过 REJECT 驳回)"
                  }
                ]*/
              },
              listMessTitle:{
                ajaxSuccess:'SuccessGetCurrData',
                ajaxParams:{
                  url:this.url.caseRecordAnesthesiaGet+this.operailityData.cid,
                }
              },
            }


        },
        methods: {
            //初始化请求列表数据
            init(){
              //获取当前登录人
              let userInfo = this.$store.getters.getUserInfo;
              this.formValidate.createUserNmae= userInfo.name;
               this.ajax(this.listMessTitle);
            },


          SuccessGetCurrData(res){
            let data = res.data;
            if(!data) return;
            for(let key in data){
              if(data[key]=='null'){
                  data[key]='';
              }
            }
            this.formValidate = data;
            this.acaMzBegintimeChange(data.acaMzBegintime,data.acaMzEndtime)

          },

          /*
           * 获取表单数据
           * @return string  格式:id=0&name=aa
           * */
          getFormData(data){
            let myData = this.$util._.defaultsDeep({},data);
            return myData;
          },



          //取消
          cancel(){
            this.$emit('cancel',this.addMessTitle.type);
          },

          //上传文件
          expenseFileEvent(ids){
            this.formValidate.fileIds = ids;
          },


          acaMzBegintimeChange(startDate,endDate){
            let date = this.timestamp(this.parseDate(startDate,'yyyy-MM-dd HH:mm:ss'));  //获取的时间戳;
            let day = date;
            endDate = this.timestamp(this.parseDate(endDate,'yyyy-MM-dd HH:mm:ss'))
              this.isFirst = false;
              this.mzRecordHeader = ['药物名称/使用的剂量'],  //药物名称/使用的剂量
              this.mzStatusHeader = ['生命体征'],  //药物名称/使用的剂量
              this.aidDrugNameHeader = ['辅助输入的药品名称']  //药物名称/使用的剂量
              while (day<=endDate){
                  let hm =this.conductDate(day,'HH:mm');
                this.mzRecordHeader.push(hm);
                this.mzStatusHeader.push(hm);
                this.aidDrugNameHeader.push(hm);
                day=day+5*60*1000;
            }
            let length = this.mzRecordHeader.length;
             let  mzRecord = this.formValidate.mzRecord;
             let  mzStatus = this.formValidate.mzStatus;
             let  aidDrugName = this.formValidate.aidDrugName;
            for(let i=0;i<mzRecord.length;i++){
                if( mzRecord[i][0]==''){
                  mzRecord.splice(i);
                  continue;
                }
                for(let k = mzRecord[i].length;k<length;k++){
                  mzRecord[i].push('');
                }
            }
            for(let i=0;i<mzStatus.length;i++){
              if( mzStatus[i][0]==''){
                mzStatus.splice(i);
                continue;
              }
                for(let k = mzStatus[i].length;k<length;k++){
                  mzStatus[i].push('');
                }
            }
            for(let i=0;i<aidDrugName.length;i++){
              if( aidDrugName[i][0]==''){
                aidDrugName.splice(i);
                continue;
              }
                for(let k = aidDrugName[i].length;k<length;k++){
                  aidDrugName[i].push('');
                }
            }

            ////药物名称/使用的剂量是空数组的话
            if(mzRecord==0){
              mzRecord[0] = [];
              for(let k =0;k<length;k++){
                mzRecord[0].push('');
              }
            }
            //生命体征是空数组的话，
            if(mzStatus==0){
              mzStatus[0] = [];
              for(let k =0;k<length;k++){
                mzStatus[0].push('');
              }
            }
            //辅助输入的药品名称是空数组的话，
            if(aidDrugName==0){
              aidDrugName[0] = [];
              for(let k =0;k<length;k++){
                aidDrugName[0].push('');
              }
            }


          },

          //单击输入框
          /*
          * type   当前的类型，字段名
          * index  所属tr的几行
          * i      当前td的第几行
          * */
          cellClick(type,index,i){
            if (index == this.formValidate[type].length - 1) {
              let tempArr = [];
              let day = this.timestamp(this.formValidate.acaMzBegintime);
              for(let i=0;i<this[type+"Header"].length;i++){
                tempArr.push('');
              }
              this.formValidate[type].push(tempArr)
            };


            if (i == this.formValidate[type][0].length - 1) {
              let endDate = this.formValidate.acaMzEndtime = this.formValidate.acaMzEndtime+5*60*1000;
              let hm =this.conductDate(endDate,'HH:mm');
              this.mzRecordHeader.push(hm);
              this.mzStatusHeader.push(hm);
              this.aidDrugNameHeader.push(hm);
              for(let i=0 ;i<this.formValidate.mzRecord.length;i++){
                this.formValidate.mzRecord[i].push('');
              }
              for(let i=0 ;i<this.formValidate.mzStatus.length;i++){
                this.formValidate.mzStatus[i].push('');
              }
              for(let i=0 ;i<this.formValidate.aidDrugName.length;i++){
                this.formValidate.aidDrugName[i].push('');
              }
            }
          },

          //获取指定时间的时间戳
          timestamp(date){
            let timestamp
            if(navigator.userAgent.indexOf("Firefox")>0){  //解决火狐兼容性问题
              timestamp = date ? Date.parse(date) : new Date().getTime();
            }else {
              timestamp = date ? new Date(date).getTime() : new Date().getTime();
            }
            return timestamp

          },

        },
        created(){
            this.init();

        },
        mounted(){
        },
        components: {}
    }
</script>
