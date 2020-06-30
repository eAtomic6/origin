import {contractConfig,toChineseNumber} from "./base.js"

let Obj={
    cn_arr:['val31','val35','val37','val39','val41','val42','val44','val49']
  }

  let sub = {
    'checkbox_houseUse': null,
    'val15':null,
    'checkbox_houseUsing': {
      stateful: function(index) {
        return index===0 ? {'val16':null,'val17':null,'val18':null,'val19':null} : {'val20':null,'checkbox_bear': null}
      }
    },
    'checkbox_Housingnature': null,
    'checkbox_Mortgage': {
      stateful: function(index) {
        return index===0 ? null : {'val21':null,'drapdown_val22': {
          stateful: function (val) {
            let res = null;
            switch (val) {
              case '1':
                res = {'val23': null,'time_val24': null};
                break;
              case '2':
                res = {'time_val25': null,'time_val26': null};
                break;
              case '3':
                res = {'time_val27': null,'val28': null};
                break
            }
            return res;
          }
        }}
      }
    },
    'checkbox_lease': null,
    'val29':null,
    'val30':null,
    'val31':null,
    'checkbox_Transferprice': null,
    'checkbox_Parkingspace':{
      stateful:function (val) {
        return val===0?{
          'checkbox_Parkinguse':null,
          'val32': null,
          'val33':null,
        }:null
      }
    },
    'val35':null,
    'checkbox_pay': {
      stateful: function(index) {
        return index===0 ? {'time_val36':null} : null
      }
    },
    'val37':null,
    'drapdown_val38': {
      stateful: function (val) {
        let res = null;
        switch (val) {
          case '1':
            res = {'val39': null};
            break;
          case '2':
            res = {'time_val40': null,'val41': null,'val42': null,'time_val43': null};
            break;
        }
        return res;
      }
    },
    'val44':null,
    'checkbox_loan':null,
    'time_val45':null,
    'drapdown_val46': {
      stateful: function (val) {
        let res = null;
        switch (val) {
          case '1':
            res = {'checkbox_Transfer': null};
            break;
          case '2':
            res = {'val47': null};
            break;
          case '3':
            res = {'val48':null};
        }
        return res;
      }
    },
    'val49':null,
    'checkbox_deposit':null,
    'checkbox_structure':null,
    'checkbox_structure1':null,
    'time_val50':null,
    'val51':null,
    'val52':null,
    'val53':null,
    'drapdown_val55': {
      stateful: function (val) {
        let res = null;
        switch (val) {
          case '1':
            break;
          case '2':
            res = {'val56': null};
            break;
        }
        return res;
      }
    },
    'checkbox_Housingsituation':null,
    'checkbox_Housingsituation1':null,
    'checkbox_Housingsituation2':null,
    'checkbox_Housingsituation3':null,
    'val58':null,
    'drapdown_val60': {
      stateful: function (val) {
        let res = null;
        switch (val) {
          case '1':
            res = {'val61':null}
            break;
          case '2':
            res = {'val62':null}
            break;
          case '3':
            res = {'val63':null};
            break;
        }
        return res;
      }
    },
    'val65':null,
    'time_val66':null,
    'checkbox_Ownershiptransfer':null,
    'drapdown_val71': {
      stateful: function (val) {
        let res = null;
        switch (val) {
          case '1':
            res = {'val72': null}
            break;
          case '2':
            break;
        }
        return res;
      }
    },
  }

  //给按钮添加点击事件
  let mainBtn=document.querySelector('#submit');
  if(mainBtn){
    mainBtn.addEventListener('click',function(e){
      contractConfig.submit(e,sub,'templateError1')
    })
  }else{
    let btn=document.createElement('span')
    btn.id='submit'
    btn.style.display='none'
    btn.innerHTML='click'
    document.body.appendChild(btn)
    btn.addEventListener('click',function(e){
      contractConfig.submit(e,sub,'templateError1')
    })
  }

//初始化时间控件
Calendar.create({
  classN: 'calendar-item',
  callBack: function(bindElem, dateObj) {
      if(bindElem.tagName.toLowerCase()==='input'){
        bindElem.value=`${dateObj.year}年${dateObj.month}月${dateObj.date}日`
        bindElem.setAttribute('value',bindElem.value)
        bindElem.setAttribute('random',dateObj.random)
      }
  }
})
  //初始化下拉控件
Dropdown.create({
  classN: 'dropdown-item',
  callBack: function(bindElem, dateObj) {
    if(bindElem.tagName.toLowerCase()==='input'){
      bindElem.value=dateObj.value
      bindElem.setAttribute('value',bindElem.value)
      let obj={
        'val22':{
          1:['val25','val26','val27','val28'],
          2:['val23','val24','val27','val28'],
          3:['val23','val24','val25','val26'],
          'init':['val23','val24','val25','val26','val27','val28']
        },
        'val38':{
          1:['val40','val41','val42','val43'],
          2:['val39'],
          'init':['val39','val40','val41','val42','val43']
        },
        'val46':{
          1:['val47','val48'],
          2:['checkbox_Transfer','val48'],
          3:['checkbox_Transfer','val47'],
          'init':['checkbox_Transfer','val47','val48']
        },
        'val55':{
          1:['val56'],
          2:[],
          'init':['val56']
        },
        'val60':{
          1:['val62','val63'],
          2:['val61','val63'],
          3:['val61','val62'],
          'init':['val61','val62','val63']
        },
        'val71':{
          1:[],
          2:['val72'],
          'init':['val72']
        }
      }
      let attr=bindElem.getAttribute('extendParam')
      if(obj[attr]){
        contractConfig.initForm(obj[attr]['init'],0)
        contractConfig.initForm(obj[attr][Number(dateObj.value)],1)
      }
    }else{
      bindElem.innerHTML = dateObj.value
      bindElem.classList.remove('input-select')
      bindElem.classList.remove('input-before')
    }
  }
})


