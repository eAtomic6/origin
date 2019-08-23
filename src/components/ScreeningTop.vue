<template>
  <!-- 筛选 -->
  <div class="paper-box view-header" :class="[show?'collapse-on':'collapse-off']">
    <div class="paper-box-title">
      <p class="f14"><i class="iconfont icon-tubiao-5 mr-10 font-cl1"></i>筛选查询</p>
      <p>
        <el-button
          class="paper-btn paper-btn-blue btn-info"
          type="primary"
          size="small"
          @click="queryFn"
          round>查 询
        </el-button>
        <el-button
          class="paper-btn btn-info"
          size="small"
          @click="resetFormFn"
          round>重 置
        </el-button>
      </p>
    </div>
    <!-- 筛选条件 -->
    <div class="paper-box-content">
      <slot></slot>
    </div>
    <div class="btn" @click="show=!show"></div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
  export default {
    props: {
      min: {
        type: Number,
        default: 61
      }
    },
    data() {
      return {
        show: false
      }
    },
    methods: {
      // 点击查询
      queryFn() {
          this.$emit('propQueryFn')
      },
      // 点击重置
      resetFormFn() {
        this.$emit('propResetFormFn')
      },
      ...mapMutations(['bodyScollShowFn'])
    },
    beforeUpdate() {
      this.bodyScollShowFn();
    },
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/common.less";

  .font-cl1 {
    color: #55657A;
  }

  .mr-10 {
    margin-right: 10px;
  }

  .paper-box {
    background-color: @bg-white;
    position: relative;
    &:after {
      content: '';
      width: 100%;
      height: 15px;
      position: absolute;
      left: 0;
      right: 0;
      bottom: -15px;
      background-color: @bg-grey;
    }
    &.collapse-on{
      padding-bottom: 0;
    }
    &.collapse-off{
      /*padding: 10px 20px;*/
      .paper-box-title{
        margin-bottom: 0;
      }
      .paper-box-content{
        max-height: 34px;
        overflow-y: hidden;
      }
    }
    &-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    /deep/ .paper-box-content{
      margin-top: @margin-base;
      font-size: @size-14;
      .el-select{
        width: 140px;
      }
      .el-range-editor{
        width: 240px;
      }

    }
    .btn {
      width: 56px;
      height: 17px;
      position: absolute;
      bottom: -17px;
      left: 50%;
      margin-left: -28px;
      z-index: 9;
      background: url(.././assets/img/icon-dowm.png) no-repeat center center;
      background-size: 56px auto;
      cursor: pointer;
    }
  }
  .view-header {
    background-color: @color-white;
    padding: @margin-10;
    border-radius: @border-radius;
    margin-bottom: @margin-15;
  }

  // 按钮
  .paper-btn {
    text-align: center;
  }

  /*.paper-btn-blue {
    background-color: @color-blue;
    border-color: @color-blue;
    &:hover{
        background-color: #68A0E6;
    }
  }*/

</style>
