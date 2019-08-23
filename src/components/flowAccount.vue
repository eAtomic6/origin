<template>
	<div id="flowaccount">
		<!-- <el-button type="text" @click="dialogTableVisible = true">流水明细弹出层</el-button> -->
		<!-- 弹框明细 -->
		<el-dialog title="流水明细" :visible="getDialogTableVisible" @close='close'>
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<!-- 分类账 -->
				<el-tab-pane label="分类账" name="first">
					<el-table :data="gridData1" border :row-class-name="rowClass" height="450">
						<el-table-column prop="moneyTypeDetail" label="款类"></el-table-column>
						<el-table-column prop="receive" label="收款（元）"> </el-table-column>
						<el-table-column label="付款（元）">
              <template slot-scope="scope">
                {{scope.row.pay==="-0"?"0":scope.row.pay}}
              </template>
            </el-table-column>
						<el-table-column prop="amount" label="金额（元）"></el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- 业主分类账 -->
				<el-tab-pane label="业主分类账" name="second">
					<el-table :data="gridData2" border :row-class-name="rowClass" height="450">
						<el-table-column prop="moneyTypeDetail" label="款类"></el-table-column>
						<el-table-column prop="receive" label="收款（元）"> </el-table-column>
						<el-table-column label="付款（元）">
              <template slot-scope="scope">
                {{scope.row.pay==="-0"?"0":scope.row.pay}}
              </template>
            </el-table-column>
						<el-table-column prop="amount" label="金额（元）"></el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- 客户分类账 -->
				<el-tab-pane label="客户分类账" name="third">
					<el-table :data="gridData2" border :row-class-name="rowClass" height="450">
						<el-table-column prop="moneyTypeDetail" label="款类"></el-table-column>
						<el-table-column prop="receive" label="收款（元）"> </el-table-column>
						<el-table-column label="付款（元）">
              <template slot-scope="scope">
                {{scope.row.pay==="-0"?"0":scope.row.pay}}
              </template>
            </el-table-column>
						<el-table-column prop="amount" label="金额（元）"></el-table-column>
					</el-table>

				</el-tab-pane>
				<!-- 分类流水账 -->
				<el-tab-pane label="分类流水账" name="fourth">
					<el-table :data="gridData4" border :row-class-name="rowClass" height="450">
						<el-table-column prop="moneyTypeDetail" label="款类"></el-table-column>
						<el-table-column prop="payCode" label="收付款编号"> </el-table-column>
						<el-table-column prop="type" label="类型" width="50"></el-table-column>
						<el-table-column label="业务日期" width="90">
              <template slot-scope="scope">
                {{scope.row.createTime|formatTime}}
              </template>
            </el-table-column>
						<el-table-column prop="obj" label="业务对象" width="50"></el-table-column>
						<el-table-column prop="receive" label="收款（元）"> </el-table-column>
						<el-table-column label="付款（元）">
              <template slot-scope="scope">
                {{scope.row.pay==="-0"?"0":scope.row.pay}}
              </template>
            </el-table-column>
						<el-table-column prop="amount" label="金额（元）"></el-table-column>
						<el-table-column prop="checkStatus" label="审核状态" width="70"></el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- 流水账 -->
				<el-tab-pane label="流水账" name="fifth">
					<el-table :data="gridData5" border height="450">
						<el-table-column prop="createByName" label="录入人"></el-table-column>
						<el-table-column prop="deptName" label="录入门店"> </el-table-column>
						<el-table-column label="录入日期" width="90">
              <template slot-scope="scope">
                {{scope.row.createTime|formatTime}}
              </template>
            </el-table-column>
						<el-table-column prop="type" label="类型"></el-table-column>
						<el-table-column prop="objType" label="业务对象"></el-table-column>
						<el-table-column prop="moneyType" label="款类"></el-table-column>
						<el-table-column prop="amount" label="金额（元）"> </el-table-column>
						<el-table-column prop="billStatus" label="票据状态"></el-table-column>
						<el-table-column prop="checkStatus" label="审核状态"></el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- 票据 -->
				<el-tab-pane label="票据" name="sixth">
					<el-table :data="gridData6" border height="450">
						<el-table-column prop="moneyType" label="款类"></el-table-column>
						<el-table-column label="开票时间" width="90">
              <template slot-scope="scope">
                {{scope.row.createTime|formatTime}}
              </template>
            </el-table-column>
						<el-table-column prop="amount" label="开票金额（元）"></el-table-column>
						<el-table-column prop="code" label="票据号"></el-table-column>
						<el-table-column prop="status" label="票据状态"></el-table-column>
						<el-table-column prop="drawerName" label="开票人">
              <template slot-scope="scope">
                <span v-if="scope.row.drawerName==='--'&&scope.row.drawerDepName==='--'">
                  <p>--</p>
                </span>
                <span v-else>
                  <p>{{scope.row.drawerDepName}}</p>
                  <p>{{scope.row.drawerName}}</p>
                </span>
              </template>
            </el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- 应实对照 -->
				<!-- <el-tab-pane label="应实对照" name="seventh">
					<el-table :data="gridData7" border>
						<el-table-column prop="moneyClass" label="款类"></el-table-column>
						<el-table-column prop="realReceive" label="实收"> </el-table-column>
						<el-table-column prop="realPay" label="实付"></el-table-column>
						<el-table-column prop="shouldReceive" label="应收"></el-table-column>
						<el-table-column prop="shouldPay" label="应付"></el-table-column>
						<el-table-column prop="surPlus" label="结余"></el-table-column>
						<el-table-column prop="receiveNote" label="备注"></el-table-column>
					</el-table>
				</el-tab-pane> -->
				<!-- 佣金明细 -->
				<!-- <el-tab-pane label="佣金明细" name="eighth">
                <el-table :data="gridData8" border>
                    <el-table-column prop="moneyClass" label="款类"></el-table-column>
                    <el-table-column prop="divideAmount" label="分佣金额（元）"> </el-table-column>
                    <el-table-column prop="divideTime" label="分佣时间"></el-table-column>
                    <el-table-column prop="divideName" label="被拆名称"></el-table-column>
                    <el-table-column prop="originalAmount" label="原始金额"></el-table-column>          
                </el-table>
            </el-tab-pane> -->
			</el-tabs>

		</el-dialog>
	</div>
