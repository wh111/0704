<!----------------------------------
****--@name     课程学习 更多
****--@role     ${*}
****--@date     2017/8/17
****--@author   gx
----------------------------------->
<template>
    <div>
      <el-row class="coursesStudyVideoContent">
        <!-- 视频内容 -->
        <el-col v-if="tableData!=0" style="max-height: 600px;overflow: auto">
            <el-col :xs="23" :sm="11" :md="7" :lg="5" class="coursesStudyVideoItem"  :offset="1" v-for="item in tableData" :key="item.id">
              <div @click="videoClick(item)" style="cursor: pointer">
                <div style="width: 100% ;height: 125px;">
                  <img :src="getPicUrl(item.logo)"  class="coursesStudyPhoto" style="height: 125px">
                </div>
                <!-- <p class="">视频名称</p> -->
                <div class="coursesStudyVideoInfo" >
                  <h3 class="overflow-txt1" style="text-align: center">{{ item.title }}</h3>
                  <el-row>
                    <el-col :span="12">
                      <span>{{ item.teacher }}</span>
                    </el-col>
                    <el-col :span="12" align="right">
                      <span>{{ item.totalLesson }}课时</span>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
        </el-col>
      </el-row>
      <div style="margin: 10px;" align="right">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>

      <!-- 更多弹窗 -->
      <Modal :mask-closable="false" v-model="showModal" class-name="vertical-center-modal" :width="1100">
        <modal-header slot="header"  :content="showId"></modal-header>
        <show style="height: 600px;" v-if="showModal" :operaility-data="showData" :saveProgress="true"></show>
        <div slot="footer"></div>
      </Modal>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    import show from '../webCourses/webCourses_view.vue'
    //当前组件引入全局的util
    let Util = null;
    export default{
        props:['operailityData'],
        data() {
            return {
              tableData: [
//                {
//                  "id":1,
//                  "title":"课件名称",
//                  "teacher":"王五",
//                  "logo":"/logo.png",
//                  "totalLesson":100
//                }
              ],
              showData:{},//选择的视频信息
              loading: false,
              totalCount: 0,
              //初始化加载页面信息
              listMessTitle: {
                ajaxSuccess: 'updateListData',
                ajaxParams: {
                  url: this.operailityData.path,
                  params: {},
                }
              },

              showModal:false,
              showId: {
                id: 'showId',
                title: '查看'
              },
            };
        },
        methods: {
            //初始化请求列表数据
            init(){
              this.myPages = this.$util.pageInitPrams;
              this.queryQptions = {
                params: {
                  curPage: 1,
                  pageSize: this.$util.pageInitPrams.pageSize
                }
              }
              this.setTableData();
            },

          //初始化加载列表数据
          setTableData() {
            this.listMessTitle.ajaxParams.params = this.listMessTitle.ajaxParams.params;
            this.ajax(this.listMessTitle);
          },


          //通过get请求列表数据
          updateListData(responseData){
            if(!responseData.data)return;
            this.tableData = responseData.data;
            if(!responseData.totalCount) return;
            this.totalCount = responseData.totalCount;
          },
          // 获取图片
          getPicUrl(staticUrl) {
            let src = '';
            if (staticUrl) {
              src = this.$store.state.envPath.http + staticUrl
            }
            return src
          },

          //点击视频
          videoClick(data){
            this.showData = data;
            this.showModal = true;
          }


        },
        created(){
            this.init();
        },
        mounted(){
        },
        components: {
          show
        }
    }
</script>
