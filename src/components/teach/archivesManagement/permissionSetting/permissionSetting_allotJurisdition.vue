<!--分配选择-->
<template>
  <div>
    <Tabs :animated="false">
      <Tab-pane label="请勾选需要保密的项">
        <Menu :theme="theme" :active-name="activeName" @on-select="setTabContent">
          <Menu-item v-for="(item,index) in options" :name="index" :key="index">
            {{ modelName[index] }}
          </Menu-item>
        </Menu>
      </Tab-pane>
    </Tabs>

    <div class="ivu-tabs-bar"></div>
    <div style="text-align: center">
      <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      <el-button @click="cancel">取消</el-button>
    </div>
    <div v-if="activeName" style="position: absolute;left: 275px;right: 8px;top: 120px;bottom: 100px;overflow: auto">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
        {{ modelName[activeName] }}
      </el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedOptions">
        <el-checkbox class="pisSelectItem" v-for="(item,index) in options[activeName]"
                      :key="index" :label="item.model+item.id"
                      @change="handleCheckedChange(item)">{{item.attrName}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
  import api from './api';
  import modelName from './modelName';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['showData'],
    data() {
      return {
        modelName,
        theme: 'light',
        // 激活的菜单
        activeName:"",
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        checkedOptions: [],
        // 角色属性所对应的角色
        options: {},
        checkNum:{},
        isIndeterminate: false,
        checkAll: false,
        //form表单bind数据
        formValidate: {},
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        allotJurisditionMessTitle: {
          type: 'allotJurisdition',
          successTitle: '保存成功!',
          errorTitle: '保存失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.add.path + this.showData.id,
            method: api.add.method,
            jsonString:true,
          }
        },
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //暂时没有初始化,预留初始化入口
      this.init();
    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init() {
        this.getArchivesRoleAttr()
      },

      // 获取角色属性
      getArchivesRoleAttr() {
        let opt = {
          ajaxSuccess: "getArchivesRoleAttrSuccess",
          ajaxParams: {
            url: api.get.path + this.showData.id,
            method: api.get.method,
          }
        };
        this.ajax(opt)
      },

      getArchivesRoleAttrSuccess(res){
        let options = this.options;
        let models = [];
        if(!res.data || !res.data.length){
          return
        }
        res.data.map(item=>{
          if (!options[item.model]){
            options[item.model] = [];
            models.push(item.model);
            this.checkNum[item.model] = 0;
          }
          if (item.choose){
            this.checkedOptions.push(item.model+item.id);
            this.checkNum[item.model] += 1;
          }
          options[item.model].push(item)
        })
        this.activeName = models[0];
        this.isSelectAll();
      },

      /*
      * 点击左侧选项卡调用
      * @param n number  当前选项卡索引
      * */
      setTabContent(type) {
        this.activeName = '';
        setTimeout(()=>{
          this.activeName = type;
          this.isSelectAll()
        },10)
      },

      isSelectAll(){
        let checkAll = this.checkNum[this.activeName] && this.checkNum[this.activeName] === this.options[this.activeName].length;
        this.checkAll = checkAll;
        this.isIndeterminate = !!this.checkNum[this.activeName] && !checkAll;
      },

      selectAll(type){
        this.options[this.activeName].map(item=>{
          if (type && this.checkedOptions.indexOf(item.model+item.id)===-1){
            this.checkedOptions.push(item.model+item.id);
          }
          item.choose = type;
        })
        if(type){
          this.checkNum[this.activeName] = this.options[this.activeName].length;
        }else {
          let t = [];
          this.checkedOptions.map(item=>{
            if(item.indexOf(this.activeName)===-1){
              t.push(item)
            }
          })
          this.checkedOptions = t;
          this.checkNum[this.activeName] = 0;
        }
        this.checkAll = type;
        this.isIndeterminate = false;
      },

      //点击全选单选框
      handleCheckAllChange(event) {
        let isCheckAll = event.target.checked;
        if(isCheckAll){
          this.selectAll(true)
        }else {
          this.selectAll(false)
        }
      },
      handleCheckedChange(v) {
        v.choose = !v.choose;
        if(v.choose){
          this.checkNum[this.activeName] += 1;
        }else {
          this.checkNum[this.activeName] -= 1;
        }
        this.isSelectAll()
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true);
        let data = [];
        for(let key in Util._.defaultsDeep([], this.options)){
          (this.options[key] && this.options[key] || []).map(item=>{
            if (item.choose){
              item.id = this.showData.id;
              item.attr = item.attrName;
              data.push(item)
            }
          })
        }
        this.allotJurisditionMessTitle.ajaxParams.data = this.getFormData(data);
        this.ajax(this.allotJurisditionMessTitle, isLoadingFun);
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', this.allotJurisditionMessTitle.type);
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep([], data);
        return myData;
      },

    }

  }
</script>
<style>
  .pisSelectItem{margin-left: 0 !important;margin-right: 20px;margin-bottom: 20px;}
</style>