</template>

<script>
export default {
  props: {
    dialogTableVisible: {
      type: Boolean,
      default: false
    },
    contCode: {
      type: String,
      default: ''
    },
    contId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      activeName: "first",
      //dialogTableVisible: false,
      gridData1: [],
      gridData2: [],
      gridData4: [],
      gridData5: [],
      gridData6: []
    };
  },
  created() {
    this.getFlowwater();
  },
  methods: {
    close() {
      this.$emit("closeRunningWater");
    },
    handleClick(tab) {
      //console.log(tab.name);
      //分类账
      if (tab.name === "first") {
        // let param = {
        //   contractCode: "Z181111001"
        // };
        // this.$ajax.get("/api/flows/account", param).then(res => {

        // });
        this.getFlowwater();
      } else if (tab.name === "second" || tab.name === "third") {
        //业主分类账
        let param = {
          contractCode: this.contCode,
          type: tab.name === "second" ? 2 : 1
        };
        this.$ajax.get("/api/flows/account", param).then(res => {
          res = res.data;
          if (res.status === 200) {
            //console.log(res.data);
            let list = [];
            for (let i = 0; i < res.data.length; i++) {
              list.push({
                moneyTypeDetail: res.data[i].moneyType,
                receive: res.data[i].totalRecieve,
                pay: res.data[i].totalPay,
                amount: res.data[i].totalAmount,
                istotal: true
              });
              for (let j = 0; j < res.data[i].details.length; j++) {
                list.push(res.data[i].details[j]);
              }
            }
            this.gridData2 = list;
          }
        });
      } else if (tab.name === "fourth") {
        let param = {
          contractCode: this.contCode
        };
        this.$ajax.get("/api/flows/waterAccount", param).then(res => {
          res = res.data;
          if (res.status === 200) {
            console.log(res.data);
            let list = [];
            for (let i = 0; i < res.data.length; i++) {
              list.push({
                moneyTypeDetail: res.data[i].moneyType,
                receive: res.data[i].totalRecieve,
                pay: res.data[i].totalPay,
                amount: res.data[i].totalAmount,
                istotal: true
              });
              for (let j = 0; j < res.data[i].details.length; j++) {
                list.push(res.data[i].details[j]);
              }
            }
            this.gridData4 = list;
          }
        });
      }else if (tab.name === "fifth") {
        let param = {
          contractCode: this.contCode
				};
				this.$ajax.get("/api/flows/water", param).then(res => {
					 res = res.data;
          if (res.status === 200) {
						console.log(res.data)
						this.gridData5=res.data
					}
				})
			}else if(tab.name==='sixth'){
				let param = {
          contractId: this.contId
				};
				this.$ajax.get("/api/flows/bill", param).then(res => {
					 res = res.data;
          if (res.status === 200) {
						console.log(res.data)
						this.gridData6=res.data
					}
				})
			}
    },
    //流水明细
    getFlowwater() {
      let param = {
        contractCode: this.contCode
      };
      this.$ajax.get("/api/flows/account", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          //console.log(res.data);
          let list = [];
          for (let i = 0; i < res.data.length; i++) {
            list.push({
              moneyTypeDetail: res.data[i].moneyType,
              receive: res.data[i].totalRecieve,
              pay: res.data[i].totalPay,
              amount: res.data[i].totalAmount,
              istotal: true
            });
            for (let j = 0; j < res.data[i].details.length; j++) {
              list.push(res.data[i].details[j]);
            }      
          }
          this.gridData1 = list;
        }
      });
    },
    rowClass({ row, rowIndex }) {
      if (row.istotal) {
        return "title_";
      }
    }
  },
  computed: {
    getDialogTableVisible: function() {
      return this.dialogTableVisible;
    }
  }
};
</script>

<style lang="less" scoped>
#flowaccount {
  /deep/.el-dialog__wrapper{
    overflow: hidden;
  }
  /deep/.el-dialog {
    width: 800px;
    height: 580px;
    overflow-y: auto;
  }
  /deep/.el-dialog__body {
    padding: 10px 20px 10px;
    color: #233241;
    .title_ {
      font-weight: bold;
      color: #233241;
      background: #EDECF0;
    }
  }
  /deep/.el-tabs__nav-wrap::after {
    background-color: transparent;
  }
  /deep/.el-dialog__header {
    border-bottom: 1px solid #edecf0;
    padding: 16px 20px 15px;
    span {
      color: #233241;
      font-size: 20px;
    }
    /deep/.el-dialog__headerbtn {
      top: 16px;
      .el-dialog__close {
        font-size: 24px;
        color: #32485f;
      }
    }
  }
  /deep/.el-table .cell {
    text-align: center;
  }
  /deep/.el-table th {
    background-color: #eef2fb;
  }
  /deep/.el-table th div {
    color: #6c7986;
  }
  
}
</style>