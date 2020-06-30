<template>
  <div class="view">
    <div class="bill-details-tab">
      <ul>
        <li v-for="(item,index) in tabs" :key="index" class="f14" :class="[activeItem===item?'active':'']"
            @click="choseTab(item)">{{item}}
        </li>
      </ul>
      <p>
        <el-button class="btn-info" round size="small" type="primary" v-if="dataMsg.state&&dataMsg.state.value===3&&getUser.user&&(getUser.user.empId===dataMsg.auditId)" @click="showDialog">审核
        </el-button>
      </p>
    </div>
    <ul class="bill-details-content">
      <template v-if="activeItem==='收款信息'">
        <li>
          <h4 class="f14">{{activeItem}}</h4>
          <el-table border :data="[{}]" header-row-class-name="theader-bg">
            <el-table-column align="center" label="合同编号">
              <template slot-scope="scope">
                <span>{{dataMsg.contractCode}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="纸质合同编号">
              <template slot-scope="scope">
                <span>{{dataMsg.contractPaperCode|formatNull}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="付款ID">
              <template slot-scope="scope">
                <span>{{dataMsg.payCode}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="收付对象">
              <template slot-scope="scope">
                <span>{{dataMsg.objType|getLabel}}-{{dataMsg.objName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间">
              <template slot-scope="scope">
                <span>{{dataMsg.createTime|formatTime(false)}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="收款人">
              <template slot-scope="scope">
                <span>{{dataMsg.deptName}}-{{dataMsg.employeeName}}</span>
              </template>
            </el-table-column>
          </el-table>
        </li>
        <li>
          <h4 class="f14">佣金信息</h4>
          <el-table border :data="[{}]" header-row-class-name="theader-bg">
            <el-table-column align="center" label="款类">
              <template slot-scope="scope">
                <span>{{dataMsg.moneyName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="佣金（元）">
              <template slot-scope="scope">
                <span>{{dataMsg.amount}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <span>{{dataMsg.state|getLabel}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="结款时间">
              <template slot-scope="scope">
                {{dataMsg.closingDate|formatTime(false)}}
              </template>
            </el-table-column>
          </el-table>
        </li>
        <li>
          <h4 class="f14">其他信息</h4>
          <div class="input-group">
            <label>备注信息:</label>
            <p>{{dataMsg.remark|nullFormatter}}</p>
          </div>
        </li>
      </template>
      <li v-else>
        <h4 class="f14">审核信息</h4>
        <el-table border :data="checkList" header-row-class-name="theader-bg" key="checkMsgTable">
          <el-table-column align="center" label="时间">
            <template slot-scope="scope">
              <span>{{scope.row.auditTime|formatTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="userName" label="姓名"></el-table-column>
          <el-table-column align="center" prop="roleName" label="职务"></el-table-column>
          <el-table-column align="center" prop="operate" label="操作"></el-table-column>
          <el-table-column align="center" label="备注">
            <template slot-scope="scope">
              <el-popover
                v-if="scope.row.auditInfo!=='-'"
                placement="top-start"
                width="200"
                trigger="hover"
                :content="scope.row.auditInfo">
                <p class="one-row" slot="reference">{{scope.row.auditInfo|nullFilter}}</p>
              </el-popover>
              <span v-else>{{scope.row.auditInfo}}</span>
            </template>
          </el-table-column>
        </el-table>
      </li>
    </ul>
    <el-dialog
      title="审核"
      :closeOnClickModal="$tool.closeOnClickModal"
      :visible.sync="layer.show"
      width="740px"
      @close="clearLayer">
      <div class="reasion-dialog">
        <label>备注：</label>
        <div class="input">
          <el-input type="textarea" resize="none" placeholder="请输入同意/拒绝理由" :maxlength="invalidMax"
                    v-model="layer.reasion"
                    class="input-textarea" :class="[layer.reasion.length>0?'':'scroll-hidden']">
          </el-input>
          <div class="text-absloute">{{invalidNumber}}/{{invalidMax}}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button round @click="checkBill(2)" v-loading.fullscreen.lock="fullscreenLoading">拒 绝</el-button>
    <el-button round type="primary" @click="checkBill(1)" v-loading.fullscreen.lock="fullscreenLoading">同 意</el-button>
  </span>
    </el-dialog>
    <checkPerson :show="checkPerson.state" :type="checkPerson.type" :bizCode="checkPerson.code"
                 :flowType="checkPerson.flowType" @submit="personChose" @close="checkPerson.state=false"
                 v-if="checkPerson.state"></checkPerson>
  </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";
  import {MIXINS} from "@/assets/js/mixins";
  import checkPerson from '@/components/checkPerson'

  export default {
    name: "bill-details",
    mixins: [FILTER, MIXINS],
    components: {
      checkPerson
    },
    data() {
      return {
        checkPerson: {
          state: false,
          type: 3,//定值
          code: '',
          flowType: 1,//定值
        },
        tabs: ['收款信息', '审核信息'],
        activeItem: '收款信息',//顶部tab切换的选中项
        payId:'',//收款id
        dataMsg: {},//详情返回对象
        list: [],
        checkList: [],//审核信息
        layer: {//审核备注
          show: false,
          reasion: ''
        },
        invalidMax: 200,
        fullscreenLoading: false,//防抖
        //分页
        currentPage: 1,
        pageSize: 10,
        total: 0,
        //是否有审核权限
        btnCheck: false,
      }
    },
    created() {
      let urlParam=this.$route.query
      this.payId=Number(urlParam.id)
      this.getData()
      let contractName={
        1:{name:'新房',type:'xf'},
        2:{name:'长租',type:'cz'},
        3:{name:'金融',type:'jr'}
      }
      let arr=this.$tool.getRouter([contractName[Number(urlParam.type)].name,'财务','收款审核'],`/receiptCheck?type=${contractName[Number(urlParam.type)].type}`);
      arr.push({name:'收款详情',path:this.$route.fullPath});
      this.setPath(arr);
    },
    methods: {
      personChose: function () {
        this.checkPerson.state = false
        this.$message({
          message: '下一个节点审核人设置成功'
        })
        this.getCheckData()
      },
      // 判断审核弹窗显示内容
      showDialog: function () {
        this.layer.show = true
      },
      /**
       * 获取详情
       */
      getData: function () {
        let param={payId:this.payId}
        this.$ajax.get('/api/payInfoRecord/getSKDetail',param).then(res=>{
          res=res.data
          if(res.status===200){
            this.dataMsg=res.data
            this.getCheckData()
            Object.assign(this.checkPerson,{code:this.dataMsg.payCode})
          }
        })
      },
      /**
       * 获取审核信息
       */
      getCheckData: function () {
        let param = {
          flowType: 1,
          bizCode: this.dataMsg.payCode
        }
        this.$ajax.get('/api/machine/getAuditListToFinance', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.checkList = res.data.data
            this.total = res.data.total
          }
        })
      },
      /**
       * 审核
       */
      checkBill: function (type) {
        let param = {
          bizCode: this.dataMsg.payCode,
          flowType: 1,
          modularType: Number(this.$route.query.type)
        }
        param.ApprovalForm = {
          result: type,
          remark: this.layer.reasion
        }
        if (type === 2 && this.layer.reasion.length === 0) {
          this.$message({
            message: '请输入拒绝原因'
          })
          return;
        } else {
          this.fullscreenLoading = true
        }
        this.$ajax.postJSON('/api/machine/audit', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.fullscreenLoading = false
            this.getData()

            this.$message({
              message: res.message
            })
            this.layer.show = false
          }
        }).catch(error => {
          this.fullscreenLoading = false
          if (error.message === '下一节点审批人不存在') {
            this.checkPerson.state = true
          } else {
            this.$message({
              message: error
            })
          }
        })
      },
      clearLayer: function () {
        this.layer.reasion = ''
        this.layer.show = false
      },
      choseTab: function (item) {
        this.activeItem = item
      },
    },
    computed: {
      invalidNumber() {
        return this.layer.reasion.length
      }
    },
    filters: {
      nullFormatter: function (val, type = 1) {
        if (!val) {
          return type === 1 ? '无' : '--'
        } else {
          return val
        }
      },
      nullFilter: function (val) {
        if (!val) {
          return val === 0 ? 0 : '-'
        } else {
          return val
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  @import "~@/assets/less/lsx.less";

  .input-group {
    align-items: flex-start;
    max-width: 812px;
    &:first-of-type {
      margin-bottom: @margin-base;
    }
    > label {
      color: @color-6c;
      max-width: 60px;
      min-width: 60px;
    }
    > p {
      line-height: 1.6;
      word-break: break-all;
    }
    ul.image-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      > li {
        width: 120px;
        height: 120px;
        background-color: @bg-grey;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: @margin-base;
        .span {
          width: 100px;
          text-align: center;
          /*word-break: break-all;*/
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  .reasion-dialog {
    display: flex;
    margin-top: @margin-10;
    > label {
      min-width: 46px;
    }
    /deep/ .input {
      flex: 1;
      position: relative;
      &-textarea {
        .el-textarea__inner {
          border: 0;
          height: 235px;
          background-color: @bg-FA;
        }
      }
      .text-absloute {
        position: absolute;
        bottom: 11px;
        right: 20px;
      }
    }
  }

  .radio-dialog {
    margin-left: 46px;
    color: @color-6c;
    > li {
      padding: @margin-base;
      &:first-of-type {
        display: flex;
        > p {
          margin-right: @margin-10;
          span {
            color: @color-red;
          }
        }
      }
      &:nth-of-type(2) {
        > span {
          color: @color-233;
        }
      }
      &:nth-of-type(3) {
        .el-radio {
          color: @color-233;
        }
      }
    }
    .color-light {
      color: @color-red;
    }
  }

  .view {
    /*padding: 0 20px;*/
    background-color: @bg-white;
  }

  .bill-details-tab {
    position: relative;
    border-bottom: 1px solid @border-CE;
    padding: 0 @margin-10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > ul {
      display: flex;
      > li {
        flex: 1;
        align-self: center;
        /*height: 50px;*/
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 60px;
        padding: @margin-10 @margin-15;
        &.active {
          color: @color-blue;
          position: relative;
          &:after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            border-bottom: 4px solid @color-blue;
          }
        }
      }
    }
    /*> p {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
    }*/
  }

  .bill-details-content {
    padding: 0 @margin-10;
    > li {
      h4 {
        margin: @margin-base 0;
        font-weight: bold;
      }
      .total-text {
        margin-bottom: 10px;
        > span {
          color: @color-orange;
        }
      }
      .warning-text {
        margin-top: @margin-10;
        > p {
          font-size: 14px;
          color: red;
        }
      }
    }
  }
</style>
