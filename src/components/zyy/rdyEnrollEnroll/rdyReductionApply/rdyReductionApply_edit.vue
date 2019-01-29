<!----------------------------------
****--网上预审(rdyOnlinePrequalification_list)
****--@date     2017/7/21
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div ref="content" class="rdyReductionApply">
    <h1 style="margin: 0 auto; width: 100%;text-align: center;height: 50px;line-height: 50px">临床技能测评申请表</h1>
    <div>
      <el-form>
        <table class="el-table" style="margin:0 auto; ">
          <tbody>
          <tr>
            <td><p class="cell td-right">姓名 :</p></td>
            <td><p class="cell">{{info.userName }}</p></td>
            <td><p class="cell td-right">性别 :</p></td>
            <td><p class="cell">{{info.sex |  typeText}}</p></td>
            <td><p class="cell td-right">出生年月 :</p></td>
            <td><p class="cell">{{info.birth}}</p></td>
            <td><p class="cell td-right">手机 :</p></td>
            <td><p class="cell">{{info.mobile}}</p></td>
          </tr>

          <tr>
            <td colspan="1"><p class="cell td-right">培训基地：</p></td>
            <td colspan="3" class="cell">{{info.trainingBase}}
              <!--<input type="text" v-model="showSelfDate.trainingBase"-->
              <!--style="width: 100%;height: 100%;border: none;outline: none;margin-left: 5px"/>-->
            </td>
            <td colspan="1"><p class="cell td-right"> 拟进入培训专业：</p></td>
            <td colspan="3" class="cell">{{info.rotaryProclass}}
              <!--<input type="text"-->
              <!--style="width: 100%;height: 100%;border: none;outline: none;margin-left: 5px"/>-->
            </td>
          </tr>

          <tr>
            <td><p class="cell td-right">本科</p></td>
            <td><p class="cell td-right">毕业院校：</p></td>
            <td colspan="2" class="cell"><input v-model="info.underGraduateSchool" type="text" :disabled="info.state!='NO_SUBMIT'"
                                                style="width: 100%;height: 100%;border: none;outline: none;margin-left: 5px"/>
            </td>
            <td colspan="2"><p class="cell td-right">专业：</p></td>
            <td colspan="2" class="cell"><input type="text" v-model="info.underSpecialty" :disabled="info.state!='NO_SUBMIT'"
                                                style="width: 100%;height: 100%;border: none;outline: none;margin-left: 5px"/>
            </td>
          </tr>

          <tr>
            <td><p class="cell td-right">硕士</p></td>
            <td><p class="cell td-right">毕业院校：</p></td>
            <td colspan="2" class="cell"><input type="text" v-model="info.masterGraduateSchool" :disabled="info.state!='NO_SUBMIT'"
                                                style="width: 100%;height: 100%;border: none;outline: none;margin-left: 5px"/>
            </td>
            <td><p class="cell td-right">专业：</p></td>
            <td class="cell"><input type="text" :disabled="info.state!='NO_SUBMIT'"
                                    style="width: 100%;height: 100%;border: none;outline: none;margin-left: 5px"
                                    v-model="info.masterSpecialty"/></td>
            <td><p class="cell td-right"> 类型：</p></td>
            <td>
              <p class="cell">
                <template>
                  <el-radio v-model="info.masterType" :disabled="info.state!='NO_SUBMIT'" label="KY">科研</el-radio>
                  <el-radio v-model="info.masterType" :disabled="info.state!='NO_SUBMIT'" label="LC">临床</el-radio>
                </template>
              </p>
            </td>
          </tr>

          <tr>
            <td><p class="cell td-right">博士</p></td>
            <td><p class="cell td-right">毕业院校：</p></td>
            <td colspan="2" class="cell"><input type="text" v-model="info.doctorGraduateSchool" :disabled="info.state!='NO_SUBMIT'"
                                                style="width: 100%;height: 100%;border: none;outline: none;margin-left: 5px"/>
            </td>
            <td><p class="cell td-right">专业：</p></td>
            <td class="cell"><input type="text" v-model="info.doctorSpecialty" :disabled="info.state!='NO_SUBMIT'"
                                    style="width: 100%;height: 100%;border: none;outline: none;margin-left: 5px"/></td>
            <td><p class="cell td-right"> 类型：</p></td>
            <td>
              <p class="cell">
                <template>
                  <el-radio v-model="info.doctorType" :disabled="info.state!='NO_SUBMIT'" label="KY">科研</el-radio>
                  <el-radio v-model="info.doctorType" :disabled="info.state!='NO_SUBMIT'" label="LC">临床</el-radio>
                </template>
              </p>
            </td>
          </tr>

          <tr>
            <td><p class="cell td-right">临床经历</p></td>
            <td><p class="cell td-right">医院名称：</p></td>
            <td colspan="2" class="cell"><input type="text" v-model="info.experienceHospitalName" :disabled="info.state!='NO_SUBMIT'"
                                                style="width: 100%;height: 100%;border: none;outline: none;margin-left: 5px"/>

            </td>
            <td colspan="2"><p class="cell td-right">科室：</p></td>
            <td colspan="2" class="cell"><input type="text" v-model="info.experienceDepName" :disabled="info.state!='NO_SUBMIT'"
                                                style="width: 100%;height: 100%;border: none;outline: none;margin-left: 5px"/>
            </td>
          </tr>

          <tr>
            <td colspan="8">
              <div class="cell indent">
          <pre>
          培训学员申请声明及申请理由：（相关证明请附后）<br/>
            <textarea rows="3" v-model="info.applyContent" :disabled="info.state!='NO_SUBMIT'"
                      style="width: 100%;height: 100%;border: none;outline: none;"></textarea>
            个人签名：                                                                                                  <el-date-picker   v-if="info.state=='NO_SUBMIT'"  v-model="applyTime" type="date"
                                   placeholder="选择时间" @change="handleApplyTime"></el-date-picker><template v-else>{{info.applyTime}}</template>

          </pre>
                <!--<upload-file @cancel="cancel" :url=""></upload-file>-->
              </div>
            </td>
          </tr>

          <tr v-if="(info.state=='PASS'&&showType=='USER')||showType=='MANAGE'">
            <td colspan="8">
              <div class="cell indent">
          <pre>
          培训基地意见<br/>
          &nbsp;   1、培训管理部门审核通过并接受培训学员申请  <template><el-radio :disabled="!(type=='break')" v-model="info.applyState" label="Y">是</el-radio><el-radio
            v-model="info.applyState" :disabled="!(type=='break')" label="N">否</el-radio></template>；
              2、测评专家组意见（ <template><el-radio v-model="info.expertsState" label="Y" :disabled="!(type=='break')">是</el-radio><el-radio
            v-model="info.expertsState" label="N" :disabled="!(type=='break')">否</el-radio></template>同意缩减）；
              3、培训管理部门（ <template><el-radio v-model="info.spState" label="Y" :disabled="!(type=='break')">是</el-radio><el-radio
            v-model="info.spState" label="N" :disabled="!(type=='break')">否</el-radio></template>）同意专业基地初步缩减方案。（缩减方案请附后）


            <!--<div style="overflow: hidden;width: 100%; position: relative;">-->
            <!--<p style="position: absolute; left: 0; top: 0;width: 50%;"> 个人签名： <input />      </p>-->
            <!--<p style="width: 50%;position: absolute; right: 0; top: 0;">     年  月  日      </p>-->
            <!--</div>  -->
          专业基地负责人签名：                                                                                                   培训管理部门负责人签名：
      （科主任）        年  月  日                                                                                                （部门盖章）        年  月  日
          </pre>

              </div>
            </td>
          </tr>
          <!--<tr>-->
            <!--<td colspan="8">-->
              <!--<div class="cell indent">-->
          <!--<pre>-->
          <!--省毕业后医学教育委员会办公室和省中医药毕业后教育委员会办公室意见：<br/>-->
              <!--1、受理表格时间：      年  月  日-->
              <!--2、是否通过审批并记录在案 <template><el-radio v-model="info.state" label="PASS">是</el-radio><el-radio v-model="info.state"-->
                                                                                                 <!--label="NO_PASS">否</el-radio></template>-->
              <!--3、<template><el-radio v-model="radio6" label="Y">是</el-radio><el-radio v-model="radio6"-->
                                                                                     <!--label="N">否</el-radio></template>已告知培训基地接受申请并审批记录在案，通知日期：  月  日-->
                                                      <!--（盖章生效）-->
          <!--</pre>-->

              <!--</div>-->
            <!--</td>-->
          <!--</tr>-->

          </tbody>
        </table>
        <el-row>
          <el-col :span="24">
            <el-form-item label="相关证明材料:" v-if="!showItem" >
              <upload-file :uploadFiles="info.fileIds" @setUploadFiles="expenseFileEvent"  show="false"></upload-file>
            </el-form-item>
            <el-form-item label="相关证明材料:" v-if="showItem" >
              <upload-file :uploadFiles="info.fileIds" @setUploadFiles="expenseFileEvent" ></upload-file>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div align="center" style="margin-top: 20px">
        <el-button type="primary" v-if="info.state=='NO_SUBMIT'" @click="toServe('NO_SUBMIT')">保存</el-button>
        <el-button type="primary" v-if="info.state=='NO_SUBMIT'&&(type!='show'||type!='break')" @click="toServe('NO_PASS')">上报</el-button>
        <el-button v-if="type=='break'" type="primary" @click="pass">通过</el-button>
        <!--<el-button type="primary" @click="cancel">拒绝</el-button>-->
        <el-button @click="show" v-if="type!=''||info.state=='PASS'">附件</el-button>
      </div>

    </div>
    <!--查看弹窗-->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="headerContent.showId"></modal-header>
      <Show :info="info" v-if="showModal" @cancel="cancel" :type="type" :showType="showType"></Show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import Show from './rdyReductionApply_view'
  import uploadFile from '../../../common/uploadFile';
  import UploadList from '../../../../../node_modules/iview/src/components/upload/upload-list.vue' // 上传
  import api from '../../api'
  export default {
    props: [ 'info','type','showType'],
    data () {
      return {
        api,
        showItem:false,
        applyTime:new Date().getTime(),
        headerContent: {
          showId: {
            id: 'shortNoteId',
            title: '缩减方案',
          },
        },
      }
    },
    methods: {
      handleApplyTime (val) {
        this.info.applyTime=val;
      },
      //初始化请求列表数据
      init () {

      },
      expenseFileEvent(ids) {
        this.info.fileIds = ids;
      },
      toServe(type){
        console.log(type)
        this.info.state=type;
        if(this.info.reductionId){
          this.toChange()
        }else {
          this.toSubmit();

        }
      },
      toSubmit(){

        let opt = {
          ajaxSuccess: ()=>{
            if(this.info.state=='NO_SUBMIT'){
              this.successMess='保存成功'
            }else {
              this.successMess='上报成功'
            }
          },
          ajaxParams: {
            url: api.breaksAdd.path,
            method: api.breaksAdd.method,
            data: this.info,
            jsonString: true,
          },
        }
        this.ajax(opt)
      } ,
      toChange(){
        let opt = {
          ajaxSuccess: ()=>{
            if(this.info.state=='NO_SUBMIT'){
              this.successMess='保存成功'
            }else {
              this.successMess='上报成功'
            }
          },
          ajaxParams: {
            url: api.breaksModify.path+this.info.reductionId,
            method: api.breaksModify.method,
            data: this.info,
            jsonString: true,
          },
        }
        this.ajax(opt)
      } ,
//      getViewData () {
//        let id = this.info.id
//        let opt = {
//          ajaxSuccess: 'getViewDataSuccess',
//          ajaxError: () => this.errorMess('获取数据失败，请重试'),
//          ajaxParams: {
//            url: api.breaksGetUser.path,
//            method: api.breaksGetUser.method,
//            params: {
//              type,
//            },
//          },
//        }
//        this.ajax(opt)
//      },
      show () {
        this.openModel('show')
      },
      // 取消
      cancel (targer,val) {
        this[targer + 'Modal'] = false;
        if(val){
          this.info.cutsDetail=val;
        }
      },
      // 弹窗回调
      subCallback (target, title, updata) {
        this.cancel(target)
        if (title) {
          this.successMess(title)
        }
        if (!updata) {
          this.setTableData()
        }
      },
      pass() {
        this.info.state="PASS";
        let {applyState,expertsState,spState}=this.info;
        let external={applyState,expertsState,spState};
        let temp=Object.assign(this.info.cutsDetail,external)
        this.ajax({
          ajaxSuccess: ()=>{this.successMess='审核成功';this.$emit('cancel','show')},
          ajaxParams:{
            url: api.breaksAudit.path+this.info.reductionId,
            method:'post',
            jsonString:true,
            data: temp
          }
        })
      },
      openModel (options) {
        this[options + 'Modal'] = true
      },
    },
    created () {
      this.init()
    },
    mounted () {
      this.$nextTick(()=>{
        if(this.info.state=='NO_SUBMIT'){
          this.showItem=true;
        }else {
          this.showItem=false;
        }
      })
    },
    components: {
      UploadList,
      Show,
    },
  }
</script>

<style scoped>
  .rdyReductionApply .el-table {
    border: none;
  }

  .rdyReductionApply td {
    border: 1px solid #dfe6ec;
    border-collapse: collapse;
  }

  .rdyReductionApply .td-right {
    text-align: right;
  }


</style>
