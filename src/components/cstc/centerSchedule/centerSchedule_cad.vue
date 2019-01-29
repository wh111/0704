<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div class="cRoomCadBox">
    <ul class="cRoomCadFloorBox">
      <li class="crcfItem" v-for="index in 4" :key="index" :class="{'active':floorIndex==index}"
          @click="selectFloor(index)">
        F{{ index }}
      </li>
    </ul>
    <img id="cadImage" :src="floorImg" alt="Picture">
  </div>
</template>
<style lang="scss">
  .cRoomCadBox {
    height: 100%;
    width: 100%;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .cRoomCadFloorBox {
    position: absolute;
    top: 50%;
    left: 0;
    width: 60px;
    margin-top: -120px;
    background-color: rgba(0, 0, 0, .2);
    z-index: 1;
    .crcfItem {
      text-align: center;
      height: 60px;
      line-height: 60px;
      color: #fff;
      cursor: pointer;
      &:not(.active):hover {
        background: rgba(0, 0, 0, .3);
      }
      &.active {
        background: rgba(0, 0, 0, .5);
      }
    }
  }
</style>
<script>
  /*当前组件必要引入*/
  import floorInfo from './floorInfo';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['floorData', 'dataNum'],
    data() {
      return {
        floorIndex: '',
        floorImg: '',
        cadView: null,
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.selectFloor(1);
      },
      // 获取图片
      getImg(url) {
        let img = new Image();
        img.src = url;
        let p = new Promise((resolve, reject) => {
          img.onload = () => {
            resolve(img)
          };
          img.onerror = () => {
            reject()
          }
        });
        return p
      },
      /**
       * 获取图片的base64
       * * @param img
       * @returns {string}
       */
      getBase64(img) {
        let canvas = document.createElement("canvas"); //创建canvas元素
        let {width, height} = img;
        canvas.width = width;
        canvas.height = height;
        let context = canvas.getContext("2d");
        let fontSize = 30; // 字体大小
        let bgColor = {
          PRACTISE: 'rgba(56, 197, 125, 0.7)', // 练习
          EXAM: 'rgba(232, 53, 72, 0.7)', // 考核
          OTHER: 'rgba(142, 142, 142, 0.7)', // 其他
          default: 'rgba(142, 142, 142, 0.7)',
        };

        context.drawImage(img, 0, 0, width, height); //将图片绘制到canvas中
        context.save();

        context.lineWidth = 2; // 矩形边框宽度
        context.strokeStyle = "#F9230B"; // 矩形边框颜色
        context.font = `bold ${fontSize}px Arial`; //字体样式

        (floorInfo['f' + this.floorIndex] && floorInfo['f' + this.floorIndex] || []).map(item => {
          let type = '';
          if (this.floorData['f' + this.floorIndex]) {
            type = this.floorData['f' + this.floorIndex][item.text];
          }
          type = type ? type : 'default';
          // 矩形
          this.createRoundRect(context, item.x, item.y, item.width, item.height, 20, bgColor[type], item.text, fontSize, item.angle);
        });

        return canvas.toDataURL('image/jpeg'); //转换图片为dataURL
      },

      /**
       * 绘制矩形
       * @param context canvas对象
       * @param x1 横坐标
       * @param y1 纵坐标
       * @param width 宽度
       * @param height 高度
       * @param radius 圆角
       * @param bgColor 背景颜色
       * @param text 显示文本
       * @param fontSize 字体大小
       * @param angle 顺时针旋转角度
       */
      createRoundRect(context, x1, y1, width, height, radius, bgColor, text, fontSize, angle) {
        context.save();
        // 旋转角度
        context.translate(x1, y1);
        context.rotate(angle);
        // 记录原点坐标
        context.translate(-x1, -y1);
        // 开始路径绘制
        context.beginPath();
        // 添加背景填充色
        context.fillStyle = bgColor;
        // 移动到左上角
        context.moveTo(x1 + radius, y1);
        // 添加一条连接到右上角的线段
        context.lineTo(x1 + width - radius, y1);
        // 添加一段圆弧
        context.arcTo(x1 + width, y1, x1 + width, y1 + radius, radius);
        // 添加一条连接到右下角的线段
        context.lineTo(x1 + width, y1 + height - radius);
        // 添加一段圆弧
        context.arcTo(x1 + width, y1 + height, x1 + width - radius, y1 + height, radius);
        // 添加一条连接到左下角的线段
        context.lineTo(x1 + radius, y1 + height);
        // 添加一段圆弧
        context.arcTo(x1, y1 + height, x1, y1 + height - radius, radius);
        // 添加一条连接到左上角的线段
        context.lineTo(x1, y1 + radius);
        // 添加一段圆弧
        context.arcTo(x1, y1, x1 + radius, y1, radius);
        // 关闭路径绘制
        context.closePath();
        // 填充
        context.fill();
        // 绘制
        context.stroke();
        // 添加文字
        context.textAlign = "center";
        context.fillStyle = "#F80707"; // 字体颜色
        context.fillText(text, x1 + width / 2, (y1 + height / 2) + fontSize / 2);
        // 绘制
        context.stroke();
        // 返回当前环境
        context.restore();
      },

      // 选中楼层
      selectFloor(floor, reload) {
        if (this.floorIndex === floor) {
          if (!reload) {
            return
          }
        }
        this.floorIndex = floor;

        // 绘图
        let floorCadImg = '/static/image/hospital/F' + floor + '.png';
        this.getImg(floorCadImg).then((img) => {
          this.floorImg = this.getBase64(img);
          if (this.cadView) {
            document.getElementById('cadImage').onload = () => {
              this.cadView.update()
            }
          } else {
            this.initCADImg()
          }
        }).catch(() => console.log('请求失败'))
      },
      // 初始化cad图片
      initCADImg() {
        this.$nextTick(() => {
          let options = {
            inline: true,
            navbar: false,
            title: false,
            toolbar: false,
          };
          document.getElementById('cadImage').onload = () => {
            this.cadView = new Viewer(document.getElementById('cadImage'), options);
          }
        })
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    beforeDestroy() {
      this.cadView = null;
    },
    components: {},
    watch: {
      dataNum(val) {
        this.selectFloor(1, true);
      }
    }
  }

</script>
