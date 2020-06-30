<template>
  <div class="view-container" ref="tableComView">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
      <el-form :inline="true" :model="contractForm" class="prop-form" size="small">
        <el-form-item label="关键字">
          <el-tooltip class="item" effect="dark" :content="content" placement="top">
            <el-input v-model="contractForm.keyword" style="width:150px" placeholder="请输入" :clearable="true"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="所属部门">
          <select-tree :data="DepList" :init="contractForm.depName" @checkCell="depHandleClick" @clear="clearDep" @search="searchDep"></select-tree>
        </el-form-item>
        <el-form-item>
          <el-select style="width:100px" :clearable="true" v-loadmore="moreEmploye" class="margin-left" size="small" v-model="contractForm.empId" @change="handleEmpNodeClick" placeholder="请选择">
            <el-option
              v-for="item in EmployeList"
              :key="item.empId"
              :label="item.name"
              :value="item.empId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="签约日期" v-if="contractType!='financial'">
          <el-date-picker v-model="signData" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy/MM/dd" style="width:330px">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="结款时间" v-if="contractType==='newHouse'">
          <el-date-picker v-model="closingData" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy/MM/dd" style="width:330px">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="放款日期" v-if="contractType==='financial'">
          <el-date-picker v-model="loanData" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy/MM/dd" style="width:330px">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="交易方式" v-if="contractType==='longRent'">
          <el-select v-model="contractForm.transMode" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['716']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收佣状态">
          <el-select v-model="contractForm.receiveAmountState" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['13']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ScreeningTop>
     <!-- 合同列表 -->
    <div class="contract-list">
      <div class="listTitle">
        <div>
          <span class="title"><i class="iconfont icon-tubiao-11"></i>数据列表</span>
        </div>
        <div>
          <el-button class="btn-info" v-if="contractType==='newHouse'&&power['sign-xf-ht-ls-add'].state||contractType==='longRent'&&power['sign-cz-ht-ls-add'].state||contractType==='financial'&&power['sign-jr-ht-ls-add'].state"  round type="primary" size="small" @click="toAddcontract">新增合同</el-button>
          <!-- <el-button class="btn-info" round type="primary" size="small" @click="toAddcontract">新增合同</el-button> -->
          <el-button class="btn-info" v-if="contractType==='newHouse'&&power['sign-xf-ht-ls-export'].state||contractType==='longRent'&&power['sign-cz-ht-ls-export'].state||contractType==='financial'&&power['sign-jr-ht-ls-export'].state"  round type="primary" size="small" @click="getExcel">导出</el-button>
          <!-- <el-button class="btn-info" round type="primary" size="small" @click="getExcel">导出</el-button> -->
        </div>
      </div>
      <component ref="tableCom" :tableHeight="tableNumberCom" v-bind:is="contractType" :tableDate="list" @getMoney="getMoney" @goDetail="goDetail"></component>
      <!-- 固定滚动条 -->
      <div class="pagination" v-if="list.length>0">
        <el-pagination
         class="pagination-info"
         @current-change="handleCurrentChange"
         :current-page="currentPage"
         layout="total, prev, pager, next, jumper"
         :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
import ScreeningTop from "@/components/ScreeningTop";
import newHouse from "../otherContract/listModule/newHouse";
import longRent from "../otherContract/listModule/longRent";
import financial from "../otherContract/listModule/financial";

