<template>
  <div class="view-container" ref="tableComView">
    <!-- 头部表单 -->
    <ScreeningTop
    @propQueryFn="queryFn"
    @propResetFormFn="resetFormFn">
      <el-form :inline="true" :model="searchForm" class="form-head" size="small">
         <el-form-item label="体系">
          <el-select v-model="searchForm.sysid" filterable :clearable="true">
            <el-option v-for="item in systemTagList" :key="item.key" :label="item.value" :value="item.key"></el-option>
            <!-- <el-option v-for="item in dictionary['638']" :key="item.key" :label="item.value" :value="item.key"></el-option> -->
          </el-select>
        </el-form-item>

        <el-form-item label="设置时间"  >
          <el-date-picker
          v-model="searchForm.dateMo"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="最新修改时间">
          <el-date-picker
          v-model="searchForm.dateMoTwo"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
       
      </el-form>
    </ScreeningTop>
    <!-- table表格 -->
    <div class="company-list">
      <p >
        <span><i class="iconfont icon-tubiao-11 mr-8"></i>数据列表</span>
        <el-button @click="addSys" type="primary" icon="el-icon-plus">新增业绩申诉有效时间</el-button>
      </p>
      <el-table :data="tableData" style="width: 100%" border ref="tableCom" :max-height="tableNumberCom">
        <el-table-column align="center" label="体系"  width="90">
          <template slot-scope="scope">
            <span v-for="item in systemTagList" :key="item.key" v-if="item.key===scope.row.systemTag">{{item.value}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="业绩申诉有效时间">
          <template slot-scope="scope">
            <span>{{scope.row.effectTime}}{{scope.row.timeUnit==1?'小时':'天'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="设置时间"  min-width="50">
           <template slot-scope="scope">
            <span>{{scope.row.settingTime|formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="最新修改时间"  min-width="60">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime|formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="60">
          <template slot-scope="scope">
            <el-button type="text" class="edit-btn" @click="adclick2(scope.row)" size="medium">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        v-show="tableData.length"
        class="pagination-info"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="count">
      </el-pagination> -->
    </div>
    <el-dialog :title="title+'业绩申诉有效时间'" class="aeform" :visible.sync="AEdialog" :closeOnClickModal="$tool.closeOnClickModal">
      <el-dialog
      width="530px"
      title="确认保存"
      :closeOnClickModal="$tool.closeOnClickModal"
      :visible.sync="innerVisible"
      append-to-body>
      <div class="inner">
        <p>确认保存新的业绩申诉有效时间？</p>
        <p class="p_red">新的业绩申诉有效时间会覆盖原来的业绩申诉有效时间</p>
        <p v-if="title=='编辑'" style="margin-top:5px">当前业绩申诉有效时间为{{apltime}}{{timeUnit==1?'小时':'天'}}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false" round>取 消</el-button>
        <el-button type="primary" @click="adclick('',1)" round>确 定</el-button>
      </div>
    </el-dialog>
        <el-form :inline="true" size="medium">
        <el-form-item label="体系：" >
          <el-select v-model="formSys" :disabled="title=='编辑'?true:false" placeholder="请选择体系" :clearable="true">
           <el-option v-for="item in systemTagList" :key="item.key" :label="item.value" :value="item.key"></el-option>
            <!-- <el-option v-for="item in dictionary['638']" :key="item.key" :label="item.value" :value="item.key"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="业绩申诉有效时间：" >
          <el-input v-model="apltime" @keyup.native="numberFn"></el-input>
          <el-select v-model="timeUnit" placeholder="请选择" style="margin-left:20px">
            <el-option v-for="item in dictionary['656']" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
          <el-tooltip content="当前设置时间，如设置时间为3天，即业绩申诉三天后为无效申诉。" placement="top-start">
          <i class="el-icon-info"></i>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <p style="color:red">注：设置新的业绩申诉有效时间成功后，原来的业绩申诉有效时间被替换。</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AEdialog = false" round>取 消</el-button>
        <el-button type="primary" @click="outercli" round>保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";

  export default {
    name: "company",
    mixins: [MIXINS],
    data() {
      return {
        // 搜索表单中的数据
        searchForm: {
          sysid:'',
          dateMo:[],
          dateMoTwo:[],
        },
        
        timeUnit:'',
        sysList:[],
        AEdialog:false,
        innerVisible:false,
        formSys:'',
        apltime:'',
        title:'新增',
        searchTime: [],
        tableData: [], //公司设置列表
        pageSize: 10,
        pageNum: 1,
        id:'',
        // count: 0,
        dictionary: {
          '638':'',
          '656':''
        },
        //权限配置
        power: {
          
        },
      }
    },
    created(){
      this.getSystemTag()
      this.getDictionary()
      var param={
        cityId:this.cityInfo2.cityId,
        systemTag:this.searchForm.sysid,
        settingTimeStart:this.searchForm.dateMo?this.searchForm.dateMo[0]:'',
        settingTimeEnd:this.searchForm.dateMo?this.searchForm.dateMo[1]:'',
        updateTimeStart:this.searchForm.dateMoTwo?this.searchForm.dateMoTwo[0]:'',
        updateTimeEnd:this.searchForm.dateMoTwo?this.searchForm.dateMoTwo[1]:'',

      }
            let res=this.getDataList
            if(res&&(res.route===this.$route.path)){
                this.tableData=res.data
                let session = JSON.parse(sessionStorage.getItem('sessionQuery')).query
                this.searchForm.sysid=session.systemTag,
                this.searchForm.dateMo=session.settingTimeStart
                ? [session.settingTimeStart, session.settingTimeEnd]
                : [];
                this.searchForm.dateMoTwo=session.updateTimeStart
                ? [session.updateTimeStart, session.updateTimeEnd]
                : [];
            }else{
                this.getData(param)
            }
      
    },
    mounted() {
    },
    methods: {
      getData(param){
        this.$ajax.get('/api/appealsetting/operateQry',param).then(res=>{
          this.tableData=res.data.data
        }).catch(err=>{
          this.$message({message:err})
        })
      },
      outercli(){
          if(this.formSys==''){
          this.$message({message:'体系不能为空'})
          return
        }
        if(this.apltime===''){
          this.$message({message:'业绩申诉有效时间不能为空'})
          return
        }
        if(this.timeUnit==''){
          this.$message({message:'请选择业绩申诉有效时间单位不能为空'})
          return
        }
        this.innerVisible=true
      },
      addSys(){
        this.title='新增'
        this.AEdialog=true
        this.formSys=''
          this.apltime=''
          this.timeUnit=''
      },
      adclick2(row){
          this.AEdialog=true
          this.title='编辑'
          this.id=row.id
          this.formSys=row.systemTag
          this.apltime=row.effectTime
          this.timeUnit=row.timeUnit
      },
      adclick(){
          if(this.title=='编辑'){
            var param={
            cityId:this.cityInfo2.cityId,
            systemTag:this.formSys,
            effectTime:Number(this.apltime),
            id:this.id,
            timeUnit:this.timeUnit
          }
          }else{
            var param={
            cityId:this.cityInfo2.cityId,
            systemTag:this.formSys,
            effectTime:Number(this.apltime),
            timeUnit:this.timeUnit
          }
          }
         

        this.$ajax.postJSON('/api/appealsetting/operate',param).then(res=>{
          if(res.status==200){
            this.AEdialog=false
            this.innerVisible=false
            this.$message({message:'操作成功'})
            let param={
              cityId:this.cityInfo2.cityId,
              systemTag:this.searchForm.sysid,
              settingTimeStart:this.searchForm.dateMo?this.searchForm.dateMo[0]:'',
              settingTimeEnd:this.searchForm.dateMo?this.searchForm.dateMo[1]:'',
              updateTimeStart:this.searchForm.dateMoTwo?this.searchForm.dateMoTwo[0]:'',
              updateTimeEnd:this.searchForm.dateMoTwo?this.searchForm.dateMoTwo[1]:'',

      }
            this.getData()
          }
        }).catch(err=>{
          this.$message({message:err})
        })
      },
      numberFn(){
        this.apltime=this.$tool.numberInput(this.apltime)
        // this.apltime=Number(this.apltime)
      },
      //关闭模态窗
      handleClose(done) {
        this.creditCodeShow = false
        this.icRegisterShow = false
        this.delIds = []
        done()
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getCompanyList()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getCompanyList('pagination')
      },
      queryFn() {
        let param={
        cityId:this.cityInfo2.cityId,
        systemTag:this.searchForm.sysid,
        settingTimeStart:this.searchForm.dateMo?this.searchForm.dateMo[0]:'',
        settingTimeEnd:this.searchForm.dateMo?this.searchForm.dateMo[1]:'',
        updateTimeStart:this.searchForm.dateMoTwo?this.searchForm.dateMoTwo[0]:'',
        updateTimeEnd:this.searchForm.dateMoTwo?this.searchForm.dateMoTwo[1]:'',

      }
        sessionStorage.setItem('sessionQuery',JSON.stringify({
                        path:'/aplTime',
                        url:'/appealsetting/operateQry',
                        query:Object.assign({},param,{empName:this.dep.empName}),
                        methods:"get"
        }))
      this.getData(param)
      },
      resetFormFn() {
        this.searchForm.sysid='',
        this.searchForm.dateMo=[]
        this.searchForm.dateMoTwo=[]

      },
     
     
    },
    filters: {
    },
    computed: {
      cityInfo2(){
        return this.getUser.user
      }
    }
}
</script>

<style lang="less" scoped>
@import "~@/assets/common.less";
.form-head {
  background-color: #fff;
  border-radius:2px;
  box-sizing: border-box;
  .el-form-item {
    margin-bottom: @margin-10;
    &:first-child {
        width: 280px;
        /deep/ .el-input {
            width: 240px;
      }
    }
  }
  
  .w140 {
    .el-input {
      width: 140px;
    }
  }
  .w180 {
    margin-right: 40px;
    /deep/ .el-input {
      width: 180px;
    }
  }
}
.company-list {
  background-color: #fff;
  padding: 0 10px;
  margin-top: 20px;
  > p {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: @size-14;
    .mr-8 {
      margin-right: 8px;
    }
    > .el-button {
      width:200px;
      padding: 9px 15px;
      border-radius:18px;
      display: flex;
      justify-content: center;
      color: #fff;
    }
  }
  .edit-btn{
    margin-left: 0!important;
  }
}
.dialog-info {
  .company-info {
    padding: 10px 20px;
    /deep/ .el-form-item__label::before {
      content: "*";
      color: red;
      position: relative;
      top: 3px;
      margin-right: 1px;
    }
    > p {
      font-size: 14px;
      font-weight: bold;
      // margin-bottom: @margin-10;
      color:rgba(35,50,65,1);
    }
    .tip {
      display: flex;
      span {
        color: #333;
        font-weight: bold;
        margin-right: 10px;
      }
      .message>p:last-child {
        color: #CD6D6D;
        i { font-weight: bold; color: #D56868; }
      }
    }
    &:first-child {
      .info-content {
        > .item {
          display: flex;
          &-display {
            justify-content: space-between;
          }
          > .el-form-item {
            display: flex;
            margin-bottom: 0;
            /deep/ .el-input {
              width: 200px;
              .el-input__inner {
                height: 32px!important;
              }
            }
          }
          &.shuiwu {
            /deep/ .el-input {
              width: 186px;
            }
          }
          .allow {
            /deep/ .el-input {
              width: 158px;
            }
          }
          .store-name {
            margin-left: -12px;
          }

          .id-card {
            margin-left: 42px;
          }
          .tongyi {
            margin-left: 97px;
          }
          .gongshang {
            margin-left: 139px;
          }
          .zuzhi {
            margin-left: 124px;
          }
        }
      }
      /deep/ .notice {
        width: 342px;
        height: 56px;
        background-color: #000;
        position: fixed;
        left: 40%;
        top: 5%;
        border-radius: 4px;
        display: flex;
        align-items: center;
        color: #fff;
        justify-content: center;
        &-icon {
          margin-right: 10px;
          margin-top: 2px;
          &::before {
            color: red;
          }
        }
      }
    }
    &:nth-child(2) {
      border-top: 1px solid #edecf0;
      /deep/ .el-table__header-wrapper {
        display: none;
      }
      .el-table__row {
        .el-form-item {
          // display: flex;
          margin-bottom: 0;
          /deep/ .el-form-item__label{
            padding: 0;
          }
        }
      }
      .addBankRow {
        .button {
          display: inline-block;
          padding: 0;
          width: 30px;
          height: 30px;
          line-height: 30px;
          background: #c8c8c8;
          border-radius: 50%;
          text-align: center;
          cursor: pointer;
          i {
            color: #fff;
            font-weight: bold;
          }
        }
        .direct-sale {
          display: none;
        }
        /deep/ .el-input {
          width: 168px;
        }
        /deep/ .card-owner {
          width: 200px;
        }
        /deep/ .bank-branch {
          width: 150px!important;
        }
        /deep/ .property {
          .el-input {
            width: 95px!important;
            height: 32px;
          }
        }
        /deep/ .bank-item {
          .el-input {
            height: 32px;
          }
        }
        &.el-table {
          tr:first-child td:last-child {
            span:last-child {
              display: none;
            }
          }
          /deep/ .cell {
            padding: 0;
          }
        }
      }
      /deep/ .el-table::before {
        display: none;
      }
      /deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
        background-color: #fff!important;
      }
      /deep/ .el-table td { border: 0; padding: 0; }
    }
    &:last-child {
      border-top: 1px solid #edecf0;
      > div {
        display: flex;
        margin-bottom: @margin-10;
        &.tip {
          margin-bottom: 0;
        }
        > .stamp {
          display: inline-block;
          flex: 1;
          > span {
            color:rgba(35,50,65,1);
          }
          > .upload {
            display: flex;
            margin-top: @margin-10;
            .point::before {
              content: "*";
              color: red;
              position: relative;
              top: 3px;
            }
            > ul {
              display: flex;
              li {
                width: 120px;
                height: 120px;
                border:1px dashed #DEDDE2;
                border-radius: 4px;
                margin-right: 10px;
                position: relative;
                cursor: pointer;
                text-align: center;
                > img {
                  width: 60px;
                  height: 60px;
                  border-radius: 4px;
                }
                .text {
                  position: absolute;
                  font-size: @size-base;
                  bottom: 10px;
                  left: 35px;
                  color: #233241;
                }
                .pic-name {
                  position: absolute;
                  font-size: @size-base;
                  bottom: -25px;
                  color: #233241;
                  width: 120px;
                  height: 48px;
                  text-align: center;
                  z-index: 10;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  word-wrap: break-word;
                }
                .del {
                  position: absolute;
                  width: 20px;
                  height: 20px;
                  background-color: #F56C6C;
                  border-radius: 50%;
                  right: 8px;
                  top: 8px;
                  text-align: center;
                  line-height: 20px;
                  color: #fff;
                  display: none;
                }
                &:first-child {
                  .up {
                    width: 50px;
                    height: 50px;
                    background-color: #EEF2FB;
                    line-height: 50px;
                    text-align: center;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);
                  }
                  i {
                    font-size: 56px;
                    color:#fff;
                  }
                }
                &:last-child {
                  >div {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);
                  }
                  border: none;
                  background-color: #F2F3F8;
                  &:hover .del {
                    display: inline-block;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .view-content {
    padding: 20px 20px 50px;
    > p {
      text-align: center;
      font-size: 20px;
    }
    > div {
      overflow: hidden;
      margin-top: 20px;
      > span {
        display: block;
        color: #333;
        font-weight: bold;
      }
      > p {
        display: flex;
        align-items: center;
        line-height: 2;
        > span {
          flex: 1;
        }
        .card-no {
          padding-left: 84px;
        }
      }
      > .stamp {
        width: 50%;
        display: flex;
        float: left;
        margin-top: 20px;
        span { margin-right: 5px; }
        > div {
          width: 160px;
          height: 160px;
          background-color: rgba(236,238,241,1);
          position: relative;
          border-radius: 8px;
          /deep/ .picture {
            position: absolute;
            top: -6px;
            font-size: 160px!important;
          }
        }
      }
    }
  }
  .dialog-footer {
    height: 36px;
    .el-button {
      width:100px;
      height:36px;
      border-radius:18px;
    }
  }
}
.p_red{
  color: red;
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid rgba(237,236,240,1);
}
/deep/ .el-dialog__footer {
  padding-top: 0;
  padding-bottom: 10px;
}
/deep/ .el-table th {
  background:rgba(238,242,251,1);
}
/deep/ .el-dialog__body {
  padding: 26px;
  border-bottom: 1px solid #EDECF0;
}
.aeform /deep/ .el-form-item__content{
  display: flex;
}
/deep/ .el-dialog__footer{
  padding: 10px;
}
.inner{
  text-align: center;
  font-size: 14px;
  color: #606266;
  p:first-child{
    font-size: 16px;
    color: #000;
    margin-bottom: 5px;
  }
}
.aeform /deep/ .el-icon-info{
  position: relative;
  top:12px;
  left: 10px;
}
</style>
