<template>
  <!-- 分类菜单 -->
  <div class="classMenuBox" :class="[theUseType]" @mouseleave="mouseleave">
      <div class="classMenuName">
      课程分类
    </div>
    <!-- 一级菜单 -->
    <div class="classMenuContent">
      <div class="classMenuSwriper">
        <div class="classMenuItem" v-for="(item,index) in menuData" :key="item.id" @mousemove="mousemove(index,item.id)" :class="{'active':childIndex === index}">
          <div class="classMenuText" @click="menuClick(item,item.name)">
            <p class="overflow-txt1">{{ item.name }}</p>
            <i class="el-icon-arrow-right" v-if="!item.leaf"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 二级菜单 -->
    <div class="classMenuChirld" :class="{'active':childIndex > -1}" v-if="menuData.length && (childIndex > -1) && !menuData[childIndex].leaf">
      <div class="classMenuChirldTitle">
        <p>{{ menuData[childIndex].name }}</p>
      </div>
      <el-row class="classMenuChirldBox">
        <template v-for="(cItem,index) in menuData[childIndex].children">
          <el-col :span="8" :key="cItem.id" v-if="(index + 1) % 3 === 0">
            <p class="overflow-txt1 classMenuChirldItem" :class="{'active':cItem.id === menuSonId}" @click="menuSonClick(cItem,menuData[childIndex].name)">{{ cItem.name }}</p>
          </el-col>
          <el-col :span="7" :key="cItem.id" :offset="1" v-else>
            <p class="overflow-txt1 classMenuChirldItem" :class="{'active':cItem.id === menuSonId}" @click="menuSonClick(cItem,menuData[childIndex].name)">{{ cItem.name }}</p>
          </el-col>
        </template>
      </el-row>
    </div>

  </div>
</template>

<script>
  export default {
    props: ['menuUrl', 'useType', 'types'],
    data() {
      return {
        errorNum: 0,
        childIndex: -1,
        menuData: [],
        menuId: '', // 选择的菜单id
        menuSonId: '', // 选择的子菜单id
        getMenuUrl: '/resourceType/tree?types=' + this.types,
        theUseType: 'show', // show显示|hover悬停
      }
    },
    methods: {
      init() {
        if (this.menuUrl) {
          this.getMenuUrl = this.menuUrl
        }
        if (this.useType) {
          this.theUseType = this.useType
        }
        this.getMenu()
      },
      mousemove(index, id) {
        this.menuId = id;
        this.childIndex = index;
      },
      mouseleave() {
        this.childIndex = -1;
      },
      // 获取菜单
      getMenu() {
        this.ajax({
          ajaxSuccess: res => {
            if (res.data.length) {
              if(!res.data[0].children) return;
              this.menuData = res.data[0].children;
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
      // 菜单点击
      menuClick(obj,pName) {
        this.menuId = obj.id;
        this.$emit('menuClick', obj, {
          pid: this.menuId, // 一级菜单id
          id: '全部', // 二级菜单id
          pName:pName,
        })
      },
      // 子菜单点击
      menuSonClick(obj,pName) {
        this.menuSonId = obj.id;
        this.$emit('menuClick', obj, {
          pid: this.menuId,
          id: this.menuSonId+'',
          pName:pName,
        })
      },
    },
    created() {
      this.init()
    },
  }

</script>

<style lang="scss">
  /* 分类菜单 */

  $classMenuNameHeight:36px;
  $classMenuWidth: 218px;
  $classMenuHeight: 250px;
  $paddingLeft:60px;
  $borderColor:#bfcbd9;
  $classMenuChirldWidth:475px;
  $classMenuChirldHeight:246px;
  $classMenuChirldPadding:16px;
  $classMenuChirldTitlePadding:48px;

  .classMenuBox {
    width: $classMenuWidth;
    position: relative;
    z-index: 3;
    &.hover {
      .classMenuContent {
        display: none;
        width: $classMenuWidth;
        position: absolute;
        bottom: -$classMenuHeight;
        left: 0;
        z-index: 4;
        background: #ffffff;
      }
      &:hover {
        .classMenuContent {
          display: block;
        }
      }
    }
  }

  .classMenuName {
    width: 100%;
    height: $classMenuNameHeight;
    line-height: $classMenuNameHeight;
    font-size: 20px;
    color: #fff;
    padding-left: $paddingLeft;
    background: url(~@/assets/ambuf/css/videoStudy/images/type.png) #2e3b4d 17px 8px no-repeat;
  }

  .classMenuContent {
    width: 100%;
    height: $classMenuHeight;
    border: 1px solid $borderColor;
    overflow: hidden; // &:hover {
    //   &~.classMenuChirld {
    //     display: block;
    //   }
    // }
  }

  .classMenuSwriper {
    height: 100%;
    width: $classMenuWidth + $classMenuChirldPadding; // padding-right: $classMenuChirldPadding;
    padding-right: $classMenuChirldPadding;
    overflow-y: auto;
  }

  .classMenuItem {
    width: $classMenuWidth - 1;
    font-size: 16px;
    line-height: 20px;
    padding: 10px 36px 10px $paddingLeft;
    border-bottom: 1px solid $borderColor;
    &.active {
      .classMenuText {
        color: #20A0FF;
      }
    }
  }

  .classMenuText {
    color: #1F2D3D;
    cursor: pointer;
    position: relative;
    .el-icon-arrow-right {
      position: absolute;
      top: 1px;
      right: -20px;
    }
  }

  .classMenuChirld {
    width: $classMenuChirldWidth;
    height: $classMenuChirldHeight + $classMenuNameHeight + 4;
    padding: $classMenuChirldPadding;
    border: 1px solid $borderColor;
    background-color: #fff;
    position: absolute;
    right: -$classMenuChirldWidth + 1;
    top: 0;
    z-index: 5;
    display: none;
    &.active {
      display: block;
    }
  }

  .classMenuChirldTitle {
    padding-left: $classMenuChirldTitlePadding;
    background: url(~@/assets/ambuf/css/videoStudy/images/childrenIcon.png) 8px 1px no-repeat;
    p {
      padding-bottom: 10px;
      border-bottom: 1px solid $borderColor;
    }
  }

  .classMenuChirldBox {
    position: absolute;
    top: 43px;
    right: 0;
    bottom: 0;
    left: $classMenuChirldTitlePadding;
    overflow-y: auto;
  }

  .classMenuChirldItem {
    cursor: pointer;
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    margin: 6px 0;
    &:hover {
      color: #20A0FF;
    }
  }

</style>
