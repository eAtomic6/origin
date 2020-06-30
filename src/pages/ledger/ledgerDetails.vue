<template>
  <div class="view" ref="tableComView" v-if="power['sign-book-mx-query'].state||power['sign-book-hz-query'].state">
    <p class="view-title">记账本</p>
    <ul class="tabs">
      <li v-for="(item,index) in tabs" @click="changeTab(index)" :class="{'active-li':index===activeTab}" v-if="(index===0&&power['sign-book-mx-query'].state)||(index===1&&power['sign-book-hz-query'].state)">{{item}}</li>
    </ul>
    <template v-if="activeTab===0">
      <div class="content">
        <div class="search-content">
          <div class="input-group">
            <label>费用日期:</label>
            <div class="time-picker">
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
            <div class="margin-left">
              <select-tree :data="DepList" key="dep1" :init="searchForm.deptName" @checkCell="depHandleClick"
                           @clear="clearDep"></select-tree>
            </div>
          </div>
          <div class="input-group">
            <label>费用类型:</label>
            <el-select class="margin-left" :clearable="true" size="small" v-model="searchForm.moneyType" placeholder="请选择">
              <el-option
                v-for="item in dictionary['762']"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </div>
          <div class="input-group">
            <label>费用项:</label>
            <el-input class="w200 margin-left" :clearable="true" size="small" v-model="searchForm.moneyDepiction"
                      placeholder="请输入"></el-input>
          </div>
        </div>
        <p style="white-space: nowrap;">
          <el-button
            type="primary"
            size="small"
            class="btn-bg"
            @click="getData()">查 询
          </el-button>
          <el-button
            size="small"
            @click="reset">重 置
          </el-button>
        </p>
      </div>
      <div class="view-context" ref="box">
        <div class="table-tool">
          <ul>
            <li>
              选择（{{cells_del.length}}）
            </li>
            <li>
              收入<span>{{titleMsg.income}}</span>元
            </li>
            <li>
              支出<span>{{titleMsg.expenditure}}</span>元
            </li>
            <li>
              利润<span :style="{'color':titleMsg.profit>0?'#00CC99':titleMsg.profit===0?'#000000':'red'}"><i v-if="titleMsg.profit>0">+</i>{{titleMsg.profit}}</span>元
            </li>
          </ul>
          <p>
            <el-button class="btn-info" type="primary" size="small" @click="operBtn('del')" v-if="power['sign-book-mx-add'].state">批量删除
            </el-button>
            <el-button class="btn-info" type="primary" size="small" @click="getExcel" v-if="power['sign-book-mx-export'].state">导出
            </el-button>
            <el-button class="btn-info" type="primary" size="small" @click="operBtn('import')" v-if="power['sign-book-mx-insert'].state">导入固定成本
            </el-button>
            <el-button class="btn-info" type="primary" size="small" @click="operBtn('income')" v-if="power['sign-book-mx-add'].state">记收入
            </el-button>
            <el-dropdown split-button class="margin-left color-info" type="primary" size="small" @click="operBtn('pay')" @command="operBtn('pay1')" v-if="power['sign-book-mx-add'].state">
              记支出
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>记均摊支出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>
        </div>
        <el-table ref="tableCom" key="tab11" :max-height="tableNumberCom" border :data="list" header-row-class-name="theader-bg"
                  class="info-scrollbar" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" fixed="left" class-name="select-btn"></el-table-column>
          <el-table-column min-width="120" label="费用日期">
            <template slot-scope="scope">
              <span>{{scope.row.moneyTime|formatDate}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="160" label="部门">
            <template slot-scope="scope">
              <span>{{scope.row.deptName}}</span><span v-if="scope.row.groupName">-{{scope.row.groupName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="类别">
            <template slot-scope="scope">
              <span v-if="dictionary['762']&&dictionary['762'][`${scope.row.moneyType-1}`]">{{dictionary['762'][`${scope.row.moneyType-1}`].value}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="160" label="费用项">
            <template slot-scope="scope">
              <span v-if="scope.row.moneyDepiction&&scope.row.moneyDepiction.length<=20">{{scope.row.moneyDepiction}}</span>
              <span v-else-if="!scope.row.moneyDepiction">--</span>
              <el-tooltip v-else popper-class="tooltip-info" effect="dark" placement="top-start">
                <span>{{scope.row.moneyDepiction.substr(0,20)+'...'}}</span>
                <span slot="content">{{scope.row.moneyDepiction}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="金额（元）" prop="money"
                           :formatter="nullFormatter">
            <template slot-scope="scope">
              <span :style="{'color':scope.row.moneyType===1?'#00CC99':'red'}">{{scope.row.money}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="160" label="备注">
            <template slot-scope="scope">
              <span v-if="scope.row.remark&&scope.row.remark.length<=20">{{scope.row.remark}}</span>
              <span v-else-if="!scope.row.remark">--</span>
              <el-tooltip v-else popper-class="tooltip-info" effect="dark" placement="top-start">
                <span>{{scope.row.remark.substr(0,20)+'...'}}</span>
                <span slot="content">{{scope.row.remark}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="记账人" min-width="140">
            <template slot-scope="scope">
              <span>{{scope.row.recordDeptName+'-'+scope.row.recordName}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="120" label="创建时间">
            <template slot-scope="scope">
              <span>{{scope.row.createTime|formatTime(false)}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="120" class-name="null-formatter operation-btns">
            <template slot-scope="scope">
              <template v-if="power['sign-book-mx-add'].state">
                <el-button type="text" class="font-color" @click="btnOpera(scope.row,1)">编辑</el-button>
                <el-button type="text" class="font-color" @click="btnOpera(scope.row,2)">删除</el-button>
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
      </div>
      <el-dialog
        :title="dialogDetails.title+'收入'"
        v-if="dialogVisible==='income'"
        :close-on-click-modal="$tool.closeOnClickModal"
        :visible="dialogVisible==='income'&&Object.keys(dialogDetails.context).length>0"
        width="30%"
        class="set-dialog"
        :before-close="handleClose">
        <div class="dialog-info">
          <div class="input-group">
            <label class="form-label">部门:</label>
            <div class="margin-left">
              <!--<select-tree :data="DepList" :init="dialogDetails.context.deptName" @checkCell="depHandleClick"
                           @clear="clearDep"></select-tree>-->
              <el-select class="w400" v-model="dialogDetails.context.deptId" placeholder="请选择" size="small" filterable clearable @change="depListHandleClick()" @clear="depListHandleClick('cls')">
                <el-option
                  v-for="item in depLists"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="input-group">
            <label class="form-label">费用项:</label>
            <el-input class="w400 margin-left" :clearable="true" maxlength="100" size="small" v-model="dialogDetails.context.moneyDepiction"
                      placeholder="请输入"></el-input>
          </div>
          <div class="input-group">
            <label class="form-label">金额:</label>
            <el-input class="w400 margin-left" :clearable="true" size="small" v-model="dialogDetails.context.money"
                      placeholder="请输入" @input="cutNum">
              <!--<input type="text" size="small" class="w400 margin-left el-input__inner" placeholder="请输入" v-model="dialogDetails.context.money"
                     @input="cutNum">-->
              <template slot="append">元</template>
            </el-input>
          </div>
          <div class="input-group">
            <label class="form-label">收入时间:</label>
            <div class="time-picker">
              <el-date-picker
                v-model="dialogDetails.context.moneyTime"
                size="small"
                class="margin-left w400"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
          </div>
          <div class="input-group" style="position: relative">
            <label>备注:</label>
            <el-input
              type="textarea"
              class="margin-left w400"
              :rows="3"
              maxlength="250"
              placeholder="请输入内容"
              v-model="dialogDetails.context.remark">
            </el-input>
            <span style="position: absolute;right: 55px;bottom: 5px;background-color: white;">{{!dialogDetails.context.remark?0:dialogDetails.context.remark.length}}/250</span>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-checkbox v-model="dialogDetails.checked" class="btn-remember" v-if="dialogDetails.title==='新增'">继续创建下一个</el-checkbox>
          <span><el-button @click="handleClose" size="small">取 消</el-button><el-button type="primary" @click="incomeOper()" class="btn-bg" size="small" :disabled="fullscreenLoading">确 定</el-button></span>
        </div>
      </el-dialog>
      <fixed-cost v-if="dialogVisible==='import'" :dialogVisible="dialogVisible==='import'" @close="costClose"></fixed-cost>
      <add-pay v-if="addPay.state" :version="addPay.version" :dialogVisible="addPay.state" :propData="addPay.data" @closePayDialog="costClose" @refreshData="costClose"></add-pay>
    </template>
    <AccountSum v-if="activeTab===1"></AccountSum>
  </div>
</template>
<script>
  import {FILTER} from "@/assets/js/filter";
  import {MIXINS} from "@/assets/js/mixins";
  import FixedCost from "@/pages/ledger/fixedCost"
  import AccountSum from "@/components/accountSum"
  import AddPay from "@/components/addPay"

  let form={
    timeRange: '',
    deptId: '',
    deptName:'',
    moneyDepiction: '',
    moneyType: ''
  }
  export default {
    name: "ledgerDetails",
    mixins: [MIXINS, FILTER],
    components: {
      FixedCost,
      AccountSum,
      AddPay
    },
    data: function () {
      return {
        tabs:['账目明细','账目汇总'],
        activeTab:0,
        searchForm: Object.assign({},form),
        dictionary: {
          '762': []
        },
        titleMsg:{
          income:0,
          expenditure:0,
          profit:0
        },
        list: [],
        pageSize: 20,
        total: 0,
        currentPage: 1,
        cells_del: [],//批量删除选中
        dialogVisible: '',//弹窗状态 import=导入成本，income=收入
        dialogDetails: {
          title: '新增',
          context: Object.create(null),
          checked: false
        },
        addPay:{
          version:1,
          state:false,
          data:Object.create(null)
        },
        depName:'',//用于初始化收入框中的部门名称
        pickerOptions:{
          disabledDate(time){
            return Date.now()<time.getTime()
          }
        },
        depLists:[],//新增收入部门列表
        fullscreenLoading:false,//新增定时器
        power: {
          'sign-book-mx-add': {
            state: false,
            name: '新增'
          },
          'sign-book-mx-insert': {
            state: false,
            name: '导入固定成本'
          },
          'sign-book-mx-query': {
            state: false,
            name: '账目明细查询'
          },
          'sign-book-mx-export': {
            state: false,
            name: '导出'
          },
          'sign-book-hz-query': {
            state: false,
            name: '账目汇总查询'
          },
        }
      }
    },
    created(){
      this.getDictionary()
    },
    mounted(){
      document.title='记账本'
      if(this.power['sign-book-hz-query'].state&&!this.power['sign-book-mx-query'].state){
        this.activeTab=1
      }
      if(!this.power['sign-book-hz-query'].state&&!this.power['sign-book-mx-query'].state){
        this.$message({
          message:'无查询权限'
        })
      }else{
        this.getData()
      }
    },
    methods: {
      getDepList:function (dep) {
        // debugger
        let url="/api/access/deps";
        let isControl = true;
        let param = {
          keyword: '',
          isControl: isControl
        }
        this.$ajax.get(url, param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.depLists=[].concat(res.data)
            if(dep&&dep.deptId){
              let state=this.depLists.some(item=>{
                return item.id===dep.deptId
              })
              if(!state){
                this.depLists.unshift({id:this.dialogDetails.context.deptId,name:this.dialogDetails.context.deptName,flag:99})
              }
            }
          }
        })
      },
      changeTab:function(index){
        this.activeTab=index
      },
      reset: function () {
        this.searchForm=Object.assign({},this.searchForm,form)
      },
      getData: function (type='search') {
        if(type==='search'){
          this.currentPage=1
        }
        let param=Object.assign({},this.searchForm,{pageNum:this.currentPage,pageSize:this.pageSize})
        if(this.searchForm.timeRange&&this.searchForm.timeRange.length>0){
          param.moneyTimeStart=param.timeRange[0]
          param.moneyTimeEnd=param.timeRange[1]
        }
        delete param.timeRange
        this.$ajax.get('/api/accountBook/list',param).then(res=>{
          res=res.data
          if(res.status===200){
            let result=res.data.list
            let {income,expenditure,profit}=res.data
            this.titleMsg=Object.assign(this.titleMsg,{income,expenditure,profit})
            this.list=[].concat(result.list)
            this.total=result.total
          }
        })
      },
      depListHandleClick:function(type='init'){
        if(type==='cls'){
          Object.assign(this.dialogDetails.context,{
            deptName: ''
          })
        }
        this.depLists.find(item=>{
          if(item.id===this.dialogDetails.context.deptId){
            if(item.flag&&item.flag===99){
              this.$message({
                message:'没有权限无法选择'
              })
              Object.assign(this.dialogDetails.context,{
                deptName: '',
                deptId: ''
              })
            }else{
              Object.assign(this.dialogDetails.context,{
                deptName: item.name
              })
            }
          }
          return false
        })
      },
      depHandleClick: function (res) {
        if(!!this.dialogVisible){
          Object.assign(this.dialogDetails.context,{
            deptId:res.depId,
            deptName: res.name
          })
          this.depName=res.name
        }else{
          Object.assign(this.searchForm,{
            deptId:res.depId,
            deptName: res.name
          })
        }
      },
      clearDep: function () {
        if(!!this.dialogVisible){
          Object.assign(this.dialogDetails.context,{
            deptId:'',
            deptName: ''
          })
          this.depName=''
        }else{
          Object.assign(this.searchForm,{
            deptId: '',
            deptName: ''
          })
        }
      },
      getExcel: function () {
        this.getData('search')

        let param=Object.assign({},this.searchForm)
        if(this.searchForm.timeRange.length>0){
          param.moneyTimeStart=param.timeRange[0]
          param.moneyTimeEnd=param.timeRange[1]
        }
        delete param.timeRange
        this.excelCreate('/input/BookExcel', param)
      },
      //分页事件
      handleSizeChange:function(val) {},
      handleCurrentChange:function(val) {
        this.currentPage=val
        this.getData('page')
      },
      handleClose:function(){
        this.clearDep()
        this.dialogVisible=''
      },
      //操作按钮事件
      btnOpera: function (row, type) {
        if(type===1){//数据编辑
          if(row.moneyType===1){
            this.operBtn('income',row)
          }else{
            this.operBtn('pay',row)
          }
        }else{
          this.cells_del=[].concat(row)
          this.operBtn('del')
        }
      },
      //收入框操作
      incomeOper:function(){
        let rule={
          deptId:{
            name:'部门'
          },
          moneyDepiction:{
            name:'费用项'
          },
          money:{
            name:'金额'
          },
          moneyTime:{
            name:'收入时间'
          }
        }
        let param=Object.assign({},this.dialogDetails.context)
        this.$tool.checkForm(param,rule).then(()=>{
          let url='/accountBook/insertAccountBook'
          let edit=(this.dialogDetails.title==='编辑')
          if(edit){
            url='/accountBook/updateAccountBook'
          }
          if(param.money<=0){
            this.$message({
              message:'金额必须大于0元'
            })
            return
          }
          this.fullscreenLoading=true
          this.$ajax.post('/api'+url,param).then(res=>{
            if(this.dialogDetails.checked&&!edit){
              this.dialogDetails.context=Object.assign({},this.dialogDetails.context,{
                moneyDepiction: '',
                money: '',
                remark: ''
              })
              this.dialogDetails.checked=false
            }else {
              this.dialogVisible=''
            }
            this.fullscreenLoading=false
            this.$message({
              message:!edit?'新增成功':'编辑成功'
            })
            this.getData()
          }).catch(error=>{
            this.fullscreenLoading=false
            this.$message({
              message:error
            })
          })
        }).catch(error=>{
          this.$message({
            message: `${error.title+error.msg}`
          })
        })
      },
      //表格行数据多选操作
      handleSelectionChange: function (val) {
        this.cells_del = val
      },
      operBtn: function (type,result) {
        switch (type) {
          case 'del':
            if (this.cells_del.length === 0) {
              this.$message({
                message: '请先勾选数据'
              })
            } else {
              this.$confirm('是否确认删除', {
                showClose: false,
                confirmButtonClass:'del-btn-bg',
                customClass:'dialog-del',
                closeOnClickModal:false
              }).then(() => {
                let ids=[]
                this.cells_del.forEach(item=>{
                  ids.push(item.id)
                })
                this.$ajax.post('/api/accountBook/delCost ',{ids:ids.join(',')}).then(res=>{
                  res=res.data
                  if(res.status===200){
                    this.$message({
                      message:'删除成功'
                    })
                    this.getData()
                    this.cells_del=[]
                  }
                }).catch(error=>{
                  this.$message({
                    message:error
                  })
                })
              }).catch(()=>{
                this.$refs.tableCom.clearSelection()
                this.cells_del=[]
              })
            }
            break;
          case 'import':
            this.dialogVisible = type
            break;
          case 'income':
            this.dialogVisible = type
            this.dialogDetails.checked=false//初始化勾选框
            this.getDepList(result)
            if(!result){
              this.dialogDetails.title='新增'
              this.dialogDetails.context = Object.assign({}, {
                deptId: '',
                deptName: '',
                moneyDepiction: '',
                money: '',
                moneyTime: '',
                remark: '',
                moneyType: 1
              })
            }else {
              this.dialogDetails.title='编辑'
              let {id,deptId,deptName,moneyDepiction,money,moneyTime,remark}=result
              console.log(this.depLists)
              this.dialogDetails.context = Object.assign({}, this.dialogDetails.context, {
                id,
                deptId,
                deptName,
                moneyDepiction,
                money,
                moneyTime:this.$tool.dateFormat(moneyTime),
                remark,
                moneyType: 1
              })
            }
            break;
          case 'pay':
          case 'pay1':
            if(type==='pay'){
              this.addPay.version=1
            }else{
              this.addPay.version=2
            }
            if(!!result){
              this.addPay=Object.assign(this.addPay,{version:3,data:result})
            }
            this.addPay.state=true
        }
      },
      costClose:function(payload){
        if(payload&&payload.state==='success'){
          this.getData()
        }
        this.dialogVisible=''
        if(payload&&Object.keys(payload).includes('save')){
          this.addPay.state=payload.save
        }else{
          this.addPay.state=false
        }
      },
      //金额输入
      cutNum: function () {
        console.log(this.dialogDetails.context.money)
        this.$set(this.dialogDetails.context,'money',this.$tool.cutFloat({val:this.dialogDetails.context.money, max: 999999999.99}))
      },
      //重写表格maxHeight设置方法
      comHeightFn() {
        this.$nextTick(()=>{
          if (this.$refs.tableCom && this.$refs.tableComView) {
            let wh = document.documentElement.clientHeight;
            let h1 = this.$refs.tableComView.clientHeight+40
            let h2 = this.$refs.tableCom.$el.clientHeight;
            let th = wh - h1;
            this.tableNumberCom = h2 + th;
          }
        })
      },
    },
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  @btn-bg:#38BD8B;
  .tooltip-info{
    span{
      display: inline-block;
      max-width: 240px;
    }
  }
  /deep/.el-button:hover{
    background-color: inherit;
    color: @btn-bg;
  }
  /deep/.el-dropdown-menu__item:not(.is-disabled):hover{
    background-color: #ffffff;
    color: @btn-bg;
  }
  /deep/.select-btn{
    .cell{
      .is-checked,.is-indeterminate{
        .el-checkbox__inner{
          background-color: @btn-bg;
        }
      }
    }
  }
  .btn-bg{
    background-color: @btn-bg;
    color: #ffffff;
  }
  .font-color{
    color:@btn-bg !important;
  }

  .view {
    padding: 15px 15px 0;
  }
  .view-title{
    font-size: 18px;
    position: relative;
    padding: 0 0 10px 25px;
    border-bottom: 1px solid #e3e3e3;
    margin: 0px -15px;
    &::before{
      content: '';
      position: absolute;
      top: 0;
      bottom: 10px;
      left: 15px;
      border-left: 4px solid @btn-bg;
    }
  }
  ul.tabs{
    margin: 0;
    padding: 15px 0 0;
    >li{
      display: inline-block;
      /*min-width: 100px;*/
      text-align: center;
      padding: 12px 30px;
      background-color: #d7d7d7;
      cursor: pointer;
      &.active-li{
        background-color: @btn-bg;
        color: white;
      }
    }
  }

  .view-context {
    border: 1px solid #e3e3e3;
    /deep/.theader-bg{
      >th{
        background-color: #F5F5F9;
      }
    }
  }

  .pagination-info {
    text-align: right;
    /deep/ .el-pager{
      >li.active{
        color:@btn-bg;
      }
    }
  }

  .content {
    display: flex;
    justify-content: space-between;
    padding: 15px 15px 0;
    margin: 20px 0;
    border: 1px solid #e3e3e3;

    .search-content {
      display: flex;
      flex-wrap: wrap;
    }

    .input-group {
      margin: 0 20px 15px 0;

      > label:first-of-type {
        min-width: auto;
      }
    }
  }

  .table-tool {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    font-size: 14px;

    > ul {
      > li {
        display: inline-block;
        margin-right: 10px;

        &:first-of-type {
          border: 1px solid #e3e3e3;
          border-radius: 4px;
          padding: 8px 10px;
        }

        &:nth-of-type(2) > span {
          color: #00CC99;
        }

        &:nth-of-type(n+3) > span {
          color: red;
        }
      }
    }
    /deep/ .btn-info{
      background-color: @btn-bg;
      color: #ffffff;
    }
    .color-info{
      /deep/ .el-button{
        background-color: @btn-bg;
        color: #ffffff;
      }
    }
  }

  .set-dialog {
    /deep/ .el-dialog {
      min-width: 600px;
    }
  }

  .dialog-info {
    padding: 20px 20px 0;

    .input-group {
      > label {
        text-align: right;
      }
    }
  }

  .dialog-footer {
    position: relative;

    .btn-remember {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      &.is-checked{
        /deep/.is-checked{
          .el-checkbox__inner{
            background-color: @btn-bg;
          }
        }
        /deep/.el-checkbox__label{
          color: @btn-bg;
        }
      }
    }
  }
</style>
