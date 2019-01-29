<template>
  <div>

      <!--左侧树-->
      <my-tree
        :treeData="treeData2"
        @tree-click="treeClick"
      >
      <!--右侧查询-->

        <el-form ref="queryQptions"  :inline="true"  class="form-inline lose-margin" label-width="90px" >
          <el-row >
            <el-col :span="8" >
              <el-form-item label="工号" >
                <el-input  placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <el-form-item label="姓名" >
                <el-input  placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>

          <el-col :span="8">
            <el-form-item label="状态" prop="status">
                <el-input  placeholder="请输入"></el-input>
              </el-form-item>
            </el-form-item>
          </el-col>
          </el-row >

          <el-row >
            <el-col :span="8" >
              <el-form-item label="专业" >
                <el-input  placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>

          <el-col :span="8">
            <el-form-item   label="职称" prop="status">
                <el-input  placeholder="请输入"></el-input>
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职位" prop="status">
                <el-input  placeholder="请输入"></el-input>
              </el-form-item>
            </el-form-item>
          </el-col>
          </el-row >
          <el-row >
            <el-col :span="2" :offset="22">
              <load-btn @listenSubEvent="handleSearch" :btnData="searchBut"></load-btn>
            </el-col >
          </el-row >
        </el-form>
          <el-row >
            <el-col :span="24" >
            <Transfer
              :data="treeData"
              :list-style="listStyle"
              :target-keys="targetKeys2"
              filterable
              @on-change="handleChange2">
            </Transfer>
              </el-col >
            </el-row >
          <el-row >
            <el-col :span="6" :offset="19" >
              <load-btn @listenSubEvent="handleSearch" :btnData="submitBtn"></load-btn>
              <el-button  type="warning"  @click="" >重置</el-button>
            </el-col>
            </el-row >
      </my-tree>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        searchBut:{title:'查询',callParEvent:'listenSubEvent'},
        submitBtn:{title:'提交',callParEvent:'listenSubEvent'},
        filterText: '',
        clickId:'',
        searchBtn:{
          title:'提交',
          callParEvent:'handleSearch'
        },
        treeData: this.getMockData(),
        targetKeys2: this.getTargetKeys(),
        treeData2: [{
          id: 1,
          label: '账户管理',
          children: [{
            id: 4,
            label: '住院医',
            children: [{
              id: 9,
              label: '招录人员'
            }, {
              id: 10,
              label: '管理人员'
            },
              {
                id: 30,
                label: '基地'
              }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        listStyle:{
          width: '250px',
          height: '500px',
          margin:'10px 50px'
        },
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:'/role/list?name=&identify=&type=',
          }
        }

      };
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },

    methods: {
      //通过get请求列表数据
      updateListData(responseData){
        let len = responseData.data.length;
        let data = responseData.data.splice(0,150);
        let that = this;
        that.tableData1=[];
        data = that.addIndex(data);
        for(var i=0,n=0;i<data.length;i+=100,n++){
          setTimeout(()=>{
            that.tableData1= that.tableData1.concat(data.splice(0,100));
          },n*10)
        }
        that.listTotal = 1;
      },
      setTableData(isLoadingFun){
        this.listMessTitle.ajaxParams = Object.assign(this.listMessTitle.ajaxParams,this.queryQptions);
        this.ajax(this.listMessTitle,isLoadingFun);
      },

      handleSearch(isLoadingFun){
        isLoadingFun(true);
        this.setTableData(isLoadingFun)
      },
      getMockData () {
        let mockData = [];
        for (let i = 1; i <= 20; i++) {
          mockData.push({
            key: i.toString(),
            label: '内容' + i,
            description: '内容' + i + '的描述信息',
            disabled: Math.random() * 3 < 1
          });
        }
        return mockData;
      },
      getTargetKeys () {
        return this.getMockData()
          .filter(() => Math.random() * 2 > 1)
          .map(item => item.key);
      },

      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
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
      handleChange2 (newTargetKeys) {
        this.targetKeys2 = newTargetKeys;
      },
      filterMethod (data, query) {
        return data.label.indexOf(query) > -1;
      }
    },


  };
</script>
