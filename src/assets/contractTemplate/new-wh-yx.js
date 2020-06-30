import {contractConfig,toChineseNumber} from "./base.js"

let sub = {
  'val3':null,
  'val4':null,
  'val5':null,
  'val8':null,
  'val12':null,
  'val13':null,
  'val14':null,
  'val15':null,
  'val16':null,
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
    ['val5','val14'].forEach(item=>{
      let elementCell=document.querySelector(`*[extendParam=${item}]`)
      elementCell.innerHTML=msg[readonlyItem].replace(/\s/g,'')
      elementCell.classList.remove('input-before')
    })
  }else if(readonlyItem==='companyNames'){
    if(msg[readonlyItem].length>0){
      let elementCell=document.querySelector('*[extendParam=val3]')
      elementCell.innerHTML=msg[readonlyItem]
      elementCell.classList.remove('input-before')
    }
  }else if(readonlyItem==='ownerName'){
    if(msg[readonlyItem].length>0){
      let elementCell=document.querySelector('*[extendParam=val4]')
      elementCell.innerHTML=msg[readonlyItem]
      elementCell.classList.remove('input-before')
      elementCell.setAttribute('systemParam',true)
    }
  }else if(readonlyItem==='guestID'){
    if(msg[readonlyItem].length>0){
      let elementCell=document.querySelector('*[extendParam=val15]')
      elementCell.innerHTML=msg[readonlyItem]
      elementCell.classList.remove('input-before')
      elementCell.setAttribute('systemParam',true)
    }
  }
  if(onlyReadDom.length>0){
    onlyReadDom.forEach((element,index) => {
      element.innerHTML=msg[readonlyItem]
      element.setAttribute('value', msg[readonlyItem])
      element.classList.remove('input-before')
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

