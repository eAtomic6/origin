<!-- 打款记录 -->
<template>
  <div class="view-container" id="debitRecord" ref="tableComView">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn('search')" @propResetFormFn="resetFormFn" class="adjustbox">
      <el-form :inline="true" :model="adjustForm" class="adjust-form" size="mini" ref="adjustCheckForm">
        <el-form-item label="关键字">
          <el-tooltip effect="dark" content="打款人/账户/备注/金额" placement="top">
            <el-input v-model="adjustForm.keyword" style="width:150px" clearable placeholder="请输入"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="打款日期">
          <el-date-picker v-model="adjustForm.signDate" type="daterange" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="分账门店">
          <el-select v-model="adjustForm.outStoreAttr" placeholder="全部" class="width150" clearable @change="changeStoreAttr_out">
            <el-option v-for="item in dictionary['53']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="部门">
          <!-- <select-tree :data="DepList" :init="adjustForm.depName1" @checkCell="depHandleClick1" @clear="clearDep(1)" @search="searchDep1" class="fl"></select-tree> -->
          <el-select
            v-model="adjustForm.outStoreId"
            :multiple="false"
            filterable
            remote
            placeholder="全部"
            :remote-method="remoteMethod_out"
            v-loadmore.out="moreDeps"
            :clearable="true"
            @clear="clearOutList('out')"
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
          <el-select v-model="adjustForm.inStoreAttr" placeholder="全部" class="width150" clearable @change="changeStoreAttr_in">
            <el-option v-for="item in dictionary['53']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="部门">
          <!-- <select-tree :data="DepList" :init="adjustForm.depName2" @checkCell="depHandleClick2" @clear="clearDep(2)" @search="searchDep2" class="fl"></select-tree> -->
          <el-select
            v-model="adjustForm.inStoreId"
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

        <el-form-item label="支付状态">
          <el-select v-model="adjustForm.status.value" placeholder="全部" class="width150" clearable>
            <el-option v-for="item in dictionary['26']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="账户类型">
          <el-select v-model="adjustForm.type" placeholder="全部" class="width150" clearable>
            <el-option label="个人账户" value="0"></el-option>
            <el-option label="企业账户" value="1"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
    </ScreeningTop>

    <!-- 数据列表 -->
    <div class="contract-list">
      <p style="color:#666;margin-bottom:10px;">温馨提示：支付失败原因为“收款人户名和银行卡号信息不匹配”时，需要去公司设置里面重新修改此门店的银行账户信息</p>
      <el-table :data="tableData.list" ref="tableCom" :max-height="tableNumberCom" style="width: 100%" v-loading="loadingTable" @row-dblclick='toDetail' border>

        <el-table-column label="分账门店" :formatter="nullFormatter" align="center" min-width="80">
          <template slot-scope="scope">
            <p>{{scope.row.outStoreName}}</p>
          </template>
        </el-table-column>

        <el-table-column label="分账门店账户" :formatter="nullFormatter" align="center" min-width="120">
          <template slot-scope="scope">
            <p>{{scope.row.outBankCard}}</p>
          </template>
        </el-table-column>

         <el-table-column label="收款门店" :formatter="nullFormatter" align="center" min-width="80">
          <template slot-scope="scope">
            <p>{{scope.row.inStoreName}}</p>
          </template>
        </el-table-column>

        <el-table-column label="收款门店账户" :formatter="nullFormatter" align="center" min-width="120">
          <template slot-scope="scope">
            <p>{{scope.row.inBankCard}}</p>
          </template>
        </el-table-column>

         <el-table-column label="分账金额（元）" :formatter="nullFormatter" align="center" min-width="80">
          <template slot-scope="scope">
            <p>{{scope.row.accountAmount}} 元</p>
          </template>
        </el-table-column>

        <el-table-column label="分账周期" align="center" min-width="100">
          <template slot-scope="scope">
            <p>{{scope.row.startTime | getDate}} ~ {{scope.row.endTime | getDate}}</p>
          </template>
        </el-table-column>

        <el-table-column label="账户类型" :formatter="nullFormatter" align="center" min-width="80">
          <template slot-scope="scope">
            <p v-if="scope.row.type == 0">个人账户</p>
            <p v-else-if="scope.row.type == 1">企业账户</p>
            <p v-else>--</p>
          </template>
        </el-table-column>

        <el-table-column label="打款人" :formatter="nullFormatter" align="center" min-width="120">
          <template slot-scope="scope">
            <p>{{scope.row.moneyOutDepName + ' - ' + scope.row.moneyOutByName}}</p>
          </template>
        </el-table-column>

        <el-table-column label="打款日期" align="center" min-width="90">
          <template slot-scope="scope">
            <p>{{scope.row.moneyOutTime | getTime}}</p>
          </template>
        </el-table-column>

        <el-table-column label="支付状态" align="center" min-width="80">
          <template slot-scope="scope">
            <p v-if="scope.row.status&&(scope.row.status.value === 1 || scope.row.status.value === 3)">{{scope.row.status.label}}</p>
            <p v-else-if="scope.row.status&&scope.row.status.value === 2" class="red">
              <el-popover placement="top" width="200" trigger="click">
                <span>{{failMsg}}</span>
                <el-button slot="reference" type="text" class="curPointer2" @click="failReason(scope.row)">{{scope.row.status.label}}</el-button>
              </el-popover>
            </p>
            <p v-else>--</p>
          </template>
        </el-table-column>

        <el-table-column label="打款备注" align="center" min-width="90">
          <template slot-scope="scope">
              <span v-if="scope.row.remark&&(scope.row.remark).trim().length > 0">
                <el-popover trigger="hover" placement="top">
                  <div style="width:160px;word-break: break-all;word-wrap:break-word;white-space: normal;text-align: justify">
                    {{scope.row.remark}}
                  </div>
                  <div slot="reference" class="name-wrapper" :class="{'isFlex':scope.row.remark.length<16}">
                    {{scope.row.remark}}
                  </div>
                </el-popover>
              </span>
              <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" align="center" min-width="120">
          <template slot-scope="scope">
            <template v-if="scope.row.status && scope.row.status.value === 2 && power['sign-ht-fz-pay'].state&&scope.row.flag!=1">
              <el-button type="text" class="curPointer" @click="payAgain(scope.row)">重新打款</el-button>
            </template>
            <span v-else>--</span>
          </template>

        </el-table-column>


      </el-table>
      <el-pagination
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      :current-page="pageNum"
      layout="total, prev, pager, next, jumper"
      :total="tableData.total"
      v-if="tableData.total > 0"
      >
     </el-pagination>
    </div>
    <!-- 重新打款 -->
    <el-dialog
      title="重新打款"
      :visible.sync="payVisiable"
      width="622px">
      <div class="paycontent">
        <p>分账周期：<span>{{fenzhang1 | getDate}} ~ {{fenzhang2 | getDate}}</span></p>
        <p>收款门店：<span>{{shoukuan}}</span></p>
      </div>
      <div class="paycontent">
        <div class="paytitle">收款门店账户选择：</div>
          <div v-for="(item,index) in payAgainInfo" :key="index" class="radiodiv">
            <el-radio class="radio" v-model="radio" :label="index" @change="changeRadio">
              <div class="innerdiv">
                <p>
                  <span class="blue" v-if="item.type==0">账户类型：个人账户</span>
                  <span class="blue" v-if="item.type==1">账户类型：企业账户</span>
                  <span class="blue">开户名：{{item.bankAccountName}}</span>
                </p>
                <p>
                  <span class="blue">银行卡号：{{item.bankCard}}</span>
                  <span class="blue">银行：{{item.bankName}}</span>
                </p>
                <p v-if="item.type == 1"><span class="blue">支行:{{item.bankBranchName}}</span></p>
              </div>
            </el-radio>
          </div>
      </div>
      <div class="textareabox">
        <span>打款备注</span>
        <el-input type="textarea" :rows="3"  v-model="payremark" class="textarea" maxlength=100></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="payVisiable = false">取 消</el-button>
        <el-button type="primary" @click="payAgainSure()" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 打款详情 -->
    <!-- <el-dialog title="打款明细" :visible.sync="dialogVisible2" width="1000px" class="layer-audit" :closeOnClickModal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal">
      <div class="audit-box"  :style="{ height: clientHeight2() }">

        <div class="audit-col">
          <el-table :data="layerAudit" border style="width: 100%" class="table">
            <el-table-column label="合同编号" width="120" fixed :formatter="nullFormatter" align="center">
              <template slot-scope="scope">
                <div class="blue curPointer" @click="goContractDetail(scope.row)">{{scope.row.code}}</div>
              </template>
            </el-table-column>

            <el-table-column label="合同类型" prop="contType.label" :formatter="nullFormatter" align="center"></el-table-column>

            <el-table-column label="物业地址" prop="address"></el-table-column>

            <el-table-column label="成交总价" :formatter="nullFormatter" prop="dealPrice">
              <template slot-scope="scope">
                <span>{{scope.row.dealPrice}} 元</span>
                <span v-for="item in dictionary['507']" :key="item.key" v-if="item.key===scope.row.timeUnit&&scope.row.contType.value===1"> / {{item.value}}</span>
              </template>
            </el-table-column>

            <el-table-column label="成交经纪人" :formatter="nullFormatter">
              <template slot-scope="scope">
                <p>{{scope.row.dealAgentStoreName}}</p>
                <p>{{scope.row.dealAgentName}}</p>
              </template>
            </el-table-column>

            <el-table-column prop="thisSettlement" label="当期实收（元）"></el-table-column>

            <el-table-column prop="ratioSettlement" label="结算比例"></el-table-column>

            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <span class="openAll" @click="openAll">当期成本(元)</span>
              </template>
              <template slot-scope="scope">
                {{scope.row.thisCost}}
              </template>
            </el-table-column>

            <el-table-column v-if="!isOpen">
              <template slot="header" slot-scope="scope">
                <span>金融服务费(元)</span>
              </template>
              <template slot-scope="scope">
                {{scope.row.serviceFee}}
              </template>
            </el-table-column>

            <el-table-column v-if="!isOpen">
              <template slot="header" slot-scope="scope">
                <span>按揭手续费(元)</span>
              </template>
              <template slot-scope="scope">
                {{scope.row.mortgageFee}}
              </template>
            </el-table-column>


            <el-table-column prop="actualSettlement" label="实际结算"></el-table-column>


            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <span class="openAll" @click="openAll2">业绩分成比例</span>
              </template>
              <template slot-scope="scope">
                {{scope.row.achieveDisRatio}}
              </template>
            </el-table-column>

            <el-table-column label="分成角色" align="center" v-if="!isOpen2">
              <template slot-scope="scope">
                <div v-if="scope.row.resultDetailsList.length==0">
                  <div>--</div>
                </div>
                <div v-else>
                  <p v-for="item in scope.row.resultDetailsList">
                    {{item.disDeptName + '-' + item.disName +  '-' + item.roleType}}
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="分成比例" align="center" v-if="!isOpen2">
              <template slot-scope="scope">
                <div v-if="scope.row.resultDetailsList.length==0">
                  <div>--</div>
                </div>
                <div v-else>
                  <div v-for="item in scope.row.resultDetailsList">
                    {{item.disRatio}}%
                  </div>
                </div>
              </template>
            </el-table-column>


            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <span class="openAll" @click="openAll3">门店承担成本（元）</span>
              </template>
              <template slot-scope="scope">
                {{scope.row.storeCost}}
              </template>
            </el-table-column>

            <el-table-column v-if="!isOpen3">
              <template slot="header" slot-scope="scope">
                <span>特许服务费（元）</span>
              </template>
              <template slot-scope="scope">
                {{scope.row.platformFee}}
              </template>
            </el-table-column>

            <el-table-column v-if="!isOpen3">
              <template slot="header" slot-scope="scope">
                <span>当期刷卡手续费（元）</span>
              </template>
              <template slot-scope="scope">
                {{scope.row.payCardFee}}
              </template>
            </el-table-column>


            <el-table-column prop="disAmount" label="当期实收分成（元）"></el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog> -->

  </div>
