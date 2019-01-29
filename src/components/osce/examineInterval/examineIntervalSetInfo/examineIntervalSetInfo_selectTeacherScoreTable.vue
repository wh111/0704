<!--
****--@file     examineIntervalSetInfo_selectTeacherScoreTable
****--@date     2018/4/27 13:40
****--@author   YC
****--@describe 选择老师评分表
-->
<template>
  <el-row class="selectTeacherScoreTable">
    <template v-if="teacher && stationContentObj">
      <h3><b>{{ teacher.teacherName }}</b>的评分表：</h3>
      <el-form class="ststForm">
        <el-form-item v-for="(item,index) in stationContentObj" :key="index">
          <el-col>
            {{ item.contentName }}
          </el-col>
          <el-radio-group v-model="tabaleSelect[item._id]">
            <el-radio v-for="(cItem,cIndex) in item.scoreTableList" :key="cIndex" :label="cItem.scoreTableId" :value="cItem.scoreTableId">{{
              cItem.scoreTableName }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-col align="right">
        <el-button type="info" @click="set">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </template>
  </el-row>
</template>
<style lang="scss">
  .selectTeacherScoreTable {
    .ststForm {
      margin-top: 20px;
    }
    .el-radio {
      margin-left: 0;
      margin-right: 15px;
      margin-bottom: 10px;
    }
  }
</style>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'selectTeacherScoreTable',
    props: ['teacherIndex'],
    data () {
      return {
        tabaleSelect: null, // 选择的评分表id
        stationContentObj: null,
        teacher: null
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        let stationContentList = this.$util._.defaultsDeep([], this.$store.getters['examineInterval/temp/val']('info')['stationContentList']);
        let teacher = this.$store.getters['examineInterval/temp/val']('teacher')[this.teacherIndex];
        let tabaleSelect = {};
        let stationContentObj = {};
        stationContentList.map(item => {
          let scoreTableList = {};
          tabaleSelect[item._id] = ''; // 对应考核内容的评分表id
          item.scoreTableList.map(cItem => {
            cItem.scoreTableId = Number(cItem.oldScoreTableId || cItem.scoreTableId);
            scoreTableList[cItem.scoreTableId] = cItem;
          });
          item.scoreTableList = scoreTableList;
          stationContentObj[item._id] = item;
        });
        Object.keys(teacher.contentScoreTableObj).map(_id => { // 过滤无效的考核内容
          if (tabaleSelect[_id] !== undefined) {
            tabaleSelect[_id] = Number(teacher.contentScoreTableObj[_id].oldScoreTableId || teacher.contentScoreTableObj[_id].scoreTableId); // 还原对应考核内容的评分表id
          }
        });
        console.log(tabaleSelect);
        console.log(stationContentObj)

        this.tabaleSelect = tabaleSelect;
        this.stationContentObj = stationContentObj;
        this.teacher = teacher;
      },
      checkData () {
        let arr = Object.keys(this.tabaleSelect);
        for (let i = 0, l = arr.length; i < l; i++) {
          if (!this.tabaleSelect[arr[i]]) {
            console.log(arr[i]);
            this.errorMess('考核内容“' + this.stationContentObj[arr[i]].contentName + '”必须选择评分表！');
            return false;
          }
        }
        return true;
      },
      set () {
        let contentScoreTableObj = {};
        if (this.checkData()) {
          Object.keys(this.tabaleSelect).map(_id => {
            let {scoreTableId, scoreTableName} = this.stationContentObj[_id].scoreTableList[this.tabaleSelect[_id]];
            contentScoreTableObj[_id] = { // 选择的评分表所属考核内容_id作为对象的键名,以便在上一步删除考核内容的时候同步删除老师选择的评分表
              scoreTableId, // 教师评分表id
              scoreTableName // 教师评分表名称
            };
          });
          this.$emit('set', this.$util._.defaultsDeep({}, contentScoreTableObj));
        }
      },
      cancel () {
        this.$emit('cancel', 'selectScoreTable');
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
