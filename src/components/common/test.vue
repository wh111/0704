<template>
  <div>
  <div v-for="(data,index) in treeData" class="treeItem">
  <el-tree
    :data="data"
    :props="defaultProps"
    node-key="id"
    show-checkbox
    default-expand-all
    :default-checked-keys="[2]"
    :expand-on-click-node="false"
    :render-content="renderContent">
  </el-tree>
  </div>
  </div>
</template>
<style>
  .el-tree-node__expand-icon{
    display: inline-block;
    cursor: pointer;
    width: 0;
    height: 0;
    vertical-align: middle;
    margin-left: 10px;
    border: 6px solid transparent;
    border-right-width: 0;
    border-left-color: #97a8be;
    border-left-width: 7px;
    transform: rotate(0deg);
    transition: transform .3s ease-in-out;
    opacity: 1;
  }
</style>
<script>
  let data1 = [{
    id: 1,
    label: '一级 1',
    title:'ddd',
    children: [{
      id: 4,
      label: '二级 1-1',
      title:'aaa',
      children: [{
        id: 9,
        label: '三级 1-1-1',
        title:'ccc',
      }, {
        id: 10,
        label: '三级 1-1-2',
        title:'ddd',
      }]
    }]
  }, {
    id: 2,
    label: '一级 2',
    title:'fff',
    children: [{
      id: 5,
      label: '二级 2-1',
      title:'mmm',
    }, {
      id: 6,
      label: '二级 2-2',
      title:'jjj',
    }]
  }]

  let data2 = [{
    id: 3,
    label: '一级 3',
    title:'ttt',
    children: [{
      id: 7,
      label: '二级 3-1',
      title:'eee',
    }, {
      id: 8,
      label: '二级 3-2',
      title:'eeee',
    }]
  }]

  let data3 = [{
    id: 4,
    label: '一级 3',
    title:'ttt',
    children: [{
      id: 11,
      label: '二级 3-1',
      title:'eee',
    }, {
      id: 12,
      label: '二级 3-2',
      title:'eeee',
    }]
  }]

  export default {
    data() {
      return {
        treeData: [data1,data2,data3],
        defaultProps: {
          children: 'children',
          label: 'label',
          title:'wwww',
        }
      }
    },

    methods: {
      append(store, data) {
        store.append({ id: id++, label: 'testtest', children: [] }, data);
      },

      remove(store, data) {
        store.remove(data);
      },

      renderContent(h, { node, data, store }) {
        return (
          <span style="width:100%">
          <span style="width:200px;">
          <span>{node.label}</span>
        </span>
        <span>
          {data.title}
        </span>
        </span>);
      }
    }
  };
</script>
