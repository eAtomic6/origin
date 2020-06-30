<template>
    <div class="data-list">
        <div class="table_head">
            <el-button type="primary" @click="conOperation('添加',0)" v-if="power['sign-set-hq'].state">添加</el-button>
        </div>
        <div class="contract-list">
          <el-table :data="listData" style="width: 100%" border :max-height="tableHeight">
              <el-table-column label="序号" type="index" width="90"></el-table-column>
              <el-table-column label="名称" prop="name"></el-table-column>
              <el-table-column label="信息类型" prop="type">
                <template slot-scope="scope">
                  <span v-for="item in dictionary['520']" :key="item.key" v-if="scope.row.type==item.key">{{item.value}}</span>
                </template>
              </el-table-column>
              <el-table-column label="是否为必选项" prop="isNecessary" :formatter="booleanFormatter"></el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                      <el-button @click="conOperation('编辑',1,scope.row)" type="text" size="small" v-if="power['sign-set-hq'].state">编辑</el-button>
                      <el-button @click="conOperation('删除',2,scope.row)" type="text" size="small" v-if="power['sign-set-hq'].state">删除</el-button>
                  </template>
              </el-table-column>
          </el-table>
        </div>
        <!-- 添加/编辑合同资料 -->
        <el-dialog :title="contractTitle+'合同资料'" :visible.sync="contractVisible" width="740px" class="con-dialog" :closeOnClickModal="$tool.closeOnClickModal">
            <el-form v-model="contractForm" class="contract-form" size="small">
                <el-form-item label="信息类型:">
                    <el-select v-model="contractForm.type" placeholder="请选择信息类型">
                        <el-option v-for="item in dictionary['520']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资料名称:">
                    <el-input v-model.trim="contractForm.name" maxlength="15"></el-input>
                </el-form-item>
                <el-form-item label="是否必填:">
                    <el-radio label="1" v-model="contractForm.isNecessary">是</el-radio>
                    <el-radio label="0" v-model="contractForm.isNecessary">否</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="modal-footer">
                <el-button type="primary" @click="submitForm" round v-dbClick>确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
           
<script>
import { FILTER } from "@/assets/js/filter";
import {MIXINS} from "@/assets/js/mixins";
const RULE = {
  type: {
    name: "信息类型"
  },
  name: {
    name: "资料名称"
  },
  isNecessary: {
    name: "是否必填"
  }
}
export default {
  mixins: [FILTER,MIXINS],
  props: ["cityId"],
  data() {
    return {
      listData: [],
      contractTitle: "", //弹出框 标题
      contractVisible: false,
      // 表单数据
      contractForm: {
        type: "",
        name: "",
        isNecessary: ""
      },
      dictionary: {
        '520':''
      },
      tableHeight: 0,
      power: {
        'sign-set-hq': {
          state: false,
          name: '操作'
        }
      },
      rowId: ""
    };
  },
  created() {
    this.getData();
    this.getDictionary()
    let h = document.documentElement.clientHeight
    this.tableHeight = h - 40 - 140
  },
  methods: {
    // 获取合同资料库列表
    getData: function() {
      this.$ajax.postJSON("/api/flowmanage/selectConAttachPageList", {cityId: this.cityId}).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.listData = res.data;
        }
      }).catch(error => {
          this.$message({message:error})
      })
    },
    // 新增 编辑 删除 操作
    conOperation(tit, type, row) {
      debugger
      if(type === 2) {
        this.$confirm('是否删除此条合同资料?', '删除合同资料', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$ajax.post("/api/flowmanage/deleteConAttach", { id: row.id }).then(res => {
            res = res.data;
            if (res.status === 200) {
              this.$message(res.message);
              this.getData();
            }
          }).catch(error => {
              this.$message({message:error})
          })
        }).catch(error => {
          this.$message({message:"取消删除"})
        })
      } else {
        this.contractVisible = true
        this.contractTitle = tit
        if(type === 0) { //新增
          this.$tool.clearForm(this.contractForm)
        } else { //编辑
          this.rowId = row.id
          this.contractForm.type = +row.type,
          this.contractForm.name = row.name,
          this.contractForm.isNecessary = row.isNecessary.toString()
        }
      }
    },
    // 提交表单
    submitForm() {
      this.$tool.checkForm(this.contractForm,RULE).then(() => {
        let str = "insertConAttach"
        let param = this.contractForm
        param.cityId = this.cityId
        if(this.contractTitle === '编辑') {
          str = "updateConAttach"
          param.id = this.rowId
        }
        this.$ajax.post(`/api/flowmanage/${str}`, param).then(res => {
          res = res.data;
          if (res.status === 200) {
            this.$message(res.message);
            this.contractVisible = false;
            this.getData();
          }
        }).catch(error => {
            this.$message({message:error})
        })
      }).catch(error => {
        this.$message({message:`${error.title}${error.msg}`})
      }) 
    }
  }
};
</script>
<style scoped lang="less">
.data-list {
  .table_head {
    padding: 6px 10px;
    display: flex;
    justify-content: flex-end;
    background-color: #fff;
    border-top: 1px solid rgba(237, 236, 240, 1);
    .el-button {
      width: 80px;
      height: 32px;
      padding: 4px 0;
      border-radius: 18px;
    }
  }
  .contract-list {
    padding: 0 12px;
    background-color: #fff;
  }
  .contract-form {
    .el-form-item {
      display: flex;
      margin-bottom: 10px;
      /deep/ .el-form-item__label::before {
        content: "*";
        color: red;
      }
      &:nth-child(-n + 2) {
        /deep/ .el-input {
          width: 278px;
        }
      }
    }
  }
}
</style>