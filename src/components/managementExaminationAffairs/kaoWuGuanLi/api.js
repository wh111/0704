let api = {
  // 公共部分
  teachingclassification: { // 请求教学分类下拉框选项
    path: '/dictionary/getByCode/',
    method: 'get'
  },
  classname: { // 本科教育时,请求课程名称
    path: '/schoolOutline/list',
    method: 'get'
  },
  getExameInfo: { // 请求试卷下拉框选项
    path: '/examination/llKspj/getExameInfo',
    method: 'get'
  },


  // 理论考试命题部分
  listLlKsmt: { // 理论考试命题列表
    path: '/examination/llKsmt/listPage',
    method: 'get'
  },
  llksmtedit: { // 编辑数据回显
    path: '/examination/llKsmt/get/',
    method: 'get'
  },
  editsave: { // 编辑保存考试命题
    path: '/examination/llKsmt/modify/',
    method: 'put'
  },
  addsaveTitle: { // 新增保存考试命题
    path: '/examination/llKsmt/add',
    method: 'post'
  },
  llksmtdelete: '/examination/llKsmt/remove/', // 考试命题删除



  // 理论考试组卷部分
  listllkszj: { // 理论考试组卷列表
    path: '/examination/llKszj/pageList',
    method: 'get'
  },
  llkszjedit: { // 编辑数据回显
    path: '/examination/llKszj/get/',
    method: 'get'
  },
    kszjeditsave: { // 考试组卷编辑保存
    path: '/examination/llKszj/modify/',
    method: 'put'
  },
  kszjaddsaveTitle: { // 考试组卷新增保存
    path: '/examination/llKszj/add',
    method: 'post'
  },
  llkszjdelete: '/examination/llKszj/remove/', // 考试命题删除

  // 理论考试判卷部分
  listllkspj: { // 理论考试判卷列表
    path: '/examination/llKspj/pageList',
    method: 'get'
  },
  llKspjAdd: { // 理论考试判卷新增
    path: '/examination/llKspj/add',
    method: 'post'
  },
  llKspjedit: { // 编辑理论考试判卷
    path: '/examination/llKspj/get/',
    method: 'get'
  },
  editllKspj: { // 编辑理论考试判卷提交
    path: '/examination/llKspj/modify/',
    method: 'put'
  },
  llKspjdelete: '/examination/llKspj/remove/', // 理论考试判卷删除

  // 理论考试监考部分
  listllKsjk: { // 理论考试监考列表
    path: '/examination/llKsjk/pageList',
    method: 'get'
  },
  llKsjkAdd: { // 理论考试监考新增
    path: 'examination/llKsjk/add',
    method: 'post'
  },
  editllKsjk: { // 编辑理论考试监考提交
    path: '/examination/llKsjk/modify/',
    method: 'put'
  },
  llKsjkedit: { // 编辑理论考试监考
    path: '/examination/llKsjk/get/',
    method: 'get'
  },
  llKsjkdelete: '/examination/llKsjk/remove/',// 理论考试监考删除

  // 理论考试试卷分析
  listllKssjfx: { // 理论考试试卷分析列表
    path: '/examination/llKssjfx/listPage',
    method: 'get'
  },
  llKssjfxAdd: { // 理论考试试卷分析新增
    path: '/examination/llKssjfx/add',
    method: 'post'
  },
  llKssjfxedit: { // 编辑理论考试试卷分析
    path: '/examination/llKssjfx/get/',
    method: 'get'
  },
  editllKssjfx: { // 编辑理论考试试卷分析提交
    path: '/examination/llKssjfx/modify/',
    method: 'put'
  },
  llKssjfxdelete: '/examination/llKssjfx/remove/', // 理论考试试卷分析删除

  // 理论考试讲评
  listllKsjp: { // 理论考试讲评列表
    path: '/examination/llKsjp/listPage',
    method: 'get'
  },
  llKsjpAdd: { // 理论考试讲评新增
    path: '/examination/llKsjp/add',
    method: 'post'
  },
  llKsjpedit: { // 编辑理论考试讲评
    path: '/examination/llKsjp/get/',
    method: 'get'
  },
  editllKsjp: { // 编辑理论考试讲评提交
    path: '/examination/llKsjp/modify/',
    method: 'put'
  },
  llKsjpdelete: '/examination/llKsjp/remove/', // 理论考试讲评删除

  // 技能考核命题
  listjnKhmt: { // 技能考核命题列表
    path: '/examination/jnKhmt/listPage',
    method: 'get'
  },
  jnKhmtAdd: { // 技能考核命题新增
    path: '/examination/jnKhmt/add',
    method: 'post'
  },
  jnKhmtedit: { // 编辑理论考试讲评
    path: '/examination/jnKhmt/get/',
    method: 'get'
  },
  editjnKhmt: { // 编辑技能考核命题提交
    path: '/examination/jnKhmt/modify/',
    method: 'put'
  },
  jnKhmtdelete: '/examination/jnKhmt/remove/', // 技能考核命题删除

// 技能考核监考
  listjnKhjk: { // 技能考核监考列表
    path: '/examination/jnKhjk/listPage',
    method: 'get'
  },
  jnKhjkAdd: { // 技能考核监考新增
    path: '/examination/jnKhjk/add',
    method: 'post'
  },
  jnKhjkedit: { // 编辑技能考核监考
    path: '/examination/jnKhjk/get/',
    method: 'get'
  },
  editjnKhjk: { // 编辑技能考核监考提交
    path: '/examination/jnKhjk/modify/',
    method: 'put'
  },
  jnKhjkdelete: '/examination/jnKhjk/remove/', // 技能考核监考删除

// 技能考核讲评
  listjnKhjp: { // 技能考核讲评列表
    path: '/examination/jnKhjp/listPage',
    method: 'get'
  },
  jnKhjpAdd: { // 技能考核监考新增
    path: '/examination/jnKhjp/add',
    method: 'post'
  },
  jnKhjpedit: { // 编辑技能考核监考
    path: '/examination/jnKhjp/get/',
    method: 'get'
  },
  editjnKhjp: { // 编辑技能考核监考提交
    path: '/examination/jnKhjp/modify/',
    method: 'put'
  },
  jnKhjpdelete: '/examination/jnKhjp/remove/' // 技能考核讲评删除
};



export default api;
