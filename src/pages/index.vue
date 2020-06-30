<template>
  <div class="page-view">
    <div class="page-view-index">
      <ul>
        <li v-for="(item,index) in Index" :key="index" @click="toLink(item,index)">{{item.name}}</li>
      </ul>
      <p class="operation" @click="goBack"
         v-if="Index.length>3&&$route.path!=='/routingRemitDetail' && $route.path!=='/storeReceive' && $route.path!=='/achDetial' && $route.path!=='/detailIntention'&& $route.path!=='/contractDetails'&&$route.path!=='/achPage'&& $route.path!=='/otherContractList'">
        <i class="iconfont icon-fanhui"></i>
        <span>返回</span>
      </p>
    </div>
    <div class="page-view-content">
      <router-view class="router-view" :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "index",
    data() {
      return {
        Index: [],//面包屑list
        back: false,//返回按钮是否显示
      }
    },
    created(){
      this.Index=this.getPath
      this.$parent.loadingState=false
    },
    methods: {
      toLink: function (item, index) {
        if (index < 3) {
          if (item.path.includes('/storeReceive')) {//业绩报表特殊路由处理
            item.path = item.path.split('?')[0]
          }
          this.$router.push({
            path: item.path
          })
        }
      },
      goBack: function () {
        if (this.$route.path === "/extendParams") {
          let backMsg = {
            type: 2
          }
          localStorage.setItem("backMsg", JSON.stringify(backMsg));
        }
        this.$router.go(-1)
      }
    },
    computed: {
      ...mapGetters([
          'getPath'
        ])
    },
    watch:{
      getPath:function (val) {
        this.Index=val
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";

  .page-view {
    flex: 1;
    overflow-x: auto;
    position: relative;
    background-color: @bg-grey;
    &-index {
      height: 40px;
      margin: 0 20px;
      position: relative;
      > ul {
        height: 100%;
        display: flex;
        align-items: center;
        > li {
          position: relative;
          margin-right: 10px;
          color: @color-99A;
          cursor: pointer;
          &:after {
            content: '>';
            margin-left: 10px;
            /*width: 40px;
            height: 40px;*/
          }
          &:last-of-type {
            color: @color-324;
            &:after {
              content: '';
              margin: 0;
            }
          }
        }
      }
      .operation {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        background-color: @bg-white;
        padding: @margin-base @margin-base @margin-base 0;
        border-radius: 4px;
      }
    }
    &-content {
      // padding: 0px @margin-15;
      position: absolute;
      top: 40px;
      right: @margin-15;
      bottom: 0;
      left: @margin-15;
      // overflow-y: auto;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background-color: @bg-white;
      }
      /deep/.theader-bg {
        > th {
          background-color: @bg-th;
          > .cell {
            white-space: nowrap;
          }
        }
      }
      /deep/.el-table {
        font-size: @size-base;
        th, td {
          padding: @margin-base 0;
          > .cell {
            // white-space: nowrap;
            .span-cursor {
              color: @color-blue;
              cursor: pointer;
            }
          }
        }
        // &.info-scrollbar{
        //   margin-bottom: 54px;
        //   .el-table__body-wrapper{
        //     margin-bottom: -17px;
        //   }
        //   .el-table__fixed-right{
        //     padding-bottom: 17px;
        //   }
        // }
      }
      .router-view {
        // min-height: 100%;
        background-color: @bg-white;
        position: relative;
        // z-index: 1;
      }
    }
  }

  /deep/ .pagination-info {
    text-align: right;
  }

  /deep/ .el-table__empty-block {
    line-height: 60px;
  }

  /deep/ .el-dialog__headerbtn {
    top: 16px;
    .el-dialog__close {
      font-size: 24px;
      color: #32485F;
    }
  }
</style>

