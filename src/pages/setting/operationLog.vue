<template>
    <div class="view-container" ref="tableComView">
        <ScreeningTop
        @propQueryFn="queryFn"
        @propResetFormFn="resetFormFn">
            <el-form  class="header" ref="propForm" size="small">
                <div class="content">
                    <el-form-item label="体系" v-if="version===3">
                        <el-select size="small" v-model="systemtag">
                            <el-option v-for="item in systemTagSelect" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="交易类型">
                        <el-select v-model="bustype" placeholder="请选择">
                            <el-option v-for="item in dictionary['711']" :key="item.value" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item label="关键字">
                        <el-input v-model="keyword" placeholder="操作内容" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="部门" class="dep">
                         <select-tree :data="DepList" :init="departmentName" @checkCell="depHandleClick" @clear="clearDep" @search="searchDep"></select-tree>
                        <!-- <el-select style="width:160px" :clearable="true" ref="tree" size="small" remote :loading="Loading" :remote-method="remoteMethod" @visible-change="initDepList" @clear="clearDep" v-model="departmentName" placeholder="请选择">
                            <el-option class="drop-tree" value="">
                            <el-tree :data="DepList" :props="defaultProps" @node-click="depHandleClick"></el-tree>
                            </el-option>
                        </el-select> -->
                        <el-select v-model="depUser" style="margin-left:10px" :clearable="true" @change="handleEmpNodeClick" v-loadmore="moreEmploye" filterable placeholder="请选择">
                            <el-option
                                v-for="item in EmployeList"
                                :key="item.empId"
                                :label="item.name"
                                :value="item.empId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="日期">
                        <el-date-picker
                        v-model="searchTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        value-format="yyyy-MM-dd"
                        end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="模块">
                        <el-select v-model="selectType" filterable clearable placeholder="请选择">
                            <el-option
                                v-for="(item) in type"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
        </ScreeningTop>
        <div class="table-list">
            <el-table :data="tableData" ref="tableCom" style="width: 100%" border :max-height="tableNumberCom">
                <el-table-column label="体系" width="130" prop="systemtagName" v-if="version===3"></el-table-column>
                <el-table-column width='180' label="操作日期">
                    <template slot-scope="scope">
                        {{scope.row.createTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column width='180' label="操作人">
                    <template slot-scope="scope">
                        <span>{{ scope.row.createByDepName }}-{{ scope.row.createByName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="功能模块" width="130" prop="objectType.label"></el-table-column>
                <el-table-column label="子类型" width="130" prop="type.label"></el-table-column>
                <el-table-column label="操作内容"  prop="content"></el-table-column>
                <el-table-column label="IP地址" prop="ip" width="230" ></el-table-column>
            </el-table>
            <div class="pagination">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        </div>
        </div>

    </div>
</template>

<script>
    import ScreeningTop from '@/components/ScreeningTop';
    import { MIXINS } from "@/assets/js/mixins";
    import {FILTER} from "@/assets/js/filter";
    var param={}
    export default {
        mixins: [MIXINS,FILTER],
        data() {
            return {
                Loading:false,
                departmentName:'',
                department: [],
                keyword: "",
                searchTime: [],
                tableData: [],
                pageSize: 30,
                empName:'',
                pageNum: 1,
                selectType:'',
                total:0,
                dictionary: {
                '711':'',
                },
                systemtag: '',
                bustype:0,
                users:[],
                type:[],
                depUser:'',
                 power: {
                    'sign-set-log-query': {
                        state: false,
                        name: '查询'
                    },
                 }
            }
        },
         created(){
            this.getDictionary()
            this.getSystemTagSelect()
            this.systemtag = this.userInfo.deptSystemtag
        },
        mounted() {
            this.remoteMethod()
            let res=this.getDataList
            if(res&&(res.route===this.$route.path)){
                this.total = res.data.total
                this.tableData = res.data.list
                let session = JSON.parse(sessionStorage.getItem('sessionQuery')).query
                this.pageSize=session.pageSize,
                this.pageNum=session.pageNum,
                this.department=session.deptId,
                this.departmentName=session.departmentName,
                this.depUser=session.empId,
                this.selectType=session.objectType,
                this.searchTime = session.startTime?[session.startTime,session.startTime]:[]
                this.keyword=session.keyword,
                this.empName=session.empName
                if(this.version === 3) this.systemtag= session.systemtag
                if(this.depUser){
                    this.dep=Object.assign({},this.dep,{id:this.department,empId:this.depUser})
                    this.EmployeList.unshift({
                    empId:this.depUser,
                    name:this.empName
                    })
                    this.getEmploye(this.department)
                }
            }else{
                this.getLogList()
            }
            this.$ajax.get('/api/operation/getObjectType').then(res => {
                this.type=res.data.data
            })
        },
        methods: {
            searchDep:function (payload) {
                /*this.DepList=payload.list
                this.departmentName=payload.depName*/
            },
            depHandleClick(data) {
                this.depUser=''
                this.department=data.depId
                this.departmentName=data.name
                this.handleNodeClick(data)
            },
            //获取当前部门
            initDepList:function (val) {
                    if(!val){
                        this.remoteMethod()
                    }
                },
            clearDep:function () {
                    this.depUser=''
                    this.department=''
                    this.departmentName=''
                    // this.EmployeList=[]
                    this.clearSelect()
            },
            handleSizeChange (val) {

            },
            handleCurrentChange (val) {
                this.pageNum = val
                this.getLogList()
            },
            getLogList(type="init") {
                let param = {
                    pageSize: this.pageSize,
                    pageNum: this.pageNum,
                    deptId:this.department,
                    empId:this.depUser,
                    departmentName:this.departmentName,
                    objectType:this.selectType,
                    startTime:this.searchTime!== null?this.searchTime[0]:'',
                    endTime:this.searchTime!==null?this.searchTime[1]:'',
                    keyword:this.keyword,
                    plateType:this.bustype
                }
                if(this.version === 3) param.systemtag = this.systemtag

                if(type === 'search') {
                    sessionStorage.setItem('sessionQuery',JSON.stringify({
                        path:'/operationLog',
                        url:'/operation/getList',
                        query:Object.assign({},param,{empName:this.dep.empName}),
                        methods:"get"
                    }))
                }
                this.$ajax.get('/api/operation/getList',param).then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.total = res.data.total
                        this.tableData = res.data.list
                    }
                }).catch(error => {
                    console.log(error);
                })
            },
            // 重置
            resetFormFn() {
                this.pageNum=1
                this.keyword=''
                this.selectType='',
                this.searchTime='',
                this.depUser='',
                this.department=''
                this.users=''
                this.systemtag = this.userInfo.deptSystemtag
                this.bustype=0
                this.departmentName=''
                this.clearSelect()
                this.EmployeList = []
            },
            // 查询
            queryFn(){
                this.pageNum = 1
                this.getLogList('search')
            },
        },
        components:{
            ScreeningTop
        },
        computed: {
            version() {
                return this.getUser.version
            },
            userInfo() {
                return this.getUser.user
            }
        }
    }
</script>

<style lang="less" scoped>
.header {
    background-color: #fff;
    border-radius:2px;
    box-sizing: border-box;
    .form-title {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        div {
            > .el-button {
                width: 100px;
                height: 36px;
                border-radius:14px;
            }
        }
    }
    .content {
        display: flex;
        font-weight: normal;
        flex-wrap: wrap;
        > .el-form-item {
            display: flex;
            margin-right: 30px;
            &:nth-child(2) /deep/ .el-form-item__content{
                display: flex;
                span{
                    margin-right: 5px;
                }
            }
        }
    }
}

.table-list {
    background-color: #fff;
    margin: 0 10px;
    padding-top: 10px;
}

/deep/ .el-table th {
  background:rgba(238,242,251,1);
}
/deep/ .el-pagination{
    text-align: right;
}
.el-select-dropdown__item.selected {
    font-weight: normal;
}
/deep/ .dep .el-form-item__content{
    display: flex
}
.mr-8{
    margin-right: 8px;
}
</style>
