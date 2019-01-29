<template>
  <!-- 基本信息 - 研究生 - 填写 -->
  <el-form ref="formValidate" :rules="rules" :model="formValidate" class="editForm archivesBasicInput"
           label-width="115px">
    <!--标题-->
    <el-row>
      <el-col :span="24" class="lose-margin2" style="text-align: center">
        <span class="table-headline ">基本情况</span>
      </el-col>
    </el-row>
    <!--内容-->
    <el-row>
      <el-col :span="24">
        <el-row :gutter="10">
          <el-col :span="20">
            <el-row :gutter="10" class="table-back-one">
              <el-col :span="8">

                <el-form-item label="姓名：" prop="name">
                  <span
                    v-if="formValidate.auditStatus=='AUDIT_SUCCESS'||formValidate.auditStatus=='NOT_AUDIT'">{{formValidate.name}}</span>
                  <el-input v-else v-model="formValidate.name" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="性别：" prop="sex">
                  <el-select v-model="formValidate.sex" placeholder="请选择">
                    <el-option
                      v-for="item in dictionary.gender"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="民族：" prop="nation">
                  <el-select v-model="formValidate.nation" filterable placeholder="请选择">
                    <el-option
                      v-for="item in dictionary.nation"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10" class="table-back-two">
              <el-col :span="8">
                <el-form-item label="出生年月：" prop="birth">
                  <el-date-picker
                    :editable="false"
                    v-model="formValidate.birth"
                    type="month"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="籍贯：" prop="origin">
                  <el-input v-model="formValidate.origin" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="政治面貌：" prop="political">
                  <el-select v-model="formValidate.political" filterable placeholder="请选择">
                    <el-option
                      v-for="item in dictionary.political"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10" class="table-back-one">
              <el-col :span="8">
                <el-form-item label="最高学历：" prop="highestEdu">
                  <el-input v-model="formValidate.highestEdu" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="专业：" prop="specialty">
                  <el-select v-model="formValidate.specialty" placeholder="请选择">
                    <selectOption type="getByCode" unAll="true" isCode="true" id="value" codeType="TRAINING_DIRECTION_SX"></selectOption>
                  </el-select>
                  <!--<el-input v-model="formValidate.specialty" placeholder="请输入"></el-input>-->
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="学校：" prop="schoolId">
                  <el-select v-model="formValidate.schoolId" clearable filterable
                             placeholder="请选择">
                    <select-option unAll="true" ref="school" :url="url.schools.path"></select-option>
                  </el-select>
                  <!--  <search-select @setSltOptionValue="setSltOptionValue" :selectOptions="selectOptions"
                                   :selVal="schoolId"></search-select>-->
                </el-form-item>
              </el-col>
            </el-row>

            <!--<el-row :gutter="10" class="table-back-two">-->
              <!--<el-col :span="8">-->
                <!--<el-form-item label="年级：" prop="grade">-->
                  <!--<el-input v-model="formValidate.grade" placeholder="请输入"></el-input>-->
                <!--</el-form-item>-->
              <!--</el-col>-->

              <!--<el-col :span="8">-->
                <!--<el-form-item label="学制：" prop="length">-->
                  <!--<el-input v-model="formValidate.length" placeholder="请输入"></el-input>-->
                <!--</el-form-item>-->
              <!--</el-col>-->
              <!--<el-col :span="8">-->
                <!--<el-form-item label="班级：" prop="classNum">-->
                  <!--<el-input v-model="formValidate.classNum" placeholder="请输入"></el-input>-->
                <!--</el-form-item>-->
              <!--</el-col>-->
            <!--</el-row>-->

            <el-row :gutter="10" class="table-back-two">
              <el-col :span="8">
                <el-form-item label="编号：" prop="codeNumber">
                  <el-input v-model="formValidate.codeNumber" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="参加工作时间：" prop="jobTime">
                  <el-date-picker
                    :editable="false"
                    v-model="formValidate.jobTime"
                    type="month"
                    placeholder="选择日期"
                  >
                  </el-date-picker>

                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="职务：" prop="duties">
                  <el-input v-model="formValidate.duties" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="4" class="table-back-header">
            <up-header @upladSuccess="setUploadHeaderSuccessUrl" :imgFile="imgSrc"
                       :actionUrl="uploadHeaderUrl" :avatarTips="true"></up-header>
          </el-col>

        </el-row>


        <el-row :gutter="10" class="table-back-one">
          <el-col :span="8">
            <el-form-item label="学位：" prop="degree">
              <el-select v-model="formValidate.degree" placeholder="请选择">
                <el-option v-for="(item,index) in degreeOptions" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <!--<el-input v-model="formValidate.degree" placeholder="请输入"></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="专业名称：" prop="majorCode">
                <el-select v-model="formValidate.majorCode" placeholder="请选择" @change="change">
                <el-option v-for="(item,index) in majorOptions" :key="index" :label="item.name+'('+item.code+')'" :value="item.code"></el-option>
              </el-select>
              <!--<el-input v-model="formValidate.majorCode" placeholder="请输入"></el-input>-->
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="培训方向：" prop="rotaryProclass">
              <el-select filterable  v-model="formValidate.rotaryProclass" placeholder="请选择">
                <!--<select-option :type="'byNowUser'" ></select-option>-->
                <select-option unAll="true" type="getByCode" codeType="ROTARY_PROCLASS" isCode="true" :id="'value'" ></select-option>
              </el-select>
              <!--<el-input v-model="formValidate.specialty" placeholder="请输入"></el-input>-->
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="table-back-two">
          <el-col :span="12">
            <el-form-item label="学号：" prop="studentId">
              <el-input v-model="formValidate.studentId" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业代码：">
              {{ formValidate.majorCode }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="table-back-two">
          <el-col :span="12">
            <el-form-item label="是否执业医师：" prop="doctor">
              <el-radio-group v-model="formValidate.doctor">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
              <div style="display: inline-block;margin-left: 16px;" v-if="formValidate.doctor==1">
                <span>医师资格级别：</span>
                <el-select v-model="formValidate.doctorLevel" placeholder="请选择" class="doctorLevel">
                  <el-option
                    v-for="item in options"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="办公电话：" prop="telephone">
              <el-input v-model="formValidate.telephone" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="table-back-one">
          <el-col :span="12">
            <el-form-item label="身份证号码：" prop="idNumber">
              <el-input v-model="formValidate.idNumber" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码：" prop="mobile">
              <el-input v-model="formValidate.mobile" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="table-back-two">
          <el-col :span="12">
            <el-form-item label="紧急联系人：" prop="emgContact">
              <el-input v-model="formValidate.emgContact" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急联系人电话：" prop="emgContactMobile" label-width="140px">
              <el-input v-model="formValidate.emgContactMobile" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="table-back-one">
          <el-col :span="12">
            <el-form-item label="现住地址：" prop="address">
              <el-input v-model="formValidate.address" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮编：" prop="postCode">
              <el-input v-model="formValidate.postCode" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="table-back-two-d">
          <el-col :span="12">
            <el-form-item label="QQ：" prop="qq">
              <el-input v-model="formValidate.qq" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="formValidate.email" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="table-back-two-d">
          <el-col :span="12" class="editForm">
            <el-form-item label="培训年限：" prop="rotaryAdmrank">
              <el-select v-model="formValidate.rotaryAdmrank" filterable placeholder="请选择">
                <el-option v-for="item in 3" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参培年份：" prop="rotaryYear">
              <el-date-picker v-model="formValidate.rotaryYear" type="year" placeholder="选择年份" :editable="false"
                              @change="changeRotaryYear"></el-date-picker>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="10" class="table-back-two-d">
          <el-col :span="12">
            <el-form-item label="人员属性：" prop="rotaryZyytype">
              <el-select v-model="formValidate.rotaryZyytype" filterable placeholder="请选择">
                <el-option v-for="item in rotaryZyytypeOption" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import pubApi from '../api';
  import api from '../../../../postgraduate/ptEnrollEnroll/yjsPersonnelManagement/api';

  import {pub, yjs} from '../rules.js';
  //上传头像组件引入
  import upHeader from '../../../../common/uploadHeader.vue';
  //前台业务字典组件引入
  import dictionary from '../../../../../libs/dictionary.js';
  //来源单位、学校公用组件
  import searchSelect from '../../../../common/searchSelect.vue';

  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    // addRules 追加的验证规则
    props: ['operailityData', 'addRules', 'dataId','mustUploadHP'],
    data() {
      return {
        url: pubApi,
        rules: {},
        //公用业务字典
        dictionary,
        // 学位
        degreeOptions:[{
          label:"学术学位",
          value:"MAJOR"
        },{
          label:"专业学位",
          value:"LEARNING"
        }],
        //医师资格级别
        options: [{
          value: '0',
          label: '职业'
        }, {
          value: '1',
          label: '助理'
        }, {
          value: '2',
          label: '无'
        }],


        //学校
        selectOptions: {
          multiple: false, //是否多选
          url: "/schools/queryList"
        },

        schoolId: '', // 选中的学校id
        //form表单bind数据
        formValidate: {
            major: '',//研究生专业名称
          deptId: '', //部门id
          name: '', //姓名
          auditStatus: '', //审核通过判断
          sex: '', //性别
          nation: '', //民族
          birth: '', //出生日期
          origin: '', //籍贯
          political: '', //政治面貌
          highestEdu: '', //最高学历
          specialty: '', //专业
          school: '', //学校
          schoolId: '',
          codeNumber: '', // 编号
          jobTime: '', //参加工作时间，年月，例如：199011
          grade: '', //年级
          classNum: '', //班级
          length: '', //学制
          duties: '', //职务
          doctor: '0', //是否执业医师:是、否
          doctorLevel: '', //医师资格级别(职业、助理、无)
          idNumber: '', //身份证号码
          mobile: '', //手机号
          emgContact: '', //紧急联系人
          emgContactMobile: '', //紧急联系人电话
          qq: '', //qq
          email: '', //邮箱
          telephone: '', //办公电话
          address: '', //现住地址
          postCode: '', //邮编
          headPhoto: '', //头像地址
          headPhotoHttp: '', //头像全地址
          rotaryProclass:'',
          degree: '', // 学术学位
          majorCode: '', // 专业代码
          studentId: '', // 学号
          rotaryZyytype:'',
          rotaryAdmrank:'',
          rotaryYear:'',
        },
        //上传头像
        uploadHeaderUrl: pubApi.uploadHeaderUrl,
        //是否显示头像
        imgSrc: '',

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'save',
          successTitle: '保存成功!',
          errorTitle: '保存失败!',
          ajaxSuccess: 'saveSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.save.path,
            method: api.save.method,
            data: {}
          }
        },
        // 专业选项
        majorOptions:{},
        rotaryZyytypeOption:[],
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
      //初始化
      this.init();
      this.getRotaryZyytype()
      this.uploadHeaderUrl = pubApi.uploadHeaderUrl + '?userId=' + (this.operailityData && this.operailityData.id)
    },
    methods: {
      // 获取人员属性选择项
       getRotaryZyytype() {
        this.ajax({
          ajaxSuccess: res => this.rotaryZyytypeOption = res.data.child || [],
          ajaxError: () => {
            this.errorMess('获取人员属性失败，请重试！')
          },
          ajaxParams: {
            url: '/dictionary/getByCode/ROTARY_ZYY_TYPE',
            method: 'get',
            data: {}
          }
        })
       },
        change(val) {//研究生专业名称
          if (this.majorOptions[val])
            this.formValidate.major = this.majorOptions[val].name;
        },
      /*
       * 组件初始化入口
       * */
      init() {
        this.rules = Util._.defaultsDeep({}, pub, yjs, this.addRules || {});
        this.getDictionaryForMajor();
        //初始化数据
        if (this.dataId) {
          this.getViewData()
        } else {
          this.SuccessGetCurrData(this.operailityData);
        }
        this.getDictionaryForPassWorld();
      },

      // 获取字典 - 初始密码
      getDictionaryForPassWorld(){
        let opt = {
          ajaxSuccess: res => {
            this.$notify.info({
              title: '提示',
              message: `可通过基本信息中的编号、手机号码和邮箱登录本系统；初始密码为：${res.data.child.length && res.data.child[0].value || '——' }。`
            });
          },
          ajaxParams: {
            url: pubApi.getDictionary + 'PASSWORD',
            method: 'get'
          }
        }
        this.ajax(opt)
      },

      // 获取字典 - 专业
      getDictionaryForMajor() {
        let opt = {
          ajaxSuccess: res => {
            this.majorOptions = {};
            (res.data||[]).map(item => {
              this.majorOptions[item.code] = item
            })
          },
          ajaxError: () => this.errorMess('获取专业失败，请重试'),
          ajaxParams: {
            url: pubApi.major,
            method: 'get',
            params:{
              depth:2,
            }
          }
        }
        this.ajax(opt)
      },

      // 通过id获取数据
      getViewData() {
        let opt = {
          ajaxSuccess: res => this.SuccessGetCurrData(res.data),
          ajaxParams: {
            url: api.get.path + this.dataId,
            params: {
              archivesId: this.dataId,
            }
          }
        };
        this.ajax(opt)
      },

      // 返回输入的数据
      getInputData() {
        let isSubmit = this.submitForm("formValidate");
        let data = false;
        if (isSubmit && this.hasUploadPH()) {
          data = this.getFormData(this.formValidate);
        }
        return data
      },

      // 是否上传头像
      hasUploadPH(){
        let upled = true;
        if(this.mustUploadHP == true && !this.formValidate.headPhoto){
          upled = false;
          this.errorMess('请上传头像！')
        }
        return upled
      },

      // 保存
      saveCurrData() {
        let data = this.getInputData();
        if (data) {
          this.editMessTitle.ajaxParams.data = data;
          this.ajax(this.editMessTitle)
        }
      },

      //保存成功后回调
      saveSuccess() {
        this.$emit("save", 'basic');
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
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(data) {
        // let data = this.initData; //this.$store.state.archivesAudit.index.archivesContent.archivesBasicInfoDto;//this.initData;//responseData.data;
        if (!data) return;
        data = this.formDate(data, ['birth', 'jobTime'], this.yearMonth);
        for (let key in data) {
          if (data[key] !== null) {
            this.formValidate[key] = data[key]
          }
        }
        let env = this.$store.getters.getEnvPath;
        if (data.headPhoto) {
          this.imgSrc = env["http"] + data.headPhoto;
        } else {
          this.imgSrc = "";
        }
        this.schoolId = this.formValidate.schoolId;
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        this.formDate(myData, ['jobTime', 'birth'], this.yearMonth);
        let schoolOption = this.$refs.school.getOptionData();//获取学校数据
        //补充数据
        schoolOption.map(item => {
          if (item.id === this.formValidate.schoolId) {
            myData.school = item.name;
            myData.schoolName = item.name;
          }
        })
        return myData;
      },

      /*
       * 设置是否显示上传头像loading
       *
       * @param resData  {}  上传成功后后台返回的数据 {"relativePathFile":"img/2017/04/28/20170428093435979.png","staticUrl":"http://ip:port/static/"}
       *
       * @param imgSrc  string  头像路径
       * */
      setUploadHeaderSuccessUrl(resData, imgSrc) {
        this.formValidate.headPhoto = resData;
        this.imgSrc = this.$store.state.envPath.http + resData;
      },

      // 参培年份
      changeRotaryYear(val) {
        this.formValidate.rotaryYear = val;
      },

      /* /!*
        * 设置学校选中的值
        * @param val string || number  选中学校的id
        * *!/
       setSltOptionValue(val, id) {
         this.formValidate.schoolId = id;
         this.formValidate.school = val;
       }*/
    },
    components: {
      upHeader, searchSelect
    },
    watch: {
      operailityData(val) {
        this.SuccessGetCurrData(val)
      }
    },
  }

</script>
<style lang="scss">
  @import "../../../../../assets/ambuf/css/manage_v1.0/editForm.scss";
  @import "../../../../../assets/ambuf/css/archives_v1.0/archivesBasicInput.scss";
</style>
