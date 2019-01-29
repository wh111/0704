<template>
  <!-- 评测与作业 - 查看 -->
  <div ref="eqContent">
    <eq-list v-if="eqView === 'list'" @show="show" :showInfo="showInfo"></eq-list>
    <div v-else>
      <div style="text-align: right">
        <el-button type="primary" @click="callBack">返回</el-button>
      </div>
      <eq-subject @callBack="callBack" v-if="eqView === 'subject'" :isShow="isShow" :noResidue="noResidue" :eqData="eqData" @show="show" @updateView="updateView"></eq-subject>
      <eq-look v-if="eqView === 'look'" :getUrl="getUrl" :eqData="eqData"></eq-look>
    </div>
  </div>
</template>

<script>
  import api from './api'; // 试题api
  import eqList from './EO_list'; // 试题列表
  import eqSubject from './EO_subject'; // 试题
  import eqLook from './EO_look'; // 试题查看
  export default {
    /**
     * isShow 试题是否仅为显示
     * showInfo 是否显示作业信息折叠面板（默认显示）
     * isCourse 是否是来自授课（默认不是，只有showInfo为false才生效）
     */
    props: ['isShow', 'showInfo', 'isCourse'],
    data() {
      return {
        noResidue: false, //剩余数为0，
        eqView: 'list',
        eqData: {
          // type,
          // itemData
        },
        getUrl: '', // 获取查看试题的Url
      }
    },
    methods: {
      // 初始化
      init() {
//        if (!this.showInfo) {
          if (this.isCourse) {
            this.getUrl = api.get.path
          } else {
            this.getUrl = api.getCT.path
          }
//        }
      },
      // 视图切换
      show(view, data) {
        this.eqView = view;
        this.eqData = data;

        //如果剩余为0 ；则noResidue为true；
        let type = data.type.toLowerCase();
        if (data.type == 'IN_PROGRESS') {
          type = 'inProgress';
        }
//        if (data.itemData.testingDtoList[type].validitySubmits) {
//          this.noResidue = false;
//        } else {
//          this.noResidue = true;
//        }
      },
      //返回
      callBack() {
        this.eqView = 'list';
      },
      updateView() {
        this.$emit('updateView');
      },
    },
    created() {
      this.init()
    },
    components: {
      eqList,
      eqSubject,
      eqLook,
    }
  }

</script>

<style>
  /* 评测与作业 - 查看 */

  .eqViewItem {
    margin: 10px 0 20px 0;
  }

  .eqTestBtn {
    float: right;
    margin: 6px;
  }

</style>
