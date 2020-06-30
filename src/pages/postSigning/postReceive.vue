<template>
    <div ref="tableComView" class="paper-set">
        <!-- 筛选 -->
        <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
            <!-- 筛选条件 -->
            <el-form :inline="true" ref="propForm" :model="propForm" class="prop-form" size="small">
                <el-form-item label="关键字" prop="search">
                    <el-tooltip content="合同编号/纸质合同编号/物业地址/业主/客户/房产证号/手机号" placement="top">
                        <el-input class="w200" v-model="propForm.search" placeholder="请输入" clearable></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="签约日期" prop="dateMo">
                    <el-date-picker v-model="propForm.dateMo" class="w330" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="交易流程" prop="time">
                    <el-select v-model="propForm.time" class="w300">
                        <el-option v-for="item in rules.time" :key="'jy'+item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="贷款银行" prop="paper">
                    <el-select v-model="propForm.paper" class="w262" :remote-method="remoteMethodFn" remote clearable filterable>
                        <el-option v-for="item in rules.paper" :key="'bank'+item.bankId" :label="item.bankName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <div class="in-block">
                    <el-form-item label="部门" prop="regionS" class="mr">
                        <select-tree :data="DepList" :init="propForm.regionS" @checkCell="depHandleClick" @clear="clearDep" @search="searchDep"></select-tree>
                    </el-form-item>
                    <el-form-item prop="regionName">
                        <el-select
                        v-model="propForm.regionName"
                        v-loadmore="moreEmploye"
                        class="w100"
                        @change="handleEmpNodeClick"
                        clearable>
                            <el-option
                            v-for="item in EmployeList"
                            :key="'bmName'+item.empId"
                            :label="item.name"
                            :value="item.empId"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item label="后期状态" prop="late" class="mr">
                    <el-select v-model="propForm.late" class="w180">
                        <el-option v-for="item in rules.late" :key="'state'+item.key" :label="item.label" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="合作方式"
                    prop="depAttr">
                        <el-select
                        v-model="propForm.depAttr"
                        class="w100"
                        :clearable="true">
                            <el-option
                            v-for="item in rules.depAttr"
                            :key="'depAttr'+item.key"
                            :label="item.value"
                            :value="item.key"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item
                    label="产权地址区域"
                    prop="areaName">
                        <el-select v-model="propForm.areaName" class="w134" :clearable="true">
                        <el-option v-for="(item,i) in rules.areaName"
                        :key="'areaName'+i"
                        :label="item"
                        :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="签约方式">
                    <el-select v-model="propForm.recordType" class="w120" :clearable="true">
                        <el-option
                        v-for="item in dictionary['64']"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </ScreeningTop>
        <!-- 列表 -->
        <div class="paper-table-box">
            <div class="paper-set-tit">
                <!-- <div class="paper-tit-fl"><i class="iconfont icon-tubiao-11 mr-10 font-cl1"></i>数据列表</div> -->
            </div>
            <el-table ref="tableCom" border :max-height="tableNumberCom" :data="tableData.list" v-loading="loadingList" class="paper-table">
                <el-table-column :formatter="nullFormatterData" label="合同信息" min-width="150">
                    <template slot-scope="scope">
                        <p>
                            合同:
                            <span class="blue" @click="contractFn(scope.row)" style="cursor:pointer;">{{scope.row.code}}</span>
                        </p>
                        <p v-if="scope.row.recordType.value===2">
                            纸质合同编号:
                            <span class="blue" @click="contractFn(scope.row)" style="cursor:pointer;">{{scope.row.pCode}}</span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column prop="recordType.label" label="签约方式" min-width="60"></el-table-column>
                <el-table-column :formatter="nullFormatterData" prop="signDate" label="签约时间" min-width="90">
                    <template slot-scope="scope">
                        {{scope.row.signDate|formatTime(false)}}
                    </template>
                </el-table-column>
                <el-table-column :formatter="nullFormatterData" label="后期状态" min-width="80">
                    <template slot-scope="scope">
                        {{statusLaterStageFn(scope.row.statusLaterStage.value)}}
                    </template>
                </el-table-column>
                <el-table-column :formatter="nullFormatterData" prop="propertyAddr" label="物业地址" min-width="160">
                    <template slot-scope="scope">
                        <span v-if="scope.row.propertyAddr.length===0">--</span>
                        <template v-else>
                            <p>{{scope.row.propertyAddr.split(' ')[0]}}</p>
                            <p>{{scope.row.propertyAddr.split(' ')[1]}}</p>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column :formatter="nullFormatterData" prop="transFlowName" label="交易流程" min-width="260">
                </el-table-column>
                <el-table-column :formatter="nullFormatterData" prop="propertyRightAddr" label="产权地址" min-width="120">
                </el-table-column>
                <el-table-column :formatter="nullFormatterData" prop="propertyRightRegion" label="产权地址区域" min-width="120">
                </el-table-column>
                <el-table-column :formatter="nullFormatterData" prop="owner" label="业主" min-width="90">
                </el-table-column>
                <el-table-column :formatter="nullFormatterData" prop="customer" label="客户" min-width="90">
                </el-table-column>
                <el-table-column :formatter="nullFormatterData" label="成交经纪人" min-width="140">
                    <template slot-scope="scope">
                        {{agentFn(scope.row.dealagentStoreName,scope.row.dealAgentName)}}
                    </template>
                </el-table-column>
                <el-table-column :formatter="nullFormatterData" label="操作" min-width="120">
                    <template slot-scope="scope">
                        <el-button v-if="power['sign-qh-rev-receive'].state" class="blue" type="text" @click="receiveFn(scope.row)">{{receiveComFn(scope.row.statusLaterStage.value,1)}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagination" v-if="tableData.total">
            <el-pagination :current-page="tableData.pageNum" :page-size="tableData.pageSize" @current-change="currentChangeFn" layout=" total, prev, pager, next, jumper" :total="tableData.total">
            </el-pagination>
        </div>
        <!-- 拒绝弹层 -->
        <el-dialog :title="layer.tit" :close-on-click-modal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal" :visible.sync="layer.show" width="740px" :center="layer.center" class="layer-paper">
            <div class="layer-invalid layer-refused">
                <div class="input-box">
                    <span class="cl-1 mr-10"><span class="mr-5 red">*</span>拒绝原因：</span>
                    <div class="input">
                        <el-input :autosize="textAutosize" type="textarea" resize="none" :maxlength="invalidMax" v-model="invalidInput" class="input">
                        </el-input>
                        <div class="text-absloute">{{invalidNumber}}/{{invalidMax}}</div>
                    </div>
                </div>
            </div>
            <span slot="footer">
                <el-button class="paper-btn" type size="small" @click="propCloseFn(0)" round>取消</el-button>
                <el-button class="paper-btn paper-btn-blue" type="primary" size="small" @click="propCloseFn(1)" round>确定</el-button>
            </span>
        </el-dialog>
        <!-- 接收弹层 -->
        <el-dialog :close-on-click-modal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal" :title="receive.tit" :visible.sync="receive.show" width="1000px" :center="receive.center" class="layer-paper layer-scroll-auto"><!--  layer-scroll-auto -->
            <LayerScrollAuto>
                <div class="layer-receive-tab">
                    <el-tabs v-model="activeName" class="contract-tab">
                        <el-tab-pane label="交易流程指派">
                            <el-table :data="dealTable" border v-loading="loadingdealTable" class="paper-table mt-20">
                                <el-table-column :formatter="nullFormatterData" min-width="120px" prop="transactionStepsType" align="center" label="步骤类型">
                                </el-table-column>
                                <el-table-column :formatter="nullFormatterData" min-width="120px" prop="transactionSteps" align="center" label="步骤名称">
                                </el-table-column>
                                <el-table-column align="center" label="结算百分比">
                                    <template slot-scope="scope">
                                        <span>{{percentageFn(scope.row.settlePercent)}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column :formatter="nullFormatterData" prop="specifiedDay" align="center" label="计划天数">
                                </el-table-column>
                                <el-table-column align="center" min-width="185" label="分配角色">
                                    <template slot-scope="scope">
                                        <!-- @change="roleChangeFn(scope.$index,$event)"  -->
                                        <el-select
                                        v-model="scope.row.roleId"
                                        placeholder="分配角色"
                                        filterable
                                        :loading="loading3"
                                        :disabled="roleDisabledFn(scope.row)"
                                        @change="roleChangeFn(scope.$index,$event)"
                                        size="small"
                                        class="w185"
                                        :class="scope.row.classShow?'on':''">
                                            <el-option
                                            v-for="item in dealTableRule"
                                            :key="'fp'+item.key + scope.$index"
                                            :label="item.value"
                                            :value="item.key"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" min-width="185" label="责任人">
                                    <template slot-scope="scope">
                                        <el-select
                                        v-model="scope.row.personLiableCode"
                                        :value="scope.row.value"
                                        :disabled="roleDisabledFn(scope.row)"
                                        @visible-change="roleRemoteFn(scope.$index,scope.row.roleId,$event)"
                                        placeholder="选择责任人"
                                        filterable
                                        :loading="loading4"
                                        @change="roleRemoteChangeFn($event,scope.$index)"
                                        size="small"
                                        class="w185"
                                        :class="scope.row.classShowCode?'on':''">
                                            <el-option
                                            v-for="item in scope.row.rules"
                                            :key="'zrr'+item.empId + scope.$index"
                                            :label="item.name"
                                            :value="item.empId"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column :formatter="nullFormatterData" align="center" label="操作">
                                    <template slot-scope="scope">
                                        <el-button :disabled="roleDisabledFn(scope.row)" :class="!roleDisabledFn(scope.row)?'blue':''" @click="dittoFn(scope.$index,scope.row)" type="text">同上</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- <div class="receive-label" v-if="receive.refuseReasons">
                                <span class="cl-1 mr-10">拒绝原因：</span>
                                <div class="receive-txt">{{receive.refuseReasons}}</div>
                            </div> -->
                        </el-tab-pane>
                        <el-tab-pane label="合同资料库">
                            <div class="contract-box">
                                <template v-if="ContractDatabase.length > 0">
                                    <div v-for="items in ContractDatabase" :key="items.kind">
                                        <div class="contract-tit">{{titleFn(items.kind)}}</div>
                                        <div class="contract-main" v-for="(item,index) in items.children" :key="item.title+index">
                                            <p class="cl-1 mb-10"><span class="spna"><template v-if="item.isrequire">*</template></span>{{item.title}}</p>
                                            <ul class="steps-img">
                                                <el-tooltip class="item" effect="dark" :content="ies.name" placement="bottom" v-for="(ies,i) in item.value" :key="ies.name+i">
                                                    <li @click="previewPhoto(item.value,i)">
                                                        <img class="suolue-img" :src="ies.path|getSignImage(preloadFiles)" alt="" v-if="isPictureFile(ies.fileType)" width="70%" height="85px">
                                                        <div class="img" v-else>
                                                            <uploadCell :type="stepsTypeImg(ies.path)"></uploadCell>
                                                        </div>
                                                        <p class="p">{{ies.name}}</p>
                                                    </li>
                                                </el-tooltip>
                                            </ul>
                                        </div>
                                    </div>
                                </template>
                                <div class="no-data-table" v-else>暂无数据</div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                    <!-- 预览 -->
                    <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
                </div>
            </LayerScrollAuto>
            <span slot="footer">
                <el-button v-if="power['sign-qh-rev-receive'].state" class="paper-btn paper-btn-blue" type="primary" size="small" @click="saveBtnFn(receive.receive)" round>保存</el-button>
                <el-button v-if="power['sign-qh-rev-receive'].state" class="paper-btn plain-btn-blue" size="small" v-show="receiveComFn(receive.receive,0)" @click="receiveBtnFn" round>接收</el-button>
                <!-- <el-button v-if="power['sign-qh-rev-receive'].state" class="paper-btn plain-btn-red" size="small" @click="refusedFn" v-show="receiveComFn(receive.receive,0)" round>拒绝</el-button> -->
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import ScreeningTop from '@/components/ScreeningTop';
    import { FILTER } from '@/assets/js/filter';
    import { MIXINS } from '@/assets/js/mixins';
    import { TOOL } from '@/assets/js/common';
    import LayerScrollAuto from '@/components/LayerScrollAuto';

    const RECEIVE = {
        receive: 2, //接收
        haveReceive: 3 //已接收
    }

    export default {
        mixins: [FILTER, MIXINS],
        data() {
            return {
                // 列表数据
                tableData: {},
                // 列表请求的页数
                pageNum: 1,
                pageSize: 10,
                // 加载
                loading: false,
                loading3: false,
                loading4: false,
                loadingList: false,
                loadingdealTable: false,
                // 筛选条件
                propForm: {
                    region: '',
                    regionS: '',
                    regionName: '',
                    regionNameS: '',
                    search: '',
                    paper: '',
                    time: '',
                    late: '',
                    dateMo: '',
                    depAttr:'',
                    areaName:'',
                    recordType:''
                },
                // 筛选选项
                rules: {
                    region: [{
                        name: "全部",
                        id: ""
                    }],
                    regionName: [{
                        name: "全部",
                        empId: ""
                    }],
                    paper: [{
                        bankName: "全部",
                        id: ""
                    }],
                    time: [{
                        name: "全部",
                        id: ""
                    }],
                    late: [{
                        label: '全部',
                        key: ''
                    }],
                    depAttr:[],
                    areaName:[]
                },
                // 搜索变量
                employees: {
                    keyword: '',
                    roleId: 0,
                    index: 0,
                },
                // 搜索展示内容
                restaurants: [{
                    "value": "1111111",
                }],
                // 作废弹层输入框
                invalidMax: 200,
                invalidInput: '',
                // 弹层属性
                layer: {
                    show: false,
                },
                receive: {
                    show: false,
                    tit: '接收',
                    proWidth: '1000px',
                    rabbet: true,
                    center: false,
                    footer: true,
                    receive: '',
                    e: {}
                },
                // 弹层切换展示那个
                activeName: '0',
                // 交易流程 表格数据
                dealTable: [],
                dealTableRule: [],
                // 合同资料库
                ContractDatabase: [],
                // 权限
                power:{
                    // 'sign-qh-rev-query':{
                    //     name:'查询',
                    //     state:false
                    // },
                    // 'sign-qh-rev-receive':{
                    //     name:'接收合同后期',
                    //     state:false
                    // },
                    // 'sign-qh-rev-reject':{
                    //     name:'拒绝接收',
                    //     state:false,
                    // },
                    // 'sign-qh-rev-save':{
                    //     name:'保存合同后期和修改责任人',
                    //     state:false,
                    // },
                    // 'sign-qh-rev-opp':{
                    //     name:'接收',
                    //     state:false,
                    // },
                    'sign-qh-rev-receive':{
                        name:'',
                        state:false,
                    },
                    'sign-com-htdetail':{
                        name:'合同详情',
                        state:false,
                    },
                },
                // 枚举数据
                dictionary:{
                    '520':'合同资料库标题',
                    '53':'合作方式',
                    '64':'签约方式'
                },
                textAutosize:{ minRows: 7, maxRows: 7 },
                preloadFiles:[]
            }
        },
        computed: {
            invalidNumber() {
                return this.invalidInput.length
            },
            // 城市
            cityId() {
                if (!!this.userMsg) {
                    return this.userMsg.cityId
                } else {
                    return ''
                }
            },
        },
        methods: {
            // 产权地址下拉数据
            getAreaList:function () {
                this.$ajax.get('/api/organize/currentdep/areaname')
                .then(res =>{
                    res = res.data
                    if(res.status === 200){
                        this.rules.areaName = res.data
                    }
                }).catch(err=>{
                    this.errMeFn(err);
                })
            },
            titleFn(val){
                let arr = this.dictionary['520'];
                for(let i=0;i<arr.length;i++){
                    if(parseInt(val) === arr[i].key){
                        return arr[i].value
                    }
                }
            },
            // 百分比转换
            percentageFn(val){
                if(val > 0){
                    return `${val}%`
                }else{
                    return '--'
                }
            },
            // 图片格式状态判定
            stepsTypeImg(type) {
                return this.$tool.get_suffix(type)
            },
            // 成功提示
            successMeFn(e) {
                this.$message({
                    message: e,
                    type: 'success'
                });
            },
            // 错误提示
            errMeFn(e) {
                this.$message.error(e);
            },
            // 接收状态显示
            receiveComFn(state, bol) {
                if (bol) {
                    if (state === RECEIVE.receive) {
                        return '接收'
                    } else {
                        return '已接收'
                    }
                } else {
                    if (state === RECEIVE.receive) {
                        return true
                    } else {
                        return false
                    }
                }

            },
            // 是否禁用下拉
            roleDisabledFn(data) {
                let OPERATION = this.$tool.OPERATION;
                if (!data.stepState) {
                    return false
                }
                if (data.stepState.value === OPERATION.backlog || data.stepState.value === OPERATION.not) {
                    return false
                } else {
                    return true
                }
            },
            // 开始状态接收
            statusLaterStageFn(state) {
                if (state === RECEIVE.receive) {
                    return '未开始'
                } else {
                    return '已开始'
                }
            },
            // 经纪人
            agentFn(s, t) {
                if (!!s && !!t) {
                    return `${s}-${t}`
                } else if (!!s) {
                    return s
                } else if (!!t) {
                    return t
                } else {
                    return '--'
                }
            },
            // 时间处理
            dateFormat(val) {
                return TOOL.dateFormat(val);
            },
            // 分页
            currentChangeFn(e) {
                this.pageNum = e;
                this.getListData('pagination');
            },
            // 接收
            receiveFn(e) {
                if(!e.dealAgentId) {
                    this.$message({message:'当前合同没有成交经纪人', type: 'error'})
                    return
                }
                if(!this.power['sign-qh-rev-receive'].state){
                    this.noPower(this.power['sign-qh-rev-receive'].name);
                    return false
                }
                // 获取列表数据
                this.loadingdealTable = true;
                this.$ajax.get('/api/postSigning/clickReceive', {
                    contractCode: e.id,
                    transFlowCode: e.transFlowCode
                }).then(res => {
                    res = res.data
                    if (res.status === 200) {
                        this.receive.show = true
                        this.receive.receive = e.statusLaterStage.value
                        this.receive.e = e
                        this.getRole()
                        this.getDataBase(e.id)
                        let arr = [...res.data];
                        arr.map(e => {
                            if(e.roleId == 0) {
                                e.roleId = ""
                            }
                            e.rules = [{
                                name: e.personLiableName,
                                empId: e.personLiableCode,
                            }]
                            e.roleBool = true;
                        })
                        this.dealTable = arr;
                        this.$nextTick(()=>{
                            this.loadingdealTable = false;
                        })
                    }
                }).catch(err => {
                    this.errMeFn(err);
                    this.$nextTick(()=>{
                        this.loadingdealTable = false;
                    });
                })
            },
            // 获取角色
            getRole() {
                this.loading4 = true;
                this.$ajax.get("/api/roles").then(res => {
                    res = res.data;
                    if (res.status === 200) {
                        this.dealTableRule = [...res.data];
                    }
                    this.loading4 = false;
                }).catch(err => {
                    this.errMeFn(err);
                    this.loading4 = false;
                })
            },
            // 合同资料库数据
            getDataBase(e) {
                this.$ajax.get("/api/postSigning/getDatabase", {
                    contractCode: e
                }).then(res => {
                    res = res.data;
                    if (res.status === 200) {
                        let arr = [];
                        if (!!res.data) {
                            let j = JSON.parse(res.data.address)
                            arr = this.recursiveFn([...j]);
                            let preloadList=[]
                            j.forEach(e => {
                                e.value.forEach(t =>{
                                    if(this.isPictureFile(t.fileType)) {
                                        preloadList.push(t.path)
                                    }
                                })
                            })
                            if(preloadList.length){
                                this.fileSign(preloadList,'preload').then(res=>{
                                    this.preloadFiles=res
                                })  
                            }
                        }
                        this.ContractDatabase = arr;
                    }
                }).catch(err => {
                    this.errMeFn(err);
                })
            },
            recursiveFn(n, arr = []) {
                if (n.length === 0) {
                    return arr
                }
                let bool = n[0].kind;
                let children = [];
                let num = 0;
                let arr2 = [...n];
                arr2.map((e, i) => {
                    if (e.kind === bool) {
                        children.push(e);
                        n.splice(i - num, 1);
                        num++;
                    }
                })
                arr.push({
                    kind: bool,
                    children,
                })
                return this.recursiveFn(n, arr)
            },
            // 分配角色改变时候 数据联动
            roleChangeFn(i,e) {
                this.loading4 = true;
                this.$ajax.get('/api/employee/postsigning/duty',{
                    roleId:e,
                    empId:this.receive.e.dealAgentId,
                    depId:this.receive.e.dealagentStoreId,
                }).then(res=>{
                    res = res.data;
                    if(res.status === 200){
                        this.dealTable[i].personLiableCode = "";
                        this.dealTable[i].classShowCode =true;
                        this.dealTable[i].rules = [...res.data];
                        this.dealTable[i].personLiableName = '';
                        this.dealTable[i].roleBool = false;
                    }
                    this.loading4 = false;
                }).catch(err=>{
                    this.errMeFn(err);
                    this.loading4 = false;
                })
            },
            roleRemoteChangeFn(e, i) {
                let arr = this.dealTable[i];
                arr.personLiableCode = e;
                arr.classShowCode = false;
                this.$set(this.dealTable, i, arr)
            },
            // 展示下拉列表的时候执行
            roleRemoteFn(i,e,bool){
                if(bool && !!e && this.dealTable[i].roleBool){
                    this.loading4 = true;
                    this.$ajax.get('/api/employee/postsigning/duty',{
                        roleId:e,
                        empId:this.receive.e.dealAgentId,
                        depId:this.receive.e.dealagentStoreId,
                    }).then(res=>{
                        res = res.data;
                        if(res.status === 200){
                            this.dealTable[i].rules = [...res.data];
                        }
                        this.loading4 = false;
                    }).catch(err=>{
                        this.errMeFn(err);
                        this.loading4 = false;
                    })
                }
            },
            roleRemoteMethodFn(query) {
                this.employees.keyword = query;
                this.getEmployeesFn();
            },
            // 下拉加载更多
            loadMoreFn() {
                this.dealTable[this.employees.index].rules.pageNum++;
                this.getEmployeesFn(true);
            },
            getEmployeesFn(bool) {
                if (!bool) {
                    this.loading4 = true;
                }
                this.$ajax.get('/api/organize/employees/pages', {
                    cityId: this.cityId,
                    roleId: this.employees.roleId,
                    keyword: this.employees.keyword,
                    pageNum: this.dealTable[this.employees.index].rules.pageNum,
                }).then(res => {
                    res = res.data;
                    if (res.status === 200) {
                        let rul = this.dealTable[this.employees.index].rules;
                        if (bool) {
                            if (rul.hasNextPage) {
                                this.dealTable[this.employees.index].rules = Object.assign(rul, {
                                    list: [...rul.list, ...res.data.list],
                                    pageNum: res.data.pageNum,
                                    hasNextPage: res.data.hasNextPage,
                                })
                            }
                        } else {
                            this.dealTable[this.employees.index].rules = res.data;
                        }
                    }
                    this.loading4 = false;
                }).catch(err => {
                    this.errMeFn(err);
                    this.loading4 = false;
                })
            },
            // 数据处理
            empRulesList(data) {
                if (!data.list) {
                    return []
                } else {
                    return data.list
                }
            },
            // 保存
            saveBtnFn(state) {
                if(!this.power['sign-qh-rev-receive'].state){
                    this.noPower(this.power['sign-qh-rev-receive'].name);
                    return false
                }
                let arr = [...this.dealTable];
                let bool = true;
                // console.log(arr)
                arr.map((e,i) => {
                    e.contractCode = this.receive.e.id;
                    e.rules.map(i => {
                        if (i.empId === e.personLiableCode) {
                            e.personLiableName = i.name
                        }
                    })
                    if (!e.personLiableName) {
                        bool = false;
                        if(state === RECEIVE.haveReceive){
                            e.classShowCode =true;
                            this.$set(this.dealTable,i,e)
                        }
                    }
                })
                if (state === RECEIVE.haveReceive && !bool) {
                    this.errMeFn('数据不能为空');
                    return false
                }
                this.$ajax.postJSON('/api/postSigning/saveStepFlow', arr).then(res => {
                    res = res.data;
                    if (res.status === 200) {
                        this.successMeFn(res.message)
                        this.receive.show = false;
                        // 数据刷新
                        this.getListData();
                    } else {
                        this.errMeFn(res.message);
                    }
                }).catch(err => {
                    this.errMeFn(err);
                })
            },
            // 接收
            receiveBtnFn() {
                if(!this.power['sign-qh-rev-receive'].state){
                    this.noPower(this.power['sign-qh-rev-receive'].name);
                    return false
                }
                let arr = [...this.dealTable];
                let bool = true;
                arr.map((e,i) => {
                    e.contractCode = this.receive.e.id;
                    e.rules.map(i => {
                        if (i.empId === e.personLiableCode) {
                            e.personLiableName = i.name
                        }
                    })
                    if (!e.personLiableName) {
                        bool = false;
                        e.classShowCode =true;
                        this.$set(this.dealTable,i,e);
                    }
                })
                if (!bool) {
                    this.errMeFn('请将交易步骤分配完，才能接收并开始办理后期');
                } else {
                    this.$ajax.postJSON('/api/postSigning/addStepFlow', arr).then(res => {
                        res = res.data;
                        if (res.status === 200) {
                            this.successMeFn(res.message);
                            this.receive.show = false;
                            // 数据刷新
                            this.getListData();
                        } else {
                            this.errMeFn(res.message);
                        }
                    }).catch(err => {
                        this.errMeFn(err);
                    })
                }
            },
            // 拒绝后期
            refusedFn() {
                this.layer = {
                    show: true,
                    tit: '拒绝后期',
                    rabbet: true,
                    center: false
                }
                this.invalidInput = `${this.receive.refuseReasons}`;
            },
            // 拒绝后期 弹层事件
            propCloseFn(bool) {
                if (bool) {
                    if(!this.power['sign-qh-rev-receive'].state){
                        this.noPower(this.power['sign-qh-rev-receive'].name);
                        return false
                    }
                    if (this.invalidInput.length < 1) {
                        this.errMeFn('输入不能为空');
                    } else {
                        this.$ajax.post('/api/postSigning/refuseReceive', {
                            contractCode: this.receive.e.id,
                            refuseReasons: this.invalidInput
                        }).then(res => {
                            res = res.data;
                            if (res.status === 200) {
                                this.successMeFn(res.message);
                                this.receive.show = false;
                                this.layer.show = false;
                                // 数据刷新
                                this.getListData();
                            } else {
                                this.errMeFn(res.message);
                            }
                        }).catch(err => {
                            this.errMeFn(err);
                        })
                    }
                } else {
                    this.layer.show = false
                }
            },
            // 同上
            dittoFn(i, data) {
                if (!this.roleDisabledFn(data)) {
                    if (i === 0) {
                        this.errMeFn('本步骤没有上一步，请手动进行分配');
                    } else {
                        let arr = this.dealTable[i - 1];
                        let roleId = arr.roleId;
                        let personLiableCode = arr.personLiableCode;
                        let rules = arr.rules;
                        let obj = Object.assign(this.dealTable[i], {
                            roleId,
                            personLiableCode,
                            rules
                        })
                      if(rules.length>0){
                          obj.classShowCode=false
                      }
                        this.$set(this.dealTable, i, obj)
                    }
                }
            },
            // 合同编号
            contractFn(value) {
                if(!this.power['sign-com-htdetail'].state){
                    this.noPower(this.power['sign-com-htdetail'].name);
                    return false
                }
                this.setPath(this.getPath.concat({name:'合同详情'}));
                this.$router.push({
                    path: "/contractDetails",
                    query: {
                        id: value.id, //合同id
                        code: value.code, //合同编号
                        contType: value.tradeType.value //合同类型
                    }
                });
            },
            // 重置
            resetFormFn() {
                this.propForm.region='';
                this.pageNum = 1;
                this.$refs.propForm.resetFields();
                // this.getListData();
                this.EmployeList = []
                this.propForm.recordType = ''
            },
            // 查询
            queryFn() {
                this.pageNum = 1;
                this.getListData('search');
                // console.log('查询');
            },
            // 部门第二版 选择部门
            depHandleClick(data){
                this.propForm.region=data.depId
                this.propForm.regionS=data.name
                this.handleNodeClick(data);
            },
            // 部门第二版 删除
            clearDep(){
                this.propForm.region='';
                this.propForm.regionName='';
                this.clearSelect();
                this.remoteMethod();
            },
            // 部门第二版 下拉隐藏时 刷新数据清除上一次数据
            initDepList(val){
                if(!val){
                    this.remoteMethod()
                }
            },
            // 部门搜索
            searchDep:function (payload) {
                /*this.DepList=payload.list
                this.propForm.regionS = payload.depName*/
            },
            // 贷款银行搜索
            remoteMethodFn(e) {
                let t;
                if (e === "全部") {
                    t = '';
                } else {
                    t = e;
                }
                this.$ajax.get('/api/system/selectBankName', {
                    keyWord: t
                }).then(res => {
                    res = res.data
                    if (res.status === 200) {
                        if (t === '' || t === "全部" || !t) {
                            this.rules.paper = [{
                                bankName: "全部",
                                id: ""
                            }, ...res.data]
                        } else {
                            this.rules.paper = res.data
                        }
                    }
                }).catch(err => {
                    this.errMeFn(err);
                })
            },
            // 获取数据
            getListData(type='init') {
                this.loadingList = true;
                let signDateSta = '';
                let signDateEnd = '';
                if (this.propForm.dateMo) {
                    if (this.propForm.dateMo.length === 2) {
                        signDateSta = TOOL.dateFormat(this.propForm.dateMo[0]);
                        signDateEnd = TOOL.dateFormat(this.propForm.dateMo[1]);
                    }
                }
                let param = {
                    keyword: this.propForm.search,
                    signDateSta,
                    signDateEnd,
                    transFlowCode: this.propForm.time,
                    stagesBankCode: this.propForm.paper,
                    dealDeptId: this.propForm.region,
                    dealAgentId: this.propForm.regionName,
                    statusLaterStage: this.propForm.late,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    depAttr:this.propForm.depAttr,
                    areaName:this.propForm.areaName,
                    recordType:this.propForm.recordType
                }

                //点击查询时，缓存筛选条件
                if(type==='search'||type==='pagination'){
                    sessionStorage.setItem('sessionQuery',JSON.stringify({
                        path:'/postReceive',
                        url:'/postSigning/getContract',
                        query:Object.assign({},param,{empName:this.dep.empName},{depName:this.propForm.regionS}),
                        methods:'get'
                    }))
                }

                this.$ajax.get('/api/postSigning/getContract',param).then((res) => {
                    res = res.data
                    if (res.status === 200) {
                        this.tableData = res.data;
                    }
                    this.$nextTick(()=>{
                        this.loadingList = false;
                    })
                }).catch(err => {
                    this.errMeFn(err);
                    this.$nextTick(()=>{
                        this.loadingList = false;
                    })
                })
            },
            // 交易流程获取数据
            getTransactionProcess() {
                this.$ajax.post('/api/flowmanage/selectFlowPageList', {
                    cityId: this.cityId
                }).then(res => {
                    res = res.data
                    if (res.status === 200) {
                        this.rules.time = [{
                            name: "全部",
                            id: ""
                        }, ...res.data];
                    }
                }).catch(err => {
                    this.errMeFn(err);
                })
            },
            // 后期状态
            getLateState() {
                this.$ajax.get("/api/dictionary/query", {
                    parentId: 43
                }).then(res => {
                    res = res.data
                    if (res.status === 200) {
                        let arr = [];
                        res.data.children.forEach(e => {
                            if (e.key === RECEIVE.receive || e.key === RECEIVE.haveReceive) {
                                arr.push({
                                    key: e.key,
                                    label: this.statusLaterStageFn(e.key)
                                })
                            }
                        });
                        this.rules.late = [{
                            label: '全部',
                            key: ''
                        }, ...arr]
                    }
                }).catch(err => {
                    this.errMeFn(err);
                })
            },
        },
        components: {
            ScreeningTop,
            LayerScrollAuto
        },
        mounted() {
            this.$nextTick(()=>{
                // 获取城市id
                this.getAdmin();
                // 枚举数据查询
                this.getDictionary();
                // 贷款银行
                this.remoteMethodFn();
                // // 部门搜索
                // this.regionMethodFn('');
                // 部门搜索
                this.remoteMethod();
                // 后期状态
                this.getLateState();
                // 产权地址区域
                this.getAreaList()
                let res=this.getDataList
                if(res&&(res.route===this.$route.path)){
                    this.tableData.list = res.data.list
                    this.tableData.total = res.data.total
                    let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
                    let query = session.query
                    this.propForm = {
                        region: query.dealDeptId,
                        regionS: query.depName,
                        regionName: query.dealAgentId,
                        regionNameS: '',
                        search: query.keyword,
                        paper: query.stagesBankCode,
                        time: query.transFlowCode,
                        late: query.statusLaterStage,
                        dateMo: query.signDateSta?[query.signDateSta,query.signDateEnd]:'',
                        depAttr:query.depAttr,
                        areaName:query.areaName,
                        recordType:query.recordType
                    }
                    if(this.propForm.regionName){
                        this.dep=Object.assign({},this.dep,{id:this.propForm.region,empId:this.propForm.regionName,empName:query.empName})
                        this.EmployeList.unshift({
                            empId:this.propForm.regionName,
                            name:query.empName
                        })
                        this.getEmploye(this.propForm.region)
                    }
                    this.tableData.pageNum = query.pageNum
                }else{
                    // 列表数据
                    this.getListData();
                }
            })
        },
        watch: {
            dictionary(newData,oldData){
                // 合作方式
                this.rules.depAttr= [...newData[53]]
            },
            cityId() {
                // 交易流程
                this.getTransactionProcess();
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/less/lsx.less";
    /deep/.on .el-input__inner{
        border-color: #FF3E3E;
    }
</style>
