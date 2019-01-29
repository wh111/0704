<!----------------------------------
****--pdf预览(viewDoc)
****--@date     2017/8/9
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <div style="width: 90%;margin: 0 auto;">
      <slot name="header"></slot>
      <el-row>
        <el-col :span="20">
          <el-button class="vpdfBtnItem" @click="gotoPage('up')">上一页</el-button>
          <el-button class="vpdfBtnItem" @click="gotoPage('down')">下一页</el-button>
          <el-input class="vpdfBtnItem" v-model.number="myPage" style="width: 5em"></el-input>
          <span class="vpdfBtnItem vpdfPageTips">
                      / {{numPages}}
          </span>
          <el-button class="vpdfBtnItem" @click="rotate += 90">&#x27F3;</el-button>
          <el-button class="vpdfBtnItem" @click="rotate -= 90">&#x27F2;</el-button>
          <!--<el-button @click="$refs.pdf.print()">print</el-button>-->
        </el-col>
        <el-col :span="4" align="right">
          <span class="vpdfPageTips">当前第{{page}}页</span>
        </el-col>
      </el-row>
    </div>
    <br/>
    <div style="width: 90%;margin: 0 auto;">
      <div v-if="loadedRatio > 0 && loadedRatio < 1" style="background-color: green; color: white; text-align: center"
           :style="{ width: loadedRatio * 100 + '%' }">{{ Math.floor(loadedRatio * 100) }}%
      </div>
      <pdf v-if="show" ref="pdf" style="border: 1px solid #EFF2F7;box-shadow: 0 0 4px 0 rgba(135,134,134,0.50);"
           :src="src" :page="page" :rotate="rotate" @password="password" @progress="loadedRatio = $event" @error="error"
           @numPages="numPages = $event"></pdf>
      <p v-if="pdfSrc==''">pdf加载失败!</p>
    </div>
    <br/>
    <div style="width: 90%;margin: 0 auto;padding-bottom: 20px">
      <el-row>
        <el-col :span="20">
          <el-button class="vpdfBtnItem" @click="gotoPage('up')">上一页</el-button>
          <el-button class="vpdfBtnItem" @click="gotoPage('down')">下一页</el-button>
          <el-input class="vpdfBtnItem" v-model.number="myPage" style="width: 5em"></el-input>
          <span class="vpdfBtnItem vpdfPageTips">
                      / {{numPages}}
          </span>
          <el-button class="vpdfBtnItem" @click="rotate += 90">&#x27F3;</el-button>
          <el-button class="vpdfBtnItem" @click="rotate -= 90">&#x27F2;</el-button>
          <!--<el-button @click="$refs.pdf.print()">print</el-button>-->
        </el-col>
        <el-col :span="4" align="right">
          <span class="vpdfPageTips">当前第{{page}}页</span>
        </el-col>
      </el-row>
      <!--<el-row>-->
        <!--<el-col :span="11">-->
          <!--<el-button @click="gotoPage('up')">上一页</el-button>-->
          <!--<el-button @click="gotoPage('down')">下一页</el-button>-->
          <!--<el-input v-model.number="page" style="width: 5em"></el-input>-->
          <!--/{{numPages}}-->
          <!--<el-button @click="rotate += 90">&#x27F3;</el-button>-->
          <!--<el-button @click="rotate -= 90">&#x27F2;</el-button>-->
          <!--&lt;!&ndash;<el-button @click="$refs.pdf.print()">print</el-button>&ndash;&gt;-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--当前页&#45;&#45;{{myPage}}-->
        <!--</el-col>-->
      <!--</el-row>-->
    </div>
  </div>
</template>
<style lang="scss">
  .vpdfBtnItem{
    & ~ &{
      margin-left: 10px;
    }
  }
  .vpdfPageTips{
    line-height: 36px;
    font-size: 16px;
  }
