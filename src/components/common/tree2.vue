<!--菜单管理-->
<!--业务字典-->


<template>
  <div id="content" ref="content" class="modal">

      <!--左侧树-->

        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>

        <el-tree style="min-height: 500px"
                 highlight-current
                 node-key="id"
                 class="filter-tree"
                 :data="data2 "
                 :props="defaultProps"
                 @node-click="treeClick"
                 :expand-on-click-node="false"
                 :filter-node-method="filterNode"
                 :render-content="renderContent"
                 ref="tree2">
          <i class="el-icon-delete"></i>
        </el-tree>

      <!--右侧查询-->




  </div>
</template>
<script >

  let Util=null;
  let store = null;
  export default{
    props:['treeData'],
    data() {
      return {

        //tree
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        listStyle: {
          width: '250px',
          height: '500px',
          margin: '10px 50px'
        },
      }
    },

    methods: {

      /*tree*/
      //搜索
      filterNode(value, data,node) {
//          console.log(data,value,node);
        let parent = node.parent;
        if (!value) return true;
        if(data.label.indexOf(value) !== -1){
          return true;
        }
        while(!!parent.label){
          if(parent.label.indexOf(value) != -1){
            return true;
          }else{
            parent = parent.parent;
          }
        }


        return false ;
      },
      //点击节点
      treeClick(obj,node,self){
        //出现切换按钮
        //点击的是叶节点则不更新列表数据
        if(!node.childNodes.length)return;

        this.$emit('tree-click',obj,node,self)

      },
      expendNode(treeStore,store,data){
        treeStore.expanded = !treeStore.expanded
      },
      //自定义节点内容
      renderContent(h, { node, data, store }) {
        let that = this;
        let icon = <i class="ivu-icon ivu-icon-android-folder ambuf-tree-icon"></i>;

        if(node.isLeaf){
          icon = <i class="ivu-icon ivu-icon-document ambuf-tree-icon"></i>;
        }else{
          if(node.expanded){
            icon = <i class="ivu-icon ivu-icon-android-folder-open ambuf-tree-icon"></i>;
          }
        }
        return (
          <span>
          <span>
          {icon}
          <span>{node.label}</span>
        </span>
        <span style="float: right; margin-right: 20px">
          </span>
          </span>);
      }
    },

    computed:{
      data2(){
        return this.treeData;
      }
    },
    mounted(){
      let content = this.$refs.content;
      let parHt = content.parentNode.offsetHeight;
      let myTable = this.$refs.myTable;
      this.dynamicHt = parHt - 170;
    },

    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },

  }
</script>
<style>

  .add-remove{
    margin-bottom: 20px;
  }
  .header{
    height: 30px;
    font-size: 18px;
    color: #ffffff;

  }


</style>

