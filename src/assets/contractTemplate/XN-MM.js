import {contractConfig,toChineseNumber} from "./base.js"

let Obj={
    part3:['val52','val55','val55_add','val56','val58','val60','val60_add','val62','val62_add','val63','val65','val65_add','val66','val68','val68_add','val70'],
    part5:['val93','val94'],
    part6:['val102','val105','val105_add','val108','val108_add','val110'],
    part7:['val116','val117','val118','val120'],
    cn_arr:['val42','val55','val60','val62','val65','val68','val105','val108','val122']
  }

  let sub = {
    val30:null,
    val32:null,
    val35:null,
    val38:null,
    val40:null,
    val42:null,
    /*val45:null,
    val46:null,
    val48:null,*/
    drapdown_pay: {
      stateful: function (val) {
        let res = null;
        switch (val) {
          case '(一)':
            res = {'time_val52': null,'val55': null};
            break;
          case '(二)':
            res = {'time_val56': null,'val58': null,'val60': null,'val62': null};
            break;
          case '(三)':
            res = {'time_val63': null,'val65': null,'val66': null,'val68': null,'val70': null};
            break
        }
        return res;
      }
    },
    val90:null,
    /*drapdown_handle: {
      stateful: function (val) {
        let res = null;
        switch (val.toLowerCase()) {
          case 'a':
            res = {'val93': null};
            break;
          case 'b':
            res = {'val94': null};
            break;
        }
        return res;
      }
    },*/
    drapdown_deal: {
      stateful: function (val) {
        let res = null;
        switch (val.toLowerCase()) {
          case 'a':
            break;
          case 'b':
            break;
          case 'c':
            res = {'time_val102': null,'val105': null,'val108': null,'val110': null};
            break;
        }
        return res;
      }
    },
    val111:null,
    val112:null,
    drapdown_solve: {
      stateful: function (val) {
        let res = null;
        switch (val) {
          case '1':
            break;
          case '2':
            res = {'val116': null}
            break;
          case '3':
            res = {'val117': null,'val118': null};
            break;
          case '4':
            res = {'val120': null}
            break;
        }
        return res;
      }
    },
    val122:null,
    val125:null
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
        contractConfig.initForm(Obj[attr==='pay'?'part3':attr==='handle'?'part5':attr==="deal"?'part6':'part7'],0)
        if(attr==='pay'){
          contractConfig.prohibit(bindElem,['(一)','(二)','(三)'],'pay')
        }
        if(attr==='deal'){
          contractConfig.prohibit(bindElem,['a','b','c'],'deal')
        }
        if(attr==='solve'){
          contractConfig.prohibit(bindElem,['1','2','3','4'],'solve')
        }
        if(attr==='handle'){
          contractConfig.prohibit(bindElem,['a','b'],'handle')
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
/*let msg={
  companyBanks:{
    bankAccountName: "何江",
    bankBranchName: "—",
    bankCard: "6230334001007090568",
    id: 657,
    storeId: 50235,
    storeName: "小金鱼小队"
  }
}*/
for(let readonlyItem in msg){
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
  let arr= []
  if(readonlyItem==='signDate'){
    let time = new Date(msg.signDate)
    arr.push(time.getFullYear())
    arr.push(time.getMonth()+1)
    arr.push(time.getDate())
  }

  let readonlyArr = ['ownerName','ownerID','ownerNames','ownerIDs','guestName','guestID','guestNames','guestIDs','propertyAddr','dealPriceUpper','square','companyBanks']
  if(onlyReadDom.length>0){
    onlyReadDom.forEach((element,index) => {
      if(readonlyItem==='signDate'){
         element.setAttribute('value', arr[index])
      }else if(readonlyArr.includes(readonlyItem)){
        if(element.getAttribute("extendParam")==="val25"){
            let value = msg["propertyAddr"]
            if(value.substring(0,3)==="咸宁市"){
                element.innerHTML=value.replace("咸宁市",'')
            }else{
                element.innerHTML=value
            }
        }else if(element.getAttribute("extendParam")==="val45"){
          let value = msg["companyBanks"]
          element.innerHTML=value&&value.bankAccountName
        }else if(element.getAttribute("extendParam")==="val46"){
          let value = msg["companyBanks"]
          element.innerHTML=value&&(value.bankBranchName==='—'?'':value.bankBranchName)
        }else if(element.getAttribute("extendParam")==="val48"){
          let value = msg["companyBanks"]
          element.innerHTML=value&&value.bankCard
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
