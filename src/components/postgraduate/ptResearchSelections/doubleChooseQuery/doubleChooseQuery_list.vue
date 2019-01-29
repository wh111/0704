<!----------------------------------
****--@name     双选查询
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content">
    <el-tabs v-model="activeName">
      <el-tab-pane label="学生选择导师" name="first">
        <interview v-if="contenHeight>0" :contentHeight="contenHeight"></interview>
      </el-tab-pane>
      <el-tab-pane label="报名学生" name="second">
        <confirm v-if="contenHeight>0" :contentHeight="contenHeight"></confirm>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
    /*当前组件必要引入*/
    //引入子组件
    import interview from './doubleChooseQuery_teacher.vue'
    import confirm from './doubleChooseQuery_student.vue'
    //当前组件引入全局的util
    let Util = null;
    export default{
        data() {
            return {
              activeName: 'first',
              contenHeight: 0,
            }
        },
        methods: {
            //初始化请求列表数据
          getContentHeight() {
            this.contenHeight = this.$refs.content.parentNode.offsetHeight;
          },

        },
        created(){

        },
        mounted(){
          this.$nextTick(function () {
            //初始表格高度及分页位置
            this.getContentHeight();
            //为窗体绑定改变大小事件
            let Event = this.$util.events;
            Event.addHandler(window, "resize", this.getContentHeight);
          })
        },
        components: {
          interview,confirm
        }
    }
</script>
