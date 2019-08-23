<template>
  <div class="view" ref="tableComView">
    <ScreeningTop @propResetFormFn="reset" @propQueryFn="getData('search')">
      <div class="content">
        <div class="input-group">
          <label>关键字:</label>
          <el-tooltip :content="activeView===1?'合同编号/房源编号/客源编号/物业地址/业主/客户/手机号/收款ID':'合同编号/房源编号/客源编号/物业地址/业主/客户/手机号/付款ID'" placement="top">
            <el-input class="w200" :clearable="true" size="small" v-model="searchForm.keyword" placeholder="请输入"></el-input>
          </el-tooltip>
        </div>
        <div class="input-group">
          <label>合同类型:</label>
          <el-select :clearable="true" size="small" class="width200" :class="{'width325':searchForm.contType.length>3}" multiple v-model="searchForm.contType" placeholder="请选择">
            <el-option
              v-for="item in dictionary['10']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>查询时间:</label>
          <div class="time-picker">
            <el-select :clearable="true" size="small" v-model="searchForm.timeType" placeholder="请选择">
              <el-option
                v-if="(activeView===1&&item.value!==3)||(activeView===2&&item.value===3)"
                v-for="item in $tool.dropdown.dateType_money"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker
              v-model="searchForm.timeRange"
              type="daterange"
              size="small"
              class="margin-left"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div class="input-group">
          <label>部门:</label>
          <div><select-tree :data="DepList" :init="searchForm.depName" @checkCell="depHandleClick" @clear="clearDep" @search="searchDep"></select-tree></div>
          <!--<el-select class="w200" :clearable="true" ref="tree" size="small" :loading="Loading" :remote-method="remoteMethod" @visible-change="initDepList" @clear="clearDep" v-model="searchForm.depName" placeholder="请选择">
            <el-option class="drop-tree" value="">
              <el-tree :data="DepList" :props="defaultProps" @node-click="depHandleClick"></el-tree>
            </el-option>
          </el-select>-->
          <el-select :clearable="true" v-loadmore="moreEmploye" class="margin-left" size="small" @change="handleEmpNodeClick" v-model="searchForm.empId" placeholder="请选择">
            <el-option
              v-for="item in EmployeList"
              :key="item.empId"
              :label="item.name"
              :value="item.empId">
            </el-option>
          </el-select>
        </div>
        <div class="input-group" v-if="activeView===1">
          <label>票据状态:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.billStatus" placeholder="请选择">
            <el-option
              v-for="item in dictionary['56']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group" v-if="activeView===1">
          <label>收款账户:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.proAccount" placeholder="请选择">
            <el-option
              v-for="item in dictionary['32']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收付状态:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.checkStatus" placeholder="请选择">
            <el-option
              v-for="item in dictionary[activeView===1?'61':'62']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收付款类:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.moneyType" placeholder="请选择">
            <el-option
              v-for="item in drop_MoneyType"
              :key="item.id"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收付方式:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.payMethod" placeholder="请选择">
            <el-option
              v-for="item in dictionary[activeView===1?'59':'60']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收付对象:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.payObjType" placeholder="请选择">
            <el-option
              v-for="item in dictionary['57']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>合作方式:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.cooperation" placeholder="请选择">
            <el-option
              v-for="item in dictionary['53']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
      </div>
    </ScreeningTop>
    <div class="view-context" :class="[((activeView===1&&power['sign-cw-rev-export'].state)||(activeView===2&&power['sign-cw-pay-export'].state))?'':'other']">
      <div class="table-tool" v-if="(activeView===1&&power['sign-cw-rev-export'].state)||(activeView===2&&power['sign-cw-pay-export'].state)">
        <h4 class="f14"><i class="iconfont icon-tubiao-11"></i>数据列表</h4>
        <p>
          <el-button class="btn-info" round size="small" type="primary" @click="getExcel" v-if="(activeView===1&&power['sign-cw-rev-export'].state)||(activeView===2&&power['sign-cw-pay-export'].state)">导出</el-button>
        </p>
      </div>
      <el-table class="info-scrollbar" ref="tableCom" :max-height="tableNumberCom" border :data="list" :key="activeView" header-row-class-name="theader-bg" style="width: 100%;max-height:500px;" @row-dblclick="toDetails">
        <el-table-column align="center" min-width="120" :label="getView" prop="payCode"
                         :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="合同信息" min-width="200px" prop="cityName" :formatter="nullFormatter">
          <template slot-scope="scope">
            <ul class="contract-msglist">
              <li>合同:<span @click="toLink(scope.row,'cont')">{{scope.row.contCode}}</span></li>
              <li>房源:<span>{{scope.row.houseCode}}</span><span>{{scope.row.houseOwner}}</span></li>
              <li>客源:<span>{{scope.row.custCode}}</span><span>{{scope.row.custName}}</span></li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="120" label="物业地址" prop="address"
                         :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" min-width="60" label="合同类型" prop="contType" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" min-width="60" label="款类" prop="moneyType" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" min-width="80" label="收付方式">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.method" :key="index">{{item}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="60" label="对象">
          <template slot-scope="scope">
            <span>{{scope.row.type===1?scope.row.outObjType:scope.row.inObjType|getLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="activeView===1?'收款人':'付款人'" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.type===1?scope.row.inObjStore:scope.row.store}}</span>
            <p>{{scope.row.type===1?scope.row.inObjName:scope.row.createByName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="当前审核人" min-width="120">
          <template slot-scope="scope">
            <p v-if="!scope.row.auditStore&&!scope.row.auditName">-</p>
            <template v-else>
              <span>{{scope.row.auditStore}}</span>
              <p>{{scope.row.auditName}}</p>
            </template>
            <p class="btn-text-info" type="text" v-if="getUser.user&&(getUser.user.empId===scope.row.preAuditId||getUser.user.empId===scope.row.auditBy)&&scope.row.checkStatus&&scope.row.checkStatus.value===0" @click="choseCheckPerson(scope.row,getUser.user.empId===scope.row.auditBy?2:1)">{{getUser.user.empId===scope.row.auditBy?'转交审核人':'设置审核人'}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下一步审核人" min-width="120">
          <template slot-scope="scope">
            <p v-if="!scope.row.nextAuditStore&&!scope.row.nextAuditName">-</p>
            <template v-else>
              <span>{{scope.row.nextAuditStore}}</span>

              <p>{{scope.row.nextAuditName}}</p>
            </template>
            <p class="btn-text-info color-red" type="text" v-if="getUser.user&&(scope.row.nextAuditId!==0&&getUser.user.empId===scope.row.auditBy)&&scope.row.checkStatus&&scope.row.checkStatus.value===0" @click="choseCheckPerson(scope.row,3)">设置审核人</p>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="90" label="金额（元）" prop="amount" :formatter="nullFormatter"></el-table-column>
        <!--<el-table-column align="center" label="刷卡手续费" prop="fee" :formatter="nullFormatter"></el-table-column>-->
        <el-table-column align="center" :label="activeView===1?'收款时间':'付款时间'" prop="createTime" :formatter="nullFormatter" min-width="90">
          <template slot-scope="scope">
            <span>{{scope.row.createTime|formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="入账时间" prop="toAccountTime" :formatter="nullFormatter" v-if="activeView===1" min-width="90">
          <template slot-scope="scope">
            <span>{{scope.row.toAccountTime|formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="80" label="状态" prop="payStatus">
          <template slot-scope="scope">
            <span v-if="scope.row.payStatusValue!==10">{{scope.row.payStatus}}</span>
            <span class="text-warning" v-else @click="getErrorMsg(scope.row)">{{scope.row.payStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="80" label="结算信息" v-if="activeView===1">
          <template slot-scope="scope">
            <span>{{scope.row.moneyType}}{{scope.row.amount}}元</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="80" label="票据状态" prop="billStatus.label" v-if="activeView===1"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" min-width="120">
          <template slot-scope="scope">
            <template v-if="scope.row.auditButton||(((activeView===1&&scope.row.billStatus&&scope.row.billStatus.value===1)||activeView===2)&&scope.row.isDel===1&&(scope.row.caozuo===1||scope.row.caozuo===2)&&power[activeView===1?'sign-cw-rev-void':'sign-cw-pay-void'].state)">
              <el-button type="text" @click="cellOpera(scope.row)" v-if="scope.row.auditButton">审核</el-button>
              <el-button type="text" @click="cellOpera(scope.row,'del')" v-if="((activeView===1&&scope.row.billStatus&&scope.row.billStatus.value===1)||activeView===2)&&scope.row.isDel===1&&(scope.row.caozuo===1||scope.row.caozuo===2)&&power[activeView===1?'sign-cw-rev-void':'sign-cw-pay-void'].state">作废</el-button>
            </template>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="list.length>0"
        class="pagination-info"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!--<scrollBar :table="tableBox" v-if="tableBox">
        <el-pagination
          v-if="list.length>0"
          class="pagination-info"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </scrollBar>-->
    </div>
    <!--作废dialog-->
    <el-dialog
      title="作废"
      :visible.sync="layer.show"
      :closeOnClickModal="$tool.closeOnClickModal"
      width="740px">
      <div class="delete-dialog" v-if="layer.content.length>0">
        <p>是否作废该{{activeView===1?'收款单':'付款单'}}</p>
        <el-table border :data="layer.content" style="width: 100%" header-row-class-name="theader-bg" key="other">
          <el-table-column align="center" min-width="120" label="收付编号" prop="payCode" :formatter="nullFormatter"></el-table-column>
          <el-table-column align="center" :label="activeView===1?'收款金额':'付款金额'" prop="cityName" :formatter="nullFormatter">
            <template slot-scope="scope">
              <span>{{scope.row.amount}}元</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="activeView===1?'付款方':'收款方'" prop="cityName" :formatter="nullFormatter">
            <template slot-scope="scope">
              <span>{{scope.row.type===1?scope.row.outObjType.label:scope.row.inObjType.label}}{{scope.row.type===1?scope.row.outObjName?`-${scope.row.outObjName}`:'':scope.row.inObjName?`-${scope.row.inObjName}`:''}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button size="small" class="btn-info" round @click="layer.show = false">返 回</el-button>
    <el-button size="small" class="btn-info" round type="primary" @click="deleteBill" v-loading.fullscreen.lock="getLoading">确 定</el-button>
  </span>
    </el-dialog>
    <checkPerson :show="checkPerson.state" :type="checkPerson.type" page="list" :showLabel="checkPerson.label" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @submit="personChose" @close="checkPerson.state=false" v-if="checkPerson.state"></checkPerson>
  </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";
  import {MIXINS} from "@/assets/js/mixins";
  import {UPLOAD} from "@/assets/js/uploadMixins";
  import checkPerson from '@/components/checkPerson'

  export default {
    mixins: [FILTER, MIXINS,UPLOAD],
    components:{
      checkPerson
    },
    data() {
      return {
        activeView: '',
        tableBox: null,
        checkPerson: {
          state:false,
          type:'init',
          code:'',
          flowType:0,
          label:false,
          current:false
        },
        searchForm: {
          contType: [],
          timeType: '',
          depName:'',
          deptId: '',
          empId: '',
          billStatus: '',
          proAccount: '',
          checkStatus: '',
          moneyType: '',
          payMethod: '',
          keyword: '',
          timeRange:'',
          payObjType:'',
          cooperation:''
        },
        list: [],
        dictionary: {
          '10': '',
          '56': '',
          '32': '',
          '23': '',
          '24': '',
          '25': '',
          '507': '',
          '57': '',
          '59': '',
          '60': '',
          '61': '',
          '62': '',
          '53': ''
        },
        drop_MoneyType:[],
        //分页
        total:0,
        currentPage:1,
        pageSize:10,
        //作废
        layer:{
          show:false,
          content:[]
        },
        //权限配置
        power: {
          'sign-cw-rev-query': {
            state: false,
            name: '查询'
          },
          'sign-cw-rev-export': {
            state: false,
            name: '导出'
          },
          'sign-cw-rev-void': {
            state: false,
            name: '作废'
          },
          'sign-cw-pay-query':{
            state: false,
            name: '查询'
          },
          'sign-cw-pay-export': {
            state: false,
            name: '导出'
          },
          'sign-cw-pay-void': {
            state: false,
            name: '作废'
          },
          'sign-cw-debt-invoice': {
            state: false,
            name: '开票'
          },
          'sign-cw-bill-print':{
            state: false,
            name: '打印'
          },
          'sign-cw-debt-pay': {
            state: false,
            name: '付款详情'
          },
          'sign-cw-debt-rev': {
            state: false,
            name: '收款详情'
          },
          'sign-com-htdetail': {
            state: false,
            name: '合同详情'
          },
          'sign-com-house': {
            state: false,
            name: '房源详情'
          },
          'sign-com-cust': {
            state: false,
            name: '客源详情'
          }
        }
      }
    },
    created() {
      this.activeView = parseInt(this.$route.query.type)

      for (let item in this.power){
        // this.power[item].state=true
        if(this.getUser){
          if(this.getUser.privileges.indexOf(item)>-1){
            this.power[item].state=true
          }
        }
      }

      let res=this.getDataList
      if(res&&(res.route===this.$route.fullPath)){
        this.list = res.data.page.list
        this.total = res.data.page.total
        // this.tableTotal = Object.assign({}, res.data.payMentDataList, res.data.paymentDataList, {balance: res.data.balance})
        let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
        this.searchForm = Object.assign({},this.searchForm,session.query,{contType:session.query.contTypes.length>0?session.query.contTypes.split(','):[]})

        this.searchForm.contType = this.searchForm.contType.map(item=>{
          return Number(item)
        })
        if(session.query.startTime){
          this.searchForm.timeRange=[session.query.startTime,session.query.endTime]
          delete this.searchForm.startTime
          delete this.searchForm.endTime
        }
        if(this.searchForm.empId){
          this.dep=Object.assign({},this.dep,{id:this.searchForm.deptId,empId:this.searchForm.empId,empName:this.searchForm.empName})
          this.EmployeList.unshift({
            empId:this.searchForm.empId,
            name:this.searchForm.empName
          })
          this.getEmploye(this.searchForm.deptId)
        }
        this.currentPage=this.searchForm.pageNum
      }else{
        this.getData()
      }
      // this.remoteMethod()
      this.getDictionary()
      this.getMoneyTypes()
    },
    beforeRouteUpdate(to, from, next) {
      this.list = []
      this.activeView = parseInt(to.query.type)
      this.$tool.clearForm(this.searchForm)   //初始化筛选查询
      this.clearDep()
      this.currentPage=1

      for (let item in this.power){
        // this.power[item].state=true
        if(this.getUser){
          if(this.getUser.privileges.indexOf(item)>-1){
            this.power[item].state=true
          }
        }
      }

      let res=this.getDataList
      if(res&&(res.route===to.fullPath)){
        this.list = res.data.page.list
        this.total = res.data.page.total
        // this.tableTotal = Object.assign({}, res.data.payMentDataList, res.data.paymentDataList, {balance: res.data.balance})
        let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
        this.searchForm = Object.assign({},this.searchForm,session.query,{contType:session.query.contTypes.length>0?session.query.contTypes.split(','):[]})

        this.searchForm.contType = this.searchForm.contType.map(item=>{
          return Number(item)
        })
        if(session.query.startTime){
          this.searchForm.timeRange=[session.query.startTime,session.query.endTime]
          delete this.searchForm.startTime
          delete this.searchForm.endTime
        }
        if(this.searchForm.empId){
          this.dep=Object.assign({},this.dep,{id:this.searchForm.deptId,empId:this.searchForm.empId,empName:this.searchForm.empName})
          this.EmployeList.unshift({
            empId:this.searchForm.empId,
            name:this.searchForm.empName
          })
          this.getEmploye(this.searchForm.deptId)
        }
        this.currentPage=this.searchForm.pageNum
      }else{
        this.getData()
      }
      this.getDictionary()
      next()
    },
    mounted(){
      /*this.$nextTick(()=>{
        this.tableBox=this.$refs.dataList
      })*/
    },
    methods: {
      getExcel:function () {
        this.getData('search')
        let param = Object.assign({},this.searchForm)
        if(Object.prototype.toString.call(param.timeRange)==='[object Array]'&&param.timeRange.length>0){
          param.startTime = param.timeRange[0]
          param.endTime = param.timeRange[1]
        }
        delete param.timeRange
        this.excelCreate(this.activeView===1?'/input/proceedsAuditExcel':'/input/payMentAuditExcel',param)
      },
      // 选择审核人
      choseCheckPerson:function (row,type) {
        this.checkPerson.flowType=this.activeView===1?1:0
        this.checkPerson.code=row.payCode
        this.checkPerson.state=true
        this.checkPerson.type=type
        if(row.nextAuditId===-1){
          this.checkPerson.label=true
        }else {
          this.checkPerson.label=false
        }
      },
      /**
       * 获取付款失败信息
       */
      getErrorMsg:function (data) {
        this.$ajax.get('/api/payInfo/selectRetMsg',{payId:data.id}).then(res=>{
          res=res.data
          if(res.status===200){
            this.$message({
              message:`付款失败：${res.data.msg}`
            })
          }
        }).catch(error=>{
          this.$message({
            message:error,
            type:'warning'
          })
        })
      },
      /**
       * 列表横行滚动
       */
      scroll:function () {
        // debugger
        let box=this.$refs.dataList.$refs.bodyWrapper
        console.log(box.clientWidth,box.scrollWidth)
        box.scrollTo(box.scrollLeft+30,0)
        console.log(box.scrollLeft)
      },
      reset:function () {
        this.$tool.clearForm(this.searchForm)
        this.EmployeList = []
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getData('pagination')
      },
      initDepList:function (val) {
        if(!val){
          this.remoteMethod()
        }
      },
      clearDep:function () {
        this.searchForm.deptId=''
        this.searchForm.depName=''
        // this.EmployeList=[]
        this.searchForm.empId=''
        this.clearSelect()
      },
      searchDep:function (payload) {
        /*this.DepList=payload.list
        this.searchForm.depName=payload.depName*/
        this.searchForm.empId=''
        this.clearSelect('emp')
      },
      depHandleClick(data) {
        this.searchForm.deptId=data.depId
        this.searchForm.depName=data.name
        this.searchForm.empId=''
        this.handleNodeClick(data)
      },
      getData: function (type='init') {
        if(type==='search'){
          this.currentPage=1
        }
        let param = JSON.parse(JSON.stringify(this.searchForm))
        if(typeof param.timeRange==='object'&&Object.prototype.toString.call(param.timeRange)==='[object Array]'){
          param.startTime = param.timeRange[0]
          param.endTime = param.timeRange[1]
        }
        param.contTypes = param.contType.join(',')
        param.pageNum = this.currentPage
        param.pageSize = this.pageSize
        delete param.contType
        delete param.timeRange

        //点击查询时，缓存筛选条件
        if(type==='search'||type==='pagination'){
          sessionStorage.setItem('sessionQuery',JSON.stringify({
            path:this.$route.fullPath,
            url:this.activeView===1?'/payInfo/proceedsAuditList':'/payInfo/payMentAuditList',
            query:Object.assign({},param,{empName:this.dep.empName})
          }))
        }

        let url = this.activeView===1?'/payInfo/proceedsAuditList':'/payInfo/payMentAuditList'
        this.$ajax.get(`/api${url}`,param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.list = res.data.page.list
            this.total = res.data.page.total
          }
        }).catch(error => {
          console.log(error)
        })
      },
      toDetails:function (item) {
        let powerMsg=this.power[this.activeView===1?'sign-cw-debt-rev':'sign-cw-debt-pay'].state
        if(!powerMsg){
          let that=this
          this.$message({
            message:`${that.activeView===1?'无收款详情查看权限':'无付款详情查看权限'}`
          })
          return
        }
        let param = {
          path: 'billDetails'
        }
        if (this.activeView === 1) {
          param.query = {
            tab: '收款信息',
            id:item.id,
            type:item.inAccountType,
            power:this.getUser.user.empId===item.auditBy,
            print:this.power['sign-cw-bill-print'].state,
            bill: this.power['sign-cw-debt-invoice'].state
          }
          this.setPath(this.getPath.concat({name:'收款详情'}))
        } else {
          param.query = {
            tab: '付款信息',
            id:item.id,
            power:this.getUser.user.empId===item.auditBy,
            print:this.power['sign-cw-bill-print'].state,
            bill: this.power['sign-cw-debt-invoice'].state
          }
          this.setPath(this.getPath.concat({name:'付款详情'}))
        }
        this.$router.push(param)
      },
      //操作
      cellOpera: function (item,type='check') {
        if(type==='check'){
          this.toDetails(item)
        }else {
          this.layer.show=true
          this.layer.content=[].concat(item)
        }
      },
      /**
       * 合同信息操作
       * @param type
       */
      toLink:function (row,type) {
        let param={
          contType:row.contTypeId,
          contId:row.contId,
          contCode:row.contCode,
          operaType:type,
          power:type==='cont'?this.power['sign-com-htdetail']:type==='house'?this.power['sign-com-house']:type==='customer'?this.power['sign-com-cust']:''
        }
        this.msgOpera(param)
      },
      /*msgOpera:function (row,type) {
        this.setPath(this.$tool.getRouter(['合同','合同列表','合同详情'],'contractList'))
        if(type==='cont'){
          this.$router.push({
            path:row.contTypeId===this.$tool.contType['4']||row.contTypeId===this.$tool.contType['5']?'detailIntention':'contractDetails',
            query:{
              contType:row.contTypeId,
              id:row.contId,
              code:row.contCode
            }
          })
        }
      },*/
      //作废
      deleteBill:function () {
        let src = this.activeView===1?'/payInfo/updateProceedsIsDel':'/payInfo/updatePaymentIsDel'
        this.setLoading(true)
        this.$ajax.put(`/api${src}`,{payId:this.layer.content[0].id},2).then(res=>{
          res=res.data
          if(res.status===200){
            this.setLoading(false)
            this.getData()
            this.layer.show=false
            this.$message({
              message:'作废成功'
            })
          }
        }).catch(error=>{
          this.setLoading(false)
          this.$message({
            message:error
          })
        })
      },
      // 获取收付款类
      getMoneyTypes:function () {
        this.$ajax.get('/api/payInfo/selectSmallMoneyType').then(res=>{
          res=res.data
          if(res.status===200){
            this.drop_MoneyType=res.data
          }
        })
      },
      personChose:function () {
        this.checkPerson.state=false
        /*this.$message({
          message:`成功${this.checkPerson.type==='set'?'设置审核人':'转交审核人'}`
        })*/
        this.getData()
      }
    },
    computed: {
      getView: function () {
        if (this.activeView === 1) {
          return '收款ID'
        } else {
          return '付款ID'
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  .width200{
    width: 200px !important;
  }
  .width325{
    width: 325px !important;
  }
  /deep/ .theader-bg{
    >th>.cell{
      white-space: normal !important;
    }
  }
  .text-warning{
    color: red;
    cursor: pointer;
  }
  .btn-text-info{
    padding: 0;
    color: @color-blue;
    cursor: pointer;
    &.color-red{
      color: red;
    }
  }
  .delete-dialog{
    >p{
      text-align: center;
      margin-bottom: @margin-10;
      font-size: @size-16;
    }
  }

  .contract-msglist {
    > li {
      text-align: left;
      >span{
        &:first-of-type {
          margin-right: 10px;
        }
      }
      &:first-of-type{
        > span {
          &:first-of-type {
            color: @color-blue;
            margin-right: 10px;
            cursor: pointer;
          }
        }
      }
    }
  }

  .view-header {
    .title {
      position: relative;
      height: 60px;
      display: flex;
      align-items: center;
      > p {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      .input-group {
        margin-right: 10px;
        > label {
          text-align: center;
        }
        /*/deep/ .el-select, .el-input {
          flex: 1;
        }*/
      }
    }
  }

  .view-context {
    background-color: @color-white;
    padding: 0 @margin-10;
    &.other{
      padding-top: @margin-10;
    }
    /deep/ .theader-bg {
      > th {
        background-color: @bg-th;
      }
    }
  }
  .table-tool{
    /*height: 60px;*/
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: @margin-base 0;
    >h4{
      >i{
        margin-right: 8px;
      }
    }
    /*>p{
      position: absolute;
      top: 50%;
      right: 0;
      transform:translateY(-50%);
    }*/
  }
</style>
