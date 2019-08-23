<template>
  <div id="printHtml" :class="{'paper-more':morePaper}">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      morePaper: {//是否批量打印记账联
        type: Boolean,
        default: false
      }
    },
    methods: {
      print(printCallBack) {
        var printhtml = document.getElementById("printHtml").innerHTML;
        var f = document.getElementById("printf");
        if (navigator.userAgent.indexOf("Firefox") > 0) {
          printhtml = `
                            <div>${printhtml}</div>
                            <div></div>
                            `;
        } else {
          printhtml = `
                            <div style='position:relative;z-index:100;'>${printhtml}</div>
                            <div style='position:absolute;z-index:99;left:0;top:0;right:0;bottom:0;background-color:#fff'></div>
                            `;
        }
        // html
        f.contentDocument.body.innerHTML = printhtml;
        // 关闭
        setTimeout(() => {
          try {
            window.frames['printf'].print();
          } catch (e) {
            f.contentWindow.print();
          }
          printCallBack&&printCallBack();
        }, 100)
      },
      getStyle(printI) {
        var str = "",
          styles1 = document.querySelectorAll("style");
        for (var i = 0; i < styles1.length; i++) {
          str += styles1[i].outerHTML;
        }
        // str += styles1[styles1.length - 1].outerHTML//页面生成的最后一个style为当前页面的
        str += `<style>header, footer {display: none;}body{font-family: SimHei;}</style>`;
        printI.contentDocument.head.innerHTML = str;

        // 添加link引入
        let styles = document.querySelectorAll("link");
        let lastLink = "";
        for (let i = 0; i < styles.length; i++) {
          // chrome 正常，firefox不正常，能执行到，但是添加没结果
          let link = document.createElement("link");
          link.setAttribute("rel", "stylesheet");
          if (styles[i].type) {
            link.setAttribute("type", styles[i].type)
          } else {
            link.setAttribute("type", 'text/css')
          }
          // link.setAttribute("href", `${styles[i].href}?time=${new Date().getTime()}`);
          link.setAttribute("href", styles[i].href);
          link.setAttribute('media', 'all');
          printI.contentDocument.head.appendChild(link);
          if (styles.length - 1 === i) {
            lastLink = link;
          }
        }
      },
      loadCss(node, callback) {
        // for IE6-9 and Opera
        if (node.attachEvent) {
          node.attachEvent("onload", callback);
          // NOTICE:
          // 1. "onload" will be fired in IE6-9 when the file is 404, but in
          // this situation, Opera does nothing, so fallback to timeout.
          // 2. "onerror" doesn't fire in any browsers!
        }
        // polling for Firefox, Chrome, Safari
        else {
          setTimeout(function () {
            poll(node, callback);
          }, 0); // for cache
        }

        function poll(node, callback) {
          if (callback.isCalled) {
            return;
          }
          var isLoaded = false;
          if (node["sheet"]) {
            isLoaded = true;
          }

          if (isLoaded) {
            // give time to render.
            setTimeout(callback, 1);
          } else {
            setTimeout(function () {
              poll(node, callback);
            }, 1);
          }
        }
      },
      init() {
        var printI = document.getElementById("printf");
        if (!printI) {
          printI = document.createElement("iframe");
          printI.id = "printf";
          printI.frameBorder = 0;

          // 兼容ie
          if (
            window.location.hostname !== document.domain &&
            navigator.userAgent.match(/msie/i)
          ) {
            printI.src =
              'javascript:document.write("<head><script>document.domain=\\"' +
              document.domain +
              '\\";</s' +
              'cript></head><body></body>")';
          }
          printI.onload = () => {
            this.getStyle(printI);
          }

          document.body.appendChild(printI);
        } else {
          this.getStyle(printI);
        }
      }
    },
    mounted() {
      this.init();
    },
  };
</script>

<style lang="less" scoped>
  #printHtml {
    padding-top: 20px;
  }

  .paper-more {
    max-height: 480px;
    overflow-y: auto;
  }
</style>
