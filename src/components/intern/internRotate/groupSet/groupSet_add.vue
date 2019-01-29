<!----------------------------------
****--分组设置(groupSet_add)
****--@date     2017/7/3
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-steps :space="200" :active="active" finish-status="success">
      <el-step title="第一步：选择学校"></el-step>
      <el-step title="第二步：选择大纲"></el-step>
      <el-step title="第三步：添加分组"></el-step>
      <el-step title="第四步：设置顺序"></el-step>
      <el-step title="第五步：完成"></el-step>
    </el-steps>
    <!--- 第一步：选择学校 --->
    <div v-show="active==0" style="margin: 20px;">
      <el-row :gutter="10" v-if="schoolData.length>0">
        <el-col v-for="(item,index) in schoolData" :key="index" :span="6">
          <div class="cal-schools">
            <el-row>
              <el-col :span="20">
                <el-tooltip :content="item.name" effect="light" placement="top">
                  <el-button class="overflow-txt"
                             :type="item.checked?'success':''"
                             @click="handleCheckSchool(index,item)"
                             style="width: 100%"
                             v-text="item.name"></el-button>
                </el-tooltip>
              </el-col>
              <el-col :span="4">
                <div v-show="item.checked" class="cal-check"><i
                  class="el-icon-check"></i></div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--- 第二步：选择专业 --->
    <div v-if="active==1" style="margin: 20px;">
      <!--<el-row>
        <el-col :span="5"><div class="cal-schoolTit" style="text-align: right;">专业：</div></el-col>
        <el-col :span="18">
          <dictionary-select @setSltOptionValue="setSpecialtyOptionValue" :selectOptions="specialtyOptions"></dictionary-select>
          <span v-if="sltedSpecialty==''" style="color: #FF0000">&nbsp;&nbsp;&nbsp;&nbsp;您还没有选择专业!</span>
        </el-col>
      </el-row>-->
      <el-row style="margin-top: 20px;">
        <el-col :span="5">
          <div class="cal-schoolTit" style="text-align: right;">对应学校大纲：</div>
        </el-col>
        <el-col :span="18">
          <el-select
            v-model="sltedDg"
            :filterable="true"
            placeholder="选择或输入匹配搜索">
            <el-option
              v-for="item in getDgBySpecialty"
              :key="item.outlineId"
              :label="item.outlineName"
              :value="item.outlineId">
            </el-option>
          </el-select>
          <!--<span v-if="getDgBySpecialty.length==0&&sltedSpecialty!=''" style="color: #FF0000">&nbsp;&nbsp;&nbsp;&nbsp;该专业下没有对应的大纲</span>-->
          <span v-if="getDgBySpecialty.length>0&&sltedDg==''"
                style="color: #FF0000">&nbsp;&nbsp;&nbsp;&nbsp;请选择对应专业的大纲!</span>
        </el-col>
      </el-row>
    </div>
    <!--- 第三步：添加分组 --->
    <div v-if="active==2" style="margin: 20px;">
      <el-checkbox v-model="jumpThirdStep">跳过顺序设置(勾选后跳过设置顺序步骤)</el-checkbox>
      <three-step :school-data="saveSchoolData" :initData="threeGroupData"
                  @setGroupData="setThreeGroupData"
                  @isHashGroup="threeStepIsHashGroup"></three-step>
    </div>
    <!--- 第四步：设置顺序 --->
    <div v-if="active==3" style="margin: 20px;">
      <four-step :params="ajaxParams" :groupData="threeGroupData"
                 @setGroupData="setFourGroupData"></four-step>
    </div>
    <!--- 第五步：完成 --->
    <div v-if="active==5" style="margin: 20px;text-align: center;">
      数据提交中……
    </div>
    <el-row :gutter="10">
      <el-col :span="24" style="text-align: center;">
        <el-button v-if="active>0&&active<4" style="margin-top: 12px;"
                   @click="up">上一步
        </el-button>
        <el-button v-if="active<3" style="margin-top: 12px;" @click="next"
                   :loading="isLoading">下一步
        </el-button>
        <load-btn v-if="active>2" style="margin-top: 12px;"
                  v-show="fourGroupData.length>0&&!jumpThirdStep"
                  @listenSubEvent="success" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //第三步
  import threeStep from './groupSet_addThree.vue'
  //第四步
  import fourStep from './groupSet_addFour.vue'
  //引入当前组件字典api
  import api from '../api.js'
  //当前组件引入全局的util
  let Util = null
  export default {
    data () {
      return {
        //保存按钮基本信息
        loadBtn: {title: '完成', callParEvent: 'listenSubEvent'},

        //当前步骤索引
        active: 0,

        //按钮loading效果
        isLoading: false,

        //第三步跳过顺序设置
        jumpThirdStep: false,

        //选择的学校
        schoolData: [],
        sltedSchool: [],

        //请求专业数据
        sltedSpecialty: '',
        specialtyOptions: {
          multiple: false,    //是否多选
          url: api.specialty.path,
          value: '',
        },

        //存储一、二步的数据
        saveSchoolData: {
          'schoolId': '',
          'outlineId': '',
          'schoolName': '',
        },

        //第四步ajax请求需要的参数
        ajaxParams: {},

        //存储第三步是否设置小组
        isHashGroup: '',
        threeGroupData: [],

        //第四步最终保存的数据
        fourGroupData: [],

        //当前步骤
        currStep: 0,

        //请求学校数据
        getSchoolsTitle: {
          ajaxSuccess: 'getSchoolsData',
          ajaxParams: {
            url: api.schools.path,
            params: {},
          },
        },

        //根据专业匹配大纲
        getDgBySpecialty: [],
        sltedDg: '',

        //学校专业对应大纲
        dgData: [],
        getDgBySchoolId: {
          ajaxSuccess: 'getDgData',
          ajaxParams: {
            url: api.schoolGetDg.path,
            params: {},
          },
        },

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'completeSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.groupAdd.path,
            method: 'post',
            jsonString: true,
          },
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        this.ajax(this.getSchoolsTitle)
      },

      completeSuccess (responseData) {
        let data = responseData.data
        this.active = 5
        this.$emit('add', 'add', '添加成功!')
      },

      //获取学校list
      getSchoolsData (responseData) {
        let data = responseData.data

        for (var i = 0, item; i < data.length; i++) {
          item = data[i]
          item.checked = false
        }
        this.schoolData = data
        if (this.sltedSchool.length > 0) {
          this.schoolData[this.sltedSchool[0]].checked = true
          this.saveSchoolData['schoolId'] = this.schoolData[this.sltedSchool[0]].id
          this.saveSchoolData['schoolName'] = this.schoolData[this.sltedSchool[0]].name
        }
      },

      //根据学校id获取专业对应大纲
      getDgData (responseData) {
        let data = responseData.data
        for (var i = 0, item; i < data.length; i++) {
          item = data[i]
          /*{
           "outlineId":1,
           "schoolName":"南京大学",
           "gradeNum":2017,
           "specialty":"专业"
           }*/
          this.getDgBySpecialty.push({
            outlineId: item['outlineId'],
            outlineName: item['outlineName'],
            dgName: item['gradeNum'],
            //specialty:item["specialty"],
          })
        }

      },

      /**
       * 设置第三步的分组数据
       * */
      setThreeGroupData (data) {
        let myData = Util._.defaultsDeep([], data)
        let outlineId = this.saveSchoolData.outlineId
        for (var i = 0, item; i < myData.length; i++) {
          item = myData[i]
          item.outlineId = outlineId
        }
        this.threeGroupData = []
        this.threeGroupData = myData
      },

      /**
       * 设置第四步的分组数据
       * */
      setFourGroupData (data) {
        let myData = Util._.defaultsDeep([], data)
        let tempArr = []
        this.fourGroupData = []
        for (var i = 0, item; i < myData.length; i++) {
          item = myData[i]
          for (var k = 0, subItem; k < item["subGroup"].length; k++) {
            subItem = item['subGroup'][k]
            subItem['groupIndexId'] = item['groupIndexId']
          }
          tempArr = tempArr.concat(item['subGroup'])
        }
        this.fourGroupData = tempArr
      },

      /**
       * 选择学校
       * @param {number} idx 当前选择的学校的索引
       */
      handleCheckSchool (idx, item) {
        if (this.sltedSchool.length > 0) {
          this.schoolData[this.sltedSchool[0]].checked = false
          this.sltedSchool.splice(0, 1)
        }
        item.checked = !item.checked
        this.sltedSchool.push(idx)
        this.saveSchoolData['schoolId'] = item.id
        this.saveSchoolData['schoolName'] = item.name
        //清空已经设置的值
        this.clearAllVal()
      },

      /*
       * 设置专业  此函数已废弃
       * @param val string || number  选中学校的id
       * */
      setSpecialtyOptionValue (val, id) {
        //this.formValidate.schoolId = id;
        //this.formValidate.specialty = val;
        if (val != '') {
          this.sltedSpecialtyId = id
          this.sltedSpecialty = val
          this.specialtyOptions.value = val
          this.getDgBySpecialty = []
          this.sltedDg = ''
          for (var i = 0, item; i < this.dgData.length; i++) {
            item = this.dgData[i]
            if (item['specialty'] == val) {
              this.getDgBySpecialty.push(item)
            }
          }

        }
      },

      /**
       * 设置第三步小组是否被选的状态
       * @param flag  {boolean}  是否设置的有小组
       */
      threeStepIsHashGroup (flag) {
        if (flag) {
          this.isHashGroup = 'hashGroup'
        } else {
          this.isHashGroup = ''
        }
      },

      //下一步
      next () {
        if (this.sltedSchool.length == 0 && this.active == 0) {
          this.errorMess('请选择学校!')
          return
        }
        //查询当前选择学校的大纲
        if (this.active == 0) {
          let option = Util._.defaultsDeep({}, this.getDgBySchoolId)
          option.ajaxParams.url += '/2' //+ this.saveSchoolData["schoolId"]
          this.ajax(option)
        }

        /*if(this.sltedSpecialty==""&&this.active==1){
          this.errorMess("请选择专业!");
          return;
        }*/
        if (this.sltedDg == '' && this.active == 1) {
          this.errorMess('请选学校对应的大纲!')
          return
        }

        if (this.isHashGroup == '' && this.active == 2) {
          this.errorMess('请选添加小组!')
          return
        }

        if (this.active == 2) {
          let tempArr = []
          for (var i = 0, item; i < this.threeGroupData.length; i++) {
            item = this.threeGroupData[i]
            if (item['groupUserIds'].length == 0) {
              tempArr.push(item['groupName'])
            }
          }
          if (tempArr.length > 0) {
            this.errorMess(tempArr.join(',') + '组还没有选择人员!')
            return
          }
          this.isLoading = true
          this.ajaxParams['schoolId'] = this.saveSchoolData['schoolId']
          this.ajaxParams['specialty'] = this.sltedSpecialty
          this.ajaxParams['schoolName'] = this.saveSchoolData['schoolName']
          this.ajaxParams['depOutlineId'] = this.saveSchoolData['outlineId']
          this.saveThreeData()
          return
        }
        if (this.active++ > 4) this.active = 0

      },

      //清空所有设置的值
      clearAllVal () {
        this.sltedSpecialty = ''
        this.specialtyOptions.value = ''
        this.sltedDg = ''
        this.getDgBySpecialty = []
        this.dgData = []
        this.threeGroupData = []
        this.isHashGroup = ''
      },

      //上一步
      up () {
        if (this.active-- == 1) {
          this.active = 0
          this.ajax(this.getSchoolsTitle)
        }

        this.isLoading = false
      },

      //完成
      success (isLoadingFun) {
        if (!isLoadingFun) isLoadingFun = function () {
        }
        isLoadingFun(true)
        if (this.jumpThirdStep) {  //调过第四步直接保存
          this.addMessTitle.ajaxParams.data = this.getFormData(
            this.threeGroupData)
        } else {  //第四步保存
          this.addMessTitle.ajaxParams.data = this.getFormData(
            this.fourGroupData)
        }
        this.ajax(this.addMessTitle, isLoadingFun)
      },

      //保存第三步的数据
      saveThreeData () {
        setTimeout(() => {
          if (!this.jumpThirdStep) {
            //this.errorMess("保存成功!");
            this.isLoading = false
            this.active++
          } else {
            this.success()
          }
        }, 100)

      },

      /*
       * 获取表单数据
       * @return []
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep([], data)
        for (var i = 0, item; i < myData.length; i++) {
          item = myData[i]
          item['groupUserIds'] = item['groupUserIds'].join(',')
          item['groupUserNames'] = item['groupUserNames'].join(',')
        }
        return myData
      },

    },
    created () {
      Util = this.$util
      this.init()
    },
    watch: {
      sltedDg (val) {
        this.saveSchoolData['outlineId'] = val
      },
    },
    mounted () {
    },
    components: {
      threeStep, fourStep,
    },
  }
</script>
