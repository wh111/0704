<!----------------------------------
****--课程大纲(修改和添加)
****--@date     2014-04-12
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <div class="newCalendar " v-if="stepMaker=='first'">
      <el-row :gutter="10" v-if="schoolData.length>0">
        <el-col v-for="(item,index) in schoolData" :key="index" :span="6">
          <div class="cal-schools">
            <el-row>
              <el-col :span="20">
                <el-tooltip :content="item.name" effect="light" placement="top">
                  <el-button class="overflow-txt" :type="item.checked?'success':''"
                             @click="handleCheckSchool(index,item)" style="width: 100%" v-text="item.name"></el-button>
                </el-tooltip>
              </el-col>
              <el-col :span="4">
                <div v-show="item.checked" class="cal-check"><i class="el-icon-check"></i></div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <br/>
      <el-row>
        <el-col :span="24" class="textCenter">
          <el-button @click="gotoNext('next','second')" type="primary">下一步</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="newCalendar" v-show="stepMaker=='second'" v-for="item in 1" :key="item">
      <el-form ref="formValidate" :rules="rules" :model="formValidate"
               class="demo-form-inline" label-width="120px">
        <br/>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="学校名称：">
              {{formValidate.schoolName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="大纲名称：" prop="outlineName">
              <el-input placeholder="请输入内容" v-model="formValidate.outlineName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="教研室：" prop="researchSectionId">
              <el-select v-if="isAdd()||formValidate.outlineId" v-model="formValidate.researchSectionId"
                         @change="secondChange" placeholder="请选择">
                <el-option
                  v-for="item in SecondDep"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button @click="addConent" type="primary">新建</el-button>
      <br>
      <el-table
        align="center"
        :height="400"
        :data="tableData"
        tooltip-effect="dark"
        highlight-current-row
        max-height="500"
        style="width: 100%;height: 100%">
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="75">
        </el-table-column>
        <el-table-column
          label="操作"
          width="100">
          <template scope="scope">
            <el-button size="small" @click="remove(scope.$index)" type="danger">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="courseName"
          class-name="valiTableStyle"
          label="课程"
          width="180">
          <template scope="scope">
            <el-form :model="scope.row" ref="formValidate" :rules="rules"
                     class="demo-form-inline my-tooltip-button" label-width="0">
              <el-form-item prop="courseName">
                <el-input v-model.trim="scope.row.courseName"></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="depId"
          class-name="valiTableStyle"
          label="授课科室"
          width="180">
          <template scope="scope">
            <el-form :model="scope.row" ref="formValidate" :rules="rules"
                     class="demo-form-inline my-tooltip-button" label-width="0">
              <el-form-item prop="depId">
                <el-select v-model="scope.row.depId" placeholder="请选择">
                  <el-option
                    v-for="item in depOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="courseType"
          class-name="valiTableStyle"
          label="类型">
          <template scope="scope">
            <el-form :model="scope.row" ref="formValidate" :rules="rules"
                     class="demo-form-inline my-tooltip-button" label-width="0">
              <el-form-item prop="courseType">
                <el-select v-model="scope.row.courseType" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in courseType"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="courseTime"
          class-name="valiTableStyle"
          label="课时数">
          <template scope="scope">
            <el-form :model="scope.row" ref="formValidate" :rules="rules"
                     class="demo-form-inline my-tooltip-button" label-width="0">
              <el-form-item prop="courseTime">
                <el-input v-model.trim="scope.row.courseTime"></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <br/>
      <el-row>
        <el-col :span="8" class="textCenter">&nbsp;</el-col>
        <el-col :span="8" class="textCenter">
          <el-button @click="gotoNext('up','first')" type="primary">上一步</el-button>
          <el-button @click="listenSubEvent" type="primary">确定</el-button>
        </el-col>
        <el-col :span="8" class="textCenter">&nbsp;</el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入当前组件字典api
  import api from '../api.js';
  import { courseType } from './courseType';
  import { curriculumOutline as rules } from '../../rules.js'
  //当前组件引入全局的util
  let Util = null;
  export default {
    //type类型区分 copy  复制的时候调用添加
    props: ['operailityData', 'type'],
    data () {
      return {
        rules,
        //是否显示全日历
        isShowCalendar: false,
        batchAddModal: false,
        confirmModal: false,
        stepMaker: 'first',
        holidayList: [],//获取的当个月的节假日列表
        //选择的学校
        schoolData: [],
        schoolSaveMess: {},
        //学期枚举类型
        semesterType: {},
        tableData: [],
        //周历保存后的id
        weekSetId: '',
        //三级科室数据
        depOption: [],
        depObj: {},
        //二级教研室数据
        SecondDep: [],
        SecondDepObj: {},
        //课程类型
        courseType,
        //form表单bind数据
        formValidate: {
          'outlineId': '',
          'schoolId': '',
          'schoolName': '',
          'outlineName': '',
          'researchSectionId': '',
          'outlineState': '',
          'schoolOutlineDetailDtoList': [
            {
              'outlineDetailId': '',
              'outlineId': '',
              'courseName': '',
              'depId': '',
              'depName': '',
              'courseType': '',
              'courseTime': ''
            }
          ]
        },

        //请求学校数据
        getSchoolsTitle: {
          ajaxSuccess: 'getSchoolsData',
          ajaxParams: {
            url: api.schools.path,
            params: {}
          }
        },

        //获取单个教学大纲
        getMainTitle: {
          ajaxSuccess: 'getMainData',
          ajaxParams: {
            url: api.OutlineGetAlll.path,
            params: {
              outlineId: this.operailityData && this.operailityData.outlineId,
            }
          }
        },

        //保存周历设置主表
        saveMainTitle: {
          type: this.type ? this.type : 'add',
          successTitle: this.type ? '复制成功!' : '添加成功!',
          errorTitle: this.type ? '复制成功!' : '复制失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: api.OutlineAddAll.path,
            method: api.OutlineAddAll.method,
            params: {}
          }
        },

        //修改周历设置主表
        editMainTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: api.OutlineModifyAll.path,
            method: api.OutlineModifyAll.method,
            params: {}
          }
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        if (this.isAdd()) {
          this.addConent();
          this.getSecondDep()//获取二级科室
        }
        this.ajax(this.getSchoolsTitle);//先获取学校再获取数据(添加在次不获取二级科室)
      },

      //获取二级教研室
      getSecondDep () {
        //请求学校数据
        let depOpt = {
          ajaxSuccess: (res) => {
            let data = res.data;
            let depObj = {}
            data.map(item => {
              depObj[item.id] = item;
            })
            this.SecondDepObj = depObj;
            this.SecondDep = data;
            if (!this.isAdd()) {//修改的时候获取三级科室数据
              this.getThreeDep(this.formValidate.researchSectionId);
            }
          },
          ajaxParams: {
            url: api.getByDepth.path,
            params: {
              depth: 2
            }
          }
        }
        this.ajax(depOpt)
      },

      //二级教研室更改
      secondChange (val) {
        this.getThreeDep(val)
        this.tableData = [];
        this.addConent();
      },
      //获取三级教研室
      getThreeDep (id) {
        //请求学校数据
        let depOpt = {
          ajaxSuccess: (res) => {
            let data = res.data;
            let depObj = {}
            let depOption = []
            data.map(item => {
              if (item.depth == 3) {
                depObj[item.id] = item;
                depOption.push(item)
              }
            })
            this.depObj = depObj;
            this.depOption = depOption;
          },
          ajaxParams: {
            url: api.queryChildByDepId.path,
            params: {
              depId: id
            }
          }
        }
        this.ajax(depOpt)
      },

      //根据教学周历ID获取每个月课程设置--server回调
      getMonthCourseData (responseData) {
        let data = responseData.data;
      },

      //获取学校list
      getSchoolsData (responseData) {
        if (!this.isAdd()) {//先获取学校再获取数据
          this.ajax(this.getMainTitle);
        }
        let data = responseData.data;
        for (var i = 0, item; i < data.length; i++) {
          item = data[i];
          item.checked = false;
        }
        this.schoolData = data;
      },

      //获取初始化数据成功
      getMainData (res) {
        let data = res.data;
        this.schoolData.map(item => {
          if (item.id === data.schoolId) {
            item.checked = true;
          }
        })
        if (this.type !== 'copy' && data.useTotal > 0) {
          this.errorMess('该大纲已被使用，强行修改删除会对已建周历产生影响')
        }
        this.getSecondDep()//获取二级科室
        this.formValidate = data;
        this.tableData = data.schoolOutlineDetailDtoList;
      },

      /*
       * 日期组改变值后赋值
       * @param index number   当前数据数组的索引
       * @param key   string   当前数据需要设置的对象的key 例如:startDate
       * @param val   string   当前选中的日期已格式化好的值
       * */
      setDateGroupVal (index, key, val) {
        if (key == 'startDate') {
          this.formValidate['weekSetStartTime'] = val;
        }
        if (key == 'endDate') {
          this.formValidate['weekSetEndTime'] = val;
        }
      },

      /**
       * 选择学校
       */
      handleCheckSchool (index, item) {
        let schoolData = this.schoolData;
        schoolData.map((obj, i) => {
          obj.checked = index === i ? !obj.checked : false;
        })
        Object.assign(this.formValidate, {
          schoolId: item.checked ? item.id : '',
          schoolName: item.checked ? item.name : '',
        })
      },

      /**
       * 去到哪一步
       * @param type {string} 上一步,下一步的类型  next or up
       * @param step {string} 去到哪一步:first second third
       */
      gotoNext (type, step) {
        if (this.stepMaker == 'first' && this.formValidate.schoolId == '') {
          //隐藏已选择的学校
          this.showMess('请选择学校!');
          return

        }
        this.stepMaker = step;
      },

      /*
     * 点击提交按钮 监听是否提交数据
     * @param isLoadingFun boolean  form表单验证是否通过
     * */
      listenSubEvent () {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {

          let flag = this.tableData.some((item, index) => {//验证是否有重复的
            return this.compare(item, index, this.tableData);
          })

          if (flag) return

          let tableData = this.getFormData(this.formValidate);
          let messTitle = this.isAdd() || this.type === 'copy' ? this.saveMainTitle : this.editMainTitle;
          messTitle.ajaxParams.data = tableData;
          this.ajax(messTitle);
        } else {
          this.errorMess('数据格式有误，请修改后再次提交')
        }
      },

      compare (item, index, tableData) {
        for (let i = index + 1; i < tableData.length; i++) {
          console.log(index, i);
          let obj = tableData[i];
          if (item.courseName === obj.courseName && item.depId === obj.depId && item.courseType === obj.courseType) {
            this.errorMess(`第${index + 1}行和 ${i + 1}行 ：数据重复，请修改`)
            return true;
          }
        }

      },

      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = true;
        if (this.$refs[formName]) {
          console.log(this.$refs[formName]);
          for (let i = 0; i < this.$refs[formName].length; i++) {
            this.$refs[formName][i].validate((valid) => {
              if (!valid) {
                flag = false;
              }
            });
          }
        }
        return flag;
      },

      //周历设置主表信息保存成功回调
      saveMainData (responseData) {
        this.stepMaker = 'third';
        this.weekSetId = responseData.data;
        this.$emit('edit');
      },

      //周历设置主表信息修改成功回调
      editMainData (responseData) {
        this.stepMaker = 'third';
        this.$emit('edit');
      },

      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let tableData = Util._.defaultsDeep([], this.tableData);
        tableData.map(item => {
          item.depName = this.depObj[item.depId] && this.depObj[item.depId].name
        })
        data.schoolOutlineDetailDtoList = tableData
        return data;
      },
      //添加大纲内容
      addConent () {
        this.tableData.push({
          'outlineDetailId': '',
          'outlineId': this.formValidate.outlineId,
          'courseName': '',
          'depId': '',
          'depName': '',
          'courseType': '',
          'courseTime': ''
        })
      },

      //删除
      remove (i) {
        if (this.tableData.length == 1) {
          this.errorMess('最后一个不能删除！')
          return;
        }
        this.tableData.splice(i, 1)
      },

      isAdd () {
        return !this.operailityData;
      }

    },
    computed: {},
    created () {
      this.init();
    },
    watch: {},
    mounted () {},
    components: {}
  }
</script>
