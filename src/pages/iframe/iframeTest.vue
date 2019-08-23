<template>
  <div class="iframe-context">
    <iframe :src="getUrl" frameborder="0" width="870" height="600" id="iframe"></iframe>
    <span id="checkBtn" @click="check">校验</span>
  </div>
</template>

<script>
  import {MIXINS_MM} from "../contract/mixins/MM";
import {MIXINS_JJ} from "../contract/mixins/JJ.js";
import {MIXINS_ZL} from "../contract/mixins/ZL.js";
import {MIXINS_DB} from "../contract/mixins/DB.js";
import {MIXINS_YX} from "../contract/mixins/YX.js";
import {MIXINS_DJ} from "../contract/mixins/DJ.js";

  export default {
    name: "iframe-test",
    mixins: [MIXINS_MM],
    data(){
      return{
        src:'租赁.html'
      }
    },
    created(){
      // this.blobPdf()
    },
    methods:{
      check:function () {
        let iframe=document.querySelector('#iframe')
        // this.dealCheck(iframe.contentWindow)
        iframe.contentWindow.document.querySelector("#submit").click()
      },
      blobPdf:function () {
        let url = `${window.location.host}/api/test/pdfTest`
      }
    },
    computed:{
      getUrl:function () {
        return `/static/html/${this.src}`
      }
    }
  }
</script>

<style scoped>
  .iframe-context{
    height: 100%;
    position: relative;
  }
  #checkBtn{
    position: absolute;
    bottom: 30px;
    right: 30px;
    display: inline-block;
    width: 60px;
    line-height: 2;
    text-align: center;
    background-color: #3a8ee6;
    color: #FFFFFF;
  }
#iframe{
  margin-top: 60px;
  position: absolute;
  /*top: 50%;*/
  left: 50%;
  transform: translateX(-50%);
}
</style>
