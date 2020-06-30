import {contractConfig,toChineseNumber} from "./base.js"

let Obj={
    part4:['val48','val49','val50','val51','val51_add','val52','val52_add','val53','val54','val55','val56','val56_add','val57','val58','val58_add','val59',
    'val59_add','val60','val61','val62','val63','val63_add','val64','val64_add','val65','val66','val67','val68','val68_add','val69','val70','val70_add','val71','val71_add'],
    part5:['val81','val82'],
    part6:['val90'],
    cn_arr:['val43','val51','val52','val56','val58','val59','val63','val64','val68','val70','val71',
    'val72','val73','val76','val93']
  }

  let sub = {
    // 'val5': null,
    // 'val6': null,
    // 'val11': null,
    // 'val12': null,
    'val13': null,
    'checkbox_houseType': null,
    'val26': null,
    'val30': null,
    'checkbox_houseUse': {
      stateful: function(index) {
        return index===6?{'val32': null} : null
      }
    },
    'val35': null,
    'val36': null,
    'val38': null,
    'val40': null,
    'val43': null,
    'val45': null,
    'drapdown_pay': {
      stateful: function (val) {
        let res = null;
        switch (val) {
          case 'a':
            res = {'val48': null,'val49': null,'val50': null,'val51': null,'val52': null};
            break;
          case 'b':
            res = {'val53': null,'val54': null,'val55': null,'val56': null,'val57': null,'val58': null,'val59': null};
            break;
          case 'c':
            res = {'val60': null,'val61': null,'val62': null,'val63': null,'val64': null};
            break
          case 'd':
            res = {'val65': null,'val66': null,'val67': null,'val68': null,'val69': null,'val70': null,'val71': null};
            break;
        }
        return res;
      }
    },
    'drapdown_delivery': {
      stateful: function (val) {
        let res = null;
        switch (val) {
          case '1':
            res = {'val81': null};
            break;
          case '2':
            res = {'val82': null};
            break;
        }
        return res;
      }
    },
    'val85': null,
    'val86': null,
    'drapdown_taxAgree': {
      stateful: function (val) {
        let res = null;
        switch (val) {
          case '1':
            break;
          case '2':
            break;
          case '3':
            break;
          case '4':
            res = {'val90': null};
            break;
        }
        return res;
      }
    },
    'val92': null,
    'val93': null,
    'val94': null,
    'val95': null,
    'val96': null,
    'val100': null
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
      let attr = bindElem.getAttribute('inputmethod')
      if(attr){
        contractConfig.initForm(Obj[attr==='pay'?'part4':attr==='delivery'?'part5':'part6'],0)
        if(attr==='pay'){
          contractConfig.prohibit(bindElem,['a','b','c','d'],'pay')
        }
        if(attr==='delivery'){
          contractConfig.prohibit(bindElem,['1','2'],'delivery')
        }
        if(attr==='taxAgree'){
          contractConfig.prohibit(bindElem,['1','2','3','4'],'taxAgree')
        }
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
for(let readonlyItem in msg){
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
  let arr= []
  if(readonlyItem==='signDate'){
    let time = new Date(msg.signDate)
    arr.push(time.getFullYear())
    arr.push(time.getMonth()+1)
    arr.push(time.getDate())
  }

  let readonlyArr = ['ownerName','ownerID','ownerNames','ownerIDs','guestName','guestID','guestNames','guestIDs','propertyAddr','dealPrice','dealPriceUpper','square']
  if(onlyReadDom.length>0){
    onlyReadDom.forEach((element,index) => {
      if(readonlyItem==='signDate'){
         element.setAttribute('value', arr[index])
      }else if(readonlyItem==="companyNames"){
        element.innerHTML=msg[readonlyItem][0]
        element.classList.remove('input-before')
      }
      else if(readonlyArr.includes(readonlyItem)){
        if(element.getAttribute("extendParam")==="val25"){
            let value = msg["propertyAddr"]
            if(value.substring(0,3)==="芜湖市"){
                element.innerHTML=value.replace("芜湖市",'')
            }else{
                element.innerHTML=value
            }
        }else{
            element.innerHTML=msg[readonlyItem]
        }
        element.classList.remove('input-before')
      }else{
        element.value=msg[readonlyItem]
        element.setAttribute('value', msg[readonlyItem])
      }
    })
  }
}

// 勾选框逻辑
contractConfig.checkboxListener(function(){},function(obj,index){
  let attr = obj.currentTarget.getAttribute('name')
  if(attr == 'houseUse') {
    let boxArray = document.getElementsByName(attr);
    let _val32 = document.querySelector(`span[extendparam="val32"]`)
    for(let i = 0; i < boxArray.length; i++) {
      if(boxArray[i] == obj.currentTarget) {
        if(boxArray[i].querySelector('p').getAttribute('checked')==='true') {
          if(i==boxArray.length-1) {
            _val32.removeAttribute('systemParam')
          } else {
            _val32.innerHTML = ''
            _val32.classList.add("input-before")
            _val32.setAttribute('systemParam','true')
          }
        } else {
          _val32.innerHTML = ''
          _val32.classList.add("input-before")
          _val32.removeAttribute('systemParam')
        }
      }
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
        document.querySelector(`*[extendparam=${cn_str}_add]`).innerHTML = toChineseNumber(ev.target.value).split('元')[0]
      }
    }
  },function(tip){
    //获取输入框的默认值
    let initVal=tip.target.innerHTML
    let strCn = tip.target.getAttribute('extendparam')
    if(Obj['cn_arr'].includes(strCn)){
      if(initVal.length>0){
        document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal).split('元')[0]
      }else{
        document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
      }
    }
  })
