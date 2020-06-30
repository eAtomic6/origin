<template>
  <el-dialog
    title="请选择导入的部门范围"
    :visible="dialogVisible"
    :close-on-click-modal="$tool.closeOnClickModal"
    class="set-dialog"
    width="70%"
    :before-close="handleClose">
    <div class="dialog-info">
      <div class="input-group">
        <label class="form-label">部门:</label>
        <div class="margin-left">
          <!--<select-tree :data="DepList" treeType="power" class="dep-width" @checkCell="depHandleClick"
                       @clear="clearDep"></select-tree>-->
          <el-select class="w400" v-model="dialogDetails.depId" placeholder="请选择" size="small" filterable clearable>
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
        <label class="form-label">参考月份:</label>
        <div class="time-picker">
          <el-date-picker
            v-model="dialogDetails.time"
            size="small"
            class="margin-left w400"
            type="month"
            @change="handleDate"
            value-format="yyyy-MM">
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="dialog-result">
      <p>导入固定成本</p>
      <el-table ref="profitTable" border :data="list" max-height="460" header-row-class-name="theader-bg" @select="handleSelectionCell" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left" class-name="select-btn"></el-table-column>
        <el-table-column prop="deptName" label="部门" min-width="160"></el-table-column>
        <el-table-column label="费用项" min-width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.moneyDepiction&&scope.row.moneyDepiction.length<=20">{{scope.row.moneyDepiction}}</span>
            <span v-else-if="!scope.row.moneyDepiction">--</span>
            <el-tooltip v-else popper-class="tooltip-info" effect="dark" placement="top-start">
              <span>{{scope.row.moneyDepiction.substr(0,20)+'...'}}</span>
              <span slot="content">{{scope.row.moneyDepiction}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="金额（元）"></el-table-column>
        <el-table-column label="备注" min-width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.remark&&scope.row.remark.length<=20">{{scope.row.remark}}</span>
            <span v-else-if="!scope.row.remark">--</span>
            <el-tooltip v-else popper-class="tooltip-info" effect="dark" placement="top-start">
              <span>{{scope.row.remark.substr(0,20)+'...'}}</span>
              <span slot="content">{{scope.row.remark}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="recordName" label="记账人" min-width="160"></el-table-column>
        <el-table-column prop="" label="创建时间" min-width="160">
          <template slot-scope="scope">
            {{scope.row.createTime|formatTime(false)}}
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
    <div slot="footer" class="dialog-footer">
      <span><el-button size="small" @click="handleClose">取 消</el-button><el-button type="primary" size="small" class="btn-bg" @click="importCost">导 入</el-button></span>
    </div>

  </el-dialog>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";

  export default {
    name: "fixedCost",
    mixins:[MIXINS],
    props:{
      dialogVisible:{
        type:Boolean,
        default:false
      }
    },
    data(){
      return {
        dialogDetails:{
          depId:'',
          // depName:'',
          time:''
        },
        list: [],
        currentPage:1,
        pageSize:10,
        total:0,
        cells_in:[],//导入数据的id集
        depLists:[],//新增收入部门列表
      }
    },
    watch:{
      dialogDetails:{
        handler:function (val) {
          this.checkInput().then(()=>{
            //请求历史数据
            this.getList()
          }).catch(error=>{
            //...
          })
        },
        deep:true
      }
    },
    mounted(){
      this.getDepList()
    },
    methods:{
      getDepList:function (keyword='',type='init') {
        // debugger
        let url="/api/access/deps";
        let isControl = true;
        let param = {
          keyword: keyword,
          isControl: isControl
        }
        this.$ajax.get(url, param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.depLists=[].concat(res.data)
          }
        })
      },
      handleDate:function(time){
        let check=new Date(time)

        let nowTime=this.$tool.dateFormat(Date.now())
        let now=new Date(nowTime)
        if(now.setDate(1)<=check.setDate(1)){
          this.$message({
            message:'请选择之前的月份'
          })
          this.dialogDetails.time=''
        }
      },
      depHandleClick:function(val){
        this.dialogDetails.depId=val.depId
      },
      clearDep:function(){
        this.dialogDetails.depId=''
      },
      handleSizeChange:function(){

      },
      handleCurrentChange:function(val){
        this.currentPage=val
        this.getList('page')
      },
      //表格行数据多选操作
      handleSelectionChange: function (val) {
        let arr=[]
        val.forEach(item=>{
          if(item.isRepeat){
            this.$refs.profitTable.toggleRowSelection(item,false)
          }else{
            arr.push(item)
          }
        })
        this.cells_in=[].concat(arr)
      },
      handleSelectionCell:function(index,row){
        if(row.isRepeat){
          this.$message({
            message:'该固定成本已导入'
          })
          this.$refs.profitTable.toggleRowSelection(row,false)
        }else{
          this.cells_in=[].concat(index)
        }
      },
      getList:function(type='init'){
        if(type==='init'){
          this.currentPage=1
        }
        let param=Object.assign({},this.dialogDetails,{pageNum:this.currentPage,pageSize: this.pageSize})
        // debugger
        if(!param.time){
          return
        }
        this.$ajax.post('/api/accountBook/selectInputRange',param).then(res=>{
          res=res.data
          if(res.status===200){
            this.list=[].concat(res.data.data)
            this.total=res.data.total
          }
        }).catch(error=>{
          this.$message({
            message:error
          })
        })
      },
      handleClose:function(type){
        this.$emit('close',{
          state:type
        })
      },
      checkInput:function(){
        let rule={
          depId:{
            name:'部门'
          },
          time:{
            name:'参考时间'
          }
        }
        let param=Object.assign({},this.dialogDetails)
        return this.$tool.checkForm(param,rule)
      },
      //导入固定成本
      importCost:function () {
        this.checkInput().then(()=>{
          if(this.list.length===0){
            this.$message({
              message:'当前部门和月份下无固定成本，无法导入！'
            })
          }else{
            let ids=[]
            if(this.cells_in.length===0){
              this.$message({
                message:'请勾选'
              })
              return
            }
            this.cells_in.forEach(item=>{
              ids.push(item.id)
            })
            this.$ajax.post('/api/accountBook/inputCost',{accountBookId:ids.join(',')}).then(res=>{
              this.$message({
                message:'导入成功'
              })
              this.handleClose('success')
            })
          }
        }).catch(error=>{
          this.$message({
            message:'没有选择部门和月份，无法导入！'
          })
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @btn-bg:#38BD8B;
  .btn-bg{
    background-color: @btn-bg;
    color: #ffffff;
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
  .tooltip-info{
    span{
      display: inline-block;
      max-width: 240px;
    }
  }
  .set-dialog{
    /deep/.el-dialog__body{
      padding: 0;
    }
  }
  .dep-width{
    /deep/.w200{
      width: 400px !important;
    }
  }
  .pagination-info{
    text-align: right;
  }
  .dialog-info{
    padding: 15px;
    .input-group{
      margin-bottom: 15px;
      >label{
        text-align: right;
      }
      &:last-of-type{
        margin: 0;
      }
    }
    border-bottom: 1px solid #e3e3e3;
  }
.dialog-result{
  padding: 0 15px;
  >p{
    &:first-of-type{
      font-size: 14px;
      font-weight: bold;
      margin: 15px 0;
    }
  }
  /deep/.theader-bg{
    >th{
      background-color: #F5F5F9;
    }
  }
}
</style>
