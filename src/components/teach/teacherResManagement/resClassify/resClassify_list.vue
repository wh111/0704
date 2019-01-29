<template>
  <!-- 资源分类管理 -->
  <div ref="content" class="resClassify">
    <!-- 导航菜单 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="标准课程" name="normCourse">
        <keep-alive>
          <normCourseTree v-if="activeName == 'normCourse'" :types="types" :contenHeight="contenHeight" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="教学视频" name="videoBank">
        <keep-alive>
          <videoBankTree v-if="activeName == 'videoBank'" :types="types" :contenHeight="contenHeight" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="文档文献" name="resLiterature">
        <keep-alive>
          <resLiteratureTree v-if="activeName == 'resLiterature'" :types="types" :contenHeight="contenHeight" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="典型病例" name="resCaseLibrary">
        <keep-alive>
          <resCaseLibraryTree v-if="activeName == 'resCaseLibrary'" :types="types" :contenHeight="contenHeight" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="医学图谱" name="resMedicalAtlas">
        <keep-alive>
          <resMedicalAtlasTree v-if="activeName == 'resMedicalAtlas'" :types="types" :contenHeight="contenHeight" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
/*当前组件必要引入*/
import normCourseTree from "./normCourseTree/normCourseTree_list.vue";
import videoBankTree from "./videoBankTree/videoBankTree_list.vue";
import resLiteratureTree from "./resLiteratureTree/resLiteratureTree_list.vue";
import resCaseLibraryTree from "./resCaseLibraryTree/resCaseLibraryTree_list.vue";
import resMedicalAtlasTree from "./resMedicalAtlasTree/resMedicalAtlasTree_list.vue";
//当前组件引入全局的util
let Util = null;
export default{
  data() {
    return {
      activeName: 'normCourse', // 资源分类默认视图-->normCourse
      contenHeight: 100,

      //lab标签类型  ['教学视频','文档文献','典型病例','医学图谱']
      labTypes:['STANDARD','VIDEO','LITERATURE','CASES','ATLAS'],
      types:'STANDARD',
    }
  },
  methods: {
    //初始化请求列表数据
    init(){

    },

    handleClick(tab, event) {
      this.types = this.labTypes[tab["index"]];
    },

    // 获取内容部分高度
    getContentHeight() {
      this.contenHeight = this.$refs.content.parentNode.parentNode.offsetHeight;
    },



  },
  created(){
    this.init();
  },
  mounted() {
    //页面dom稳定后调用
    this.$nextTick(function () {
      //初始表格高度及分页位置
      this.getContentHeight();
      //为窗体绑定改变大小事件
      let Event = this.$util.events;
//      Event.addHandler(window, "resize", this.getContentHeight);
    })
  },
  components: {
    normCourseTree,videoBankTree,resLiteratureTree,resCaseLibraryTree,resMedicalAtlasTree
  }
}
</script>
<style lang="scss">
  $padding: 12px;
  .resClassify {
    position: absolute;
    top: $padding;
    left: $padding;
    right: $padding;
    bottom: $padding;
  .el-tabs__content {
    position: absolute;
    top: 52px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  }

</style>
