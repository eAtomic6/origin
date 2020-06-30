import {contractConfig,toChineseNumber} from "./base.js"

let Obj={
    cn_arr:['val50','val60','val62','val64','val69','val70','val110','val112']
  }

  let sub = {
    'val22':null,
    'val24':null,
    'val26':null,
    'val28':null,
    'val30':null,
    'val32':null,
    'checkbox_houseUse': {
      stateful: function(index) {
        return index===4 ? {'val34':null} : null
      }
    },
    'drapdown_val36': {
      stateful: function (val) {
        let res = null;
        switch (val) {
          case '1':
            break;
          case '2':
            res = {'val38': null,'val40': null};
            break;
          case '3':
            res = {'val42': null};
            break;
        }
        return res;
      }
    },
    'checkbox_houseStatus': null,
    'val46':null,
    'time_val48':null,
    'val50':null,
    'val52':null,
    'val54':null,
    'checkbox_payment': {
      stateful: function(index) {
        return index===0 ? {'time_val56':null} : {'time_val58':null,'val60':null,'time_val61':null,'checkbox_loan': null,'val62':null,}
      }
    },
    'val64':null,
    'time_val66':null,
    'val68':null,
    'val69':null,
    'val70':null,
    'time_val72':null,
    'val74':null,
    'val75':null,
    'val76':null,
    'val77':null,
    'val80':null,
    'checkbox_negotiation':{
      state:true,
      stateful:function (index) {
        return index===0?{
          'checkbox_rights':{
            state:true,
            stateful:function(val) {
              return val===5?{'val82':null}:null
            }
          }
        }:index===1?{'checkbox_debt':null}:null
      }
    },
    'val104':null,
    'checkbox_wtloan':{
      stateful:function(index) {
        return index===0?null:{'val106':null}
      }
    },
    'val108':null,
    'val110':null,
    'val112':null,
    'val114':null,
    'val116':null,
    'val118':null,
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
        'val36':{
          1:['val38','val40','val42'],
          2:['val42'],
          3:['val38','val40'],
          'init':['val38','val40','val42']
        },
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
//   square:160,
//   guestStoreRegisterCode: '213',
//   signDate: 1592465819508
// }
for (let readonlyItem in msg) {
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));

  let readonlyArr = ['code','ownerName', 'ownerID', 'ownerNames', 'ownerIDs', 'guestName', 'guestID', 'guestNames', 'guestIDs', 'propertyAddr', 'dealPrice', 'dealPriceUpper','companyNames','guestStoreRegisterCode','signDate']
  if(onlyReadDom.length>0){
    onlyReadDom.forEach((element,index) => {
      if(readonlyArr.includes(readonlyItem)){
        if(readonlyItem==='companyNames') {
          element.innerHTML=msg[readonlyItem][0]
        }else if(readonlyItem==='propertyAddr'){
          element.innerHTML=msg[readonlyItem]
          document.querySelector(`*[extendparam=val22]`).innerHTML=msg[readonlyItem]
          document.querySelector(`*[extendparam=val22]`).classList.remove('input-before')
        }else if(readonlyItem==='signDate'&& msg["signDate"]){
          let time = new Date(Number(msg["signDate"]));
          let y = time.getFullYear();
          let M = time.getMonth() + 1;
          let D = time.getDate();
          let signDate = `${y}年${M}月${D}日`
          element.innerHTML = signDate
        }else {
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
  if(attr==='houseUse'){
    let checkIO={
      4: ['val34'],
    }
    boxArray.forEach((item,i)=>{
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if(item===obj.currentTarget){
        if(item.querySelector('p').getAttribute('checked')){
          if(i===4){
            contractConfig.initForm(checkIO[4],0)
          }else {
            contractConfig.initForm(checkIO[4],1)
          }
        }else{
          contractConfig.initForm(checkIO[4],1)
        }
      }
    })
  }else if(attr==='payment'){
    let checkIO={
      0: ['val56'],
      1: ['val58','val60','val61','checkbox_loan','val62'],
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
  }else if(attr==='negotiation'){
    let checkIO={
      0: ['checkbox_rights','val82'],
      1: ['checkbox_debt'],
    }
    boxArray.forEach((item,i)=>{
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if(item===obj.currentTarget){
        if(!item.querySelector('p').getAttribute('checked')){
          contractConfig.initForm(checkIO[i],1)
        }else{
          contractConfig.initForm(checkIO[i],0)
        }
      }
    })
  }else if(attr==='rights'){
    let checkIO={
      5: ['val82'],
    }
    boxArray.forEach((item,i)=>{
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if(item===obj.currentTarget){
        if(item.querySelector('p').getAttribute('checked')){
          if(i===5){
            contractConfig.initForm(checkIO[5],0)
          }else {
            contractConfig.initForm(checkIO[5],1)
          }
        }else{
          contractConfig.initForm(checkIO[5],1)
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
        let index = toChineseNumber(ev.target.value).indexOf('元')
        document.querySelector(`*[extendparam=${cn_str}_add]`).innerHTML = toChineseNumber(ev.target.value).substring(0,index)
      }
    }
  },function(tip){
    //获取输入框的默认值
    let initVal=tip.target.innerHTML
    let strCn = tip.target.getAttribute('extendparam')
    if(Obj['cn_arr'].includes(strCn)){
      if(initVal.length>0){
        let index = toChineseNumber(initVal).indexOf('元')
        document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal).substring(0,index)
      }else{
        document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
      }
    }
  })
