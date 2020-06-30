<template>
    <div class="view-container" ref="tableComView">
        <!-- 筛选 -->
        <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
            <el-form :inline="true" :model="searchForm" size="small">
                <el-form-item label="体系">
                    <el-select class="w240" v-model="searchForm.systemId" :clearable="true">
                        <el-option v-for="item in systemOpt" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="合同类型">
                    <el-select v-model="searchForm.contType" :clearable="true">
                        <el-option label="租赁" value="1"></el-option>
                        <el-option label="买卖/代办" value="2"></el-option>
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
        <!-- 列表 -->
        <div class="table-box">
            <p v-if="power['sign-set-bl-fcbl-edit'].state">
                <span><i class="iconfont icon-tubiao-11 mr-8"></i>数据列表</span>
                <el-button icon="el-icon-plus" @click="operationFn('新增')" round type="primary">新增分成比例</el-button>
            </p>
            <el-table :data="divideData" border style="width: 100%" ref="tableCom" :max-height="tableNumberCom" header-row-class-name="theader-bg">
                <el-table-column label="体系" prop="systemName"></el-table-column>
                <el-table-column label="合同类型" prop="operatorName"></el-table-column>
                <el-table-column label="默认分成比例" prop="ratioInfos">
                    <template slot-scope="scope">
                        <p v-for="(item,i) in scope.row.ratioInfos" :key="i">{{ratioShowFn(item)}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="设置时间" prop="firstUpdateTime">
                    <template slot-scope="scope">{{scope.row.firstUpdateTime|formatTime(false)}}</template>
                </el-table-column>
                <el-table-column label="最新修改时间" prop="lastUpdateTime">
                    <template slot-scope="scope">{{scope.row.lastUpdateTime|formatTime(false)}}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="medium" @click="operationFn('编辑',scope.row)" v-if="power['sign-set-bl-fcbl-edit'].state">编辑</el-button>
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
        <!-- 新增编辑分成比例弹层 -->
        <el-dialog
        :title="divideTitle+'分成比例'"
        :closeOnClickModal="$tool.closeOnClickModal"
        :close-on-press-escape="$tool.closeOnClickModal"
        :visible.sync="addVisible"
        width="740px">
            <div class="dialog-body">
                <div v-for="(item,i) in ratioForm" :key="i" class="item-box">
                    <p class="item-title" v-if="contType==='2'?true:i!=3">
                        <span v-if="i===3" @click="remarkFn" class="remark-icon iconfont icon-tubiao-10" :class="{'remark_':remarkBool}"></span>
                        <i v-if="i!=3">*</i>
                        {{i===0?item.title+'：':i===3?item.is_tit+'分成':item.title+'分成'}}
                        <span v-if="i===0?false:i===3?remarkBool?true:false:true" style="margin-left: 10px;" class="color-red">合计：{{item.count?item.count:0}}%</span>
                    </p>
                    <p class="item-title" v-if="i===0"><i>*</i>合同类型：</p>
                    <div v-if="i===0" class="item-ratio">
                        <el-select v-model="item.systemId" size="small" class="w240" @change="getSystemName" :disabled="divideTitle==='编辑'">
                            <el-option v-for="ele in systemOpt" :key="ele.key" :label="ele.value" :value="ele.key"></el-option>
                        </el-select>
                        <el-select v-model="contType" size="small" class="w240" :disabled="divideTitle==='编辑'" @change="contFn">
                            <el-option label="租赁" value="1"></el-option>
                            <el-option label="买卖/代办" value="2"></el-option>
                        </el-select>
                    </div>
                    <div v-for="(m,n) in item.arr" :key="n" v-if="remarkBool?true:i!=3&&i!=0" class="item-ratio">
                        <el-select v-model="m.roleType" size="small" class="w240" placeholder="请选择角色类型" filterable @change="getRoleName($event,i,n)">
                            <el-option v-for="ele in i===1?roleHouse:roleClient" :key="ele.value" :label="ele.label" :value="ele.value"></el-option>
                        </el-select>
                        <el-input v-model="m.ratio" size="small" class="w240" placeholder="请输入分成比例" @input="cutNumber(i,n)" clearable></el-input>%
                        <span class="icon" @click.stop="addFn(i)">
                            <i class="iconfont icon-tubiao_shiyong-14"></i>
                        </span>
                        <span class="icon" @click.stop="delFn(i,n)" v-if="item.arr.length>1">
                            <i class="iconfont icon-tubiao_shiyong-4"></i>
                        </span>
                    </div>
                </div>
                <div class="color-red">注：确认业绩前取新设置的默认业绩分成比例，确认业绩后以旧数据为准。</div>
            </div>
            <div class="btn">
                <el-button @click="addVisible=false" round>取 消</el-button>
                <el-button type="primary" @click="saveFn" round>保 存</el-button>
            </div>
        </el-dialog>
        <!-- 确认保存 弹层 -->
        <el-dialog
        title="确认保存"
        :closeOnClickModal="$tool.closeOnClickModal"
        :close-on-press-escape="$tool.closeOnClickModal"
        :visible.sync="sureDialog"
        width="500px">
            <div class="sure-box">
                <p style="margin-bottom: 15px;">确认保存新的业绩分成比例？</p>
                <p class="color-red">确认业绩前取新设置的默认业绩分成比例，</p>
                <p class="color-red">确认业绩后以旧数据为准</p>
            </div>
            <div class="btn">
                <el-button @click="sureDialog=false" round>取 消</el-button>
                <el-button type="primary" @click="sureFn" round>确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {FILTER} from "@/assets/js/filter";
    import {MIXINS} from "@/assets/js/mixins";

    let INTARR = [
        {
            title: "体系",
            systemId: '',
            systemName: ''
        },
        {
            title: "房源方",
            count: '',
            arr: [{ type: 1, ratio: "", roleType: '', roleName: '' }]
        },
        {
            title: "客源方",
            count: '',
            arr: [{ type: 2, ratio: "", roleType: '', roleName: '' }]
        },
        {
            is_tit: "是否设置默认交易服务费佣金",
            title: "交易服务费佣金",
            count: '',
            arr: [{ type: 3, ratio: "", roleType: '', roleName: '' }]
        }
    ]
    export default {
        name: "divideRatio",
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
                searchForm: {
                    systemId: '',
                    contType: ''
                },
                createTime: [],
                updateTime: [],
                divideData: [], //列表数据
                addVisible: false, //新增 编辑
                pageNum: 1,
                pageSize: 10,
                total: 0,
                divideTitle: '',
                divideId: '',
                contType: '',
                ratioForm: [],
                roleHouse: [],
                roleClient: [],
                sureDialog: false, //确认保存
                power: {
                    'sign-set-bl-fcbl-edit': {
                        name: '新增/编辑',
                        state: false
                    }
                },
                remarkBool: false
            }
        },
        created() {
            this.getRole()
            let res = this.getDataList
            if(res&&(res.route === this.$route.path)){
                let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
                let query = session.query
                this.divideData = res.data.list
                this.total = res.data.total
                this.searchForm.systemId = query.systemId
                this.searchForm.contType = query.contType
                this.createTime = query.firstStartUpdateTime ? [query.firstStartUpdateTime,query.firstEndUpdateTime] : []
                this.updateTime = query.lastStartUpdateTime ? [query.lastStartUpdateTime,query.lastEndUpdateTime] : []
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
            ratioShowFn(item) {
                let type = item.type
                let str = ''
                type === 1 ? str = '房源' : type === 2 ? str = '客源' : str = '交易服务费佣金'
                return `${str} - ${item.roleName} ${item.ratio}%`
            },
            // 角色类型
            getRole() {
                this.$ajax.get('/api/allocation/getAllRole').then(res => {
                    if (res.status === 200) {
                        this.roleHouse = res.data.data.housingRoles; //房源角色类型
                        this.roleClient = res.data.data.customerRoles; //客源角色类型
                    }
                }).catch(error => {
                    this.$message({message:error})
                })
            },
            getData(type='init') {
                let bool1 = this.createTime!=null&&this.createTime.length
                let bool2 = this.updateTime!=null&&this.updateTime.length
                let param = {
                    systemIds: this.searchForm.systemId,
                    contType: this.searchForm.contType,
                    firstStartUpdateTime: bool1 ? this.createTime[0] : '',
                    firstEndUpdateTime: bool1 ? this.createTime[1] : '',
                    lastStartUpdateTime: bool2 ? this.updateTime[0] : '',
                    lastEndUpdateTime: bool2 ? this.updateTime[1] : '',
                    pageSize: this.pageSize,
                    pageNum: this.pageNum
                }

                //点击查询时，缓存筛选条件
                if(type==='search'||type==='pagination'){
                    sessionStorage.setItem('sessionQuery',JSON.stringify({
                        path:'/divideRatio',
                        url:'/allocation/getAllocationList',
                        query:param
                    }))
                }

                this.$ajax.get('/api/allocation/getAllocationList', param).then(res=>{
                    res = res.data
                    if(res.status === 200) {
                        this.divideData = res.data.list
                        this.total = res.data.total
                    }
                }).catch(error => {
                    this.$message({message:error})
                })
            },
            // 新增/编辑分成比例
            operationFn(tit,row) {
                this.addVisible = true
                this.divideTitle = tit
                this.ratioForm = JSON.parse(JSON.stringify(INTARR))
                this.remarkBool = false
                if(row) {
                    let rowData = JSON.parse(JSON.stringify(row))
                    this.divideId = rowData.id
                    this.ratioForm[0].systemId = rowData.systemId
                    this.ratioForm[0].systemName = rowData.systemName
                    this.contType = rowData.contType + ''
                    for(let i = 1; i < this.ratioForm.length; i++) {
                        let _arr = rowData.ratioInfos.filter(item => item.type === i)
                        if(_arr.length > 0) {
                            this.ratioForm[i].arr = _arr
                            this.countFn(this.ratioForm[i].arr,i)
                            if(i === 3) {
                                this.remarkBool = true
                            }
                        }
                    }
                } else {
                    this.contType = ""
                }
            },
            getSystemName(val) {
                this.systemOpt.find(item => {
                    if(item.key === val) {
                        this.ratioForm[0].systemName = item.value
                    }
                })
            },
            // 合同类型选择
            contFn(val) {
                if(val === '1') {
                    this.remarkBool = false
                    this.clearFn()
                }
            },
            clearFn() {
                this.ratioForm[3].count = ""
                this.ratioForm[3].arr = JSON.parse(JSON.stringify(INTARR[3].arr))
            },
            // 勾选框
            remarkFn() {
                this.remarkBool = !this.remarkBool
                if(!this.remarkBool) this.clearFn()
            },
            getRoleName(e,i,n) {
                let arr_role = []
                if(i === 1) {
                    arr_role = [...this.roleHouse]
                } else {
                    arr_role = [...this.roleClient]
                }
                arr_role.find(item => {
                    if(item.value === e) {
                        this.ratioForm[i].arr[n].roleName = item.label
                    }
                })
            },
            cutNumber(i,n) {
                this.$nextTick(() =>{
                    this.ratioForm[i].arr[n].ratio = this.$tool.cutFloat({val:this.ratioForm[i].arr[n].ratio,max:100})
                    this.countFn(this.ratioForm[i].arr,i)
                })
            },
            // 添加
            addFn(i) {
                this.ratioForm[i].arr.push(JSON.parse(JSON.stringify(INTARR[i].arr[0])))
            },
            // 删除
            delFn(i,n) {
                let _ratio = this.ratioForm[i].arr[n].ratio
                this.ratioForm[i].arr.splice(n,1)
                _ratio&&this.countFn(this.ratioForm[i].arr,i)
            },
            countFn(arr,i) {
                let sum = 0;
                arr.forEach((item, index) => {
                    sum = this.toDecimal(sum, item.ratio == "" ? 0 : item.ratio);
                });
                this.ratioForm[i].count = sum
            },
            uniqueFn(arr) {
                const res = new Map();
                return arr.filter(a => !res.has(a.roleType) && res.set(a.roleType, 1));
            },
            toDecimal(num1, num2) {
                // debugger
                let sq1, sq2, m;
                try {
                    sq1 = num1.toString().split(".")[1].length;
                } catch (e) {
                    sq1 = 0;
                }
                try {
                    sq2 = num2.toString().split(".")[1].length;
                } catch (e) {
                    sq2 = 0;
                }
                m = Math.pow(10, Math.max(sq1, sq2));
                return Math.round((num1 * m + num2 * m)) / m;
            },
            checkRatioFn(ar) {
                let sum = 0
                for(let i = 0; i < ar.length; i++) {
                    sum = this.toDecimal(sum, ar[i].ratio)
                }
                return sum != 100 ? false : true
            },
            // 保存
            saveFn() {
                if(!this.ratioForm[0].systemId) {
                    this.$message({message:'体系不能为空'})
                    return
                }
                if(!this.contType) {
                    this.$message({message:'合同类型不能为空'})
                    return
                }
                let arrForm = [this.ratioForm[1],this.ratioForm[2]]
                if(this.remarkBool) {
                    arrForm.push(this.ratioForm[3])
                }
                for(let i = 0; i < arrForm.length; i++) {
                    for(let k = 0; k < arrForm[i].arr.length; k++) {
                        if(!arrForm[i].arr[k].roleType) {
                            this.$message(`${arrForm[i].title}角色类型不能为空`)
                            return
                        }
                        if(!String(arrForm[i].arr[k].ratio)) {
                            this.$message(`${arrForm[i].title}分成比例不能为空`)
                            return
                        }
                        if(arrForm[i].arr.length===k+1&&this.uniqueFn(arrForm[i].arr).length < arrForm[i].arr.length) {
                            this.$message({message: `${arrForm[i].title}有重复角色存在，请核实`, type: 'warning'})
                            return
                        }
                    }
                }
                if(!this.checkRatioFn(arrForm[0].arr.concat(arrForm[1].arr))) {
                    this.$message({message: '房客源分成合计不等于100% ，请输入正确的房客源分成比例', type: 'warning'})
                    return
                }
                if(this.remarkBool) { //选择买卖/代办验证并选中默认设置勾选框
                    if(!this.checkRatioFn(arrForm[2].arr)) {
                        this.$message({message: '交易服务费佣金分成合计不等于100%，请输入正确的交易服务费佣金分成比例', type: 'warning'})
                        return
                    }
                }
                this.sureDialog = true
            },
            // 确认保存
            sureFn() {
                let param = {
                    systemId: this.ratioForm[0].systemId,
                    systemName: this.ratioForm[0].systemName,
                    contType: this.contType,
                    ratioInfos: [...this.ratioForm[1].arr,...this.ratioForm[2].arr]
                }
                if(this.remarkBool) {
                    param.ratioInfos = [...param.ratioInfos,...this.ratioForm[3].arr]
                }
                let url = 'insert'
                if(this.divideTitle === '编辑') {
                    param.id = this.divideId
                    url = 'update'
                }
                this.$ajax.postJSON(`/api/allocation/${url}`, param).then(res=>{
                    res = res.data
                    if(res.status === 200) {
                        this.$message(res.data)
                        this.sureDialog = false
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
                this.searchForm.systemId = ''
                this.searchForm.contType = ''
                this.createTime = []
                this.updateTime = []
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.pageNum = val
                this.getData('pagination')
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
        max-height: 450px;
        overflow-y: auto;
        padding: 20px;
        border-bottom: 1px solid #EDECF0;
        .item-box {
            margin-bottom: 15px;
            &:first-child .item-title {
                display: inline-block;
                width: 260px;
            }
        }
        .item-title {
            margin-bottom: 5px;
            >i {
                color: @color-red;
            }
            .remark-icon {
                cursor: pointer;
                color: #ccc;
                font-weight: normal;
            }
            .remark_ {
                color: @color-blue;
            }
        }
        .item-ratio {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            .el-select {
                margin-right: 20px;
            }
            .icon {
                display: inline-block;
                cursor: pointer;
                .icon-tubiao_shiyong-14 {
                    font-size: 22px;
                    color: @color-blue;
                    margin-left: 30px;
                    margin-right: 5px;
                }
                .icon-tubiao_shiyong-4{
                    font-size: 22px;
                    color: @color-FF5;
                }
            }
        }
    }
    .sure-box {
        text-align: center;
        padding: 30px 0 50px 0;
        border-bottom: 1px solid #EDECF0;
    }
    .color-red {
        color: @color-red;
    }
    .btn {
        padding: 10px 20px 10px 0;
        text-align: right;
    }
    /deep/ .el-dialog__body {
        padding: 0;
    }
</style>
