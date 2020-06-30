import {contractConfig,toChineseNumber} from "./base.js"

let sub = {
    'val3':null,
    'time_val5': null,
    'val8': null,
    'val10': null
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
            }else if(readonlyItem==='companyNames'){
                if(msg[readonlyItem].length>0){
                    element.innerHTML=msg[readonlyItem][0]
                    element.classList.remove('input-before')
                  }
            }else if(readonlyItem==='propertyAddr'){
                if(element.getAttribute("extendParam")==="val4"){
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
            }else if(readonlyItem==='ownerCommission'||readonlyItem==='ownerCommissionUpper'||readonlyItem==='custCommission'||readonlyItem==='custCommissionUpper'){
                element.innerHTML=msg[readonlyItem]
            }else{
                element.value=msg[readonlyItem]
                element.setAttribute('value', msg[readonlyItem])
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
        let toChineseArr = ['val8']
        let chineseStr = tip.target.getAttribute('extendparam')
        if(toChineseArr.includes(chineseStr)){
            document.querySelector(`*[extendparam=${chineseStr}_add]`).innerHTML = toChineseNumber(ev.target.value).split('元')[0]
        }
    }
},function(tip){
    //获取输入框的默认值
    let initVal=tip.target.innerHTML
    let ArrCn = ['val8']
    let strCn = tip.target.getAttribute('extendparam')
    if(ArrCn.includes(strCn)){
        if(initVal.length>0){
            document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal).split('元')[0]
        }else{
            document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
        }
    }
})
