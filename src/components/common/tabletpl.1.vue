
<template>
<div id="content" ref="content">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Row>
            <Col span="6">
                <Form-item label="姓名" prop="name">
                    <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
                </Form-item>
            </Col>
            <Col span="6">
                <Form-item label="学校" prop="school">
                    <Input v-model="formValidate.school" placeholder="请输入学校"></Input>
                </Form-item>
            </Col>
            <Col span="6">
                <Form-item label="状态" prop="school">
                    <Select v-model="formValidate.status" placeholder="请选择状态">
                        <Option value="beijing">已通过</Option>
                        <Option value="shanghai">未通过</Option>
                        <Option value="shenzhen">已审核</Option>
                    </Select>
                </Form-item>
            </Col>
            <Col span="3" style="margin-left: 10px">
                    <Button type="primary" @click="handleSubmit('formValidate')">查 询</Button>
            </Col> 
        </Row>
    </Form>
    <Row>
        <Col span="24">
            <Button type="primary" @click="addData('formValidate')">新 建</Button>
            <Button type="primary" @click="addData('formValidate')">修 改</Button>
            <Button type="error" @click="addData('formValidate')">删 除</Button>
        </Col>
    </Row>
    <br />
    <div>
    <Table 
        v-bind:height="dynamicHt" 
        :context="self" 
        :data="tableData1" 
        :columns="tableColumns1"
        @on-selection-change="handleSelectionChange"
        stripe></Table>
    <div style="margin: 10px;">
        <div style="float: right;">
            <!--<Page 
            :total="myPages.listTotal" 
            :current="myPages.currentPage" 
            :page-size="myPages.pageSize" 
            :page-size-opts="myPages.pageSizes" 
            @on-change="changePage" 
            @on-page-size-change="changePageSize"
            show-total show-elevator show-sizer></Page>-->
            
            <el-pagination
            @size-change="changePageSize"
            @current-change="changePage"
            :current-page="myPages.currentPage"
            :page-sizes="myPages.pageSizes"
            :page-size="myPages.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="myPages.listTotal">
            </el-pagination>

        </div>
     </div>   
    </div>
    <Modal
        height="200"
        v-model="addmodal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading">
        <Add :successed="addSuccess"></Add>
        <div slot="footer"></div>
    </Modal>
</div>    
</template>
<script>
    import util from "../../libs/util";    
    import addPage from './add';
    
    const pageInitPrams =  util.pageInitPrams;
    const queryData = util.queryData;
    const listUrl = "/base/reward/list";
    const queryQptions = {
        url:listUrl,
        params:{curPage: 1,pageSize: pageInitPrams.pageSize}
    }; 

    export default {
        data () {
            return {
                addmodal: false,
                loading:true,
                myPages:pageInitPrams,
                multipleSelection: [],
                dynamicHt:100,
                ruleValidate: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    school: [
                        { required: true, message: '学校不能为空', trigger: 'blur' }
                    ]
                }, 
                formValidate: {
                    name: '',
                    school: '',
                    status: ''
                },
                self: this,
                tableData1: [],
                tableColumns1: [
                    {
                        type: 'selection',
                        width: 60,
                        key: 'id',
                        align: 'center'
                    },
                    {
                        title: 'id',
                        key: 'id',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        width: 150,
                        align: 'center',
                        render (row, column, index) {
                            return `<i-button type="primary" size="small" @click="show(${index})">查看</i-button> <i-button type="error" size="small" @click="remove(${index})">删除</i-button>`;
                        }
                    },
                    {
                        title: '姓名',
                        key: 'userName'
                    },
                    {
                        title: '科室',
                        key: 'deptName'
                    },
                    {
                        title: '奖惩类型',
                        key: 'rewardType'
                    },
                    {
                        title: '发生时间',
                        key: 'rewardDate'
                    },
                    {
                        title: '状态',
                        key: 'time',
                        render () {
                            return "通过"
                        }
                    }
                ]
            }
        },
        components:{
            "Add":addPage
        },
        mounted(){
            let content = this.$refs.content;
            let parHt = content.parentNode.offsetHeight;
            let myTable = this.$refs.myTable;
            this.dynamicHt = parHt - 170;
        },
        created(){
            this.setTableData();
        },
        methods: {
            handleSelectionChange(val) {
                alert(val)
                this.multipleSelection = val;
            },
            setTableData(){
                let that = this;
                let response = queryData(queryQptions);
                //处理服务数据
                response.then(function (res) {
                    let responseData = res.data;
                    if(_.isObject(responseData["status"])&&responseData["status"]["code"]==0){
                        that.tableData1 = responseData.data;
                        that.myPages.listTotal = responseData.totalCount;       
                    }
                })
                .catch(function (err) {
                    //捕获错误异常
                    console.log("err", err);
                });
            },
            
            changePageSize (n){
                queryQptions.params.pageSize = n;
                this.setTableData();
            },
            changePage (n) {
                // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
                queryQptions.params.curPage = n;
                this.setTableData();
            },
            handleSubmit(name){
                //查询
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('提交成功!');
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            addSuccess(valid){
                if (valid) {
                    this.$Message.success('提交成功!');
                    
                } else {
                    this.$Message.error('表单验证失败!');
                }
            },
            addData(){
                this.addmodal=true;
            }
        }
    }
</script>
