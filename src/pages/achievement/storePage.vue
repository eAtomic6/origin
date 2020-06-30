<template>
  <div class="layout" ref="tableComView" style="background-color: #f5f5f5">
    <!-- 筛选条件  -->
    <ScreeningTop
      @propQueryFn="getData('search')"
      @propResetFormFn="resetFormFn">
      <div class="filter-item" v-show="filterShow">
        <!-- 筛选条件 -->
        <el-form
          :inline="true"
          ref="propForm"
          :model="propForm"
          class="prop-form"
          size="small">

          <el-form-item
            label="签约日期"
            prop="dateMo"
            class="mr">
            <el-date-picker
              v-model="propForm.dateMo"
              class="w330"
              type="daterange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <!-- 部门 -->
          <el-form-item label="部门" style="margin-left:20px;">
            <select-tree
              :data="DepList"
              :init="propForm.department"
              @checkCell="depHandleClick"
              @clear="clearDep"
            ></select-tree>
          </el-form-item>
        </el-form>
      </div>
    </ScreeningTop>
    <!-- 筛选条件 end -->
    <!-- 数据列表 -->
    <div class="data-layout">
      <!-- 头部 -->
      <div class="data-head">
        <div class="data-head-left">
          <!--<div class="head-left">
            <el-button type="primary" size="small" :class="[activeItem===1?'active':'']"
                       :disabled="this.steps[0]==0?true:false" @click.native="intodetial(1)">大区汇总
            </el-button>
            <el-button type="primary" size="small" :class="[activeItem===2?'active':'']"
                       :disabled="this.steps[1]==0?true:false" @click="intodetial(2)">片区汇总
            </el-button>
            <el-button type="primary" size="small" :class="[activeItem===3?'active':'']"
                       :disabled="this.steps[2]==0?true:false" @click="intodetial(3)">门店汇总
            </el-button>
            <el-button type="primary" size="small" :class="[activeItem===4?'active':'']"
                       :disabled="this.steps[3]==0?true:false" @click="intodetial(4)">单组汇总
            </el-button>
          </div>-->
          <h4 class="f14"><i class="iconfont icon-tubiao-11"></i>数据列表</h4>
        </div>
        <el-button class="data-head-right" round type="primary" size="medium" @click="getExcel" style="padding:9px 15px;min-width: 80px;">导出</el-button>
      </div>
      <!-- 头部 end -->
      <!-- 表格一 -->
      <div class="data-list" v-show="tableShow">
        <el-table
          :data="tableData"
          ref="tableCom"
          v-loading="loading"
          :max-height="tableNumberCom"
          style="width: 100%"
          border>
          <el-table-column label="上级部门"  min-width="80"></el-table-column>
          <el-table-column label="门店"  width="80"></el-table-column>
          <el-table-column label="门店状态"  width="80"></el-table-column>

          <el-table-column label="店长" ></el-table-column>
          <el-table-column label="签约总单数" >
            <el-table-column
              prop="leaseAmount"
              label="租赁"
              
              width="70">
            </el-table-column>
            <el-table-column
              prop="lowCommissionAmount"
              label="买卖"
              
              width="70">
            </el-table-column>
            <el-table-column
              prop="secondAmount"
              label="低佣"
              
              width="70">
            </el-table-column>
            <el-table-column
              prop="agencyAmount"
              label="代办"
              
              width="70">
            </el-table-column>
          </el-table-column>
          <el-table-column label="本月实收业绩（元）" >
            <el-table-column
              prop="leaseAmount"
              label="租赁"
              
              width="70">
            </el-table-column>
            <el-table-column
              prop="lowCommissionAmount"
              label="买卖"
              
              width="70">
            </el-table-column>
            <el-table-column
              prop="secondAmount"
              label="低佣"
              
              width="70">
            </el-table-column>
            <el-table-column
              prop="agencyAmount"
              label="代办"
              
              width="70">
            </el-table-column>
            <el-table-column
              prop="agencyAmount"
              label="违约金（元）"
              
              width="70">
            </el-table-column>
            <el-table-column
              prop="agencyAmount"
              label="金融收入（元）"
              
              width="70">
            </el-table-column>
          </el-table-column>
          <el-table-column label="本月合同业绩（元）" >
            <el-table-column
              prop="leaseAmount"
              label="租赁"
              
              width="70">
            </el-table-column>
            <el-table-column
              prop="lowCommissionAmount"
              label="买卖"
              
              width="70">
            </el-table-column>
            <el-table-column
              prop="secondAmount"
              label="低佣"
              
              width="70">
            </el-table-column>
            <el-table-column
              prop="agencyAmount"
              label="代办"
              
              width="70">
            </el-table-column>
            <el-table-column
              prop="agencyAmount"
              label="违约金（元）"
              
              width="70">
            </el-table-column>
            <el-table-column
              prop="agencyAmount"
              label="金融收入（元）"
              
              width="70">
            </el-table-column>
          </el-table-column>

          <el-table-column label="本月实收金额（元）" ></el-table-column>

          <el-table-column label="本月合同金额（元）" ></el-table-column>
        </el-table>


        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          layout="total, prev, pager, next, jumper"
          :total="total"
          v-if="total!=0">
        </el-pagination>
      </div>
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
        propForm: {
          department: "", //部门
          dateMo: "",//时间
          depId: ''
        },
        total: 0,
        brandShow: false,
        brandArr: [],
        tableShow: true, //控制门店实收表格，门店明细表格两者显示与隐藏
        storeTitle: "全公司",
        steps: [],
        level: 1,
        partStep: "副总",
        dpart: 1,
        pageSize: 10,
        pageNum: 1,
        loading: true,
        activeItem: '',
      };
    },
    created() {
      var date = new Date();
      date = date.setDate(1);
      date = this.$tool.dateFormat(date)
      var date2 = this.$tool.dateFormat(Date.now())
      this.propForm.dateMo = [date, date2]
      this.getData()

      // this.storeTitle = this.testData0.title;
    },
    methods: {
      getData(type='init') {
        let param = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
        };
        if(type!=='init'){
          param = Object.assign(param,{
            startTime: this.propForm.dateMo ? this.propForm.dateMo[0] : '', //开始时间
            endTime: this.propForm.dateMo ? this.propForm.dateMo[1] : '', //结束时间
            depId: this.propForm.depId,
            depLevel: this.dpart
          })
        }
        this.$ajax.get('/api/achForm/getAchForm', param).then(res => {
          if (res.data.data.achievementForms != 0) {
            this.steps = res.data.data.levels
            for (let i = 0; i < this.steps.length; i++) {
              if (this.steps[i] > 0) {
                this.activeItem = i + 1
                // this.dpart=i+1
                break
              }
            }
            if (res.data.data.achievementForms.list[0]) {
              this.level = res.data.data.achievementForms.list[0].depLevel
              this.dpart = res.data.data.achievementForms.list[0].depLevel
              this.activeItem = res.data.data.achievementForms.list[0].depLevel
              this.tableData = res.data.data.achievementForms.list
            } else {
              this.tableData = []
            }
            this.total = res.data.data.achievementForms.total
            this.loading = false
          } else {
            this.tableData = []
            this.loading = false
          }

        }).catch(err => {
          this.$message({message: err})
        })
      },
      intodetial(type) {
        this.activeItem = type
        this.dpart = type
        this.propForm.depId = ''
        this.propForm.department = ''
        this.pageNum = 1
        let param = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          startTime: this.propForm.dateMo ? this.propForm.dateMo[0] : '', //开始时间
          endTime: this.propForm.dateMo ? this.propForm.dateMo[1] : '', //结束时间
          depLevel: type
        }
      },
      //前端导出
      getExcel() {
        let param = {
          startTime: this.propForm.dateMo ? this.propForm.dateMo[0] : '', //开始时间
          endTime: this.propForm.dateMo ? this.propForm.dateMo[1] : '', //结束时间
          depLevel: this.dpart,
          depId: this.propForm.depId
        }
        this.excelCreate("/input/performanceExcel", param);
      },
      resetFormFn() {
        this.propForm.department = ''
        this.propForm.departmentDetail = ''
        this.propForm.dateMo = ''
      },
      clearDep: function () {
        this.propForm.department = "";
        this.propForm.depId = '';
      },
      //部门控件元素选择操作
      depHandleClick(data) {
        this.propForm.depId = data.depId;
        this.propForm.department = data.name;
      },
      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageNum = val
        let param = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          startTime: this.propForm.dateMo ? this.propForm.dateMo[0] : '', //开始时间
          endTime: this.propForm.dateMo ? this.propForm.dateMo[1] : '', //结束时间
          depLevel: this.dpart
        }
        this.$ajax.get('/api/achForm/getAchForm', param).then(res => {
          if (res.data.data.achievementForms != 0) {
            this.steps = res.data.data.levels
            //  for(let i=0;i<this.steps.length;i++){
            //     if(this.steps[i]>0){
            //       this.activeItem=i+1
            //       this.dpart=i+1
            //       break
            //     }
            //   }
            if (res.data.data.achievementForms.list[0]) {
              this.level = res.data.data.achievementForms.list[0].depLevel
              this.dpart = res.data.data.achievementForms.list[0].depLevel
              this.activeItem = res.data.data.achievementForms.list[0].depLevel
              this.tableData = res.data.data.achievementForms.list
            } else {
              this.tableData = []
            }
            this.total = res.data.data.achievementForms.total
            this.loading = false
          } else {
            this.tableData = []
            this.loading = false
          }

        }).catch(err => {
          this.$message({message: err})
        })
      },
    }
  };
