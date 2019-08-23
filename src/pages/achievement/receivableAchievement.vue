<template>
  <div class="layout" style="background-color: #f5f5f5" ref="tableComView">
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
      <!-- 筛选条件 -->
      <el-form :inline="true" ref="propForm" :model="propForm" class="prop-form" size="small">

        <el-form-item label="关键字" prop="search">
        <el-tooltip content="合同编号/房源编号/客源编号/物业地址" placement="top">
          <el-input
            class="w200"
            v-model="propForm.search"
            placeholder="请输入"
            :trigger-on-focus="false"
            clearable
          ></el-input>
       </el-tooltip>
        </el-form-item>

        <el-form-item  class="mr" style="width:400px;">
        <!-- <div style="width:400px;"> -->
         <el-select :clearable="false" size="small"  placeholder="请选择" class="f_l" style="margin-right:10px;" v-model="propForm.timeType" @change="changeTimeType">
                    <el-option
                      v-for="item in timeArr"
                      :key="item.val"
                      :label="item.desc"
                      :value="item.val">
                    </el-option>
        </el-select>
        <el-date-picker
          v-model="propForm.dateMo"
          class="w330 f_l"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <!-- </div> -->

        </el-form-item>

        <!-- 部门 -->
        <el-form-item label="部门" style="margin-right:0px;">
              <!-- <el-select :clearable="true" ref="tree" size="small" :loading="Loading" :remote-method="remoteMethod" @visible-change="initDepList" @clear="clearDep"   v-model="propForm.department" placeholder="请选择">
                <el-option class="drop-tree" value="">
                  <el-tree :data="DepList" :props="defaultProps" @node-click="depHandleClick"></el-tree>
                </el-option>
              </el-select> -->
             <select-tree :data="DepList" :init="propForm.department" @checkCell="depHandleClick" @clear="clearDep" @search="searchDep"></select-tree>
       </el-form-item>

        <el-form-item>
             <el-select :clearable="true" v-loadmore="moreEmploye" @change="handleEmpNodeClick" class="margin-left" size="small" v-model="propForm.dealAgentId" placeholder="请选择">
               <el-option
                 v-for="item in EmployeList"
                 :key="item.empId"
                 :label="item.name"
                 :value="item.empId">
               </el-option>
             </el-select>
       </el-form-item>

        <el-form-item label="合同类型" prop="contractType">
          <el-select v-model="propForm.contractType" class="width200" :class="{'width325':propForm.contractType.length>3}" multiple :clearable="true">
            <el-option
              v-for="item in dictionary['10']"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

      <el-form-item label="合作方式" prop="contractType">
          <el-select v-model="propForm.joinMethods" class="w120" :clearable="true">
            <el-option
              v-for="item in dictionary['53']"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <!-- 筛选条件 end -->
    <!-- 数据列表 -->
    <div class="data-layout">
      <!-- 头部 -->
      <div class="table-tool">
        <div class="tool-left">
          <h4 class="f14">
            <i class="iconfont icon-tubiao-11"></i>数据列表
          </h4>
          <!-- <ul>
            <li>
              <span>
                总分成：
                <b class="orange">{{countData[3] ?countData[3] :'0'}}元</b>，
              </span>
            </li>
            <li>
              <span>分类分成：</span>
            </li>
            <li>
              <span>
                出售：
                <b class="orange">{{countData[1] ?countData[1] :'0'}}元</b>，
              </span>
            </li>
            <li>
              <span>
                代办：
                <b class="orange">{{countData[2] ?countData[2] :'0'}}元</b>，
              </span>
            </li>
            <li>
              <span>
                出租：
                <b class="orange">{{countData[0] ?countData[0] :'0'}}元</b>
              </span>
            </li>
          </ul> -->
        </div>
        <el-button class="f_r" round type="primary" size="medium" @click="getExcel" style="padding:9px 15px;min-width: 80px;" v-if="power['sign-yj-rec-export'].state">导出</el-button>
      </div>
      <!-- 头部 end -->
      <!-- 表格 -->
      <div class="data-list" v-loading="loading">
        <el-table :data="receivableList" style="width: 100%" @row-dblclick="dialogVisible = true"  ref="tableCom" :max-height="tableNumberCom" border>
          <!-- code -->
          <el-table-column label="合同信息" align="center" min-width="120">
            <template slot-scope="scope">
              <p>
                <span class="blue" @click="skipContDel(scope.row)"  style="cursor:pointer;">{{scope.row.code}}</span>
              </p>
            </template>
          </el-table-column>

          <!-- contType  合同类型(0:租赁 1:低佣 2:二手  3:代办)-->
          <el-table-column label="合同类型" align="center" min-width="60">
            <template slot-scope="scope">
              <p>{{scope.row.contType.label}}</p>
            </template>
          </el-table-column>

          <!-- propertyAddr -->
          <el-table-column prop="propertyAddr" label="物业地址" align="center" min-width="120"></el-table-column>

          <!-- dealStorefront   dealName -->
          <el-table-column prop="man" label="成交经纪人" align="center" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.dealName">
                <p>{{scope.row.dealStorefront}}-{{scope.row.dealName}}</p>
              </div>
              <div v-else>
                <p>暂无</p>
              </div>
            </template>
          </el-table-column>

          <!-- signDate -->
          <el-table-column prop="date" label="签约日期" align="center" min-width="90">
            <template slot-scope="scope">
              <p>{{scope.row.signDate|formatDate}}</p>
            </template>
          </el-table-column>


          <el-table-column prop="actualSettlement" label="结算金额（元）" align="center" min-width="80"></el-table-column>

          <el-table-column  label="结算日期" align="center" min-width="90">
                      <template slot-scope="scope">
                          <p>{{scope.row.settleTime|formatDate}}</p>
                      </template>
          </el-table-column>

          <el-table-column label="分成人" align="center" min-width="120">
               <template slot-scope="scope">
                          <p>{{scope.row.level4}}-{{scope.row.assignor}}</p>
                 </template>
          </el-table-column>

          <el-table-column prop="roleName" label="角色类型" align="center" min-width="60"></el-table-column>

          <el-table-column prop="ratio" label="分成比例（%）" align="center" min-width="60"></el-table-column>

          <el-table-column prop="agentPayFee" label="刷卡手续费（元）" align="center" min-width="80"></el-table-column>

          <el-table-column prop="agentPlatformFee" label="特许服务费（元）" align="center" min-width="80"></el-table-column>

          <el-table-column prop="agentReceipts" label="实收分成金额（元）" align="center" min-width="80"></el-table-column>
        </el-table>
         <el-pagination
             @size-change="handleSizeChange"
             @current-change="handleCurrentChange"
             :current-page="currentPage"
             :page-size="pageSize"
             layout="total,prev, pager, next , jumper"
             :total="total"
             v-if="total!=0"
       ></el-pagination>
      </div>

      <!-- 分页 -->
       <!-- <div class="pagination" v-if="total!=0">

       </div> -->

    </div>
  </div>
