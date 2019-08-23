<template>
  <div class="view">
    <!--<iframe id='test' :src="test" frameborder="0"></iframe>
    <span @click="toPrint">test</span>-->
    <div class="bill-details-tab">
      <ul>
        <li v-for="(item,index) in tabs" :key="index" class="f14" :class="[activeItem===item?'active':'']"
            @click="choseTab(item)">{{item}}
        </li>
      </ul>
      <p v-if="(activeItem==='收款信息'&&receiptBill===4)||activeItem==='付款信息'">
        <el-button class="btn-info" round size="small" type="primary" @click="showDialog" v-if="billMsg.auditButton&&btnCheck">审核</el-button>
      </p>
    </div>
    <ul class="bill-details-content">
      <template v-if="!checkBoxShow">
        <li>
          <h4 class="f14">{{activeItem}}</h4>
          <el-table border :data="list" header-row-class-name="theader-bg">
            <el-table-column align="center" label="合同编号">
              <template slot-scope="scope">
                <span>{{billMsg.contCode}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="activeItem==='付款信息'?'付款ID':'收款ID'">
              <template slot-scope="scope">
                <span>{{billMsg.payCode}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="物业地址 ">
              <template slot-scope="scope">
                <span>{{billMsg.address}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="收款方" v-if="activeItem==='付款信息'">
              <template slot-scope="scope">
                <span>{{billMsg.inObjType|getLabel}}{{billMsg.inObjName?`-${billMsg.inObjName}`:''}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="付款方" v-else>
              <template slot-scope="scope">
                <span>{{billMsg.outObjType|getLabel}}{{billMsg.outObj?`-${billMsg.outObj}`:''}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="付款时间" v-if="activeItem==='付款信息'">
              <template slot-scope="scope">
                <span>{{billMsg.createTime|formatTime}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" v-else>
              <template slot-scope="scope">
                <span>{{billMsg.createTime|formatTime}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="发起人" v-if="activeItem==='付款信息'">
              <template slot-scope="scope">
                <span>{{billMsg.store}}-{{billMsg.createByName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="收款人" v-else>
              <template slot-scope="scope">
                <span>{{billMsg.inObjStore}}-{{billMsg.inObjName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="款类" v-if="activeItem==='付款信息'">
              <template slot-scope="scope">
                <span>{{billMsg.moneyTypeName}}</span>
              </template>
            </el-table-column>
          </el-table>
        </li>
        <li v-if="activeItem==='收款信息'">
          <h4 class="f14">合计金额</h4>
          <p class="total-text">合计：<span>{{billMsg.amount}}</span>元</p>
          <el-table border :data="!billMsg.inAccount?[{}]:billMsg.inAccount" header-row-class-name="theader-bg" :span-method="collapseRow" v-if="billMsg.inAccount||!billMsg.inAccount">
            <el-table-column align="center" label="款类">
              <template slot-scope="scope">
                <span>{{billMsg.moneyTypeName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="票据">
              <template slot-scope="scope">
                <span class="span-cursor" @click="getPaper('details')" v-if="billMsg.billCode">{{billMsg.billCode}}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="支付方式">
              <template slot-scope="scope">
                <span v-if="billMsg.inAccount&&billMsg.inAccount.length>0">{{scope.row.payMethod?scope.row.payMethod.label:'--'}}</span>
                <span v-else>{{billMsg.method}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="金额（元）">
              <template slot-scope="scope">
                <span v-if="billMsg.inAccount&&billMsg.inAccount.length>0">{{scope.row.amount}}</span>
                <span v-else>{{billMsg.amount}}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="200" align="center" label="收款账户">
              <template slot-scope="scope">
                <p v-if="scope.row.cardNumber&&scope.row.cardNumber.length>0">{{scope.row.userName}} {{scope.row.bankName}} {{scope.row.cardNumber}}</p>
                <span v-else>-</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <!--{{billMsg.checkStatus|getLabel}}-->
                <span>{{billMsg.statusName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="到账时间">
              <template slot-scope="scope">
                {{billMsg.toAccountTime|formatTime}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="getPaper('create')" v-if="btnBill&&billMsg.billStatus&&billMsg.isDel===1&&(billMsg.billStatus.value===1||billMsg.billStatus.value===4)&&billMsg.payStatusValue!==4&&billMsg.payStatusValue!==11">开票</el-button>
                <el-button type="text" @click="getPaper('client')" v-else-if="btnBill&&billMsg.billStatus&&billMsg.billStatus.value===2">打印客户联</el-button>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </li>
        <li v-if="activeItem==='收款信息'">
          <h4 class="f14">刷卡信息</h4>
          <el-table border :data="billMsg.account" header-row-class-name="theader-bg">
            <el-table-column align="center" prop="bankName" label="刷卡/转账银行">
              <template slot-scope="scope">
                <span v-if="scope.row.bankName.length>0">{{scope.row.bankName}}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="userName" label="户名">
              <template slot-scope="scope">
                <span v-if="scope.row.userName.length>0">{{scope.row.userName}}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="cardNumber" label="账户">
              <template slot-scope="scope">
                <span v-if="scope.row.cardNumber.length>0">{{scope.row.cardNumber}}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="orderNo" label="订单编号">
              <template slot-scope="scope">
                <span v-if="scope.row.orderNo.length>0">{{scope.row.orderNo}}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="amount" label="金额（元）"></el-table-column>
            <!--<el-table-column align="center" prop="fee" label="手续费（元）"></el-table-column>-->
            <el-table-column align="center" label="手续费（元）">
              <template slot-scope="scope">{{billMsg.systemFee?billMsg.systemFee:'--'}}</template>
            </el-table-column>
          </el-table>
        </li>
        <li v-if="activeItem==='付款信息'">
          <h4 class="f14">账户信息</h4>
          <el-table border :data="billMsg.account" header-row-class-name="theader-bg">
            <el-table-column align="center" label="账户类型">
              <template slot-scope="scope">
                <span>{{billMsg.accountProperties===1?"企业账户":"个人账户"}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="userName" label="开户名"></el-table-column>
            <el-table-column align="center" prop="cardNumber" label="银行卡号"></el-table-column>
            <el-table-column align="center" prop="bankName" label="银行">
              <template slot-scope="scope">
                <span v-if="scope.row.bankName.length>0">{{scope.row.bankName}}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="bankBranch" label="支行">
              <template slot-scope="scope">
                <span v-if="billMsg.accountProperties===1">{{scope.row.bankBranch}}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="amount" label="金额（元）"></el-table-column>
          </el-table>
        </li>
        <li v-if="activeItem==='收款信息'">
          <div class="warning-text">
            <p>温馨提示：</p>
            <p>1.操作说明：pos开机状态下，请按快捷键F1，其次按数字键1，最后按功能键后，用红外线对准下图二维码进行收款。</p>
            <p>2.请勿手动在pos上输入金额！</p>
            <p>3.pos机上提示收款成功后，有1-2分钟的延迟才能开票，请耐心等待。</p>
          </div>
        </li>
        <li>
          <h4 class="f14">其他信息</h4>
          <div class="input-group">
            <label>备注信息:</label>
            <p>{{billMsg.remark|nullFormatter}}</p>
          </div>
          <div class="input-group">
            <label>付款凭证:</label>
            <ul class="image-list" v-if="files.length>0">
              <li class="margin-right" v-for="(item,index) in files" :key="index" @click="previewPhoto(files,index)">
                <upload-cell :type="item.type"></upload-cell>
                <el-tooltip :content="item.name" placement="top">
                  <p class="span">{{item.name}}</p>
                </el-tooltip>
              </li>
            </ul>
            <span v-else>无</span>
          </div>
        </li>
      </template>
      <li v-if="checkBoxShow" ref="checkBox">
        <h4 class="f14">审核信息</h4>
        <el-table border :data="checkList" header-row-class-name="theader-bg">
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
        <!--<el-pagination
          v-if="checkList.length>1"
          class="pagination-info"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>-->
      </li>
      <li v-if="activeItem==='收款信息'">
        <h4 class="f14">收款二维码</h4>
        <img :src="billMsg.RQcode" alt="">
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
      <ul class="radio-dialog" v-if="radioMask">
        <li>
          <p>大类可支配金额：<span>{{amount.CategoriesBalance}}元</span></p>
          <p>合同余额：<span>{{amount.ContractBalance}}元</span></p>
          <p>代收代付余额：<span>{{amount.agentBalance}}元</span></p>
        </li>
        <li><span>支付方式</span>（若通过审核，则支付方式必填）</li>
        <li>
          <el-radio v-model="payRadio" label="1">线上支付（联动优势）</el-radio>
          <el-radio v-model="payRadio" label="2">线下支付（线下财务打款）</el-radio>
        </li>
        <li class="color-light">
          * 当支付方式为“线上支付”时，系统会对接第三方系统进行自动支付
        </li>
        <li class="color-light">
          * 当支付方式为“线下付款”时，需财务进行线下打款
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
    <el-button round @click="checkBill(2)" v-loading.fullscreen.lock="fullscreenLoading">拒 绝</el-button>
    <el-button round type="primary" @click="checkBill(1)" v-loading.fullscreen.lock="fullscreenLoading">同 意</el-button>
  </span>
    </el-dialog>
    <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
    <layer-invoice ref="layerInvoice" :printType="printType" :contId="$route.query.contId" @emitPaperSet="emitPaperSetFn"></layer-invoice>
    <checkPerson :show="checkPerson.state" :type="checkPerson.type" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @submit="personChose" @close="checkPerson.state=false" v-if="checkPerson.state"></checkPerson>
  </div>
</template>

<script>
  import LayerInvoice from '@/components/LayerInvoice'
  import {FILTER} from "@/assets/js/filter";
  import {MIXINS} from "@/assets/js/mixins";
  import checkPerson from '@/components/checkPerson'

  let timer = null
  let target = 0
  let scrollHeight = 0

  export default {
    name: "bill-details",
    mixins: [FILTER,MIXINS],
    components:{
      LayerInvoice,
      checkPerson
    },
    data() {
      return {
        checkPerson: {
          state:false,
          type:3,
          code:'',
          flowType:0
        },
        tabs: ['审核信息'],
        activeItem: '',
        billId: 0,
        billMsg: {},
        list: [
          {}
        ],
        receiptBill:4,
        checkList: [],//审核信息
        layer: {
          show: false,
          reasion: ''
        },
        invalidMax: 200,
        files: [],
        radioMask: false,
        amount:{},
        payRadio:0,
        checkBoxShow:false,//是否只展示审核信息
        fullscreenLoading:false,//防抖
        //分页
        currentPage:1,
        pageSize:10,
        total:0,
        btnCheck:false,//是否有审核权限
        btnPrint:false,//是否有打印权限
        btnBill:false,//是否有开票权限
        printType:'client',//票据是否只显示客户联
      }
    },
    created() {
      // debugger
      this.activeItem = this.$route.query.tab
      this.checkPerson.flowType=this.activeItem==='收款信息'?1:0
      this.billId = this.$route.query.id
      this.btnCheck = this.$route.query.power.toString()==='true'?true:false
      // this.btnPrint = this.$route.query.print.toString()==='true'?true:false
      this.btnBill = this.$route.query.bill.toString()==='true'?true:false
      this.tabs.unshift(this.activeItem)
      this.getData()
      if(this.$route.query.type){
        this.receiptBill=parseInt(this.$route.query.type)
      }
    },
    methods: {
      previewImg:function () {
        let arr=[]
        this.files.forEach(item=>{
          arr.push(item.path)
        })
        this.fileSign(arr)
      },
      //监听点击票据打印
      emitPaperSetFn:function () {
        this.getData()
        // this.$refs.layerInvoice.propCloseFn()
      },
      //开票
      getPaper:function (type) {
        this.printType='client'
        if(type==='details'){
          this.printType='all'
          this.$refs.layerInvoice.show(this.billMsg.billId)
        }else if(type==='client'){
          this.$refs.layerInvoice.show(this.billMsg.billId)
        }else {
          this.$refs.layerInvoice.show(this.billId,true)
        }
      },
      personChose:function () {
        this.checkPerson.state=false
        this.$message({
          message:'下一个节点审核人设置成功'
        })
        this.getCheckData()
      },
      // 判断审核弹窗显示内容
      showDialog: function () {
        this.layer.show = true
        if(this.activeItem==='付款信息'){
          let param={
            payId: this.billMsg.id,
            moneyType:this.billMsg.moneyType,
            moneyTypePid:this.billMsg.moneyTypePid,
            contId:this.billMsg.contId
          }
          this.$ajax.get('/api/payInfo/auditOption', param).then(res => {
            res = res.data
            if (res.status === 200) {
              // this.radioMask = res.data.num === 2 ? true : false
              this.amount=Object.assign({},res.data)
            }
          })
        }
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val
        this.getData()
      },
      getData: function () {
        let param = {
          payId: this.billId,
          type: this.activeItem === '收款信息' ? 1 : 2
        }
        let src=param.type===1?'/payInfo/selectRevDetail':'/payInfo/selectPayDetail'
        this.$ajax.get(`/api${src}`, param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.billMsg = Object.assign({}, res.data)
            if (res.data.filePath) {
              this.files = this.$tool.cutFilePath(JSON.parse(res.data.filePath))
            }
            if(res.data.inAccountType&&(res.data.inAccountType===3)&&param.type===1&&res.data.billPath&&res.data.billPath.length>0){
              this.files = [].concat({
                path:res.data.billPath,
                name:'pos小票'
              })
            }
            this.checkPerson.code=res.data.payCode
            this.getCheckData()
          }
        })
      },
      /**
       * 获取审核信息
       */
      getCheckData:function () {
        let param={
          /*pageSize:this.pageSize,
          pageNum:this.currentPage,*/
          flowType:this.billMsg.audit.flowType,
          bizCode:this.billMsg.audit.bizCode
        }
        this.$ajax.get('/api/machine/getAuditListToFinance',param).then(res=>{
          // debugger
          res=res.data
          if(res.status===200){
            this.checkList = res.data.data
            this.total=res.data.total
          }
        })
      },
      /**
       * 审核
       */
      checkBill: function (type) {
        if(this.radioMask&&!this.payRadio&&type===1){
          this.$message({
            message:'请选择支付方式'
          })
          return
        }
        let param = {
          // bizId: this.billMsg.audit.bizId,
          bizCode: this.billMsg.audit.bizCode,
          // flowId: this.billMsg.audit.flowId,
          // sort: this.billMsg.audit.nodeSort,
          flowType: this.activeItem==='付款信息'?0:1
        }
        param.ApprovalForm = {
          result: type,
          remark: this.layer.reasion
        }
        this.fullscreenLoading=true
        this.$ajax.postJSON('/api/machine/audit', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.fullscreenLoading=false
            this.getData()
            if(this.radioMask&&type===1){
              this.secondCheck()
            }else {
              this.$message({
                message:res.message
              })
              this.layer.show = false
            }
          }
        }).catch(error=>{
          this.fullscreenLoading=false
          if(error.message==='下一节点审批人不存在'){
            this.checkPerson.state=true
          }else {
            this.$message({
              message:error
            })
          }
        })
      },
      secondCheck:function () {
        let param={
          payId:this.billId,
          payMethod:parseInt(this.payRadio)
        }
        this.$ajax.put('/api/payInfo/auditPass',param,2).then(res=>{
          res=res.data
          if(res.status===200){
            this.$message({
              message:res.message
            })
            this.payRadio=0
            this.layer.show = false
          }
        })
      },
      clearLayer: function () {
        this.layer.reasion = ''
        this.layer.show = false
      },
      choseTab: function (item) {
        this.activeItem = item
        if (item !== '审核信息') {
          this.checkBoxShow=false
          return
        }
        this.checkBoxShow=true
        /*target = this.$refs.checkBox.offsetTop
        scrollHeight = document.querySelector('.view').parentNode.clientHeight
        console.log(`target:${target}`)
        console.log(`容器：${scrollHeight}`)
        this.scrollTop()*/
      },
      scrollTop: function () {
        let scrollTop = document.querySelector('.view').parentNode.scrollTop
        document.querySelector('.view').parentNode.scrollTop = scrollTop + 30
        console.log(scrollTop)
        if (scrollTop + scrollHeight >= target) {
          clearTimeout(timer)
        } else {
          timer = setTimeout(() => {
            this.scrollTop()
          }, 50)
        }
      },
      //合并单元格
      collapseRow: function ({rowIndex, columnIndex}) {
        if (this.billMsg.inAccount&&(columnIndex <2||columnIndex>3)) {
          if (rowIndex === 0) {
            return [this.billMsg&&this.billMsg.inAccount.length, 1]
          } else {
            return [0, 0]
          }
        }else {
          return [1,1]
        }
      },
    },
    computed: {
      invalidNumber() {
        return this.layer.reasion.length
      }
    },
    filters:{
      nullFormatter:function (val,type=1) {
        if(!val){
          return type===1?'无':'--'
        }else {
          return val
        }
      },
      nullFilter:function (val) {
        if(!val){
          return val===0?0:'-'
        }else {
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
          text-overflow:ellipsis;
        }
      }
    }
  }

  .reasion-dialog {
    display: flex;
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
      &:nth-of-type(2){
        >span{
          color: @color-233;
        }
      }
      &:nth-of-type(3){
        .el-radio{
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
      .warning-text{
        margin-top: @margin-10;
        >p{
          font-size: 14px;
          color: red;
        }
      }
    }
  }
</style>