// 输入框右侧吸边
let textLong = Array.from(document.querySelectorAll('.text-limit'))
textLong.forEach(function (item) {
  item.addEventListener('input', function () {
    let leng = this.value.length
    for (let i = 0; i < leng; i++) {
      if (this.scrollWidth > this.clientWidth) {
        this.value = this.value.substring(0, this.value.length - 1)
      }
    }
  })
})

//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
// let msg={
//   code: "S0001191107007",
//   companyNames: ["金银湖三级门店哦"],
//   guestCardType: "军官证",
//   guestCardTypes: "",
//   guestID: "132",
//   guestIDs: "ee2353-344，ii397-4839",
//   guestName: "然迪生",
//   guestNames: "胜负少，发士夫",
//   guestTel: "13011111111",
//   guestTels: "",
//   id: 3354,
//   isentrust: 1,
//   ownerCardType: "营业执照",
//   ownerCardTypes: "",
//   ownerID: "123",
//   ownerIDs: "ee2353-344，ii397-4839",
//   ownerName: "熊先",
//   ownerNames: "胜多少，发士夫",
//   ownerTel: "18888888888",
//   ownerTels: "",
//   propertyAddr: "a市b区c",
//   singleCompany: "是的噶几开会说",
//   dealPrice:1000,
//   dealPriceUpper:'壹仟',
//   square:160
// }
for (let readonlyItem in msg) {
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));

  let readonlyArr = ['code','singleCompany','ownerName', 'ownerID', 'ownerNames', 'ownerIDs', 'guestName', 'guestID', 'guestNames', 'guestIDs', 'propertyAddr', 'dealPrice', 'dealPriceUpper', 'square','companyNames']
  if(onlyReadDom.length>0){
    onlyReadDom.forEach((element,index) => {
      if(readonlyArr.includes(readonlyItem)){
        if(readonlyItem==='companyNames') {
          element.innerHTML=msg[readonlyItem][0]
        } else {
          element.innerHTML=msg[readonlyItem]
        }
        element.classList.remove('input-before')
      }
    })
  }
}

// 勾选框逻辑
contractConfig.checkboxListener(function(){},function(obj,index){
  let attr = obj.currentTarget.getAttribute('name')
  let boxArray = document.getElementsByName(attr);
  if(attr==='houseUsing'){
    let checkIO={
      0: ['val16','val17','val18','val19'],
      1: ['val20','checkbox_bear'],
    }
    boxArray.forEach((item,i)=>{
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if(item===obj.currentTarget){
        if(item.querySelector('p').getAttribute('checked')){
          contractConfig.initForm(checkIO[i],0)
          if(i===0){
            contractConfig.initForm(checkIO[1],1)
          }else {
            contractConfig.initForm(checkIO[0],1)
          }
        }else{
          contractConfig.initForm(checkIO[i],1)
        }
      }
    })
  }else if(attr==='Mortgage'){
    let checkIO={
      1: ['val21','val22','val23','val24','val25','val26','val27','val28'],
    }
    boxArray.forEach((item,i)=>{
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if(item===obj.currentTarget){
        if(item.querySelector('p').getAttribute('checked')){
          if(i===0){
            contractConfig.initForm(checkIO[1],1)
          }else {
            contractConfig.initForm(checkIO[1],0)
          }
        }else{
          contractConfig.initForm(checkIO[1],1)
        }
      }
    })
  }else if(attr==='Parkingspace'){
    let checkIO={
      0: ['checkbox_Parkinguse','val32','val33'],
    }
    boxArray.forEach((item,i)=>{
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if(item===obj.currentTarget){
        if(item.querySelector('p').getAttribute('checked')){
          if(i===0){
            contractConfig.initForm(checkIO[0],0)
          }else {
            contractConfig.initForm(checkIO[0],1)
          }
        }else{
          contractConfig.initForm(checkIO[0],1)
        }
      }
    })
  }else if(attr==='pay'){
    let checkIO={
      0: ['val36']
    }
    boxArray.forEach((item,i)=>{
      if(item===obj.currentTarget){
        if(item.querySelector('p').getAttribute('checked')){
          if(i===0){
            contractConfig.initForm(checkIO[0],0)
          }else {
            contractConfig.initForm(checkIO[0],1)
          }
        }else{
          contractConfig.initForm(checkIO[0],1)
        }
      }
    })
  }
})

//输入自适应
contractConfig.inputListener(function(ev,tip){
    let max=tip.target.getAttribute('max')
    let textArea=document.getElementById('inputArea')
    if(max){//监听max属性，判断文本框是有有输入长度限制
        textArea.setAttribute('maxLength',parseInt(max))
    }else {
        textArea.removeAttribute('maxLength')
    }
    //监听listen属性，判断是否有输入类型限制
    let spanAttr=tip.target.getAttribute('listen')
    if(spanAttr==='number'){
      ev.target.value=ev.target.value.replace(/[^\d]/g, "")
      tip.target.innerHTML = ev.target.value
      let cn_str = tip.target.getAttribute('extendparam')
      if(Obj['cn_arr'].includes(cn_str)){
        document.querySelector(`*[extendparam=${cn_str}_add]`).innerHTML = toChineseNumber(ev.target.value)
      }
    }
  },function(tip){
    //获取输入框的默认值
    let initVal=tip.target.innerHTML
    let strCn = tip.target.getAttribute('extendparam')
    if(Obj['cn_arr'].includes(strCn)){
      if(initVal.length>0){
        document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal)
      }else{
        document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
      }
    }
  })
