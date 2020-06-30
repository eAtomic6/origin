import {contractConfig,toChineseNumber} from "./base.js";

let Obj = {
  cn_arr: []
}

let sub = {
  "val1": null,
}

//给按钮添加点击事件
let mainBtn=document.querySelector('#submit');
if(mainBtn){
  mainBtn.addEventListener('click',function(e){
    contractConfig.submit(e,sub)
  })
}else{
  let btn=document.createElement('span')
  btn.id='submit'
  btn.style.display='none'
  btn.innerHTML='click'
  document.body.appendChild(btn)
  btn.addEventListener('click',function(e){
    contractConfig.submit(e,sub)
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
    }else{
      bindElem.innerHTML = dateObj.value
      bindElem.classList.remove('input-select')
      bindElem.classList.remove('input-before')
    }
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

//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
for(let readonlyItem in msg){
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
  if(readonlyItem==="companyNames"){
    if(msg[readonlyItem].length>0){
      let companyName = document.querySelector(`*[extendParam="val1"]`)
      // let companyNameTxt = msg[readonlyItem].join(',')
      // companyName.setAttribute('list',companyNameTxt)
      companyName.innerHTML=msg[readonlyItem][0]
    }
  }
  let readonlyArr = ['code','ownerName','ownerNames','guestName','guestNames','propertyAddr','ownerCommission','ownerCommissionUpper','custCommission','custCommissionUpper']
  if(onlyReadDom.length>0){
    onlyReadDom.forEach((element,index) => {
      if(readonlyArr.includes(readonlyItem)){
        element.innerHTML=msg[readonlyItem]
        element.classList.remove('input-before')
      }
    })
  }
}
