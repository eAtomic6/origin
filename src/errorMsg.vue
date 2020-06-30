<template>
  <h1 style="text-align: center">{{msg}}</h1>
</template>

<script>
  export default {
    name: "errorMsg",
    data() {
      return {
        msg: ''
      }
    },
    created() {
      this.msg=this.$route.query.msg
    }
  }
</script>

<style scoped>

</style>
