<!----------------------------------
****--@name     进修计划填写
****--@role     教学秘书
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div ref="content">
    <el-form :model="formValidate" ref="formValidate" label-width="10px" :rules="rules">
      <div ref="table">
        <el-table
          align="center"
          :data="formValidate.outlineRequires"
          :height="dynamicHt"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            prop="depName"
            label="科室"
            class-name="valiTableStyle"
            show-overflow-tooltip>
            <template scope="scope">
              <el-form :model="scope.row" :ref="'formValidate_depId'+scope.$index" label-width="10px" :rules="rules">
                <el-form-item prop="depId">
                  <el-select
                    v-show="isShowDep.hasData"
                    v-model="scope.row.depId"
                    :filterable="true"
                    placeholder="选择或输入匹配搜索"
                    @change="change">
                    <el-option
                      v-show="isShowDep.hasItem"
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
              <el-form :model="scope.row" :ref="'formValidate_disType'+scope.$index" label-width="10px" :rules="rules">
                <el-form-item prop="disType">
                  <el-select
                    v-model="scope.row.disType"
                    :filterable="true"
                    placeholder="选择或输入匹配搜索">
                    <el-option
                      v-if="disTypeOption.length>0"
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
            class-name="valiTableStyle">
            <template scope="scope">
              <el-form :model="scope.row" :ref="'formValidate_disTitle'+scope.$index" label-width="10px" :rules="rules">
                <el-form-item prop="disTitle">
                  <el-input placeholder="请输入内容" v-model="scope.row.disTitle"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="disNum"
            label="要求例数"
            align="center"
            class-name="valiTableStyle">
            <template scope="scope">
              <el-form :model="scope.row" :ref="'formValidate_disNum'+scope.$index" label-width="10px" :rules="rules">
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
            align="center">
            <template scope="scope">
              <el-form :model="scope.row" :ref="'formValidate_deMasterDegree'+scope.$index" label-width="0"
                       :rules="rules">
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
              <el-button size="mini" @click="delRow(scope.$index)" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <br/>
      <el-row>
        <el-col :span="8" class="textCenter">&nbsp;</el-col>
        <el-col :span="4" class="textCenter">
          <el-button type="success" @click="add">添加</el-button>
        </el-col>
        <el-col :span="4" class="textCenter">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
        <!--<el-col :span="4" class="textCenter"><el-button  @click="cancel">取消</el-button></el-col>-->
        <el-col :span="8" class="textCenter">&nbsp;</el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from "./api";

  import {educationPlanWrite as rules} from '../../rules'; // 表单验证
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        //表单验证
        rules,
        //显示科室
        isShowDep:{
          hasData:false,
          hasItem:false,
        },
        //保存按钮基本信息
        loadBtn: {title: '保存', callParEvent: 'listenSubEvent'},

        //请求专业数据
        specialtyOptions: {
          multiple: false,    //是否多选
          url: api.specialty.path,
          value: "",
        },

        dynamicHt: '100',
        depOptionData: [],
        disTypeOption: [],

        //获取科室数据
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.searhDepAndSpecialty.path,
            params: {
              name: '', code: '', director: "", secretary: "", nurse: "", capacity: "",
            }
          }
        },

        //获取科室类型
        getDisType: {
          ajaxSuccess: 'setDisType',
          ajaxParams: {
            url: api.depReDistype.path,
          }
        },

        rulesForm: {},

        //表单数据bind
        formValidate: {
          "depOutlineId": "",
          "name": "",
          "specialty": "",
          "outlineRequires": []
        },


        //查询详情
        tableListMessTitle: {
          ajaxSuccess: 'setTableListData',
          ajaxParams: {
            url: api.get.path,
          }
        },


        //保存
        saveMessTitle: {
          ajaxSuccess: 'saveSuccess',
          ajaxError: () => this.errorMess('保存失败！'),
          ajaxParams: {
            url: api.addOrModify.path,
            method: api.addOrModify.method,
            jsonString: true,
          },
        },

        // 熟练程度
        depReDegree: [],
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        this.ajax(this.tableListMessTitle);
        this.getDepReDegree();
      },

      /**
       * 添加
       * */
      add() {
        //addRow模板
        let rowTemplate = {
          "outlineRequireId": "",
          "depId": "",
          "depName": "",
          "disType": "",
          "disTitle": "",
          "disNum": "",
          "deMasterDegree": "", // 掌握程度
        }
        this.formValidate["outlineRequires"].push(rowTemplate)
      },


      //获取
      getDepOption(index, item) {
        item.index = index;
        return item;
      },


      //通过get请求列表数据
      setTableListData(responseData) {
        let data = responseData.data;
        for (var i = 0, item; i < data["outlineRequires"].length; i++) {
          item = data["outlineRequires"][i];
          item["depId"] = item["depId"] + '##' + item["depName"];
        }
        this.formValidate = {};
        this.formValidate = data;
        this.isShowDep.hasItem = true;
        this.specialtyOptions.value = this.formValidate.specialty;
        this.ajax(this.listMessTitle);
        this.ajax(this.getDisType);
      },


      /**
       * 删除当前行
       * @param index {number}  当前行索引
       * * */
      delRow(index) {
        this.formValidate["outlineRequires"].splice(index, 1);
      },


      //通过get请求列表数据
      updateListData(responseData) {
        let data = responseData.data;
        for (var i = 0, item; i < data.length; i++) {
          item = data[i]
          if (item.id == -1) {
            data.splice(i, 1);
          }
        }
        this.isShowDep.hasData = true;
        this.depOptionData = [];
        this.depOptionData = data;
      },


      //获取科室类型
      setDisType(responseData) {
        let data = responseData.data;
        if (!Util.isEmptyObject(data)) {
          if (typeof data["child"] != "undefined") {
            this.disTypeOption = [];
            this.disTypeOption = data.child;
          }
        }

      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        //this.getFormData(this.formValidate);
        //console.log(this.rulesForm);
        this.saveMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
        setTimeout(() => {
          let isSubmit = this.submitForm("formValidate");
          if (isSubmit) {
            if (!isLoadingFun) isLoadingFun = function () {
            };
            isLoadingFun(true);
            this.ajax(this.saveMessTitle, isLoadingFun);
          }
        }, 100);

      },

      // 保存成功
      saveSuccess(res) {
        this.successMess('保存成功');
        this.getDepReDegree()
      },


      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = true;
        Util._.forEach(this.$refs, (item, k) => {
          if (this.$refs[k] && k.indexOf('formValidate') > -1) {
            this.$refs[k].validate((valid) => {
              if (!valid) {
                flag = false;
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
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        for (var i = 0, item, tempArr; i < myData["outlineRequires"].length; i++) {
          item = myData["outlineRequires"][i];
          tempArr = item["depId"].split("##");
          item["depId"] = tempArr[0];
          item["depName"] = tempArr[1];
        }
        return myData;
      },


      /*
       * 设置专业
       * @param val string || number  选中学校的id
       * */
      setSpecialtyOptionValue(val, id) {
        //this.formValidate.schoolId = id;
        this.formValidate.specialty = val;
      },


      //选中值发生变化时触发
      change(val) {

      },


      // 获取掌握程度
      getDepReDegree() {
        let opt = {
          ajaxSuccess: res => this.depReDegree = res.data.child,
          ajaxParams: {
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
      cancel() {
        this.$emit('cancel', 'edit');
      },

      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content.parentNode.offsetHeight;
        let myTable = this.$refs.table.offsetTop;
        let paginationHt = 70;
        this.dynamicHt = content - myTable - paginationHt;
      },
    },
    created() {
      this.init();
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    components: {}
  }
</script>
