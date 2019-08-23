<template>
    <div class="preview-pdf">
        <span @click="close">关闭</span>
        <iframe :style="{width:`${wrapperHeight*0.9}px`,height:`${wrapperHeight}px`}" name="previewPdf" :src="'/static/pdf/web/viewer.html?file=' + getUrl"></iframe>
    </div>
    
</template>

<script>
export default {
    props:{
        url:{
            type:String,
            default:'',
        }
    },
    data(){
        return {
            wrapperHeight:0
        }
    },
    created(){
        this.wrapperHeight=(document.body.clientHeight)*0.8
    },
    computed:{
        getUrl(){
            let url = encodeURIComponent(`${this.url}`)
            return url
        }
    },
    methods:{
        print(){
            if(!this.getUrl){
                this.$message.error('打印失败，请传入pdf文件');
            }else{
                window.frames["previewPdf"].document.getElementById("print").click();
            }
        },
        close(){
            this.$emit("closePrint")
        },
    }
}
</script>
<style lang="less" scoped>
.preview-pdf{
    // position: absolute;
    // width: 0;
    // height: 0;
    // z-index: -999;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-52%);
    z-index: 9999;
    >span{
        position: absolute;
        right: 20px;
        top: 5px;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
    }
}
</style>

