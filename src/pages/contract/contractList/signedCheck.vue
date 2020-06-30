<template>
  <div class="view-container" ref="tableComView">
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
      <el-form :inline="true" :model="contractForm" class="prop-form" size="small">
        <el-form-item label="关键字">
          <el-tooltip class="item" effect="dark" content="物业地址/业主/客户/手机号/合同编号/房源编号/客源编号/审核人姓名" placement="top">
            <el-input v-model="keyword" style="width:150px" placeholder="请输入" :clearable="true"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="签约日期">
          <el-date-picker v-model="signDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy/MM/dd" style="width:330px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同类型">
          <el-select v-model="contractForm.contTypes" multiple placeholder="全部" style="width:200px" :class="{'width300':contractForm.contTypes&&contractForm.contTypes.length>3}">
            <el-option
              v-for="item in dictionary['10']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
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
        <el-form-item label="审核状态">
          <el-select v-model="contractForm.state" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['51']" :key="item.key" :label="item.value" :value="item.key" v-if="item.key!==-1">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签约方式">
          <el-select v-model="contractForm.recordType" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['64']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <!-- 合同列表 -->
    <div class="contract-list">
      <div class="listTitle">
        <p><span class="title"><i class="iconfont icon-tubiao-11"></i>数据列表</span></p>
        <div class="float-right"><el-button class="btn-info" v-if="power['sign-ht-qhsh-export'].state"  round type="primary" size="small" @click="getExcel">导出</el-button></div>
      </div>
      <el-table ref="tableCom" class="info-scrollbar" :span-method="objectSpanMethod" :data="combineList" border style="width: 100%"  @row-dblclick='toDetail' :max-height="tableNumberCom">
        <el-table-column label="合同信息" label-class-name="pdl" min-width="200" fixed>
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
              </div>
              <ul class="contract-msglist">
                <li>合同：<span class="blueColor" @click="toDetail(scope.row)">{{scope.row.code}}</span></li>
                <li v-if="scope.row.recordType.value===2">纸质合同编号：<span class="blueColor" @click="toDetail(scope.row)">{{scope.row.pCode}}</span></li>
                <li v-if="scope.row.honseCode">房源：<span>{{scope.row.honseCode}}</span> {{scope.row.showOwnerName}}</li>
                <li>客源：<span>{{scope.row.guestCode}}</span> {{scope.row.showCustName}}</li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="合同类型" min-width="80" fixed>
          <template slot-scope="scope">
            <span v-if="scope.row.contTypes">
              <!-- {{scope.row.loanType===7?"全款买卖":"贷款买卖"}} -->
              <span v-if="scope.row.loanType">{{scope.row.loanType===7?"全款买卖":"贷款买卖"}}</span>
              <span v-else>{{scope.row.contType.label}}</span>
            </span>
            <span v-else>委托合同</span>
          </template>
        </el-table-column>
        <el-table-column label="物业地址" prop="propertyAddr" min-width="160" fixed>
          <template slot-scope="scope">
            <span v-if="!scope.row.property_addr">-</span>
            <template>
              <p>{{scope.row.property_addr.split(' ')[0]}}</p>
              <p>{{scope.row.property_addr.split(' ')[1]}}</p>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="成交总价" prop="dealPrice" min-width="90" fixed>
          <template slot-scope="scope">
            <div v-if="scope.row.contTypes">
              <span>{{scope.row.price}} 元</span>
              <span v-for="item in dictionary['507']" :key="item.key" v-if="scope.row.contType.value===1&&item.key===scope.row.timeUnit"> / {{item.value}}</span>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="成交经纪人" min-width="120">
          <template slot-scope="scope">
            <p>{{scope.row.dealAgentStoreName}}</p>
            <p>{{scope.row.dealName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="签约时间" min-width="110">
          <template slot-scope="scope">
            <span v-if="scope.row.contTypes">{{Number(scope.row.signDate)|timeFormat_}}</span>
            <span v-else>{{scope.row.signDate.substr(0, 16)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="签约方式" prop="recordType.label" min-width="80">
        </el-table-column>
        <el-table-column label="可分配业绩 (元)" min-width="110">
          <template slot-scope="scope">
            {{scope.row.distributableAchievement?scope.row.distributableAchievement:'-'}}
          </template>
        </el-table-column>
        <el-table-column label="签后审核状态" prop="toExamineState.label" min-width="100">
          <template slot-scope="scope">
            <template v-if="scope.row.state">
              <span v-if="scope.row.state.value===-1" class="blue">{{scope.row.state.label}}</span>
              <span v-if="scope.row.state.value===0" class="yellow">{{scope.row.state.label}}</span>
              <span v-if="scope.row.state.value===1" class="green">{{scope.row.state.label}}</span>
              <!-- <span v-if="scope.row.state.value===2" class="red" :title="scope.row.remarks">{{scope.row.state.label}}</span> -->
              <el-tooltip class="item" popper-class="tooltipWidth" v-if="scope.row.state.value===2&&scope.row.remarks" effect="dark" placement="top">
                <span slot="content">{{scope.row.remarks}}</span>
                <span v-if="scope.row.state.value===2" class="red">{{scope.row.state.label}}</span>
              </el-tooltip>
              <span v-if="scope.row.state.value===2&&!scope.row.remarks" class="red">{{scope.row.state.label}}</span>
            </template>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="上传合同主体时间" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.upTime">{{Number(scope.row.upTime)|timeFormat_hm}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="审核时间" min-width="110">
          <template slot-scope="scope">
            <span v-if="scope.row.updateTime&&scope.row.updateTime!='-'">{{Number(scope.row.updateTime)|timeFormat_hm}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="当前审核人" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.currentReviewerId>0&&scope.row.state&&scope.row.state.value===0">
              <p>{{scope.row.currentReviewerDep}}</p>
              <p>{{scope.row.currentReviewer}}</p>
            </span>
            <p v-else>-</p>
            <el-button type="text" v-if="getUserMsg&&(scope.row.currentReviewerId===getUserMsg.empId||scope.row.previousreviewerId===getUserMsg.empId)&&scope.row.state.value===0" @click="choseCheckPerson(scope.row,scope.row.previousreviewerId===getUserMsg.empId?1:2)">{{getUserMsg&&getUserMsg.empId===scope.row.currentReviewerId?'转交审核人':'设置审核人'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="下一步审核人" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.nextReviewerId>0">
              <p>{{scope.row.nextReviewerDep}}</p>
              <p>{{scope.row.nextReviewer}}</p>
            </span>
            <p v-else>-</p>
            <el-button type="text" v-if="getUserMsg&&(scope.row.nextReviewerId!==0&&scope.row.currentReviewerId===getUserMsg.empId&&scope.row.state&&scope.row.state.value===0)" @click="choseCheckPerson(scope.row,3)" :class="{'error_':scope.row.nextReviewerId===0}">设置审核人</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="90" fixed="right" class-name="null-formatter">
          <template slot-scope="scope">
            <div style="color:red" v-if="scope.row.state&&scope.row.state.value===0&&scope.row.currentReviewerId>0&&getUserMsg&&scope.row.currentReviewerId!==getUserMsg.empId">{{scope.row.currentReviewer}}正在审核</div><div class="btn" v-if="scope.row.state&&scope.row.state.value===0&&((scope.row.currentReviewerId===getUserMsg.empId)||((!(scope.row.currentReviewerId>0))&&getUserMsg&&scope.row.grabDept))" @click="toCheck(scope.row)">审核</div>
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
    <!-- 设置/转交审核人 -->
    <checkPerson
    :show="checkPerson.state" page="list"
    :type="checkPerson.type"
    :showLabel="checkPerson.label"
    :bizCode="checkPerson.code"
    :flowType="checkPerson.flowType"
    @close="closeCheckPerson"
    @submit="closeCheckPerson"
    v-if="checkPerson.state"
    >
    </checkPerson>
    <!-- 审核弹窗 -->
    <signedDialog
    :dialogVisible="checkDialog"
    v-if="checkDialog"
    :id="id"
    :signedId="signedId"
    :isWT="isWT"
    @closeDialog="closeDialog"
    >
    </signedDialog>
  </div>
</template>

<script>
import ScreeningTop from "@/components/ScreeningTop";
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
import checkPerson from '@/components/checkPerson';
import signedDialog from "../contractDialog/signedDialog";
let printParam={}
let rows={}

export default {
  mixins: [MIXINS],
  components: {
    ScreeningTop,
    checkPerson,
    signedDialog,
  },
  data(){
    return{
      contractForm: {
        empId:''
      },
      keyword: "",
      signDate: [],
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      dictionary: {
        //数据字典
        "10": "", //合同类型
        "51": "", //审核状态
        "64":"",//签约方式  线上线下
        "507": "",//租赁时间单位
      },
      //部门选择列表
      options:[],
      checkPerson: {
        state:false,
        type:1,
        code:'',
        flowType:12,
        label:false,
        current:false
      },
      checkDialog:false,
      id:0,//合同id
      signedId:0,//签后id
      isWT:0,
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
        "sign-ht-qhsh-export": {
          state: false,
          name: '导出'
        },
      }
    }
  },
  created() {
    //判断是否为u+跳转 u+跳转列表展示审核中数据
    if(this.$route.query.source&&this.$route.query.source==="uplus"){
      this.$set(this.contractForm,'state',0)
    }
    this.getDictionary();//字典
    this.remoteMethod();//部门
    // this.getAdmin();//获取当前登录人信息
    let res=this.getDataList
    if(res&&(res.route===this.$route.path)){
      this.tableData = res.data.list
      this.total = res.data.total
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
      if(this.contractForm.empId){
        this.dep=Object.assign({},this.dep,{id:this.contractForm.depId,empId:this.contractForm.empId,empName:this.contractForm.empName})
        this.EmployeList.unshift({
          empId:this.contractForm.empId,
          name:this.contractForm.empName
        })
        this.getEmploye(this.contractForm.depId)
      }
    }else{
      this.getSignedList();//列表
    }
  },
  methods:{
    //委托合同合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }){
      if (columnIndex === 0) {
        if (row.contractEntrust&&row.contractEntrust.id&&!row.isCombine) {
          rows={
            index:rowIndex,
            id:row.contractEntrust.id
          }
          return {
            rowspan: 2,
            colspan: 1
          };
        }else {
          if(rowIndex===rows.index+1&&rows.id===row.contractEntrust.id){
            return{
              rowspan:0,
              colspan:0
            }
          }else{
            return {
              rowspan: 1,
              colspan: 1
            };
          }
        }
      }else{
        return {
          rowspan: 1,
          colspan: 1
        };
      }
    },
    getExcel:function () {
      this.excelCreate('/input/signingAuditExcel',printParam)
    },
    //获取合同列表
    getSignedList(type="init") {
      let param = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.keyword,
      };
      param = Object.assign({}, param, this.contractForm);
      if(this.signDate){
        if (this.signDate.length > 0) {
          param.signDateSta = this.signDate[0];
          param.signDateEnd = this.signDate[1];
        }
      }
      if(this.contractForm.contTypes&&this.contractForm.contTypes.length>0){
        param.contTypes=this.contractForm.contTypes.join(',')
      }else{
        param.contTypes=''
      }
      if(type==="search"||type==="page"){
        sessionStorage.setItem('sessionQuery',JSON.stringify({
          path:'/signedCheck',
          url:'/signingAudit/getlist',
          query:Object.assign({},param,{empName:this.dep.empName}),
          methods:"get"
        }))
      }
      printParam=Object.assign({},param)

      this.$ajax.get("/api/signingAudit/getlist", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getSignedList("page");
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
      this.getSignedList("search");
    },
     //字典查询
    getDictionaries() {
      this.$ajas.get("/api/dictionary/batchQuery", param).then(res => {});
    },
    //合同详情
    toDetail(value) {
      if(this.power['sign-com-htdetail'].state){
        if(value.contType.value===1||value.contType.value===2||value.contType.value===3){
          this.$router.push({
            path: "/contractDetails",
            query: {
              id: value.cid,//合同id
              contType: value.contType.value//合同类型
            }
          });
        }else{
          this.$router.push({
            path: "/detailIntention",
            query: {
              id: value.cid,
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
      this.contractForm.depId='';
      this.contractForm.depName='';
      // this.EmployeList=[]
      this.contractForm.empId='';
      this.clearSelect();
    },
    depHandleClick(data) {
      // this.getEmploye(data.depId)
      this.contractForm.depId=data.depId;
      this.contractForm.depName=data.name;
      this.contractForm.empId='';

      this.handleNodeClick(data);
    },
    searchDep:function (payload) {
      /*this.DepList=payload.list;
      this.contractForm.depName=payload.depName;*/
    },
     // 选择审核人
    choseCheckPerson:function (row,type) {
      this.checkPerson.code=row.id;
      this.checkPerson.type=type;
      if(row.nextReviewerId>=0){
        this.checkPerson.label=false;
      }else{
        this.checkPerson.label=true;
      }
      this.checkPerson.state=true;
    },
    //关闭设置审核人弹窗
    closeCheckPerson(){
      this.checkPerson.state=false;
      this.getSignedList();
    },
    //审核弹窗
    toCheck(val){
      this.id=val.cid//合同id
      this.signedId=val.id//签后ID
      if(!val.contTypes){
        this.isWT=1
      }else{
        this.isWT=0
      }
      if(val.currentReviewerId===this.getUserMsg.empId){
        this.checkDialog=true
      }else{
        let param = {
          bizCode:val.id,
          flowType:12
        }
        this.$ajax.get('/api/machine/getAuditAuth',param).then(res=>{
          res = res.data
          if(res.status===200){
            this.checkDialog=true
          }
        }).catch(error=>{
          this.$message({
            message:error,
            type: "error"
          })
        })
      }
    },
    closeDialog(){
      this.checkDialog=false
      this.id=0
      this.signedId=0
      this.isWT=0
      this.getSignedList();
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
    },
    combineList(){
      let arr = JSON.parse(JSON.stringify(this.tableData))
      arr.forEach((element,index)=>{
        //委托合同数据替换
        if(element.contTypes===0){
          element.entrustCont=JSON.parse(element.entrustCont)
          element.signDate=element.entrustCont.signDate//签约时间
          element.distributableAchievement=element.entrustCont.tradeFeeCommission//可分配业绩
          element.upTime=element.entrustCont.uploadTime//上传合同主体时间
        }
      })
      return arr
    }
  },
  filters: {
    timeFormat_: function (val) {
      if (!val) {
        return '-'
      } else {
        let time = new Date(val)
        let y = time.getFullYear()
        let M = time.getMonth() + 1
        let D = time.getDate()
        let h = time.getHours()
        let m = time.getMinutes()
        let s = time.getSeconds()
        let time_ = `${y}-${M > 9 ? M : '0' + M}-${D > 9 ? D : '0' + D} ${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
        return time_.substr(0, 16)
      }
    },
    timeFormat_hm: function (val) {
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
        return time_.substr(0, 16)
      }
    },
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.listTitle{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  .float-right{
    float: right;
  }
}
.width300{
  width: 325px !important;
}
/deep/.pdl{
  &.cell{
    padding-left: 30px !important;
  }
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
  // box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
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
  padding: 8px 10px 0 10px;
  border-radius: 2px;
  // box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
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
      .blueColor{
        color: @color-blue;
        cursor: pointer;
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
/deep/ .null-formatter {
  .cell:empty {
    position: relative;

    &:before {
      content: '--';
      width: 30px;
      display: inline-block;
    }
  }
}
.tooltipWidth{
  span{
    max-width: 160px;
    display: inline-block;
  }
}
</style>
