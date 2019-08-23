<template>
  <div class="view-container" ref="tableComView">
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn" :min="45">
      <el-form :inline="true" :model="searchForm" class="prop-form" size="small">
        <el-form-item label="结算日期">
          <el-date-picker v-model="signDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy/MM/dd" :picker-options="pickerBeginDateBefore" :default-value="timeDefaultShow" style="width:330px">
          </el-date-picker>

        </el-form-item>
        <el-form-item label="分账门店">
          <el-select v-model="searchForm.outStoreAttr" placeholder="全部" :clearable="true" style="width:150px" @change="changeStoreAttr_out">
            <el-option v-for="item in dictionary['53']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select
            v-model="searchForm.outStoreId"
            :multiple="false"
            filterable
            remote
            placeholder="全部"
            :remote-method="remoteMethod_out"
            v-loadmore.out="moreDeps"
            :clearable="true"
            @clear="clearOutList('out')"
            @change="checkOut"
            :loading="loading">
            <el-option
              v-for="item in outStoreList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收账门店">
          <el-select v-model="searchForm.inStoreAttr" placeholder="全部" :clearable="true" style="width:150px" @change="changeStoreAttr_in">
            <el-option v-for="item in dictionary['53']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select
            v-model="searchForm.inStoreId"
            :multiple="false"
            filterable
            remote
            placeholder="全部"
            :remote-method="remoteMethod_in"
            v-loadmore.in="moreDeps"
            :clearable="true"
            @clear="clearOutList('in')"
            @change="checkIn"
            :loading="loading">
            <el-option
              v-for="item in inStoreList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签约方式">
          <el-select v-model="searchForm.recordType" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['64']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <!-- 列表 -->
    <div class="routing-list">
      <p><span class="title"><i class="iconfont icon-tubiao-11"></i>数据列表</span></p>
      <el-table :data="tableData" border @row-dblclick='toDetail' ref="tableCom" :max-height="tableNumberCom">
        <el-table-column align="center" label="签约方式">
          <template slot-scope="scope">
            <span>{{scope.row.recordType|recordFormatter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="分账门店" prop="outStoreName">
        </el-table-column>
        <el-table-column align="center" label="分账门店账户" prop="outBankCard">
        </el-table-column>
        <el-table-column align="center" label="收款门店" prop="inStoreName">
        </el-table-column>
        <el-table-column align="center" label="收款门店账户">
          <template slot-scope="scope">
            <!-- <p v-for="item in scope.row.inBank" :key="item.bankCard">{{item.bankCard}}</p> -->
            <el-tooltip placement="top">
              <div slot="content">
                <div v-for="item in scope.row.inBank" :key="item.bankCard">
                  <p>银行账户：{{item.bankCard}}</p>
                  <p>开户名：{{item.bankAccountName}}</p>
                  <p>开户行：{{item.bankName}}{{item.bankBranchName==="—"?"":item.bankBranchName}}</p>
                </div>
              </div>
              <div>
                <p v-for="item in scope.row.inBank" :key="item.bankCard">{{item.bankCard}}</p>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="分账周期">
          <template slot-scope="scope">
            <span>{{scope.row.startTime|timeFormat_}}</span> ~
            <span>{{scope.row.endTime|timeFormat_}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="分账金额(元)" prop="accountAmount">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="medium" v-if="power['sign-ht-fz-pay'].state&&scope.row.flag!=1" @click="toReceipt(scope.row,scope.$index)">确认打款</el-button>
            <span v-else>-</span>
             <!-- v-if="power['sign-ht-fz-pay'].state" -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 固定滚动条 -->
      <div class="pagination" v-if="tableData.length>0">
        <el-pagination
         class="pagination-info"
         @current-change="handleCurrentChange"
         :current-page="currentPage"
         :page-size="pageSize"
         layout="total, prev, pager, next, jumper"
         :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 确认收款 -->
    <el-dialog title="确认打款" :visible.sync="dialogReceipt" width="600px" :closeOnClickModal="$tool.closeOnClickModal" @close="closeReceipt">
      <div class="receipt_one">
        <span class="tag">分账周期：<span class="text">{{receiptData.startTime|timeFormat_}} ~ {{receiptData.endTime|timeFormat_}}</span></span><span>收款门店：<span class="text">{{receiptData.inStoreName}}</span></span>
      </div>
      <div class="receipt_two">
        <p class="tag">收款门店账户选择：</p>
        <ul>
          <li v-for="(item,index) in receiptData.inBank" :key="index">
            <el-radio v-model="radio" :label="item">
              <span class="accountType">账户类型：{{item.type===1?'企业账户':'个人账户'}}</span>
              <span>银行：{{item.bankName}}</span><br>
              <span class="bankAccountName">开户名：{{item.bankAccountName}}</span><br>
              <span class="bankName">银行账户：{{item.bankCard}}</span><br>
              <span class="bankBranchName" v-if="item.type===1">支行：{{item.bankBranchName}}</span>
            </el-radio>
          </li>
        </ul>
      </div>
      <div class="receipt_three">
        <span class="receiptReason">打款备注：</span>
        <el-input type="textarea" :rows="6" placeholder="请输入打款备注，最多200字 " v-model="receiptReason" resize='none' style="width:460px;overflow-y:hidden" maxlength="200"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="dialogReceipt = false">取消</el-button>
        <el-button round type="primary" :disabled="canClick" @click="commit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ScreeningTop from "@/components/ScreeningTop";
import { MIXINS } from "@/assets/js/mixins";
import { TOOL } from "@/assets/js/common";

export default {
  mixins: [MIXINS],
  components: {
    ScreeningTop
  },
  data() {
    return {
      timeDefaultShow:'',//结算日期范围改为默认是前一个月和当月
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          return time.getTime() >= Date.now()

          }
      },
      searchForm: {
        outStoreId:'',//分账门店id
        outStoreAttr:'',//分账门店属性
        inStoreId:'',//收款门店id
        inStoreAttr:'',//收款门店属性
        recordType:'',//分账类型
      },
      outStoreList:[],//分账门店
      inStoreList:[],//收款门店
      checkOutDep:{
        id:'',
        name:''
      },
      checkInDep:{
        id:'',
        name:''
      },
      currentPage_out:1,//分账
      pageSize_:10,
      currentPage_in:1,//收款
      signDate: [],
      tableData:[],
      currentPage:1,
      pageSize:50,
      total:0,
      total_out:0,
      total_in:0,
      loading:false,
      //部门选择列表
      options:[],
      firstTotal:0,
      dictionary: {
        //数据字典
        "53": "", //合作方式
        "64": "",
      },
      dialogReceipt:false,
      receiptData:{},
      receiptReason:'',//备注
      radio:'',
      index:'',
      canClick:false,
      power: {
        'sign-ht-fz-pay': {
          state: false,
          name: '确认打款'
        },
      }
    };
  },
  created() {
    this.getDictionary();//字典
    // this.getDepList({
    //   // type:'G',
    //   pageNum:this.currentPage_,
    //   pageSize:this.pageSize_,
    // })
    let res=this.getDataList
    if(res&&(res.route===this.$route.path)){
      this.tableData = res.data.list
      this.total = res.data.total
      let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
      this.searchForm = Object.assign({},this.searchForm,session.query)
      delete this.searchForm.pageNum
      delete this.searchForm.startTime
      delete this.searchForm.endTime
      this.currentPage=session.query.pageNum

      if(this.searchForm.outStoreAttr){
        let param = {
          pageNum:this.currentPage_out,
          pageSize:this.pageSize_,
        }
        param.depAttr=this.searchForm.outStoreAttr===1?"DIRECT":"JOIN"
        this.getDepList(param,true,"out")
      }
      if(this.searchForm.inStoreAttr){
        let param = {
          pageNum:this.currentPage_in,
          pageSize:this.pageSize_,
        }
        param.depAttr=this.searchForm.inStoreAttr===1?"DIRECT":"JOIN"
        this.getDepList(param,true,"in")
      }
      if(!this.searchForm.outStoreAttr&&!this.searchForm.inStoreAttr){
        this.getDepList({
          // type:'G',
          pageNum:1,
          pageSize:this.pageSize_,
        })
      }
      if(this.searchForm.checkOutDep.id){
        this.outStoreList.unshift({
          id:this.searchForm.checkOutDep.id,
          name:this.searchForm.checkOutDep.name
        })
      }
      if(this.searchForm.checkInDep.id){
        this.inStoreList.unshift({
          id:this.searchForm.checkInDep.id,
          name:this.searchForm.checkInDep.name
        })
      }
      if(session.query.startTime){
        this.signDate[0]=session.query.startTime
        this.signDate[1]=session.query.endTime
      }
    }else{
      this.getDepList({
        // type:'G',
        pageNum:1,
        pageSize:this.pageSize_,
    })
    }
    //结算日期的默认范围改为前月和当月
    let date = new Date();
    this.timeDefaultShow=new Date(date.getFullYear(),date.getMonth(),0)
  },
  methods: {
    //获取分账记录列表
    getProateNotes(type="init"){
      let param = {
        pageNum:this.currentPage,
        pageSize:this.pageSize
      }
      param = Object.assign({}, param, this.searchForm);
      if (this.signDate&&this.signDate.length > 0) {
        param.startTime = this.signDate[0];
        param.endTime = this.signDate[1];
      };
      if(type==="search"||type==="page"){
        sessionStorage.setItem('sessionQuery',JSON.stringify({
          path:'/routingRecord',
          url:'/separate/account/list',
          query:Object.assign({},param,{checkOutDep:this.checkOutDep},{checkInDep:this.checkInDep}),
          methods:"get"
        }))
      }
      this.$ajax.get('/api/separate/account/list',param).then(res=>{
        res=res.data;
        if(res.status===200){
          this.tableData=res.data.list;
          this.total=res.data.total;
        }
      }).catch(error=>{
        this.$message({
          message:error.message,
          type:"error"
        })
      })
    },
    //记录选中的门店
    checkOut(data){//分账门店
      if(data){
        let cell = this.outStoreList.find(item=>item.id===data)
        this.checkOutDep=Object.assign({},this.checkOutDep,{
          id:cell.id,
          name:cell.name
        })
      }else{
        this.checkOutDep.id=''
        this.checkOutDep.name=''
      }
    },
    checkIn(data){//收款门店
      if(data){
        let cell = this.inStoreList.find(item=>item.id===data)
        this.checkInDep=Object.assign({},this.checkInDep,{
          id:cell.id,
          name:cell.name
        })
      }else{
        this.checkInDep.id=''
        this.checkInDep.name=''
      }
    },
    // 查询
    queryFn() {
      if(this.signDate&&this.signDate.length>1){
        this.pageNum=1
        this.getProateNotes("search");
      }else{
        this.$message({
          message:"请选择时间范围",
          type:'warning'
        })
      }
    },
    // 重置
    resetFormFn() {
      TOOL.clearForm(this.searchForm);
      // this.outStoreList=this.options//分账门店
      // this.inStoreList=this.options//收款门店
      this.currentPage_out=1//分账
      this.currentPage_in=1//收款
      // this.total_out=this.firstTotal
      // this.total_in=this.firstTotal
      this.signDate=[]
      this.outStoreList=[]
      this.inStoreList=[]
      this.getDepList({
        // type:'G',
        pageNum:this.currentPage_,
        pageSize:this.pageSize_,
      })
      this.checkOutDep.id=''
      this.checkOutDep.name=''
      this.checkInDep.id=''
      this.checkInDep.name=''
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getProateNotes("page");
    },
    getDepList(param,first=true,type='other'){
      this.$ajax.get('/api/organize/deps/pages',param).then(res=>{
        res=res.data;
        if(res.status===200){
          let outList = [].concat(res.data.list)
          let inList = [].concat(res.data.list)
          if(this.searchForm.checkOutDep&&this.searchForm.checkOutDep.id){
            res.data.list.forEach((element,index) => {
              if(this.searchForm.checkOutDep&&this.searchForm.checkOutDep.id===element.id){
                outList.splice(index,1)
              }
            });
          }
          if(this.searchForm.checkInDep&&this.searchForm.checkInDep.id){
            res.data.list.forEach((element,index) => {
              if(this.searchForm.checkInDep&&this.searchForm.checkInDep.id===element.id){
                inList.splice(index,1)
              }
            });
          }
          if(first){
            if(type==="out"){
              this.outStoreList=this.outStoreList.concat(outList);
              this.total_out=res.data.total
            }else if(type==="in"){
              this.inStoreList=this.inStoreList.concat(inList);
              this.total_in=res.data.total
            }else{
              this.outStoreList=this.outStoreList.concat(outList);
              this.inStoreList=this.inStoreList.concat(inList);
              this.total_out=res.data.total
              this.total_in=res.data.total
            }
            // this.options=res.data.list;
            // this.firstTotal=res.data.total;
          }else{
            if(type==='out'){
              this.outStoreList=res.data.list;
              this.total_out=res.data.total
            }else if(type==='in'){
              this.inStoreList=res.data.list;
              this.total_in=res.data.total
            }
          }
        }
      })
    },
    //搜索
    remoteMethod_out(keyword){
      if(keyword!==''){
        this.currentPage_out=1;
        let param = {
          // type:'G',
          keyword:keyword,
          pageSize:this.pageSize_,
          pageNum:this.currentPage_out,
          depAttr:''
        }
        if(this.searchForm.outStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.searchForm.outStoreAttr===2){
          param.depAttr='JOIN'
        }
        this.getDepList(param,false,'out')
      }
    },
    remoteMethod_in(keyword){
      if(keyword!==''){
        this.currentPage_in=1;
        let param = {
          // type:'G',
          keyword:keyword,
          pageSize:this.pageSize_,
          pageNum:this.currentPage_in,
          depAttr:''
        }
        if(this.searchForm.inStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.searchForm.inStoreAttr===2){
          param.depAttr='JOIN'
        }
        this.getDepList(param,false,'in')
      }
    },
    //门店下拉加载更多
    moreDeps(type){
      if(type==='out'){
        if(this.total_out>this.outStoreList.length){
          this.currentPage_out++;
          let param = {
            // type:'G',
            pageNum:this.currentPage_out,
            pageSize:this.pageSize_
          }
          this.$ajax.get('/api/organize/deps/pages',param).then(res=>{
            res=res.data;
            if(res.status===200){
              this.outStoreList=this.outStoreList.concat(res.data.list);
            }
          })
        }
      }else{
        if(this.total_in>this.inStoreList.length){
          this.currentPage_in++;
          let param = {
            // type:'G',
            pageNum:this.currentPage_in,
            pageSize:this.pageSize_
          }
          this.$ajax.get('/api/organize/deps/pages',param).then(res=>{
            res=res.data;
            if(res.status===200){
              this.inStoreList=this.inStoreList.concat(res.data.list);
            }
          })
        }
      }
    },
    //改变门店类型
    changeStoreAttr_out(value){
      this.currentPage_out=1;
      this.searchForm.outStoreId='';
      let param = {
        // type:'G',
        pageNum:this.currentPage_out,
        pageSize:this.pageSize_,
        depAttr:''
      }
      this.checkOutDep.id=''
      this.checkOutDep.name=''
      if(value===1){
        param.depAttr='DIRECT'
      }else if(value===2){
        param.depAttr='JOIN'
      }
      this.getDepList(param,false,'out')
    },
    changeStoreAttr_in(value){
      this.currentPage_in=1;
      this.searchForm.inStoreId='';
      let param = {
        // type:'G',
        pageNum:this.currentPage_in,
        pageSize:this.pageSize_,
        depAttr:''
      }
      this.checkInDep.id=''
      this.checkInDep.name=''
      if(value===1){
        param.depAttr='DIRECT'
      }else if(value===2){
        param.depAttr='JOIN'
      }
      this.getDepList(param,false,'in')
    },
    //清空选择的门店
    clearOutList(type){
      if(type==='out'){
        this.currentPage_out=1;
        let param = {
          // type:'G',
          pageNum:this.currentPage_out,
          pageSize:this.pageSize_,
          depAttr:''
        }
        if(this.searchForm.outStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.searchForm.outStoreAttr===2){
          param.depAttr='JOIN'
        }
        // this.getDepList(param,false,'out')
      }else{
        this.currentPage_in=1;
        let param = {
          // type:'G',
          pageNum:this.currentPage_in,
          pageSize:this.pageSize_,
          depAttr:''
        }
        if(this.searchForm.inStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.searchForm.inStoreAttr===2){
          param.depAttr='JOIN'
        }
        // this.getDepList(param,false,'in')
        }
      },
    //确认收款
    toReceipt(item,index){
      if(item.inBank&&item.inBank.length>0){
        this.dialogReceipt=true
        this.receiptData=item;
        this.index = index
      }else{
        this.$message({
          message:'没有收款门店账户',
          type:'warning'
        });
      }
    },
    commit(){
      if(this.radio){
        // this.receiptData.remark=this.receiptReason;
        // this.receiptData.inBankCard=this.radio.bankCard;
        // this.receiptData.inBankAccountName=this.radio.bankAccountName;
        // this.receiptData
        // param.startTime = this.signDate[0];
        // param.endTime = this.signDate[1];
        let search_ = JSON.parse(JSON.stringify(this.searchForm))
        search_.startTime=this.signDate[0]
        search_.endTime=this.signDate[1]
        let param = {
          queryForm:search_,
          pageNum:this.currentPage,
          pageSize:this.pageSize,
          index:this.index,
          inBankCard:this.radio.bankCard,
          inBankAccountName:this.radio.bankAccountName,
          remark:this.receiptReason
        };
        this.canClick=true
        this.$ajax.postJSON('/api/separate/account/allotted',param).then(res=>{
          res=res.data;
          if(res.status===200){
            this.canClick=false
            this.$message({
              message:'打款成功',
              type:'success'
            });
            this.getProateNotes();
            this.receiptReason='';
            this.radio='';
            this.dialogReceipt=false;
          }
        }).catch(error=>{
          this.canClick=false
          if(error.status===2001){
            this.dialogReceipt=false
            this.getProateNotes();
            this.$message({
              message:error.message,
              type:"error"
            })
          }else{
            this.$message({
              message:error,
              type:"error"
            })
          }
        })
      }else{
        this.$message({
          message:'请选择收款账户',
          type:'warning'
        })
      }
    },
    closeReceipt(){
      this.receiptReason='';
      this.radio='';
    },
    //分账详情
    toDetail(value){
      let newPage = this.$router.resolve({
        path: '/routingRemitDetail',
        query:{
          ids:value.settleDetailsIds,
          type:1
        }
      });
      window.open(newPage.href, '_blank');
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
    },
    recordFormatter:function (val) {
      if(val===1){
        return '线上'
      }else if(val===2){
        return '线下'
      }else {
        return '--'
      }
    }
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";

.routing-list {
  // margin-top: 20px;
  background-color: #fff;
  padding: 0 10px;
  border-radius: 2px;
  box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  >p{
    padding: 10px 0 10px 0;
    .title{
      padding-left: 10px;
      i{
        padding-right: 10px;
      }
    }
  }
}
/deep/.paper-box {
  padding-top: 10px !important;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 2px;
  box-sizing: border-box;
  box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  .paper-set-tit {
    padding-bottom: 10px;
  }
}
/deep/ .el-table th {
  background: @bg-th;
}
//确认打款弹窗
/deep/.el-dialog__header{
  padding: 10px;
  border-bottom: 1px solid #edecf0;
  .el-dialog__headerbtn{
    top:10px;
    right: 10px;
  }
}
.bankAccountName{
  display: inline-block;
  padding-right: 10px;
  padding-left: 23px;
  padding-bottom: 5px;
}
.accountType{
  display: inline-block;
  width: 200px;
  padding-bottom: 5px;
}
.bankBranchName{
  display: inline-block;
  padding-bottom: 5px;
  padding-left: 23px;
}
.bankName{
  display: inline-block;
  padding-left: 23px;
  padding-bottom: 5px;
}
.tag{
  display: inline-block;
  width: 246px;
  color: @color-6c;
  padding-left: 20px;
}
.receiptReason{
  display: inline-block;
  color: @color-6c;
  padding-left: 20px;
}
.text{
  color: @color-blank;
}
.receipt_one{
  padding-top: 10px;
}
.receipt_two{
  padding: 5px 0;
  >ul{
    padding-left: 40px;
    >li{
      padding: 5px 0;
      color: @color-blank;
    }
  }
}
.receipt_three{
  padding-top: 5px;
  display: flex;
}
.dialog-footer{
  /deep/.is-round{
    padding: 9px 15px;
  }
}
</style>
