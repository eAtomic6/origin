<template>
    <div class="view-container" >
    <ul class="tabs">
      <li v-for="item in power" v-if="item.state" :class="[activeItem===item.id?'active':'']" @click="checkTab(item)" :key="item.id">{{item.name}}</li>
    </ul>
    <component :is="current" :systemArr="systemTagList" :systemOpt="systemTagSelect"></component>
    </div>
</template>
           
<script>
  import {MIXINS} from "@/assets/js/mixins";
  import aplTime from "./aplTime";
  import lowCommission from "./lowCommission";
  import conAttachment from "./conAttachment";
  import contractLayout from "./contractLayout";
  import divideRatio from "./divideRatio";
export default{
    mixins: [MIXINS],
    data() {
        return {
            activeItem: '', //Tab当前项
            current: "", //当前组件
            power: {
              'sign-set-dybl': {
                id: 1,
                state: false,
                name: "低佣比例设置",
                current: 'lowCommission'
              },
              'sign-set-vtime': {
                id: 2,
                state: false,
                name: "申诉时间设置",
                current: 'aplTime'
              },
              'sign-set-rule-query': {
                id: 3,
                state: false,
                name: "合同附件库设置",
                current: 'conAttachment'
              },
              'sign-set-bl-htym-query': {
                id: 4,
                state: false,
                name: "合同页面设置",
                current: 'contractLayout'
              },
              'sign-set-bl-fcbl-query': {
                id: 5,
                state: false,
                name: "分成比例设置",
                current: 'divideRatio'
              }
            }
        }
    },
    mounted() {
        // 获取体系
        this.getSystemTag()
        this.getSystemTagSelect()
        for(let item in this.power){
          let type = this.power[item]
          if(type.state) {
            this.activeItem = type.id
            this.current = type.current
            break
          }
        }
    },
    methods:{
        checkTab(item) {
            this.activeItem = item.id;
            this.current = item.current;
        }
    },
    components:{
        aplTime,
        lowCommission,
        conAttachment,
        contractLayout,
        divideRatio
    }
}
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.view-container {
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
</style>