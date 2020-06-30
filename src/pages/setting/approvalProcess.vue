<template>
    <div ref="tableComView">
        <ScreeningTop
        @propQueryFn="queryFn"
        @propResetFormFn="resetFormFn">
        <div class="content">
            <div class="input-search">
                <label class="w-70">交易类型</label>
                <el-select size="small" v-model="searchForm.modularType" :clearable="true">
                    <el-option v-for="item in dictionary['711']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
            </div>
            <div class="input-search" v-if="version==2">
                <label class="w-70">合作方式</label>
                <el-select size="small" v-model="searchForm.deptAttr" :clearable="true">
                    <el-option v-for="item in dictionary['73']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
            </div>
            <div class="input-search">
                <label class="mr-20">体系</label>
                <el-select size="small" v-model="searchForm.systemTag" :clearable="true">
                    <el-option v-for="item in systemTagSelect" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
            </div>
            <div class="input-search">
                <label class="mr-20">品牌</label>
                <el-select size="small" v-model="searchForm.brandId" :clearable="true">
                    <el-option v-for="item in dictionary['735']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
            </div>
            <div class="input-search">
                <label class="w-70">流程名称</label>
                <el-input size="small" v-model="searchForm.name" :clearable="true" onkeyup="value=value.replace(/\s+/g,'')"></el-input>
            </div>
            <div class="input-search">
                <label class="w-70">流程类型</label>
                <el-select size="small" v-model="searchForm.type" @change="changeFlowTypeOne" :clearable="true" @clear="clearCondition" filterable>
                    <el-option v-for="item in dictionary['573']" v-if="item.key!=4" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
                <el-select size="small" v-model="searchForm.branchCondition" :clearable="true" class="w200 ml-10">
                    <el-option v-for="item in homeConditionList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
            </div>
        </div>
        </ScreeningTop>
        <div class="aduit-list">
            <p v-if="power['sign-set-verify'].state">
                <span><i class="iconfont icon-tubiao-11 mr-8"></i>数据列表</span>
                <el-dropdown placement="bottom" @command="addFn">
                    <el-button round type="primary" size="small">
                    添加<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="item in dictionary['711']" :key="item.key" :command="item.key">
                            {{item.value}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </p>
            <div class="table">
                <el-table :data="tableData" style="width: 100%" border ref="tableCom" :max-height="tableNumberCom">
                    <el-table-column label="交易类型" prop="modularType">
                        <template slot-scope="scope">
                            <span v-for="item in dictionary['711']" :key="item.key" v-if="item.key===scope.row.modularType">{{item.value}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="体系" prop="systemTag" :formatter="nullFormatter">
                        <template slot-scope="scope">
                            <span v-for="item in systemTagList" :key="item.key" v-if="item.key===scope.row.systemTag">{{item.value}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="品牌" prop="brandId" :formatter="nullFormatter">
                        <template slot-scope="scope">                  
                            <span>{{getBrandVal(scope.row.brandId)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="合作方式" prop="deptAttr" :formatter="nullFormatter" v-if="version==2"></el-table-column>
                    <el-table-column label="流程名称" prop="name"></el-table-column>
                    <el-table-column label="流程类型" prop="type">
                        <template slot-scope="scope">
                            <span v-for="item in dictionary['573']" :key="item.key" v-if="item.key===scope.row.type">{{item.value}}</span>                            
                        </template>
                    </el-table-column>
                    <el-table-column label="分支条件" prop="branchCondition">
                        <template slot-scope="scope">
                            <span>{{scope.row.conditionName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="分支节点" prop="name">
                        <template slot-scope="scope">
                            <p v-for="item in scope.row.branch" :key="item.sort">{{item.name?item.name:'无需审核'}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="medium" @click="operation(scope.row)" v-if="power['sign-set-verify'].state">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
            v-show="tableData.length>0"
            class="pagination-info"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </div>
        <!-- 添加 编辑 弹窗 -->
        <el-dialog :title="aduitTitle" :visible.sync="aduitDialog" width="740px" :closeOnClickModal="$tool.closeOnClickModal">
            <div class="aduit-content">
                <div class="row">
                    <div class="aduit-input must w50">
                        <label>交易类型:</label>
                        <el-select size="small" v-model="aduitForm.modularType" disabled>
                            <el-option v-for="item in dictionary['711']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </div>
                    <div class="aduit-input must w50">
                        <label>体系:</label>
                        <el-select size="small" v-model="aduitForm.systemTag" :disabled="editDisabled" @change="changeSystemFn">
                            <el-option v-for="item in systemTagSelect" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </div>
                    <div class="aduit-input w50" v-if="aduitForm.modularType==0">
                        <label>品牌:</label>
                        <el-select size="small" v-model="aduitForm.brandId" :clearable="true">
                            <el-option v-for="item in dictionary['735']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </div>
                    <div class="aduit-input must w50" v-if="version==2&&aduitForm.modularType==0">
                        <label>合作方式:</label>
                        <el-select size="small" v-model="aduitForm.deptAttr" :disabled="editDisabled">
                            <el-option v-for="item in dictionary['73']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </div>
                    <div class="aduit-input must w50">
                        <label>流程类型:</label>
                        <el-select size="small" v-model="aduitForm.type" @change="changeFlowTypeTwo" :disabled="editDisabled" @clear="clearCondition(2)" :clearable="true" filterable>
                            <el-option v-for="item in dictionary['573']" v-if="aduitForm.modularType==0?item.key!=4:item.key==1" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </div>
                    <div class="aduit-input must w50">
                        <label>分支条件:</label>
                        <el-select size="small" v-model="aduitForm.branchCondition" :disabled="editDisabled">
                            <el-option v-for="item in conditionList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </div>
                    <div class="aduit-input must w50">
                        <label>流程名称:</label>
                        <el-input size="small" maxlength="15" v-model.trim="aduitForm.name" onkeyup="value=value.replace(/\s+/g,'')" clearable></el-input>
                    </div>
                </div>
                <div class="aduit-node">
                    <div class="must">
                        <label>分支节点:</label>
                        <el-radio-group v-model="isAudit" @change="aduitChange">
                            <el-radio label="1">需要审核</el-radio>
                            <el-radio label="0">无需审核</el-radio>
                        </el-radio-group>
                    </div>
                    <ul v-if="isAudit==='1'">
                        <li v-for="(item,index) in nodeList" :key="index">
                            <div class="node-body">
                                <el-input size="small" class="w143" v-model.trim="item.name" maxlength="15" placeholder="设置节点名称" onkeyup="value=value.replace(/\s+/g,'')" clearable></el-input>
                                <el-select size="small" class="w143" v-model="item.type" placeholder="请选择审批人类型" @change="checkSystemFn(index)" clearable @clear="clearFn(index)">
                                    <el-option v-for="m in aduitTypeArr" :key="m.key" :label="m.value" :value="m.key" :disabled="forbidFn(item.type,m.key)"></el-option>
                                </el-select>
                                <!-- 人员 -->
                                <div v-if="item.type===0" class="person">
                                    <select-tree :systemKey="String(aduitForm.systemTag)" :init="item.depName" @checkCell="depHandleClick($event,index)" @clear="clearDep(index)" @search="searchDep($event,index)"></select-tree>
                                    <el-select class="person-right" :clearable="true" v-loadmore="moreEmploye1" size="small"
                                    v-model="item.personArr" placeholder="请选择" filterable multiple @change="multiSelect(item.type,index)" @focus="getNodeIndex(index)">
                                        <el-option
                                        v-for="e in item.employeList"
                                        :key="e.empId"
                                        :label="e.name"
                                        :value="e.empId">
                                        </el-option>
                                    </el-select>
                                </div>
                                <!-- 部门名称 -->
                                <div v-if="item.type===1">
                                    <el-select size="small" class="other" v-model="item.depArr" filterable multiple @change="multiSelect(item.type,index)">
                                        <el-option
                                        v-for="option in depsList"
                                        :key="option.id"
                                        :label="option.name"
                                        :value="option.id"
                                        ></el-option>
                                    </el-select>  
                                </div>
                                <!-- 角色 -->
                                <el-select size="small" v-if="item.type===2" class="other" v-model="item.roleArr" filterable multiple @change="multiSelect(item.type,index)">
                                    <el-option
                                    v-for="option in roleList"
                                    :key="option.key"
                                    :label="option.value"
                                    :value="option.key"
                                    ></el-option>
                                </el-select>
                                <!-- 部门类型+职级 -->
                                <div v-if="item.type===4&&version==3">
                                    <div class="person">
                                        <el-select size="small" placeholder="请选择部门类型" v-model="item.depType" filterable @change="getDepStr($event,index)">
                                            <el-option
                                            v-for="option in dictionary['660']"
                                            :key="option.key"
                                            :label="option.value"
                                            :value="option.key"
                                            ></el-option>
                                        </el-select>
                                        <el-select class="person-right" size="small" placeholder="请选择职级类型" v-if="item.depType" v-model="item.depTypeArr" filterable multiple @change="multiSelect(item.type,index)">
                                            <el-option v-for="item in dictionary['659']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="row-icon">
                                    <span class="button" @click="addRow"><i class="icon el-icon-plus"></i></span>
                                    <span class="button" @click="removeRow(index)"><i class="icon el-icon-minus"></i></span>
                                </div>
                            </div>
                            <div class="default" v-show="item.choice&&item.choice.length>0&&index!==0">
                                <div class="mo-ren">选择默认审核人:<span>（温馨提示：建议添加不少于两个审核人）</span></div>
                                <div class="multiple" ref="curChoice">
                                    <span
                                    v-for="(ele,m) in item.choice"
                                    :key="m"
                                    @click="defaultChoice(index,m,ele)"
                                    :class="{'cur-select':ele.isDefault===1}">
                                    {{ele.type===0?"人员-":ele.type===1?"部门-":ele.type===2?"角色-":""}}{{ele.temp?ele.type===4?ele.temp+'-'+ele.positionName:ele.temp+'-'+ele.userName:ele.userName}}
                                        <i class="el-icon-close" @click.stop="delChoice(index,item.choice,m)"></i>
                                    </span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="aduit-input pr-80">
                    <label class="mr-7">流程描述:</label>
                    <el-input type="textarea" maxlength="150" v-model.trim="aduitForm.flowDesc"></el-input>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isSave" v-dbClick type="primary">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {FILTER} from "@/assets/js/filter";
    import {MIXINS} from "@/assets/js/mixins";
    let arr = [
        {
            name: "提审人",
            type: 0,
            sort: 1,
            isAudit: "1",
            userId: "",
            userName: "",
            personArr: [],
            depArr: [],
            depTypeArr: [],
            roleArr: [],
            choice: []
        },
        {
            name: "", //节点名称
            type: "", //节点审批人类型
            sort: "",
            isAudit: "1",
            depId: "", //人员=>部门id
            depName: "", //人员=>部门name
            personArr: [], //人员多选数组
            depArr: [], //部门多选数组
            depTypeArr: [], //3.0部门类型+职级多选数组
            roleArr: [], //角色多选数组
            choice: [], //默认审核人数组
            peopleTime: 1, //人员多选次数
            depsTime: 1, //部门多选次数
            depTypeTime: 1, //3.0部门类型+职级多选次数
            rolesTime: 1, //角色多选次数
            employeList:[], //人员列表
            employeeTotal:0,
            employeePage:1,
            depType: "", //3.0部门类型+职级id
            depTypeStr: "" //3.0部门类型+职级名称
        }
    ]

    export default {
        name: "approvalProcess",
        mixins: [FILTER,MIXINS],
        data() {
            return {
                searchForm: {
                    cityId: "",
                    name: "",
                    deptAttr: "",
                    type: "",
                    branchCondition: "",
                    systemTag: "",
                    modularType: "",
                    brandId: ""
                },
                tableData: [],
                aduitDialog: false,
                aduitTitle: "",
                aduitForm: {
                    modularType: "",
                    deptAttr: "",
                    name: "",
                    type: "",
                    branchCondition: "",
                    flowDesc: "",
                    systemTag: "",
                    brandId: ""
                },
                isAudit: "",
                nodeList: [],
                dictionary: {
                    '73':'', //合作方式
                    '573':'', //流程类型
                    '659':'职级类型',
                    '660':'部门类型',
                    '711':'交易类型',
                    '735':'品牌'
                },
                aduitTypeArr: [], // 审批人类型
                pageSize: 10,
                pageNum: 1,
                total: 0,
                homeConditionList: [],
                conditionList: [],
                depsList: [],
                roleList: [],
                editDisabled: false,
                currentFlowId: "",
                tempAudit: "",
                tempNodeList: [],
                copyNodeList: [],
                nodeIndex: null,
                power: {
                    'sign-set-verify': {
                        state: false,
                        name: '查询'
                    }
                },
                branchObj: {} //分支条件
            }
        },
        mounted() {
            this.searchForm.cityId = this.cityInfo.cityId
            this.getDictionary()
            let res=this.getDataList
            if(res&&(res.route===this.$route.path)){
                this.tableData = res.data.data
                this.total = res.data.total
                let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
                this.searchForm = session.query
                this.pageNum = session.query.pageNum
                delete this.searchForm.pageNum
                delete this.searchForm.pageSize
            }else{
                this.getData()
            }
            // 获取体系
            this.getSystemTag()
            this.getSystemTagSelect()
            this.getAduitType()
            this.getBranchObj()
            // 2.0环境且登录城市不是温州才请求角色数据
            if(this.searchForm.cityId != 16 && this.version == 2) this.getRoles()
        },
        methods: {
            clearFn(i) {
                this.$set(this.nodeList,[i],JSON.parse(JSON.stringify(arr[1])))
            },
            forbidFn(type,k) {
                // 添加审核人 部门不能和其他类型组合
                if(type===1) {
                    return k!==1?true:false
                } else {
                    return k===1&&type!==''?true:false
                }
            },
            getBrandVal(val) {
                if(val) {
                    let item = this.dictionary['735']
                    for(let i = 0; i < item.length; i++) {
                        if(val === item[i].key) {
                            return item[i].value
                            break
                        }
                    }
                } else {
                    return '--'
                }
            },
            // 分支节点选择
            aduitChange(val) {
                if(this.aduitTitle === "添加") {
                    if(val === "1") {
                       this.nodeList = JSON.parse(JSON.stringify(arr))
                    } else {
                        this.nodeList = []
                    }
                } else {
                    if(val !== this.tempAudit) {
                        this.nodeList = JSON.parse(JSON.stringify(arr))
                    } else {
                        this.nodeList = this.tempNodeList
                    }
                }
            },
            // 判断是否选择了体系
            checkSystemFn(i) {
                if(!this.aduitForm.systemTag) {
                    this.nodeList[i].type = ""
                    this.$message('请先选择体系')
                }else{
                    let type = this.nodeList[i].type //当前节点选择的审批人类型
                    let key = this.aduitForm.systemTag //选择的体系
                    if(type == 1) { //部门
                        this.getDeps(key)
                    }
                }
            },
            // 改变体系初始化节点数据
            changeSystemFn() {
                this.nodeList = JSON.parse(JSON.stringify(arr))
            },
            getData(type="init") {
                let param = {
                    pageSize: this.pageSize,
                    pageNum: this.pageNum
                }
                param = Object.assign({},this.searchForm,param)

                //点击查询时，缓存筛选条件
                if(type==='search'){
                    sessionStorage.setItem('sessionQuery',JSON.stringify({
                        path:'/approvalProcess',
                        url:'/auditflow/selectFlowList',
                        query:param,
                        methods:"get"
                    }))
                }

                this.$ajax.get('/api/auditflow/selectFlowList',param).then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.tableData = res.data.data
                        this.total = res.data.total
                    }
                }).catch(error => {
                    this.$message({message:error})
                })
            },
            // 审批人类型
            getAduitType() {
                this.$ajax.get('/api/auditflow/getApprovalType').then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.aduitTypeArr = res.data.children
                    }
                }).catch(error => {
                    this.$message({message:error})
                })
            },
            // 分支条件数据
            getBranchObj() {
                this.$ajax.get('/api/auditflow/getAuditBranch').then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.branchObj = res.data
                    }
                }).catch(error => {
                    this.$message({message:error})
                })
            },
            // 部门数据
            getDeps(key) {
                this.$ajax.get('/api/organize/systemtag/deps', {systemTag:key}).then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.depsList = res.data
                    }
                })
            },
            // 角色数据
            getRoles() {
                this.$ajax.get('/api/roles').then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.roleList = res.data
                    }
                })
            },
            clearDep: function (index) {
                this.nodeList[index].depId = ""
                this.nodeList[index].depName = ""
                this.nodeList[index].employeList = []
                this.nodeList[index].employeePage = 1
                this.clearSelect()
            },
            getNodeIndex(index) {
                this.nodeIndex = index
            },
            // 下拉加载更多人员
            moreEmploye1() {
                if(this.nodeList[this.nodeIndex].employeList.length>=this.nodeList[this.nodeIndex].employeeTotal){
                    return
                }else {
                    this.depHandleClick(this.nodeList[this.nodeIndex],this.nodeIndex,++this.nodeList[this.nodeIndex].employeePage)
                }
            },
            // 审批人类型为人员时 选中部门后 人员列表请求
            depHandleClick(data,index,page=1) {
                // 重新选择了部门后清空人员列表 下拉加载更多人员不清空
                if(this.dep.id&&this.dep.id!==data.depId) {
                    this.nodeList[index].employeList = []
                    this.nodeList[index].employeePage = 1
                }
                this.dep.id = data.depId
                this.dep.name = data.name
                this.nodeList[index].depId = data.depId
                this.nodeList[index].depName = data.name
                this.$ajax.get('/api/organize/employees/pages',{depId:data.depId,pageNum:page,selectSubs:false}).then(res=>{
                    res=res.data
                    if(res.status===200){
                        this.nodeList[index].employeList = this.nodeList[index].employeList.concat(res.data.list)
                        this.nodeList[index].employeeTotal = res.data.total
                    }
                })
            },
            searchDep:function (payload,index) {
                // this.DepList = payload.list
                // this.nodeList[index].depName = payload.depName
            },
            addFn(command) {
                this.aduitDialog = true
                this.aduitTitle = '添加'
                this.$tool.clearForm(this.aduitForm)
                this.aduitForm.modularType = command
                this.isAudit = ""
                this.tempAudit = ""
                this.editDisabled = false
                this.conditionList = []
            },
            operation(row) {
                this.aduitDialog = true
                this.aduitTitle = '编辑'
                let {...c_row} = row
                this.currentFlowId = c_row.id
                this.aduitForm.modularType = c_row.modularType
                this.aduitForm.deptAttr = c_row.deptAttr ? c_row.deptAttr.value : ""
                this.aduitForm.systemTag = c_row.systemTag ? c_row.systemTag : ""
                this.aduitForm.brandId = c_row.brandId ? c_row.brandId : ""
                this.aduitForm.name = c_row.name
                this.aduitForm.type = c_row.type
                this.aduitForm.branchCondition = +c_row.branchCondition.split('=')[1]
                this.isAudit = c_row.branch[0].isAudit.toString()
                this.tempAudit = this.isAudit
                this.aduitForm.flowDesc = c_row.flowDesc
                this.setConditionList(c_row.type,2)
                this.editDisabled = true
                this.dep.id = ""
                this.dep.name = ""
                let item = JSON.parse(JSON.stringify(c_row.branch)) //节点数据
                let array = []
                array.unshift(item[0])
                for(let i = 1; i < item.length; i++) { //需要审核即有节点时处理数据
                    array.push({
                        name: item[i].name,
                        type: item[i].type,
                        sort: item[i].sort,
                        isAudit: item[i].isAudit,
                        depId: "",
                        depName: "",
                        personArr: JSON.parse(item[i].personArr),
                        depArr: JSON.parse(item[i].depArr),
                        depTypeArr: item[i].depTypeArr?JSON.parse(item[i].depTypeArr):[],
                        roleArr: JSON.parse(item[i].roleArr),
                        choice: JSON.parse(item[i].choice),
                        employeList:[],
                        employeeTotal:0,
                        employeePage:1
                    })
                }
                for(let i = 1; i < array.length; i++) { //需要审核即有节点时处理数据
                    Object.assign(array[i],{
                        peopleTime: array[i].personArr.length + 1,
                        depsTime: array[i].depArr.length + 1,
                        depTypeTime: array[i].depTypeArr.length + 1,
                        rolesTime: array[i].roleArr.length + 1,
                        depType: array[i].choice.filter(e => e.type===4).length?array[i].choice.filter(e => e.type===4)[array[i].choice.filter(e => e.type===4).length-1].userId:'',
                        depTypeStr: array[i].choice.filter(e => e.type===4).length?array[i].choice.filter(e => e.type===4)[array[i].choice.filter(e => e.type===4).length-1].userName:'',
                        lastChoice: array[i].choice.filter(e => e.isDefault===1)[0],
                    })
                }
                this.nodeList = array
                this.tempNodeList = JSON.parse(JSON.stringify(array))
                this.getDeps(this.aduitForm.systemTag)
            },
            setConditionList(val,type=1) {
                for(let key in this.branchObj) {
                    if(val == key) {
                        this[type==1?'homeConditionList':'conditionList'] = this.branchObj[key]
                        break
                    }
                }
            },
            changeFlowTypeOne(val) {
                this.searchForm.branchCondition = ""
                this.setConditionList(val)
            },
            changeFlowTypeTwo(val) {
                this.aduitForm.branchCondition = ""
                this.setConditionList(val,2)
            },
            // 3.0环境获取部门类型
            getDepStr(e,i) {
                this.dictionary['660'].find(item => {
                    if(e == item.key) {
                        this.nodeList[i].depTypeStr = item.value
                    }
                })
                this.nodeList[i].depTypeArr = []
                let arr = this.nodeList[i].choice.filter(item => item.userId === this.nodeList[i].depType)
                arr.forEach(item => this.nodeList[i].depTypeArr.push(item.positionId))
                this.nodeList[i].depTypeTime = arr.length + 1
            },
            // 选中默认审核人
            defaultChoice(index,e,curItem) {
                let allChoice = this.$refs.curChoice[index].children
                for(var i = 0; i < allChoice.length; i++) {
                    allChoice[i].classList.remove('cur-select')
                }
                allChoice[e].classList.add('cur-select')
                let curNodeChoice = this.nodeList[index].choice
                for(var i = 0; i < curNodeChoice.length; i++) {
                    curNodeChoice[i].isDefault = 0
                }
                curNodeChoice[e].isDefault = 1
                this.nodeList[index].lastChoice = curItem
            },
            // 删除审核人
            delChoice(index,choiceArr,m) {
                let s_arr = 'personArr'
                let s_id = 'userId'
                let s_t = 'peopleTime'
                if(choiceArr[m].type === 1) {
                    s_arr = 'depArr'
                    s_t = 'depsTime'
                } else if(choiceArr[m].type === 2) {
                    s_arr = 'roleArr'
                    s_t = 'rolesTime'
                } else if(choiceArr[m].type === 4) {
                    s_arr = 'depTypeArr'
                    s_t = 'depTypeTime'
                    s_id = 'positionId'
                }
                for(var i = 0; i < this.nodeList[index][s_arr].length; i++) {
                    if(choiceArr[m][s_id] === this.nodeList[index][s_arr][i]) {
                        this.nodeList[index][s_arr].splice(i,1)
                        this.$set(this.nodeList[index],s_t,this.nodeList[index][s_t] - 1)
                        break
                    }
                }
                choiceArr.splice(m,1)
                let arr = choiceArr.filter(item => item.isDefault===1)
                if(arr.length===0) {
                    delete this.nodeList[index].lastChoice
                }
            },
            getArrDiff(m, n) {
                return m.concat(n).filter(function(v, i, arr) {
                    return arr.indexOf(v) === arr.lastIndexOf(v)
                })
            },
            multiDel(index,type,ar,t) {
                let arr = this.nodeList[index].choice.filter(item => {
                    return type !==4 ? item.type === type : item.type === type && item.userId === this.nodeList[index].depType
                })
                let arr1 = []
                arr.forEach(item => {
                    arr1.push(type !== 4 ? item.userId : item.positionId)
                })
                let arr2 = this.getArrDiff(arr1,this.nodeList[index][ar])
                this.nodeList[index].choice.forEach((item,i) => {
                    if(type !== 4 ? item.userId === arr2[0] : item.positionId === arr2[0] && item.userId === this.nodeList[index].depType) {
                        this.nodeList[index].choice.splice(i,1)
                        this.$set(this.nodeList[index],t,this.nodeList[index][t] - 1)
                    }
                })
            },
            multiSelect(type,index) {
                if(type === 0) {
                    // 人员
                    if(this.nodeList[index].peopleTime === this.nodeList[index].personArr.length) {
                        for(var i = 0; i < this.nodeList[index].employeList.length; i++) {
                            if(this.nodeList[index].personArr[this.nodeList[index].peopleTime-1] === this.nodeList[index].employeList[i].empId) {
                                this.nodeList[index].choice.push({
                                    type: 0,
                                    userName: this.nodeList[index].employeList[i].name,
                                    userId: this.nodeList[index].employeList[i].empId,
                                    isDefault: 0,
                                    temp: this.nodeList[index].depName
                                })
                                break
                            }
                        }
                        ++this.nodeList[index].peopleTime
                    } else {
                        this.multiDel(index,type,'personArr','peopleTime')
                    }
                } else if(type === 1) {
                    // 部门名称
                    if(this.nodeList[index].depsTime === this.nodeList[index].depArr.length) {
                        this.$ajax.get('/api/organize/selectEmpByDepType', { depId: this.nodeList[index].depArr[this.nodeList[index].depsTime-1] }).then(res => {
                            res = res.data
                            if(res.status === 200) {
                                if(res.data>0) {
                                    for(var i = 0; i < this.depsList.length; i++) {
                                        if(this.nodeList[index].depArr[this.nodeList[index].depsTime-1] === this.depsList[i].id) {
                                            if(this.version == 2) {
                                                this.nodeList[index].choice.push({
                                                    type: 1,
                                                    userName: this.depsList[i].name,
                                                    userId: this.depsList[i].id,
                                                    isDefault: 0,
                                                    temp: ""
                                                })  
                                            } else {
                                                // 3.0环境后台要求多两个属性
                                                this.nodeList[index].choice.push({
                                                    type: 1,
                                                    userName: this.depsList[i].name,
                                                    userId: this.depsList[i].id,
                                                    isDefault: 0,
                                                    temp: "",
                                                    positionId: null,
                                                    positionName: null
                                                })
                                            }
                                            break
                                        }
                                    }
                                    ++this.nodeList[index].depsTime
                                } else {
                                    this.$message({message:"该部门下没有人员，请选择其他部门"})
                                    this.nodeList[index].depArr.splice(this.nodeList[index].depArr.length-1,1)
                                }
                            }
                        })
                    } else {
                        this.multiDel(index,type,'depArr','depsTime')
                    }
                } else if(type === 2) {
                    // 角色
                    if(this.nodeList[index].rolesTime === this.nodeList[index].roleArr.length) {
                        for(var i = 0; i < this.roleList.length; i++) {
                            if(this.nodeList[index].roleArr[this.nodeList[index].rolesTime-1] === this.roleList[i].key) {
                                this.nodeList[index].choice.push({
                                    type: 2,
                                    userName: this.roleList[i].value,
                                    userId: this.roleList[i].key,
                                    isDefault: 0,
                                    temp: ""
                                })
                                break
                            }
                        }
                        ++this.nodeList[index].rolesTime
                    } else {
                        this.multiDel(index,type,'roleArr','rolesTime')
                    }
                } else if(type === 4) {
                    // 3.0环境 审批人类型是 部门类型+职级
                    if(this.nodeList[index].depTypeTime === this.nodeList[index].depTypeArr.length) {
                        let url = "/api/organize/selectEmpByDepType"
                        this.checkEmp(url,type,index,'depTypeArr','depTypeTime','depType','depTypeStr')
                    } else {
                        this.multiDel(index,type,'depTypeArr','depTypeTime')
                    }
                }
                let ar = this.nodeList[index].choice.filter(item => item.isDefault===1)
                if(ar.length===0) {
                    delete this.nodeList[index].lastChoice
                }
            },
            // 验证职级下是否有人
            checkEmp(url,type,index,ar,t,id_,s) {
                let zhijiArr = []
                for(var i = 0; i < this.dictionary['659'].length; i++) {
                    if(this.nodeList[index][ar][this.nodeList[index][t]-1] === this.dictionary['659'][i].key) {
                        zhijiArr = this.dictionary['659'][i]
                        break
                    }
                }
                let param = {
                    positionId: zhijiArr.key,
                    depTypeId: this.nodeList[index][id_]
                }
                this.$ajax.get(url, param).then(res => {
                    res = res.data
                    if(res.status === 200) {
                        if(res.data) {
                            this.nodeList[index].choice.push({
                                type,
                                userName: this.nodeList[index][s],
                                userId: this.nodeList[index][id_],
                                isDefault: 0,
                                temp: this.nodeList[index][s],
                                positionId: zhijiArr.key,
                                positionName: zhijiArr.value
                            })
                            ++this.nodeList[index][t]
                        } else {
                            this.$message({message:"该职级下没有人，请选择其他职级"})
                            this.nodeList[index][ar].splice(this.nodeList[index][ar].length-1,1)
                        }
                    }
                })
            },
            // 新增节点
            addRow() {
                this.nodeList.push(JSON.parse(JSON.stringify(arr[1])))
            },
            // 删除节点
            removeRow(index) {
                this.nodeList.splice(index,1)
            },
            isSave() {
                if(this.aduitForm.modularType !== '') {
                    if(!this.aduitForm.systemTag) {
                        this.$message({message:"体系不能为空"})
                        return
                    }
                    if(this.version == 2) {
                        if(!this.aduitForm.deptAttr&&this.aduitForm.modularType==0) {
                            this.$message({message:"合作方式不能为空"})
                            return
                        }
                    }
                    if(this.aduitForm.type!=="") {
                        if(this.aduitForm.branchCondition!=="") {
                            if(this.aduitForm.name) {
                                if(!this.isAudit) {
                                    this.$message({message:"请选择分支节点"})
                                    return false
                                }
                            } else {
                                this.$message({message:"流程名称不能为空"})
                                return false
                            }
                        } else {
                            this.$message({message:"分支条件不能为空"})
                            return false
                        }
                    } else {
                        this.$message({message:"流程类型不能为空"})
                        return false
                    }
                } else {
                    this.$message({message:"交易类型不能为空"})
                    return false
                }
                let isOk
                let item
                if(this.isAudit === '0') { //无需审核
                    let arr1 = [{
                        name: "",
                        type: "",
                        sort: 1,
                        userId: "",
                        userName: "",
                        isAudit: "0"
                    }]
                    item = arr1
                } else { //需要审核
                    this.copyNodeList = JSON.parse(JSON.stringify(this.nodeList))
                    item = [...this.nodeList]
                    for(let i = 1; i < item.length; i++) {
                        isOk = false
                        if(item[i].name) {
                            if(item[i].type !== "") {
                                if(item[i].choice.length>0) {
                                    if(item[i].lastChoice) {
                                        isOk = true
                                    } else {
                                        this.$message({message:"每一个分支节点下必须选择一个默认审核人"})
                                        break
                                    }
                                } else {
                                    this.$message({message:"请添加审核人"})
                                    break
                                }
                            } else {
                                this.$message({message:"请选择审批人类型"})
                                break
                            }
                        } else {
                            this.$message({message:"节点名称不能为空"})
                            break
                        }
                    }
                    if(isOk) {
                        for(let i = 1; i < item.length; i++) {
                            delete item[i].depId
                            delete item[i].depName
                            delete item[i].peopleTime
                            delete item[i].depsTime
                            delete item[i].depTypeTime
                            delete item[i].rolesTime
                            delete item[i].employeList
                            delete item[i].employeeTotal
                            delete item[i].employeePage
                            delete item[i].depType
                            delete item[i].depTypeStr
                            item[i].type = item[i].lastChoice.type
                            item[i].userName = item[i].lastChoice.userName
                            item[i].userId = item[i].lastChoice.userId
                            delete item[i].lastChoice
                        }
                    }
                }
                let param = {
                    branch: item
                }
                param = Object.assign({},this.aduitForm,param)
                param.cityId = this.searchForm.cityId

                if(isOk || this.isAudit === '0') {
                    if(this.aduitTitle === "添加") {
                        const msg = "添加成功"
                        this.aduitPost(param,msg)
                    } else {
                        param.id = this.currentFlowId
                        const msg = "修改成功"
                        this.aduitPost(param,msg)
                    }
                }
            },
            aduitPost(param,msg) {
                this.$ajax.postJSON('/api/auditflow/operateFlow',param).then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.aduitDialog = false
                        this.$message(msg)
                        this.getData()
                    }
                }).catch(error => {
                    this.$message({message:error})
                    this.nodeList = this.copyNodeList
                })
            },
            queryFn() {
                this.pageNum = 1
                this.getData('search')
            },
            resetFormFn() {
                this.$tool.clearForm(this.searchForm)
                this.homeConditionList = []
                this.pageNum = 1
            },
            clearCondition(type=1) {
                type === 1 ? this.homeConditionList = [] : this.conditionList = []
            },
            handleCurrentChange(val) {
                this.pageNum = val
                this.getData()
            }
        },
        watch: {
            branchObj(val){
                let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
                if(val&&session!=null){
                    this.setConditionList(this.searchForm.type)
                }
            }
        },
        computed: {
            cityInfo(){
                return this.getUser.user
            },
            // 获取版本号
            version(){
                return this.getUser.version
            }
        }
    }
