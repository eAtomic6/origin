<template>
    <div class="data-list">
        <div class="table_head">
            <el-button type="primary" @click="addProcess('添加交易流程')" v-if="power['sign-set-hq'].state">添加</el-button>
        </div>
        <div class="list1">
          <el-table :data="listData" style="width: 100%" border :max-height="tableHeight">
            <el-table-column align="center" label="序号" type="index" :formatter="nullFormatter" width="100"></el-table-column>
            <el-table-column align="left" label="名称" prop="name" :formatter="nullFormatter"></el-table-column>
            <el-table-column align="center" label="交易步骤数" prop="stepsNum" :formatter="nullFormatter"></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button @click="rowOperation(scope.row,'init')" type="text" size="small" v-if="power['sign-set-hq'].state">交易流程管理</el-button>
                <el-button @click="rowOperation(scope.row,'edit')" type="text" size="small" v-if="power['sign-set-hq'].state">编辑</el-button>
                <el-button @click="rowOperation(scope.row,'delete')" type="text" size="small" v-if="power['sign-set-hq'].state">删除</el-button>
              </template>
            </el-table-column> 
          </el-table>
        </div>
        <!-- 添加编辑交易流程 弹出框 -->
        <el-dialog :title="processTitle" :visible.sync="dialogProcessVisible" width="700px" class="processDialog" :closeOnClickModal="$tool.closeOnClickModal">
          <el-form v-model="addForm" size="small">
            <el-form-item label="名称:" class="add-form-item">
              <el-input v-model.trim="addForm.name" :maxlength="inputMax" onkeyup="value=value.replace(/\s+/g,'')"></el-input>
              <span class="text-absolute">{{validInput}}/{{inputMax}}</span>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm" class="confirmBtn" v-dbClick>确 定</el-button>
          </div>
        </el-dialog>
        <!-- 交易流程管理 弹出框 -->
        <el-dialog title="交易流程管理" :visible.sync="dialogManageVisible" width="740px" :closeOnClickModal="$tool.closeOnClickModal">
          <span class="flow-name">({{flowName}})</span>
          <div class="manage-list">
            <el-table :data="manageData" max-height="400" border>
              <el-table-column align="center" type="index" label="序号" width="45"></el-table-column>
              <el-table-column align="center" label="步骤类型" prop="stepsTypeName"></el-table-column>
              <el-table-column align="center" label="步骤名称" prop="stepsName"></el-table-column>
              <el-table-column align="center" label="计划天数" prop="planDays">
                <template slot-scope="scope">
                  <div>{{scope.row.planDays||scope.row.planDays===0?scope.row.planDays:'--'}}</div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="结算百分比(%)">
                <template slot-scope="scope">
                  <el-input class="percent" size="small" v-model="scope.row.settlePercent" @keyup.native="getInt(scope.$index)"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="Operation(scope.$index, 'up')" :disabled="scope.$index === 0">上</el-button>
                  <el-button type="text" @click="Operation(scope.$index, 'down')" :disabled="scope.$index === (manageData.length - 1)">下</el-button>
                  <el-button type="text" @click="Operation(scope.$index, 'delete')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div slot="footer" class="dialog-footer">
              <el-button plain @click="addBtn" class="addBtn">添 加</el-button>
              <el-button type="primary" class="confirmBtn" @click="confirmSteps('flow')" v-dbClick>确 定</el-button>
          </div>
        </el-dialog>
        <!-- 添加流程步骤 弹出框 -->
        <el-dialog title="添加流程步骤" :visible.sync="ProcessStepVisible" width="740px" :closeOnClickModal="$tool.closeOnClickModal">
          <el-table :data="StepsOption" border class="process-list" max-height="400">
            <el-table-column label="步骤类型">
              <template slot-scope="scope">
                <p>
                  <el-checkbox v-model="scope.row.stepsSelect" @change="allSelect(scope.$index,$event)">{{ scope.row.typeName }}</el-checkbox>
                </p>
              </template>
            </el-table-column>
            <el-table-column label="交易步骤">
              <template slot-scope="scope">
                <el-checkbox-group v-model="scope.row.tempList" @change="multiSelect(scope.$index,$event)">
                  <p v-for="item in scope.row.stepsList" :key="item.id"><el-checkbox :label="item.name">{{ item.name }}</el-checkbox></p>
                </el-checkbox-group>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
              <el-button type="primary" class="confirmBtn" @click="confirmSteps('steps')">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>
           
