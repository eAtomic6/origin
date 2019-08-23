<template>
  <div class="view" ref="tableComView">
    <!--<preview></preview>-->
    <ScreeningTop @propResetFormFn="reset" @propQueryFn="getData('search')">
      <div class="content">
        <div class="input-group">
          <label>关键字:</label>
          <el-tooltip content="合同编号/房源编号/客源编号/物业地址/业主/客户/手机号" placement="top">
            <el-input class="w200" :clearable="true" size="small" v-model="searchForm.keyword" placeholder="请输入"></el-input>
          </el-tooltip>
        </div>
        <!--<div class="input-group">
          <label>收付款类:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.moneyType" placeholder="请选择">
            <el-option
              v-for="item in drop_MoneyType"
              :key="item.id"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </div>-->
        <div class="input-group">
          <label>收款状态:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.receiveAmountState" placeholder="请选择">
            <el-option
              v-for="item in dictionary['55']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>部门:</label>
          <div><select-tree :data="DepList" :init="searchForm.dealAgentStoreName" @checkCell="depHandleClick" @clear="clearDep" @search="searchDep"></select-tree></div>
          <!--<el-select class="w200" :clearable="true" ref="tree" size="small" :loading="Loading" :remote-method="remoteMethod" @visible-change="initDepList" @clear="clearDep" v-model="searchForm.dealAgentStoreName" placeholder="请选择">
            <el-option class="drop-tree" value="">
              <el-tree :data="DepList" :props="defaultProps" @node-click="depHandleClick"></el-tree>
            </el-option>
          </el-select>-->
          <el-select :clearable="true" v-loadmore="moreEmploye" size="small" class="margin-left" @change="handleEmpNodeClick" v-model="searchForm.dealAgentId" placeholder="请选择">
            <el-option
              v-for="item in EmployeList"
              :key="item.empId"
              :label="item.name"
              :value="item.empId">
            </el-option>
          </el-select>
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
          <label>签约时间:</label>
          <div class="time-picker">
            <el-date-picker
              v-model="searchForm.signTime"
              type="daterange"
              size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div class="input-group">
          <label>收款时间:</label>
          <div class="time-picker">
            <el-date-picker
              v-model="searchForm.collectionTime"
              type="daterange"
              size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
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
    <div class="view-context" :class="[power['sign-cw-rec-export'].state?'':'other']">
      <div class="table-tool" v-if="power['sign-cw-rec-export'].state">
        <h4 class="f14"><i class="iconfont icon-tubiao-11"></i>数据列表</h4>
        <p>
          <el-button class="btn-info" round size="small" type="primary" v-if="power['sign-cw-rec-export'].state" @click="getExcel">导出</el-button>
        </p>
      </div>
      <el-table ref="tableCom" :max-height="tableNumberCom" :class="[showScroll?'info-scrollbar':'']" border :data="list" style="width: 100%" header-row-class-name="theader-bg">
        <el-table-column min-width="200" align="center" label="合同信息" prop="cityName" :formatter="nullFormatter">
          <template slot-scope="scope">
            <ul class="contract-msglist">
              <li>合同:<span class="span-cursor" @click="toLink(scope.row,'cont')">{{scope.row.code}}</span></li>
              <li>房源:<span>{{scope.row.houseinfoCode}}</span><span>{{scope.row.showOwnerName}}</span></li>
              <li>客源:<span>{{scope.row.guestinfoCode}}</span><span>{{scope.row.showCustName}}</span></li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column align="center" label="合同类型" prop="contType" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="款类" prop="collectionType">
          <template slot-scope="scope">
            佣金
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="160" label="物业地址" prop="propertyAddr">
          <!--<template slot-scope="scope">
            &#45;&#45;
          </template>-->
        </el-table-column>
        <el-table-column align="center" min-width="160" label="成交经纪人" prop="broker">
          <template slot-scope="scope">
            {{scope.row.dealAgentStoreName}}
            <p>{{scope.row.dealAgentName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="应收款（元）" prop="receivableCommission" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="已收款（元）" prop="receivedCommission" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="待收款（元）" prop="waitingForPay" :formatter="nullFormatter">
          <!--<template slot-scope="scope">
            {{scope.row.receivableCommission-scope.row.receivedCommission|moneyFormatter}}
          </template>-->
        </el-table-column>
        <el-table-column align="center" min-width="160" label="签约时间" prop="operation time">
          <template slot-scope="scope">
            {{scope.row.signTime|formatDate}}
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="160" label="收款时间" prop="operation time">
          <template slot-scope="scope">
            {{scope.row.lastCollectCommissionTime|formatTime}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款状态" prop="receiveAmountState" :formatter="nullFormatter">
          <template slot-scope="scope">
            {{scope.row.receivableCommission-scope.row.receivedCommission>0?scope.row.receivableCommission-scope.row.receivedCommission===scope.row.receivableCommission?'未收':'部分':'收齐'}}
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
    </div>
  </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";
  import {MIXINS} from "@/assets/js/mixins";

  export default {
    name: "actual-harvest",
    mixins: [MIXINS,FILTER],
    data() {
      return {
        tableBox:null,
        showScroll:false,
        dictionary:{
          '10': '',
          '55': '',
          '53': ''
        },
        drop_MoneyType:[],
        searchForm: {
          moneyType: '',
          contType: [],
          dealAgentStoreName:'',
          dealAgentStoreId: '',
          dealAgentId: '',
          receiveAmountState:'',
          signTime: '',
          collectionTime: '',
          cooperation: '',
          keyword: ''
        },
        list: [],
        //分页
        pageSize:10,
        currentPage:1,
        total:0,
        //权限配置
        power: {
          'sign-cw-rec-query': {
            state: false,
            name: '查询'
          },
          'sign-cw-rec-export': {
            state: false,
            name: '导出'
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
    mounted() {
      this.$nextTick(()=>{
        let res=this.getDataList
        if(res&&(res.route===this.$route.path)){
          this.list = res.data.list
          this.total = res.data.total
          let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
          this.searchForm = Object.assign({},this.searchForm,session.query,{contType:session.query.contTypes.length>0?session.query.contTypes.split(','):[]},{signTime:session.query.beginDate&&[session.query.beginDate,session.query.endDate]},{collectionTime:session.query.beginProDate&&[session.query.beginProDate,session.query.endProDate]})
          // this.$set(this.searchForm,'contType',session.query.contTypes.split(','))
          // this.$
          this.searchForm.contType = this.searchForm.contType.map(item=>{
            return Number(item)
          })

          delete this.searchForm.beginDate
          delete this.searchForm.endDate
          delete this.searchForm.beginProDate
          delete this.searchForm.endProDate
          if(this.searchForm.dealAgentId){
            this.dep=Object.assign({},this.dep,{id:this.searchForm.dealAgentStoreId,empId:this.searchForm.dealAgentId,empName:this.searchForm.dealAgentName})
            this.EmployeList.unshift({
              empId:this.searchForm.dealAgentId,
              name:this.searchForm.dealAgentName
            })
            this.getEmploye(this.searchForm.dealAgentStoreId)
          }
          this.currentPage=this.searchForm.pageNum
        }else{
          this.getData()
        }
        // this.remoteMethod()
        this.getDictionary()
        this.getMoneyTypes()
      })
    },
    methods: {
      getExcel:function () {
        this.getData('search')
        let param = Object.assign({},this.searchForm)
        if(Object.prototype.toString.call(param.signTime)==='[object Array]'&&param.signTime.length>0){
          param.beginDate = this.$tool.dateFormat(param.signTime[0])
          param.endDate = this.$tool.dateFormat(param.signTime[1])
          delete param.signTime
        }
        if(Object.prototype.toString.call(param.collectionTime)==='[object Array]'&&param.collectionTime.length>0){
          param.beginProDate = this.$tool.dateFormat(param.collectionTime[0])
          param.endProDate = this.$tool.dateFormat(param.collectionTime[1])
          delete param.collectionTime
        }
        this.excelCreate('/input/RceivablesExcel',param)
      },
      noScroll:function (payload) {
        this.showScroll=payload.state
      },
      reset:function () {
        this.$tool.clearForm(this.searchForm)
        this.EmployeList = []
      },
      handleSizeChange:function () {

      },
      handleCurrentChange:function (val) {
        this.currentPage = val
        this.getData('pagination')
      },
      initDepList:function (val) {
        if(!val){
          this.remoteMethod()
        }
      },
      clearDep:function () {
        this.searchForm.dealAgentStoreName=''
        this.searchForm.dealAgentStoreId=''
        // this.EmployeList=[]
        this.searchForm.dealAgentId=''
        this.clearSelect()
      },
      searchDep:function (payload) {
        /*this.DepList=payload.list
        this.searchForm.dealAgentStoreName=payload.depName*/
        this.searchForm.dealAgentId=''
        this.clearSelect('emp')
      },
      depHandleClick(data) {
        this.searchForm.dealAgentStoreId=data.depId
        this.searchForm.dealAgentStoreName=data.name
        this.searchForm.dealAgentId=''
        this.handleNodeClick(data)
      },
      toLink:function (row,type) {
        let param={
          contType:row.contType.value,
          contId:row.id,
          contCode:row.code,
          operaType:'cont',
          power:type==='cont'?this.power['sign-com-htdetail']:type==='house'?this.power['sign-com-house']:type==='customer'?this.power['sign-com-cust']:''
        }
        this.msgOpera(param)
      },
      getData: function (type='init') {
        // let param={}
        if(type==='search'){
          this.currentPage=1
        }
        let param=Object.assign({},this.searchForm)
        if(typeof param.signTime==='object'&&Object.prototype.toString.call(param.signTime)==='[object Array]'&&param.signTime.length>0){
          param.beginDate = this.$tool.dateFormat(param.signTime[0])
          param.endDate = this.$tool.dateFormat(param.signTime[1])
        }
        if(typeof param.collectionTime==='object'&&Object.prototype.toString.call(param.collectionTime)==='[object Array]'&&param.collectionTime.length>0){
          param.beginProDate = this.$tool.dateFormat(param.collectionTime[0])
          param.endProDate = this.$tool.dateFormat(param.collectionTime[1])
        }

        // delete param.moneyType
        param.contTypes = param.contType.join(',')
        param.pageNum=this.currentPage
        param.pageSize=this.pageSize
        delete param.signTime
        delete param.collectionTime
        delete param.contType

        //点击查询时，缓存筛选条件
        if(type==='search'||type==='pagination'){
          sessionStorage.setItem('sessionQuery',JSON.stringify({
            path:this.$route.path,
            url:'/payInfo/receivables',
            query:Object.assign({},param,{
              /*dealAgentStoreName:this.dep.name,
              dealAgentStoreId: this.dep.id,
              dealAgentId: this.dep.empId,*/
              dealAgentName:this.dep.empName
            }),
            methods:'put'
          }))
        }

        this.$ajax.put('/api/payInfo/receivables',param,1).then(res => {
          res = res.data
          if (res.status === 200) {
            this.list = res.data.list
            this.total = res.data.total
          }
        }).catch(error => {
          console.log(error)
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
    },
    filters:{
      moneyFormatter:function (val) {
        if(val>0){
          return val
        }else {
          return 0
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
  .contract-msglist{
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
  .view-context{
    background-color: @color-white;
    padding: 0 @margin-10;
    &.other{
      padding-top: @margin-10;
    }
    /deep/ .theader-bg{
      >th{
        background-color: @bg-th;
      }
    }
  }
  .table-tool{
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
