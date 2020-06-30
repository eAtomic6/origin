import {contractConfig,toChineseNumber} from "./base.js"
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

Calendar.create({
  classN: 'calendar-item',
  callBack: function(bindElem, dateObj) {
      // bindElem.innerHTML = dateObj.year + '-' + dateObj.month + '-' + dateObj.date;
      if(bindElem.tagName.toLowerCase()==='input'){
          bindElem.value=`${dateObj.year}年${dateObj.month}月${dateObj.date}日`
          bindElem.setAttribute('value',bindElem.value)
          bindElem.setAttribute('random',dateObj.random)
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
    let toChineseArr = ['val1','val2','val3','val4']
    let chineseStr = tip.target.getAttribute('extendparam')
    if(toChineseArr.includes(chineseStr)){
        document.querySelector(`*[extendparam=${chineseStr}_add]`).innerHTML = toChineseNumber(ev.target.value).split('元')[0]
    }
  }
  if(spanAttr==='chinese'){
    ev.target.value=ev.target.value.replace(/[^\d]/g, "")
    if(ev.target.value.length>0){
    let str = toChineseNumber(ev.target.value)
    let value=str.split('元')[0]
    tip.target.innerHTML=value
    }else {
    tip.target.innerHTML=''
    tip.target.classList.add('input-before')
    }
  }else {
    tip.target.innerHTML=ev.target.value
  }
},function(tip){
  //获取输入框的默认值
  let initVal=tip.target.innerHTML
  let ArrCn = ['val1','val2','val3','val4']
  let strCn = tip.target.getAttribute('extendparam')
  if(ArrCn.includes(strCn)){
    if(initVal.length>0){
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal)
   }else{
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
   }
   }
})

// 勾选框逻辑
contractConfig.checkboxListener()

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

  let sub = {
    'checkbox_zhizhao4':null,
    'checkbox_zhizhao5':null,
    'val1': null,
    'val2': null,
    'val3': null,
    'val4': null,
    'checkbox_zhizhao6':null
  }
//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
// let msg={
//   code: "S0001191107007",
//   companyNames: ["金银湖三级门店哦"],
//   guestCardType: "军官证",
//   guestCardTypes: "",
//   guestID: "132",
//   guestIDs: "",
//   guestName: "然爱迪生",
//   guestNames: "",
//   guestTel: "13011111111",
//   guestTels: "",
//   id: 3354,
//   isentrust: 1,
//   ownerCardType: "营业执照",
//   ownerCardTypes: "",
//   ownerID: "123",
//   ownerIDs: "",
//   ownerName: "熊先",
//   ownerNames: "",
//   ownerTel: "18888888888",
//   ownerTels: "",
//   propertyAddr: "a市b区c",
//   singleCompany: "",
// }
for(let readonlyItem in msg){
    let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
    let arr= []
    if(onlyReadDom.length>0){
  onlyReadDom.forEach((element,index) => {
     if(readonlyItem==='code'){
        element.value=msg[readonlyItem]
        element.setAttribute('value', msg[readonlyItem])
    }else{
        element.innerHTML=msg[readonlyItem]
        element.classList.remove('input-title')
        element.classList.remove('input-title2')
        element.classList.remove('input-before')
    }
});

        // onlyReadDom.forEach((element,index) => {
           
        //         element.innerHTML=msg[readonlyItem]
        //         element.classList.remove('input-title')
        //         element.classList.remove('input-title2')
        //         element.classList.remove('input-before')
        //     })
        }
}