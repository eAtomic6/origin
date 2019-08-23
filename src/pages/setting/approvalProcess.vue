<template>
    <div ref="tableComView">
        <ScreeningTop
        @propQueryFn="queryFn"
        @propResetFormFn="resetFormFn">
        <div class="content">
            <!-- <div class="input-group">
                <label>选择城市</label>
                <el-select size="small" v-model="searchForm.cityId" :clearable="true">
                    <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.cityId"></el-option>
                </el-select>
            </div> -->
            <div class="input-group">
                <label>合作方式</label>
                <el-select size="small" v-model="searchForm.deptAttr" :clearable="true">
                    <el-option v-for="item in dictionary['39']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
            </div>
            <div class="input-group">
                <label>流程名称</label>
                <el-input size="small" v-model="searchForm.name" :clearable="true" onkeyup="value=value.replace(/\s+/g,'')"></el-input>
            </div>
            <div class="input-group">
                <label>流程类型</label>
                <el-select size="small" v-model="searchForm.type" @change="changeFlowTypeOne" :clearable="true" @clear="clearCondition">
                    <el-option v-for="item in dictionary['573']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
                <el-select size="small" v-model="searchForm.branchCondition" :clearable="true" class="branch-condition">
                    <el-option v-for="item in homeConditionList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
            </div>
        </div>
        </ScreeningTop>
        <div class="aduit-list">
            <p v-if="power['sign-set-verify'].state">
                <span><i class="iconfont icon-tubiao-11 mr-8"></i>数据列表</span>
                <el-button @click="operation('添加',1)" type="primary">添加</el-button>
            </p>
            <div class="table">
                <el-table :data="tableData" style="width: 100%" border ref="tableCom" :max-height="tableNumberCom">
                    <el-table-column align="center" label="流程名称" prop="name"></el-table-column>
                    <el-table-column align="center" label="城市" prop="cityName">
                        <template slot-scope="scope">
                            <span>{{scope.row.cityName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="合作方式" prop="deptAttr" :formatter="nullFormatter"></el-table-column>
                    <el-table-column align="center" label="流程类型" prop="type">
                        <template slot-scope="scope">
                            <span v-for="item in dictionary['573']" :key="item.key" v-if="item.key===scope.row.type">{{item.value}}</span>                            
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="分支条件" prop="branchCondition">
                        <template slot-scope="scope">
                            <span>{{scope.row.conditionName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="分支节点" prop="name">
                        <template slot-scope="scope">
                            <p v-for="item in scope.row.branch" :key="item.sort">{{item.name?item.name:'无需审核'}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="medium" @click="operation('编辑',2,scope.row)" v-if="power['sign-set-verify'].state">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
            v-show="tableData.length>0"
            class="pagination-info"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </div>
        <!-- 添加 编辑 弹窗 -->
        <el-dialog :title="aduitTitle" :visible.sync="aduitDialog" width="740px" :closeOnClickModal="$tool.closeOnClickModal" :before-close="handleClose">
            <div class="aduit-content">
                <div class="row">
                    <div class="aduit-input must">
                        <label>当前城市:</label>
                        <!-- <el-select size="small" v-model="aduitForm.cityId" :disabled="editDisabled">
                            <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.cityId"></el-option>
                        </el-select> -->
                        <el-input size="small" v-model="aduitForm.cityId" disabled></el-input>
                    </div>
                    <div class="aduit-input must">
                        <label>合作方式:</label>
                        <el-select size="small" v-model="aduitForm.deptAttr" :disabled="editDisabled">
                            <el-option v-for="item in dictionary['39']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="row">
                   <div class="aduit-input must">
                    <label>流程类型:</label>
                        <el-select size="small" v-model="aduitForm.type" @change="changeFlowTypeTwo" :disabled="editDisabled">
                            <el-option v-for="item in dictionary['573']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </div>
                    <div class="aduit-input must">
                        <label>分支条件:</label>
                        <el-select size="small" v-model="aduitForm.branchCondition" :disabled="editDisabled">
                            <el-option v-for="item in conditionList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="aduit-input must">
                    <label>流程名称:</label>
                    <el-input size="small" maxlength="15" v-model.trim="aduitForm.name" onkeyup="value=value.replace(/\s+/g,'')"></el-input>
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
                               <el-input size="small" class="w152" v-model.trim="item.name" maxlength="15" placeholder="设置节点名称" onkeyup="value=value.replace(/\s+/g,'')"></el-input>
                                <el-select size="small" class="w152" v-model="item.type">
                                    <el-option label="请选择审批人类型" value=""></el-option>
                                    <el-option v-for="m in aduitTypeArr" :key="m.key" :label="m.value" :value="m.key"></el-option>
                                </el-select>
                                <div v-if="item.type===0" class="person">
                                    <select-tree :data="DepList" :init="item.depName" @checkCell="depHandleClick($event,index)" @clear="clearDep(index)" @search="searchDep($event,index)"></select-tree>
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
                                <el-select size="small" v-if="item.type===1" class="other" v-model="item.depArr" filterable multiple @change="multiSelect(item.type,index)">
                                    <el-option
                                    v-for="option in depsList"
                                    :key="option.id"
                                    :label="option.name"
                                    :value="option.id"
                                    ></el-option>
                                </el-select>
                                <el-select size="small" v-if="item.type===2" class="other" v-model="item.roleArr" filterable multiple @change="multiSelect(item.type,index)">
                                    <el-option
                                    v-for="option in roleList"
                                    :key="option.key"
                                    :label="option.value"
                                    :value="option.key"
                                    ></el-option>
                                </el-select>
                                <div class="row-icon">
                                    <span class="button" @click="addRow"><i class="icon el-icon-plus"></i></span>
                                    <span class="button" @click="removeRow(index)"><i class="icon el-icon-minus"></i></span>
                                </div>
                            </div>
                            <div class="default" v-show="item.choice&&item.choice.length>0&&index!==0">
                                <span>选择默认审核人:</span>
                                <div class="multiple" ref="curChoice">
                                    <span v-for="(ele,m) in item.choice" :key="m"
                                    @click="defaultChoice(index,m,ele)" :class="{'cur-select':ele.isDefault===1}">
                                    {{ele.type===1?"部门":ele.type===2?"角色":"人员"}}-{{ele.temp?ele.temp+'-'+ele.userName:ele.userName}}<i class="el-icon-close" @click.stop="delChoice(index,item.choice,m)"></i>
                                    </span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="aduit-input">
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
            depName: "",
            personArr: [],
            depArr: [],
            roleArr: [],
            choice: []
        },
        {
            name: "",
            type: "",
            sort: "",
            isAudit: "1",
            depName: "",
            personArr: [],
            depArr: [],
            roleArr: [],
            choice: [],
            peopleTime: 1,
            depsTime: 1,
            rolesTime: 1,
            employeList:[],
            employeeTotal:0,
            employeePage:1,
            currentDep: null
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
                    branchCondition: ""
                },
                tableData: [],
                cityList: [],
                aduitDialog: false,
                aduitTitle: "",
                aduitForm: {
                    cityId: "",
                    deptAttr: "",
                    name: "",
                    type: "",
                    branchCondition: "",
                    flowDesc: ""
                },
                isAudit: "",
                nodeList: [],
                dictionary: {
                    '39':'', //合作方式
                    '573':'', //流程类型
                    '580':'',
                    '586':'',
                    '597':'',
                    '599':'',
                    '601':'',
                    '603':''
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
                }
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
            }else{
                this.getData()
            }
            this.remoteMethod()
            this.getAduitType()
            this.getDeps()
            // 登录城市为温州时不请求角色数据
            if(this.searchForm.cityId != 16) {
               this.getRoles() 
            }
        },
        methods: {
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
            // 部门数据
            getDeps() {
                this.$ajax.get('/api/organize/deps').then(res => {
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
                    this.depHandleClick(this.nodeList[this.nodeIndex].currentDep,this.nodeIndex,++this.nodeList[this.nodeIndex].employeePage)
                }
            },
            // 审批人类型为人员时 选中部门后 人员列表请求
            depHandleClick(data,index,page=1) {
                if(this.dep.id&&this.dep.id!==data.depId){
                    this.nodeList[index].employeList = []
                    this.nodeList[index].employeePage = 1
                }
                this.nodeList[index].currentDep = data
                this.dep.id = data.depId
                this.dep.name = data.name
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
                this.DepList = payload.list
                this.nodeList[index].depName = payload.depName
            },
            handleClose(done) {
                this.nodeList = []
                this.tempNodeList = []
                done()
            },
            operation(title,type,row) {
                this.aduitDialog = true
                this.aduitTitle = title
                if(type === 1) {
                    this.$tool.clearForm(this.aduitForm)
                    this.aduitForm.cityId = this.cityInfo.cityName
                    this.isAudit = ""
                    this.tempAudit = ""
                    this.editDisabled = false
                    this.conditionList = []
                } else {
                    let {...currentRow} = row
                    this.currentFlowId = currentRow.id
                    this.aduitForm.cityId = currentRow.cityName
                    this.aduitForm.deptAttr = currentRow.deptAttr.value
                    this.aduitForm.name = currentRow.name
                    this.aduitForm.type = currentRow.type
                    this.aduitForm.branchCondition = +currentRow.branchCondition.split('=')[1]
                    this.isAudit = currentRow.branch[0].isAudit.toString()
                    this.tempAudit = this.isAudit
                    this.aduitForm.flowDesc = currentRow.flowDesc
                    this.setConditionList(currentRow.type)
                    this.editDisabled = true
                    this.dep.id = ""
                    this.dep.name = ""
                    //获取节点信息
                    let editRow = JSON.parse(JSON.stringify(currentRow.branch))
                    if(this.isAudit === "1") {
                        editRow[0].choice = JSON.parse(editRow[0].choice)
                        editRow[0].personArr = JSON.parse(editRow[0].personArr)
                        editRow[0].depArr = JSON.parse(editRow[0].depArr)
                        editRow[0].roleArr = JSON.parse(editRow[0].roleArr)
                        editRow[0].depName = ""
                        editRow[0].userId = ""
                        delete editRow[0].code
                    }
                    let array = []
                    array.unshift(editRow[0])
                    for(var i = 1; i < editRow.length; i++) {
                        array.push({
                            name: editRow[i].name,
                            type: editRow[i].type,
                            sort: editRow[i].sort,
                            isAudit: editRow[i].isAudit,
                            depName: "",
                            personArr: JSON.parse(editRow[i].personArr),
                            depArr: JSON.parse(editRow[i].depArr),
                            roleArr: JSON.parse(editRow[i].roleArr),
                            choice: JSON.parse(editRow[i].choice),
                            lastChoice: (JSON.parse(editRow[i].choice).filter(e => e.isDefault===1))[0],
                            peopleTime: JSON.parse(editRow[i].personArr).length + 1,
                            depsTime: JSON.parse(editRow[i].depArr).length + 1,
                            rolesTime: JSON.parse(editRow[i].roleArr).length + 1,
                            employeList:[],
                            employeeTotal:0,
                            employeePage:1,
                            currentDep:null
                        })
                    }
                    this.nodeList = array
                    this.tempNodeList = JSON.parse(JSON.stringify(array))
                }
            },
            setConditionList(val) {
                switch(val) {
                    case 0:
                        this.conditionList = this.dictionary['586']
                        break
                    case 1:
                        this.conditionList = this.dictionary['597']
                        break
                    case 2:
                        this.conditionList = this.dictionary['603']
                        break
                    case 3:
                        this.conditionList = this.dictionary['580']
                        break
                    case 4:
                        this.conditionList = this.dictionary['599']
                        break
                    case 5:
                        this.conditionList = this.dictionary['601']
                        break
                }
            },
            setHomeConditionList(val) {
                switch(val) {
                    case 0:
                        this.homeConditionList = this.dictionary['586']
                        break
                    case 1:
                        this.homeConditionList = this.dictionary['597']
                        break
                    case 2:
                        this.homeConditionList = this.dictionary['603']
                        break
                    case 3:
                        this.homeConditionList = this.dictionary['580']
                        break
                    case 4:
                        this.homeConditionList = this.dictionary['599']
                        break
                    case 5:
                        this.homeConditionList = this.dictionary['601']
                        break
                }
            },
            changeFlowTypeOne(val) {
                this.searchForm.branchCondition = ""
                this.setHomeConditionList(val)
            },
            changeFlowTypeTwo(val) {
                this.aduitForm.branchCondition = ""
                this.setConditionList(val)
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
                if(choiceArr[m].type === 0) {
                    for(var i = 0; i < this.nodeList[index].personArr.length; i++) {
                        if(choiceArr[m].userId === this.nodeList[index].personArr[i]) {
                            this.nodeList[index].personArr.splice(i,1)
                            this.$set(this.nodeList[index],'peopleTime',this.nodeList[index].peopleTime - 1)
                            break
                        }
                    }
                } else if(choiceArr[m].type === 1) {
                    for(var i = 0; i < this.nodeList[index].depArr.length; i++) {
                        if(choiceArr[m].userId === this.nodeList[index].depArr[i]) {
                            this.nodeList[index].depArr.splice(i,1)
                            this.$set(this.nodeList[index],'depsTime',this.nodeList[index].depsTime - 1)
                            break
                        }
                    }
                } else if(choiceArr[m].type === 2) {
                    for(var i = 0; i < this.nodeList[index].roleArr.length; i++) {
                        if(choiceArr[m].userId === this.nodeList[index].roleArr[i]) {
                            this.nodeList[index].roleArr.splice(i,1)
                            this.$set(this.nodeList[index],'rolesTime',this.nodeList[index].rolesTime - 1)
                            break
                        }
                    }
                }
                choiceArr.splice(m,1)
                let arr = choiceArr.filter(item => item.isDefault===1)
                if(arr.length===0) {
                    delete this.nodeList[index].lastChoice
                }
            },
            multiSelect(type,index) {
                function getArrDiff(m, n) {
                    return m.concat(n).filter(function(v, i, arr) {
                        return arr.indexOf(v) === arr.lastIndexOf(v)

                    })
                }
                if(type === 0) {
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
                        let arr = this.nodeList[index].choice.filter(item => {
                            return item.type === 0
                        })
                        let arr1 = []
                        arr.forEach(item => {
                            arr1.push(item.userId)
                        })
                        let arr2 = getArrDiff(arr1,this.nodeList[index].personArr)
                        this.nodeList[index].choice.forEach((item,i) => {
                            if(item.userId === arr2[0]) {
                                this.nodeList[index].choice.splice(i,1)
                                this.$set(this.nodeList[index],'peopleTime',this.nodeList[index].peopleTime - 1)
                            }
                        })
                    }
                } else if(type === 1) {
                    if(this.nodeList[index].depsTime === this.nodeList[index].depArr.length) {
                        for(var i = 0; i < this.depsList.length; i++) {
                            if(this.nodeList[index].depArr[this.nodeList[index].depsTime-1] === this.depsList[i].id) {
                                this.nodeList[index].choice.push({
                                    type: 1,
                                    userName: this.depsList[i].name,
                                    userId: this.depsList[i].id,
                                    isDefault: 0,
                                    temp: ""
                                })
                                break
                            }
                        }
                        ++this.nodeList[index].depsTime
                    } else {
                        let arr = this.nodeList[index].choice.filter(item => {
                            return item.type === 1
                        })
                        let arr1 = []
                        arr.forEach(item => {
                            arr1.push(item.userId)
                        })
                        let arr2 = getArrDiff(arr1,this.nodeList[index].depArr)
                        this.nodeList[index].choice.forEach((item,i) => {
                            if(item.userId === arr2[0]) {
                                this.nodeList[index].choice.splice(i,1)
                                this.$set(this.nodeList[index],'depsTime',this.nodeList[index].depsTime - 1)
                            }
                        })
                    }
                } else if(type === 2) {
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
                        let arr = this.nodeList[index].choice.filter(item => {
                            return item.type === 2
                        })
                        let arr1 = []
                        arr.forEach(item => {
                            arr1.push(item.userId)
                        })
                        let arr2 = getArrDiff(arr1,this.nodeList[index].roleArr)
                        this.nodeList[index].choice.forEach((item,i) => {
                            if(item.userId === arr2[0]) {
                                this.nodeList[index].choice.splice(i,1)
                                this.$set(this.nodeList[index],'rolesTime',this.nodeList[index].rolesTime - 1)
                            }
                        })
                    }
                }
                let ar = this.nodeList[index].choice.filter(item => item.isDefault===1)
                if(ar.length===0) {
                    delete this.nodeList[index].lastChoice
                }
            },
            addRow() {
                let row = {
                    name: "",
                    type: "",
                    sort: "",
                    isAudit: "1",
                    depName: "",
                    personArr: [],
                    depArr: [],
                    roleArr: [],
                    choice: [],
                    peopleTime: 1,
                    depsTime: 1,
                    rolesTime: 1,
                    employeList:[],
                    employeeTotal:0,
                    employeePage:1,
                    currentDep: null
                }
                this.nodeList.push(row)
            },
            removeRow(index) {
                this.nodeList.splice(index,1)
            },
            isSave() {
                if(this.aduitForm.cityId) {
                    if(this.aduitForm.deptAttr) {
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
                        this.$message({message:"合作方式不能为空"})
                        return false
                    }
                } else {
                    this.$message({message:"城市选择不能为空"})
                    return false
                }
                let isOk
                if(this.isAudit === '0') {
                    let arr1 = [{
                        name: "",
                        type: "",
                        sort: 1,
                        userId: "",
                        userName: "",
                        isAudit: "0"
                    }]
                    this.nodeList = arr1
                } else {
                    this.copyNodeList = JSON.parse(JSON.stringify(this.nodeList))
                    let item = this.nodeList
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
                                    this.$message({message:"请设置默认审核人"})
                                    break
                                }
                            } else {
                                this.$message({message:"审批人类型不能为空"})
                                break
                            }
                        } else {
                            this.$message({message:"节点名称不能为空"})
                            break
                        }
                    }
                    if(isOk) {
                        for(let i = 1; i < item.length; i++) {
                            delete item[i].depName
                            delete item[i].peopleTime
                            delete item[i].depsTime
                            delete item[i].rolesTime
                            delete item[i].employeList
                            delete item[i].employeeTotal
                            delete item[i].employeePage
                            delete item[i].currentDep
                            item[i].type = item[i].lastChoice.type
                            item[i].userName = item[i].lastChoice.userName
                            item[i].userId = item[i].lastChoice.userId
                            delete item[i].lastChoice
                        }
                        delete this.nodeList[0].depName
                    }
                }
                let param = {
                    branch: this.nodeList
                }
                param = Object.assign({},this.aduitForm,param)
                param.cityId = this.searchForm.cityId
                const url = "/api/auditflow/operateFlow"
                if(isOk || this.isAudit === '0') {
                    if(this.aduitTitle === "添加") {
                        const msg = "添加成功"
                        this.aduitPost(url,param,msg)
                    } else {
                        param.id = this.currentFlowId
                        const msg = "修改成功"
                        this.aduitPost(url,param,msg)
                    }
                }
            },
            aduitPost(url,param,msg) {
                this.$ajax.postJSON(url,param).then(res => {
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
                this.getData('search')
            },
            resetFormFn() {
                this.searchForm.deptAttr = ""
                this.searchForm.name = ""
                this.searchForm.type = ""
                this.searchForm.branchCondition = ""
                this.homeConditionList = []
                this.pageNum = 1
            },
            clearCondition() {
                this.homeConditionList = []
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.getData()
            },
            handleCurrentChange(val) {
                this.pageNum = val
                this.getData()
            }
        },
        watch: {
            dictionary(val){
                let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
                if(val&&session!=null){
                    this.setHomeConditionList(this.searchForm.type)
                }
            }
        },
        computed: {
            cityInfo(){
                return this.getUser.user
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
    .input-group {
        margin-right: 20px;
        label {
            font-size: 14px;
        }
        /deep/ .el-input {
            margin-left: -10px;
        }
        .branch-condition {
            /deep/ .el-input {
                width: 180px;
                margin-left: -2px;
            }
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
        justify-content: space-between;
    }
    .aduit-input {
        display: flex;
        margin-bottom: @margin-10;
        > label {
            width: 70px;
            line-height: 32px;
        }
        .mr-7 {
            margin-left: 6px;
        }
        &:nth-child(-n+5) {
            /deep/ .el-input {
                width: 246px;
            }
        }
        &:last-child {
            /deep/ .el-textarea__inner {
                background-color: #ECEFF2;
            }
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
                .w152 {
                    width: 152px;
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
                    display: flex;
                    margin-top: 10px;
                    >span {
                        width: 130px;
                    }
                    .multiple {
                        background-color: #fff;
                        width: 100%;
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
