<!--
****--@file     table_items
****--@date     2018/10/19 15:05
****--@author   tangll
****--@describe 师资力量的表格组件
-->
<template>
  <div class="table-items" v-if="datasLists">
    <p class="items-title">{{datasLists.title}}</p>

    <el-table
      v-for="item in 1"
      :key="item"
      align="center"
      :data="datasLists.lists"
      tooltip-effect="dark"
      @row-click="rowclick"
      highlight-current-row
      :max-height="150"
      style="width: 100%;height: 100%">
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="75">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        prop="planActivityTitle"
        class-name="valiTableStyle"
        label="竞赛内容">
        <template scope="scope">
          <el-form :model="scope.row" ref="datasLists"
                   :rules="rules.teachingConstruction">
            <el-form-item prop="teachPropertyOne">
              <el-input style="width: 60%"
                        v-model="scope.row.teachPropertyOne"></el-input>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        prop="planActivityTitle"
        class-name="valiTableStyle"
        label="荣誉等级">
        <template scope="scope">
          <el-form :model="scope.row" ref="datasLists"
                   :rules="rules.teachingConstruction">
            <el-form-item prop="teachPropertyTwo">
              <el-select v-model="scope.row.teachPropertyTwo" placeholder="请选择">
                <el-option
                  v-for="item in textbookData"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="createTime"
        class-name="valiTableStyle"
        align="center"
        label="活动时间">
        <template scope="scope">
          <el-form :model="scope.row" ref="datasLists"
                   :rules="rules.teachingConstruction"
                   class="demo-form-inline my-tooltip-button">
            <el-form-item prop="createTime">
              <el-date-picker v-model="scope.row.createTime" type="datetime"
                              :editable="false"
                              placeholder="选择日期时间"
                              :picker-options="pickerOptions0"
                              @change="handleStartTime">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="300">
        <template scope="scope">
          <el-button size="small" v-if="scope.$index==0" type="primary"
                     @click="addItem()">添加
          </el-button>
          <el-button size="small" @click="remove(scope.$index,scope.row)"
                     type="danger">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-items-save" align="center">
      <el-button type="primary" @click="save()">&nbsp; 保存 &nbsp;</el-button>
    </div>
  </div>
</template>

<script>
  import rules from './rules'

  let Util = null;
  export default {
    name: 'table_items',
    props: ['url', 'operailityData'],
    data () {
      return {
        rules,
        trainingData: [],
        textbookData: [],
        options: [
          {
            value: '选项1',
            label: '主编',
          }, {
            value: '选项2',
            label: '副主编',
          }, {
            value: '选项3',
            label: '编委',
          }],
        //获取担任职责
        getTraining: {
          ajaxSuccess: 'getTrainingData',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: '/dictionary/getByCode/' + 'DUTY',
          },
        },
        //获取荣誉等级
        getTextbook: {
          ajaxSuccess: 'getTextbookData',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: '/dictionary/getByCode/' + 'HONOR',
          },
        },
        saveMainTitle: {
          ajaxSuccess: () => {
            this.successMess('保存成功');
            this.listData()
          },
          errorTitle: '保存失败!',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: this.url.addTeachArchieves.path,
            method: this.url.addTeachArchieves.method,
            data: {},
          },
        },
        value: '',
        value2: '',
        lists: {
          'teachPropertyOne': this.operailityData.teachPropertyOne,
          'teachPropertyTwo': this.operailityData.teachPropertyTwo,
          'createTime': this.operailityData.createTime,
          'type': this.operailityData.lists[0].type,
        },
        datasLists: null,
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.ajax(this.getTextbook);
        this.listData();
      },
      rowclick (row, i, l) {
        this.rowData = row;
      },
      //获取荣誉等级
      getTextbookData (res) {
        let data = res.data;
        data = data.child;
        this.textbookData = data;
      },
      //点击增加
      addItem () {
        this.datasLists.lists.push(this.getTemplate())
      },
      //点击删除
      remove (index, res) {
        let dataLen = this.datasLists.lists.length;
        console.log(this.datasLists.lists.length)
        if (dataLen == 1) {
          this.errorMess('至少保留一条数据')
        } else {
          this.datasLists.lists.splice(index, 1)
        }
      },

      getTemplate (item = {}) {
        return {
          'teachPropertyOne': '',
          'teachPropertyTwo': '',
          'createTime': '',
          'type': this.operailityData.lists[0].type,
        }
      },
      //获取列表数据
      listData () {
        let options = {
          paramsData: 'listUrl',
          ajaxSuccess: 'loginSuccess',
          ajaxParams: {
            url: '/examination/teachArchieves/listByType',
            method: 'get',
            params: {
              type: this.operailityData.lists[0].type,
            },
          },
        }
        this.ajax(options)
      },
      loginSuccess (data) {
        if (data.data.length > 0) {
          this.datasLists.lists = data.data;
        }
      },
      //保存的数据
      save () {
        let isSubmit = this.submitForm('datasLists');
        if (isSubmit) {
          let lists = this.datasLists.lists;
          lists = this.formDate(this.$util._.defaultsDeep([], lists),
            ['createTime'], 'yyyy-MM-dd HH:mm:ss')
          this.saveMainTitle.ajaxParams.data = lists;
          this.ajax(this.saveMainTitle)
        }
      },

      //验证
      submitForm (formName) {
        let flag = true;
        if (this.$refs[formName]) {
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
    },
    created () {
      this.init()
      this.datasLists = this.operailityData
    },
    mounted () {
    },
    components: {},
    watch: {
      operailityData (data) {
        console.log(data, 123)
        this.datasLists = data
      },
    },
  }
</script>

<style scoped>
  .table-items {
    height: 250px;
  }

  .table-items .items-title {
    font-size: 24px;
    line-height: 1;
    text-align: center;
    margin: 20px auto;
  }

  .table-items th, td {
    text-align: center;
    padding: 5px 0;
  }

  .table-items .table-items-save {
    margin: 20px auto;
  }
</style>
