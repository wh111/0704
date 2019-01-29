<template>

  <div class="showWrapper">
    <el-row>
      <el-col :span="10" :offset="10" class="lose-margin2">
        {{ hospitalName }}职业暴露登记表
      </el-col>
    </el-row>
    <el-form>
      <el-row class="lose-margin2">
        <el-col :span="20" :offset="2">
          <fieldset class="layui-elem-field">
            <el-row class="lose-margin2 feildFontweight">
              <el-col :span="10" :offset="2">
                <p><span class="name">姓名：</span><span>{{data.userName}}</span></p>
              </el-col>
              <el-col :span="10">
                <p><span class="name">科室：</span><span>{{data.depName}}</span></p>
              </el-col>
            </el-row>
            <el-row class="lose-margin2 feildFontweight" >
              <el-col :span="10" :offset="2">
                <p><span class="name">发生时间：</span><span>{{data.occurrenceTime}}</span></p>
              </el-col>
            </el-row>

          </fieldset>
        </el-col>
      </el-row>

      <!--富文本-->
      <el-row >
        <el-col :span="20" :offset="2">
          <fieldset class="layui-elem-field">
            <legend>暴露详情</legend>
            <viewUEditor style="width: 100%" :name="'ud1'" v-if="isGetSuccess" @storeUE="storeUE" @getUeditorVal="getUeditorVal"
                         :ueditor-val="ueditorVal"
                         :ueditor-config="ueditorConfig"></viewUEditor>
          </fieldset>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item  label="暴露级别:" class="feildFontweight">
            {{data.exposureLevel}}级
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item  label="结果:" class="feildFontweight">
            {{!!data.isInfected?'暴露后感染病毒':' 暴露后未感染病毒'}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item  label="附件:" class="feildFontweight">
            <upload-file :uploadFiles="data.fileList" :show="true"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item label="审核状态:" label-width="80px">
            {{data.status  | occupationalExposure}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row  v-if="!['WSB','DSH'].includes(data.status)">
        <el-col :span="20" :offset="2">
          <el-form-item label="审核意见:" prop="desc" label-width="80px">
            <el-input type="textarea" readonly v-model="data.opinion" :rows="6" resize="none"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="report.includes(data.status)">
        <el-col :span="20" :offset="2">
          <fieldset class="layui-elem-field">
            <legend>检验报告</legend>
            <el-row >
              <el-col :span="20" :offset="2">
                <el-form-item label="化验报告:" class="feildFontweight">
                  <upload-file :uploadFiles="getFiles['HY']" :show="true"></upload-file>
                </el-form-item>
                <el-form-item label="复查报告:" class="feildFontweight">
                  <upload-file :uploadFiles="getFiles['FC']" :show="true"></upload-file>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="20" :offset="2">
                <el-form-item label="化验检验报告审核结果报告:" class="feildFontweight">
                  {{data.occupationalExposureReportList[0].status|occupationalExposure}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="20" :offset="2">
                <el-form-item label="化验检验报告审核意见:" class="feildFontweight" labelWidth="180px">
                  <el-input type="textarea" readonly v-model="data.occupationalExposureReportList[0].opinion" :rows="6" resize="none"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>
        </el-col>
      </el-row>

      <div v-if="reimbursement.includes(data.status)">
        <el-row  v-if="report.includes(data.status)">
          <el-col :span="20" :offset="2">
            <fieldset class="layui-elem-field">
              <legend>报销报告</legend>
              <el-row>
                <el-col :span="20" :offset="2">
                  <el-form-item label="报销金额:" class="feildFontweight">
                    {{data.occupationalExposureReimbursement[0].amountMoney}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20" :offset="2">
                  <el-form-item label="附件:" class="feildFontweight">
                        <upload-file :uploadFiles="data.reimbursementList" :show="true"></upload-file>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row >
                <el-col :span="20" :offset="2">
                  <el-form-item label="报销审核结果:" class="feildFontweight">
                    {{data.occupationalExposureReimbursement[0].status|occupationalExposure}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row >
                <el-col :span="20" :offset="2">
                  <el-form-item label="报销审核意见:" class="feildFontweight" labelWidth="100px">
                    <el-input type="textarea" readonly v-model="data.occupationalExposureReimbursement[0].opinion" :rows="6" resize="none"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </fieldset>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;
  import viewUEditor from '../../../common/showUeditor.vue';
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','type'],
    data() {
      return {
        hospitalName: this.$store.state.envPath.hospitalName,
        data: {
          "id": '', //职业暴露Id
          "userId": "", //用户Id
          "userName": "", //用户姓名
          "depId": "", //科室Id
          "depName": "", //科室名称
          "occurrenceTime": "", //发生时间
          "exposureLevel": "", //暴露级别
          "exposureDetails": "", //暴露详情
          "isInfected": "0", //结果
          "status": "", //职业暴露状态
          "opinion": "", //审批意见
          "occupationalExposureReportList": [ //化验报告对象列表
//            {
//              //化验报告对象
//              "Id": "1", //化验报告Id
//              "reportType": "hy", //化验报告类型
//              "status": "wsb", //化验报告状态
//              "fileList": [ //附件列表
//                {
//                  "fileId": "2", //附件Id
//                  "fileName": "文件名称", //文件名称                        "fileType":"txt"    //文件类型
//
//                }
//              ]
//            }
          ],
          "occupationalExposureReimbursement": [ //报销申请对象
//            {
//              "Id": "1", //报销申请Id
//              "status": "wsb", //报销申 请状态
//              "fileList": [ //附件列表
//                {
//                  "fileId": "2", //附件Id
//                  "fileName": "文件名称", //文件名称
//                  "fileType": "txt" //文件类型
//                }
//              ]
//            }
          ],
          "fileList": []
        },

        isGetSuccess:false,
        //富文本编译器
        UE: {},
        ueditorVal: {
          ud1: "",
        },  //
        ueditorConfig: {
          //详细配置参考UEditor 官网api
          initialFrameHeight: 220  //初始化编辑器高度,默认320
        },



        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        tableData1: [],
        listMessTitle: {
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: 'occupationalExposure/get/' + this.operailityData.id,
          }
        },
        report:[],
        reimbursement:[],

        //化检报告
        getFiles : {
          'HY':[], //化验报告
          'FC':[], //复查报告
        }
      }
    },
    created() {
      let report = [];//体检报告 显示隐藏状态
      let reimbursement = []; // 报销 显示隐藏状态
      if(this.type=='audit'){
        report =  ['REPORTDSH','REPORTBH','REPORTTG','REIMBURSEMENTWSB','REIMBURSEMENTDSH','REIMBURSEMENTBH','REIMBURSEMENTTG'];
        reimbursement =  ['REIMBURSEMENTDSH','REIMBURSEMENTBH','REIMBURSEMENTTG'];
      }else {
        report = ['REPORTWSB','REPORTDSH','REPORTBH','REPORTTG','REIMBURSEMENTWSB','REIMBURSEMENTDSH','REIMBURSEMENTBH','REIMBURSEMENTTG'];
        reimbursement =  ['REIMBURSEMENTWSB','REIMBURSEMENTDSH','REIMBURSEMENTBH','REIMBURSEMENTTG'];
      }
      this.report = report;
      this.reimbursement = reimbursement;
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //初始化
      this.init();
    },
    methods: {
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData) {
        this.ueditorVal.ud1 = responseData.data.exposureDetails ;
        this.isGetSuccess = true;
        let obj = {
          'HY':[],
          'FC':[],
        }
        let  data = responseData.data.occupationalExposureReportList||[];
        data.map(item=>{   //item.reportType  'HY' or 'FC'
          item.fileList = item.fileList ||[];
          obj[item.reportType] = obj[item.reportType].concat(item.fileList);
        });

        let reimbursementList = responseData.data.occupationalExposureReimbursement||[];
        let tempArr = []
        reimbursementList.map(item=>{
          tempArr = tempArr.concat(item.fileList)
        })
        responseData.data.reimbursementList = tempArr;
        this.getFiles = obj;
        this.data = responseData.data;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'show');
      },
      /*
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },

      //转换暴露状态
      converterStatus(status) {
        switch (status) {
          case 'WSB':
            status = '未上报';
            break;
          case 'DSH':
            status = '审核中(待审)';
            break;
          case 'TG':
            status = '通过';
            break;
          case 'BTG':
            status = '不通过';
            break;
          case 'BH':
            status = '驳回修改';
            break;
          case 'reportwsb':
            status = '化验报告未上报';
            break;
          case 'reportdsh':
            status = '化验报告待审核';
            break;
          case 'reportbh':
            status = '化验报告驳回';
            break;
          case 'reporttg':
            status = '化验报告通过';
            break;
          case 'reimbursementwsb':
            status = '报销申请未上报';
            break;
          case 'reimbursementdsh':
            status = '报销申请待审核';
            break;
          case 'reimbursementbh':
            status = '报销申请被驳回';
            break;
          case 'reimbursementtg':
            status = '报销申请被驳回';
            break;
        }
        return status;

      },

      /**
       *
       * 存储编辑器的value值
       * @param name {string}  编辑器的name
       *
       * @param val  {string}  编辑器的内容
       *
       */
      getUeditorVal(name, val) {
        this.ueditorVal[name] = val;
      },

      /**
       *
       * 存储编辑器的UE.editor对象
       * @param name {string}  编辑器的name
       *
       * @param editor {}      编辑器的对象
       *
       */
      storeUE(name, editor) {
        this.UE[name] = editor;
        editor.setDisabled()
      },

      setMyVal(name, v) {
        this.UE[name].setContent(v);
      }
    },
    components:{
      viewUEditor,
    }
  }

</script>
<style>
  .showWrapper {
    height: 100%;
    padding: 20px;
    border: 1px solid #eee;
  }

  .feildFontweight {
    font-weight: bold;
  }

</style>
