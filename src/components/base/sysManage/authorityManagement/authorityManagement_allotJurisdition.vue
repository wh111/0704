<template>
  <div>
  <div class="authorityManagement">当前正在为 <span class="">责任导师</span> 分配权限</div>
    <my-tree2
      :treeData="treeData2"
      @tree-click="treeClick">
  </my-tree2>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        treeData2: [{
          id: 1,
          label: '住院医规培',
          children: [{
            id: 4,
            label: '学院招录',
            children: [{
              id: 9,
              label: '学院报名'
            }, {
              id: 10,
              label: '审核状态'
            }, {
              id: 31,
              label: '网上预审'
            }, {
              id: 32,
              label: '现场审核'
            }, {
              id: 33,
              label: '招生考试'
            }, {
              id: 34,
              label: '招生录取'
            }, {
              id: 35,
              label: '招生设置'
            }
            ]
          }]
        }, {
          id: 2,
          label: '培训过程记录',
          children: [{
            id: 5,
            label: '培训申请填写',
            children: [{
              id: 5,
              label: '请假条'
            }, {
              id: 6,
              label: '出科申请'
            },{
              id: 6,
              label: '学员结业申请'
            }
            ]
          }, {
            id: 6,
            label: '培训记录填写'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    methods: {
      getCheckedNodes() {
        //console.log(this.$refs.tree.getCheckedNodes());
      },
      getCheckedKeys() {
        //console.log(this.$refs.tree.getCheckedKeys());
      },

      setCheckedKeys() {
        this.$refs.tree.setCheckedKeys([3]);
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },
      selectNodes(){
        var treeNode = this.$refs.tree.getCheckedNodes(true);
        //console.log(treeNode)
      },
      renderContent(h, { node, data, store }) {
        return '<div>111</div>'
      },
      treeClick(obj,node,self){
        this.clickId = obj.id;
        this.treeData = [{
          key: 9,
          label: '招录人员',
          disabled: false

        }, {
          key: 10,
          label: '管理人员',
          disabled: false
        },
          {
            key: 30,
            label: '基地',
            disabled: false
          }]
        this.targetKeys2=[9]


      },


    },


  };
</script>
