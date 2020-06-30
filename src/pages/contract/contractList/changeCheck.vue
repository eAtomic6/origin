<template>
  <div class="view-container" ref="tableComView">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
      <el-form :inline="true" :model="contractForm" class="prop-form" size="small">
        <el-form-item label="关键字">
          <el-tooltip class="item" effect="dark" content="物业地址/业主/客户/手机号/合同编号/房源编号/客源编号/审核人姓名" placement="top">
            <el-input v-model="contractForm.keyword" style="width:150px" placeholder="请输入" :clearable="true"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="签约日期">
          <el-date-picker v-model="signData" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy/MM/dd" style="width:330px">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="合同类型">
          <el-select v-model="contractForm.contTypes" multiple placeholder="全部" style="width:200px" :class="{'width300':contractForm.contTypes&&contractForm.contTypes.length>3}">
            <el-option
              v-for="item in dictionary['10']"
              v-if="item.key!=6"
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
      </el-form>
    </ScreeningTop>
    <!-- 列表 -->
    <div class="contract-list">
      <div class="listTitle">
        <div>
          <span class="title"><i class="iconfont icon-tubiao-11"></i>数据列表</span>
        </div>
        <div>
          <el-button v-if="power['sign-ht-bgsh-export'].state" class="btn-info" round type="primary" size="small" @click="getExcel">导出</el-button>
        </div>
      </div>
      <changeCancelList ref="tableCom" :tableHeight="tableNumberCom" listType="bg" :tableDate="list" @freach="freachList"></changeCancelList>
      <!-- 固定滚动条 -->
      <div class="pagination" v-if="list.length>0">
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
  </div>
</template>
           
<script>
import ScreeningTop from "@/components/ScreeningTop";
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
import changeCancelList from "../contractDialog/changeCancelList";
export default {
  mixins: [MIXINS],
  components: {
    ScreeningTop,
    changeCancelList,
  },
  data(){
    return{
      contractForm:{
        dealAgentId:''
      },
      signData:[],
      list:[],
      total:0,
      currentPage:1,
      pageSize:10,
      dictionary: {
        //数据字典
        "10": "", //合同类型
        "51": "", //审核状态
      },
      power:{
        'sign-ht-bgsh-export': {
          state: false,
          name: '导出'
        },
      }
      
    }
  },
  created(){
    //判断是否为u+跳转 u+跳转列表展示审核中数据
    if(this.$route.query.source&&this.$route.query.source==="uplus"){
      // this.contractForm.toExamineState=0
      this.$set(this.contractForm,'toExamineState',0)
    }
    this.getDictionary();//字典
    this.remoteMethod();//部门
    this.getChangeList();
  },
  methods:{
    //查询
    queryFn(){
      this.currentPage=1
      this.getChangeList("search")
    },
    //重置
    resetFormFn(){
      TOOL.clearForm(this.contractForm)
      this.signData=[]
      this.EmployeList = []
    },
    //审核列表
    getChangeList(type="init"){
      let param = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        keyword:this.contractForm.keyword,
        changeExamineState:this.contractForm.toExamineState,
        deptId:this.contractForm.deptId,
        empId:this.contractForm.dealAgentId,
      }
      if(this.signData){
        if (this.signData.length > 0) {
          param.signStart = this.signData[0];
          param.signEnd = this.signData[1];
        }
      }
      if(this.contractForm.contTypes&&this.contractForm.contTypes.length>0){
        param.contTypes=this.contractForm.contTypes.join(',')
      }else{
        param.contTypes=''
      }
      if(type==="search"||type==="page"){
        sessionStorage.setItem('sessionQuery',JSON.stringify({
          path:'/changeCheck',
          url:'/contract/changeAuditList',
          query:Object.assign({},param,{empName:this.dep.empName}),
          methods:"postJSON"
        }))
      }

      this.$ajax.get("/api/contract/changeAuditList", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.list = res.data.list;
          this.total = res.data.total;
        }
      });
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
      this.contractForm.dealAgentId='';
      this.clearSelect();
    },
    searchDep:function (payload) {
      /*this.DepList=payload.list
      this.searchForm.depName=payload.depName*/
      this.contractForm.dealAgentId=''
      this.clearSelect('emp')
    },
    depHandleClick(data) {
      this.contractForm.dealAgentStoreId=data.depId;
      this.contractForm.depName=data.name;
      this.contractForm.dealAgentId='';
      this.handleNodeClick(data);
    },
    //导出
    getExcel(){
      let param = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        keyword:this.contractForm.keyword,
        changeExamineState:this.contractForm.toExamineState,
        deptId:this.contractForm.deptId,
        empId:this.contractForm.dealAgentId,
      }
      if(this.signData){
        if (this.signData.length > 0) {
          param.signStart = this.signData[0];
          param.signEnd = this.signData[1];
        }
      }
      if(this.contractForm.contTypes&&this.contractForm.contTypes.length>0){
        param.contTypes=this.contractForm.contTypes.join(',')
      }else{
        param.contTypes=''
      }
      this.excelCreate("/input/changeAuditExcel",param)
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getChangeList("page");
    },
    //审核成功刷新列表
    freachList(){
      this.getChangeList("search");
    }
  },
  
};
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
/deep/.margin-left{
  margin-left: 0;
}
</style>