<template>
  <div class="view">
    <div class="view-context">
      <h1 v-if="type===1">扫码收款</h1>
      <h1 v-else><i class="iconfont icon-chenggong"></i></h1>
      <div v-if="type===1"><img :src="result.RQcode" width="220" alt=""></div>
      <p v-if="type===1" class="other">请勿手动在pos上输入金额！否则无法开收据！</p>
      <h3 v-if="checkPerson.state">{{type===1?edit?'POS收款订单修改成功':'POS收款订单创建成功':edit?'收款信息修改成功':'收款信息录入成功'}}</h3>
      <p><i class="iconfont icon-chenggong" v-if="type===1"></i><span>{{edit?'收款单修改成功':'已成功生成收款单'}}</span></p>
      <div class="bill-result-table">
        <div class="warning-text" v-if="type===1">
          <p>温馨提示：</p>
          <p>1.操作说明：pos开机状态下，请按快捷键F1，其次按数字键1，最后按功能键后，用红外线对准上图二维码进行收款。</p>
          <p>2.pos机上提示收款成功后，有1-2分钟的延迟才能开票，请耐心等待。</p>
        </div>
        <el-table border :data="list" style="width: 100%" header-row-class-name="theader-bg" v-if="type===2">
          <el-table-column align="center" label="现金">
            <template slot-scope="scope">
              <span>{{result.detail['cash']}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="转账">
            <template slot-scope="scope">
              <span>{{result.detail['trun']}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="POS刷卡">
            <template slot-scope="scope">
              <span>{{result.detail['pos']}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="合计金额">
            <template slot-scope="scope">
              <span>{{result.amount}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table border :data="list" style="width: 100%" header-row-class-name="theader-bg" key="other" v-else>
          <el-table-column min-width="160" align="center" label="订单编号">
            <template slot-scope="scope">
              <span>{{result.payCode}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="160" align="center" label="订单金额">
            <template slot-scope="scope">
              <span>{{result.amount}}</span>
            </template>
          </el-table-column>
          <!--<el-table-column min-width="160" align="center" label="订单条码">-->
            <!--<template slot-scope="scope">-->
              <!--<img :src="result.RQcode" alt="">-->
            <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </div>
      <p class="tool-bar" :class="[type!==1?'tool-bar-other':'']">
        <el-button round class="make-bill" type="primary" v-if="type===1&&power['sign-cw-bill-invoice'].state" @click="toBill">开票</el-button>
        <!--<el-button round @click="goBack('contractList')" v-if="power['sign-ht-info-query'].state">返回合同列表</el-button>-->
        <el-button round @click="goBack('Bill')" v-if="power['sign-cw-debt-query'].state">返回收付款列表</el-button>
        <span class="btn-question" @click="answer" v-if="type===1">支付遇到问题？</span>
      </p>
    </div>
    <el-dialog
      :closeOnClickModal="$tool.closeOnClickModal"
      title="提示"
      :visible.sync="confirm"
      width="460px"
      class="dialog-answer">
      <p>支付遇到问题？您可以拨打以下客服电话处理咨询：</p>
      <h4>400 112 5883</h4>
    </el-dialog>
    <layer-invoice ref="layerInvoice" @emitPaperSet="emitPaperSetFn"></layer-invoice>
    <checkPerson :show="checkPerson.state" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @close="checkPerson.state=false" @submit="checkPerson.state=false" v-if="checkPerson.state"></checkPerson>
  </div>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";
  import LayerInvoice from '@/components/LayerInvoice'
  import checkPerson from '@/components/checkPerson'
  export default {
    name: "receipt-result",
    mixins: [MIXINS],
    components:{
      LayerInvoice,
      checkPerson
    },
    data() {
      return {
        list: [{}],
        type: 1,//1=创建 2=录入
        edit:false,//是否为修改结果页
        result: {},
        confirm: false,
        checkPerson: {
          state:false,
          type:'set',
          current:false,
          code:'',
          flowType:1
        },
        power:{
          'sign-cw-bill-invoice': {
            state: false,
            name: '开票'
          },
          /*'sign-cw-bill-print':{
            state: false,
            name: '打印'
          },*/
          'sign-ht-info-query':{
            state: false,
            name: '合同列表'
          },
          'sign-cw-debt-query':{
            state: false,
            name: '收付款单列表'
          },
        },
        socket:null,
      }
    },
    created() {
      this.type = parseInt(this.$route.query.type)
      this.edit = parseInt(this.$route.query.edit)===1?true:false
      this.result = JSON.parse(this.$route.query.content)
      /*if(this.result.payCode&&this.result.payCode.length>0){
        this.checkPerson.state=true
        this.checkPerson.code=this.result.payCode
      }*/
    },
    mounted(){
      this.$nextTick(()=>{
        if(this.type===1){
          this.getMsg()
        }
      })
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if(from.path==='/receiptBill'&&to.query.errorCode==='dialog'){
          let param={
            state:true,
            code:vm.result.payCode,
            current:parseInt(vm.result.type)===1?false:true
          }
          vm.checkPerson=Object.assign(vm.checkPerson,param)
        }
      })
    },
    methods: {
      getMsg:function () {
        this.$ajax.get('/api/socket/generateCode',{payCode:this.result.payCode}).then(res=>{
          res=res.data
          if(res.status===200){
            this.getWebSocket(res.data)
          }
        }).catch(error=>{
          this.$message({
            message:error
          })
        })
      },
      getWebSocket:function (uid) {
        let host=window.location.host
        let url=''
        switch (host){
          case "localhost:8080":
            url="http://192.168.1.224:28800"
                break
          case "sign2.jjw.com:28879":
            url="http://120.76.202.91:28800"
                break
          case "sign2.jjw.com":
            url="https://sign2.jjw.com"
                break
          default:
            url="http://192.168.1.96:28800"
        }
        this.socket = io.connect(`${url}?mac=${this.result.payCode}&auth=${uid}`)
        let that=this
        this.socket.on('connect',function () {
          that.socket.on('messageevent', function(data) {
            if(data){
              that.goBack('Bill')
            }
          })
        })
      },
      goBack: function (page) {
        let param={
          path: page
        }
        /*if(page==='details'){
          param.query={
            id: this.result.id,
            tab: '收款信息',
            power: this.getUser.user.empId===row.auditBy,
            bill: this.power['sign-cw-bill-invoice'].state
          }
        }*/
        this.$router.push(param)
      },
      answer: function () {
        this.confirm = true
      },
      toBill:function () {
        this.$ajax.get('/api/payInfo/checkBill',{payCode:this.result.payCode}).then(res=>{
          res=res.data
          if(res.status===200&&res.data.value===1){
            this.$refs.layerInvoice.show(this.result.id,true)
          }else {
            this.$message({
              message:'未付款还不能开票'
            })
          }
        })
      },
      emitPaperSetFn:function () {

      }
    },
    destroyed(){
      // debugger
      // this.socket.emit('close',{payCode:this.result.payCode})
      this.socket.disconnect()
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";

  .view {
    background-color: @bg-white;
    position: relative;
    /*height: 100%;*/
    &-context {
      width: 60%;
      margin: 0 auto;
      /*position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);*/
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      >h1{
        margin-top: 20px;
        /*margin-bottom: 41px;*/
        .iconfont{
          color: @color-58b;
          font-size: 89px;
        }
      }
      >p{
        margin-bottom: 41px;
        .iconfont{
          color: @color-58b;
          /*font-size: 89px;*/
        }
      }
      > h3 {
        color: @color-324;
        font-size: 28px;
      }
      > p {
        color: @color-99A;
        margin: 20px 0;
        font-size: 18px;
        &.other{
          color: red;
        }
      }
      .bill-result-table {
        width: 100%;
        margin: 30px 0 70px 0;
        text-align: center;
        .warning-text{
          text-align: left;
          margin-bottom: 20px;
          >p{
            color: red;
            font-size: 20px;
          }
        }
      }
    }
  }

  .make-bill {
    min-width: 150px;
  }

  .tool-bar {
    position: relative;
    padding-right: 130px;
    white-space: nowrap;
    &-other{
      padding: 0;
    }
    .btn-question {
      position: absolute;
      right: 0;
      bottom: 0;
      color: @color-blue;
      font-size: @size-base;
      cursor: pointer;
    }
  }
  .dialog-answer{
    p{
      text-align: center;
    }
    h4{
      padding: 28px 0;
      text-align: center;
      font-weight: bold;
    }
  }
</style>
