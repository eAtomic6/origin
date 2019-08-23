<template>
    <div class="view-container">
        <div class="data-list gap">
            <span class='sjx'></span>
            <p class="title">   
                <span>数据列表</span>
            </p>
            <el-table :data="tableData" ref='onetable' border   @row-click="rowClick" class='onetable' :row-class-name='tableStyle' highlight-current-row>
                <el-table-column align="center" width="100px" label="序号" type="index"></el-table-column>
                <el-table-column align="center" label="款类(大类)" prop="name"></el-table-column>
            </el-table>
        </div>
        <div class="commission gap">
            <p class="title">
                <span>{{this.bigName}}</span>
                 <el-button type="primary" class='paper-btn' round size="medium"  v-show="power['sign-set-kl-add'].state==true && !isSF" @click='operation(null,1)'>新增</el-button> 
            </p>
            <el-table :data="moneyTypes" border>
                <el-table-column align="center" label="序号" type="index"></el-table-column>
                <el-table-column align="center" label="款类(小类)" prop="name"></el-table-column>
                <el-table-column align="center" label="描述" prop="remark">
                    <template slot-scope="scope">
                        <span v-if="scope.row.remark.length>24">
                        <el-popover trigger="hover"  width="160" placement="top">
                            <div>
                            {{scope.row.remark}}
                            </div>
                            <div slot="reference" class="name-wrapper three-row" :class="{'isFlex':scope.row.remark.length<16}">
                            {{scope.row.remark}}
                            </div>
                        </el-popover>
                        </span>
                        <span v-else-if="scope.row.remark.length>0">{{scope.row.remark}}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="收付配置" prop="accountType.label"></el-table-column>
                <el-table-column align="center" label="操作" :formatter="nullFormatter">
                    <template slot-scope="scope">
                        <div v-if="bigName =='代收代付' || !power['sign-set-kl-edit'].state">--</div>
                        <div v-else>
                            <el-button type="text" size="medium" v-if="power['sign-set-kl-edit'].state"  @click='operation(scope.row,2)'>编辑</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
          <!-- 添加 -->
        <el-dialog :title="title" :visible.sync="addDialog" width="740px" :closeOnClickModal="$tool.closeOnClickModal">
            <el-form :model="addForm"  class="addform" size="small">
                <div class="input-group">
                    <label>小类名称：</label>
                    <el-input type="text" v-model="addForm.name"></el-input>
                </div>
                 <div class="input-group">
                    <label>小类描述：</label>
                    <el-input type="textarea" :rows="4" resize='none' v-model="addForm.remark" placeholder="无备注内容" :maxlength="inputMax"></el-input>
                     <span class="text-absolute">{{validInput}}/{{inputMax}}</span>
                </div>
                <div class="input-group">
                    <label>收付配置：</label>
                    <div>
                        <el-select v-model="addForm.accountType" placeholder="请选择">
                            <el-option v-for="item in dictionary['58']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitForm" type="primary" round class="confirmBtn" v-dbClick>确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";
  import {MIXINS} from "@/assets/js/mixins";
    export default {
        mixins: [FILTER,MIXINS],
        data() {
            return {
                tableData: [],
                moneyTypes: [],
                cityName: "",
                title:'',
                smallId:'',
                addDialog:false,
                bigId:'',
                isSF:false,
                inputMax:200,
                bigName:'',
                dictionary: {
                '58':'',
                },
                addForm:{
                    parentId:'',
                    name:'',
                    accountType:1,
                    remark:''
                },//权限配置
                power: {
                    'sign-set-kl-add': {
                        state: false,
                        name: '新增'
                    },
                    'sign-set-kl-edit': {
                        state: false,
                        name: '编辑'
                    },
                    'sign-set-kl-query': {
                        state: false,
                        name: '查询'
                    },
                    
                }
            }
        },
        created(){
            this.getDictionary()
            this.initList()
        },
        computed: {
            validInput() {
                return this.addForm.remark.length
            }
        },
        methods: {
            initList(){
                //  if(this.power['sign-set-kl-query'].state){
                    this.$ajax.get('api/setting/moneyType/list',{id:this.bigId},).then((res)=>{
                    if(res.status==200){
                        if(this.bigId==''){
                            this.tableData=res.data.data
                            this.moneyTypes=res.data.data[0].moneyTypes
                            this.bigName=res.data.data[0].name
                            this.bigId=res.data.data[0].id
                        }else{
                            this.moneyTypes=res.data.data
                        }
                    }
                })
                // }else{
                //          this.noPower(this.power['sign-set-kl-query'].name)
                // }
            },
            tableRowClassName({row, rowIndex}){
                row.index = rowIndex;
            },
            operation(row,type){
                this.addDialog=true
                if(type==1){
                    this.title=`新增【${this.bigName}】小类`,
                    this.addForm.name=''
                    this.addForm.accountType=1
                    this.addForm.remark=''
                    this.addForm.parentId=this.bigId
                }else if(type==2){
                    this.title=`编辑【${this.bigName}】小类`,
                    this.smallId=row.id
                    this.addForm.name=row.name
                    this.addForm.accountType=row.accountType.value
                    this.addForm.remark=row.remark
                    this.addForm.parentId=row.parentId
                }
            },
            trim(str){  
                 return str.replace(/(^\s*)|(\s*$)/g, "")
            },
            submitForm(){
                if(this.trim(this.addForm.name)==''){
                    this.$message({
                        type: 'error',
                        message: '小类名称不能为空'
                    })
                    return
                }
                if(this.trim(this.addForm.name).length>10){
                    this.$message({
                        type: 'error',
                        message: '小类名称长度必须在10位以内!'
                    })
                    return
                }
                if(this.title==`新增【${this.bigName}】小类`){
                    this.addForm.name=this.trim(this.addForm.name)
                     if(this.power['sign-set-kl-add'].state){
                         this.$ajax.post('api/setting/moneyType/insert',this.addForm).then((res)=>{
                        if(res.status==200){
                            this.$message({
                            type: 'success',
                            message: '添加成功!'
                            })
                            this.addDialog=false
                            this.initList()
                        }
                        }).catch(error=>{
                            this.$message({
                            type: 'error',
                            message: error
                            })
                        })
                     }else{
                         this.noPower(this.power['sign-set-kl-add'].name)
                     }
                   
                }else if(this.title==`编辑【${this.bigName}】小类`){
                    let param={
                        id:this.smallId,
                        accountType:this.addForm.accountType,
                        name:this.trim(this.addForm.name),
                        remark:this.addForm.remark
                    }
                    this.statusOp(param,'修改成功')
                }
                
            },
            statusOp(param,message){
                if(this.power['sign-set-kl-edit'].state){
                    this.$ajax.put('/api/setting/moneyType/update',param,2)
                   .then((res)=>{
                        if (res.status === 200) {
                            this.$message({
                                type: 'success',
                                message: message
                            })
                            this.initList()
                        }
                         this.addDialog=false
                   }).catch(error=>{
                     this.$message({
                        type: 'error',
                        message: error
                        })
                  })
                }else{
                    this.noPower(this.power['sign-set-kl-edit'].name)
                }
            },
            //表格第一行加样式
            tableStyle({row, rowIndex}){
                row.index = rowIndex;
                if(rowIndex==0){
                    return 'linestyle'
                }
            },
            //单击行事件
            rowClick(row, event, column) {
                this.bigName=row.name
                var paperBtn=document.getElementsByClassName('paper-btn')
                if(row.name=='代收代付'){
                    this.isSF=true
                    paperBtn[0].disabled=true
                    paperBtn[0].classList.add('grey')
                }else{
                     paperBtn[0].disabled=false
                     this.isSF=false
                     paperBtn[0].classList.remove('grey')
                }
                this.$refs.onetable.$el.classList.remove('onetable')
                this.addForm.parentId=row.id
                this.bigId=row.id
                this.initList()
            }
        }
    }
