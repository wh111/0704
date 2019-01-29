<!---科室要求设置-新建--->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" label-width="10px" :rules="rules">
      <el-row>
        <el-col :span="2" :push="1">
          <el-button type="primary" @click="add">添加</el-button>
        </el-col>
        <el-col :span="4">
          <div class="cal-schoolTit" style="text-align: right;">名称：</div>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="name">
            <el-input placeholder="请输入内容" v-model="formValidate.name"></el-input>
          </el-form-item>
        </el-col>
       <!-- <el-col :span="3">
          <div class="cal-schoolTit" style="text-align: right;">专业：</div>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="specialty">
          <dictionary-select @setSltOptionValue="setSpecialtyOptionValue" :selectOptions="specialtyOptions"></dictionary-select>
          </el-form-item>
        </el-col>-->
      </el-row>
      <!--</el-form-item>-->
      <br />
      <el-table
        align="center"
        :data="formValidate.outlineRequires"
        :height="500"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="depName"
          label="科室"
          class-name="valiTableStyle"
          show-overflow-tooltip>
          <template scope="scope">
            <el-form :model="scope.row" :ref="'formValidate_depId'+scope.$index" label-width="0" :rules="rules">
              <el-form-item prop="depId">
                <el-select
                  v-model="scope.row.depId"
                  :filterable="true"
                  placeholder="选择或输入匹配搜索"
                  @change="change">
                  <el-option
                    v-for="item in depOptionData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id+'##'+item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="disType"
          label="类别"
          class-name="valiTableStyle"
          show-overflow-tooltip>
          <template scope="scope">
            <el-form :model="scope.row" :ref="'formValidate_disType'+scope.$index" label-width="0" :rules="rules">
              <el-form-item prop="disType">
                <el-select
                  v-if="disTypeOption.length>0"
                  v-model="scope.row.disType"
                  :filterable="true"
                  placeholder="选择或输入匹配搜索">
                  <el-option
                    v-for="item in disTypeOption"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="disTitle"
          label="名称"
          align="center"
          class-name="valiTableStyle"
          width="180">
          <template scope="scope">
            <el-form :model="scope.row" :ref="'formValidate_disTitle'+scope.$index" label-width="0" :rules="rules">
              <el-form-item prop="disTitle">
                <el-input placeholder="请输入内容" v-model="scope.row.disTitle"></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="disNum"
          label="要求例数"
          class-name="valiTableStyle"
          align="center"
          width="130">
          <template scope="scope">
            <el-form :model="scope.row" :ref="'formValidate_disNum'+scope.$index" label-width="0" :rules="rules">
              <el-form-item prop="disNum">
                <el-input placeholder="请输入内容" v-model="scope.row.disNum"></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="disNum"
          label="掌握程度"
          class-name="valiTableStyle"
          align="center"
          width="130">
          <template scope="scope">
            <el-form :model="scope.row" :ref="'formValidate_deMasterDegree'+scope.$index" label-width="0" :rules="rules">
              <el-form-item prop="deMasterDegree">
                <!--<el-input placeholder="请输入内容" v-model="scope.row.deMasterDegree"></el-input>-->
                <el-select
                  v-model="scope.row.deMasterDegree"
                  :filterable="true"
                  placeholder="选择或输入匹配搜索">
                  <el-option
                    v-for="(item,index) in depReDegree"
                    :key="index"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="100">
          <template scope="scope">
            <el-button size="mini" @click="delRow(scope.$index)"  type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <br />
      <el-row>
        <el-col :span="8" class="textCenter">&nbsp;</el-col>
        <el-col :span="4" class="textCenter"><load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn></el-col>
        <el-col :span="4" class="textCenter"><el-button @click="cancel">取消</el-button></el-col>
        <el-col :span="8" class="textCenter">&nbsp;</el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from "../api.js";

  import {
    reqDepVal as rules
  } from '../../rules'; // 表单验证
  //当前组件引入全局的util
  let Util = null;
  export default{
    data() {
      return {
        //表单验证
        rules,
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},

        //请求专业数据
        specialtyOptions:{
          multiple:false,    //是否多选
          url: api.specialty.path,
        },

        depOptionData:[],
        disTypeOption:[],

        //获取科室数据
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.getByDepth.path,
            params:{
              depth: 3
            }
          }
        },


        //获取科室类型
        getDisType:{
          ajaxSuccess:'setDisType',
          ajaxParams:{
            url: api.depReDistype.path,
          }
        },

        //表单数据bind
        formValidate:{
          "depOutlineId":"",
          "name":"",
          "specialty":"",
          "outlineRequires":[]
        },

        //保存
        saveMessTitle:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url: api.depReAdd.path,
            method: api.depReAdd.method,
            jsonString:true,
          },
        },

        // 熟练程度
        depReDegree:[],
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        this.add();
        this.ajax(this.listMessTitle);
        this.ajax(this.getDisType);
        this.getDepReDegree();
      },

      /**
       * 添加
       * */
      add(){
        //addRow模板
       let rowTemplate={
            "outlineRequireId":"",
            "depId":"",
            "depName":"",
            "disType":"",
            "disTitle":"",
            "disNum":"",
            "deMasterDegree": "", // 掌握程度
        }
        this.formValidate["outlineRequires"].push(rowTemplate)
      },


      //获取
      getDepOption(index,item){
          item.index = index;
          return item;
      },


      /**
       * 删除当前行
       * @param index {number}  当前行索引
       * * */
      delRow(index){
        this.formValidate["outlineRequires"].splice(index,1);
      },


      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        for(var i=0,item;i<data.length;i++){
          item = data[i]
          if(item.id==-1){
            data.splice(i,1);
          }
        }
        this.depOptionData = [];
        this.depOptionData= data;
      },


      //获取科室类型
      setDisType(responseData){
        let data = responseData.data;
        if(!Util.isEmptyObject(data)){
          if(typeof data["child"]!="undefined"){
            this.disTypeOption = [];
            this.disTypeOption= data.child;
          }
        }

      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.saveMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.saveMessTitle, isLoadingFun);
        }
      },


      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = true;
        Util._.forEach(this.$refs, (item,k)=> {
          if(typeof this.$refs[k]!="undefined"){
            this.$refs[k].validate((valid) => {
              if (!valid) {
                flag= false;
              }
            });
          }
        })
        return flag;
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        for(var i=0,item,tempArr;i<myData["outlineRequires"].length;i++){
          item = myData["outlineRequires"][i];
          tempArr = item["depId"].split("##");
          item["depId"] = tempArr[0];
          item["depName"]= tempArr[1];
        }
        return myData;
      },


      /*
       * 设置专业
       * @param val string || number  选中学校的id
       * */
      setSpecialtyOptionValue(val,id){
        //this.formValidate.schoolId = id;
        this.formValidate.specialty = val;
      },


      //选中值发生变化时触发
      change(val){

      },

      // 获取掌握程度
      getDepReDegree(){
        let opt = {
          ajaxSuccess: res => this.depReDegree = res.data.child,
          ajaxParams:{
            url: api.depReDegree.path,
            method: api.depReDegree.method,
          }
        };
        this.ajax(opt)
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','add');
      },
    },
    created(){
      this.init();
    },
    mounted(){
    },
    components: {}
  }
</script>
