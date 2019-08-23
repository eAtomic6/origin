// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'babel-polyfill'
import App from './App'
import router from './router'
import {store} from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import ScreeningTop from '@/components/ScreeningTop';
import fileUp from '@/components/up'
import uploadCell from '@/components/uploadCell'
import preview from '@/components/preview'
import selectTree from '@/components/selectTree'
import scrollBar from '@/components/scrollBar'
import {api} from '@/assets/js/ajax'
import {TOOL} from "@/assets/js/common"

Vue.use(ElementUI);

Vue.config.productionTip = false

Vue.prototype.$ajax = api   //axios请求封装
Vue.prototype.$tool = TOOL  //工具方法封装
Vue.prototype.$routerObj = router

Vue.filter("formatDate", TOOL.dateFormat);
Vue.filter("formatTime", TOOL.timeFormat);
Vue.filter("formatNull", TOOL.nullFormat);
Vue.filter("formatChinese", TOOL.toChineseNumber)

Vue.component("ScreeningTop", ScreeningTop);
Vue.component("fileUp", fileUp)
Vue.component("uploadCell", uploadCell)
Vue.component("preview", preview)
Vue.component("selectTree", selectTree)
Vue.component("scrollBar", scrollBar)

Vue.directive('focus', {
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
Vue.directive('loadmore', {
  bind(el, binding) {

    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');

    SELECTWRAP_DOM.addEventListener('scroll', function () {

      /*
      * scrollHeight 获取元素内容高度(只读)
      * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
      * clientHeight 读取元素的可见高度(只读)
      * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
      * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
      */
      const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight;

      if (CONDITION) {
        let param = []
        for (let item in binding.modifiers) {
          param.push(item)
        }
        binding.value(...new Set(param));
      }
    });
  }
})

//防止提交按钮 重复提交
Vue.directive("dbClick", {
  inserted(el, binding) {
    el.addEventListener("click", e => {
      if (!el.disabled) {
        el.disabled = true;
        let timer = setTimeout(() => {
          el.disabled = false;
        }, 3000);
      }
    });
  }
});

router.beforeEach((to, from, next) => {
  let promiseArr = []
  let pathList = localStorage.getItem('router')
  store.commit('setPath', pathList ? JSON.parse(pathList) : [])

  // let userMsg = null
  // (sessionStorage.getItem('userMsg'))&&(userMsg=JSON.parse(sessionStorage.getItem('userMsg')))
  // console.log(store.state.user)
  //vuex状态管理和本地缓存配合--全局管理用户信息
  if (!store.state.user && to.path !== '/login') {
    // debugger
    if (sessionStorage.getItem('userMsg')) {//本地有缓存信息时，刷新页面初始化状态从缓存中直接读取（可以解决重新请求用户信息接口的延迟问题）
      store.commit('setUser', JSON.parse(sessionStorage.getItem('userMsg')))
    } else {//防止极端用户清除本地缓存后刷新页面，这时初始化状态的值只能重新请求接口，且setState时一定要做缓存
      api.get('/api/me').then(res => {
        res = res.data
        if (res.status === 200) {
          store.commit('setUser', res.data)
        }
      }).catch(error => {

      })
    }
  }
  let sessionQuery = Object.create(null)
  sessionStorage.getItem('sessionQuery') && (sessionQuery = JSON.parse(sessionStorage.getItem('sessionQuery')))
  // debugger
  promiseArr.push(new Promise((resolve, reject) => {
    // debugger
    if (sessionQuery && (to.fullPath === sessionQuery.path) && (from.fullPath === sessionQuery.nxetPage)) {
      if (sessionQuery.methods === 'get' || !sessionQuery.methods) {
        api.get(`/api${sessionQuery.url}`, sessionQuery.query).then(res => {
          res = res.data
          if (res.status === 200) {
            // debugger
            store.commit('setDataList', {
              route: sessionQuery.path,
              data: res.data
            })
            resolve()
          }
        }).catch(error => {
          reject()
        })
      } else if (sessionQuery.methods === 'postJSON') {
        api.postJSON(`/api${sessionQuery.url}`, sessionQuery.query).then(res => {
          res = res.data
          if (res.status === 200) {
            // debugger
            store.commit('setDataList', {
              route: sessionQuery.path,
              data: res.data
            })
            resolve()
          }
        }).catch(error => {
          reject()
        })
      } else if (sessionQuery.methods === 'put') {
        api.put(`/api${sessionQuery.url}`, sessionQuery.query).then(res => {
          res = res.data
          if (res.status === 200) {
            // debugger
            store.commit('setDataList', {
              route: sessionQuery.path,
              data: res.data
            })
            resolve()
          }
        }).catch(error => {
          reject()
        })
      }
    } else {
      reject()
    }
  }))

  promiseArr.push(new Promise((resolve, reject) => {
    // debugger
    if (to.matched.some(record => record.meta.root)) {
      if (to.path === '/moneyCheck') {
        to.meta.list = parseInt(to.query.type) === 1 ? ['财务', '收款审核'] : ['财务', '付款审核']
      }
      let arr = TOOL.getRouter(to.meta.list, to.fullPath)
      store.commit('setPath', arr)
    }
    resolve()
  }))

  Promise.all(promiseArr).then(function () {
    next()
  }).catch(function () {
    //判断是否从缓存页面跳转到其他页面，是则存储目标页为nxetPage，否则清空缓存数据
    if (sessionQuery && (from.fullPath === sessionQuery.path)) {
      Object.assign(sessionQuery, {nxetPage: to.fullPath})
      sessionStorage.setItem('sessionQuery', JSON.stringify(sessionQuery))
    } else {
      Object.assign(sessionQuery, {nxetPage: ''})
      sessionStorage.removeItem('sessionQuery')
    }
    store.commit('setDataList', null)
    next()
  })
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})

