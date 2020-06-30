<template>
    <div class="view-container" ref="tableComView">
        <div class="head-area">
            <el-form :inline="true" size="small">
                <el-form-item label="月份">
                    <el-date-picker
                    v-model="sumDate"
                    type="monthrange"
                    range-separator="至"
                    start-placeholder="开始月份"
                    value-format="yyyy-MM"
                    end-placeholder="结束月份">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="部门">
                    <select-tree :data="DepList" :init="depName" @checkCell="depHandleClick" @clear="clearDep"
                            @search="searchDep"></select-tree>
                </el-form-item>
            </el-form>
            <p style="white-space: nowrap;">
                <el-button
                    style="background-color: #38BD8B; color: white;"
                    size="small"
                    @click="queryFn">查 询
                </el-button>
                <el-button
                    size="small"
                    @click="resetFormFn">重 置
                </el-button>
            </p>
        </div>
        <div class="view-context">
            <div class="table-tool">
                <ul>
                    <li>
                        收入<span class="color-green">{{tableHead.income}}</span>元
                    </li>
                    <li>
                        支出<span class="color-red">{{tableHead.expenditure}}</span>元
                    </li>
                    <li>
                        利润<span :class="tableHead.profit>0?'color-green':tableHead.profit<0?'color-red':''">{{addSum(tableHead.profit)}}</span>元
                    </li>
                </ul>
                <p>
                    <el-button class="btn-info" style="background-color: #38BD8B; color: white;" size="small" @click="getExcel" v-if="power['sign-book-hz-export'].state">导出</el-button>
                </p>
            </div>
            <el-table :data="list" ref="tableCom" :max-height="tableNumberCom" border header-row-class-name="theader-bg" style="width: 100%">
                <el-table-column label="月份" prop="moneyTime"></el-table-column>
                <el-table-column label="部门" prop="deptName"></el-table-column>
                <el-table-column label="收入（元）" prop="income">
                    <template slot-scope="scope">
                        <span :class="{'color-green':scope.row.income>0}">{{scope.row.income}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="支出（元）" prop="expenditure">
                    <template slot-scope="scope">
                        <span :class="{'color-red':scope.row.expenditure>0}">{{scope.row.expenditure}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="利润（元）" prop="profit">
                    <template slot-scope="scope">
                        <span :class="scope.row.profit>0?'color-green':scope.row.profit<0?'color-red':''">{{addSum(scope.row.profit)}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            v-if="total"
            class="pagination-info"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import {MIXINS} from "@/assets/js/mixins";

export default {
    name: "account-sum",
    mixins: [MIXINS],
    data() {
        return {
            sumDate: [],
            deptId: '',
            depName: '',
            list: [],
            total: 0,
            pageNum: 1,
            pageSize: 20,
            tableHead: {
                expenditure: 0,
                income: 0,
                profit: 0
            },
            power: {
                'sign-book-hz-export':{
                    name: '导出',
                    state: false
                }
            }
        }
    },
    created() {

    },
    methods: {
        addSum(val) {
            return val>0 ? `+${val}` : val
        },
        getData(type='search') {
            if(type==='search'){
                this.pageNum = 1
            }
            let param = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                deptId: this.deptId,
                moneyTimeStart: this.sumDate[0],
                moneyTimeEnd: this.sumDate[1],
            }
            this.$ajax.get('/api/accountBook/accountTotal', param).then(res => {
                res = res.data
                if(res.status === 200) {
                    this.list = res.data.list.list
                    this.total = res.data.list.total
                    this.tableHead = {...res.data}
                }
            })
        },
        getExcel() {
            if(this.sumDate&&this.sumDate.length) {
                this.getData('search')
                let param = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    deptId: this.deptId
                }
                if(this.sumDate && this.sumDate.length) {
                    param.moneyTimeStart = this.sumDate[0]
                    param.moneyTimeEnd = this.sumDate[1]
                }
                this.excelCreate('/input/accountBookExcel',param)
            } else {
                this.$message('请选择月份')
            }
        },
        clearDep: function () {
            this.depName = ''
            this.clearSelect()
        },
        searchDep: function (payload) {
            // this.clearSelect('emp')
        },
        depHandleClick(data) {
            this.deptId = data.depId
            this.depName = data.name
        },
        queryFn() {
            if(this.sumDate&&this.sumDate.length) {
                this.pageNum = 1
                this.getData()
            } else {
                this.$message('请选择月份')
            }
        },
        resetFormFn() {
            this.sumDate = []
            this.deptId = ''
            this.depName = ''
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getData('page')
        },
        //重写表格maxHeight设置方法
        comHeightFn() {
            if (this.$refs.tableCom && this.$refs.tableComView) {
                let wh = document.documentElement.clientHeight;
                let h1 = this.$refs.tableComView.clientHeight+160
                let h2 = this.$refs.tableCom.$el.clientHeight;
                let th = wh - h1;
                this.tableNumberCom = h2 + th;
            }
        },
    }
}
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  .head-area {
      display: flex;
      justify-content: space-between;
      padding: 15px 15px 0;
      border: 1px solid #e3e3e3;
      margin: 20px 0;
  }
  .view-context {
    border: 1px solid #e3e3e3;
    background-color: @color-white;
    /deep/ .theader-bg {
      > th {
        background-color: #F5F5F9;
      }
    }
    .table-tool {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px;
        > ul {
            display: flex;
            margin-left: 20px;
            > li {
            color: @color-6c;
            margin-right: 20px;
            font-size: 14px;
            }
        }
    }
    .color-green {
        color: @color-green;
    }
    .color-red {
        color: @color-red;
    }
    .pagination-info {
        text-align: right;
    }
  }
</style>
