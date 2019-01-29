<template>

  <div class=" leaveManagement-show select-column"  >
    <content-tree   @tree-click="treeClick" :treeOptions="treeDefaults" ></content-tree>
    <el-row >
      <el-col :span="20" :offset="2">
        <div style="margin-left: 100px">
          <el-button  @click="setNodeData">确定</el-button>
          <el-button  @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  import contentTree from '../contentManagement/leftTree.vue'

  /*
  * 接收url  返回选中的节点信息
  * */
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','url'],

    data (){
      return{
        isParent:'',
        //tree默认项设置
        treeDefaults:{
          getTreeUrl:this.url.treeList,
          isShowMenus:false,
          defaultProps:{
            children: 'childList',
          },
        },
        nodeData:'',
        options:[{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],

      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化
    },
    methods:{

        //把选中的节点信息提交给父组件
      setNodeData(){
          if(this.nodeData){
            this.$emit('selectCoumn',this.nodeData)
          }else{
              this.errorMess('请选择二级节点')
          }
      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','show');
      },

      //tree
      treeClick(obj,node,self){
        this.clickId = obj.id;
        if(node.level==3){
          this.nodeData = obj;
        }else {
          this.nodeData = '';
        }

      },


    },
    components:{
      //当前组件引入的子组件
     contentTree
    },
  }
</script>
