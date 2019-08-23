<template>
<div class="login-container" v-if="show">
  <!--<p>用户ID：<input type="number" v-model="userId"></p>
  <p @click="login">登录</p>-->
</div>
</template>

<script>
  import {mapMutations} from 'vuex'
  export default {
    name: "login",
    data(){
      return{
        userId:'',
        code:{},
        show:false
      }
    },
    created(){
      let param=this.$route.query
      // this.setPath([])
      if(param.newToken){
        document.cookie = `ERP-Test=${this.$route.query.newToken}`;
      }else if(param.empcode) {
        for (let item in param){
          if(item==='empcode'){
            param[item]=parseInt(param[item])
          }
        }
        this.code=Object.assign({},param)
      }
      // console.log(this.code,param)
      this.login()
    },
    methods:{
      login:function () {
        this.$ajax.post('/api/verify',this.code).then(res=>{
          res=res.data
          if(res.status===200){
            this.$ajax.get('/api/me',{time:new Date()}).then(res=>{
              res=res.data
              if(res.status===200){
                this.$store.commit('setUser',res.data)
                if(res.data.privileges.length>0){
                  let arr=res.data.privileges
                  let views=this.$tool.pathList.map(item=>Object.assign({},item))
                  let sliders=[]

                  views.forEach((item,index)=>{
                    item.child.forEach(tip=>{
                      if(arr.indexOf(tip.code)>-1){
                        sliders.push(tip)
                      }
                    })
                  })
                  this.$router.push({
                    path:sliders[0].path
                  })
                }else {
                  this.$message({
                    message:'无任何权限'
                  })
                }
              }
            })
          }
        })
      },
      ...mapMutations([
        'setPath'
      ])
    }
  }
</script>

<style scoped>

</style>