<script>
  import { FILTER } from "@/assets/js/filter"
  import {MIXINS} from "@/assets/js/mixins";
  export default {
    mixins: [FILTER,MIXINS],
    props: ["cityId"],
    data() {
      return {
        //交易流程列表
        listData: [], 
        addForm: {
          name: ""
        },
        processId: 0,
        processTitle: "",
        dialogProcessVisible: false, //添加交易流程
        dialogManageVisible: false, //交易流程管理
        ProcessStepVisible: false, //添加流程步骤
        //流程管理列表
        manageData: [],
        tempManage: [],
        isSettleOption: [
          {
            value: 0,
            label: '否'
          },
          {
            value: 1,
            label: '是'
          }
        ],
        //流程步骤选项
        StepsOption: [],
        flowCount: 0,
        currentFlowId: 0,
        AllSteps: [],
        inputMax: 30,
        flowName: "",
        tableHeight: 0,
        power: {
          'sign-set-hq': {
            state: false,
            name: '操作'
          }
        }
      };
    },
    created() {
      this.getData();
      this.getTypeSteps()
      let h = document.documentElement.clientHeight
      this.tableHeight = h - 40 - 140
    },
    methods: {
      // 获取交易流程列表
      getData: function() {
        this.$ajax.post('/api/flowmanage/selectFlowPageList', {cityId: this.cityId}).then(res => {
          res = res.data;
          if (res.status === 200) {
            this.listData = res.data;
          }
        }).catch(error => {
            this.$message({message:error})
        })
      },
      addProcess(title) {
        this.dialogProcessVisible = true
        this.processTitle = title
        this.addForm.name = ""
      },
      // 点击 交易流程管理 编辑 删除
      rowOperation(row, type) {
        this.flowName = row.name
        if(type === 'edit') {
          this.dialogProcessVisible = true
          this.processTitle = "编辑交易流程"
          this.processId = row.id
          this.addForm.name = row.name
        } else if(type === 'init') {
          this.dialogManageVisible = true
          this.currentFlowId = row.id
          let param = {
            flowId: row.id
          }
          this.$ajax.post('/api/flowmanage/selectFlowStepsList',param).then(res => {
            res = res.data
            if(res.status === 200) {
              this.manageData = res.data
              this.flowCount = this.manageData.length
            }
            this.manageData.forEach(i => {
              this.AllSteps.forEach((v,index) => {
                if(i.stepsName === v.name) {
                  i.sort = ++index
                }
              })
              i.settlePercent = i.settlePercent === 0 ? "" : i.settlePercent
            })
            this.tempManage = JSON.parse(JSON.stringify(this.manageData))
          }).catch(error => {
              this.$message({message:error})
          })
        } else if(type === 'delete') {
          const param = {
            id: row.id,
            isDel: 1,
            cityId: this.cityId
          }
          const msg = "删除成功"
          this.$confirm('是否删除此条交易流程', '删除交易流程', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.processPost(param,msg,type)
          }).catch(error => {
            this.$message({message:"取消删除"})
          })
        }
      },
      // 提交表单
      submitForm() {
        if(this.addForm.name === "") {
          this.$message("流程名称不能为空")
        } else {
          if(this.processTitle === "添加交易流程") {
            let param = {
              cityId: this.cityId
            }
            const msg = "添加成功"
            param = Object.assign({},this.addForm,param)
            this.processPost(param,msg)
          } else {
            let param = {
              id: this.processId,
              cityId: this.cityId
            }
            const msg = "修改成功"
            param = Object.assign({},this.addForm,param)
            this.processPost(param,msg)
          }
        }    
      },
      // 添加 编辑 删除 操作
      processPost(param,msg,type) {
        this.$ajax.postJSON('/api/flowmanage/insertFLow',param).then(res => {
          res = res.data
          if(res.status === 200) {
            this.$message(msg)
            if(!type) {
              this.dialogProcessVisible = false
            }
            this.getData()
          }
        }).catch(error => {
            this.$message({message:error})
        })
      },
      getTypeSteps() {
        this.StepsOption = []
        this.$ajax.post(`/api/flowmanage/selectTypeStepsList`, {cityId: this.cityId}).then(res => {
          res = res.data
          if (res.status === 200) {
            res.data.forEach(item => {
              this.StepsOption.push({
                typeId: item.typeId,
                stepsSelect: false,
                tempList: [],
                typeName: item.typeName,
                stepsList: item.stepsList
              })
            })
            this.StepsOption.forEach(item => {
              if(item.stepsList) {
                item.stepsList.forEach(e => {
                  this.AllSteps.push(e)
                })
              }
            })
          }
        })
      },
      Operation(index,type) {
        if(type === "up") {
          if(index > 0) {
            let upSort = this.manageData[index - 1]
            this.manageData.splice(index - 1, 1)
            this.manageData.splice(index, 0, upSort)
          }
        } else if(type === "down") {
          if((index + 1) !== this.manageData.length) {
            let downSort = this.manageData[index + 1]
            this.manageData.splice(index + 1, 1)
            this.manageData.splice(index, 0, downSort)
          }
        } else {
          this.manageData.splice(index, 1)
        }
      },
      addBtn() {
        this.ProcessStepVisible = true
        this.StepsOption.forEach(item => {
          item.tempList = []
          item.stepsSelect = false
        })
        this.manageData.forEach(i => {
          this.StepsOption.forEach(v => {
            if(i.stepsTypeName === v.typeName) {
              v.tempList.push(i.stepsName)
            }
            if(v.tempList.length) {
              if(v.tempList.length === v.stepsList.length) {
                v.stepsSelect = true
              } else {
                v.stepsSelect = false
              }
            }
          })
        })
      },
      // 全选
      allSelect(i,bool) {
        let arr = this.StepsOption[i]
        if(bool) {
          let ar = []
          arr.stepsList.forEach(item => {
            ar.push(item.name)
          })
          arr.tempList = ar
        } else {
          arr.tempList = []
        }
      },
      // 多选
      multiSelect(i,arr) {
        let obj = this.StepsOption[i]
        let bool = obj.stepsList.length === arr.length
        obj.stepsSelect = bool
      },
      confirmSteps(type) {
        if(type === 'steps') {
          let arr1 = []
          let arr2 = []
          this.manageData.forEach(i => {
            arr1.push(i.stepsName)
          })
          this.StepsOption.forEach(v => {
            arr2 = arr2.concat(v.tempList)
          })
          function getArrDifference(m,n) {
            return arr1.concat(arr2).filter(function(v,i,arr) {
              return arr.indexOf(v) === arr.lastIndexOf(v)
            })
          }
          let arr = getArrDifference(arr1,arr2)
          if(arr1.length < arr2.length) {
            this.managePush(arr)
          } else if(arr1.length > arr2.length) {
            let ar = []
            arr.forEach(i => {
              this.manageData.forEach(v => {
                if(i === v.stepsName) {
                  ar.push(v)
                }
              })
            })
            this.manageSplice(ar)
          } else {
            let ar1 = []
            let ar2 = []
            arr.forEach(i => {
              this.manageData.forEach(v => {
                if(i === v.stepsName) {
                  ar1.push(v)
                }
              })
            })
            arr.forEach(i => {
              arr2.forEach(v => {
                if(i === v) {
                  ar2.push(i)
                }
              })
            })
            this.manageSplice(ar1)
            this.managePush(ar2)
          }
          this.ProcessStepVisible = false
        } else if(type === 'flow') {
          function equar(a, b) {
            if (a.length !== b.length) {
                return false
            } else {
                for (let i = 0; i < a.length; i++) {
                    if (a[i].id !== b[i].id || a[i].isSettle !== b[i].isSettle || a[i].settlePercent !== b[i].settlePercent) {
                        return false
                    }
                }
                return true;
            }
          }
          let flag = equar(this.manageData,this.tempManage)

          let arr = []
          if(this.manageData.length) {
            this.manageData.forEach((item,index) => {
              if(this.flowCount === 0) {
                arr.push({
                  transStepsId: item.transStepsId,
                  sort: item.sort,
                  isSettle: item.isSettle,
                  settlePercent: item.settlePercent===""?0:item.settlePercent
                })
              } else {
                arr.push({
                  transStepsId: item.transStepsId,
                  sort: item.sort,
                  isSettle: item.isSettle,
                  id: item.id ? item.id : null,
                  settlePercent: item.settlePercent===""?0:item.settlePercent
                })
              }
            })
          }

          let param = {
            transFlowId: this.currentFlowId,
            transStepsList: arr
          }
          if(!this.flowCount) {
            if(arr.length) {
              const url = "/api/flowmanage/insertFLowSteps"
              this.flowManagePost(url,param)
            } else {
              this.dialogManageVisible = false
            }
          } else {
            if(!flag) {
              const url = "/api/flowmanage/updateFLowSteps"
              this.flowManagePost(url,param)
            } else {
              this.$message({message:'没有做任何修改'})
            }
          }
        }
      },
      manageSplice(array) {
        array.forEach(i => {
          this.manageData.forEach((v,index) => {
            if(i.stepsName === v.stepsName) {
              this.manageData.splice(index,1)
            }
          })
        })
      },
      managePush(array) {
        array.forEach(i => {
          this.AllSteps.forEach((item,index) => {
            if(i === item.name) {
              this.manageData.push({
                isSettle: 0,
                settlePercent: "",
                isSms: 0,
                overTimeDays: item.overTimeDays,
                planDays: item.planDays,
                stepsName: item.name,
                stepsTypeName: item.stepsTypeName,
                transStepsId: item.id,
                sort: ++index
              })
            }
          })
        })
      },
      flowManagePost(url,param) {
        this.$ajax.postJSON(url, param).then(res => {
          res = res.data
          if(res.status === 200) {
            this.$message(res.message)
            this.dialogManageVisible = false
            this.getData()
          }
        }).catch(error => {
            this.$message({message:error})
        })
      },
      //获取整数
      getInt:function (index) {
        for(var i = 0; i < this.manageData.length; i++) {
          if(i === index) {
            this.manageData[i].settlePercent = this.$tool.cutFloat({val:this.manageData[index].settlePercent,max:100})
            this.$set(this.manageData[i],'isSettle',1)       
          } else {
            this.manageData[i].settlePercent = ""
            this.$set(this.manageData[i],'isSettle',0)
          }
        }
      }
    },
    computed: {
      validInput() {
        return this.addForm.name.length
      }
    }
  };