</template>



<script>
  import ScreeningTop from '@/components/ScreeningTop';
  import {FILTER} from "@/assets/js/filter";
  import {TOOL} from "@/assets/js/common";
  import { MIXINS } from "@/assets/js/mixins";

  export default {
    name: "debit-record",
    // mixins: [FILTER],
    mixins: [FILTER,MIXINS],
    data(){
      return{
        fullscreenLoading:false,//创建按钮防抖
        fenzhang1: '',
        fenzhang2: '',
        shoukuan: '',
        payId:'',
        payremark:'',
        inBankCard:'',
        bankAccountName:'',
        payAgainInfo: [],
        radio:'',
        failMsg:'',
        isOpen:true,
        isOpen2:true,
        isOpen3:true,
        payVisiable: false,

        clientHei: document.documentElement.clientHeight, //窗体高度
        // loading:false,
        // loading2:false,
        loadingTable:false, //列表的加载loading
        visiableColumn1:true,
        userMsg:{},

        // 列表分页
        pageNum: 1,
        pageSize: 50,
        total: 0,

        // Form :{
        //   getDepName: '',
        //   getAgentName: ''
        // },
        adjustForm:{
          signDate: '', //发起日期
          outStoreId: '', //分账门店id
          inStoreId: '', //分账门店属性
          outStoreAttr: '', //收款门店id
          inStoreAttr: '', //收款门店属性
          keyword: '',   //关键字
          status:{
            value:'',
            label: ''
          }, //支付状态
          type:'' //账户类型
        },

        // 部门搜索分页
        pageSize_:50,
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
        currentPage_in:1,//收款
        total_out:0,
        total_in:0,
        loading:false,
        //部门选择列表
        options:[],
        currentPage_:1,
        firstTotal:0,

        dictionary: {
          //数据字典
          "507": "", // 成交总价单位
          "53": "", //合作方式
          "26": ""  // 支付状态
        },

        layerAudit:[],


        checkInfo:[],


        //上传的协议
        uploadList: [],

        auditForm: {
          textarea: '', //备注
        },
        // 弹框里用到的
        dialogVisible2: false,
        // checked: false, //是否有解除协议

        tableData:[],

        power: {
          'sign-ht-maid-query': {
            state: false,
            name: '查询'
          },
          'sign-ht-maid-vdetail': {
            state: false,
            name: '打款明细'
          },
          'sign-com-htdetail':{
              name:'合同详情',
              state:false,
          },
          'sign-ht-fz-pay':{
              name:'重新打款',
              state:false,
          }
        }




      }
    },

    computed: {

    },

    filters: {
       getDate(val) {
         return TOOL.dateFormat(val);
       },
       getTime(val) {
         if(val === ''){
           return '-'
         }
         return TOOL.timeFormat(val)
       }
    },

    methods:{

      failReason(e){
        let param = {
          payId: e.payId
        }
        this.$ajax.get("/api/payInfo/selectRetMsg", param)
        .then(res => {
          if (res.data.status === 200) {
            this.failMsg = res.data.data.msg
          }
        }).catch(error => {
            this.$message({
              message: error
            })
        });
      },

      payAgain(e) {
         if(this.power['sign-ht-fz-pay'].state){
            this.radio=''
            this.payVisiable = true
            this.fenzhang1 = e.startTime
            this.fenzhang2 = e.endTime
            this.shoukuan = e.inStoreName
            this.payId = e.payId
            this.id = e.id,
            this.payremark=""//清空备注
            let param = {
              storeId: e.inStoreId
            }
            this.$ajax.get("/api/separate/queryBank", param)
            .then(res => {
              if (res.data.status === 200) {
                this.payAgainInfo = res.data.data
                if(this.payAgainInfo.length > 0) {
                  this.inBankCard = this.payAgainInfo[0].bankCard
                  this.bankAccountName = this.payAgainInfo[0].bankAccountName
                }
              }
            }).catch(error => {
                this.$message({
                  message: error
                })
            });
          }else{
          this.$message({
            message:'没有重新打款权限',
            type:'warning'
          });
        }

      },

      changeRadio(val){
        console.log(val)
        if(val){
          this.$nextTick(() => {

           this.inBankCard = this.payAgainInfo[val].bankCard,
           this.bankAccountName = this.payAgainInfo[val].bankAccountName
          })
        }

      },

      payAgainSure(){


        if(this.radio === ''){
          this.$message({
            message: '请您选择收款门店账户',
            type: 'warning'
          })
        }else{
          let radio = parseInt(this.radio.toString())
          this.inBankCard = this.payAgainInfo[radio].bankCard,
          this.bankAccountName = this.payAgainInfo[radio].bankAccountName
            this.fullscreenLoading=true
            let param = {
              id: this.id,
              remark: this.payremark,
              inBankCard: this.inBankCard,
              inBankAccountName: this.bankAccountName
            }
            this.$ajax.postJSON("/api/separate/payAgain", param)
            .then(res => {
              this.$nextTick(()=>{
                this.fullscreenLoading=false
              })
              let data = res.data;
              if (res.data.status === 200) {
                this.payVisiable = false
                  // 数据刷新
                this.queryFn();
                setTimeout(() => {
                  this.$message('已重新打款');
                }, 2000);
              }
            }).catch(error => {

              this.$nextTick(()=>{
                this.fullscreenLoading=false
              })
              this.payVisiable = false
              if(error.status === 2001){

                  // 数据刷新
                this.queryFn();
                this.$message({
                  message: error.message
                })
              }else if(error.status === 400){
                this.$message({
                  message: error.message
                })
              }else{
                 this.$message({
                  message: error
                })
              }

            });
        }

      },

      openAll(){
        this.isOpen=!this.isOpen;
      },
      openAll2(){
        this.isOpen2=!this.isOpen2;
      },
      openAll3(){
        this.isOpen3=!this.isOpen3;
      },


      // 控制弹框body内容高度，超过显示滚动条
      clientHeight() {
          return this.clientHei - 265 + 'px'
      },

      clientHeight2() {
          return this.clientHei - 197 + 'px'
      },
      trim(str){
        return str.replace(/(^\s*)|(\s*$)/g, "")
      },


      // 重置
      resetFormFn() {
          TOOL.clearForm(this.adjustForm);
          this.pageNum = 1;
          this.outStoreList=this.options//分账门店
          this.inStoreList=this.options//收款门店
          this.currentPage_out=1//分账
          this.currentPage_in=1//收款
          this.total_out=this.firstTotal
          this.total_in=this.firstTotal
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

      // 查询
      queryFn(type="init") {
        // console.log(this.power)
        // if(this.power['sign-ht-maid-query'].state){
          // console.log(this.userMsg.empId)
          if(type==="search"){
            this.pageNum=1
          }
        this.loadingTable = true;
        // this.adjustForm.signDate = TOOL.dateFormat(this.adjustForm.signDate);
            let moneyOutStartTime = '';
            let moneyOutEndTime = '';
            if(this.adjustForm.signDate && this.adjustForm.signDate.length === 2){
                moneyOutStartTime = TOOL.dateFormat(this.adjustForm.signDate[0]);
                moneyOutEndTime = TOOL.dateFormat(this.adjustForm.signDate[1]);
            }
            let param = {
              outStoreId:  this.adjustForm.outStoreId,
              outStoreAttr: this.adjustForm.outStoreAttr,
              inStoreId:  this.adjustForm.inStoreId,
              inStoreAttr: this.adjustForm.inStoreAttr,
              moneyOutStartTime,
              moneyOutEndTime,
              pageNum: this.pageNum,
              pageSize: this.pageSize,
              keyword: this.adjustForm.keyword,
              status: this.adjustForm.status.value,
              type:  this.adjustForm.type
            }
            if(type==="search"||type==="page"){
              sessionStorage.setItem('sessionQuery',JSON.stringify({
                path:'/debitRecord',
                url:'/separate/money/out/list',
                query:Object.assign({},param,{checkOutDep:this.checkOutDep},{checkInDep:this.checkInDep}),
                methods:"get"
              }))
            }
            //调整佣金审核列表
            this.$ajax
            .get("/api/separate/money/out/list", param)
            .then(res => {
              this.$nextTick(() => {
                this.loadingTable = false;
              })
              let data = res.data;
              if (res.data.status === 200) {
                this.tableData = data.data

              }



            }).catch(error => {
              this.$nextTick(() => {
                this.loadingTable = false;
              })
              this.$message({
                message: error
              })
            })
        // }else{
        //   this.noPower(this.power['sign-ht-maid-query'].name)
        // }

      },
      //记录选中的门店
    checkOut(data){//分账门店
    // debugger
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
      // 双击详情事件
      toDetail(e) {
        let newPage = this.$router.resolve({
            path: '/routingRemitDetail',
            query:{
              ids: e.settleDetailsIds,
              type: 2
            }
          });
          window.open(newPage.href, '_blank');
          // this.dialogVisible2 = true
          // let param = {
          //   settleDetailsIds: e.settleDetailsIds,
          // }
          // this.$ajax.get("/api/separate/money/out/details", param)
          // .then(res => {
          //   let data = res.data;
          //   if (res.data.status === 200) {
          //     this.layerAudit = data.data;
          //   }
          // }).catch(error => {
          //     this.$message({
          //       message: error
          //     })
          // });




      },

      //跳转合同详情页
      goContractDetail(value){
        if(this.power['sign-com-htdetail'].state){

          // console.log(value)
          this.setPath(this.$tool.getRouter(['合同','调佣审核','合同详情'],'contractList'));
          this.$router.push({
            path:'/contractDetails',
            query:{
              id: value.contId,
              code: value.contractCode,
              contType: value.tradeType
            }
          })
        }else{
           this.noPower(this.power['sign-com-htdetail'].name);
        }
      },

      handleCurrentChange(e) {
        this.pageNum = e;
        this.queryFn("page");
      },


    getDepList(param,first=true,type='other'){
      this.$ajax.get('/api/organize/deps/pages',param).then(res=>{
        res=res.data;
        if(res.status===200){
          // if(this.adjustForm.checkOutDep&&this.adjustForm.checkOutDep.id||this.adjustForm.checkInDep&&this.adjustForm.checkInDep.id){
          //   res.data.list.forEach((element,index) => {
          //     if((this.adjustForm.checkOutDep&&this.adjustForm.checkOutDep.id===element.id)||(this.adjustForm.checkInDep&&this.adjustForm.checkInDep.id===element.id)){
          //       res.data.list.splice(index,1)
          //     }
          //   });
          // }
          let outList = [].concat(res.data.list)
          let inList = [].concat(res.data.list)
          if(this.adjustForm.checkOutDep&&this.adjustForm.checkOutDep.id){
            res.data.list.forEach((element,index) => {
              if(this.adjustForm.checkOutDep&&this.adjustForm.checkOutDep.id===element.id){
                outList.splice(index,1)
              }
            });
          }
          if(this.adjustForm.checkInDep&&this.adjustForm.checkInDep.id){
            res.data.list.forEach((element,index) => {
              if(this.adjustForm.checkInDep&&this.adjustForm.checkInDep.id===element.id){
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
          }else{
            if(type==='out'){
              this.outStoreList=res.data.list;
              this.total_out=res.data.total
            }else{
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
          type:'G',
          keyword:keyword,
          pageSize:this.pageSize_,
          pageNum:this.currentPage_out,
          depAttr:''
        }
        if(this.adjustForm.outStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.adjustForm.outStoreAttr===2){
          param.depAttr='JOIN'
        }
        this.getDepList(param,false,'out')
      }
    },
    remoteMethod_in(keyword){
      if(keyword!==''){
        this.currentPage_in=1;
        let param = {
          type:'G',
          keyword:keyword,
          pageSize:this.pageSize_,
          pageNum:this.currentPage_in,
          depAttr:''
        }
        if(this.adjustForm.inStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.adjustForm.inStoreAttr===2){
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
            type:'G',
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
            type:'G',
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
      this.adjustForm.outStoreId='';
      let param = {
        type:'G',
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
      this.adjustForm.inStoreId='';
      let param = {
        type:'G',
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
          type:'G',
          pageNum:this.currentPage_out,
          pageSize:this.pageSize_,
          depAttr:''
        }
        if(this.adjustForm.outStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.adjustForm.outStoreAttr===2){
          param.depAttr='JOIN'
        }
        // this.getDepList(param,false,'out')
      }else{
        this.currentPage_in=1;
        let param = {
          type:'G',
          pageNum:this.currentPage_in,
          pageSize:this.pageSize_,
          depAttr:''
        }
        if(this.adjustForm.inStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.adjustForm.inStoreAttr===2){
          param.depAttr='JOIN'
        }
        // this.getDepList(param,false,'in')
        }
      },
    },
    created() {
      let res=this.getDataList
      if(res&&(res.route===this.$route.path)){
        this.tableData = res.data
        let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
        this.adjustForm = Object.assign({},this.adjustForm,session.query)
        this.adjustForm.status={
          value:this.adjustForm.status,
          label:''
        }
        if(session.query.moneyOutStartTime){
          this.adjustForm.signDate=[session.query.moneyOutStartTime,session.query.moneyOutEndTime]
        }
        delete this.adjustForm.pageNum
        delete this.adjustForm.moneyOutStartTime
        delete this.adjustForm.moneyOutEndTime
        this.pageNum=session.query.pageNum
        // this.adjustForm.outStoreId=''
        // this.adjustForm.inStoreId=''
        if(this.adjustForm.checkOutDep.id){
          this.outStoreList.unshift({
            id:this.adjustForm.checkOutDep.id,
            name:this.adjustForm.checkOutDep.name
          })
        }
        if(this.adjustForm.checkInDep.id){
          this.inStoreList.unshift({
            id:this.adjustForm.checkInDep.id,
            name:this.adjustForm.checkInDep.name
          })
        }

        if(this.adjustForm.outStoreAttr){
          let param = {
            pageNum:this.currentPage_out,
            pageSize:this.pageSize_,
          }
          param.depAttr=this.adjustForm.outStoreAttr===1?"DIRECT":"JOIN"
          this.getDepList(param,true,"out")
        }
        if(this.adjustForm.inStoreAttr){
          let param = {
            pageNum:this.currentPage_in,
            pageSize:this.pageSize_,
          }
          param.depAttr=this.adjustForm.inStoreAttr===1?"DIRECT":"JOIN"
          this.getDepList(param,true,"in")
        }
        if(!this.adjustForm.outStoreAttr&&!this.adjustForm.inStoreAttr){
          this.getDepList({
            // type:'G',
            pageNum:1,
            pageSize:this.pageSize_,
          })
        }
      }else{
        this.queryFn();
        this.getDepList({
          // type:'G',
          pageNum:1,
          pageSize:this.pageSize_,
        })
      }
      // this.getDepNameFn();
      this.getDictionary();
      // this.getDepList({
      //   type:'G',
      //   pageNum:this.currentPage_,
      //   pageSize:this.pageSize_,
      // })
      // this.getAdmin();
      // this.remoteMethod()
    },

    mounted() {
      var _this = this;
       window.onresize = function(){
         _this.clientHei = document.documentElement.clientHeight;
       }
    },

    components: {
          ScreeningTop,


      }
  };
</script>
<style lang="less">

@import "~@/assets/common.less";

#debitRecord{
  .paycontent{
    margin-top: 15px;
    clear: both;
    overflow: hidden;
    .paytitle{
      margin-bottom: 20px;
    }
    p{
      float: left;
      span{
        color: #333;
      }
      &:first-child{
        margin-right: 30px;
      }
    }

    .radio{
      margin-bottom: 8px;
      margin-left: 20px;
      display: flex;

    }
  }

  .textareabox{
    margin: 15px 0 20px;
    display: flex;
    align-items: flex-start;
    span{
      width: 80px;

    }
  }
  .btn-text-info{
    padding: 0;
    &.color-red{
      color: red;
    }
  }
  .el-dialog .el-dialog__body{
    padding: 0 20px;
  }
  .el-dialog__header{
      border-bottom: 1px solid #EDECF0;
      padding: 16px 20px 12px;
      span{
          color: #233241;
          font-size: 18px;


      }
      .el-dialog__headerbtn{
          top: 16px;
          .el-dialog__close{
              font-size: 20px;
              color: #32485F;
          }
      }
    }
  .el-textarea.is-disabled .el-textarea__inner{
        color:#233241;
    }
  .fl{
    float: left;
  }

  .mt20{
    margin-bottom: 20px;
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    margin-bottom: 10px;
  }
  .el-form-item--mini .el-form-item__content, .el-form-item--mini .el-form-item__label{
    line-height: 32px;
  }
  .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
    width: 330px;
    line-height: 32px;
    height: 32px;
  }
  .el-range-editor--mini.el-input__inner{
    height: 32px;
    font-size: 14px;
  }
  .el-range-editor--mini .el-range-input{
    font-size: 14px;
  }
  .el-input--mini .el-input__inner{
    height: 32px;
    line-height: 32px;
    font-size: 14px;
  }
  .el-pagination{
     text-align: right;
  }

  .adjustbox{
    box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
  }

  .adjust-form {
    margin-bottom: 10px;
    background-color: #fff;
    border-radius:2px;
    box-sizing: border-box;
  }

  .contract-list {
      background-color: #fff;
      padding: 10px 12px 0;
    .form-title-fl{
      font-size: 14px;
      color: #233241;
      padding: 6px 0;

      .mr8{
        margin-right: 8px;
      }
    }
    .el-table{
      th{
        background-color: #EEF2FB;
        &:first-child{
          /*padding-left: 20px;*/
        }
      }
      tr{
        td{
          &:first-child{
            /*padding-left: 20px;*/
          }
        }
      }

    }
  }

  .blue{
    color: @color-blue;
  }
  .yellow{
    color: @color-yellow;
  }
  .green{
    color: @color-green;
  }
  .red{
    color: @color-warning;
  }
  .btn{
    color: @color-blue;
    cursor: pointer;
  }

  .width250{
    width: 250px;
  }
  .width200{
    width: 200px;
  }
  .width150{
    width: 150px;
  }
  .mb20{
    margin-bottom: 20px;
  }
  .width100{
    width: 100px;
  }
  .mr100{
    margin-right: 100px;
  }
  .curPointer{
    cursor: pointer;
    &:hover{
      text-decoration: underline;
    }
  }
  .curPointer2{
    cursor: pointer;
    color: @color-warning;
    font-size: 12px;
    &:hover{
      text-decoration: underline;
    }
  }
  // 调佣审核弹层样式
  .layer-audit{
    .el-dialog{
      margin: 80px auto 60px !important;
      margin-top: 0vh;
    }
    .el-dialog__header{
      border-bottom: 1px solid #EDECF0;
      padding: 16px 20px 15px;
      span{
          color: #233241;
          font-size: 20px;


      }
      .el-dialog__headerbtn{
          top: 16px;
          .el-dialog__close{
              font-size: 24px;
              color: #32485F;
          }
      }
    }
    .el-dialog__body{
          padding: 0;
      }
  }
  .audit-box{
    padding: 0 20px 0px 20px;
    overflow-y: auto;
    .audit-col{
      padding: 20px 0;
      .col-li{
        overflow: hidden;
        clear: left;
        margin-bottom: 18px;
        p{
          float: left;
          &:first-child{
            width: 250px;
            color: #6C7986;
            span{
              color: #233241;
              &.blue{
                color: #478DE3;
              }
            }
          }
        }
      }
      .textareabox{
        display: flex;
        align-items: flex-start;
        span{
          width: 80px;
          em{
            color:#FF3E3E;
            margin-right: 3px;
          }
        }
      }
      .table{
        width: 100%;
        border-collapse:collapse;
        border-spacing:1;
        border-top: 1px solid #E8EAF6;
        border-left: 1px solid #E8EAF6;
        text-align: center;
        .el-input__inner{
          height: 28px;
          line-height: 28px;
          padding: 0;
          text-align: center;
        }
        .el-input__icon{
          line-height: 28px;
        }
        .el-input__suffix{
          right: 0px;
        }
        tr th{
          background-color:#F2F3F8;
          border-right: 1px solid #E8EAF6;
          border-bottom: 1px solid #E8EAF6;
          line-height: 40px;
          height: 40px;
        }
        tr td{
          overflow: hidden;
          padding: 14px 10px;
          border-right: 1px solid #E8EAF6;
          border-bottom: 1px solid #E8EAF6;
          &.flex{
            display: flex;
            align-items: center;
            justify-content: center;

          }
          .width70{
            width: 72px;
            height: 28px;
            line-height: 28px;
            margin-right: 3px;

          }
          .mr10{
            margin-right: 10px;
            .el-input__inner{
              text-align: left;
              padding-left: 10px;
            }
          }
          .fl{
            float: left;
          }
        }
      }
      .table2{
        tr td{
          padding: 12px 0;
        }
      }
      .uploadfile{
        margin: 40px 0 0;
        display: flex;
        .uploadtitle{
          color: #6C7986;
          width: 78px;
          span{
            margin-left: 16px;
            color: #8E8E8E;
            b{
              color: #6C7986;
            }
          }
        }
        .ulData{

            width: 100%;
            overflow: hidden;
            li{
                margin-right: 20px;
                margin-bottom: 20px;
                position: relative;
                float: left;
                &:nth-child(5n){
                  margin-right: 0;
                }
                > i{
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    color: #F56C6C;
                    font-size: 20px;
                    cursor: pointer;
                }
            }
        }

        .namePath{
            display: inline-block;
            text-align: center;
            width: 120px;
            height: 120px;
            padding-top: 20px;
            box-sizing: border-box;
            border-radius:4px;
            background: #F2F3F8;
            > p{
              padding-top: 5px;
              display: inline-block;
              width: 100px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
        }

      }

    }
    .bordernone{
      border-bottom: none;
    }
  }
  .textareabox2{
    display: flex;
    align-items: flex-start;
    margin-bottom: 30px;
    span{
      width: 76px;
    }
  }
  .btnbox{
    display: flex;
    justify-content: flex-end;
    padding: 15px 20px 15px 0;
    border-top: 1px solid #EDECF0;
    .el-button{
      width: 100px;
      height: 38px;
      border-radius: 18px;
      padding: 0;
      &.refuse{
        background-color: #EAEFF5;
      }
      &.recept{
        background-color: #54D384;
        border-color: #54D384;
      }

    }
  }
  .name-wrapper {
    min-width: 80px;
    max-height: 65px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: normal;
    word-break: break-all;
    word-wrap:break-word;
  }

  .isFlex{
    display: flex;
    align-items: center;
  }
  
  .radiodiv{
    overflow: hidden;
    .innerdiv{
      overflow: hidden;
      p{
        margin-bottom: 12px;
        clear: both;
        // display: flex;
        // align-items: top;
        span.blue{
          // display:block;
          display: inline-block;
          width: 278px;
          white-space: normal;
          vertical-align: top;
          // word-wrap: break-word;
          // word-break: break-all;
        }
        span.blue:nth-child(1){
          width: 230px;
          margin-right: 30px;
        
        }
        
      }
      
    }
    > .is-checked{
      .el-radio__label{
        p span.blue{
          color:#409EFF;
        }
      }
    }
  }


}





</style>
