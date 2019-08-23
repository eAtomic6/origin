<template>
    <div class="view">
      <div class="view-context">
        <h1><i class="iconfont icon-dengdai"></i></h1>
        <h3 v-if="checkPerson.state">付款单{{edit?'修改':'创建'}}成功</h3>
        <p>请等待付款审核结果</p>
        <ul class="step-list">
          <li v-for="item in steps" :key="item.index" :class="[item.state?'active':'',activeStep===item.index?'active-last-step':'']">
            <section>{{item.name}}<p v-if="item.index===1"><span>{{result.dep}}-{{result.name}}</span><span>{{result.time}}</span></p></section>
          </li>
        </ul>
        <p>
          <!--<el-button round @click="goBack('contractList')" v-if="power['sign-ht-info-query'].state">返回合同列表</el-button>-->
          <el-button round @click="goBack('Bill')" v-if="power['sign-cw-debt-query'].state">返回收付款列表</el-button>
        </p>
      </div>
      <checkPerson :show="checkPerson.state" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @close="checkPerson.state=false" @submit="checkPerson.state=false" v-if="checkPerson.state"></checkPerson>
    </div>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";
  import checkPerson from '@/components/checkPerson'

  export default {
    name: "pay-result",
    mixins:[MIXINS],
    components:{
      checkPerson
    },
    data(){
      return{
        steps:[
          {
            index:1,
            name:'提交申请',
            state:true
          },{
            index:2,
            name:'付款审核',
            state:false
          },{
            index:3,
            name:'申请成功',
            state:false
          },{
            index:4,
            name:'付款',
            state:false
          }
        ],
        activeStep:0,
        result:{},
        edit:false,
        checkPerson: {
          state:false,
          type:'set',
          current:false,
          code:'',
          flowType:0
        },
        power:{
          'sign-ht-info-query':{
            state: false,
            name: '合同列表'
          },
          'sign-cw-debt-query':{
            state: false,
            name: '收付款单列表'
          },
        }
      }
    },
    mounted(){
      this.result=JSON.parse(this.$route.query.content)
      this.edit = parseInt(this.$route.query.edit)===1?true:false
      this.steps.find(item=>{
        if(!item.state){
          this.activeStep=item.index-1
          return true
        }
      })
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if(from.path==='/payBill'&&vm.result.payCode&&vm.result.payCode.length>0){
          let param={
            state:true,
            code:vm.result.payCode,
            current:parseInt(vm.result.type)===1?false:true
          }
          vm.checkPerson=Object.assign(vm.checkPerson,param)
        }
      })
    },
    methods:{
      goBack:function (page) {
        this.$router.push({
          path:page
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
.view{
  background-color: @bg-white;
  position: relative;
  height: 100%;
  &-context{
    position: absolute;
    top: 50%;
    left: 50%;
    transform:translate(-50%,-50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    >h1{
      margin-bottom: 41px;
      .iconfont{
        color: @color-blue;
        font-size: 89px;
      }
    }
    >h3{
      color: @color-324;
      font-size: 28px;
    }
    >p{
      &:first-of-type{
        color: @color-99A;
        margin: 20px 0;
        font-size: 18px
      }
      &:last-of-type{
        margin-top: 140px;
      }
    }
    >ul.step-list{
      display: flex;
      margin: 50px 0;
      >li{
        width: 200px;
        height: 2px;
        background-color: @bg-grey;
        position: relative;
        padding-left: 14px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        &:last-of-type{
          width: 0px;
        }
        &.active{
          background-color: @color-blue;
          &:before{
            background-color: @color-blue;
          }
          &-last-step{
            background-color: @bg-grey;
            &:before{
              width: 20px;
              height: 20px;
            }
            >section{
              color: @color-blue;
              left: 10px;
            }
          }
        }
        &:before{
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          transform:translateY(-50%);
          width: 14px;
          height: 14px;
          background-color: @color-A3;
          border-radius: 50%;
        }
        >section{
          /*min-width: 80px;*/
          position: absolute;
          top: 24px;
          left: 7px;
          transform:translateX(-50%);
          white-space: nowrap;
          text-align: center;
          color: @color-324;
          >p{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            color: @color-99A;
            >span{
              &:first-of-type{
                margin-bottom: 10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