</script>
<style lang="less" scoped>
  .data-list {
    .table_head {
      padding: 6px 10px;
      display: flex;
      justify-content: flex-end;
      background: #fff;
      border-top: 1px solid rgba(237,236,240,1);
      .el-button {
        width:80px;
        height:32px;
        padding: 4px 0;
        border-radius:18px;
      }
    }
    .list1 {
      padding: 0 12px;
      background-color: #fff;
      /deep/ .has-gutter th:nth-child(2) {
        text-align: center;
      }
    }
    .processDialog {
      .add-form-item {
        display: flex;
        /deep/ .el-form-item__label::before {
          content: "*";
          color: red;
        }
        .el-input {
          width: 600px;
        }
        .text-absolute {
          position: absolute;
          right: 10px;
          top: 0;
          color: #D6D6D6;
        }
      }
    }
    //交易流程管理
    .flow-name {
      position: absolute;
      left: 145px;
      top: 20px;
      color: #303133;
    }
    .manage-list {
      .el-table {
        border: 1px solid rgba(237,236,240,1);
      }
      /deep/ .el-input {
        width: 80px;
        .el-input__icon { line-height: 0; }
      }
      .percent {
        /deep/ .el-input__inner{
          ime-mode:disabled;
        }
      }
    }
    .process-list {
      border: 1px solid #ebeef5;
      p {
        line-height: 3;
        padding-left: 50px;
        border-bottom: 1px solid #ebeef5;
        &:last-child { border-bottom: none; }
        /deep/ .el-checkbox__label {
          width: 220px;
          white-space:normal;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      /deep/ .el-table__row {
          td:first-child {
            .cell { padding-left: 50px; }
          }
          td:last-child {
            padding: 0;
            .cell {
              padding: 0;
            }
          }
      }
    }
  }
</style>