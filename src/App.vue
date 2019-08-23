<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: "App"
  };
</script>

<style lang="less">
  @import "~@/assets/common.less";

  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
  }
  /*本地打印票据iframe样式*/
  #printf {
    width: 100px;
    height: 100px;
    position: fixed;
    top: -100px;
    left: -100px;
    visibility: hidden;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    /*user-select: none;*/
    width: 100%;
    height: 100%;
    font-size: @size-base;
  }
  input,.el-input__inner{
    font-size: @size-base;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    &::-webkit-input-placeholder,&:-ms-input-placeholder{
      font-family: "Avenir", Helvetica, Arial, sans-serif;
      font-size: @size-base;
      color: @color-C8;
    }
    &:-ms-input-placeholder{
      font-family: "Avenir", Helvetica, Arial, sans-serif;
      font-size: @size-base;
      color: @color-C8;
    }
    &::-moz-placeholder{
      font-family: "Avenir", Helvetica, Arial, sans-serif;
      font-size: @size-base;
      color: @color-C8;
    }
  }

  h1,
  h2,
  h3,
  h4 {
    margin: 0;
    padding: 0;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  p {
    margin: 0;
    padding: 0;
  }
  .scroll-hidden{
    >textarea{
      overflow-y:hidden;
    }
  }

  input.no-style {
    border: 0px;
    outline: none;
    display: inline-block;
    width: 100%;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }
   .el-dialog__header{
    border:1px solid #e8eaf6!important;
  }

  .input-group {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    > label {
      &:first-of-type {
        min-width: 80px;
      }
      &.no-width{
        min-width: initial;
        margin-right: @margin-10;
      }
    }
  }

  .margin-left-10 {
    margin-left: 10px;
  }

  .time-picker {
    display: flex;
    align-items: center;
  }

  .form-label {
    position: relative;
    &:before {
      content: '*';
      display: inline-block;
      color: red;
    }
  }
  .el-select-dropdown{
    .drop-tree{
      &.el-select-dropdown__item{
        height: auto;
      }
    }
  }
  /*.el-dialog{
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    margin: 0 !important;
  }*/
  .el-dialog{
    .el-dialog__body{
      padding: 0 @margin-10;
    }
  }
  .money-type-radio[role='radio']{
    display: flex;
    >span{
      &:last-of-type{
        white-space: normal;
      }
    }
  }

  .three-row{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    /*!autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    line-height: 1.5;
    height: 54px;
    position: relative;
  }
  .one-row{
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
  }

  // 清除浮动
  .clearfix:after {
    content: " ";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .clearfix {
    display: inline-block;
  }
.el-popover{
    word-break: break-all;
  }

  // 左右浮动
  .f_l {
    float: left;
  }

  .f_r {
    float: right;
  }

  // 初始化 标题
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  em,
  i,
  select,
  option,
  input,
  textarea {
    font-style: normal;
    font-weight: 400;
    outline: none;
  }

  .f14 {
    font-size: 14px
  }

  .w140 {
    width: 140px !important;
  }
  .w200{
    width: 200px !important;
  }

  .w240 {
    width: 240px !important;
  }
  .w300{
    width: 300px !important;
  }
  .w394{
    width: 394px !important;
  }
  .w400{
    width: 400px !important;
  }
  .w410{
    width: 410px !important;
  }
  .w430{
    width: 430px !important;
  }
  .btn-info{
    min-width: 80px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .margin-bottom-base{
    margin-bottom: @margin-base;
  }
  .margin-left{
    margin-left: @margin-10;
  }
  .margin-right{
    margin-right: @margin-10;
  }
  .wordp{
    word-wrap: break-word;
    word-break: normal;
}
</style>
