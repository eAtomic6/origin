<template>
  <i class="iconfont" :style="getFontSize"
     :class="getType"></i>
</template>

<script>
  export default {
    name: "upload-cell",
    props: {
      type: {
        type: String,
        default: '.png'
      },
      size: {
        type: Number,
        default: 60
      }
    },
    data() {
      return {
        typeList: ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.mp3', '.mpeg', '.cd', '.wave', '.aiff', '.mp4', '.avi', '.rmvb', '.txt', '.pdf', '.xls','.xlsx', '.docx', '.doc', '.ppt', '.zip', '.rar']
      }
    },
    computed: {
      otherFile: function () {
        return this.typeList.indexOf(this.type.toLocaleLowerCase()) > -1
      },
      getFontSize: function () {
        return {
          fontSize: `${this.size}px`
        }
      },
      getType: function () {
        switch (this.type.toLocaleLowerCase()) {
          case '.png':
          case '.jpg':
          case '.jpeg':
          case '.gif':
          case '.bmp':
            return 'icon-tupian'
            break
          case '.mp3':
          case '.mpeg':
          case '.cd':
          case '.wave':
          case '.aiff':
            return 'icon-yinpin1'
            break
          case '.mp4':
          case '.avi':
          case '.rmvb':
          case '.wmv':
          case '.mkv':
            return 'icon-shipin1'
            break
          case '.txt':
            return 'icon-wendang'
            break
          case '.pdf':
            return 'icon-pdf'
            break
          case '.xls':
          case '.xlsx':
            return 'icon-excel'
            break
          case '.docx':
          case '.doc':
            return 'icon-word'
            break
          case '.ppt':
            return 'icon-ppt'
            break
          case '.zip':
          case '.rar':
            return 'icon-yasuobao1'
            break
          default:
            return 'icon-qita1'
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";

  .icon-tupian {
    color: @color-png;
  }

  .icon-yinpin1 {
    color: @color-mp3;
  }

  .icon-shipin1 {
    color: @color-mp4;
  }

  .icon-wendang {
    color: @color-doc;
  }

  .icon-yasuobao1 {
    color: @color-zip;
  }

  .icon-qita1 {
    color: @color-other;
  }

  .icon-pdf{
    color: #fe8f68;
  }

  .icon-word{
    color: #74aef6;
  }

  .icon-excel{
    color: #82ce78;
  }
  .icon-ppt{
    color: #ff7c7c;
  }
</style>
