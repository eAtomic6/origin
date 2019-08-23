import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    path:[],
    slider:[],
    collapse: true,//侧边栏是否收起
    user:null,
    fullscreenLoading:false,
    bodyScollShow:0,
    searchQuery:null,//筛选条件
    dataList:null,//列表渲染对象
  },
  mutations: {
    setPath (state,payload) {
      localStorage.setItem('router',JSON.stringify(payload))
      state.path=payload
    },
    setUser(state,payload){
      sessionStorage.setItem('userMsg',JSON.stringify(payload))
      state.user=payload
    },
    setLoading(state,payload){
      state.fullscreenLoading=payload
    },
    setCollapse(state,payload){
      state.collapse=payload
    },
    bodyScollShowFn(state,payload){
      if(state.bodyScollShow>999){
        state.bodyScollShow = 0;
      }else{
        state.bodyScollShow++;
      }
    },
    setSearchQuery(state,payload){
      // debugger
      state.searchQuery=payload
    },
    setDataList(state,payload){
      state.dataList=payload
    }
  },
  actions:{
    asyncUser({commit}){
      axios.get('/api/me').then(res => {
        res=res.data
        return new Promise((resolve,reject)=>{
          if(res.status===200){
            commit('setUser',res.data)
            resolve(res.data)
          }else {
            reject()
          }
        })
      })
    }
  },
  getters:{
    getPath:state=>{
      return state.path
    },
    getUser:state=>{
      return state.user
    },
    getLoading:state=>{
      return state.fullscreenLoading
    },
    getCollapse:state=>{
      return state.collapse
    },
    getBodyScollShow:state=>{
      return state.bodyScollShow
    },
    getSearchQuery:state=>{
      return state.searchQuery
    },
    getDataList:state=>{
      return state.dataList
    }
  }
})
export {
  store
}
