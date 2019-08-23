import {contractConfig,toChineseNumber} from "./base.js"

let obj = {
    val3:'',
    val4:'',
    val5:'',
    val6:'',
    val8:'',
    val10:''
}

let Obj1 = {
    val3:'',
    val5:'',
    val6:'',
    val8:'',
    val10:''
}
let errorArr=[]
function submit() {
    errorArr=[]
    for(let item in Obj1){
    let classList = Array.from(document.querySelector(`*[extendparam=${item}]`).classList)
    if(classList.includes('dropdown-item')||classList.includes('calendar-item')){
        if(item==='val3'){
            Obj1[item]=document.querySelector(`span[extendparam=${item}]`).innerHTML
        }else{
            Obj1[item]=document.querySelector(`input[extendparam=${item}]`).value
        }
        document.querySelector(`*[extendparam=${item}]`).classList.remove('BODERRED')
    }else{
        Obj1[item]=document.querySelector(`span[extendparam=${item}]`).innerHTML
        document.querySelector(`span[extendparam=${item}]`).classList.remove('BODERRED')
    }
    if(Obj1[item].length===0){
        errorArr.push({
        type:'input',
        name:item
        })
        break
    }
    }
    sessionStorage.setItem('templateError',JSON.stringify(errorArr))
    return errorArr
}
//给按钮添加点击事件
let mainBtn=document.querySelector('#submit');
if(mainBtn){
    mainBtn.addEventListener('click',submit)
}else{
    let btn=document.createElement('span')
    btn.id='submit'
    btn.style.display='none'
    btn.innerHTML='click'
    document.body.appendChild(btn)
    btn.addEventListener('click',submit)
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
        if(bindElem.tagName.toLowerCase()==='span'){
            bindElem.innerHTML = dateObj.value
            bindElem.classList.remove('input-select')
            bindElem.classList.remove('input-before')
        }
    }
})

let inputbox = document.querySelectorAll("input[tag='input']")
for (let i = 0; i < inputbox.length; i++) {
    if(document.addEventListener){
        inputbox[i].addEventListener('change', function () {
            let addrReg=/\?|\？|\*|\"|\“|\”|\'|\‘|\’|\{|\}|\[|\]|\【|\】|\：|\:|\^|\$|\&|\!|\~|\`|\|/g
            let inputValue = this.value
            inputValue=inputValue.replace(/</g,"＜").replace(/>/g,"＞").replace(addrReg,'')
            this.setAttribute('value', inputValue)
            this.value = inputValue
        })
    }else {
        inputbox[i].attachEvent('onchange', function (e) {
            this.setAttribute('value', this.value.replace(/</g,"＜").replace(/>/g,"＞"))
        })
    }
}

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
    if(readonlyItem==="companyNames"){
        if(msg[readonlyItem].length>0){
            let companyName = document.querySelector(`*[extendParam="val3"]`)
            let companyNameTxt = msg[readonlyItem].join(',')
            companyName.setAttribute('list',companyNameTxt)
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
            }else if(readonlyItem==='propertyAddr'){
                if(element.getAttribute("extendParam")==="val4"){
                    let value = msg["propertyAddr"]
                    if(value.substring(0,3)==="合肥市"){
                        element.innerHTML=value.replace("合肥市",'')
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
        let toChineseArr = ['val6','val8']
        let chineseStr = tip.target.getAttribute('extendparam')
        if(toChineseArr.includes(chineseStr)){
            document.querySelector(`*[extendparam=${chineseStr}_add]`).innerHTML = toChineseNumber(ev.target.value)
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
    let ArrCn = ['val6','val8']
    let strCn = tip.target.getAttribute('extendparam')
    if(ArrCn.includes(strCn)){
        if(initVal.length>0){
            document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal)
        }else{
            document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
        }
    }
})