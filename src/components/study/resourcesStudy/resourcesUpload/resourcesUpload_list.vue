<!----------------------------------
****--资源上传(resourcesUpload_list)
****--@date     2017/8/7
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
    <div ref="content">
      <el-form  label-width="100px" >
          <el-row >
            <el-col :span="16" :offset="2">
              <el-form-item label="资源类型：" >
                <el-radio-group v-model="type">
                  <el-radio label="VIDEO">视频</el-radio>
                  <el-radio label="LITERATURE">文档文献</el-radio>
                  <el-radio label="ATLAS">医学图谱</el-radio>
                  <el-radio label="CASES">典型病例</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>
        <!--//视频-->
        <div ref="myTable" :style="{height:dynamicHt+'px'}" style="overflow: auto">
             <video-bank  fromWhereTree="VIDEO"   @cancel="cancel" @add="subCallback" v-if="type=='VIDEO'" :url="{add:{path:'/video/add-stu'},resourceTypeTree:{ path:'/resourceType/tree?types=VIDEO'}}"></video-bank>
          <!--文档文献-->
            <res-literature fromWhereTree="LITERATURE"   @cancel="cancel" @add="subCallback" v-if="type=='LITERATURE'" :url="{add:{path:'/literature/add-stu'},resourceTypeTree:{ path:'/resourceType/tree?types=LITERATURE'}}"></res-literature>
          <!--医学图谱-->
             <res-medical-atlas  fromWhereTree="ATLAS"   @cancel="cancel" @add="subCallback" v-if="type=='ATLAS'" :url="{add:{path:'/atlas/add-stu'},resourceTypeTree:{ path:'/resourceType/tree?types=ATLAS'}}"></res-medical-atlas>
          <!--经典病例-->
            <res-case-library fromWhereTree="CASES"   @cancel="cancel" @add="subCallback" v-if="type=='CASES'" :url="{add:{path:'/cases/add-stu'},resourceTypeTree:{ path:'/resourceType/tree?types=CASES'}}"></res-case-library>
        </div>
    </div>

</template>
<script>
/*当前组件必要引入*/
//视频
import videoBank from '../../../teach/teacherResManagement/videoBank/videoBank_add.vue'
//文档文献
import resLiterature from '../../../teach/teacherResManagement/resLiterature/resLiterature_add.vue';
//医学图谱
import resMedicalAtlas from '../../../teach/teacherResManagement/resMedicalAtlas/resMedicalAtlas_add.vue';
//经典病例
import resCaseLibrary from '../../../teach/teacherResManagement/resCaseLibrary/resCaseLibrary_add.vue'
//当前组件引入全局的util
let Util = null;
export default{
    data() {
        return {

            type:'VIDEO',
          dynamicHt:100,
        }
    },
    methods: {
        //初始化请求列表数据
        init(){

        },
      cancel(){


      },

      subCallback(){
        this.successMess('保存成功');
        this.type = '';
        //页面dom稳定后调用
        this.$nextTick( ()=> {
          this.type = 'VIDEO';
        })

      },
      //设置表格及分页的位置
      setTableDynHeight(){
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },

    },
    created(){
        this.init();
    },
  mounted(){
    //页面dom稳定后调用
    this.$nextTick(function () {
      //初始表格高度及分页位置
      this.setTableDynHeight();
      //为窗体绑定改变大小事件
      let Event = this.$util.events;
      Event.addHandler(window, "resize", this.setTableDynHeight);
    })
  },
    components: {
      videoBank,resLiterature,resMedicalAtlas,resCaseLibrary
    }
}
</script>
