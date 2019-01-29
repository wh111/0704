<!----------------------------------
****--@name      周历选择本科生节点
****--@role     ${*}
****--@date     2018/7/13
****--@author   gx
----------------------------------->
<template>
  <div class="calendar_selectClass">
    <!--左侧树-->
    <div class="container">
      <div class="treeLeft">
        <left-tree @tree-click="treeClick" :treeOptions="treeDefaults"></left-tree>
      </div>
      <div class="treeLeft-middle">
        <div style="margin:10px 10px 10px 30px">
          <el-button size="small" @click="toRight">向右移动</el-button>
        </div>
      </div>
      <div class="treeRight">
        <div slot="right" id="content" ref="content" class="modal" style="height:100%;">
          <div class="treeRight-rigth">
            <div class="treeRight-leaf" @click="iconClick" v-for="(item,index) in selectData">
              <Icon type="document" class="treeRight-iconm" :class="{isCheck:'is-current'}"></Icon>

              {{item.nodeName}}
              <Icon type="close-circled" class="delete" @click.native="deleteClass(index)"></Icon>
            </div>

          </div>
          <br/>

        </div>
      </div>
    </div>
    <div style="text-align: center">
      <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  /*当前组件必要引入*/
  import layoutTree from '../../../common/layoutTree.vue';
  import leftTree from '../../../common/leftTree.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props:['defaultClassData'],
    data() {
      return {
        selectData: [],
        //tree默认项设置
        treeDefaults: {
          getTreeUrl: '/dept/tree-by-BKS', //目录树结构请求地址
          selectUser: true,
          isShowMenus: false,
          isInitSltedNode: false //是否需要默认选中tree节点
        },
        nowClick: '',
        selectClick: {},
        loadBtn: {title: '确定', callParEvent: 'listenSubEvent'},
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.selectData=this.defaultClassData;
      },
      deleteClass(i){
        this.selectData.splice(i,1)
      },
      /*
      * 左侧目录树节点click调用方法
      *
      * @param obj {} 当前选中节点的一级数据
      *
      * @param node  {}  整个tree节点所有数据
      *
      * @param  self  {}  当前tree vue实例
      *
      * @param isLeaf boolean  当前节点是否为叶子节点
      * */
      treeClick(obj, node, self, isLeaf) {
        console.log(obj, node, self, isLeaf);
        let id = obj.id;
        this.selectTreeData = {id, node, self, isLeaf};
        this.searchUserInfo = '';
        this.nowClick = {obj, node};
//        this.formateTreeData(obj, isLeaf, node);
      },

      //向右移动
      toRight() {

        let nowClick = this.nowClick;
        if (!nowClick) {
          this.errorMess('请选择节点');
          return;
        }
        if (nowClick.obj.level != 4) {
          this.errorMess('请选择班级节点');
          return;
        }
        let selectData = this.selectData;
        let flag = selectData.some(item => {
          console.log(item.id === nowClick.obj.id);
          console.log(item);
          return item.id === nowClick.obj.id;
        })
        if (!flag) {
          let nodeName = [];
          nodeName.unshift(nowClick.obj.name);
          let parent = nowClick.node.parent;
          while (parent.key > 0) {
            nodeName.unshift(parent.label);
            parent = parent.parent;
          }
          selectData.push(Object.assign(nowClick.obj, {isCheck: false, nodeName: nodeName.join('/')}))
        }
        console.log(this.selectData)
      },
      //向左移动
      toLeft() {

      },
      listenSubEvent(){
        this.$emit('select',this.selectData)
      },
      //调用父组件关闭当前模态框
      cancel () {
        this.$emit('cancel', 'selectFunds');
      },
      iconClick() {

      },

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      layoutTree,
      leftTree,
    }
  }

</script>
<style lang="scss">
  .calendar_selectClass {
    .delete:hover{
      color: #20a0ff;
    }
    .container {
      position: relative;
      height: 400px;
      width: 100%;
    }

    .treeLeft {
      width: 220px;
      height: 100%;
      & ~ .treeRight {
        left: 336px;
      }
    }
    .treeLeft-middle {
      position: absolute;
      left: 220px;
      top: 0;
      right: 0;
      bottom: 0;
      padding-top: 200px;
      margin-top: -60px;
      overflow: hidden;
      width: 150px;
      height: 100%;
      text-align: center;
    }

    .treeRight {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      overflow: hidden
    }
    .treeRight-rigth {
      margin: 0 auto;
      width: 350px;
      height: 100%;
      overflow: auto;
      cursor: default;
      background: #fff;
      border: 1px solid #d1dbe5;
      vertical-align: middle;
    }
    .treeRight-rigth .treeRight-leaf {
      line-height: 36px;
      height: 36px;
      cursor: pointer;
      vertical-align: middle;

    }
    .treeRight-iconm {
      font-size: 25px;
      color: #20a0ff;
      padding: 5px;
    }
    .is-current {
      font-weight: 700;
      color: #20a0ff;
      background-color: #edf7ff;
    }
  }
</style>

