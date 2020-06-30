<template>
    <div class="view-container" ref="tableComView">
        <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
            <el-form :inline="true" :model="searchForm" size="small">
                <el-form-item label="关键字">
                    <el-input v-model="searchForm.keyword" placeholder="附件名称/添加人"></el-input>
                </el-form-item>
                <el-form-item label="体系">
                    <el-select class="w240" v-model="searchForm.systemId">
                        <el-option v-for="item in systemOpt" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="添加时间">
                    <el-date-picker
                    v-model="addTime"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']"
                    format="yyyy-MM-dd"
                    value-format="yyyy/MM/dd">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </ScreeningTop>
        <!-- 表格 -->
        <div class="table-box">
            <p v-if="power['sign-set-rule-add'].state">
                <span><i class="iconfont icon-tubiao-11 mr-8"></i>数据列表</span>
                <el-button icon="el-icon-plus" @click="addFn" round type="primary">新增合同附件</el-button>
            </p>
            <el-table :data="attachData" border style="width: 100%" ref="tableCom" :max-height="tableNumberCom" header-row-class-name="theader-bg">
                <el-table-column label="体系" prop="systemId">
                    <template slot-scope="scope">
                        <span v-for="item in systemArr" :key="item.key" v-if="item.key===scope.row.systemId">{{item.value}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="附件名称" prop="enclosureName"></el-table-column>
                <el-table-column label="添加时间" prop="createTime">
                    <template slot-scope="scope">{{scope.row.createTime|formatTime}}</template>
                </el-table-column>
                <el-table-column label="添加人" prop="createName"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="medium" @click="downloadFn(attachData,scope.$index)">下载</el-button>
                        <el-button type="text" size="medium" @click="deleteAttach(scope.row.id)">删除</el-button>
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
        <!-- 新增合同附件 -->
        <el-dialog
        title="新增合同附件"
        :closeOnClickModal="$tool.closeOnClickModal"
        :close-on-press-escape="$tool.closeOnClickModal"
        :visible.sync="addVisible"
        width="740px">
        <div class="dialog-body">
            <p class="item-title"><i>*</i>体系：</p>
            <el-select class="w400 item-title" v-model="addSystemTag" size="small">
                <el-option v-for="item in systemOpt" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <p class="item-title"><i>*</i>附件：</p>
            <ul class="ulData">
                <li>
                    <file-up class="upload-box" @getUrl="addSubject">
                        <i class="iconfont icon-shangchuan"></i>
                        <p>点击上传</p>
                    </file-up>
                </li>
                <li v-for="(item,i) in attachList" :key="i">
                    <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
                        <div class="attach-box" @click="previewPhoto(attachList,i)">
                            <img :src="item.path|getSignImage(preloadFiles)" alt="" v-if="isPictureFile(item.fileType)" width="70%" height="62px">
                            <upload-cell :type="item.fileType" v-else></upload-cell>
                            <p>{{item.name}}</p>
                        </div>
                    </el-tooltip>
                    <i class="iconfont icon-tubiao-6" @click="deleteFn(i)"></i>
                </li>
            </ul>
        </div>
        <div class="btn">
            <el-button @click="addVisible=false" round>取 消</el-button>
            <el-button type="primary" @click="saveFn" round>保 存</el-button>
        </div>
        <!-- 图片预览 -->
        <preview :imgList="previewFiles" v-if="preview" @close="preview=false"></preview>
        </el-dialog>
        <!-- 确认删除 弹窗 -->
        <el-dialog
        title="确认删除"
        :closeOnClickModal="$tool.closeOnClickModal"
        :close-on-press-escape="$tool.closeOnClickModal"
        :visible.sync="sureDeleteDialog"
        width="500px">
        <div class="sure-box">
            <p>确认删除该附件？</p>
            <p>删除附件后将无法在合同附件库下载此附件</p>
        </div>
        <div class="btn">
            <el-button @click="sureDeleteDialog=false" round>取 消</el-button>
            <el-button type="primary" @click="sureDelete" round>确 认</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<script>
    import {FILTER} from "@/assets/js/filter";
    import {MIXINS} from "@/assets/js/mixins";
    export default {
        name: "conAttachment",
        mixins: [MIXINS,FILTER],
        props: {
            systemArr: {
                type: Array,
                default: function() {
                    return []
                }
            },
            systemOpt: {
                type: Array,
                default: function() {
                    return []
                }
            }
        },
        data() {
            return {
                clientHei: document.documentElement.clientHeight, //窗体高度
                searchForm: {
                    keyword: '',
                    systemId: ''
                },
                addTime: [],
                attachData: [], //列表数据
                addVisible: false, //新增弹窗
                addSystemTag: '',
                attachList: [], //上传附件数组
                preloadList: [],
                preloadFiles:[],
                pageNum: 1,
                pageSize: 10,
                total: 0,
                sureDeleteDialog: false, //确认删除弹窗
                deleteId: '', //删除行id
                power: {
                    'sign-set-rule-add': {
                        name: '添加/编辑',
                        state: false
                    }
                },
            }
        },
        created() {
            let res = this.getDataList
            if(res&&(res.route === this.$route.path)){
                let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
                let query = session.query
                this.attachData = res.data
                this.searchForm.keyword = query.keyword
                this.searchForm.systemId = query.systemId
                this.addTime = query.staDate ? [query.staDate,query.endDate] : []
                this.pageNum = query.pageNum
            }else{
                // 列表
                this.getData()
            }
        },
        methods: {
            //动态高度获取
            comHeightFn(){
                if(this.$refs.tableCom&&this.$refs.tableComView){
                    let wh = document.documentElement.clientHeight;
                    let h1 =this.$refs.tableComView.clientHeight + 80 + 50;
                    let h2 =this.$refs.tableCom.$el.clientHeight;
                    let th = wh - h1;
                    this.tableNumberCom = h2 + th;
                }
            },
            getData(type='init') {
                let bool = this.addTime!=null&&this.addTime.length
                let param = {
                    staDate: bool ? this.addTime[0] : '',
                    endDate: bool ? this.addTime[1] : '',
                    pageSize: this.pageSize,
                    pageNum: this.pageNum,
                    cityId: this.userInfo.cityId
                }
                param = Object.assign({},this.searchForm,param)

                //点击查询时，缓存筛选条件
                if(type==='search'||type==='pagination'){
                    sessionStorage.setItem('sessionQuery',JSON.stringify({
                        path:'/conAttachment',
                        url:'/attachment/getattachmentList',
                        query:param
                    }))
                }

                this.$ajax.get('/api/attachment/getattachmentList', param).then(res=>{
                    res = res.data
                    if(res.status === 200) {
                        this.attachData = res.data.list
                        this.total = res.data.total
                    }
                }).catch(error => {
                    this.$message({message:error})
                })
            },
            // 下载
            downloadFn(arr,i) {
                this.fileSign([].concat(arr[i].path),'download')
            },
            // 删除
            deleteAttach(i) {
                this.sureDeleteDialog = true
                this.deleteId = i
            },
            // 确认删除
            sureDelete() {
                this.$ajax.post('/api/attachment/delAttachment', { id: this.deleteId }).then(res=>{
                    res = res.data
                    if(res.status === 200) {
                        this.$message(res.message)
                        this.sureDeleteDialog = false
                        this.getData()
                    }
                }).catch(error => {
                    this.$message({message:error})
                })
            },
            // 新增合同附件
            addFn() {
                this.addVisible = true
                this.addSystemTag = ''
                this.attachList = []
            },
            // 上传
            addSubject(data) {
                let arr = data.param
                arr.forEach(item => {
                    let fileType = this.$tool.get_suffix(item.name)
                    item.fileType = fileType
                })
                this.attachList = this.attachList.concat(arr)
                arr.forEach(item => {
                    if(this.isPictureFile(item.fileType)){
                        this.preloadList.push(item.path)
                    }
                })
                if(this.preloadList.length) {
                    this.fileSign(this.preloadList,'preload').then(res=>{
                        this.preloadFiles = res
                    }) 
                }
            },
            deleteFn(i) {
                if(this.attachList.length == 1) {
                    this.$message({
                        message:'至少保留一个，请勿删除',
                        type:'warning'
                    })
                    return
                }
                this.attachList.splice(i,1)
            },
            // 保存
            saveFn() {
                if(!this.addSystemTag) {
                    this.$message({message:'体系不能为空'})
                    return
                }
                if(!this.attachList.length) {
                    this.$message({message:'请上传附件'})
                    return
                }

                let arr = []
                this.attachList.forEach(item =>{
                    arr.push({
                        systemId: this.addSystemTag,
                        enclosureName: item.name,
                        path: item.path
                    })
                })
                this.$ajax.postJSON('/api/attachment/addAttaaddchment', arr).then(res=>{
                    res = res.data
                    if(res.status === 200) {
                        this.$message(res.message)
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
                this.searchForm.keyword = ''
                this.searchForm.systemId = ''
                this.addTime = []
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.pageNum = val
                this.getData('pagination')
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
        max-height: 400px;
        overflow-y: auto;
        padding: 20px;
        border-bottom: 1px solid #EDECF0;
        .item-title {
            margin-bottom: 10px;
            >i {
                color: @color-red;
            }
        }
        .ulData{
            display: flex;
            flex-wrap:wrap;
            li{
                margin-right: 10px;
                position: relative;
                margin-bottom: 10px;
                > i{
                    display: none;
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    color: @color-warning;
                    font-size: 20px;
                    cursor: pointer;
                }
                &:hover >i {
                    display: block;
                }
            }
        }
        .upload-box {
            display: inline-block;
            text-align: center;
            width: 120px;
            height: 120px;
            box-sizing: border-box;
            padding-top: 28px;
            border: 1px dashed @border-DE;
            border-radius:2px;
            i {
                color: @bg-th;
                font-size: 50px;
            }
            p {
                padding-top: 10px;
                color: @color-324;
                font-size: 12px;
            }
        }
        .attach-box{
            display: inline-block;
            text-align: center;
            width: 120px;
            height: 120px;
            padding-top: 20px;
            box-sizing: border-box;
            border-radius:4px;
            background: @color-F2;
            > p{
                padding-top: 5px;
                display: inline-block;
                width: 100px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
    }
    .btn {
        padding: 10px 20px 10px 0;
        text-align: right;
    }
    /deep/ .el-dialog__body {
        padding: 0;
    }
    .sure-box {
        text-align: center;
        padding: 30px 0 50px 0;
        border-bottom: 1px solid #EDECF0;
        > p {
            margin-top: 10px;
        }
    }
</style>