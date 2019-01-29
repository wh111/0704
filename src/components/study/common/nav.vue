<template>
  <!-- 在线学习导航 -->
  <div class="coursesNavMain">
    <el-row>
      <!-- 8 6 4 3 -->
      <el-col class="coursesNavItem" :lg="2" :md="3" :sm="5" :xs="7" v-for="(item,index) in menuData" :key="index">
        <div class="coursesNavText" :class="{'active': active == item.id }">
          <el-tooltip v-if="item.name.length>7" class="item" effect="dark" :content="item.name" placement="top">
            <p class="overflow-txt1" style="text-align: center" @click="navChange(item.id,index,item.name)">{{ item.name }}</p>
          </el-tooltip>
          <p v-else class="overflow-txt1" style="text-align: center" @click="navChange(item.id,index,item.name)">{{ item.name }}</p>
        </div>
      </el-col>
    </el-row>
    <el-tabs v-if="menuData!=0" class="coursesNavChild" v-model="navActiveName" @tab-click="handleClick">
      <el-tab-pane label="全部" name="全部"></el-tab-pane>
      <el-tab-pane v-if="menuData[childIndex].children" v-for="(item,index) in menuData[childIndex].children" :key="index" :label="item.name+''" :name="item.id+''"></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  export default {
    props: ['navUrl', 'operailityData', 'count'],
    data() {
      return {
        navActiveName: this.operailityData.id || '',
        errorNum: '',
        menuData: [],
        getMenuUrl: this.navUrl,
        active: this.operailityData.pid,
        childIndex: 0,
      }
    },
    created() {
      this.getMenu();
    },
    methods: {


      // 获取菜单
      getMenu() {
        this.ajax({
          ajaxSuccess: res => {
            let menuData;
            if (res.data.length) {
              this.$emit('getRoot', res.data[0]); //传给父组件根节点id；
              if (!res.data[0].children) return;
              menuData = res.data[0].children;

              this.menuData = menuData;
              this.getChildIndex(this.operailityData);
            }

          },
          ajaxError: () => { // 获取失败时候重新获取，三次之后不再重试
            if (this.errorNum < 2) {
              this.errorNum++;
              this.getMenu();
            }
          },
          ajaxParams: {
            url: this.getMenuUrl
          }
        })
      },

      ////通过传过来的pid来找其子项childer
      getChildIndex(data) {
        for (let i = 0; i < this.menuData.length; i++) {
          if (data.pid == this.menuData[i].id) {
            this.childIndex = i;
          }
        }
      },


      //导航改变
      navChange(id, index, name) {
        let obj = {
          pid: id,
          id: '全部',
          pName: name,
        };
        this.$emit('navChange', obj);
        this.childIndex = index;
        this.navActiveName = '全部';
        this.active = id;
      },

      //二级菜单改变
      handleClick(tab, event) {
        let obj = {
          pid: this.menuData[this.childIndex].id,
          id: tab.name,
          pName: this.menuData[this.childIndex].name,
        };
        this.$emit('navChange', obj);
      },
    },
    watch: {
      operailityData(val) {
        this.getChildIndex(val);
      },
      count() {
        this.navActiveName = ''
        this.active = ''
      }

    },
  }

</script>

<style lang="scss">
  /* 在线学习导航 */

  .coursesNavMain {
    background: #eaedf1;
  }

  .coursesNavItem {
    margin: 20px 2% 0;
  }

  .coursesNavText {
    font-size: 16px;
    padding: 0 16px;
    p {
      height: 32px;
      line-height: 32px;
      cursor: pointer;
    }
    &.active {
      background-color: #58B7FF;
      color: #fff;
    }
  }

  .coursesNavChild {
    margin-top: 20px;
    padding: 0 2%;
    .el-tabs__header {
      margin: 0;
      border-bottom: none;
      border-top: 1px solid #d1dbe5;
      .el-tabs__item {
        &,
        &.is-active {
          border: none;
        }
      }
    }
    .el-tabs__content {
      display: none;
    }
    .el-tabs__nav-next,
    .el-tabs__nav-prev {
      line-height: 42px;
    }
  }

</style>