</script>

<style scoped lang="less">
  @import "~@/assets/less/lsx.less";

  .layout {
    // background-color: #F2F3F8!important;
    .check-btn span {
      color: #478de3;
    }
    .check-btn span:first-of-type {
      margin-right: 8px;
    }
    .blue {
      color: #478de3;
      cursor: pointer;
      // text-decoration: underline
    }
    .orange {
      color: #f56c6c;
    }
    .green {
      color: #54d384;
    }
    //  筛选条件
    .filter-layout {
      // width: 1680px;
      background-color: #fff;
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
          font-size: 18px;
          color: #233241;
          position: relative;
          padding-left: 28px;
          b {
            position: absolute;
            width: 16px;
            height: 16px;
            // background-color: red;
            left: 0px;
            top: 50%;
            margin-top: -8px;
          }
        }
      }
      .filter-right {
        // margin-right: 30px;
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
      // height: 1000px;
      margin-top: 20px;
      padding: 0 10px;
      background-color: #fff;
      /deep/ .el-table__header th {
        background-color: #eef2fb;
      }
      .data-head {
        // height: 100px;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 0px;
      }
    }

    .head-left {
      margin-top: 10px;
      margin-bottom: 10px;
      .el-button {
        display: inline-block;
        background: white;
        text-align: center;
        color: #909399;
        border: solid 1px #909399;
        &.active {
          color: #fff;
          background-color: #409EFF;
          border-color: #409EFF
        }
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

    /deep/ .el-pagination {
      text-align: right;
    }
    /deep/ .el-input__suffix {
      right: 12px;
    }
    /deep/ .el-table--border th {
      border-bottom: 2px solid #dadde4;
      border-right: 2px solid #dadde4;
    }
  }
</style>