</style>
<script>
  import pdf from "vue-pdf"

  export default {
    components: {
      pdf
    },
    props: ["pdfSrc"],
    data() {
      return {
        show: false,
        pdfList: [
          this.pdfSrc,
          /*'https://cdn.mozilla.net/pdfjs/tracemonkey.pdf',
           'https://cdn.rawgit.com/mozilla/pdf.js/c6e8ca86/test/pdfs/freeculture.pdf',
           'https://cdn.rawgit.com/mozilla/pdf.js/c6e8ca86/test/pdfs/annotation-link-text-popup.pdf',
           'https://cdn.rawgit.com/mozilla/pdf.js/c6e8ca86/test/pdfs/calrgb.pdf',
           'https://cdn.rawgit.com/sayanee/angularjs-pdf/68066e85/example/pdf/relativity.protected.pdf',
           'data:application/pdf;base64,JVBERi0xLjUKJbXtrvsKMyAwIG9iago8PCAvTGVuZ3RoIDQgMCBSCiAgIC9GaWx0ZXIgL0ZsYXRlRGVjb2RlCj4+CnN0cmVhbQp4nE2NuwoCQQxF+/mK+wMbk5lkHl+wIFislmIhPhYEi10Lf9/MVgZCAufmZAkMppJ6+ZLUuFWsM3ZXxvzpFNaMYjEriqpCtbZSBOsDzw0zjqPHZYtTrEmz4eto7/0K54t7GfegOGCBbBdDH3+y2zsMsVERc9SoRkXORqKGJupS6/9OmMIUfgypJL4KZW5kc3RyZWFtCmVuZG9iago0IDAgb2JqCiAgIDEzOAplbmRvYmoKMiAwIG9iago8PAogICAvRXh0R1N0YXRlIDw8CiAgICAgIC9hMCA8PCAvQ0EgMC42MTE5ODcgL2NhIDAuNjExOTg3ID4+CiAgICAgIC9hMSA8PCAvQ0EgMSAvY2EgMSA+PgogICA+Pgo+PgplbmRvYmoKNSAwIG9iago8PCAvVHlwZSAvUGFnZQogICAvUGFyZW50IDEgMCBSCiAgIC9NZWRpYUJveCBbIDAgMCA1OTUuMjc1NTc0IDg0MS44ODk3NzEgXQogICAvQ29udGVudHMgMyAwIFIKICAgL0dyb3VwIDw8CiAgICAgIC9UeXBlIC9Hcm91cAogICAgICAvUyAvVHJhbnNwYXJlbmN5CiAgICAgIC9DUyAvRGV2aWNlUkdCCiAgID4+CiAgIC9SZXNvdXJjZXMgMiAwIFIKPj4KZW5kb2JqCjEgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzCiAgIC9LaWRzIFsgNSAwIFIgXQogICAvQ291bnQgMQo+PgplbmRvYmoKNiAwIG9iago8PCAvQ3JlYXRvciAoY2Fpcm8gMS4xMS4yIChodHRwOi8vY2Fpcm9ncmFwaGljcy5vcmcpKQogICAvUHJvZHVjZXIgKGNhaXJvIDEuMTEuMiAoaHR0cDovL2NhaXJvZ3JhcGhpY3Mub3JnKSkKPj4KZW5kb2JqCjcgMCBvYmoKPDwgL1R5cGUgL0NhdGFsb2cKICAgL1BhZ2VzIDEgMCBSCj4+CmVuZG9iagp4cmVmCjAgOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDA1ODAgMDAwMDAgbiAKMDAwMDAwMDI1MiAwMDAwMCBuIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAyMzAgMDAwMDAgbiAKMDAwMDAwMDM2NiAwMDAwMCBuIAowMDAwMDAwNjQ1IDAwMDAwIG4gCjAwMDAwMDA3NzIgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA4CiAgIC9Sb290IDcgMCBSCiAgIC9JbmZvIDYgMCBSCj4+CnN0YXJ0eHJlZgo4MjQKJSVFT0YK',*/
        ],
        src: this.pdfSrc,
        loadedRatio: 0,
        page: 1,
        myPage: 1,
        numPages: 0,
        rotate: 0,
        outTime: null,
      }
    },
    created() {
      if (typeof this.pdfSrc == "undefined") {
        this.pdfSrc = ""
      } else {
        this.show = true;
      }

    },
    watch: {
      myPage(val) {
        if (val && !isNaN(val)) {
          if (val > 0 && val <= this.numPages) {
            if (/^\d+$/.test(val)) {
              if (this.outTime !== null) {
                clearTimeout(this.outTime);
              }
              this.outTime = setTimeout(() => {
                this.page = this.myPage;
              }, 500)
            } else {
              this.showMess("请输入整数")
            }
          } else {
            this.showMess("输入的数不能大于页面数");
          }
        } else {
          (val != 0) && this.showMess("请输入数字进行翻页")
        }
      }
    },
    methods: {
      password: function (updatePassword, reason) {

        updatePassword(prompt('password is "test"'));
      },
      error: function (err) {

        //console.log(err);
      },
      gotoPage(type) {
        if (type == "up") {
          if (this.myPage == 1) {
            return;
          }
          if (this.myPage > 1) {
            --this.myPage;
          }
        } else {
          if (this.myPage == this.numPages) {
            return;
          }
          if (this.myPage < 14) {
            ++this.myPage;
          }
        }
      }
    }
  }

</script>
