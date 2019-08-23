<template>
  <div class="view-container" ref="tableComView">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
      <el-form :inline="true" :model="searchForm" class="prop-form" size="small">
        <el-form-item label="体系">
          <el-select v-model="searchForm.systemTag" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in systemTagList" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成交总价">
          <el-input  v-model="searchForm.dealPriceMin" @input.native="changeRatio('priceBegin')" style="width:150px" placeholder="请输入" :clearable="true"></el-input> 万 -
          <el-input  v-model="searchForm.dealPriceMax" @input.native="changeRatio('priceEnd')" style="width:150px" placeholder="请输入" :clearable="true"></el-input> 万
        </el-form-item>
        <el-form-item label="低佣比例">
          <el-input class="percent" v-model="searchForm.comPercentMin" @input.native="changeRatio('ratioBegin')" style="width:85px" placeholder="请输入" :clearable="true"></el-input> -
          <el-input class="percent" v-model="searchForm.comPercentMax" @input.native="changeRatio('ratioEnd')" style="width:85px" placeholder="请输入" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="设置时间">
          <el-date-picker v-model="setSignDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy/MM/dd" style="width:330px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最新修改时间">
          <el-date-picker v-model="editSignDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy/MM/dd" style="width:330px">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <!-- 低佣比例列表 -->
    <div class="contract-list">
      <div class="listTitle">
        <div>
          <span class="title"><i class="iconfont icon-tubiao-11"></i>数据列表</span>
        </div>
        <div>
          <el-button class="btn-info" icon="el-icon-plus" round type="primary" size="small" @click="dialogRatio=true">新增低佣比例</el-button>
        </div>
      </div>
      <el-table ref="tableCom" class="info-scrollbar" :data="tableData" style="width: 100%" border :max-height="tableNumberCom">
        <el-table-column align="center" label="体系" min-width="50">
          <template slot-scope="scope">
            <span v-for="item in systemTagList" :key="item.key" v-if="item.key===scope.row.systemTag">{{item.value}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="成交总价" min-width="50">
          <template slot-scope="scope">
            <p v-for="item in scope.row.list" :key="item.id">{{item.dealPriceMin+' ~ '+item.dealPriceMax}}万</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="低佣比例" min-width="50">
          <template slot-scope="scope">
            <p v-for="item in scope.row.list" :key="item.id"><span v-if="item.judgeType===1" style="font-size:16px;">≤ </span><span v-if="item.judgeType===2" style="font-size:16px;">= </span><span v-if="item.judgeType===3" style="font-size:16px;">≥ </span>{{item.comPercentMin}} %</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="设置时间" min-width="50">
          <template slot-scope="scope">
            <!-- <p v-for="item in scope.row.list" :key="item.id">{{item.settingTime|formatTime}}</p> -->
            {{scope.row.list[0].settingTime|formatTime}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="最新修改时间" min-width="50">
          <template slot-scope="scope">
            <!-- <p v-for="item in scope.row.list" :key="item.id">{{item.updateTime|formatTime}}</p> -->
            {{scope.row.list[0].updateTime|formatTime}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="goEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="pagination" v-if="tableData.length>0">
        <el-pagination
         class="pagination-info"
         @current-change="handleCurrentChange"
         :current-page="currentPage"
         layout="total, prev, pager, next, jumper"
         :total="total">
        </el-pagination>
      </div> -->
    </div>
    <!-- 编辑/新增 弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogRatio" width="740px" :closeOnClickModal="$tool.closeOnClickModal" @close="closeDialog">
      <div class="top">
        <div>
          <p class="form-label system">体系：</p>
          <el-select v-model="systemType" size="small" placeholder="全部" :disabled="forbid" :clearable="true" style="width:200px">
            <el-option v-for="item in systemTagList" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="ratioList">
          <span class="form-label">成交总价：</span>
          <span class="form-label">低佣比例：</span>
          <ul>
            <li v-for="(item,index) in ratioList" :key="index">
              <input type="text" v-model="item.dealPriceMin" @input="cutNumber('dealPriceMin',index)" placeholder="请输入" class="dealPrice"> 万-
              <input type="text" v-model="item.dealPriceMax" @input="cutNumber('dealPriceMax',index)" placeholder="请输入" class="dealPrice"> 万
              <el-select v-model="item.judgeType" placeholder="全部" size="small" style="margin-left:40px;width:100px;">
                <el-option v-for="item in dictionary['652']" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
              <input type="text" v-model="item.comPercentMin" @input="cutNumber('comPercentMin',index)" placeholder="请输入" class="dealPrice"> %
              <!-- <input type="text" v-model="item.comPercentMax" @input="cutNumber('comPercentMax',index)" placeholder="请输入" class="dealPrice"> % -->
              <span @click.stop="add" class="icon">
                <i class="iconfont icon-tubiao_shiyong-14"></i>
              </span>
              <span @click.stop="del(index)" v-if="ratioList.length>1" class="icon">
                <i class="iconfont icon-tubiao_shiyong-4"></i>
              </span>
            </li>
          </ul>
          <p class="hint">注：设置新的低佣比例成功后，原来的低佣比例被替换。</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="dialogRatio = false">取消</el-button>
        <el-button round type="primary" @click="save">保存</el-button>
      </span>
    </el-dialog>
    <!-- 保存比例确认框 -->
    <el-dialog title="确认保存" :visible.sync="dialogSave" class="ratioMsg" width="500px" :closeOnClickModal="$tool.closeOnClickModal">
      <div class="warning-box">
        <p>确认保存新的低佣比例设置？</p>
        <p class="p_red">新的低佣比例值会覆盖原来的低佣比例值</p>
        <p>当前设置低佣比例区间为：</p>
        <ul>
          <li v-for="(item,index) in ratioList" :key="index">
            <span>成交总价：{{item.dealPriceMin+'万 - '}}{{item.dealPriceMax?item.dealPriceMax:'999999999.99'}}万</span>
            <span>低佣比例：<span v-for="item_ in dictionary['652']" :key="item_.key" v-if="item.judgeType===item_.key">{{item_.value}} </span>{{item.comPercentMin+' %'}}</span>
          </li>
        </ul>
        <!-- <el-table :data="ratioList" border header-row-class-name="theader-bg">
          <el-table-column label="成交总价">
            <template slot-scope="scope">
              <span>{{scope.row.dealPriceMin+'万 - '}}{{scope.row.dealPriceMax?scope.row.dealPriceMax:'999999999.99'}}万</span>
            </template>
          </el-table-column>
          <el-table-column label="比例">
            <template slot-scope="scope">
              <span v-for="item_ in dictionary['652']" :key="item_.key" v-if="scope.row.judgeType===item_.key">{{item_.value}} </span>{{scope.row.comPercentMin+' %'}}
            </template>
          </el-table-column>
        </el-table> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="dialogSave = false">取消</el-button>
        <el-button round type="primary" @click="addEdit">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
           
<script>
import ScreeningTop from "@/components/ScreeningTop";
import { MIXINS } from "@/assets/js/mixins";
import { TOOL } from "@/assets/js/common";

export default{
  mixins: [MIXINS],
  components: {
    ScreeningTop
  },
  data(){
    return{
      setSignDate:[],
      editSignDate:[],
      searchForm:{
        cityId:'',
        dealPriceMin:'',
        dealPriceMax:'',
        comPercentMin:'',
        comPercentMax:''
      },
      tableData:[],
      ratioList:[
        {dealPriceMin:'',dealPriceMax:'',comPercentMin:'',judgeType:1}
      ],
      currentPage:1,
      pageSize:10,
      total:0,
      dialogTitle:'新增低佣比例',
      dialogRatio:false,
      dialogSave:false,
      forbid:false,//弹窗体系是否禁用
      systemType:'',//弹窗体系
      dictionary: {
        //数据字典
        // "638": "", //体系
        "652": "", //区间（大于小于）
      },
    }
  },
  created(){
    this.getSystemTag()
    this.getDictionary();//字典
    let res=this.getDataList
    if(res&&(res.route===this.$route.path)){
      this.tableData = res.data
      // this.total = res.data.count
      let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
      this.searchForm = Object.assign({},this.contractForm,session.query)
      // this.contractForm.systemType=Number(this.contractForm.systemType)
      delete this.searchForm.settingTimeStart
      delete this.searchForm.settingTimeEnd
      delete this.searchForm.updateTimeStart
      delete this.searchForm.updateTimeEnd
      if(session.query.settingTimeStart){
        this.setSignDate[0]=session.query.settingTimeStart
        this.setSignDate[1]=session.query.settingTimeEnd
      }
      if(session.query.updateTimeStart){
        this.editSignDate[0]=session.query.updateTimeStart
        this.editSignDate[1]=session.query.updateTimeEnd
      }
    }else{
      this.getList();//列表
    }
  },
  methods:{
    //查询
    queryFn(){
      this.getList("search")
    },
    //重置
    resetFormFn(){
      TOOL.clearForm(this.searchForm);
      this.setSignDate=[]
      this.editSignDate=[]
    },
    // 页码跳转
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList("page")
    },
    //获取列表
    getList(type="init"){
      let param ={
        // pageNum: this.currentPage,
        // pageSize: this.pageSize,
      }
      param = Object.assign({}, param, this.searchForm);
      if(this.setSignDate){
        if (this.setSignDate.length > 0) {
          param.settingTimeStart = this.setSignDate[0];
          param.settingTimeEnd = this.setSignDate[1];
        }
      }
      if(this.editSignDate){
        if (this.editSignDate.length > 0) {
          param.updateTimeStart = this.editSignDate[0];
          param.updateTimeEnd = this.editSignDate[1];
        }
      }
      if(type==="search"||type==="page"){
        sessionStorage.setItem('sessionQuery',JSON.stringify({
          path:'/lowCommission',
          url:'/commissionsetting/operateQry',
          query:Object.assign({},param),
          methods:"get"
        }))
      }
      this.$ajax.get("/api/commissionsetting/operateQry",param).then(res=>{
        res=res.data
        if(res.status===200){
          this.tableData=res.data
          // this.total=res.data.count
        }
      })
    },
    //添加一条低佣比例
    add(){
      this.ratioList.push({
        dealPriceMin:'',
        dealPriceMax:'',
        comPercentMin:'',
        judgeType:1
      })
    },
    //删除一条低佣比例
    del(index){
      this.ratioList.splice(index, 1);
    },
    // 保存
    save(){
      if(this.systemType){
        let isOK = false
        // this.ratioList.every((element,index) => {
          let ratioList_=JSON.parse(JSON.stringify(this.ratioList))
        for(var i=0;i<ratioList_.length;i++){
          isOK=false
          if(!ratioList_[i].dealPriceMin){
            ratioList_[i].dealPriceMin="0"
          }
          if(!ratioList_[i].dealPriceMax){
            ratioList_[i].dealPriceMax="999999999.99"
          }
          if((ratioList_[i].dealPriceMin.toString()).length>0&&Number(ratioList_[i].dealPriceMax)>0){
            if((ratioList_[i].comPercentMin.toString()).length>0){
              if(Number(ratioList_[i].dealPriceMax)>Number(ratioList_[i].dealPriceMin)){
                isOK=true
              }else{
                this.$message({
                  message:"成交总价范围错误",
                  type:"warning"
                })
                return
              }
            }else{
              this.$message({
                message:"低佣比例不能为空",
                type:"warning"
              })
              return
            }
          }else{
            this.$message({
              message:"成交总价不能为空",
              type:"warning"
            })
            return
          }
        }

        if(isOK){
          let url=''
          if(this.forbid){//true 编辑
            url="/api/commissionsetting/operateUpdate"
          }else{//false 新增
            url="/api/commissionsetting/operateInsert"
          }
          let listLength=ratioList_.length
          if(listLength>1){
            let beginList = []
            let endList = []
            ratioList_.forEach(element => {
              beginList.push(element.dealPriceMin)
            });
            ratioList_.forEach(element => {
              endList.push(element.dealPriceMax)
            });
            beginList.sort(this.compare)
            endList.sort(this.compare)
            let interval=true
            for(var i=1;i<beginList.length;i++){
              if(parseInt(beginList[i])<parseInt(endList[i-1])){
                interval=false
                this.$message({
                  message:"价格区间重复",
                  type:"warning"
                })
                break
              }
            }
            if(interval){
              this.dialogSave=true
              // alert("完全OJBK！！！")
              // let param = {
              //   cityId:'',
              //   systemTag:this.systemType,
              //   list:[].concat(this.ratioList)
              // }
              // this.$ajax.postJSON(url,param).then(res=>{
              //   res=res.data
              //   if(res.status===200){
              //     this.$message({
              //       message:"添加成功",
              //       type:"success"
              //     })
              //     this.closeDialog()
              //   }
              // }).catch(error=>{
              //   this.$message({
              //     message:error,
              //     type:"error"
              //   })
              // })
            }
          }else{
            this.dialogSave=true
            // let param = {
            //   cityId:'',
            //   systemTag:this.systemType,
            //   list:[].concat(this.ratioList)
            // }
            // this.$ajax.postJSON(url,param).then(res=>{
            //   res=res.data
            //   if(res.status===200){
            //     this.$message({
            //       message:"添加成功",
            //       type:"success"
            //     })
            //     this.closeDialog()
            //   }
            // }).catch(error=>{
            //   this.$message({
            //     message:error,
            //     type:"error"
            //   })
            // })
          }
        }
      }else{
        this.$message({
          message:"请选择体系",
          type:"warning"
        })
      }
    },
    //新增编辑
    addEdit(){
      let url=''
      let title="添加成功"
      if(this.forbid){//true 编辑
        url="/api/commissionsetting/operateUpdate"
        title="编辑成功"
      }else{//false 新增
        url="/api/commissionsetting/operateInsert"
      }
      let param = {
        cityId:'',
        systemTag:this.systemType,
        list:[].concat(this.ratioList)
      }
      this.$ajax.postJSON(url,param).then(res=>{
        res=res.data
        if(res.status===200){
          this.$message({
            message:title,
            type:"success"
          })
          this.dialogSave=false
          this.closeDialog()
        }
      }).catch(error=>{
        this.$message({
          message:error,
          type:"error"
        })
      })
    },
    compare(a,b){
      return a-b
    },
    //编辑
    goEdit(item){
      this.dialogTitle='编辑低佣比例'
      this.dialogRatio=true
      this.forbid=true
      this.systemType=item.systemTag
      let param = {
        cityId:"",
        systemTag:item.systemTag
      }
      this.$ajax.get("/api/commissionsetting/qryCommission",param).then(res=>{
        res=res.data
        if(res.status===200){
          this.ratioList=res.data
        }
      })
    },
    // 关闭弹窗
    closeDialog(){
      this.dialogRatio=false;
      this.dialogTitle='新增低佣比例'
      this.forbid=false
      this.systemType='';
      this.ratioList=[];
      this.ratioList.push({
        dealPriceMin:'',
        dealPriceMax:'',
        comPercentMin:'',
        judgeType:1
      })
      this.getList()
    },
    // 限制输入
    cutNumber(type,index){
      if(type==="dealPriceMin"||type==="dealPriceMax"){
        this.$nextTick(()=>{
          this.ratioList[index][type]=this.$tool.cutFloat({val:this.ratioList[index][type],max:999999999.99})
        })
      }else{
        this.$nextTick(()=>{
          this.ratioList[index][type]=this.$tool.cutFloat({val:this.ratioList[index][type],max:10})
        })
      }
    },
    changeRatio(type){
      if(type==="priceBegin"){
        this.$nextTick(()=>{
          this.searchForm.dealPriceMin=this.$tool.cutFloat({val:this.searchForm.dealPriceMin,max:999999999.99})
        })
      }else if(type==="priceEnd"){
        this.$nextTick(()=>{
          this.searchForm.dealPriceMax=this.$tool.cutFloat({val:this.searchForm.dealPriceMax,max:999999999.99})
        })
      }else if(type==="ratioBegin"){
        this.$nextTick(()=>{
          this.searchForm.comPercentMin=this.$tool.cutFloat({val:this.searchForm.comPercentMin,max:100})
        })
      }else if(type==="ratioEnd"){
        this.$nextTick(()=>{
          this.searchForm.comPercentMax=this.$tool.cutFloat({val:this.searchForm.comPercentMax,max:100})
        })
      }
    },
  },
  computed:{
    getUserMsg(){
      return this.getUser.user
    }
  } 
}
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
/deep/ .el-table th {
  background: @bg-th;
}
/deep/.top_border{
  border-top: 1px solid black;
}
.ratioMsg{
  /deep/.el-dialog__footer{
    padding-bottom: 10px;
    border-top: 1px solid #e8eaf6;
  }
}
.percent{
  position: relative;
  &::before{
    content: "%";
    position: absolute;
    right: 8px;
    color: #ccc;
  }
}
.contract-list {
  background-color: #fff;
  padding: 0 10px;
  border-radius: 2px;
  box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
}
.listTitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  .title {
    font-size: 14px;
    color: @color-blank;
    i {
      padding-right: 8px;
    }
  }
} 
.warning-box{
  padding-bottom: 10px;
  >p{
    font-size: 14px;
    text-align: center;
    &:first-of-type{
      margin: 5px 0;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .p_red{
    color: red;
  }
  ul{
    margin-top: 10px;
    li{
      padding-left: 40px;
      width: 450px;
      >span{
        padding: 2px 0;
        display: inline-block;
        width: 48%;
      }
    }
  }
}
.top{
  padding-left: 20px;
  .system{
    display: block;
    padding: 10px 0;
  }
  .ratioList{
    >span{
      display: inline-block;
      width: 45%;
      padding: 10px 0;
    }
    .hint{
      color:red;
      display: inline-block;
      padding-top: 20px;
    }
    ul{
      li{
        margin-bottom: 10px;
      }
    }
  }
}  
/deep/.form-label {
  position: relative;
  &:before {
    content: '*';
    display: inline-block;
    color: red;
  }
}
.dealPrice{
  display: inline-block;
  box-sizing: border-box;
  width: 120px;
  padding: 7px 15px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  &::-webkit-input-placeholder {
    color: #ccc;
  }
}
.icon {
  display: inline-block;
  cursor: pointer;
  .icon-tubiao_shiyong-14 {
    font-size: 22px;
    color: @color-blue;
  }
  .icon-tubiao_shiyong-4{
    font-size: 22px;
    color: @color-FF5;
  }
}
.pagination{
  /deep/.pagination-info{
    text-align: right;
    margin-top: 0;
  }
}
</style>