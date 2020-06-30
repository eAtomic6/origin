import {contractConfig,toChineseNumber} from "./base.js"

let sub = {
  'val5':null,
  'val7':null,
  'checkbox_manage':null,
  'time_val16': null,
  'val17':null,
  'val20': null,
  'checkbox_pay':{
    stateful:function (index) {
      if(index===2){
        return {'val35':null}
      }else{
        return null;
      }
    }
  },
  'val37': null,
  'checkbox_person':null
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

//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
for(let readonlyItem in msg){
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
  let arr= []
  if(readonlyItem==='signDate'){
    let time = new Date(msg.signDate)
    arr.push(time.getFullYear())
    arr.push(time.getMonth()+1)
    arr.push(time.getDate())
  }else if(readonlyItem==='propertyAddr'){
    let elementCell=document.querySelector('*[extendParam=val7]')
    elementCell.innerHTML=msg[readonlyItem].replace(/\s/g,'')
    elementCell.classList.remove('input-before')
  }else if(readonlyItem==='companyNames'){
    if(msg[readonlyItem].length>0){
      let elementCell=document.querySelector('*[extendParam=val5]')
      elementCell.innerHTML=msg[readonlyItem]
      elementCell.classList.remove('input-before')
    }
  }
  if(onlyReadDom.length>0){
    onlyReadDom.forEach((element,index) => {
      if(readonlyItem==='signDate'){
        element.setAttribute('value', arr[index])
      }else if(readonlyItem==='ownerName'){
        if(msg['ownerNames']){
          let names = msg['ownerName']+'、'+msg['ownerNames']
          element.innerHTML = names
        }else{
          element.innerHTML = msg['ownerName']
        }
      }else if(readonlyItem==='guestName'){
        if(msg['guestNames']){
          let names = msg['guestName']+'、'+msg['guestNames']
          element.innerHTML = names
        }else{
          element.innerHTML = msg['guestName']
        }
      }else{
        element.innerHTML=msg[readonlyItem]
        element.setAttribute('value', msg[readonlyItem])
        element.classList.remove('input-before')
      }
    });
  }
}

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
  }
  if(spanAttr==='chinese'){
    ev.target.value=ev.target.value.replace(/[^\d]/g, "")
    tip.target.innerHTML = toChineseNumber(ev.target.value).split("元")[0]
  }
})

//勾选框
contractConfig.checkboxListener(function (el,index) {
  if(el.currentTarget.getAttribute('name')==='pay'){
    let inputCell=document.querySelector('*[extendparam=val35]')
    if([0,1].includes(index)){
      inputCell.setAttribute('systemParam',true)
    }else {
      inputCell.removeAttribute('systemParam')
    }
    inputCell.innerHTML=''
    inputCell.classList.add('input-before')
  }
})
