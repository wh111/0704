<!--档案管理修改-->
<!--基本情况-->

<template>
  <div >
    <el-form ref="formValidate" :model="formValidate"  class="demo-form-inline" label-width="110px" >
      <!--标题-->
      <el-row >
        <el-col :span="10" :offset="10" class="lose-margin2">
          <span class="table-headline ">基本情况</span>
        </el-col >
      </el-row >
      <!--内容-->
      <el-row>
        <el-col :span="22" :offset="1">
          <el-row :gutter="20">
            <el-col :span="19"  >
              <el-row :gutter="10" class="table-back-one">
                <el-col :span="8" >
                  <el-form-item label="姓名：" prop="name" >
                    <el-input v-model="formValidate.name" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" >
                  <el-form-item label="性别：" prop="sex" >
                    <el-input v-model="formValidate.sex" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" >
                  <el-form-item label="民族：" prop="nation" >
                    <el-input v-model="formValidate.nation" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
              </el-row >

              <el-row :gutter="10" class="table-back-two">
                <el-col :span="8" >
                  <el-form-item label="出生年月：" prop="birth" >
                    <el-input v-model="formValidate.birth" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" >
                  <el-form-item label="籍贯：" prop="origin" >
                    <el-input v-model="formValidate.origin" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" >
                  <el-form-item label="政治面貌：" prop="political" >
                    <el-input v-model="formValidate.political" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
              </el-row >

              <el-row :gutter="10" class="table-back-one">
                <el-col :span="8" >
                  <el-form-item label="最高学历：" prop="highestEdu" >
                    <el-input v-model="formValidate.highestEdu" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" >
                  <el-form-item label="专业：" prop="specialty" >
                    <el-input v-model="formValidate.specialty" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" >
                  <el-form-item label="学校：" prop="school" >
                    <el-input v-model="formValidate.school" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
              </el-row >


              <el-row :gutter="10" class="table-back-two">
                <el-col :span="12" >
                  <el-form-item label="年级：" prop="grade" >
                    <el-input v-model="formValidate.grade" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="12" >
                  <el-form-item label="学制：" prop="length" >
                    <el-input v-model="formValidate.length" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
              </el-row >
            </el-col >

            <el-col :span="5" class="table-back-one" >

            </el-col>

          </el-row >


          <el-row :gutter="10" class="table-back-one">
            <el-col :span="11" >
              <el-form-item label="参加工作时间：" prop="jobTime" >
                <el-input v-model="formValidate.jobTime" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" >
              <el-form-item label="职务：" prop="duties" >
                <el-input v-model="formValidate.duties" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row >

          <el-row :gutter="10" class="table-back-two">
            <el-col :span="11" >
              <el-form-item label="是否执业医师：" prop="doctor" >
                <el-radio-group v-model="formValidate.doctor">
                  <el-radio label="0">是</el-radio>
                  <el-radio label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="11" >
              <el-form-item label="医师资格级别：" prop="doctorLevel" >
                <el-select v-model="formValidate.doctorLevel" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :label="item.label"
                    :value="item.value"
                    :key="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row >

          <el-row :gutter="10" class="table-back-one">
            <el-col :span="11" >
              <el-form-item label="身份证号码：" prop="idNumber" >
                <el-input v-model="formValidate.idNumber" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" >
              <el-form-item label="手机号码：" prop="mobile" >
                <el-input v-model="formValidate.mobile" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row >

          <el-row :gutter="10" class="table-back-two">
            <el-col :span="11" >
              <el-form-item label="紧急联系人：" prop="emgContact" >
                <el-input v-model="formValidate.emgContact" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" >
              <el-form-item label="紧急联系人电话：" prop="emgContactMobile" label-width="130px">
                <el-input v-model="formValidate.emgContactMobile" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row >

          <el-row :gutter="10" class="table-back-one">
            <el-col :span="8" >
              <el-form-item label="QQ：" prop="qq" >
                <el-input v-model="formValidate.qq" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <el-form-item label="邮箱：" prop="email" >
                <el-input v-model="formValidate.email" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <el-form-item label="办公电话：" prop="telephone" >
                <el-input v-model="formValidate.telephone" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row >

          <el-row :gutter="10" class="table-back-two-d">
            <el-col :span="11" >
              <el-form-item label="现住地址：" prop="address" >
                <el-input v-model="formValidate.address"placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" >
              <el-form-item label="邮编：" prop="postCode" >
                <el-input v-model="formValidate.postCode" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row >
        </el-col>
      </el-row>

    </el-form>
    <br />
    <el-row >
      <el-col :span="10" :offset="10">
        <load-btn @listenSubEvent="saveCurrData" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  //上传头像组件引入
  import upHeader from '../../../../common/uploadHeader.vue';
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['dataId'],
    data (){
      return{
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

        //保存按钮基本信息
        loadBtn:{title:'保存',callParEvent:'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          deptId:'',  //部门id
          name:'',  //姓名
          sex:'',   //性别
          nation:'',  //民族
          birth:'',  //出生日期
          origin:'',  //籍贯
          political:'',   //政治面貌
          highestEdu:'',   //最高学历
          specialty:'',   //专业
          school:'',   //学校
          jobTime:'',   //参加工作时间，年月，例如：199011
          grade:'',   //年级
          classNum:'',   //班级
          length:'',   //学制
          duties:'',   //职务
          doctor:'',   //是否执业医师:是、否
          doctorLevel:'',   //医师资格级别(职业、助理、无)
          idNumber:'',   //身份证号码
          mobile:'',    //手机号
          emgContact:'',   //紧急联系人
          emgContactMobile:'',   //紧急联系人电话
          qq:'',//qq
          email:'',//邮箱
          telephone:'',//办公电话
          address:'',//现住地址
          postCode:'',//邮编
          headPhoto:'',//头像地址
          headphotoHttp:''//头像全地址
        },
        //上传头像
        uploadHeaderUrl:'/file/upload/static',
        //是否显示头像
        showImg:true,
        imgSrc:'',
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'saveBasicSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'/archives/save/basic',
            method:'post',
            data:{}
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        initMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'/archives/get/basic/'+this.dataId
          }
        }
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      //初始化
      this.init();
    },
    mounted(){

    },
    methods:{
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.initMessTitle);
      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      saveCurrData(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.editMessTitle, isLoadingFun)
        }
      },


      //保存成功后回调
      saveBasicSuccess(){
          alert("===")
        this.successMess("修改成功!");
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


      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        this.formValidate = data;
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','edit');
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },


      /*
       * 设置是否显示上传头像loading
       *
       * @param resData  {}  上传成功后后台返回的数据 {"relativePathFile":"img/2017/04/28/20170428093435979.png","staticUrl":"http://ip:port/static/"}
       *
       * @param imgSrc  string  头像路径
       * */
      setUploadHeaderSuccessUrl(resData,imgSrc){
        this.formValidate.headPhoto = resData["relativePathFile"];
        this.imgSrc = imgSrc;
      },

    },
    components:{
      upHeader
    }
  }
</script>


