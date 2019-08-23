<template>
  <el-dialog
    title="选择审核人"
    custom-class="dialog-z-index"
    :visible="show"
    :closeOnClickModal="$tool.closeOnClickModal"
    @close="close"
    append-to-body
    width="740px">
    <div class="dialog-container">
      <p v-if="showLabel">下一审核节点无审核人，请先设置下一节点审核人</p>
      <div class="chose-box">
        <span>{{page==='detail'?'设置':(type===1||type===3)?'设置':'转交'}}审核人</span>
        <div class="box-content">
          <div class="box-content-input">
            <el-select :clearable="true" filterable remote :remote-method="searchDep" size="small" v-model="choseItem.depId" placeholder="部门" @change="getOption('dep')" @visible-change="initDep" @clear="clearDep">
              <el-option
                v-for="item in deps"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select :clearable="true" filterable remote :remote-method="searchEmp" class="w140" size="small" v-model="choseItem.empId" placeholder="人员" @visible-change="initEmp"  @change="getOption('emp')">
              <el-option
                v-for="item in emps"
                :key="item.empId"
                :label="item.name"
                :value="item.empId">
              </el-option>
            </el-select>
          </div>
          <p>（在人员处搜索姓名并选择后可自动带出人员所在部门）</p>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button size="small" class="btn-info" round @click="opera('close')">返 回</el-button>
    <el-button size="small" class="btn-info" round type="primary" @click="opera('submit')">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  let _depList=[]
  export default {
    name: "check-person",
    props:{
      show:{
        type:Boolean,
        // default:false
      },
      type:{//1.设置当前审核人（设置），2.设置当前审核人（转交），3.设置下一个审核人
        type:Number,
        default:1
      },
      bizCode:{
        type:[String,Number],
        default:''
      },
      flowType:{
        type:Number,
      },
      showLabel:{//是否显示label文本
        type:Boolean,
        default:true
      },
      page:{
        type:String,
        default:'detail'
      }
    },
    data(){
      return{
        deps:[],
        emps:[],
        choseItem:{
          depId:'',
          empId:''
        },
        inputEmp:false,//是否手动搜索
      }
    },
    created(){
      this.searchDep('',true)
      /*this.$message({
        message:'test',
        customClass:'test'
      })*/
    },
    methods:{
      opera:function (type) {
        if(type==='close'){
          this.$emit('close')
        }else {
          let param = {
            bizCode:this.bizCode,
            flowType:this.flowType,
            userId:this.choseItem.empId,
          }
          this.emps.forEach(item=>{
            if(item.empId===this.choseItem.empId){
              param.userName=item.name
            }
          })
          if(param.userId!==''){
            this.$ajax.post(this.type===3?'/api/machine/changeAuditorNext':'/api/machine/changeAuditorNow',param).then(res=>{
              res=res.data
              if(res.status===200){
                this.$message({
                  message:"操作成功",
                  type:'success'
                })
                this.$emit('submit',this.choseItem)
              }
            }).catch(error=>{
              this.$message({
                message:error
              })
            })
          }else {
            this.$message({
              message:'请选择审核人'
            })
          }

        }
      },
      close:function () {
        this.$emit('close')
      },
      clearDep:function () {
        this.searchDep()
      },
      //获取部门
      searchDep:function (val,init=false) {
        this.inputEmp=false
        let param={
          keyword:!val?'':val, //部门名称关键字
          type:this.type===3?1:0, //当前节点/下一节点
          bizCode:this.bizCode, //业务编码
          flowType:this.flowType  //流程类型
        }
        this.$ajax.get('/api/machine/selectDept',param).then(res=>{
          res=res.data
          if(res.status===200){
            if(init){
              _depList = res.data
            }
            this.deps=[].concat(res.data)
          }
        })
      },
      //搜索人员
      searchEmp:function (val) {
        let param={
          keyword:!val?'':val,
          type:this.type===3?1:0,
          depId:this.choseItem.depId,
          bizCode:this.bizCode,
          flowType:this.flowType
        }
        if(val&&val.length>0){
          this.inputEmp=true
          // param.depId=''
        }
        this.$ajax.get('/api/machine/selectEmp',param).then(res=>{
          res=res.data
          if(res.status===200){
            this.emps=[].concat(res.data)
          }
        })
      },
      initDep:function (val) {
        // debugger
        if(!val){
          this.deps=_depList.map(item=>Object.assign({},item))
        }
      },
      initEmp:function (val) {
        if(!val){
          if(this.choseItem.depId===''){
            this.emps=[]
            this.inputEmp=false
          }else if(this.emps.length===0){
            this.searchEmp()
          }
        }
      },
      //下拉选择
      getOption:function (type) {
        if(type==='dep'){
          // debugger
          this.choseItem.empId=''
          this.emps = []
          if(this.choseItem.depId!==''){
            this.searchEmp()
          }
        }else {
          if(this.inputEmp){
            this.emps.find(item=>{
              if(item.empId===this.choseItem.empId){
                // this.deps=[].concat({name:item.depName,id:item.depId})
                this.choseItem.depId=item.depId
                this.searchEmp()
                this.inputEmp=false
              }
            })
          }
        }
      }
    },
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  .test{
    z-index: 9999;
  }
  .dialog-z-index{
    z-index: 10;
  }
  .btn-info{
    width: 100px;
  }
.dialog-container{
  padding: 20px 50px 20px 10px;
  >p{
    margin-bottom: 30px;
    &:first-of-type{
      color: red;
      position: relative;
      &:before{
        content: '*';
        display: inline-block;
        width: 10px;
      }
    }
  }
  .chose-box{
    display: flex;
    >span{
      height: 32px;
      line-height: 32px;
      margin-right: @margin-10;
    }
    .box-content{
      >p{
        margin-top: @margin-15;
        color: @color-99A;
      }
    }
  }
}
</style>

