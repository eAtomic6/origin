<template>
	<div>
		<el-dialog :title="`${version===1?'新增':version===2?'新增均摊':'编辑'}`+'支出'" width="30%" :visible="getDialogVisible" @close='close' class="set-dialog" :closeOnClickModal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal">
            <el-form :model="ruleForm" ref="ruleForm" label-width="110px" size="small">
                <el-form-item size="small" label="部门" v-if="version===1||version===3" class="form-item">
                    <!-- <select-tree :data="DepList" :init="ruleForm.deptName" @checkCell="depHandleClick" @clear="clearDep"
                         @search="searchDep" treeType="power"></select-tree> -->
                    <el-select v-model="ruleForm.deptId" @change="getDepName" filterable>
                        <el-option v-for="item in version===1?DepList:depsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="均摊部门范围" v-if="version===2" class="form-item">
                    <!-- <el-select v-model="ruleForm.depArray" multiple class="w300" filterable :filter-method="depSearch" @visible-change="visibleFn" @remove-tag="delFn">
                        <el-option value="">
                            <el-tree :data="DepList" :props="depsProp" accordion @node-click="clickNode"></el-tree>
                        </el-option>
                    </!-->
                    <el-select v-model="ruleForm.depArray" multiple filterable class="w300" @change="multiSelect">
                        <el-option v-for="item in DepList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="均摊部门类型" v-if="version===2" class="form-item item-color">
                    <el-radio-group v-model="ruleForm.shareType" @change="checkTypeFn">
                    <el-radio-button :label="0">分店</el-radio-button>
                    <el-radio-button :label="1">分组</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="支出类别" class="form-item item-color">
                    <el-radio-group v-model="ruleForm.moneyType">
                    <el-radio-button :label="2">动态成本</el-radio-button>
                    <el-radio-button :label="3">固定成本</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="费用项" class="form-item">
                    <el-input v-model="ruleForm.moneyDepiction" maxlength="100" clearable></el-input>
                </el-form-item>
                <el-form-item label="金额" class="money-item form-item">
                    <el-input v-model="ruleForm.money" @input="cutNumber" clearable><template slot="append">元</template></el-input>
                    <span style="color: red;" v-if="ruleForm.depArray.length&&ruleForm.shareType!==''&&ruleForm.money&&divideBool">{{divideTip}}</span>
                </el-form-item>
                <el-form-item label="支出时间" class="form-item">
                    <el-date-picker
                    v-model="ruleForm.moneyTime"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" class="remark-input">
                    <el-input type="textarea" v-model="ruleForm.remark" maxlength="250"></el-input>
                    <span>{{ruleForm.remark.length}}/250</span>
                </el-form-item>
            </el-form>
            <div class="dialog-footer">
                <div class="next" v-if="version!=3">
                    <el-checkbox v-model="checked">继续创建下一个</el-checkbox>
                </div>
                <div class="confirm-btn">
                    <el-button size="small" @click="close">取 消</el-button>
                    <el-button size="small" style="background-color: #38BD8B; color: white;" @click="sureFn(version)" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
                </div>
            </div>
		</el-dialog>
	</div>
</template>

<script>
import {MIXINS} from "@/assets/js/mixins";

