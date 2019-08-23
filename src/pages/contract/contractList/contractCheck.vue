<template>
  <div class="view-container" ref="tableComView">
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
      <el-form :inline="true" :model="contractForm" class="prop-form" size="small">
        <el-form-item label="关键字">
          <el-tooltip class="item" effect="dark" content="物业地址/业主/客户/房产证号/手机号/合同编号/房源编号/客源编号" placement="top">
            <el-input v-model="keyword" style="width:150px" placeholder="请输入" :clearable="true"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="签约日期">
          <el-date-picker v-model="signDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy/MM/dd" style="width:330px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同类型">
          <!-- <el-select v-model="contractForm.contType" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['10']" :key="item.key" :label="item.value" :value="item.key" v-if="item.key!==4&&item.key!==5">
            </el-option>
          </el-select> -->
          <el-select v-model="contractForm.contTypes" multiple placeholder="全部" style="width:200px" :class="{'width300':contractForm.contTypes&&contractForm.contTypes.length>3}">
            <el-option
              v-for="item in dictionary['10']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同状态">
          <el-select v-model="contractForm.contState" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['9']" :key="item.key" :label="item.value" :value="item.key" v-if="item.key!==0">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <select-tree :data="DepList" :init="contractForm.depName" @checkCell="depHandleClick" @clear="clearDep" @search="searchDep"></select-tree>
        </el-form-item>
        <el-form-item>
          <el-select style="width:100px" :clearable="true" v-loadmore="moreEmploye" class="margin-left" size="small" v-model="contractForm.dealAgentId" @change="handleEmpNodeClick" placeholder="请选择">
            <el-option
              v-for="item in EmployeList"
              :key="item.empId"
              :label="item.name"
              :value="item.empId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="contractForm.toExamineState" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['51']" :key="item.key" :label="item.value" :value="item.key" v-if="item.key!==-1">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变更/解约">
          <el-select v-model="contractForm.contChangeState" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['6']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合作方式">
          <el-select v-model="contractForm.dealAgentStoreAttr" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['53']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <!-- 合同列表 -->
    <div class="contract-list">
      <!-- <p> -->
        <!-- <span> -->
          <!-- <span class="title"><i class="iconfont icon-tubiao-11"></i>数据列表</span> -->
          <!-- <span class="text">有效成分汇总 </span>
          <span class="text">租赁：</span> <span class="data">123165</span>
          <span class="text">买卖：</span> <span class="data">75454</span>
          <span class="text">代办：</span> <span class="data">5565</span>
          <span class="text">意向：</span> <span class="data">0</span>
          <span class="text">定金：</span> <span class="data">0</span>
          <span class="text">可分配业绩汇总：</span> <span class="data">564654</span>
          <span class="text">单数：</span> <span class="data">13</span> -->
        <!-- </span> -->
      <!-- </p> -->
      <el-table ref="tableCom" class="info-scrollbar" :data="tableData" border style="width: 100%"  @row-dblclick='toDetail' :max-height="tableNumberCom">
        <el-table-column align="center" label="合同信息" min-width="200" fixed>
          <template slot-scope="scope">
            <div class="contract_msg">
              <div class="riskLabel">
                <!-- 风险单 -->
                <el-popover
                  placement="top-start"
                  width="50"
                  trigger="hover"
                  content="风险单"
                  v-if="scope.row.isRisk">
                  <i slot="reference" class="iconfont icon-tubiao_shiyong-1 risk"></i>
                </el-popover>
                <!-- 代办 -->
                <!-- <i class="iconfont icon-tubiao_shiyong-2 replace" v-if="scope.row.contMarkState&&scope.row.contMarkState.value===1"></i> -->
                <!-- 低佣 -->
                <!-- <i class="iconfont icon-tubiao_shiyong-3 low" v-if="scope.row.contMarkState&&scope.row.contMarkState.value===1"></i> -->
                <!-- <el-popover
                  placement="top-start"
                  width="10"
                  trigger="hover"
                  content="低佣"
                  v-if="scope.row.contMarkState&&scope.row.contMarkState.value===1">
                  <i slot="reference" class="iconfont icon-tubiao_shiyong-3 low"></i>
                </el-popover> -->
              </div>
              <ul class="contract-msglist">
                <li>合同：<span @click="toDetail(scope.row)">{{scope.row.code}}</span></li>
                <li>房源：<span>{{scope.row.houseinfoCode}}</span> {{scope.row.showOwnerName}}</li>
                <li>客源：<span>{{scope.row.guestinfoCode}}</span> {{scope.row.showCustName}}</li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="合同类型" prop="contType.label" min-width="60" fixed>
        </el-table-column>
        <el-table-column align="center" label="物业地址" prop="propertyAddr" min-width="160" fixed>
        </el-table-column>
        <el-table-column align="center" label="成交总价" prop="dealPrice" min-width="90" fixed>
          <template slot-scope="scope">
            <span>{{scope.row.dealPrice}} 元</span>
            <span v-for="item in dictionary['507']" :key="item.key" v-if="item.key===scope.row.timeUnit&&scope.row.contType.value===1"> / {{item.value}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="成交经纪人" min-width="120">
          <template slot-scope="scope">
            <p>{{scope.row.dealAgentStoreName}}</p>
            <p>{{scope.row.dealAgentName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="签约日期" min-width="90">
          <template slot-scope="scope">
            <!-- {{scope.row.signDate.substr(0, 10)}} -->
            {{Number(scope.row.signDate)|timeFormat_}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="可分配业绩 (元)" min-width="80">
          <template slot-scope="scope">
            <!-- {{scope.row.contType.value<4 ? scope.row.distributableAchievement:'-'}} -->
              <span v-if="scope.row.contType.value<4">{{scope.row.distributableAchievement}}</span>
              <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="合同状态" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.contType.value<4">
              <span v-if="scope.row.contState.value>0">{{scope.row.contState.label}}</span>
              <el-popover trigger="hover" placement="top" v-else>
                <div style="width:160px">
                  {{scope.row.delReason}}
                </div>
                <div slot="reference" class="name-wrapper isFlex">
                  {{scope.row.contState.label}}
                </div>
              </el-popover>
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核状态" prop="toExamineState.label" min-width="80">
          <template slot-scope="scope">
            <!-- {{scope.row.contType.value<4 ? scope.row.distributableAchievement:'-'}} -->
              <span v-if="scope.row.contType.value<4">
                <span v-if="scope.row.toExamineState.value===-1" class="blue">{{scope.row.toExamineState.label}}</span>
                <span v-if="scope.row.toExamineState.value===0" class="yellow">{{scope.row.toExamineState.label}}</span>
                <span v-if="scope.row.toExamineState.value===1" class="green">{{scope.row.toExamineState.label}}</span>
                <span v-if="scope.row.toExamineState.value===2" class="red">{{scope.row.toExamineState.label}}</span>
              </span>
              <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="当前审核人" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.auditId>0&&scope.row.toExamineState.value===0">
              <p>{{scope.row.auditStoreName}}</p>
              <p>{{scope.row.auditName}}</p>
              <!-- v-if="userMsg&&scope.row.auditId===userMsg.empId" -->
            </span>
            <p v-else>-</p>
            <el-button type="text" v-if="getUserMsg&&(scope.row.auditId===getUserMsg.empId||scope.row.preAuditId===getUserMsg.empId)&&scope.row.toExamineState.value===0" @click="choseCheckPerson(scope.row,scope.row.preAuditId===getUserMsg.empId?1:2)">{{getUserMsg&&getUserMsg.empId===scope.row.auditId?'转交审核人':'设置审核人'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下一步审核人" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.nextAuditId>0">
              <p>{{scope.row.nextAuditStoreName}}</p>
              <p>{{scope.row.nextAuditName}}</p>
            </span>
            <p v-else>-</p>
            <el-button type="text" v-if="getUserMsg&&(scope.row.nextAuditId!==0&&scope.row.auditId===getUserMsg.empId&&scope.row.toExamineState.value===0)" @click="choseCheckPerson(scope.row,3)" :class="{'error_':scope.row.nextAuditId===0}">设置审核人</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="变更/解约" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.contChangeState.label==='未变更/解约'">-</span>
            <el-button type="text" size="medium" v-else @click="goChangeCancel(scope.row)">{{scope.row.contChangeState.label}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="120">
          <template slot-scope="scope">
            <!-- <div style="text-align:center"> -->
              <el-button type="text" size="medium" v-if="power['sign-ht-info-view'].state" @click="goPreview(scope.row)">预览</el-button>
              <!--<el-button type="text" size="medium" v-if="scope.row.toExamineState.value===0&&scope.row.contType.value<4&&userMsg&&scope.row.auditId===userMsg.empId" @click="goCheck(scope.row)">审核</el-button>-->
            <span style="color:red" v-if="scope.row.toExamineState.value===0&&(scope.row.contType.value===2||scope.row.contType.value===3)&&scope.row.auditId>0&&getUserMsg&&scope.row.auditId!==getUserMsg.empId">{{scope.row.auditName}}正在审核</span>
            <el-button type="text"  v-if="scope.row.toExamineState.value===0&&((scope.row.contType.value===1&&getUserMsg&&scope.row.auditId===getUserMsg.empId)||((scope.row.contType.value===2||scope.row.contType.value===3)&&((scope.row.auditId<0&&getUserMsg&&(getUserMsg.roleId===22||getUserMsg.roleId===23||fawu))||(scope.row.auditId===getUserMsg.empId))))" @click="goCheck(scope.row)">审核</el-button>
            <!-- </div> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 固定滚动条 -->
      <div class="pagination" v-if="tableData.length>0">
        <el-pagination
         class="pagination-info"
         @current-change="handleCurrentChange"
         :current-page="currentPage"
         layout="total, prev, pager, next, jumper"
         :total="total">
        </el-pagination>
      </div>

    </div>
    <!-- 变更/解约查看 合同主体上传弹窗 -->
    <changeCancel :dialogType="dialogType" :contState="contState" :cancelDialog="changeCancel" :contId="contId" @closeChangeCancel="ChangeCancelDialog" v-if="changeCancel"></changeCancel>
    <!-- 设置/转交审核人 -->
    <checkPerson :show="checkPerson.state" page="list" :type="checkPerson.type" :current="checkPerson.current" :showLabel="checkPerson.label" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @close="closeCheckPerson" @submit="closeCheckPerson" v-if="checkPerson.state"></checkPerson>
  </div>
</template>

<script>
import ScreeningTop from "@/components/ScreeningTop";
import changeCancel from "../contractDialog/changeCancel";
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
import checkPerson from '@/components/checkPerson';

export default {
  mixins: [MIXINS],
  components: {
    ScreeningTop,
    changeCancel,
    checkPerson
  },
  data(){
    return{
      tableBox:null,
      contractForm: {},
      keyword: "",
      signDate: [],
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      contractCode: "",
      changeCancel: false,
      dictionary: {
        //数据字典
        "10": "", //合同类型
        "9": "", //合同状态
        "51": "", //审核状态
        "6": "", //变更/解约
        "14": "", //结算状态
        "13": "", //收佣状态
        "53": "", //合作方式
        "54": "", //业绩状态
        "538": "", //用途
        "507": ""
      },
      //部门选择列表
      options:[],
      //经纪人列表
      brokersList:[],
      //合同id
      contId:'',
      //合同状态
      contState:99,
      settleId:'',
      dialogType:'',
      isSubmitAudit:false,
      checkPerson: {
        state:false,
        type:1,
        code:'',
        flowType:3,
        label:false,
        current:false
      },
       //权限配置
      power: {
        'sign-ht-info-view': {
          state: false,
          name: '预览'
        },
        'sign-com-htdetail': {
          state: false,
          name: '合同详情'
        },
        'sign-com-house': {
          state: false,
          name: '房源详情'
        },
        'sign-com-cust': {
          state: false,
          name: '客源详情'
        }
      }
    }
  },
  created() {
    this.getDictionary();//字典
    this.remoteMethod();//部门
    // this.getAdmin();//获取当前登录人信息
    let res=this.getDataList
    if(res&&(res.route===this.$route.path)){
      this.tableData = res.data.list
      this.total = res.data.count
      let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
      this.contractForm = Object.assign({},this.contractForm,session.query,{contTypes:session.query.contTypes.length>0?session.query.contTypes.split(','):''})
      if(this.contractForm.contTypes){
        this.contractForm.contTypes = this.contractForm.contTypes.map(item=>{
          return Number(item)
        })
      }
      // this.contractForm.dealAgentStoreId=''
      // this.contractForm.dealAgentId=''
      delete this.contractForm.keyword
      delete this.contractForm.pageNum
      delete this.contractForm.beginDate
      delete this.contractForm.endDate
      this.keyword=session.query.keyword
      this.currentPage=session.query.pageNum
      if(session.query.beginDate){
        this.signDate[0]=session.query.beginDate
        this.signDate[1]=session.query.endDate
      }
      if(this.contractForm.dealAgentId){
        this.dep=Object.assign({},this.dep,{id:this.contractForm.dealAgentStoreId,empId:this.contractForm.dealAgentId,empName:this.contractForm.empName})
        this.EmployeList.unshift({
          empId:this.contractForm.dealAgentId,
          name:this.contractForm.empName
        })
        this.getEmploye(this.contractForm.dealAgentStoreId)
      }
    }else{
      this.getContractList();//合同列表
    }
  },
  methods:{
    //获取合同列表
    getContractList(type="init") {
      let param = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.keyword,
        isCheckList:1
      };
      param = Object.assign({}, param, this.contractForm);
      if(this.signDate){
        if (this.signDate.length > 0) {
          param.beginDate = this.signDate[0];
          param.endDate = this.signDate[1];
        }
      }
      if(this.contractForm.contTypes&&this.contractForm.contTypes.length>0){
        param.contTypes=this.contractForm.contTypes.join(',')
      }else{
        param.contTypes=''
      }
      // delete param.depName
      //console.log(param)
      if(type==="search"||type==="page"){
        sessionStorage.setItem('sessionQuery',JSON.stringify({
          path:'/contractCheck',
          url:'/contract/auditList',
          query:Object.assign({},param,{empName:this.dep.empName}),
          methods:"postJSON"
        }))
      }

      this.$ajax.postJSON("/api/contract/auditList", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.tableData = res.data.list;
          this.total = res.data.count;
        }
      });
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getContractList("page");
    },
    //重置
    resetFormFn() {
      TOOL.clearForm(this.contractForm);
      this.keyword = "";
      this.signDate = [];
      this.EmployeList = []
    },
    // 查询
    queryFn() {
      this.currentPage=1;
      this.getContractList("search");
    },
     //字典查询
    getDictionaries() {
      this.$ajas.get("/api/dictionary/batchQuery", param).then(res => {});
    },
    //变更解约弹窗
    goChangeCancel(item) {
      console.log(item.contChangeState.value);
      //debugger
      if (item.contChangeState.value === 1) {
        this.changeCancel = true;
        this.dialogType = "changeLook";
        this.contId=item.id;
        console.log(this.contId)
      } else if (item.contChangeState.value === 2) {
        this.changeCancel = true;
        this.dialogType = "cancelLook";
        this.contId=item.id;
      }
    },
    //关闭变更解约弹窗
    ChangeCancelDialog() {
      this.changeCancel = false;
      this.contId='';
      this.getContractList();
    },
    //合同预览
    goPreview(item) {
      this.setPath(this.$tool.getRouter(['合同','合同审核','合同预览'],'contractCheck'));
      this.$router.push({
        path: "/contractPreview",
        query: {
          id: item.id,
          code:item.code
        }
      });
    },
    //合同审核
    goCheck(item) {
      let param={
        bizCode:item.code,
        flowType:3
      }
      if(item.contType.value===1||item.auditId===this.getUserMsg.empId){
        this.setPath(this.$tool.getRouter(['合同','合同审核','合同预览'],'contractCheck'));
        this.$router.push({
          path:'/contractPreview',
          query:{
            code:item.code,
            id:item.id,
            operationType:2
          }
        })
      }else{
        this.$ajax.get('/api/machine/getAuditAuth',param).then(res=>{
          res = res.data
          if(res.status===200){
            if(this.power['sign-ht-info-view'].state){
              this.setPath(this.$tool.getRouter(['合同','合同审核','合同预览'],'contractCheck'));
              this.$router.push({
                path:'/contractPreview',
                query:{
                  code:item.code,
                  id:item.id,
                  operationType:2
                }
              })
            }else{
              this.noPower('合同预览')
            }
          }
        }).catch(error=>{
          this.$message({
            message:error,
            type: "error"
          })
        })
      }
    },
    //合同详情
    toDetail(value) {
      if(this.power['sign-com-htdetail'].state){
        this.setPath(this.$tool.getRouter(['合同','合同审核','合同详情'],'contractCheck'));
        if(value.contType.value===1||value.contType.value===2||value.contType.value===3){
          this.$router.push({
            path: "/contractDetails",
            query: {
              id: value.id,//合同id
              code: value.code,//合同编号
              contType: value.contType.value//合同类型
            }
          });
        }else{
          this.$router.push({
            path: "/detailIntention",
            query: {
              id: value.id,
              contType: value.contType.value
            }
          });
        }
      }else{
        this.noPower('合同详情查看')
      }
    },
     //获取当前部门
    initDepList:function (val) {
      if(!val){
        this.remoteMethod()
      }
    },
    clearDep:function () {
      this.contractForm.dealAgentStoreId='';
      this.contractForm.depName='';
      // this.EmployeList=[]
      this.contractForm.dealAgentId='';
      this.clearSelect();
    },
    depHandleClick(data) {
      // this.getEmploye(data.depId)
      this.contractForm.dealAgentStoreId=data.depId;
      this.contractForm.depName=data.name;

      this.handleNodeClick(data);
    },
    searchDep:function (payload) {
      /*this.DepList=payload.list;
      this.contractForm.depName=payload.depName;*/
    },
     // 选择审核人
    choseCheckPerson:function (row,type) {
      this.checkPerson.code=row.code;
      this.checkPerson.state=true;
      this.checkPerson.type=type;
      if(row.nextAuditId>=0){
        this.checkPerson.label=false;
      }else{
        this.checkPerson.label=true;
      }
    },
    //关闭设置审核人弹窗
    closeCheckPerson(){
      console.log('qweqw')
      this.checkPerson.state=false;
      this.getContractList();
    }
  },
  computed:{
    fawu:function(){
      let host=window.location.host
      let url = false
      switch (host){
          case "localhost:8080":
          case "sign2.jjw.com:28879":
            url=this.getUserMsg.depId===594||this.getUserMsg.depId===838
                break
          case "sign2.jjw.com":
            url=this.getUserMsg.depId===900||this.getUserMsg.depId===2257
                break
        }
        return url
    },
    getUserMsg(){
      return this.getUser.user
    }
  },
  filters: {
    timeFormat_: function (val) {
      if (!val) {
        return '--'
      } else {
        let time = new Date(val)
        let y = time.getFullYear()
        let M = time.getMonth() + 1
        let D = time.getDate()
        let h = time.getHours()
        let m = time.getMinutes()
        let s = time.getSeconds()
        let time_ = `${y}-${M > 9 ? M : '0' + M}-${D > 9 ? D : '0' + D} ${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
        return time_.substr(0, 10)
      }
    }
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";

.width300{
  width: 325px !important;
}
/deep/.el-form-item{
  margin-bottom: 10px;
}
/deep/.paper-box {
  /*padding-top: 10px !important;
  margin-bottom: 10px;*/
  background-color: #fff;
  border-radius: 2px;
  box-sizing: border-box;
  box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  .paper-set-tit {
    padding-bottom: 10px;
  }
}
/deep/.margin-left{
  margin-left: 0;
}
.pagination{
  /deep/.pagination-info{
    text-align: right;
    margin-top: 0;
  }
}
.contract-list {
  // padding-top: 10px;
  background-color: #fff;
  padding: 10px 10px 0 10px;
  border-radius: 2px;
  box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  > p {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    .title {
      font-size: 14px;
      color: @color-blank;
      i {
        padding-right: 8px;
      }
    }
    .text {
      font-size: 14px;
      color: @color-6c;
      padding-left: 10px;
    }
    .data {
      font-size: 14px;
      color: @color-blue;
    }
  }
  .name-wrapper {
    min-width: 80px;
    height: 65px;
    display: -webkit-box;
    /*!autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow:ellipsis;
  }
  .isFlex{
    display: flex;
    align-items: center;
  }
  .shell{
    width: 100%;
    height: 100%;
    display: inline-block;
  }
  .error_{
    color: red;
  }
}
.contract_msg{
  display: flex;
   align-items: center;
  .riskLabel{
    width: 20px;
    padding-right: 20px;
    color: @color-orange;
    font-size: 18px;
    .risk{
      color: @color-warning;
      position: relative;
      .remarksExamine{
        background: #fff;
        font-size: 14px;
        color: #606266;
        position: absolute;
        left: 0;
        top: 0;
        display: inline-block;
        width: 60px;
      }
    }

  }
  .contract-msglist {
    > li {
      text-align: left;
      &:first-of-type{
        > span{
          color: @color-blue;
          cursor: pointer;
        }
      }

    }
  }
}

.blue {
  color: @color-blue;
}
.yellow {
  color: @color-yellow;
}
.green {
  color: @color-green;
}
.red {
  color: @color-warning;
}
.btn {
  color: @color-blue;
  cursor: pointer;
}
/deep/ .el-table th {
  background: @bg-th;
}
</style>