</script>

<style lang="less" scoped>
.view-container {
    display: flex;
    height: 100%;
    background-color: #F5F5F5 !important;
    .data-list {
        position: relative;
        min-width: 26%;
        margin-right: 1%;
        background-color: #fff;
        box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
        border-radius:4px;
        > .sjx{
                width:0;
                right:-14px;
                top: 18.5px;
                position: absolute;
                border-width:7px;
                border-style:solid;
                border-color:transparent transparent transparent white; /* transparent 设置边框颜色透明 */
        }
        /deep/ .el-table{
         th {
            background:rgba(242,243,248,1);
            }
        }
        .el-table {
            border:1px solid rgba(232, 234, 246, 1);
            border-radius:4px 4px 0px 0px;
        }
    }
    .commission {
        min-width: 72%;
        background:rgba(254,252,247,1);
        box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
        border-radius:4px;
        .el-table {
            height: calc(100% - 48px);
            overflow-y: auto;
        }
        /deep/ .el-table 
        th {
            background:#eef2fb;
        }
        /deep/ td:last-child div {
            height: 35.6px;
            line-height: 35.6px;
        }
        /deep/ td.is-center{
            background-color: #fefcf7;
        }
    }
    .gap {
        padding: 0px 10px 0;
        box-sizing: border-box;
    }
    .title {
        padding: 6px 0;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 18px;
        > span{
            font-size: 14px;
        }
    }
    .citySettingContent {
        .tip {
            display: flex;
            color: #FF3E3E;
            span {
                margin-right: 5px;
            }
        }
        .cityList {
            margin: 20px 0 50px;
            .cityName {
                display: flex;
                flex-wrap: wrap;
                > .el-checkbox {
                    margin-right: 20px;
                    width: 120px;
                    &:first-child{
                        margin-left: 30px;
                    }
                }
            }
        }
        .dialog-footer {
            display: flex;
            justify-content: flex-end;
            .el-button {
                width:100px;
                height:36px;
                border-radius:18px;
            }
        }
    }
}
/deep/ .el-dialog__header {
    border: 1px solid rgba(232, 234, 246, 1);
}
/deep/ .el-table::before{
    height: 0;
}
/deep/ .onetable tr.linestyle{
    background-color: #ECF5FF;
}
/deep/ .el-dialog .el-dialog__body {
    padding: 10px 10px;
}
/deep/ .addform .input-group{
      &:nth-child(1) label::before{
           content: "*";
           color: red;
           position: relative;
           margin-right: 2px;
           top: 3px;
      }
      .el-input__inner{
       width: auto
    }
     &:nth-child(2){
         align-items: flex-start;
         position: relative;
     }
}

.paper-btn{
    width: 100px;
}
.grey{
    background-color: #F5F5F5;
    color:#ACA899;
    border: 1px solid #DDD;
}
  .name-wrapper {
    min-width: 80px;
    max-height: 65px;
    display: -webkit-box;
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
.text-absolute {
      position: absolute;
      right: 4px;
      color: #D6D6D6;
      bottom: 0;
    }
</style>