</script>

<style lang="less" scoped>
@import "~@/assets/common.less";
.content {
    display: flex;
    flex-wrap: wrap;
    color: #6C7986;
    .input-search {
        display: flex;
        align-items: center;
        margin-right: 20px;
        margin-bottom: 10px;
        .w-70 {
            min-width: 70px;
        }
        .mr-20 {
            margin-right: 13px;
        }
        .ml-10 {
            margin-left: 10px;
        }
    }
}
.aduit-list {
    padding: 5px 10px 0px;
    > p {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: @size-14;
    margin-bottom: 5px;
    .mr-8 {
      margin-right: 8px;
    }
    > .el-button {
      width:80px;
      height:32px;
      padding: 4px 0;
      border-radius:18px;
      color: #fff;
    }
  }
}
.aduit-content {
    .row {
        display: flex;
        flex-wrap: wrap;
    }
    .aduit-input {
        display: flex;
        margin-bottom: @margin-10;
        > label {
            width: 70px;
            line-height: 32px;
            text-align: right;
        }
        .mr-7 {
            margin-left: 6px;
        }
        &.w50 {
            width: 50%;
            /deep/ .el-select, .el-input {
                width: 68%;
            }
        }
        &:last-child {
            /deep/ .el-textarea__inner {
                background-color: #ECEFF2;
            }
        }
        &.pr-80 {
            padding-right: 80px;
        }
    }
    .must {
        >label::before {
            content: "*";
            color: red;
            margin-right: 1px;
        }
    }
    .aduit-node {
        > div {
            margin-bottom: 10px;
            label {
                margin-right: 10px;
            }
        }
        ul {
            padding-right: 80px;
            li {
                padding: 5px;
                margin-bottom: 9px;
                background-color: #EDEDED;
                position: relative;
                .node-body {
                    display: flex;
                    /deep/ .el-tag__close {
                        display: none;
                    }
                }
                .w143 {
                    width: 143px;
                    margin-right: 9px;
                }
                .person {
                    display: flex;
                    /deep/ .el-input {
                        width: 150px!important;
                    }
                    &-right {
                        margin-left: 9px;
                    }
                    /deep/ .el-icon-circle-close {
                        display: none;
                    }

                }
                .other {
                    /deep/ .el-input {
                        width: 309px;
                    }
                }
                .row-icon {
                    width: 65px;
                    position: absolute;
                    right: -70px;
                    top: 5px;
                    display: flex;
                    justify-content: space-between;
                    .button {
                        display: inline-block;
                        padding: 0;
                        width: 30px;
                        height: 30px;
                        line-height: 30px;
                        background: #c8c8c8;
                        border-radius: 50%;
                        text-align: center;
                        cursor: pointer;
                        i {
                            color: #fff;
                            font-weight: bold;
                        }
                    }
                }
                .default {
                    >.mo-ren {
                        padding: 5px 10px;
                        span {
                            color: #949494;
                        }
                    }
                    .multiple {
                        background-color: #fff;
                        padding: 10px;
                        max-height: 60px;
                        overflow: auto;
                        >span {
                            height: 28px;
                            display: inline-block;
                            border: 1px solid #E4E4E4;
                            text-align: center;
                            line-height: 28px;
                            background-color: #F7F7F7;
                            margin-bottom: 10px;
                            margin-right: 25px!important;
                            padding: 0 5px;
                            position: relative;
                            &:nth-child(4n) {
                                margin-right: 0;
                            }
                            i {
                                width: 16px;
                                height: 16px;
                                line-height: 16px;
                                background-color: #9B9B9B;
                                position: absolute;
                                border-radius: 50%;
                                font-size: 10px;
                                color: #fff;
                                top: -5px;
                                right: -10px;
                                display: none;
                                cursor: pointer;
                            }
                            &:hover > i {
                                display: inherit;
                            }
                        }
                    }
                }
                &:first-child {
                    display: none;
                }
                &:nth-child(2) {
                    .row-icon {
                        span:last-child {
                            display: none;
                        }
                    }
                }
                &:last-child {
                    margin-bottom: 10px;
                }
            }
        }
        /deep/ .el-select__tags {
            .el-tag {
                display: none;
            }
        }
    }
}
.cur-select {
    background-color: #F3F7FC!important;
    color: #478DE3;
    border-color: #478DE3!important;
}
/deep/ .el-table th {
  background:#EEF2FB;
}
/deep/ .el-dialog__header {
    border-bottom: 1px solid #EDECF0;
}
/deep/ .el-dialog__body {
    max-height: 400px;
    overflow: auto;
    padding-top: 10px;
}
/deep/ .el-dialog__footer {
    padding-right: 10px;
    .el-button {
        width: 100px;
        height: 38px;
        border-radius: 19px;
        color: #fff;
    }
}
</style>
