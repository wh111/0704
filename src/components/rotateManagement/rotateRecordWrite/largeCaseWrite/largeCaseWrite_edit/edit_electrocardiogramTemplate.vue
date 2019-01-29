<!----------------------------------
****--麻醉科
****--@date     2017/7/4
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-form  :model="formValidate" ref="formValidate" :rules="electrocardiogramTemplate"   class="demo-form-inline" label-width="130px" >
      <el-row class="table-back-one">
        <el-col :span="6" >
          <el-form-item label="科别:" prop="name" >
            {{operailityData.depName}}
          </el-form-item>
        </el-col>

        <el-col :span="6" >
          <el-form-item label="床号:" prop="cbedNo" >
            <el-input v-model="formValidate.cbedNo" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6" >
          <el-form-item label="住院号:" prop="czyNo" >
            <el-input v-model="formValidate.czyNo" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6" >
          <el-form-item label="日期:" prop="cjlDate" >
            <el-date-picker
              v-model="formValidate.cjlDate"
              type="date"
              style="width:166px"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="table-back-two">
        <el-col :span="6" >
          <el-form-item label="姓名:" prop="cname" >
            <el-input v-model="formValidate.cname" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6" >
          <el-form-item label="性别:" prop="csex" >
            <el-radio class="radio" v-model="formValidate.csex" label="男"></el-radio>
            <el-radio class="radio" v-model="formValidate.csex" label="女"></el-radio>
          </el-form-item>
        </el-col>

        <el-col :span="6" >
          <el-form-item label="年   龄:" prop="cage" >
            <el-input v-model="formValidate.cage" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6" >
          <el-form-item label="体重:" prop="acaTz" >
            <el-input v-model="formValidate.acaTz" placeholder="请输入">
              <span   slot="append" >KG</span>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="table-back-one">
        <el-col :span="6" >
          <el-form-item label="医保:" prop="name" >
            <el-radio class="radio" v-model="formValidate.acaIsybYes" label="1">是</el-radio>
            <el-radio class="radio" v-model="formValidate.acaIsybYes" label="0">否</el-radio>
          </el-form-item>
        </el-col>

        <el-col :span="6" >
          <el-form-item label="心功能:" prop="acaXgn" >
            <el-input v-model="formValidate.acaXgn" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="table-back-two">
        <el-col :span="12" >
          <el-form-item label="手术后诊断:" prop="acaSszd" >
            <el-input v-model="formValidate.acaSszd" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12" >
          <el-form-item label="已施手术:" prop="acaYsss" >
            <el-input v-model="formValidate.acaYsss" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="table-back-one">
        <el-col :span="12" >
          <el-form-item label="麻醉前用药:" prop="acaMzqyw" >
            <el-input v-model="formValidate.acaMzqyw" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12" >
          <el-form-item label="特殊情况:" prop="acaTsqk" >
            <el-input v-model="formValidate.acaTsqk" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="table-back-one">
        <el-col :span="12" >
          <el-form-item label="麻醉开始(时间):" prop="acaMzBegintime" >
            <el-date-picker
              @change="acaMzBegintimeChange"
              v-model="formValidate.acaMzBegintime"
              type="datetime"
              :editable="false"
              :clearable="false"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12" >
          <el-form-item label="麻醉终止(时间):" prop="acaMzEndtime" >
            <el-date-picker
              disabled
              :clearable="false"
              v-model="formValidate.acaMzEndtime"
              type="datetime"
              :editable="false"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="table-back-one">
        <el-col :span="12" >
          <el-form-item label="手术开始(时间):" prop="acaSsBegintime" >
            <el-date-picker
              v-model="formValidate.acaSsBegintime"
              type="datetime"
              :clearable="false"
              :editable="false"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12" >
          <el-form-item label="手术终止(时间):" prop="acaSsEndtime" >
            <el-date-picker
              v-model="formValidate.acaSsEndtime"
              type="datetime"
              :clearable="false"
              :editable="false"
              placeholder="选择日期时间">
            </el-date-picker>
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
              {{item}}<span v-if="index==0" style="color: red">*</span>
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
                <el-input @focus="cellClick('mzRecord',index,i)" v-model="item[i]"></el-input>
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
              {{item}}<span v-if="index==0" style="color: red">*</span>
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
                <el-input @focus="cellClick('mzStatus',index,i)" v-model="item[i]"></el-input>
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
              {{item}}<span v-if="index==0" style="color: red">*</span>
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
                <el-input @focus="cellClick('aidDrugName',index,i)" v-model="item[i]"></el-input>
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
                <el-input v-model="formValidate.acaCxl"></el-input>
              </el-form-item>
            </el-col>
            <el-col style="line-height: 36px;" :span="4">
              ML
            </el-col>
          </el-row>
          <el-row>
            <el-col style="line-height: 36px" :span="3">
              出尿量（ML单位）
            </el-col>
            <el-col :span="4">
              <el-form-item prop="acaCnl" label-width="0">
                <el-input v-model="formValidate.acaCnl" ></el-input>
              </el-form-item>
            </el-col>
            <el-col style="line-height: 36px;" :span="4">
              ML
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
            <th class="cell" >诱导药物名称<span style="color: red">*</span></th>
            <th class="cell" >病人从进手术室开始到出手术室的过程记录<span style="color: red">*</span></th>
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
                  <el-input v-model="formValidate.acaYdyw"  type="textarea"></el-input>
                </el-form-item>
              </td>
              <td>
                <el-form-item prop="acaShjl" label-width="0">
                  <el-input v-model="formValidate.acaShjl" type="textarea"></el-input>
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
                <el-input v-model="formValidate.acaMzff" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" >
              <el-form-item label="手术体位:" prop="acaSstw" >
                <el-input v-model="formValidate.acaSstw" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" >
              <el-form-item label="麻醉剂及剂量(维持):" prop="acaMzjl" label-width="150px" >
                <el-input v-model="formValidate.acaMzjl" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="20" style="height:62px">
              <el-form-item label="术后镇疼方法:" prop="acaShzt" >
                <el-checkbox-group v-model="formValidate.acaShzt">
                  <el-checkbox :label="1" >一次性</el-checkbox>
                  <el-checkbox :label="2">镇痛泵</el-checkbox>
                  (<el-checkbox :label="3">硬外</el-checkbox>
                  <el-checkbox :label="4 " >静脉</el-checkbox>
                  <el-checkbox :label="5 " >皮下</el-checkbox>)
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20" style="height:64px">
              <el-form-item label="麻醉者:" prop="acaMzUser" >
                <el-input v-model="formValidate.acaMzUser" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="手术者:" prop="acaSsUser" >
                <el-input v-model="formValidate.acaSsUser" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="洗手:" prop="acaXs" >
                <el-input v-model="formValidate.acaXs" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="巡回:" prop="acaXh" >
                <el-input v-model="formValidate.acaXh" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="8" >
          <el-form-item label="全   血:" prop="acaQx" >
            <el-input v-model="formValidate.acaQx" placeholder="请输入">
              <span   slot="append" >ml</span>
            </el-input>
          </el-form-item>
          <el-form-item label="成分输血" prop="acaCfxl" >
            <el-input v-model="formValidate.acaCfxl" placeholder="请输入">
              <span   slot="append" >ml</span>
            </el-input>
          </el-form-item>
          <el-form-item label="代 血 浆" prop="acaDxj" >
            <el-input v-model="formValidate.acaDxj" placeholder="请输入">
              <span   slot="append" >ml</span>
            </el-input>
          </el-form-item>
          <el-form-item label="总输入量:" prop="acaZsyl" >
            <el-input v-model="formValidate.acaZsyl" placeholder="请输入">
              <span   slot="append" >ml</span>
            </el-input>
          </el-form-item>
          <el-form-item label="出 血 量:" prop="acaCxlo" >
            <el-input v-model="formValidate.acaCxlo" placeholder="请输入">
              <span   slot="append" >ml</span>
            </el-input>
          </el-form-item>
          <el-form-item label="尿    量:" prop="acaNl" >
            <el-input v-model="formValidate.acaNl" placeholder="请输入">
              <span   slot="append" >ml</span>
            </el-input>
          </el-form-item>
          <el-form-item label="其 他:" prop="acaQt" >
            <el-input v-model="formValidate.acaQt" placeholder="请输入">
              <span   slot="append" >ml</span>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="table-back-two-d">
        <el-col :span="10">
          <el-form-item label="相关证明材料:" >
          <upload-file :uploadFiles="formValidate.fileList"   @setUploadFiles="expenseFileEvent"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>
      </br>

      <el-row >
        <el-col :span="10" :offset="8" >
          <div >
            <load-btn @saveSubEvent="saveSubEvent" :btnData="saveBtn"></load-btn>
            <load-btn @appearSubEvent="appearSubEvent" :btnData="loadBtn"></load-btn>
            <el-button  @click="cancel">取消</el-button>
          </div>
        </el-col>
      </el-row>


    </el-form>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import {electrocardiogramTemplate} from '../../../rules'
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:['operailityData','url','podId'],
    data() {
      return {
        electrocardiogramTemplate,
        saveBtn: {title: '提交', callParEvent: 'saveSubEvent'},
        loadBtn: {title: '上报', callParEvent: 'appearSubEvent'},
        mzRecordHeader:['药物名称/使用的剂量'],  //药物名称/使用的剂量
        mzStatusHeader:['生命体征'],  //药物名称/使用的剂量
        isFirst:false,
        aidDrugNameHeader: ['辅助输入的药品名称'],  //药物名称/使用的剂量
        formValidate:{
          /*"caseId":111,
          "cdepId":this.depId,
          "cdepName":this.depName,
          "cpodId":this.podId,
          "createUserNmae":"创建人姓名",
          "cbedNo":"床号",
          "czyNo":"编号",
          "cjlDate":"2012-02-02",
          "cname":"姓名",
          "csex":"男",
          "cage":"13",
          "acaTz":"150",
          "acaIsybYes":"",
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
          "acaCxl":"15",
          "acaCnl":"15",
          "acaYdyw":"诱导药物名称",
          "acaShjl":"病人从进手术室开始到出手术室的过程记录",
          "acaMzff":"麻醉方法",
          "acaSstw":"手术体位",
          "acaMzjl":"麻醉剂及剂量",
          "acaShzt":[],
          "acaMzUser":"麻醉者",
          "acaSsUser":"手术者",
          "acaXs":"洗手",
          "acaXh":"巡回",
          "acaQx":"15",
          "acaCfxl":"15",
          "acaDxj":"15",
          "acaZsyl":"15",
          "acaCxlo":"15",
          "acaNl":"15",
          "acaQt":"15",*/
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
          if(!data[key]&&data[key]!=0)data[key]='';
        }
        this.formValidate = data;
        this.getAcaMzBegintimeChange(data.acaMzBegintime,data.acaMzEndtime,data)

      },

      getAcaMzBegintimeChange(startDate,endDate,data){
        let date = this.timestamp(this.parseDate(startDate,'yyyy-MM-dd HH:mm:ss'));  //获取的时间戳;
        let day = date;
        endDate = this.timestamp(this.parseDate(endDate,'yyyy-MM-dd HH:mm:ss'))
        this.isFirst = true;
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
        let  mzRecord = data.mzRecord;
        let  mzStatus = data.mzStatus;
        let  aidDrugName = data.aidDrugName;
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
        if(aidDrugName == 0){
          aidDrugName[0] = [];
          for(let k =0;k<length;k++){
            aidDrugName[0].push('');
          }
        }

        return data
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit){
          if(!isLoadingFun) isLoadingFun=function(){};
          if(!this.conductValidate(this.formValidate)){

              return;
          }
          isLoadingFun(true);
          let formValidate = this.formDate(this.getFormData(this.formValidate),['cjlDate'],'yyyy-MM-dd');
          formValidate = this.formDate(formValidate,['acaSsBegintime','acaSsEndtime','acaMzBegintime','acaMzEndtime'],'yyyy-MM-dd HH:mm:ss');
          this.addMessTitle.ajaxParams.data = formValidate;
          this.ajax(this.addMessTitle,isLoadingFun);
        }
      },


      //处理药物名称/使用的剂量 , 生命体征, 辅助输入的药品名称
      conductValidate(data){
          let undefined;
          let flag=true;
        let mess = [{
          key:'mzRecord',
          label:'药物名称/使用的剂量',
        },{
          key:'mzStatus',
          label:'生命体征',
        },{
            key:'aidDrugName',
            label:'辅助输入的药品名称',
          }];

        for(let i=0;i<mess.length;i++){
          let isSpan = true;//全部为空
            let item = data[mess[i].key];
            for(let k=0;k<item.length;k++){
                let isHasname = false;  //名字是否为空；
                let isHasCount = false;
              for(let l=0;l<item[k].length;l++){
                let val = item[k][l];
                if(l==0){
                    if(val == ''){
                      isHasname = true;
                    }
                }else {
                  if(val != ''){
                    isHasCount = true;
                  }
                }
                if(isHasname&&isHasCount){
                  flag = false;
                }
                if(!isHasname&&!isHasCount){
                  isSpan =true ;
                }
                if(isHasname||isHasCount){
                  isSpan = false;
                }
              }
              if(isHasname&&isHasCount){
                this.errorMess(mess[i].label+'名称必填');
              }
            }
          if(isSpan){
            this.errorMess(mess[i].label+'必填')
            return false;
          }
        }

        return flag;
      },







      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = this.$util._.defaultsDeep({},data);
        return myData;
      },

      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag= true;
          }
        });
        return flag;
      },
      //保存
      saveSubEvent(isLoadingFun){
        let addMessTitle={
          type:'edit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            jsonString:true,
            url:this.url.caseRecordAnesthesiaModify+this.operailityData.cid,
            method:'put',
            data:{},
          }
        };
        this.addMessTitle = addMessTitle;
        this.listenSubEvent(isLoadingFun)
      },

      //上报
      appearSubEvent(isLoadingFun){
        let addMessTitle={
          type:'edit',
          successTitle:'上报成功!',
          errorTitle:'上报失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            jsonString:true,
            url:this.url.caseRecordAnesthesiaModifyRelease+this.operailityData.cid,
            method:'put',
            data:{},
          }
        };
        this.addMessTitle = addMessTitle;
        this.listenSubEvent(isLoadingFun)
      },

      //取消
      cancel(){
        this.$emit('cancel','edit');
      },

      //上传文件
      expenseFileEvent(ids){
        this.formValidate.fId = ids;
      },


      acaMzBegintimeChange(val){
        if(val ==undefined){
          this.formValidate.acaMzEndtime ='';
          return;
        }
        if(this.isFirst){
          this.isFirst = false;
            return;
        }
        let date = this.timestamp(this.parseDate(val,'yyyy-MM-dd HH:mm:ss'));  //获取的时间戳;
        let day = date;
        this.formValidate.acaMzEndtime = date+60*60*1000;
        this.mzRecordHeader = ['药物名称/使用的剂量'],  //药物名称/使用的剂量
          this.mzStatusHeader = ['生命体征'],  //药物名称/使用的剂量
          this.aidDrugNameHeader = ['辅助输入的药品名称']  //药物名称/使用的剂量
        this.formValidate.mzRecord =  [['']]
        this.formValidate.mzStatus =  [['']]
        this.formValidate.aidDrugName =  [['']]
        while (day<=this.formValidate.acaMzEndtime){
          let hm =this.conductDate(day,'HH:mm');
          this.mzRecordHeader.push(hm);
          this.mzStatusHeader.push(hm);
          this.aidDrugNameHeader.push(hm);
          this.formValidate.mzRecord[0].push('');
          this.formValidate.mzStatus[0].push('');
          this.formValidate.aidDrugName[0].push('');
          day=day+5*60*1000;
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
