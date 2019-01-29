// 证书配置数据
const diploma = {
  title: {
    text: "结业证书",
    style: {
      x: 0,
      y: 74,
      width: 978,
      height: 54,
      fontSize: 50,
      lineHeight: 1,
      letterSpacing: 74,
      fontFamily: "微软雅黑",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: 'center',
      color: 'rgba(0, 0, 0, 1)',
    }
  },
  photoBox: {
    text: null,
    style: {
      x: 105,
      y: 204,
      width: 126,
      height: 184,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: 'rgba(0, 0, 0, 1)',
    }
  },
  photoInfo: {
    text: "二寸正面免冠照片",
    style: {
      fontSize: 16,
      lineHeight: 1.25,
      letterSpacing: 0,
      fontFamily: "微软雅黑",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: 'center',
      color: 'rgba(0, 0, 0, 1)',
    }
  },
  photoStamp: {
    text: "发证单位钢印",
    style: {
      fontSize: 18,
      lineHeight: 1.55,
      letterSpacing: 0,
      fontFamily: "微软雅黑",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: 'center',
      color: 'rgba(0, 0, 0, 1)',
    }
  },
  content: {
    text: "{userName}同志于{startYear}年{startMonth}月至{endYear}年{endMonth}月在我院{subject}科（室）进修学习，进修期满，经考核成绩合格，准予毕业。",
    placeStr: { // 占位键值
      userName: {
        text: "张明", // 默认显示文字
        key: "name", // 接口对应的字段
        title: "学生姓名", // 描述文本
        modelName: "userName", // 样式模块名称
      },
      subject: {
        text: "放射科",
        key: "subject",
        title: "所修科室名称",
        modelName: "infoSubject",
      },
      startYear: {
        text: "2014",
        key: "startYear",
        title: "入学年份",
        modelName: "infoStartData",
      },
      startMonth: {
        text: "9",
        key: "startMonth",
        title: "入学月份",
        modelName: "infoStartData",
      },
      endYear: {
        text: "2017",
        key: "endYear",
        title: "结业年份",
        modelName: "infoEndData",
      },
      endMonth: {
        text: "6",
        key: "endMonth",
        title: "结业月份",
        modelName: "infoEndData",
      },
    },
    style: {
      x: 500,
      y: 204,
      width: 400,
      height: 184,
      fontSize: 20,
      lineHeight: 2.4,
      letterSpacing: 0,
      fontFamily: "微软雅黑",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: 'left',
      color: 'rgba(0, 0, 0, 1)',
    },
  },
  eduInfo: {
    text: "（{eduName}）教证字第{eduNumber}号",
    placeStr: { // 占位键值
      eduName: {
        text: "", // 默认显示文字
        key: "eduName", // 接口对应的字段
        title: "教学名称", // 描述文本
        modelName: "eduName", // 样式模块名称
      },
      eduNumber: {
        text: "00000000",
        key: "eduNumber",
        title: "证书编号",
        modelName: "eduNumber",
      },
    },
    style: {
      x: 34,
      y: 480,
      width: 390,
      height: 40,
      fontSize: 20,
      lineHeight: 2,
      letterSpacing: 0,
      fontFamily: "微软雅黑",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: 'left',
      color: 'rgba(0, 0, 0, 1)',
    }
  },
  validity:{
    text: "（未经医院验证无效）",
    style: {
      x: 24,
      y: 530,
      width: 360,
      height: 40,
      fontSize: 20,
      lineHeight: 2,
      letterSpacing: 0,
      fontFamily: "微软雅黑",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: 'center',
      color: 'rgba(0, 0, 0, 1)',
    }
  },
  edu:{
    text: "教育处",
    style: {
      x: 580,
      y: 480,
      width: 340,
      height: 40,
      fontSize: 26,
      lineHeight: 1.5,
      letterSpacing: 0,
      fontFamily: "微软雅黑",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: 'center',
      color: 'rgba(0, 0, 0, 1)',
    }
  },
  printDate:{
    text: "{year}年{month}月{day}日",
    placeStr: { // 占位键值
      year: {
        text: new Date().getFullYear(), // 默认显示文字
        key: "year", // 接口对应的字段
        title: "年", // 描述文本
        modelName: "printDate", // 样式模块名称
      },
      month: {
        text: new Date().getMonth() + 1,
        key: "month",
        title: "月",
        modelName: "printDate",
      },
      day: {
        text: new Date().getDate(),
        key: "day",
        title: "日",
        modelName: "printDate",
      },
    },
    style: {
      x: 550,
      y: 520,
      width: 390,
      height: 40,
      fontSize: 20,
      lineHeight: 2,
      letterSpacing: 0,
      fontFamily: "微软雅黑",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: 'center',
      color: 'rgba(0, 0, 0, 1)',
    }
  },
  config:{
    text: null,
    style: {
      backgroundColor:'rgba(0, 0, 0, 0)',
      backgroundImage:'',
    }
  },
};

// 证书切换样式
const toggleStyle = {
  fontWeight: {
    def: 'normal',
    val: 'bold',
  },
  fontStyle: {
    def: 'normal',
    val: 'italic',
  },
  textDecoration: {
    def: 'none',
    val: 'underline',
  },
};

// 证书支持的字体
const fontFamilyOptions = ['微软雅黑', '黑体', '宋体'];

// 证书边框样式
const borderStyleOptions = [{name: '实线', val: 'solid'}, {name: '虚线', val: 'dashed'}, {name: '点线', val: 'dotted'}];

// 标签代码符号配置
const tagConfig = {start: "{", end: "}"};

export {diploma, toggleStyle, fontFamilyOptions, borderStyleOptions, tagConfig};
