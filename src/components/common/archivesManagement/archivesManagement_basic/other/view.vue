<template>
  <!-- 基本信息 - 其他人员 - 查看 -->
  <el-form ref="formValidate" class="demo-form-inline" label-width="115px">
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
                  <slot name="name">
                    {{ formValidate.name }}
                  </slot>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="性别：" prop="sex">
                  {{ formValidate.sex | typeText }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="民族：" prop="nation">
                  {{ formValidate.nation }}
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10" class="table-back-two">
              <el-col :span="8">
                <el-form-item label="出生年月：" prop="birth">
                  {{ formValidate.birth }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="籍贯：" prop="origin">
                  {{ formValidate.origin }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="政治面貌：" prop="political">
                  {{ formValidate.political }}
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10" class="table-back-one">
              <el-col :span="8">
                <el-form-item label="最高学历：" prop="highestEdu">
                  {{ formValidate.highestEdu }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="专业：" prop="specialty">
                  {{ formValidate.specialty }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="学校：" prop="school">
                  {{ formValidate.school||formValidate.schoolName }}
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10" class="table-back-two">
              <el-col :span="8">
                <el-form-item label="编号：" prop="codeNumber">
                  {{ formValidate.codeNumber }}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="参加工作时间：" prop="jobTime">
                  {{ formValidate.jobTime }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="职务：" prop="duties">
                  {{ formValidate.duties }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="4" class="table-back-header">
            <user-avatar :src="imgSrc" tipText="还未上传"></user-avatar>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="table-back-two">
          <el-col :span="12">
            <el-form-item label="是否执业医师：" prop="doctor">
              {{formValidate.doctor | typeText}}
              <div style="display: inline-block;margin-left: 16px;" v-if="formValidate.doctor==1">
                <span>医师资格级别：</span>
                {{ (formValidate.doctorLevel || '-') | qfcLevel}}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="办公电话：" prop="telephone">
              {{ formValidate.telephone }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="table-back-one">
          <el-col :span="12">
            <el-form-item label="身份证号码：" prop="idNumber">
              {{ formValidate.idNumber }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码：" prop="mobile">
              {{ formValidate.mobile }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="table-back-two">
          <el-col :span="12">
            <el-form-item label="紧急联系人：" prop="emgContact">
              {{ formValidate.emgContact }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急联系人电话：" prop="emgContactMobile" label-width="130px">
              {{ formValidate.emgContactMobile }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="table-back-one">
          <el-col :span="12">
            <el-form-item label="现住地址：" prop="address">
              {{ formValidate.address }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮编：" prop="postCode">
              {{ formValidate.postCode }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="table-back-two">
          <el-col :span="12">
            <el-form-item label="QQ：" prop="qq">
              {{ formValidate.qq }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱：" prop="email">
              {{ formValidate.email }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="table-back-two-d">
          <el-col :span="12">
            <el-form-item label="来源单位：" prop="fromHospital">
              {{ formValidate.fromHospital }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可带教生源：" prop="fromHospital">
              {{ formValidate.teachableStudentTypes }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import api from '../api';
  import userAvatar from '../../../userAvatar.vue';
  export default {
    /**
     * operailityData 阅览数据
     * dataId 档案id
     * dataId 与 operailityData 二选一传，operailityData权重低于dataId
     * byFilter 是否需要根据角色权限进行过滤显示字段
     * */
    props: ['operailityData', 'dataId', 'byFilter'],
    data() {
      return {
        //form表单bind数据
        formValidate: {
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
          codeNumber: '', // 编号
          jobTime: '', //参加工作时间，年月，例如：199011
          grade: '', //年级
          classNum: '', //班级
          length: '', //学制
          duties: '', //职务
          doctor: '', //是否执业医师:是、否
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
          fromHospital: '', //来源单位
          teachableStudentTypes: '',//可带教生源
        },
        //是否显示头像
        imgSrc: '',
      }
    },
    created() {
      //初始化
      this.init();
    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init() {
        //初始化数据
        if(this.dataId){
          this.getViewData()
        }else{
          this.SuccessGetCurrData(this.operailityData);
        }
      },

      // 通过id获取查看视图
      getViewData(){
        let opt = {
          ajaxSuccess: res=>this.SuccessGetCurrData(res.data),
          ajaxParams:{
            url: api[this.byFilter ? 'otherGetByFilter' : 'otherGet'].path + this.dataId,
            params:{
              archivesId: this.dataId,
            }
          }
        };
        this.ajax(opt)
      },

      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(data) {
       // let data = this.initData; //this.$store.state.archivesAudit.index.archivesContent.archivesBasicInfoDto;//this.initData;//responseData.data;
        if (data === null || typeof data == "undefined" || data == "") return;
        this.formValidate = this.formDate(data, ['birth', 'jobTime'], this.yearMonth);
        let env = this.$store.getters.getEnvPath;
        if (data.headPhoto) {
          this.imgSrc = env["http"] + data.headPhoto;
        } else {
          this.imgSrc = "";
        }
      },
    },
    watch:{
      operailityData(val){
        this.SuccessGetCurrData(val)
      }
    },
    components: {
      userAvatar,
    }
  }

</script>
