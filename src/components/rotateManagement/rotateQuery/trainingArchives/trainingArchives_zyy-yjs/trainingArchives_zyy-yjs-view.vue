<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2017/11/23
****--@author   gx
----------------------------------->
<template>
    <div>
      <el-button style="position: absolute;right:20px;z-index: 2" size="small" type="primary" @click="derive">导出word</el-button>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="轮转记录" name="rotaryDepts"><rotaryDepts :operailityData="getData" :height="height"></rotaryDepts></el-tab-pane>
        <el-tab-pane label="病种记录" name="disease"><disease :operailityData="getData" :height="height"></disease></el-tab-pane>
        <el-tab-pane label="技能记录" name="skill"><skill :operailityData="getData" :height="height"></skill></el-tab-pane>
        <el-tab-pane label="出科小结" name="depExamination"><depExamination :operailityData="getData" :height="height"></depExamination></el-tab-pane>
      </el-tabs>
      <!--导出弹窗-->
      <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" class-name="vertical-center-modal" :width="500">
        <modal-header slot="header" :content="deriveId"></modal-header>
        <div>
          <div class="remove">确认导出吗</div>
          <el-row>
            <el-col :span="10" :offset="14">
              <a :href="derivePath">
                <el-button @click="affirmDerive" type="primary">确定</el-button>
              </a>
              <el-button class="but-col" @click=" deriveModal=false">取消</el-button>
            </el-col>
          </el-row>
        </div>
        <div slot="footer"></div>
      </Modal>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    import config from '../../../../../config/config';
    import rotaryDepts from './rotaryDeptsView.vue'  //轮转记录
    import disease from './diseaseView.vue'  //病种记录
    import skill from './skillView.vue'  //技能记录
    import depExamination from './depExaminationView.vue'  //出科小结
    //当前组件引入全局的util
    let Util = null;
    export default {
      props:['url','operailityData'],
        data() {
            return {
              activeName: 'rotaryDepts',
              derivePath:'',
              deriveModal: false,
              deriveId:{id:'deriveId',title:'导出'},
              getData:{
                rotaryDepts:[],
                disease:[],
                skill:[],
                depExamination:[],
              },
              height:500,
              //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
              listMessTitle:{
                paramsData:'listUrl',
                ajaxSuccess:'updateListData',
                ajaxParams:{
                  url:this.url.archivesGet.path+this.operailityData.userId+'-'+this.operailityData.studentTypes,
                  params:{}
                }
              },
            }
        },
        methods: {
            //初始化请求列表数据
            init() {
              this.ajax(this.listMessTitle)

            },

          updateListData(res) {
            let data = res.data;
            this.getData = data;
          },

          handleClick(tab, event) {
//            console.log(tab, event);
          },

          //导出
          derive() {
            let item = this.operailityData;
            this.derivePath =config.urlPrefix+ this.url.archivesExport.path+item.studentTypes+'-'+item.userId;
            this.openModel('derive')
          },

          //确定导出
          affirmDerive() {
            this.cancel('derive')
          },
          /*
          * 打开指定的模态窗体
          * @param options string 当前指定的模态:"add"、"edit"
          * */
          openModel(options){
            this[options+'Modal'] = true;
          },

          /*
           * 监听子组件通讯的方法
           * 作用:根据不同的参数关闭对应的模态
           * @param targer string example:"add"、"edit"
           * */
          cancel(targer){
            this[targer+'Modal'] = false;
          },

        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {
          rotaryDepts,
          disease,
          skill,
          depExamination,

        }
    }
</script>
