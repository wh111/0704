<template>
  <div class="showOverflow">
    <el-form ref="formValidate" class="demo-form-inline" label-width="80px">
      <el-row>
        <el-col :span="22" :offset="1">
          <fieldset class="lose-margin2" style="margin-bottom: 30px">
            <legend>研究生津贴发放规则</legend>
            <el-row v-for="(item,index) in YJS" :key="index">
              <el-col :span="3">
                <el-form-item prop="name" label-width="0">
                  <el-input type="number" v-model.number="item.calculationMethod.minScore" min="0"
                            placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item prop="name" label="< 综合评分 >" label-width="120px">
                  <el-input type="number" min="0" v-model.number="item.calculationMethod.maxScore"
                            placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="name" label="硕士:" label-width="50px">
                  <el-input type="number" min="0" v-model.number="item.calculationMethod.master"
                            placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item prop="name" label="元/季度" label-width="60px"></el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="name" label="博士:" label-width="50px">
                  <el-input type="number" min="0" v-model.number="item.calculationMethod.doctor"
                            placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item prop="name" label="元/季度" label-width="60px"></el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button v-show="index!=0" type="danger" @click="removeYjs(index)" icon="close"></el-button>
              </el-col>
            </el-row>
            <el-button type="success" @click="addYjs">增加</el-button>

          </fieldset>

          <fieldset class="lose-margin2" style="margin-bottom: 30px">
            <legend>住院医津贴发放规则</legend>
            <el-row>
              <el-col :span="5">
                <el-form-item prop="name" label="全额发放:" label-width="75px">
                  <el-input type="number" v-model.number="ZYY.calculationMethod.amount" min="0"
                            placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item prop="name" label="元/月" label-width="60px"></el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item prop="name" label="旷工扣发:" label-width="75px">
                  <el-input type="number" min="0" v-model.number="ZYY.calculationMethod.absence"
                            placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item prop="name" label="元/天" label-width="60px"></el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item prop="name" label="请假扣发:" label-width="75px">
                  <el-input type="number" min="0" v-model.number="ZYY.calculationMethod.leave"
                            placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item prop="name" label="元/天" label-width="60px"></el-form-item>
              </el-col>
            </el-row>
          </fieldset>

          <fieldset class="lose-margin2" style="margin-bottom: 30px">
            <legend>进修生津贴发放规则</legend>
            <el-row>
              <el-col :span="6">
                <el-form-item prop="name" label="考核等级   优:" label-width="100px">
                  <el-input type="number" min="0" v-model.number="JXS.calculationMethod.good"
                            placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item prop="name" label="元/月" label-width="60px"></el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item prop="name" label="良:" label-width="35px">
                  <el-input type="number" min="0" v-model.number="JXS.calculationMethod.well"
                            placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item prop="name" label="元/月" label-width="60px"></el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item prop="name" label="差:" label-width="35px">
                  <el-input type="number" min="0" v-model.number="JXS.calculationMethod.bad"
                            placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item prop="name" label="元/月" label-width="60px"></el-form-item>
              </el-col>
            </el-row>
          </fieldset>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-col align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data() {
      return {
        courses: [{
          type: '',
          bizDict: ''
        }],
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        countDate: 0,
        //form表单bind数据
        formValidate: {
          name: '',
          identify: null,
          remark: '',
          type: []
        },
        YJS: [],
        ZYY: {
          "id": "3",
          "subsidizedPerson": "ZYY",
          "calculationMethod": {'amount': '1000', 'absence': '100', 'leave': '100'},
          "quarterMonth": "1",
          "reckonDate": "10"
        },
        JXS: {
          "id": "4",
          "subsidizedPerson": "JXS",
          "calculationMethod": {'good': '1000', 'well': '700', 'bad': '500'},
          "quarterMonth": "1",
          "reckonDate": "10"
        },


        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        setBenefitMessTitle: {
          type: 'setBenefit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: 'allowance/system/modifyAll',
            method: 'post',
            jsonString: 'jsonString'
          }
        },
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
//            url:'/role/get/'+this.operailityData.id,
            url: 'allowance/system/getAll',

          }
        }
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //初始化
      this.init();
    },
    methods: {

      /*
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData) {
        this.converterData(responseData.data)


//        this.data = responseData.data;
      },

      /*
      * 对获取的数据进行转换 data:[{
       "id":"2",
       "subsidizedPerson":"yjs",
       "calculationMethod":"{'minScore':'80','maxScore':'100','master':'1000','doctor':'3000'}",
       "quarterMonth":"1",
       "reckonDate":"10"
       }，{
       "id":"4",
       "subsidizedPerson":"jxs",
       "calculationMethod":"{'good':'1000','well':'700','bad':'500'}",
       "quarterMonth":"1",
       "reckonDate":"10"
       }]
       变成  yjs:[{
       "id":"1",
       "subsidizedPerson":"yjs",
       "calculationMethod":{'minScore':'80','maxScore':'100','master':'1000','doctor':'3000'},
       "quarterMonth":"1",
       "reckonDate":"10"
       },
       {
       "id":"2",
       "subsidizedPerson":"yjs",
       "calculationMethod":{'minScore':'80','maxScore':'100','master':'1000','doctor':'3000'},
       "quarterMonth":"1",
       "reckonDate":"10"
       }],
       zyy:{
       "id":"3",
       "subsidizedPerson":"zyy",
       "calculationMethod":{'amount':'1000','absence':'100','leave':'100'},
       "quarterMonth":"1",
       "reckonDate":"10"
       },
      * */
      converterData(data) {
        for (let i = 0; i < data.length; i++) {
          data[i].calculationMethod = eval("(" + data[i].calculationMethod + ")");
          if (data[i].subsidizedPerson == "YJS") {
            this.YJS.push(data[i])
          } else {
            this[data[i].subsidizedPerson] = data[i];
          }
        }
      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {

        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true)
          let editData = this.editDataConverter(this.ZYY, this.YJS, this.JXS)
          this.setBenefitMessTitle.ajaxParams.data = editData;
          this.ajax(this.setBenefitMessTitle, isLoadingFun)
        }
      },


      //对将要提交的数据进行转换
      editDataConverter(ZYY, YJS, JXS) {
        ZYY = this.getFormData(ZYY);
        YJS = this.getFormData(YJS);
        JXS = this.getFormData(JXS);
        let data = [];
        for (let i = 0; i < YJS.length; i++) {
          YJS[i].calculationMethod = JSON.stringify(YJS[i].calculationMethod);
        }

        ZYY.calculationMethod = JSON.stringify(ZYY.calculationMethod);
        JXS.calculationMethod = JSON.stringify(JXS.calculationMethod);
        data = data.concat(ZYY, YJS, JXS);

        return data
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
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'setBenefit');
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData;
        if (typeof data == 'object' && data.length > 0 && data[0]) {
          myData = Util._.defaultsDeep([], data);
        } else {
          myData = Util._.defaultsDeep({}, data);
        }
        return myData;
      },


      //增加Yjs
      addYjs() {
        this.YJS.push({
          "subsidizedPerson": "YJS",
          "calculationMethod": {'minScore': 0, 'maxScore': 0, 'master': 0, 'doctor': 0},
          "quarterMonth": "1",
          "reckonDate": "10"
        })
      },
      removeYjs(index) {
        this.YJS.splice(index, 1)
      }
    }
  }
</script>

