<template>
    <div class="view-container" ref="tableComView">
        <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
            <el-form :inline="true" size="small">
                <el-form-item label="体系">
                    <el-select class="w240" v-model="searchSystemTag">
                        <el-option v-for="item in systemOpt" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设置时间">
                    <el-date-picker
                    size="small"
                    v-model="createTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="最新修改时间">
                    <el-date-picker
                    size="small"
                    v-model="updateTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </ScreeningTop>
        <!-- 表格 -->
        <div class="table-box">
            <p v-if="power['sign-set-bl-htym-update'].state">
                <span><i class="iconfont icon-tubiao-11 mr-8"></i>数据列表</span>
                <el-button icon="el-icon-plus" @click="operationFn('新增')" round type="primary">新增合同页面</el-button>
            </p>
            <el-table :data="LayoutData" border style="width: 100%" ref="tableCom" :max-height="tableNumberCom" header-row-class-name="theader-bg">
                <el-table-column label="体系" prop="systemtag">
                    <template slot-scope="scope">
                        <span v-for="item in systemOpt" :key="item.key" v-if="item.key===scope.row.systemtag">{{item.value}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="页面版式" prop="version">
                    <template slot-scope="scope">
                        <span v-for="item in dictionary['746']" :key="item.key" v-if="item.key===scope.row.version">{{item.value}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="设置时间" prop="createTime">
                    <template slot-scope="scope">{{scope.row.createTime|formatTime(false)}}</template>
                </el-table-column>
                <el-table-column label="最新修改时间" prop="updateTime">
                    <template slot-scope="scope">{{scope.row.updateTime|formatTime(false)}}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="medium" @click="operationFn('查看',scope.row)" v-if="power['sign-set-bl-htym-see'].state">查看</el-button>
                        <el-button type="text" size="medium" @click="operationFn('编辑',scope.row)" v-if="power['sign-set-bl-htym-update'].state">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            v-if="total"
            class="pagination-info"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </div>
        <!-- 新增编辑查看合同页面 -->
        <el-dialog
        :title="layoutTitle+'合同页面'"
        :closeOnClickModal="$tool.closeOnClickModal"
        :close-on-press-escape="$tool.closeOnClickModal"
        :visible.sync="addVisible"
        width="900px">
        <div class="dialog-body">
            <div class="item-set" v-if="layoutTitle!='查看'">
                <div>
                    <span><i class="color-red">*</i>体系：</span>
                    <el-select v-model="addSystemTag" size="small" :disabled="layoutTitle=='编辑'">
                        <el-option v-for="item in systemOpt" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </div>
                <div>
                    <span><i class="color-red">*</i>页面版式：</span>
                    <el-radio-group v-model="layoutType">
                        <el-radio v-for="item in dictionary['746']" :key="item.key" :label="item.key">{{item.value}}</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="item-layout" :style="{ height: clientHei }">
                <img :src="getImg('jichu.png')" alt="" v-if="layoutType==1">
                <img :src="getImg('fuza.png')" alt="" v-else>
            </div>
            <p class="color-red" v-if="layoutTitle!='查看'">注：设置新的页面版式成功后，新创建的合同以新设置的页面版式为准。</p>
        </div>
        <div class="btn" v-if="layoutTitle!='查看'">
            <el-button @click="addVisible=false" round>取 消</el-button>
            <el-button type="primary" @click="submitFn" round>保 存</el-button>
        </div>
        </el-dialog>
        <!-- 确认保存弹窗 -->
        <el-dialog title="确认保存" :closeOnClickModal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal" width="500px" :visible.sync="saveDialog">
            <div class="save-txt">
                <p style="margin-bottom:10px;">确认保存新的合同页面版式？</p>
                <p class="color-red">新创建的合同以新设置的页面版式为准</p>
                <p>当前合同页面版式为{{layoutType==1?'基础版':'复杂版'}}</p>
            </div>
            <div class="btn-box btn">
                <el-button @click="saveDialog=false" round>取 消</el-button>
                <el-button type="primary" @click="sureFn" round>确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {FILTER} from "@/assets/js/filter";
    import {MIXINS} from "@/assets/js/mixins";
    export default {
        name: "contractLayout",
        mixins: [MIXINS,FILTER],
        props: {
            systemOpt: {
                type: Array,
                default: function() {
                    return []
                }
            }
        },
        data() {
            return {
                clientHei: '',
                searchSystemTag: '',
                createTime: [],
                updateTime: [],
                LayoutData: [], //列表数据
                addVisible: false, //新增弹窗
                addSystemTag: '',
                layoutType: '',
                layoutId: '',
                pageNum: 1,
                pageSize: 10,
                total: 0,
                layoutTitle: '', //弹窗标题
                dictionary: {
                    '746':'页面版式'
                },
                power: {
                    'sign-set-bl-htym-update': {
                        state: false,
                        name: '新增/编辑'
                    },
                    'sign-set-bl-htym-see': {
                        state: false,
                        name: '查看'
                    }
                },
                saveDialog: false
            }
        },
        created() {
            this.clientHei= document.documentElement.clientHeight -500 + 'px'
            this.getDictionary()
            let res = this.getDataList
            if(res&&(res.route === this.$route.path)){
                let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
                let query = session.query
                this.LayoutData = res.data.list
                this.total = res.data.total
                this.searchSystemTag = query.systemtag
                this.createTime = query.createStartTime ? [query.createStartTime,query.createEndTime] : []
                this.updateTime = query.updateStartTime ? [query.updateStartTime,query.updateEndTime] : []
                this.pageNum = query.pageNum
            }else{
                // 列表
                this.getData()
            }
        },
        methods: {
            getData(type='init') {
                let bool1 = this.createTime!=null&&this.createTime.length
                let bool2 = this.updateTime!=null&&this.updateTime.length
                let param = {
                    createStartTime: bool1 ? this.createTime[0] : '',
                    createEndTime: bool1 ? this.createTime[1] : '',
                    updateStartTime: bool2 ? this.updateTime[0] : '',
                    updateEndTime: bool2 ? this.updateTime[1] : '',
                    pageSize: this.pageSize,
                    pageNum: this.pageNum,
                    systemtag: this.searchSystemTag
                }

                //点击查询时，缓存筛选条件
                if(type==='search'||type==='pagination'){
                    sessionStorage.setItem('sessionQuery',JSON.stringify({
                        path:'/contractLayout',
                        url:'/cont/version/list',
                        query:param
                    }))
                }

                this.$ajax.get('/api/cont/version/list', param).then(res=>{
                    res = res.data
                    if(res.status === 200) {
                        this.LayoutData = res.data.list
                        this.total = res.data.total
                    }
                }).catch(error => {
                    this.$message({message:error})
                })
            },
            // 新增 编辑 查看
            operationFn(tit,row) {
                this.addVisible = true
                this.layoutTitle = tit
                if(tit == '新增'){
                    this.addSystemTag = ''
                    this.layoutType = 2
                }else {
                    this.layoutType = row.version
                    if(tit == '编辑') {
                        this.addSystemTag = row.systemtag
                        this.layoutId = row.id  
                    }
                }
            },
            // 保存
            submitFn() {
                if(!this.addSystemTag) {
                    this.$message({message:'体系不能为空'})
                    return
                }
                this.saveDialog = true
            },
            // 确定保存
            sureFn() {
                let param = {
                    systemtag: this.addSystemTag,
                    version: this.layoutType
                }
                let str = 'insert'
                if(this.layoutTitle == '编辑') {
                    str = 'update'
                    param.id = this.layoutId
                }
                this.$ajax.postJSON(`/api/cont/version/${str}`, param).then(res=>{
                    res = res.data
                    if(res.status === 200) {
                        this.$message(res.message)
                        this.saveDialog = false
                        this.addVisible = false
                        this.getData()
                    }
                }).catch(error => {
                    this.$message({message:error})
                })
            },
            // 查询
            queryFn() {
                this.pageNum = 1
                this.getData('search')
            },
            // 重置
            resetFormFn() {
                this.searchSystemTag = ''
                this.createTime = []
                this.updateTime = []
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.pageNum = val
                this.getData('pagination')
            },
            getImg: function (url) {
                return require(`@/assets/img/${url}`)
            }
        },
        computed: {
            userInfo() {
                return this.getUser.user
            }
        }
    }
</script>

<style scoped lang="less">
    @import "~@/assets/common.less";
    .table-box {
        background-color: #fff;
        padding: 0 10px;
        margin-top: 20px;
        > p {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: @size-14;
            .mr-8 {
                margin-right: 8px;
            }
            > .el-button {
                width:120px;
                padding: 9px 15px;
                display: flex;
                justify-content: center;
                color: #fff;
            }
        }
    }
    .dialog-body {
        padding: 10px 20px 10px;
        border-bottom: 1px solid #EDECF0;
        .item-set {
            display: flex;
            margin-bottom: 10px;
            > div {
                width: 300px;
                display: flex;
                align-items: center;
            }
        }
        .item-layout {
            border: 10px solid #f5f5f5;
            box-sizing: border-box;
            overflow-y: auto;
            img {
                width: 100%;
            }
        }
        .color-red {
            color: red;
        }
    }
    .btn {
        padding: 10px 20px 10px 0;
        text-align: right;
    }
    .save-txt {
        padding: 40px 0;
        text-align: center;
        border-bottom: 1px solid #EDECF0;
    }
    .color-red {
        color: @color-red;
    }
    /deep/ .el-dialog__body {
        padding: 0;
    }
</style>