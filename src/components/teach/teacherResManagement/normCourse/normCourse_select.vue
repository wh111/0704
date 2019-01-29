<template>
  <div class="normCourseSelectMain" ref="ncsMain">
    <!-- 选择标准课程 -->
    <div ref="ncsTop">
      <el-row class="normCourseSelectTop">
        <el-col :span="12">
          <h2 class="normCourseSelectTitle">选择标准课程</h2>
        </el-col>
        <el-col :span="12" align="right">
          <el-button type="info" @click="next">下一步</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 可选内容 -->
    <div class="normCourseSelectBody" :style="{'height':ncsHt + 'px'}">
      <el-row>
        <el-col align="right">
          <el-input placeholder="请输入关键字" v-model="searchObj.title" class="searchInput">
            <el-button slot="append" icon="search" @click="search"></el-button>
          </el-input>
        </el-col>
        <!-- 待选项 -->
        <template v-if="showData.length">
          <el-col class="normCourseSelectItem" :span="5" v-for="item in showData" :key="item.id" :class="{'active':selectId === item.id}" @click.native="selectNormCourse(item.id,item)">
            <h3 class="normCourseSelectItemTitle overflow-txt1" align="center">{{ item.title }}</h3>
            <img :src="getPicUrl(item.logo)" class="normCourseSelectItemImg">
            <div class="normCourseSelectItemInfo">
              <div class="normCourseSelectItemInfoText">{{ getTextByHtml(item.direction) }}</div>
            </div>
            <div class="normCourseSelectItemCheck"><i class="el-icon-check"></i></div>
          </el-col>
        </template>
        <p v-else class="noNormCourseSelectTips">暂无标准课程可选择</p>
        <!-- 更多 -->
        <el-col align="center">
          <el-button class="normCourseSelectMoreBtn" type="info" @click="loadMore" v-if="queryQptions.params.curPage < Math.ceil(totalCount/8)">更多课程</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  let Util;
  import api from './api';
  export default {
    data() {
      return {
        ncsHt: 0,
        totalCount: 0,
        selectId: -1, // 选中的索引
        selectData: null, // 选中的数据
        showData: [],
        searchObj: { // 搜索
          title: '', // 名称关键字
        },
      }
    },
    methods: {
      // 初始化
      init() {
        Util = this.$util;

        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.select.path,
          params: {
            curPage: 1,
            pageSize: 8, // 每次获取8条数据
          }
        }
        this.getSelectData();
      },
      // 搜索
      search() {
        this.showData.length = 0;
        this.getSelectData();
      },
      // 更多
      loadMore() {
        this.queryQptions.params.curPage++;
        this.getSelectData();
      },
      // 选择
      selectNormCourse(id, selectObj) {
        if (this.selectId === id) { // 点击已选中的则表示取消选择
          this.selectId = -1;
          this.selectData = null;
        } else {
          this.selectId = id;
          this.selectData = selectObj;
        }
      },
      // 下一步
      next() {
        this.$emit('select', this.selectData)
      },
      // 从html中获取文本
      getTextByHtml(str = '', length = 50) {
        return str ? str.replace(/<\/?.+?>/g, "").replace(/ /g, "").substring(0, length) : '暂无应用方向说明';
      },
      // 获取选择数据
      getSelectData() {
        Object.assign(this.queryQptions.params, this.searchObj);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        })
      },
      // 获取数据成功
      listDataSuccess(res) {
        // 数据请求成功回调
        this.totalCount = res.totalCount;
        if (res.data instanceof Array) {
          this.showData = this.showData.concat(res.data)
        }
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contenHeight = this.$refs.ncsMain.parentNode.offsetHeight;
        let ncsTop = this.$refs.ncsTop.offsetHeight;
        this.ncsHt = contenHeight - ncsTop;
      },
      // 获取图片
      getPicUrl(staticUrl) {
        let src = '';
        if (staticUrl) {
          src = this.$store.state.envPath.http + staticUrl
        }
        return src
      },
    },
    created() {
      this.init()
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight()
      })
    },
  }

</script>

<style lang="scss">
  /* 选择标准课程 */

  .normCourseSelectTop {
    padding-bottom: 16px;
    border-bottom: 1px solid #e3e8ee;
  }

  .normCourseSelectTitle {
    line-height: 38px;
  }

  .normCourseSelectMain {
    height: 100%;
  }

  .normCourseSelectBody {
    overflow-y: auto;
  }

  .searchInput {
    max-width: 300px;
    margin-top: 16px;
    padding-bottom: 6px;
  }

  .normCourseSelectItem {
    cursor: pointer;
    border: 1px solid #e3e8ee;
    border-radius: 5px;
    margin: 10px 2%;
    position: relative;
    &.active {
      border-color: #20A0FF;
      .normCourseSelectItemCheck {
        display: block;
      }
    }
  }

  .normCourseSelectItemCheck {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(255, 255, 255, .5);
    border-radius: 5px;
    text-align: center;
    display: none;
    .el-icon-check {
      width: 100%;
      font-size: 20px;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      color: #20A0FF;
    }
  }

  .normCourseSelectItemTitle {
    padding: 2px 10px;
  }

  .normCourseSelectItemInfo {
    padding: 10px;
  }

  .normCourseSelectItemImg {
    width: 100%;
    height: 160px;
  }

  .normCourseSelectItemInfoText {
    height: 38px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .normCourseSelectMoreBtn {
    margin-top: 10px;
  }

  .noNormCourseSelectTips {
    line-height: 200px;
    text-align: center;
  }

</style>
