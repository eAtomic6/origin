<template>
    <div class="layer" ref="layer" :style="comHeight">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name:'LayerScrollAuto',
    data(){
        return{
            winHeight:0,
            comHeight:'auto',
        }
    },
    mounted() {
        window.onresize = this.comHeightFn;
    },
    updated() {
        // setTimeout(()=>{
            this.comHeightFn();
        // },100)
    },
    methods:{
        comHeightFn(){
            this.winHeight = document.documentElement.clientHeight;
            let h = this.winHeight - (80+80+65+62);
            let min = 350;
            if(!this.$refs.layer){
                this.comHeight = ''
            }
            if(h < min){
                this.comHeight = `height:${min}px`
            }else if(this.$refs.layer.children[0].clientHeight > h){
                this.comHeight = `height:${h}px`
            }else{
                this.comHeight = ''
            }
        }
    },
}
</script>

<style lang="less" scoped>
.layer{
    overflow-y: auto;
}
</style>
