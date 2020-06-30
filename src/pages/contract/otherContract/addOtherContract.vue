<template>
  <div class="view-container">
    <component v-bind:is="contractType" v-if="contractType" :operationType="operationType" :contId="contId" :tableHeight="clientHei"></component>
    <!-- <addNewHouse v-if="contractType==='newHouse'"></addNewHouse>
    <addLongRent v-if="contractType==='longRent'"></addLongRent>
    <addFinancial v-if="contractType==='financial'"></addFinancial> -->
  </div>
</template>
           
<script>

import addNewHouse from "../otherContract/addModule/addNewHouse";
import addLongRent from "../otherContract/addModule/addLongRent";
import addFinancial from "../otherContract/addModule/addFinancial";
import { MIXINS } from "@/assets/js/mixins";

export default {
  mixins: [MIXINS],
  components: {
    addNewHouse,
    addLongRent,
    addFinancial
  },
  data(){
    return{
      clientHei:'',
      contractType:'',
       //操作类型  1 新增  2  编辑
      operationType:1,
      contId:0,
    }
  },
  created () {
    this.clientHeight()
    let contractName={
      1:{name:'新房',type:'xf'},
      2:{name:'长租',type:'cz'},
      3:{name:'金融',type:'jr'}
    }
    let routeType
    this.operationType=Number(this.$route.query.operationType)
    if(this.$route.query.id){
      this.contId=Number(this.$route.query.id)
    }
    if(this.$route.query.type==="newHouse"){
      this.contractType="addNewHouse"
      routeType=1
    }else if(this.$route.query.type==="longRent"){
      this.contractType="addLongRent"
      routeType=2
    }else{
      this.contractType="addFinancial"
      routeType=3
    }
    let arr=this.$tool.getRouter([contractName[routeType].name,'合同','合同列表'],`otherContractList?type=${contractName[routeType].type}`);
    arr.push({name:this.operationType===1?'新增合同':'合同编辑',path:this.$route.fullPath});
    this.setPath(arr);
  },
  methods:{
    // 控制弹框body内容高度，超过显示滚动条
    clientHeight() {
      this.clientHei= document.documentElement.clientHeight -200 + 'px'
    },
  },
  mounted(){
    window.onresize = this.clientHeight;
  },
  beforeUpdate() {
    this.clientHeight();
  },
};
</script>
<style scoped>
</style>