<!----------------------------------
****--@name     进度监控页面
****--@role     ${*}
****--@date     2018/7/10
****--@author   gx
----------------------------------->
<template>
  <canvas id="canvas" width="1000" :height="canvasHeight">
    你的浏览器还不支持canvas
  </canvas>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../api.js';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['weekSetId'],
    data () {
      return {
        getData: {},
        canvasHeight: 100,

        verticalLineHeight: 20,//竖线的高度，在原基础上增加的高度
        tailLine: 30,  //在原基础上所减去的尾线的高度
        x: [0, 180, 360, 540, 720],
        width: 50,//相差宽度
        height: 50,//起始高度
        HeightDifference: 70,//高度差
        widthDifference: 180,//宽度差
        success: '#13CE66',
        Danger: '#FF4949',
      }

    },
    methods: {
      //初始化请求列表数据
      init () {
        this.getProgressMonitoring()
      },
      getProgressMonitoring () {//获取请求的数据
        let getMainTitle = {
          ajaxSuccess: (res) => {
            let data = res.data;
            this.getData = data;
            this.creatHeight(data)
          },
          ajaxParams: {
            url: api.getWeekState.path + this.weekSetId,
          }
        }
        this.ajax(getMainTitle)
      },

      creatHeight (data) {//获取高度
        let HeightDifference = this.HeightDifference
        let canvasHeight = this.canvasHeight;
        let count = 0;
        for (let i = 0; i < data.child.length; i++) {
          let item = data.child[i];
          if (!item.child) {
            this.errorMess('数据有误，请检查数据');
            data.child.splice(i, 1);
            i--
            continue;
          }
          let length = item.child.length;
          count += length;
          canvasHeight += HeightDifference * length;
        }
        this.canvasHeight = canvasHeight;
        this.$nextTick(() => {
          this.buildChart(data, count)//解析数据画图
        })
      },

      buildChart (data, thirdCount) {
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        let x = this.x;
        let width = this.width;
        let height = this.height;//起始高度
        let success = this.success;
        let Danger = this.Danger;

        let HeightDifference = this.HeightDifference
        let canvasHeight = this.canvasHeight;

        let arr = [];
        let count = 0
        let secondCompare = data.child.length % 2 == 0 ? 35 : 0;//对比，如果是偶数，则在中间
        let secondposition = parseInt(data.child.length / 2)//二级的位置
        let secondFirst = 0
        let secondLast = 0
        let secondPostionArr = []
        data.child.map((item, i) => {
          if (!item.child) return
          let length = item.child.length;
          canvasHeight += HeightDifference * length;
          let compare = length % 2 == 0 ? 35 : 0;//对比，如果是偶数，则在中间
          console.log('compare', length % 2);
          let position = parseInt(length / 2)//二级的位置
          console.log('position', position);
          let secondMethod = ''
          let flag = ''
          if (data.child.length == 1 || secondCompare == 0 && data.child.length / 2 - i > 0 && 1 > data.child.length / 2 - i) {
            secondMethod = 'thirdMid';
          } else if (data.child.length / 2 - i > 0) {
            flag = '';
          } else {
            flag = true;
          }
          console.log(flag);
          //保存二级科室的位置
          secondPostionArr[i] = {
            x: x[1],
            y: height + (count + position) * HeightDifference - compare, ctx, w: width,
            child: [],
          }
          this[secondMethod || 'second']({
            x: x[1], y: height + (count + position) * HeightDifference - compare, ctx, w: width,
            color: [2, 3, 5].includes(item.state) ? success : Danger,
            text: item.depName,
            process: '安排课程',
          }, i + 1 === data.child.length ? secondPostionArr[i].y - secondPostionArr[0].y - 20 : -20, flag)
          console.log(secondPostionArr);
          console.log(i, data.child.length === 1 ? -20 : i + 1 === data.child.length ? secondPostionArr[i].y - secondPostionArr[0].y - 20 : parseInt(length / 2) * HeightDifference, flag);
          secondMethod = data.child.length == 1 ? 'thirdMid' : 'fourth'
          /*this[secondMethod || 'fourth']({
            x: x[3], y: height + (count + position) * HeightDifference - compare, ctx, w: width,
            color: [3, 5].includes(item.state) ? success : Danger,
            text: item.depName,
            process: '课程审核',
          }, parseInt(length / 2) * HeightDifference, flag)*/
          if (i == 0) {
            secondFirst = (count + position) * HeightDifference - compare;
          }
          secondLast = (count + position) * HeightDifference - compare;
          item.child.map((obj, index) => {
            /*arr.push({
              depName: item.depName,
              text: '安排课程',
              depth: 3,
              x: x[2],
              y: height + count * HeightDifference,
              color: [3, 5].includes(obj.state) ? success : Danger,
            })*/
//            compare>0
            let methodName = ''
            if (length == 1 || compare == 0 && length / 2 - index > 0 && 1 > length / 2 - index) {
              methodName = 'thirdMid';
            } else if (length / 2 - index > 0) {
              methodName = 'thirdTop';
            } else {
              methodName = 'thirdBottom';
            }
//            let methodName=?"thirdMid":index==0&&index!=length?'thirdTop':''
            //第三级
            this[methodName]({
              x: x[2],
              y: height + count * HeightDifference,
              ctx,
              w: width,
              color: [2, 3, 5].includes(obj.state) ? success : Danger,
              text: obj.depName,
              process: '安排课程',
            })
            //第四级
            this.fourth({
              x: x[3],
              y: height + count * HeightDifference,
              ctx,
              w: width,
              color: [3, 5].includes(obj.state) ? success : Danger,
              text: item.depName,
              process: '课程审核',
            }, thirdCount === 1 ? -20 : HeightDifference - this.verticalLineHeight, thirdCount - 1 === count)
            count++

            secondPostionArr[i].child.push({
              x: x[1],
              y: height + count * HeightDifference,
            })
          })
        })
        this.first({
          x: x[0],
          y: height + secondFirst + (secondLast - secondFirst) / 2,
          ctx,
          w: width,
          color: success,
          text: '教育处',
          process: '发放周历',
        })
        this.Fifth({
          x: x[4],
          y: height + secondFirst + (secondLast - secondFirst) / 2,
          ctx,
          w: width,
          color: [3, 5].includes(data.state) ? success : Danger,
          text: '教育处',
          process: '课程审核',
        })

        console.log(canvasHeight);
//        this.canvasHeight = canvasHeight;

//        //页面dom稳定后调用
//        this.$nextTick(() => {
//          let canvas = document.getElementById('canvas');
//          let ctx = canvas.getContext('2d');
//
//          this.first({
//            x: x[0], y: 120, ctx, w: width
//          })
//          this.second({
//            x: x[1], y: 120, ctx, w: width
//          }, 140)
//          this.second({
//            x: x[1], y: 290, ctx, w: width
//          }, 140, true)
//          //高度相差70 宽度相差 180
//          this.thirdTop({
//            x: x[2], y: 50, ctx, w: width
//          })
////        this.straightSlantLine(50,50,ctx,50)
////        this.straightLine(50,120,ctx,50)
//          this.thirdMid({
//            x: x[2], y: 120, ctx, w: width
//          })
//          this.thirdBottom({
//            x: x[2], y: 190, ctx, w: width
//          })
//
//          this.thirdMid({
//            x: x[2], y: 290, ctx, w: width
//          })
//
//          this.fourth({
//            x: x[3], y: 120, ctx, w: width
//          }, 140)
//
//          this.fourth({
//            x: x[3], y: 290, ctx, w: width
//          }, 140, true)
//
//          this.Fifth({
//            x: x[4], y: 120, ctx, w: width
//          })
//        })

      },

      //第一级
      first ({x, y, ctx, w, color, text, process}) {
        this.square(x + w + 10, y - 25, 100, 50, ctx, color, text, process);
        this.transverseLine(x + 160, y, ctx, w - this.tailLine);
      },
      //第五级
      Fifth ({x, y, ctx, w, color, text, process}) {
        this.straightLine(x, y, ctx, w, color, text, process)
//        this.transverseLine(x + 160, y, ctx, w - this.tailLine);
      },
      //第二级上部或者下
      second ({x, y, ctx, w, color, text, process}, height, direction) {
        height = height + this.verticalLineHeight
        console.log(height);
        this.verticalLine(x, y, direction ? -height : height, ctx)
        this.straightLine(x, y, ctx, w, color, text, process)
        this.transverseLine(x + 160, y, ctx, w - this.tailLine);
      },

      //第三级上部
      thirdTop ({x, y, ctx, w, color, text, process}) {
        this.straightSlantLine(x, y, ctx, w, color, text, process);
        this.transverseLine(x + 160, y, ctx, w - this.tailLine);
//        this.verticalLine(x + 160 + w - this.tailLine, y, w + this.verticalLineHeight, ctx)
      },
      //第三级中部
      thirdMid ({x, y, ctx, w, color, text, process}) {
        this.straightLine(x, y, ctx, w, color, text, process)
        this.transverseLine(x + 160, y, ctx, w - this.tailLine);
      },

      //第三级底部
      thirdBottom ({x, y, ctx, w, color, text, process}) {
        this.verticalLine(x, y, -w - this.verticalLineHeight, ctx)
        this.straightLine(x, y, ctx, w, color, text, process)
        this.transverseLine(x + 160, y, ctx, w - this.tailLine);
//        this.verticalLine(x + 160 + w - this.tailLine, y, -w - this.verticalLineHeight, ctx)
      },

      //第四级上部或者下
      fourth ({x, y, ctx, w, color, text, process}, height, direction) {
        this.straightLine(x, y, ctx, w, color, text, process)
        this.transverseLine(x + 160, y, ctx, w - this.tailLine);
        height = this.verticalLineHeight + height
        this.verticalLine(x + 160 + w - this.tailLine, y, direction ? -height : height, ctx)
      },

      /*  //第四级下部
        fourthBottom ({x, y, ctx, w},height) {
          this.straightLine(x, y, ctx, w)
          this.transverseLine(x + 160, y, ctx, w - this.tailLine);
          this.verticalLine(x + 160+w - this.tailLine, y, -w-this.verticalLineHeight-height, ctx)
        },*/

      //一个 70px

      //带斜线三角形的直线
      straightSlantLine (x, y, ctx, w = 40, color, text, process) {

        this.verticalLine(x, y, w + this.verticalLineHeight, ctx)
        this.transverseLine(x, y, ctx, w)
        this.triangle(x + w, y, ctx);
        this.square(x + w + 10, y - 25, 100, 50, ctx, color, text, process);
      },

      //直线方块
      straightLine (x, y, ctx, w = 40, color, text, process) {
        this.transverseLine(x, y, ctx, w)
        this.triangle(x + w, y, ctx);
        this.square(x + w + 10, y - 25, 100, 50, ctx, color, text, process);
      },

      //横线
      transverseLine (x, y, ctx, w,) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        //  设置样式
        ctx.lineWidth = 1;
        //  绘制
        ctx.stroke();

      },

      //竖线
      verticalLine (x, y, w, ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + w);
        //  设置样式
        ctx.lineWidth = 1;
        //  绘制
        ctx.stroke();

      },
      triangle (x, y, ctx) {
        ctx.beginPath();
        // 绘图的基点
        ctx.moveTo(x, y - 5);
        //绘制从前一次到这个点的直线
        ctx.lineTo(x, y + 5);
        ctx.lineTo(x + 10, y);
        //结束绘制
        //    ctx.closePath();
        // 进行绘图处理
        ctx.fillStyle = '#000';
        // 填充路径
        ctx.fill();
        //结束绘制
        //    ctx.closePath();
      },

      //正方形
      square (x, y, w, h, ctx, collor, text, process) {
        ctx.beginPath();
        ctx.fillStyle = collor || '#FF0000';
        ctx.fillRect(x, y, w, h);
        ctx.font = '14px';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center'
        ctx.fillText(text || '', x + 50, y + 20)
        ctx.fillText(process || '', x + 50, y + 40)
        ctx.beginPath();
      },

    },
    created () {
      this.init();

    },
    mounted () {

    },
    components: {}
  }
</script>
