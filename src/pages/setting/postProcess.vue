<template>
  <div class="view-container">
    <!-- <el-form class="form-head" size="small">
      <el-form-item label="城市选择">
        <el-select v-model="cityId" placeholder="请选择">
          <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.cityId"></el-option>
        </el-select>
      </el-form-item>
    </el-form> -->
    <ul class="tabs">
      <li v-for="item in tabs" :class="[activeItem===item.id?'active':'']" @click="checkTab(item)" :key="item.id">{{item.name}}</li>
    </ul>
    <component :is="current" :cityId="cityInfo.cityId"></component>
  </div>
</template>

<script>
  import { FILTER } from "@/assets/js/filter";
  import {MIXINS} from "@/assets/js/mixins";
  import TransactionStep from "./transactionStep";
  import transactionProcess from "./transactionProcess";
  import transactionContract from "./transactionContract";

  export default {
    name: "post-process",
    mixins: [FILTER,MIXINS],
    data() {
      return {
        cityList: [],
        cityId: "",
        tabs: [
          {
            id: 1,
            name: "交易步骤",
            url: "/flowmanage/selectTypeStepsList"
          },
          {
            id: 2,
            name: "交易流程",
            url: "/flowmanage/selectFlowList"
          },
          {
            id: 3,
            name: "合同资料库",
            url: "/flowmanage/getTypeAndStepsList"
          }
        ],
        activeItem: 1, //Tab当前项
        current: "TransactionStep", //当前组件
      };
    },
    components: {
      TransactionStep,
      transactionProcess,
      transactionContract
    },
    methods: {
      checkTab: function(item) {
        this.activeItem = item.id;
        if (item.id == 1) {
          this.current = "TransactionStep";
        } else if (item.id == 2) {
          this.current = "transactionProcess";
        } else {
          this.current = "transactionContract";
        }
      }
    },
    computed: {
      cityInfo(){
        return this.getUser.user
      }
    }
  };
</script>

<style scoped lang="less">
@import "~@/assets/common.less";

.view-container {
  background-color: #f5f5f5!important;
  height: 100%;
  .form-head {
    // height: 82px;
    background: #fff;
    box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
    border-radius: 4px 4px 0 0;
    display: flex;
    align-items: center;
    padding: 5px 0 5px 20px;
    .el-form-item {
      display: flex;
      margin-bottom: 0;
      /deep/ .el-input {
        width: 150px;
      }
    }
  }
  .tabs {
    height: 48px;
    display: flex;
    background: rgba(250, 250, 251, 1);
    font-size: 16px;
    padding-left: 30px;
    > li {
      display: flex;
      align-items: center;
      padding: 0 20px;
      font-family: "MicrosoftYaHei";
      color: rgba(50, 72, 95, 1);
      margin-right: 30px;
      &.active {
        color: @color-blue;
        border-bottom: 4px solid @color-blue;
      }
      &:nth-of-type(n + 2) {
        border-left: 0px;
      }
    }
  }
}
/deep/ .el-dialog__body {
    padding-top: 20px;
}
/deep/ .el-table th {
  background:rgba(238,242,251,1);
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid rgba(237,236,240,1);
}
/deep/ .el-input__inner {
  border: 1px solid #DEDDE2;
}
/deep/ .confirmBtn {
  width: 100px;
  height: 38px;
  border-radius: 18px;
  color: #fff;
}
/deep/ .addBtn {
  background-color: #fff;
  width: 100px;
  height: 38px;
  border-radius: 18px;
}
</style>
