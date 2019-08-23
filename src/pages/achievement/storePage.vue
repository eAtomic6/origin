<template>
    <div>
      <div class="data-list">
          <div class="title">
              <span style="margin-left:10px">店内业绩明细</span>
                            <el-button
                              class="f_r"
                              round
                              type="primary"
                              size="medium"
                              @click="getExcel"
                              style="padding:9px 10px;margin-right:10px;min-width: 80px;"
                            >导出</el-button>     

          </div>
                         <el-table
                            :data="tableData1"
                            style="width: 100%"
                            @row-dblclick="dialogVisible = true"
                            >

                               <el-table-column
                                 prop="date"
                                 label="签约日期"
                                 width="110">
                                 <template slot-scope="scope">
                                          <p>{{scope.row.signTime|formatDate}}</p>
                                  </template>
                               </el-table-column>

                               <el-table-column
                                 label="合同编号"
                                 >
                                  <template slot-scope="scope">
                                          <p><span class="blue" @click="skipContDel(scope.row)"
                                            style="cursor:pointer;">{{scope.row.contractCode}}</span></p>
                                  </template>
                               </el-table-column>
                                

                               <el-table-column
                                 prop="propertyAddr"
                                 label="物业地址"
                                 >
                               </el-table-column>

                              <el-table-column
                                 label="房源方门店"
                                 width="130">
                                  <template slot-scope="scope">
                                          {{scope.row.customerInfo}}
                                  </template>
                               </el-table-column>  

                               <el-table-column
                                 label="客源方门店"
                                 width="130">
                                  <template slot-scope="scope">
                                          {{scope.row.houseInfo}}
                                  </template>
                               </el-table-column>  

                               <el-table-column
                                 label="合同类型"
                                 width="100">
                                 <template slot-scope="scope">
                                          <span v-if="scope.row.contType">{{scope.row.contType.label}}</span>
                                  </template>
                               </el-table-column>

                                <el-table-column
                                 prop="receivableComm"
                                 label="合同应收佣金(元)"
                                 width="130">
                               </el-table-column>
                               

                               <el-table-column
                                  prop="ratio"
                                 label="分成比例（%）"
                                 width="80">
                               </el-table-column>

                               <el-table-column
                                 prop="actualComm"
                                 label="实收分成总金额(元)"
                                 >
                               </el-table-column>

                               <el-table-column
                                 prop="financialFee"
                                 label="金融服务费(元)"
                                 width="120">
                               </el-table-column>
                  

                                <el-table-column
                                  prop="damagesFee"
                                 label="违约金(元)"
                                 width="130">
                               </el-table-column>

                               <el-table-column
                                 prop="platformFee"
                                 label="特许服务费(元)"
                                 width="120"
                                 >
                               </el-table-column>

                               <el-table-column
                                  prop="cardFee"
                                 label="刷卡手续费(元)"
                                 width="145">
                               </el-table-column>

                                      
                          </el-table>
                            <!-- 分页 -->
                             <el-pagination
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="pageNum"
                               :page-size="pageSize"
                               layout="total, prev, pager, next, jumper"
                               :total="total"
                               v-if="total!=0">
                            </el-pagination> 
                      </div>
    </div>
</template>
           
<script>
import {FILTER} from "@/assets/js/filter";
import {MIXINS} from "@/assets/js/mixins";
export default {
  mixins: [MIXINS, FILTER],
  data() {
    return {
      filterShow: true,
      tableData: [],
    //   propForm: {
    //     department: "", //部门
    //     dateMo: "" ,//时间
    //     depId:''
    //   },
      tableData1:[],
      depId:'',
      total: 0,
      brandShow: false,
      brandArr: [],
      tableShow: true, //控制门店实收表格，门店明细表格两者显示与隐藏
      storeTitle: "全公司",
      steps: 1,
      partStep: "副总",
      pageSize:10,
      pageNum:1,
      startTime:'',
      endTime:'',
      power:{
        "sign-com-htdetail": {
          state: false,
          name: "合同详情"
        },
      }
    };
  },
  created() {
    this.setPath(this.$tool.getRouter(['业绩','业绩报表','业绩明细'],'storeReceive'))
    this.depId=this.$route.query.depId
    this.startTime=this.$route.query.startTime
    this.endTime=this.$route.query.endTime
    var param={
        pageSize:this.pageSize,
        pageNum:this.pageNum,
        subDepIds:this.depId,
        // startTime:this.startTime,
        // endTime:this.endTime
      }
      if(this.startTime!=''){
         param=Object.assign({},param,{startTime:this.startTime,endTime:this.endTime})
      }
    this.getData(param)
    
    // this.storeTitle = this.testData0.title;
  },
  methods: {
    getData(param){
      this.$ajax.get('/api/achForm/getAchForm',param).then(res=>{

            this.tableData1=res.data.data.list
            this.total=res.data.data.total
         
      }).catch(err=>{
        this.$message({message:err})
      })
    },
    skipContDel(value){
        if (this.power["sign-com-htdetail"].state) {
        let param = {
          code: value.contractCode
        };
        this.$ajax
          .get("/api/achievement/judgeContDetailsPower", param)
          .then(res => {
            console.log(res.data.data);
            if (res.data.data) {
              this.setPath(
                this.$tool.getRouter(
                  ["业绩", "应收业绩", "合同详情"],
                  "actualAchievement"
                )
              );
              this.$router.push({
                path: "/contractDetails",
                query: {
                  id: value.id,
                  code: value.contractCode,
                  contType: value.contType.value
                }
              });
            } else {
              this.noPower("合同详情查看");
            }
          });
      } else {
        this.noPower("合同详情查看");
      }
    },

    getExcel(){
        var param={
        // pageSize:this.pageSize,
        // pageNum:this.pageNum,
        subDepIds:this.depId,
        depLevel:5
      }
      if(this.startTime!=''){
         param=Object.assign({},param,{startTime:this.startTime,endTime:this.endTime})
      }
      this.excelCreate("/input/performanceExcel", param);
    },
    resetFormFn(){
      this.propForm.department=''
      this.propForm.departmentDetail=''
      this.propForm.dateMo=''
    },
    clearDep: function() {
      this.propForm.department = "";
      this.propForm.depId='';
      this.EmployeList = [];
      // this.propForm.dealAgentId = "";
      // this.propForm.dealAgentStoreId = "";
      this.clearSelect();
    },
    depHandleClick(data) {
      this.propForm.depId = data.depId;
      this.propForm.department = data.name;
      // this.propForm.dealAgentId = "";
      this.handleNodeClick(data);
    },
    searchDep: function(payload) {
      /*this.DepList=payload.list
      this.propForm.department=payload.depName*/
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
        this.pageNum=val
        var param={
        pageSize:this.pageSize,
        pageNum:this.pageNum,
        subDepIds:this.depId,
        // startTime:this.startTime,
        // endTime:this.endTime
      }
      if(this.startTime!=''){
         param=Object.assign({},param,{startTime:this.startTime,endTime:this.endTime})
      }
        this.getData(param)
    },
    
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/less/lsx.less";
  .data-list {
    width: 100%;
    /deep/ .el-table {
       padding: 0 10px;
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
   .title{
       display: flex;
       justify-content: space-between;
       align-items: center;
       height: 44px;
   }
  /deep/ .el-pagination {
    text-align: right;
  }
  /deep/ .el-input__suffix {
    right: 12px;
  }
</style>