export default {
  name: 'add-pay',
  mixins: [MIXINS],
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    version: {
        type: Number,
        default: 1
    },
    propData: {
        type: Object,
        default() {
            return {}
        }
    }
  },
  data() {
    return {
        ruleForm: {
            deptId: '',
            deptName: '',
            depArray: [],
            deps: [],
            shareType: '',
            moneyType: '',
            moneyDepiction: '',
            money: '',
            moneyTime: '',
            remark: ''
        },
        pickerOptions: {
            disabledDate(time) {
                return time.getTime() > Date.now();
            }
        },
        checked: false,
        divideTip: '',
        divideBool: false,
        fullscreenLoading: false,
        depsList: []
    };
  },
  created() {
    this.remoteMethod('power')
    // 编辑支出带出赋值
    if(this.version === 3) {
        this.ruleForm.deptId = this.propData.deptId
        this.ruleForm.deptName = this.propData.deptName
        this.ruleForm.moneyType = this.propData.moneyType
        this.ruleForm.moneyDepiction = this.propData.moneyDepiction
        this.ruleForm.money = this.propData.money
        this.ruleForm.moneyTime = this.propData.moneyTime
        this.ruleForm.remark = this.propData.remark
    }
  },
  methods: {
    close() {
      this.$emit("closePayDialog");
    },
    cutNumber() {
        this.ruleForm.money = this.$tool.cutFloat({val:this.ruleForm.money,max:999999999.99})
        if(this.ruleForm.money&&this.ruleForm.depArray.length&&this.ruleForm.shareType!=='') {
            this.getTips()
        }
    },
    getTips() {
        let arr = []
        this.ruleForm.deps.forEach(item => {
            arr.push(item.id+','+item.name)
        })
        let param = {
            deps: arr,
            shareType: this.ruleForm.shareType,
            money: this.ruleForm.money
        }
        this.$ajax.post('/api/accountBook/getTips', param).then(res => {
            res = res.data
            if(res.status === 200) {
                this.divideTip = res.message
                this.divideBool = true
            }
        }).catch(error => {
            this.$message({message: error, type: 'error'})
            this.divideBool = false
            this.ruleForm.shareType = ''
        })
    },
    checkTypeFn(val) {
        if(!this.ruleForm.depArray.length) {
            this.ruleForm.shareType = ''
            this.$message({message: '请先选择均摊部门范围', type: 'error'})
            return
        }
        if(val == 0) {
            this.ruleForm.deps.find(item => {
                if(item.level === 5) {
                    this.ruleForm.shareType = ''
                    this.$message({message: '当前选择的均摊部门范围不能分店,部门类型请选择分组', type: 'error'})
                    return
                }
            })
        } else {
            let level_arr = []
            let num_arr = []
            this.ruleForm.deps.forEach(item => {
                level_arr.push(item.level)
                num_arr.push(item.fiveLevelNum)
            })
            if(!level_arr.includes(5) && !num_arr.some(item => item>0)) {
                this.ruleForm.shareType = ''
                this.$message({message: '当前选择的均摊部门范围不能分组,部门类型请选择分店', type: 'error'})
                return
            }
        }
        (this.ruleForm.shareType!==''&&this.ruleForm.money)&&this.getTips()
    },
    getDepName(val) {
        let flag = false
        this.DepList.find(item => {
            if(item.id === val) {
                this.ruleForm.deptName = item.name
                flag = true
            }
        })
        if(!flag) {
            this.$message('没有权限无法选择')
            this.ruleForm.deptId = ''
            this.ruleForm.deptName = ''
        }
    },
    multiSelect(arr) {
        this.ruleForm.deps = []
        arr.forEach(item => {
            this.DepList.find(ele => {
                if(item === ele.id) {
                    this.ruleForm.deps.push(ele)
                }
            })
        })
    },
    sureFn(v) {
        let Rules = [
            { val: this.ruleForm.moneyType, msg: '支出类别' },
            { val: this.ruleForm.moneyDepiction, msg: '费用项' },
            { val: this.ruleForm.money, msg: '金额' },
            { val: this.ruleForm.moneyTime, msg: '支出时间' }
        ]
        if(v === 2) {
            Rules.unshift(
                { val: this.ruleForm.deps.length, msg: '均摊部门范围' },
                { val: String(this.ruleForm.shareType), msg: '均摊部门类型' }
            )
        } else {
            Rules.unshift({ val: this.ruleForm.deptId, msg: '部门' })
        }

        for(let i = 0; i < Rules.length; i++) {
            if(!Rules[i].val) {
                this.$message(`${Rules[i].msg}不能为空`)
                return
            }
        }
        if(this.ruleForm.money<=0){
            this.$message('金额必须大于0元')
            return
        }
        this.ruleForm.moneyTime = this.$tool.dateFormat(this.ruleForm.moneyTime)
        let param = {...this.ruleForm}
        let urlStr = 'insertAccountBook'
        delete param.depArray
        if(v === 2) {
            // 新增均摊支出
            delete param.deptId
            delete param.deptName
            let _array = []
            param.deps.forEach(item => {
                _array.push(item.id+','+item.name)
            })
            param.deps = _array
        } else {
            // 新增支出
            delete param.deps
            delete param.shareType
            if(v === 3) {
                // 编辑支出
                urlStr = 'updateAccountBook'
                param.id = this.propData.id
            }
        }
        this.fullscreenLoading = true
        this.$ajax.post(`/api/accountBook/${urlStr}`,param).then(res => {
            res = res.data
            if(res.status === 200) {
                this.fullscreenLoading = false
                this.$message(res.message)
                if(this.checked) {
                    this.ruleForm.shareType = ''
                    this.ruleForm.moneyType = ''
                    this.ruleForm.moneyDepiction = ''
                    this.ruleForm.remark = ''
                    this.ruleForm.money = ''
                    this.checked = false
                    this.$emit('refreshData',{state: 'success', save: true})
                } else {
                    this.close()
                    this.$emit('refreshData',{state: 'success', save: false})
                }
            }
        }).catch(error => {
            this.fullscreenLoading = false
            this.$message({message: error})
        })
    }
  },
  computed: {
    getDialogVisible() {
      return this.dialogVisible;
    },
  },
  watch: {
      'ruleForm.depArray'(val) {
        if(!val.length) this.ruleForm.shareType = ''
        if(val.length&&this.ruleForm.shareType!==''&&this.ruleForm.money) {
            this.getTips()
        }
      },
      DepList(val) {
          if(this.version===3) {
              let bool = false
              val.find(item => {
                  if(item.id === this.ruleForm.deptId) {
                      bool = true
                  }
              })
              this.depsList = [...val]
              if(!bool) {
                  this.depsList.unshift({
                      id: this.ruleForm.deptId,
                      name: this.ruleForm.deptName
                  })
              }
          }
      }
  }
};
</script>

