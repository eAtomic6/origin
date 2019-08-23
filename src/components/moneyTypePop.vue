<template>
  <el-popover ref="popover" trigger="manual" placement="bottom" v-model="visible">
    <div class="select-tree">
      <ul>
        <li class="select-option" v-for="item in dataList">
          <span>{{item.name}}</span>
          <div class="select-option-cell">
            <span v-for="tip in item.moneyTypes" @click="cellClick(tip,item)" :class="[inputVal===tip.name?'active':'']">{{tip.name}}</span>
          </div>
        </li>
      </ul>
    </div>
    <p class="tree-box w200" slot="reference" @click="opera('init')" @mouseenter="showClear" @mouseleave="clearVal=false">
      <el-input size="small" class="w200" ref="btn" readOnly placeholder="请选择" v-model="inputVal">
      </el-input>
      <span class="box-icon" ref="triggerBtn"><i class="el-select__caret el-icon-arrow-up" :class="[visible?'is-reverse':'']" v-if="!clearVal"></i><i class="iconfont icon-tubiao-7" v-else @click.stop="opera('clear')"></i></span>
    </p>
  </el-popover>
</template>

<script>
  export default {
    props:{
      data:{
        type:Array,
        default(){
          return []
        }
      },
      init:{
        type:String,
        default:''
      }
    },
    data(){
      return {
        inputVal:this.init,
        clearOper:false,
        visible:false,
        clearVal:false,
        iconUp:true,
      }
    },
    mounted(){
      this.$nextTick(()=>{
        let that=this
        document.onmousedown=function (e) {
          if(that.$refs.popover&&!(that.$refs.popover.$refs.popper.innerHTML.indexOf(e.target.parentNode.innerHTML)>-1)&&!(e.target.parentNode===that.$refs.btn.$el||e.target.parentNode===that.$refs.triggerBtn)){
            // debugger
            that.visible=false
          }
        }
      })
    },
    watch:{
      init:function (val) {
        this.inputVal=val
      }
    },
    methods:{
      showClear:function () {
        if(this.inputVal.length>0&&this.dataList.length>0){
          this.clearVal=true
        }
      },
      cellClick:function (data,pData) {
        let param = Object.assign({},data,{pId:pData.id,pName:pData.name})
        // this.$refs.btn.focus()
        this.inputVal=data.name
        this.$emit('checkCell',param)
        this.visible=false
      },
      opera:function (type) {
        if(type==='init'){
          this.visible=!this.visible
          // this.$refs.popover.showPopper=true
          // this.iconUp=!this.iconUp
        }else if(type==='clear') {
          this.visible=false
          // this.$refs.popover.showPopper=false
          /*if(this.init.length>0){
          }else {
            this.inputVal=''
          }*/
          this.inputVal=''
          this.$emit('clear')
        }
      },
    },
    computed:{
      dataList:function () {
        return this.data
      },
    },
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  /*/deep/ .el-popover{
    top: 200px;
  }*/
  .tree-box{
    position: relative;
    .box-icon{
      cursor: pointer;
      position: absolute;
      top: 50%;
      right: 10px;
      transform:translateY(-50%);
      >i{
        color: #c0c4cc;
        &.el-select__caret{
          color: #c0c4cc;
          font-size: 14px;
          -webkit-transition: -webkit-transform .3s;
          transition: -webkit-transform .3s;
          transition: transform .3s;
          transition: transform .3s, -webkit-transform .3s;
          transition: transform .3s,-webkit-transform .3s;
          -webkit-transform: rotateZ(180deg);
          transform: rotateZ(180deg);
          cursor: pointer;
        }
        &.is-reverse{
          -webkit-transform: rotateZ(0);
          transform: rotateZ(0);
        }
      }
    }
  }
  .select-tree {
    width: 100%;
    max-height: 300px;
    overflow-y: scroll;
    .select-option{
      display: flex;
      margin-bottom: @margin-10;
      &:last-of-type{
        margin-bottom: 0;
      }
      >span{
        color: @color-grey;
        width: 80px;
        text-align: right;
        padding-right: @margin-15;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }
      &-cell{
        max-width: 300px;
        >span{
          margin: 0 25px 10px 0;
          display: inline-block;
          cursor: pointer;
          color: @color-324;
          &:hover{
            color: @color-blue;
          }
          &.active{
            color: @color-blue;
          }
        }
      }
    }
  }
</style>
