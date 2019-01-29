// pdf内容
let docDefinition = {
  content: [],
  // 样式
  styles: {},
  // 默认样式
  defaultStyle: {}
};

// 生成pdf内容
function builderDocDefinition (info, call) {
  docDefinition.content[0] = info.text;
  //   // width: 520,
  //   // height: 760,
  // };
  call && call();
}

// 打印pdf
function printPDF (info) {
  builderDocDefinition(info, function () {
    // let subOutputRankPrint = document.getElementById('box');
    // console.log(subOutputRankPrint.innerHTML);
    // let newContent =subOutputRankPrint.innerHTML;
    // let oldContent = document.body.innerHTML;
    // document.body.innerHTML = newContent;
    // window.print();
    // window.location.reload();
    // document.body.innerHTML = oldContent;
    // return false;
    pdfMake.createPdf(docDefinition).print();

  });
}
// 下载pdf
function downPDF (info) {
  builderDocDefinition(info, function () {
    pdfMake.createPdf(docDefinition).download(info.studentName + '-进修须知.pdf');
  });
}

export {
  printPDF, downPDF
};