<style lang="less" scoped>
  @btn-bg:#38BD8B;
.set-dialog {
    /deep/ .el-dialog {
        min-width: 600px;
    }
    .el-form {
        padding: 20px 20px 0;
    }
}
/deep/ .el-dialog__body {
    padding: 0 10px;
}
.dialog-footer {
    text-align: right;
    position: relative;
    padding: 10px 20px;
    .next {
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        .is-checked{
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
.money-item /deep/ .el-form-item__content {
    line-height: 20px;
}
.form-item {
    /deep/ .el-form-item__label::before {
        content: '*';
        color: red;
        margin-right: 2px;
    }
    &.item-color {
        /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
            background-color: @btn-bg;
            box-shadow: -1px 0 0 0 @btn-bg;
            border-color: @btn-bg;
        }
    }
    .w300 /deep/ .el-select__tags {
        max-height: 52px;
        overflow: auto;
    }
}
/deep/ .tree-box {
    width: 200px;
}
// .el-select-dropdown.el-popper {
//     .el-select-dropdown__item {
//       height: 100%;
//       overflow: hidden;
//       padding: 0;
//       .el-tree {
//           margin-right: -17px; /*滚动条的宽度17px*/
//           max-height: 300px;
//           overflow-y: scroll;
//       }
//     }
// }
.el-radio-button, /deep/ .el-radio-button__inner {
    width: 100px;
}
.remark-input {
    position: relative;
    span {
        position: absolute;
        bottom: 0;
        right: 5px;
    }
}
</style>