</template>

<script>
import { MIXINS } from "@/assets/js/mixins";
export default {
  mixins: [MIXINS],
  name: "actualAchievement",
  data() {
    return {
      receivableList: [], //实收数据列表数组
      countData: [], //数据统计数组
      departs: [],
      depUser: "",
      users: [],
      // 筛选条件
      propForm: {
        department: "", //部门
        dealAgentStoreId:null,
        dealAgentId:null,
        departmentDetail: "", //部门详情
        contractType: "", //合同类型
        dateMo: "", //时间
        search: "" ,//关键字
        timeType:0,
        joinMethods:"",//合作方式
        empName:''
      },
      dictionary: {
        //数据字典
        "10": "", //合同类型
        "53":""  //合作方式
      },
      pageSize: 10,
      currentPage: 1,
      ajaxParam: {},
      total: 0,
      loading: true,
      //权限配置
      power: {
        'sign-yj-rec-query': {
          state: false,
          name: '查询'
        },
        'sign-com-htdetail': {
          state: false,
          name: '合同详情'
        },
        'sign-yj-rec-export': {
          state: false,
          name: '导出'
        }
      },
      timeArr:[
        {
          desc:"全部",
          val:0
        },
        {
          desc:"结算日期",
          val:1
        },
        {
          desc:"签约日期",
          val:2
        }
      ]
    };
  },
  created() {
    //  实收列表
    this.ajaxParam = {
      pageNum: this.currentPage,
      pageSize: this.pageSize
    };
    this.$nextTick(()=>{
      let res=this.getDataList
      if(res&&(res.route===this.$route.path)){
        this.receivableList = res.data.list;
        this.total = res.data.total;
         let session = JSON.parse(sessionStorage.getItem('sessionQuery')).query
         this.propForm.dateMo = session.startTime?[session.startTime,session.endTime]:[]
         this.propForm.search=session.keyword
         this.propForm.dealAgentStoreId=session.dealAgentStoreId
         this.propForm.dealAgentId=session.dealAgentId
         this.propForm.empName=session.empName
         this.propForm.department=session.department
        this.propForm.pageNum = session.pageNum
        this.propForm.pageSize = session.pageSize

         this.propForm.contractType=session.contractType.split(',')
         if(this.propForm.contractType[0]!=''){
          for(let i=0;i<this.propForm.contractType.length;i++){
                    this.propForm.contractType[i]=Number(this.propForm.contractType[i])
              }
         }else{
           this.propForm.contractType=[]
         }
         if(this.propForm.dealAgentId){
            this.dep=Object.assign({},this.dep,{id:this.propForm.dealAgentStoreId,empId:this.propForm.dealAgentId,empName:this.propForm.empName})
            this.EmployeList.unshift({
              empId:this.propForm.dealAgentId,
              name:this.propForm.empName
            })
            this.getEmploye(this.propForm.dealAgentStoreId)
          }
         
         this.currentPage=session.pageNum
         this.pageSize=session.pageSize
         this.propForm.timeType=session.timeType
         this.propForm.joinMethods=session.joinMethods
        // this.propForm = Object.assign({},this.ajaxParam,session.query)
        this. $nextTick(()=>{
               this.loading=false;
            })
      }else{
        this.getData(this.ajaxParam);
      }
    })
    // 字典初始化
    this.getDictionary();
    //部门初始化
    this.remoteMethod();
  },
  components: {},
  methods: {
   // 导出功能
    getExcel(){
        this.queryFn();
        // this.ajaxParam.is_Receivable=2;
        let param = Object.assign({},this.ajaxParam)
        this.excelCreate('/input/exportSettleExcel',param)
    },
    getData(ajaxParam,typeshow,param) {
      if(typeshow!=1&&param==2){
        this.currentPage=1
      }
       this.loading=true;
       // 实收列表
        let _that = this;
        this.$ajax.get("/api/achievement/selectReceiptsList", ajaxParam).then(res => {
          let data = res.data;
          if (res.status === 200) {
            console.log(data.data.list);
            _that.receivableList = data.data.list;
            // if (data.data.list[0]) {
            //   _that.countData = data.data.list[0].contractCount;
            // } else {
            //   _that.countData = [0, 0, 0, 0];
            // }
            _that.total = data.data.total;
            this. $nextTick(()=>{
               this.loading=false;
            })

          }
        }).catch(error => {
               this.$message({message:error})
               this. $nextTick(()=>{
                  this.loading=false;
               })
        });;
    },
       //获取当前部门
    initDepList:function (val) {
      if(!val){
        this.remoteMethod()
      }
    },
     clearDep:function () {
      this.propForm.department='';
      this.EmployeList=[];
      this.propForm.dealAgentId='';
      this.propForm.dealAgentStoreId='';
      this.clearSelect()
    },
     depHandleClick(data) {
      this.propForm.dealAgentStoreId=data.depId
      this.propForm.department=data.name
      this.propForm.dealAgentId=''
      this.handleNodeClick(data)
    },
     searchDep:function (payload) {
      /*this.DepList=payload.list
      this.propForm.department=payload.depName*/
    },
    queryFn(typeshow) {
      
      // console.log("ssssssssssss");
      // console.log(this.ajaxParam);
      // console.log(this.propForm);
      if (this.propForm.dateMo) {
        this.ajaxParam = {
          dealAgentStoreId: this.propForm.dealAgentStoreId, //部门
          dealAgentId: this.propForm.dealAgentId, //员工
          contractType: this.propForm.contractType.length===0?'':this.propForm.contractType.join(','), //合同类型
          startTime: this.propForm.dateMo[0], //开始时间
          endTime: this.propForm.dateMo[1], //结束时间
          keyword: this.propForm.search, //关键字
          pageNum: this.currentPage,
          department:this.propForm.department,
          pageSize: this.pageSize,
          timeType:this.propForm.timeType,
          joinMethods:this.propForm.joinMethods//合作方式
        };
      } else {
        this.ajaxParam = {
          dealAgentStoreId: this.propForm.dealAgentStoreId, //部门
          dealAgentId: this.propForm.dealAgentId, //员工
          contractType: this.propForm.contractType.length===0?'':this.propForm.contractType.join(','), //合同类型
          keyword: this.propForm.search, //关键字
          pageNum: this.currentPage,
          department:this.propForm.department,
          pageSize: this.pageSize,
          joinMethods:this.propForm.joinMethods//合作方式
        };
      }
      // this.ajaxParam.pageNum = 1;
      // this.currentPage = 1;
      let param = JSON.parse(JSON.stringify(this.ajaxParam))
      sessionStorage.setItem('sessionQuery',JSON.stringify({
            path:'/receivableAchievement',
            url:'/achievement/selectReceiptsList',
            query:Object.assign({},param,{empName:this.dep.empName}),
            methods:'get'
          }))
      this.getData(this.ajaxParam,typeshow,2);
    },
    resetFormFn() {
      this.ajaxParam = {
        dealAgentStoreId: "", //部门
        dealAgentId: "", //员工
        contractType: "", //合同类型
        startTime: "", //开始时间
        endTime: "", //结束时间
        keyword: "" ,//关键字
        timeType:0,
        joinMethods:""//合作方式
      };
      this.ajaxParam.pageNum = 1;
      this.currentPage = 1;
      this.propForm = {
        department: "", //部门
        dealAgentStoreId:null,
        dealAgentId:null,
        departmentDetail: "", //部门详情（员工）
        contractType: "", //合同类型
        dateMo: "",
        search: "",
        timeType:0,
        joinMethods:""
      };
      this.EmployeList=[]
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.ajaxParam.pageNum = val;
      this.currentPage = val;
      this.queryFn(1);
    },
    // 跳转合同详情
    skipContDel(value) {
         if(this.power['sign-com-htdetail'].state){
            this.setPath(
              this.$tool.getRouter(["业绩", "结算业绩", "合同详情"], "receivableAchievement")
            );
            this.$router.push({
              path: "/contractDetails",
              query: {
                id: value.id,
                code: value.code,
                contType: value.contType.value
                // id: 415,
                // code: 'S0001190114009',
                // contType: 2
              }
            });
        }else{
              this.noPower('合同详情查看')
        }
    },
    changeTimeType(){
      this.propForm.dateMo="";
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/less/lsx.less";
.layout {
  .check-btn span {
    color: #478de3;
  }
  .check-btn span:first-of-type {
    margin-right: 8px;
  }
  .blue {
    color: #478de3;
  }
  .orange {
    color: #f56c6c;
  }
  .green {
    color: #54d384;
  }
  // 改变头部面包屑样式
  .head {
    .head-left {
      float: left;
      /deep/ .el-breadcrumb {
        // font-size: 12px !important;
      }

      /deep/ .el-breadcrumb__inner {
        color: #99a1aa !important;
      }
      /deep/ .el-breadcrumb__item:nth-of-type(2) .el-breadcrumb__inner {
        color: #32485f !important;
      }
    }
    .head-right {
      float: right;
    }
  }
  //  筛选条件
  .filter-layout {
    // width: 1680px;
    background-color: #fff;
    padding: 20px;
    padding-bottom: 0;
    position: relative;
    .btn {
      width: 56px;
      height: 17px;
      position: absolute;
      bottom: -17px;
      left: 50%;
      margin-left: -28px;
      z-index: 9;
      background: url(../../assets/img/icon-dowm.png) no-repeat center center;
      background-size: 56px auto;
      cursor: pointer;
    }
    .filter-left {
      h1 {
        color: #233241;
        position: relative;
        padding-left: 28px;
        b {
          position: absolute;
          width: 16px;
          height: 16px;
          // background-color: red;
          left: 00px;
          top: 50%;
          margin-top: -8px;
        }
      }
    }
    .filter-right {
      .el-button--primary {
        width: 100px;
        height: 36px;
        border-radius: 18px;
        line-height: 36px;
        padding: 0;
      }
      .el-button--primary:first-of-type {
        background-color: #fff;
        color: #32485f;
        border: 2px solid #e8eaf6;
      }
      .el-button--primary:nth-of-type(2) {
        background-color: #478de3;
        color: #fff;
        border: 0;
      }
    }
  }

  //数据列表
  .data-layout {
    background-color: #fff;
    padding: 10px;
    padding-top: 0;
    margin-top: 20px;
    padding-bottom: 0;
    .table-tool {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: @margin-base 0;
      .tool-left {
        display: inherit;
        align-items: center;
        > h4 {
          > i {
            margin-right: 8px;
          }
        }
        > ul {
          display: flex;
          margin-left: 20px;
          > li {
            color: @color-6c;
          }
        }
      }
      /*>p{
        position: absolute;
        top: 50%;
        right: 0;
        transform:translateY(-50%);
      }*/
    }
  }
  // 展示数据
  .data-list {
    width: 100%;
    /deep/ .el-table {
      // font-size: 14px !important;
      td,
      th {
        padding: 24px 0;
      }
      .el-table__header {
        th {
          padding: 6px 0;
          background-color: #eef2fb;
        }
      }
    }
  }
}
// /deep/ .pagination{
//   padding-top: 0;
.el-pagination {
  text-align: right;
  // padding-bottom: 50px;
  // padding-top: 50px;
}
.width200{
  width: 200px !important;
}
.width325{
  width: 325px !important;
}
// }
.w430 {
  width: 430px;
}
</style>
