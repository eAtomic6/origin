<template>
<div class="view" ref="tableComView">
  <ScreeningTop @propResetFormFn="reset" @propQueryFn="getData('search')">
    <div class="content">
      <div class="input-group">
        <label>关键字:</label>
        <el-tooltip :content="getType===1?'收款ID/合同编号/纸质合同编号/项目名称/客户姓名/物业地址':'收款ID/合同编号/纸质合同编号/房源编号/物业地址'" placement="top">
          <el-input class="w200" :clearable="true" size="small" v-model="searchForm.keyword" placeholder="请输入"></el-input>
        </el-tooltip>
      </div>
      <div class="input-group">
        <label>查询时间:</label>
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
      <div class="input-group">
        <label>收付状态:</label>
        <el-select :clearable="true" size="small" v-model="searchForm.state" placeholder="请选择">
          <el-option
            v-for="item in dictionary['70']"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
      </div>
    </div>
  </ScreeningTop>
  <div class="view-context" :class="{'other':!power[`sign-${$route.query.type}-cw-rev-export`].state}">
    <div class="table-tool" v-if="power[`sign-${$route.query.type}-cw-rev-export`].state">
      <h4 class="f14"><i class="iconfont icon-tubiao-11"></i>数据列表</h4>
      <p>
        <el-button class="btn-info" round size="small" type="primary" @click="getExcel">导出</el-button>
      </p>
    </div>
    <component ref="tableCom" :tableHeight="tableNumberCom" v-bind:is="activeComponent" :list="list" :type="getType" @choseCheckPerson="choseCheckPerson"></component>
  </div>
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
  <checkPerson :show="checkPerson.state" :type="checkPerson.type" page="list" :showLabel="checkPerson.label" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @submit="personChose" @close="checkPerson.state=false" v-if="checkPerson.state"></checkPerson>
</div>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";
  import checkPerson from '@/components/checkPerson';

  const receiptCheck_xf =()=>import('@/pages/finance/receiptCheck/receiptCheck_xf');
  const receiptCheck_cz =()=>import('@/pages/finance/receiptCheck/receiptCheck_cz');
  const receiptCheck_jr =()=>import('@/pages/finance/receiptCheck/receiptCheck_jr');

  export default {
    name: "receipt-check",
    mixins: [MIXINS],
    components:{receiptCheck_xf,receiptCheck_cz,receiptCheck_jr,checkPerson},
    data(){
      return {
        checkPerson: {//审核人弹窗配置
          state:false,
          type:'init',
          code:'',
          flowType:1,//流程类型，本页面为定值
          label:false,
        },
        activeComponent:'receiptCheck_xf',
        searchForm: {
          keyword: '',
          timeRange:'',
          state:'',//收付状态
        },
        list: [],
        dictionary: {
          '70': ''
        },
        //分页
        total:0,
        currentPage:1,
        pageSize:10,
        //权限配置
        power: {
          'sign-xf-cw-rev-export': {
            state: false,
            name: '导出'
          },
          'sign-cz-cw-rev-export': {
            state: false,
            name: '导出'
          },
          'sign-jr-cw-rev-export': {
            state: false,
            name: '导出'
          },
        }
      }
    },
    created(){
      let urlParam=this.$route.query
      let _state = this.getPath.some(item=>{
        return ['新房','长租','金融'].includes(item.name)
      })
      if(!_state){
        this.getPath.unshift({name: urlParam.type==='xf'?'新房':urlParam.type==='cz'?'长租':urlParam.type==='jr'?'金融':'新房',path:this.$route.fullPath})//unshift方法返回数组的长度
        this.setPath(this.getPath)
      }
      this.activeComponent=`receiptCheck_${urlParam.type}`
      //获取筛选条件的缓存
      let res=this.getDataList
      if(res&&(res.route===this.$route.fullPath)){
        this.list = res.data.list
        this.total = res.data.total
        let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
        // debugger
        if(!!session){
          let {keyword,state,startTime,endTime,pageNum}=session.query
          this.currentPage=pageNum
          Object.assign(this.searchForm,{keyword:keyword,state:state,timeRange:!startTime?[]:[startTime,endTime]})
        }
      }else {
        this.getData()
      }
      this.getDictionary()
    },
    methods:{
      getExcel:function () {
        this.getData('search')
        let param = JSON.parse(JSON.stringify(this.searchForm))
        Object.assign(param,{startTime:'',endTime:''})
        if(typeof param.timeRange==='object'&&Object.prototype.toString.call(param.timeRange)==='[object Array]'){
          param.startTime = param.timeRange[0]
          param.endTime = param.timeRange[1]
        }
        delete param.timeRange
        switch (this.getType){
          case 1:
            this.excelCreate('/input/proceedsAuditExcel_XF',param)
                break;
          case 2:
            this.excelCreate('/input/proceedsAuditExcel_CZ',param)
            break;
          case 3:
            this.excelCreate('/input/proceedsAuditExcel_JR',param)
            break;
        }
      },
      reset:function () {
        this.$tool.clearForm(this.searchForm)
      },
      choseCheckPerson:function (payload) {
        this.checkPerson.code=payload.row.payCode
        this.checkPerson.state=true
        this.checkPerson.type=payload.type
        if(payload.row.nextAuditId===-1){
          this.checkPerson.label=true
        }else {
          this.checkPerson.label=false
        }
      },
      personChose:function () {
        this.checkPerson.state=false
        this.getData()
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
        param.pageNum = this.currentPage
        param.pageSize = this.pageSize
        delete param.timeRange

        let url = `/payInfoRecord/list${this.getType===1?'Xf':this.getType===2?'Cz':this.getType===3?'Jr':'Xf'}Records`
        //点击查询时，缓存筛选条件
        if(type==='search'||type==='pagination'){
          sessionStorage.setItem('sessionQuery',JSON.stringify({
            path:this.$route.fullPath,
            url:url,
            query:Object.assign({},param)
          }))
        }

        this.$ajax.get(`/api${url}`,param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.list = res.data.list
            this.total = res.data.total
          }
        }).catch(error => {
          this.$message({
            message:error
          })
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getData('pagination')
      },
    },
    computed:{
      getType:function () {
        let type=1;
        switch (this.activeComponent){
          case 'receiptCheck_xf':
            type=1;
            break;
          case 'receiptCheck_cz':
            type=2;
            break
          case 'receiptCheck_jr':
            type=3;
            break
        }
        return type;
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
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
