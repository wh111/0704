<template>

  <div class="largeCase">
    <div v-if="!showWhat">
      <el-row>
        <el-col :span="10" :offset="3">
          <el-form :model="formValidate" ref="formValidate"  class="demo-form-inline" label-width="90px">
            <el-form-item label="科室:" prop="dep">
              <el-select v-model="dep" placeholder="请选择">
                <el-option v-for="item in optionData" :key="item.id" :label="item.label" :value="item.depId+'-'+item.depName+'-'+item.podId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-button @click="podIdChange(dep)">确定</el-button>
        </el-col>
      </el-row>
    </div>
    <large-case @cancel="cancel" :url="url" @add="addSuccess" :podId="formValidate.podId" :depId="formValidate.depId" :depName="formValidate.depName"
      v-else-if="showWhat=='largeCase'"></large-case>
    <electrocardiogramTemplate @cancel="cancel" @add="addSuccess" :podId="formValidate.podId" :depId="formValidate.depId" :depName="formValidate.depName"
      :url="url" v-else-if="showWhat=='electrocardiogramTemplate'"></electrocardiogramTemplate>
    <imageTemplate @cancel="cancel" :url="url" @add="addSuccess" :podId="formValidate.podId" :depId="formValidate.depId" :depName="formValidate.depName"
      v-else-if="showWhat=='imageTemplate'"></imageTemplate>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;
  /*引入--大病历模板*/
  import largeCase from './largeCaseWrite_add/add_largeCaseTemplate.vue';
  /*引入--心电图模板*/
  import electrocardiogramTemplate from './largeCaseWrite_add/add_electrocardiogramTemplate.vue';
  /*引入--影像模板*/
  import imageTemplate from './largeCaseWrite_add/add_imageTemplate.vue';
  export default {
    props: ['operailityData', 'url', 'initData'],
    data() {
      return {
        showWhat:'',
        optionData: [],
        //保存按钮基本信息
        dep: '',
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        //form表单bind数据
        formValidate: {
          depId: '',
          depName: '',
          podId: '',
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: this.url.buildAdd,
            method: 'post',
            data: {},
          }
        },
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: '', //向后台请求数据的地址

          }
        }

      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
      let userInfo = this.$store.getters.getUserInfo;
      let role = userInfo.studentTypes;
      this.listMessTitle.ajaxParams.url = this.url.userRotaryDeptlistTree +role+'-' + userInfo.id;
      this.ajax(this.listMessTitle);
      if (this.initData) { // initData 数据结构与 formValidate 的一致
        this.formValidate = this.initData;
        this.podIdChange(this.initData.depId + '-' + this.initData.depName + '-' + this.initData.podId);
      }else {
          this.$emit('changeWidth',500)
      }
    },
    mounted() {
      //暂时没有初始化,预留初始化入口
    },
    methods: {
      //获取科室列表
      updateListData(res) {
        let data = res.data;
        if (!data) return;
        data = this.optionData = this.getQTBObj(res.data);
        for(let i=0;i<data.length;i++){
          let item = data[i];
          if(item.arrangeDepState=='P'){
            data.splice(i,1);
            i--;
          }else {
            if(item.podState==99){
              this.dep = item.depId+'-'+item.depName+'-'+item.podId
            }
          }
        }

      },
      // 处理科室数据结构（三级以下）
      getQTBObj(arr,res,depth=-1){
        depth++;
        let t = res || [];
        if(arr && arr.length) {
          arr.map(item => {
            item.label='　'.repeat(depth)+item.depName+'('+(item.beginTime||'')+')';
            t.push(item);
            if (item.childList){
              return t.concat(this.getQTBObj(item.childList,t,depth))
            }
          })
        }
        return t
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.addMessTitle, isLoadingFun)
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
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', this.addMessTitle.type);
      },


      addSuccess(target, title) {
        this.$emit('add', target, title)
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      /*
       * 组件初始化入口
       * */
      init() {
        //this.ajax(this.listMessTitle)
      },

      podIdChange(val) {
          if(!val){
            this.errorMess('请选择科室')
            return;
          }
        let dep = val.split('-');
        this.$emit('changeWidth',1000);
        this.formValidate.depId = dep[0];
        this.formValidate.depName = dep[1];
        this.formValidate.podId = dep[2];
//        if (dep[1] == '心电图') {
//          this.showWhat = 'imageTemplate';
//        } else if (dep[1] == '麻醉科') {
//          this.showWhat = 'electrocardiogramTemplate';
//        } else {
//          this.showWhat = 'largeCase';
//        }
        this.showWhat = 'largeCase';

        //            largeCase electrocardiogramTemplate imageTemplate
      },
    },


    components: {
      //当前组件引入的子组件
      largeCase,
      electrocardiogramTemplate,
      imageTemplate
    },


  }

</script>
<style>
  .date {
    line-height: 25px;
  }

  .date .countDate {
    display: inline-block;
    width: 70px;
    text-align: center;
    border-bottom: 1px solid;
  }

</style>
