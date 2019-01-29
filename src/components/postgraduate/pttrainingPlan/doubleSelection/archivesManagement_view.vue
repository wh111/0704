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
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-form-item label="专科专业：" prop="specialty">
                    <slot name="name">
                      {{ formValidate.specialtyName}}
                    </slot>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>

            <el-row :gutter="10" class="table-back-two">
              <el-col :span="12" style="margin-top: 20px;">
                <el-form-item label="导师姓名：" prop="name">
                  {{ formValidate.name }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别：" prop="sex">
                  {{ formValidate.sex  | typeText }}
                </el-form-item>
              </el-col>
              <el-col :span="12" style="float: right; overflow: hidden;">
                <el-form-item label="职称：" prop="doctor">
                  {{ formValidate.teachTitle }}
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10" class="table-back-one">
              <el-col :span="12">
                <el-form-item label="博导/硕导：" prop="tutorType">
                  {{ formValidate.tutorType | typeText}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="出生年月：" prop="birth">
                  {{ formValidate.birth }}
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10" class="table-back-two">
              <el-col :span="24">
                <el-form-item label="担任导师：" prop="serveTutor">
                  {{ formValidate.serveTutor }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="4" class="table-back-header" style="height: 224px; border-left: none; border-bottom: none; border-right:1px solid rgb(221,221,221);;">
            <user-avatar :src="imgSrc" tipText="还未上传"></user-avatar>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="table-back-two">
          <el-col :span="24">
            <el-form-item label="主要研究方向：" prop="researchDirection">
              {{formValidate.researchDirection}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="table-back-two-d">
          <el-col :span="12">
            <el-form-item label="邮箱：" prop="email">
              {{ formValidate.email }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：" prop="mobile">
              {{ formValidate.mobile }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import api from './api';
  import userAvatar from '../../../common/userAvatar.vue';
  export default {
    /**
     * operailityData 阅览数据
     * dataId 档案id
     * dataId 与 operailityData 二选一传，operailityData权重低于dataId
     * byFilter 是否需要根据角色权限进行过滤显示字段
     * */
    props: ['operailityData', 'dataId'],

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
          updateTime: '', //紧急联系人电话
          qq: '', //qq
          email: '', //邮箱
          telephone: '', //办公电话
          address: '', //现住地址
          postCode: '', //邮编
          headPhoto: '', //头像地址
          headPhotoHttp: '', //头像全地址
          fromHospital: '', //来源单位
          tutorType:'',//博导/硕导
          serveTutor:'',//担任导师
          researchDirection:'',//主要研究方向
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
          this.getViewData()
      },

      // 通过id获取查看视图
      getViewData(){
        let opt = {
          ajaxSuccess: res=>this.SuccessGetCurrData(res.data),
          ajaxParams:{
            url: api['otherGet'].path + this.dataId,
            params:{
              archivesId: this.id,
            }
          }
        };
        this.ajax(opt)
        let obj = {
          ajaxSuccess: res=>this.SuccessGetCurrData(res.data),
          ajaxParams:{
            url: api['archivesGet'].path + this.dataId,
            params:{
              archivesId: this.id,
            }
          }
        };
        this.ajax(obj)


      },

      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(data) {
        if (data === null || typeof data == "undefined" || data == "") return;
        Object.assign(this.formValidate, data)
        // let data = this.initData; //this.$store.state.archivesAudit.index.archivesContent.archivesBasicInfoDto;//this.initData;//responseData.data;


        // this.formValidate = this.formDate(data, ['birth', 'jobTime'], this.yearMonth);
        let env = this.$store.getters.getEnvPath;
        if (this.formValidate.headPhoto) {
          this.imgSrc = env["http"] + this.formValidate.headPhoto;
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
      userAvatar
    }
  }

</script>
