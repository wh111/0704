<!----------------------------------
****--@name     调查报告
****--@role     进修生
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div class="srMain">
    <el-form :model="formValidate" ref="formValidate" :rules="rules">
    <h2 align="center">进修结束调查报告</h2>
    <table class="el-table">
      <thead>
      <tr>
        <th>
          旷工天数
        </th>
        <th>
          病假天数
        </th>
        <th>
          事假天数
        </th>
        <th>
          奖励次数
        </th>
        <th>
          惩罚次数
        </th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td align="center">
          <div class="cell">
            <el-form-item prop="minerDays">
              <!--<span v-if="formValidate.state != 'NO_SUBMIT'">{{ formValidate.minerDays }}</span>-->
              <!--<el-input v-else v-model="formValidate.minerDays"></el-input>-->
              <span >{{ formValidate.minerDays }}</span>
            </el-form-item>
          </div>
        </td>
        <td>
          <div class="cell">
            <el-form-item prop="sickDays">
              <!--<span v-if="formValidate.state != 'NO_SUBMIT'">{{ formValidate.sickDays }}</span>-->
              <span >{{ formValidate.sickDays }}</span>
              <!--<el-input v-else v-model="formValidate.sickDays"></el-input>-->
            </el-form-item>
          </div>
        </td>
        <td>
          <div class="cell">
            <el-form-item prop="personalDays">
              <!--<span v-if="formValidate.state != 'NO_SUBMIT'">{{ formValidate.personalDays }}</span>-->
              <span >{{ formValidate.personalDays }}</span>
              <!--<el-input v-else v-model="formValidate.personalDays"></el-input>-->
            </el-form-item>
          </div>
        </td>
        <td>
          <div class="cell">
            <el-form-item prop="rewardNum">
              <span >{{ formValidate.rewardNum }}</span>
              <!--<span v-if="formValidate.state != 'NO_SUBMIT'">{{ formValidate.rewardNum }}</span>-->
              <!--<el-input v-else v-model="formValidate.rewardNum"></el-input>-->
            </el-form-item>
          </div>
        </td>
        <td>
          <div class="cell">
            <el-form-item prop="penaltyNum">
              <span >{{ formValidate.penaltyNum }}</span>
              <!--<span v-if="formValidate.state != 'NO_SUBMIT'">{{ formValidate.penaltyNum }}</span>-->
              <!--<el-input v-else v-model="formValidate.penaltyNum"></el-input>-->
            </el-form-item>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <!-- 轮转记录 -->
    <h4>轮转要求统计</h4>
    <el-table align="center" :context="self" :data="requirStatic" tooltip-effect="dark">
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="要求数量" prop="yqnum" show-overflow-tooltip></el-table-column>
      <el-table-column label="已完成数量" prop="ywcnum" show-overflow-tooltip></el-table-column>
      <el-table-column label="完成比例" prop="wcbl" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 考核汇总 -->
    <h4>考核汇总</h4>
    <el-table border align="center" :context="self" :data="monthlyReview" tooltip-effect="dark"
              style="width: 100%">
      <el-table-column label="科室名称" prop="depName" show-overflow-tooltip></el-table-column>
      <el-table-column label="收红包" show-overflow-tooltip align="center">
        <el-table-column prop="redEnvelopeCount" label="次数" align="center">
          <template scope="scope">
            {{ scope.row.redEnvelopeCount || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="redEnvelopeAmount" label="金额" align="center">
          <template scope="scope">
            {{ scope.row.redEnvelopeAmount || '-' }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="收受医药回扣" show-overflow-tooltip align="center">
        <el-table-column prop="rebateCount" label="次数" align="center">
          <template scope="scope">
            {{ scope.row.rebateCount || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="rebateAmount" label="金额" align="center">
          <template scope="scope">
            {{ scope.row.rebateAmount || '-' }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="对待病人态度" show-overflow-tooltip align="center">
        <el-table-column prop="attitudeTowardPatientGood" label="好" align="center">
          <template scope="scope">
            {{ scope.row.attitudeTowardPatientGood || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="attitudeTowardPatientIn" label="中" align="center">
          <template scope="scope">
            {{ scope.row.attitudeTowardPatientIn || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="attitudeTowardPatientBad" label="差" align="center">
          <template scope="scope">
            {{ scope.row.attitudeTowardPatientBad || '-' }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="考核等级" show-overflow-tooltip align="center">
        <el-table-column prop="inspectionLevelOptimal" label="优" align="center">
          <template scope="scope">
            {{ scope.row.inspectionLevelOptimal || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="inspectionLevelGood" label="良" align="center">
          <template scope="scope">
            {{ scope.row.inspectionLevelGood || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="inspectionLevelDiff" label="差" align="center">
          <template scope="scope">
            {{ scope.row.inspectionLevelDiff || '-' }}
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <!-- 自我评价 -->
    <h4 class="otherTitle">自我鉴定</h4>
      <el-form-item prop="selfAssessment">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" :readonly="formValidate.state != 'NO_SUBMIT'" placeholder="请输入内容" v-model="formValidate.selfAssessment"> </el-input>
      </el-form-item>
    </el-form>
    <!-- 附件 -->
    <h4 class="otherTitle">自我鉴定附件</h4>
    <p v-if="formValidate.state != 'NO_SUBMIT'">
      <upload-file @setUploadFiles="setUploadFiles" :uploadFiles="selfFiles" :show="true"></upload-file>
    </p>
    <div v-else>
      <upload-file @setUploadFiles="setUploadFiles" :uploadFiles="selfFiles" :show="false"></upload-file>
    </div>

    <template v-if="formValidate.state == 'NO_PASS'">
      <h4 class="otherTitle">科室鉴定</h4>
      <div>
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" readonly v-model="formValidate.eduExpertOpinion"> </el-input>
      </div>
      <h4 class="otherTitle">科室鉴定附件</h4>
      <upload-file :uploadFiles="eduFiles" :show="true"></upload-file>
    </template>

    <!-- 操作按钮 -->
    <el-row style="margin-top: 20px;" v-if="formValidate.state == 'NO_SUBMIT'">
      <el-col :span="6" :offset="6" align="center">
        <load-btn @listenSaveEvent="listenSaveEvent" :btnData="saveBtn"></load-btn>
      </el-col>
      <el-col :span="6" align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import uplandFile from '../../../common/uploadFile.vue';
  import { surveyReport as rules } from '../../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        rules,
        self: this,
        selfFiles:[],
        eduFiles:[],

        monthlyReview:[], // 考核汇总
        requirStatic:[], // 科室情况
        formValidate: {
          reportId: "", // 进修结束ID",
          userId: "", // 用户ID",
          userName: "", // 姓名",
          subjectsId: "", // 进修申请ID",
          minerDays: "", // 旷工天数",
          sickDays: "", // 病假天数",
          personalDays: "", // 事假天数",
          rewardNum: "", // 奖励次数",
          penaltyNum: "", // 惩罚次数",
          selfAssessment: "", // 自我鉴定",
//          userEditTime: "", // 进修生填写创建时间",
//          createTime: "", // 创建时间",
          selfHasfileList: [],
          eduExpertOpinion: "", // 进修科室鉴定",
//          eduCreateTime: "", // 进修科室鉴定创建时间",
//          eduCreateUserId: "", // 进修鉴定创建人ID",
//          eduCreateUserName: "", // 进修鉴定创建人",
          eduHasfileList: [],
          fileIds:'', // 附件IDs
          state: "",
          type:'',
        },
        //保存按钮基本信息
        saveBtn: {
          title: '保存',
          callParEvent: 'listenSaveEvent'
        },
        loadBtn: {
          title: '上报',
          callParEvent: 'listenSubEvent'
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        this.getShowData();
      },
      getShowData(){
        let opt = {
          ajaxSuccess: "getShowDataSuccess",
          ajaxParams:{
            url:api.get.path,
            method: api.get.method
          }
        };
        this.ajax(opt)
      },
      // 获取数据成功回调
      getShowDataSuccess(res){
        for(let key in this.formValidate){
          if(res.data[key] != null){
            this.formValidate[key] = res.data[key]
          }
        }
        // 自己附件
        let filesIds = [];
        let selfFiles = [];
        (res.data.selfHasfileList ).map(item => {
          selfFiles.push({
            fileId: item.id,
            fileName: item.fileName,
            filePath: '/api/file/download/' + item.id
          });
          filesIds.push(item.id);
          this.selfFiles = selfFiles
        });

        // 科室附件
        (res.data.eduHasfileList || []).map(item => {
          this.eduFiles.push({
            fileId: item.id,
            fileName: item.oldName,
            filePath: '/api/file/download/' + item.id
          });
        });

        this.formValidate.fileIds = filesIds;

        this.getTotalData()
      },
      // 获取统计数据
      getTotalData() {
        let opt = {
          ajaxSuccess: res => {
            let name = {
              sscz:'手术操作',
              jnys: '技能演示',
              bltl: '病例讨论',
              klxjz: '科内小讲座',
              jxcf: '教学查房',
              dbl: '大病历',
              jn: '技能',
              bz: '病种',
            };
            this.monthlyReview = res.data.monthlyReview || [];
            if(res.data.requirStatic.length){
              let temp = [];
              this.$util._.map(res.data.requirStatic[0],(val,key)=>{
                val.key = key;
                val.name = name[key];
                temp.push(val)
              })
              this.requirStatic = temp;
            }
          },
          ajaxParams: {
            url: api.userRotaryStatic.path + this.formValidate.userId,
            method: api.userRotaryStatic.method,
          }
        }
        this.ajax(opt)
      },
      // 上传附件
      setUploadFiles(ids) {
        this.formValidate.fileIds = ids;
      },
      /*
       * 保存
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSaveEvent(isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if(!isLoadingFun) isLoadingFun=function(){};
          isLoadingFun(true);
          this.formValidate.type = 'BC';
          let data = this.getFormData(this.formValidate);
          let opt = {
            ajaxSuccess: res=>{
              this.successMess('保存成功');
              this.getShowData()
            },
            ajaxError: ()=>this.errorMess('保存失败'),
            ajaxParams:{
              url:api.userAddReport.path + data.reportId || '',
              method: api.userAddReport.method,
              data
            }
          };
          this.ajax(opt, isLoadingFun)
        }
      },
      /*
       * 上报
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if(!isLoadingFun) isLoadingFun=function(){};
          isLoadingFun(true);
          this.formValidate.type = 'SB';
          let data = this.getFormData(this.formValidate);
          let opt = {
            ajaxSuccess: res=>{
              this.successMess('上报成功');
              this.getShowData()
            },
            ajaxError: ()=>this.errorMess('上报失败'),
            ajaxParams:{
              url:api.userAddReport.path + data.reportId || '',
              method: api.userAddReport.method,
              data
            }
          };
          this.ajax(opt, isLoadingFun)
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      uplandFile
    }
  }
</script>

<style lang="scss">
  .srMain {
    height: 100%;
    overflow: auto;
    th {
      text-align: center;
    }
    .el-table, h4 {
      margin-top: 20px;
    }
    .otherTitle{margin-bottom: 20px;}
    .cell .el-input{margin-top: 20px;}
  }
</style>