export default {
  mixins: [MIXINS],
  components: {
    ScreeningTop,
    newHouse,
    longRent,
    financial
  },
  data() {
    return {
      contractForm:{},
      signData:[],//签约日期
      closingData:[],//结款日期
      loanData:[],//放款日期
      dictionary: {
        //数据字典
        "13": "", //收佣状态
        "716": "", //交易方式
      },
      total: 0,
      currentPage: 1,
      pageSize: 10,
      //合同类型
      contractType:'newHouse',
      //关键字提示语
      content:"",
      //列表数据
      list:[],
       //权限配置
      power: {
        //新房
        'sign-xf-ht-ls-export': {
          state: false,
          name: '导出'
        },
        'sign-xf-ht-ls-add': {
          state: false,
          name: '新增合同'
        },
        'sign-xf-com-htdetail': {
          state: false,
          name: '合同详情'
        },
        //长租
        'sign-cz-ht-ls-export': {
          state: false,
          name: '导出'
        },
        'sign-cz-ht-ls-add': {
          state: false,
          name: '新增合同'
        },
        'sign-cz-com-htdetail': {
          state: false,
          name: '合同详情'
        },
        //金融
        'sign-jr-ht-ls-export': {
          state: false,
          name: '导出'
        },
        'sign-jr-ht-ls-add': {
          state: false,
          name: '新增合同'
        },
        'sign-jr-com-htdetail': {
          state: false,
          name: '合同详情'
        },
      }
    }
  },
  created () {
    if(this.$route.query.type==="xf"){
      this.contractType='newHouse'
      this.content="合同编号/纸质合同编号/客源编号/手机号/项目名称/客户姓名/产权地址"
      this.getPath.unshift({name: '新房',path:this.$route.fullPath})
      this.setPath(this.getPath);
    }else if(this.$route.query.type==="cz"){
      this.contractType='longRent'
      this.content="合同编号/纸质合同编号/房源编号/客源编号/手机号/物业地址"
      this.getPath.unshift({name: '长租',path:this.$route.fullPath})
      this.setPath(this.getPath);
    }else if(this.$route.query.type==="jr"){
      this.contractType='financial'
      this.content="合同编号/纸质合同编号/房源编号/产权地址"
      this.getPath.unshift({name: '金融',path:this.$route.fullPath})
      this.setPath(this.getPath);
    }
    this.getDictionary();//字典
    this.remoteMethod();//部门
    let res=this.getDataList
    if(res&&(res.route===this.$route.fullPath)){
      this.list = res.data.list
      this.list.forEach(element=>{
        this.$set(element,"contractInfo",JSON.parse(element.contractInfo))
      })
      this.total = res.data.total
      let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
      this.contractForm = Object.assign({},this.contractForm,session.query)
      delete this.contractForm.pageNum
      delete this.contractForm.signStart
      delete this.contractForm.signEnd
      delete this.contractForm.closingStart
      delete this.contractForm.closingEnd
      delete this.contractForm.loanStart
      delete this.contractForm.loanEnd
      this.currentPage=session.query.pageNum
      if(session.query.signStart){
        this.signData[0]=session.query.signStart
        this.signData[1]=session.query.signEnd
      }
      if(session.query.closingStart){
        this.closingData[0]=session.query.closingStart
        this.closingData[1]=session.query.closingEnd
      }
      if(session.query.loanStart){
        this.loanData[0]=session.query.loanStart
        this.loanData[1]=session.query.loanEnd
      }
      if(this.contractForm.empId){
        this.dep=Object.assign({},this.dep,{id:this.contractForm.deptId,empId:this.contractForm.empId,empName:this.contractForm.empName})
        this.EmployeList.unshift({
          empId:this.contractForm.empId,
          name:this.contractForm.empName
        })
        this.getEmploye(this.contractForm.deptId)
      }
    }else{
      this.getContractList();//列表
    }
  },
  methods:{
    //查询
    queryFn(){
      this.currentPage=1
      this.getContractList("search")
    },
    //重置
    resetFormFn(){
      TOOL.clearForm(this.contractForm)
      this.signData=[]
      this.closingData=[]
      this.loanData=[]
      this.EmployeList = []

    },
    //获取当前部门
    initDepList:function (val) {
      if(!val){
        this.remoteMethod()
      }
    },
    searchDep:function (payload) {
      /*this.DepList=payload.list
      this.contractForm.depName=payload.depName*/
    },
    clearDep:function () {
      this.contractForm.deptId=''
      this.contractForm.depName=''
      // this.EmployeList=[]
      this.contractForm.empId=''
      this.clearSelect()
    },
    depHandleClick(data) {
      // this.getEmploye(data.depId)
      this.contractForm.deptId=data.depId
      this.contractForm.depName=data.name

      this.handleNodeClick(data)
    },
    //获取列表数据
    getContractList(type="init"){
      let url,param
      param = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        keyword:this.contractForm.keyword,
        deptId:this.contractForm.deptId,
        empId:this.contractForm.empId,
        receiveAmountState:this.contractForm.receiveAmountState
      }
      if(this.contractType==='newHouse'){
        url="/contractInfo/newHouse/contractList"
        if(this.signData){
          if (this.signData.length > 0) {
            param.signStart = this.signData[0];
            param.signEnd = this.signData[1];
          }
        }
        if(this.closingData){
          if (this.closingData.length > 0) {
            param.closingStart = this.closingData[0];
            param.closingEnd = this.closingData[1];
          }
        }
      }else if(this.contractType==='longRent'){
        url="/contractInfo/longLease/contractList"
        param.transMode=this.contractForm.transMode
        if(this.signData){
          if (this.signData.length > 0) {
            param.signStart = this.signData[0];
            param.signEnd = this.signData[1];
          }
        }
      }else{
        url="/contractInfo/finance/contractList"
        if(this.loanData){
          if (this.loanData.length > 0) {
            param.loanStart = this.loanData[0];
            param.loanEnd = this.loanData[1];
          }
        }
      }
      if(type==="search"||type==="page"){
        sessionStorage.setItem('sessionQuery',JSON.stringify({
          path:this.$route.fullPath,
          url:url,
          query:Object.assign({},param,{empName:this.dep.empName,depName:this.contractForm.depName}),
          methods:"get"
        }))
      }
      this.$ajax.get(`/api${url}`,param).then(res=>{
        res=res.data
        if(res.status===200){
          this.list=res.data.list
          this.total=res.data.total
          this.list.forEach(element=>{
            this.$set(element,"contractInfo",JSON.parse(element.contractInfo))
          })
        }
      })
    },
    //新增合同
    toAddcontract(){
      this.$router.push({
        path: "/addOtherContract",
        query: {
          type: this.contractType,
          operationType:1
        }
      });
    },
    //导出
    getExcel(){
      let url,param
      param = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        keyword:this.contractForm.keyword,
        deptId:this.contractForm.deptId,
        empId:this.contractForm.empId,
        receiveAmountState:this.contractForm.receiveAmountState
      }
      if(this.contractType==="newHouse"){
        url="/input/newHouse/contractExcel"
        if(this.signData){
          if (this.signData.length > 0) {
            param.signStart = this.signData[0];
            param.signEnd = this.signData[1];
          }
        }
        if(this.closingData){
          if (this.closingData.length > 0) {
            param.closingStart = this.closingData[0];
            param.closingEnd = this.closingData[1];
          }
        }
      }else if(this.contractType==="longRent"){
        url="/input/longLease/contractExcel"
        if(this.signData){
          if (this.signData.length > 0) {
            param.signStart = this.signData[0];
            param.signEnd = this.signData[1];
          }
        }
      }else{
        url="/input/finance/contractExcel"
        if(this.loanData){
          if (this.loanData.length > 0) {
            param.loanStart = this.loanData[0];
            param.loanEnd = this.loanData[1];
          }
        }
      }
      this.excelCreate(url,param)
    },
    //合同详情
    goDetail(val){
      if(this.power['sign-xf-com-htdetail'].state&&this.contractType==='newHouse'||this.power['sign-cz-com-htdetail'].state&&this.contractType==='longRent'||this.power['sign-jr-com-htdetail'].state&&this.contractType==='financial'){
        this.$router.push({
          path: "/otherContractDetail",
          query: {
            type: this.contractType,
            id:val.id
          }
        });
      }else{
        this.$message({
          message:"没有合同详情权限",
          type:"warning"
        })
      }
    },
    //收款
    getMoney(val){
      let router,type
      if(this.contractType==="newHouse"){
        router="新房"
        type=1
      }else if(this.contractType==="longRent"){
        router="长租"
        type=2
      }else{
        router="金融"
        type=3
      }
      this.$router.push({
        path: "/receiptBill_simple",
        query: {
          type: type,
          contId:val.id
        }
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getContractList("page");
    },

  }
}
</script>

<style scoped lang="less">
@import "~@/assets/common.less";
.contract-list {
  background-color: #fff;
  padding: 0 10px;
  border-radius: 2px;
  // box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  > .listTitle {
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
  }
}
/deep/ .el-table th {
  background: @bg-th;
}
/deep/.margin-left{
  margin-left: 0;
}
</style>